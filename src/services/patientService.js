import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

    return result;
}

let autoCancelExpiredBookings = async () => {
    try {
        let fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        await db.Booking.update({
            statusId: 'S4' // Cancelled
        }, {
            where: {
                statusId: 'S1',
                createdAt: { [Op.lt]: fiveMinutesAgo }
            }
        });
    } catch (e) {
        console.error('Error in autoCancelExpiredBookings:', e);
    }
};

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await autoCancelExpiredBookings();

            // Validate input
            if (!data.email || !data.doctorId || !data.timeType
                || !data.date || !data.fullName || !data.selectedGender
                || !data.address || !data.phoneNumber) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }

            // Check if the booking date/time is in the past
            let timeCode = await db.Allcode.findOne({
                where: { keyMap: data.timeType, type: 'TIME' }
            });
            if (timeCode) {
                let timeStr = timeCode.valueVi; // e.g. "8:00 - 9:00"
                let selectedDate = new Date(Number(data.date));
                selectedDate.setHours(0, 0, 0, 0);

                let today = new Date();
                today.setHours(0, 0, 0, 0);

                let isPast = false;
                if (selectedDate.getTime() < today.getTime()) {
                    isPast = true;
                } else if (selectedDate.getTime() === today.getTime()) {
                    if (timeStr) {
                        let parts = timeStr.split('-');
                        if (parts.length > 0) {
                            let startPart = parts[0].trim();
                            let timeParts = startPart.split(':');
                            if (timeParts.length === 2) {
                                let hour = parseInt(timeParts[0], 10);
                                let minute = parseInt(timeParts[1], 10);

                                let slotTime = new Date();
                                slotTime.setHours(hour, minute, 0, 0);

                                if (new Date().getTime() > slotTime.getTime()) {
                                    isPast = true;
                                }
                            }
                        }
                    }
                }

                if (isPast) {
                    return resolve({
                        errCode: 4,
                        errMessage: 'Không thể đặt lịch khám cho khung giờ đã qua!'
                    });
                }
            }



            // Generate token BEFORE saving to DB
            let token = uuidv4();

            // upsert patient
            let userData = await db.User.findOrCreate({
                where: { 
                    email: data.email,
                    firstName: data.fullName
                },
                defaults: {
                    email: data.email,
                    roleId: 'R3',
                    address: data.address,
                    gender: data.selectedGender,
                    phonenumber: data.phoneNumber,
                    firstName: data.fullName,
                    birthday: data.birthday
                }
            });
            let user = userData[0];

            // Update user info if they already exist but have different/new fields
            if (!userData[1]) {
                let updateData = {};
                if (data.phoneNumber && String(user.phonenumber) !== String(data.phoneNumber)) {
                    updateData.phonenumber = data.phoneNumber;
                }
                if (data.selectedGender && String(user.gender) !== String(data.selectedGender)) {
                    updateData.gender = data.selectedGender;
                }
                if (data.address && String(user.address) !== String(data.address)) {
                    updateData.address = data.address;
                }
                if (data.birthday && String(user.birthday) !== String(data.birthday)) {
                    updateData.birthday = data.birthday;
                }
                
                if (Object.keys(updateData).length > 0) {
                    await db.User.update(updateData, {
                        where: { id: user.id }
                    });
                    Object.assign(user, updateData);
                }
            }

            let fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

            // Prevent booking conflicting/overlapping appointments for the same patient at the same date and time slot
            let conflictingBooking = await db.Booking.findOne({
                where: {
                    patientId: user.id,
                    date: data.date,
                    timeType: data.timeType,
                    [Op.or]: [
                        { statusId: { [Op.in]: ['S2', 'S3'] } },
                        {
                            statusId: 'S1',
                            createdAt: { [Op.gte]: fiveMinutesAgo }
                        }
                    ]
                }
            });

            if (conflictingBooking) {
                if (Number(conflictingBooking.doctorId) === Number(data.doctorId)) {
                    return resolve({
                        errCode: 4,
                        errMessage: 'Bạn đã có lịch hẹn vào khung giờ này với bác sĩ này!'
                    });
                } else {
                    return resolve({
                        errCode: 4,
                        errMessage: 'Bạn đã có một lịch hẹn khác vào cùng khung giờ này trong ngày hôm nay. Vui lòng chọn khung giờ khác!'
                    });
                }
            }

            // Check if doctor's schedule has reached its maximum patient capacity
            let schedule = await db.Schedule.findOne({
                where: {
                    doctorId: data.doctorId,
                    date: data.date,
                    timeType: data.timeType
                },
                raw: true
            });

            // Enforce exactly 5 patients capacity per time slot
            let maxCapacity = 5;

            // Count existing bookings for this doctor, date, and time slot
            let bookingCount = await db.Booking.count({
                where: {
                    doctorId: data.doctorId,
                    date: data.date,
                    timeType: data.timeType,
                    [Op.or]: [
                        { statusId: { [Op.in]: ['S2', 'S3'] } },
                        {
                            statusId: 'S1',
                            createdAt: { [Op.gte]: fiveMinutesAgo }
                        }
                    ]
                }
            });

            if (bookingCount >= maxCapacity) {
                return resolve({
                    errCode: 3,
                    errMessage: `Khung giờ này đã nhận đủ tối đa ${maxCapacity} bệnh nhân. Vui lòng chọn thời gian khác!`
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
                    statusId: data.statusId || 'S1',
                    doctorId: data.doctorId,
                    patientId: user.id,
                    date: data.date,
                    timeType: data.timeType,
                    token: token,
                    reason: data.reason
                }
            });

            let created = bookingData[1];

            if (!created) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Bạn đã có lịch hẹn vào khung giờ này với bác sĩ này!'
                });
            }

            // Update currentNumber in Schedule if it exists
            if (schedule) {
                await db.Schedule.update(
                    { currentNumber: (schedule.currentNumber || 0) + 1 },
                    {
                        where: {
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType
                        }
                    }
                );
            }

            // Send email
            if (!data.skipEmail) {
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });
            }

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
                    let fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                    if (new Date(appointment.createdAt) < fiveMinutesAgo) {
                        appointment.statusId = 'S4'; // Cancel the booking
                        await appointment.save();
                        return resolve({
                            errCode: 3,
                            errMessage: "Liên kết xác nhận đã hết hạn (quá 5 phút). Vui lòng đặt lại lịch hẹn mới!"
                        });
                    }

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
            await autoCancelExpiredBookings();

            let whereClause = {};
            if (data.date) whereClause.date = data.date;
            if (data.patientId) whereClause.patientId = data.patientId;

            let fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            whereClause[Op.or] = [
                { statusId: { [Op.in]: ['S2', 'S3', 'S4'] } },
                {
                    statusId: 'S1',
                    createdAt: { [Op.gte]: fiveMinutesAgo }
                }
            ];

            if (data.patientEmail) {
                let patients = await db.User.findAll({
                    where: { email: data.patientEmail }
                });
                if (patients && patients.length > 0) {
                    let patientIds = patients.map(p => p.id);
                    whereClause.patientId = { [Op.in]: patientIds };
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
                        },
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                        ]
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'image'],
                        include: [
                            {
                                model: db.Doctor_Infor,
                                attributes: ['priceId', 'paymentId', 'specialtyId'],
                                include: [
                                    { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                                    { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                                    { model: db.Specialty, as: 'specialtyData', attributes: ['id', 'name'] }
                                ]
                            },
                            {
                                model: db.Doctor_Clinic_Specialty,
                                as: 'doctorSpecialties',
                                attributes: ['specialtyId'],
                                include: [
                                    { model: db.Specialty, as: 'specialtyData', attributes: ['id', 'name'] }
                                ]
                            }
                        ]
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

            // Group bookings by doctorId to compute queueNumber per doctor
            let doctorGroups = {};
            bookings.forEach(b => {
                if (!doctorGroups[b.doctorId]) {
                    doctorGroups[b.doctorId] = [];
                }
                doctorGroups[b.doctorId].push(b);
            });

            // Sort and assign queueNumber for each group
            for (let docId in doctorGroups) {
                let group = doctorGroups[docId];
                group.sort((x, y) => {
                    if (x.timeType !== y.timeType) {
                        return x.timeType.localeCompare(y.timeType);
                    }
                    return new Date(x.createdAt) - new Date(y.createdAt);
                });
                group.forEach((b, index) => {
                    b.setDataValue('queueNumber', index + 1);
                });
            }

            // Add doctor name from Doctor_Infor if needed
            for (let booking of bookings) {
                if (booking.doctorData) {
                    booking.doctorName = `${booking.doctorData.lastName} ${booking.doctorData.firstName}`;
                    if (booking.doctorData.image) {
                        try {
                            booking.doctorData.image = Buffer.from(booking.doctorData.image, 'base64').toString('binary');
                        } catch (e) {
                            console.error('Error decoding doctor image:', e);
                        }
                    }
                }
                if (booking.isPaid === 1) {
                    let history = await db.History.findOne({
                        where: {
                            patientId: booking.patientId,
                            doctorId: booking.doctorId
                        },
                        order: [['createdAt', 'DESC']],
                        raw: true
                    });
                    if (history) {
                        try {
                            let descObj = JSON.parse(history.description);
                            booking.setDataValue('price', descObj.price || '');
                            booking.setDataValue('paymentMethod', descObj.paymentMethod || '');
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            }

            bookings.sort((x, y) => {
                if (x.timeType !== y.timeType) {
                    return x.timeType.localeCompare(y.timeType);
                }
                return new Date(x.createdAt) - new Date(y.createdAt);
            });

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
                if (data.price && data.paymentMethod) {
                    booking.isPaid = 1;
                }
                if (data.weight !== undefined) booking.weight = data.weight;
                if (data.height !== undefined) booking.height = data.height;
                if (data.bloodPressure !== undefined) booking.bloodPressure = data.bloodPressure;
                if (data.temperature !== undefined) booking.temperature = data.temperature;
                if (data.symptoms !== undefined) booking.symptoms = data.symptoms;
                await booking.save();

                // If completing booking, check if we need to update/create History
                if (data.statusId === 'S3') {
                    // Try to find if there is an existing history record for this doctor and patient created recently
                    let history = await db.History.findOne({
                        where: {
                            patientId: booking.patientId,
                            doctorId: booking.doctorId,
                            createdAt: {
                                [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000) // created in last 24 hours
                            }
                        },
                        order: [['createdAt', 'DESC']],
                        raw: false
                    });

                    let priceVal = data.price;
                    let paymentVal = data.paymentMethod;

                    if (!priceVal || !paymentVal) {
                        // Load defaults from Doctor_Infor
                        let doctorInfor = await db.Doctor_Infor.findOne({
                            where: { doctorId: booking.doctorId },
                            include: [
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] }
                            ],
                            raw: true,
                            nest: true
                        });
                        if (doctorInfor) {
                            if (!paymentVal && doctorInfor.paymentTypeData) {
                                paymentVal = `${doctorInfor.paymentTypeData.valueVi} / ${doctorInfor.paymentTypeData.valueEn}`;
                            }
                            if (!priceVal && doctorInfor.priceTypeData) {
                                priceVal = `${doctorInfor.priceTypeData.valueVi} / ${doctorInfor.priceTypeData.valueEn}`;
                            }
                        }
                    }

                    if (history) {
                        // Update existing history
                        try {
                            let descObj = JSON.parse(history.description);
                            descObj.price = priceVal;
                            descObj.paymentMethod = paymentVal;
                            if (data.servicePrices) {
                                descObj.servicePrices = data.servicePrices;
                            }
                            if (data.medicinePrices) {
                                descObj.medicinePrices = data.medicinePrices;
                            }
                            history.description = JSON.stringify(descObj);
                            await history.save();
                        } catch (err) {
                            console.error("Error updating history description:", err);
                        }
                    } else {
                        // Create a history record if the doctor hasn't created one
                        let descriptionObj = {
                            diagnosis: 'Khám lâm sàng / General checkup',
                            services: 'Không có / None',
                            prescription: 'Đã hoàn tất thanh toán tại quầy',
                            price: priceVal,
                            paymentMethod: paymentVal,
                            servicePrices: data.servicePrices || {},
                            medicinePrices: data.medicinePrices || {}
                        };
                        await db.History.create({
                            patientId: booking.patientId,
                            doctorId: booking.doctorId,
                            description: JSON.stringify(descriptionObj),
                            files: ''
                        });
                    }
                }

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
                include: [
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['id', 'firstName', 'lastName', 'email'],
                        include: [
                            {
                                model: db.Doctor_Infor,
                                attributes: ['priceId', 'paymentId'],
                                include: [
                                    { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                                    { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] }
                                ]
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']],
                raw: false,
                nest: true
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

            let finalDescription = data.description;
            try {
                let descObj = JSON.parse(data.description);
                
                // Get doctor payment and price info
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: data.doctorId },
                    include: [
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] }
                    ],
                    raw: true,
                    nest: true
                });

                if (doctorInfor) {
                    if (doctorInfor.paymentTypeData) {
                        descObj.paymentMethod = `${doctorInfor.paymentTypeData.valueVi} / ${doctorInfor.paymentTypeData.valueEn}`;
                    }
                    if (doctorInfor.priceTypeData) {
                        descObj.price = `${doctorInfor.priceTypeData.valueVi} / ${doctorInfor.priceTypeData.valueEn}`;
                    }
                }
                
                finalDescription = JSON.stringify(descObj);
            } catch (jsonErr) {
                console.error("Error parsing description JSON in savePatientHistory", jsonErr);
            }

            await db.History.create({
                patientId: data.patientId,
                doctorId: data.doctorId,
                description: finalDescription,
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

let getNotificationsAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy 50 booking mới nhất để làm thông báo cho Admin
            let bookings = await db.Booking.findAll({
                include: [
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'phonenumber']
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['id', 'firstName', 'lastName']
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
                limit: 50,
                raw: false,
                nest: true
            });

            let notifications = bookings.map(b => {
                let patientName = b.patientData
                    ? `${b.patientData.lastName || ''} ${b.patientData.firstName || ''}`.trim()
                    : 'Bệnh nhân';
                let doctorName = b.doctorData
                    ? `BS. ${b.doctorData.lastName || ''} ${b.doctorData.firstName || ''}`.trim()
                    : 'Bác sĩ';
                let timeVi = b.timeTypeDataPatient ? b.timeTypeDataPatient.valueVi : '';
                let timeEn = b.timeTypeDataPatient ? b.timeTypeDataPatient.valueEn : '';
                let status = b.statusId;

                let titleVi = '', titleEn = '', descVi = '', descEn = '', icon = '', type = '';

                if (status === 'S1') {
                    icon = 'fas fa-calendar-plus';
                    type = 'new-booking';
                    titleVi = 'Đặt lịch mới';
                    titleEn = 'New Booking';
                    descVi = `${patientName} vừa đặt lịch với ${doctorName} lúc ${timeVi}`;
                    descEn = `${patientName} booked an appointment with ${doctorName} at ${timeEn}`;
                } else if (status === 'S2') {
                    icon = 'fas fa-check-circle';
                    type = 'confirmed';
                    titleVi = 'Lịch được xác nhận';
                    titleEn = 'Appointment Confirmed';
                    descVi = `${patientName} đã xác nhận lịch khám với ${doctorName} lúc ${timeVi}`;
                    descEn = `${patientName} confirmed appointment with ${doctorName} at ${timeEn}`;
                } else if (status === 'S3') {
                    icon = 'fas fa-stethoscope';
                    type = 'completed';
                    titleVi = 'Khám hoàn thành';
                    titleEn = 'Appointment Done';
                    descVi = `${patientName} đã được khám bởi ${doctorName}`;
                    descEn = `${patientName} was examined by ${doctorName}`;
                } else if (status === 'S4') {
                    icon = 'fas fa-times-circle';
                    type = 'cancelled';
                    titleVi = 'Lịch bị hủy';
                    titleEn = 'Appointment Cancelled';
                    descVi = `Lịch của ${patientName} với ${doctorName} đã bị hủy`;
                    descEn = `Appointment of ${patientName} with ${doctorName} was cancelled`;
                } else {
                    icon = 'fas fa-bell';
                    type = 'other';
                    titleVi = 'Cập nhật lịch';
                    titleEn = 'Booking Update';
                    descVi = `Cập nhật lịch hẹn của ${patientName}`;
                    descEn = `Booking update for ${patientName}`;
                }

                return {
                    id: b.id,
                    type,
                    icon,
                    titleVi,
                    titleEn,
                    descVi,
                    descEn,
                    status,
                    date: b.date,
                    createdAt: b.createdAt,
                    patientName,
                    doctorName
                };
            });

            resolve({
                errCode: 0,
                errMessage: 'Get notifications successfully',
                data: notifications
            });
        } catch (e) {
            console.log('Error in getNotificationsAdmin:', e);
            reject(e);
        }
    });
};

