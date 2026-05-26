import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Validate input
            if (!data.email || !data.doctorId || !data.timeType
                || !data.date || !data.fullName || !data.selectedGender
                || !data.address || !data.phoneNumber) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }

            // Check maximum booking limit (5 per time slot)
            let countBooking = await db.Booking.count({
                where: {
                    doctorId: data.doctorId,
                    date: data.date,
                    timeType: data.timeType,
                    statusId: {
                        [Op.ne]: 'S4'
                    }
                }
            });

            if (countBooking >= 5) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Khung giờ này đã nhận đủ tối đa 5 bệnh nhân. Vui lòng chọn thời gian khác!'
                });
            }

            // Generate token BEFORE saving to DB
            let token = uuidv4();

            // upsert patient
            let userData = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3',
                    address: data.address,
                    gender: data.selectedGender,
                    phonenumber: data.phoneNumber,
                    firstName: data.fullName
                }
            });
            let user = userData[0];

            // Update user info if they already exist but have missing fields
            if (!userData[1]) {
                let needsUpdate = false;
                if (!user.phonenumber && data.phoneNumber) { user.phonenumber = data.phoneNumber; needsUpdate = true; }
                if (!user.gender && data.selectedGender) { user.gender = data.selectedGender; needsUpdate = true; }
                if (!user.address && data.address) { user.address = data.address; needsUpdate = true; }
                if (!user.firstName && data.fullName) { user.firstName = data.fullName; needsUpdate = true; }
                
                if (needsUpdate) {
                    await user.save();
                }
            }

            // Prevent multiple bookings on the same day with the same doctor
            let existingDayBooking = await db.Booking.findOne({
                where: {
                    patientId: user.id,
                    doctorId: data.doctorId,
                    date: data.date,
                    statusId: {
                        [Op.in]: ['S1', 'S2', 'S3']
                    }
                }
            });

            if (existingDayBooking) {
                return resolve({
                    errCode: 4,
                    errMessage: 'Bạn đã có lịch hẹn với bác sĩ này trong ngày hôm nay. Vui lòng không đặt trùng!'
                });
            }

            // Check duplicate booking
            let bookingData = await db.Booking.findOrCreate({
                where: {
                    patientId: user.id,
                    doctorId: data.doctorId,
                    date: data.date,
                    timeType: data.timeType
                },
                defaults: {
                    statusId: 'S1',
                    doctorId: data.doctorId,
                    patientId: user.id,
                    date: data.date,
                    timeType: data.timeType,
                    token: token
                }
            });

            let created = bookingData[1];

            if (!created) {
                return resolve({
                    errCode: 2,
                    errMessage: 'You have already booked this appointment!'
                });
            }


            // Send email
            await emailService.sendSimpleEmail({
                receiverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token)
            });

            return resolve({
                errCode: 0,
                errMessage: 'Booking appointment successfully'
            });

        } catch (e) {
            console.log('Error in postBookAppointment: ', e);
            return resolve({
                errCode: -1,
                errMessage: 'Error from server',
                error: e
            });
        }
    });
};

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Validate input
            if (!data.token || !data.doctorId) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: "Appointment update successful!"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment already exists or does not exist!"
                    })
                }
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getAllBookings = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let whereClause = {};
            if (data.date) whereClause.date = data.date;
            if (data.patientId) whereClause.patientId = data.patientId;

            if (data.patientEmail) {
                let patient = await db.User.findOne({
                    where: { email: data.patientEmail }
                });
                if (patient) {
                    whereClause.patientId = patient.id;
                } else {
                    return resolve({
                        errCode: 0,
                        errMessage: 'Get all bookings successfully',
                        data: []
                    });
                }
            }

            let bookings = await db.Booking.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: {
                            exclude: ['password']
                        }
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    },
                    {
                        model: db.Allcode,
                        as: 'timeTypeDataPatient',
                        attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.Allcode,
                        as: 'statusData',
                        attributes: ['valueEn', 'valueVi']
                    }
                ],
                order: [['createdAt', 'DESC']],
                raw: false,
                nest: true
            });

            // Add doctor name from Doctor_Infor if needed
            for (let booking of bookings) {
                if (booking.doctorData) {
                    booking.doctorName = `${booking.doctorData.lastName} ${booking.doctorData.firstName}`;
                }
            }

            resolve({
                errCode: 0,
                errMessage: 'Get all bookings successfully',
                data: bookings
            });
        } catch (e) {
            reject(e);
        }
    });
};

let updateBookingStatus = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.bookingId || !data.statusId) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }

            let booking = await db.Booking.findOne({
                where: { id: data.bookingId },
                raw: false
            });

            if (booking) {
                booking.statusId = data.statusId;
                await booking.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update booking status successfully'
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Booking not found'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getPatientHistory = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing patientId'
                });
            }
            let data = await db.History.findAll({
                where: { patientId: patientId },
                order: [['createdAt', 'DESC']]
            });
            resolve({
                errCode: 0,
                errMessage: 'Get history successfully',
                data: data
            });
        } catch (e) {
            reject(e);
        }
    });
};

let savePatientHistory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.patientId || !data.doctorId || !data.description) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }
            await db.History.create({
                patientId: data.patientId,
                doctorId: data.doctorId,
                description: data.description,
                files: data.files || ''
            });

            resolve({
                errCode: 0,
                errMessage: 'Save medical record successful!'
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAllBookings: getAllBookings,
    updateBookingStatus: updateBookingStatus,
    getPatientHistory: getPatientHistory,
    savePatientHistory: savePatientHistory
};
