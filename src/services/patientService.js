import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';


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

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
};