let getNotificationsDoctor = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                return resolve({ errCode: 1, errMessage: 'Missing doctorId', data: [] });
            }

            let bookings = await db.Booking.findAll({
                where: { doctorId: doctorId },
                include: [
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'phonenumber', 'gender']
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
                limit: 50,
                raw: false,
                nest: true
            });

            // Lấy ngày hôm nay theo timestamp (ms)
            let today = new Date();
            let todayMs = today.getTime();
            // Làm tròn về đầu ngày
            let startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
            let endOfToday = startOfToday + 86400000;

            let notifications = bookings.map(b => {
                let patientName = b.patientData
                    ? `${b.patientData.lastName || ''} ${b.patientData.firstName || ''}`.trim()
                    : 'Bệnh nhân';
                let timeVi = b.timeTypeDataPatient ? b.timeTypeDataPatient.valueVi : '';
                let timeEn = b.timeTypeDataPatient ? b.timeTypeDataPatient.valueEn : '';
                let status = b.statusId;
                let bookingDate = parseInt(b.date);
                let isToday = bookingDate >= startOfToday && bookingDate < endOfToday;

                let titleVi = '', titleEn = '', descVi = '', descEn = '', icon = '', type = '';

                if (status === 'S1') {
                    icon = 'fas fa-user-plus';
                    type = 'new-patient';
                    titleVi = 'Bệnh nhân mới đặt lịch';
                    titleEn = 'New Appointment Request';
                    descVi = `${patientName} vừa đặt lịch khám${isToday ? ' HÔM NAY' : ''} lúc ${timeVi}`;
                    descEn = `${patientName} requested an appointment${isToday ? ' TODAY' : ''} at ${timeEn}`;
                } else if (status === 'S2') {
                    icon = 'fas fa-clipboard-check';
                    type = 'patient-confirmed';
                    titleVi = 'Bệnh nhân đã xác nhận';
                    titleEn = 'Patient Confirmed';
                    descVi = `${patientName} đã xác nhận lịch khám${isToday ? ' HÔM NAY' : ''} lúc ${timeVi}`;
                    descEn = `${patientName} confirmed appointment${isToday ? ' TODAY' : ''} at ${timeEn}`;
                } else if (status === 'S3') {
                    icon = 'fas fa-check-double';
                    type = 'completed';
                    titleVi = 'Đã hoàn thành khám';
                    titleEn = 'Examination Completed';
                    descVi = `Đã hoàn thành khám cho ${patientName} lúc ${timeVi}`;
                    descEn = `Completed examination for ${patientName} at ${timeEn}`;
                } else if (status === 'S4') {
                    icon = 'fas fa-user-times';
                    type = 'cancelled';
                    titleVi = 'Lịch bị hủy';
                    titleEn = 'Appointment Cancelled';
                    descVi = `Lịch của ${patientName} lúc ${timeVi} đã bị hủy`;
                    descEn = `Appointment of ${patientName} at ${timeEn} was cancelled`;
                } else {
                    icon = 'fas fa-bell';
                    type = 'other';
                    titleVi = 'Cập nhật lịch hẹn';
                    titleEn = 'Appointment Update';
                    descVi = `Cập nhật lịch của ${patientName}`;
                    descEn = `Update for ${patientName}`;
                }

                return {
                    id: b.id,
                    type,
                    icon,
                    titleVi,
                    titleEn,
                    descVi,
                    descEn,
                    status,
                    date: b.date,
                    isToday,
                    createdAt: b.createdAt,
                    patientName,
                    patientPhone: b.patientData ? b.patientData.phonenumber : ''
                };
            });

            resolve({
                errCode: 0,
                errMessage: 'Get doctor notifications successfully',
                data: notifications
            });
        } catch (e) {
            console.log('Error in getNotificationsDoctor:', e);
            reject(e);
        }
    });
};

let updatePatientInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Validate required fields
            if (!data.id || !data.email || !data.firstName || !data.phonenumber || !data.address || !data.gender) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            }

            // Find user
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Patient not found'
                });
            }

            // Update user fields
            user.firstName = data.firstName;
            user.lastName = data.lastName || user.lastName || '';
            user.phonenumber = data.phonenumber;
            user.address = data.address;
            user.gender = data.gender;
            await user.save();

            // Translate gender for email
            let genderLabel = data.gender;
            try {
                let genderCode = await db.Allcode.findOne({ where: { keyMap: data.gender, type: 'GENDER' } });
                if (genderCode) {
                    genderLabel = data.language === 'vi' ? genderCode.valueVi : genderCode.valueEn;
                }
            } catch (e) { /* ignore - use raw key if lookup fails */ }

            // Send confirmation email (non-blocking)
            emailService.sendUpdateInfoEmail({
                receiverEmail: data.email,
                patientName: data.firstName,
                fullName: data.firstName,
                phoneNumber: data.phonenumber,
                address: data.address,
                gender: genderLabel,
                language: data.language || 'vi'
            }).catch(err => console.error('Error sending update info email:', err));

            return resolve({
                errCode: 0,
                errMessage: 'Update patient info successfully'
            });

        } catch (e) {
            console.log('Error in updatePatientInfo:', e);
            reject(e);
        }
    });
};

let getPatientByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            }
            let patients = await db.User.findAll({
                where: { email: email, roleId: 'R3' },
                attributes: ['email', 'firstName', 'phonenumber', 'gender', 'address', 'birthday'],
                raw: true
            });
            return resolve({
                errCode: 0,
                errMessage: 'Get patient info by email successfully',
                data: patients.map(p => ({
                    email: p.email,
                    fullName: p.firstName,
                    phoneNumber: p.phonenumber,
                    selectedGender: p.gender,
                    address: p.address,
                    birthday: p.birthday
                }))
            });
        } catch (e) {
            reject(e);
        }
    });
};

let rescheduleBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.bookingId || !data.date || !data.timeType) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                });
            }

            // Find booking
            let booking = await db.Booking.findOne({
                where: { id: data.bookingId },
                raw: false
            });

            if (!booking) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Booking appointment not found'
                });
            }

            // Can only reschedule bookings in status S1 (Chờ xác nhận) or S2 (Đã xác nhận)
            if (booking.statusId !== 'S1' && booking.statusId !== 'S2') {
                return resolve({
                    errCode: 3,
                    errMessage: 'Lịch hẹn đã khám hoặc đã hủy, không thể đổi lịch!'
                });
            }

            // Check capacity limit of the new slot (e.g. check Doctor Schedule)
            let schedule = await db.Schedule.findOne({
                where: {
                    doctorId: booking.doctorId,
                    date: data.date,
                    timeType: data.timeType
                }
            });

            if (schedule) {
                let maxCapacity = schedule.maxNumber ? Number(schedule.maxNumber) : 5;
                let activeBookingCount = await db.Booking.count({
                    where: {
                        doctorId: booking.doctorId,
                        date: data.date,
                        timeType: data.timeType,
                        statusId: { [Op.in]: ['S1', 'S2', 'S3'] }
                    }
                });

                if (activeBookingCount >= maxCapacity) {
                    return resolve({
                        errCode: 4,
                        errMessage: 'Khung giờ này đã đạt tối đa số lượng lịch hẹn cho phép. Vui lòng chọn khung giờ khác.'
                    });
                }
            }

            // Check if patient already has another booking at this exact timeType and date
            let patientConflict = await db.Booking.findOne({
                where: {
                    patientId: booking.patientId,
                    date: data.date,
                    timeType: data.timeType,
                    id: { [Op.ne]: data.bookingId },
                    statusId: { [Op.in]: ['S1', 'S2', 'S3'] }
                }
            });

            if (patientConflict) {
                return resolve({
                    errCode: 5,
                    errMessage: 'Bạn đã có một lịch khám khác tại cùng khung giờ và ngày này!'
                });
            }

            // Check if schedule date is in the past
            let todayStart = new Date();
            todayStart.setHours(0,0,0,0);
            if (new Date(Number(data.date)) < todayStart) {
                return resolve({
                    errCode: 6,
                    errMessage: 'Không thể đổi lịch hẹn sang một ngày trong quá khứ!'
                });
            }

            // Update booking details
            booking.date = data.date;
            booking.timeType = data.timeType;
            await booking.save();

            // Send reschedule confirmation email
            try {
                let patient = await db.User.findOne({
                    where: { id: booking.patientId },
                    attributes: ['email', 'firstName']
                });
                let doctor = await db.User.findOne({
                    where: { id: booking.doctorId },
                    attributes: ['firstName', 'lastName']
                });
                let timeTypeVal = await db.Allcode.findOne({
                    where: { keyMap: data.timeType, type: 'TIME' }
                });

                if (patient && doctor && timeTypeVal) {
                    let formattedDate = data.language === 'vi' 
                        ? new Date(Number(data.date)).toLocaleDateString('vi-VN')
                        : new Date(Number(data.date)).toLocaleDateString('en-US');
                    let timeLabel = data.language === 'vi' ? timeTypeVal.valueVi : timeTypeVal.valueEn;
                    let doctorName = `${doctor.lastName} ${doctor.firstName}`;
                    
                    emailService.sendRescheduleEmail({
                        email: patient.email,
                        patientName: patient.firstName,
                        doctorName: doctorName,
                        time: `${timeLabel} - ${formattedDate}`,
                        language: data.language || 'vi'
                    }).catch(e => console.error('Send reschedule email error:', e));
                }
            } catch (emailErr) {
                console.error('Failed to prepare reschedule email:', emailErr);
            }

            return resolve({
                errCode: 0,
                errMessage: 'Đổi lịch hẹn thành công'
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
    savePatientHistory: savePatientHistory,
    getNotificationsAdmin: getNotificationsAdmin,
    getNotificationsDoctor: getNotificationsDoctor,
    updatePatientInfo: updatePatientInfo,
    getPatientByEmail: getPatientByEmail,
    rescheduleBooking: rescheduleBooking
};
