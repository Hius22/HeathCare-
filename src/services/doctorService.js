import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';
import { Op } from 'sequelize';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let limit = Number(limitInput) || 10;
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        attributes: ['specialtyId'],
                        include: [
                            {
                                model: db.Specialty,
                                as: 'specialtyData',
                                attributes: ['name']
                            }
                        ]
                    }
                ],
                nest: true,
                raw: false
            })

            if (users && users.length > 0) {
                users = users.map(item => {
                    let plain = item.toJSON();
                    if (plain.image) {
                        try {
                            plain.image = Buffer.from(plain.image, 'base64').toString('binary');
                        } catch (e) { }
                    }
                    return plain;
                })
            }

            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password'] },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Clinic_Specialty,
                        as: 'doctorSpecialties',
                        attributes: ['specialtyId'],
                        include: [
                            { model: db.Specialty, as: 'specialtyData', attributes: ['id', 'name'] }
                        ]
                    }
                ],
                nest: true,
                raw: false
            });

            if (doctors && doctors.length > 0) {
                doctors = doctors.map(d => {
                    let plain = d.toJSON();
                    if (plain.image) {
                        try { plain.image = Buffer.from(plain.image, 'base64').toString('binary'); } catch (e) { }
                    }
                    return plain;
                });
            }

            resolve({ errCode: 0, data: doctors });
        } catch (e) {
            reject(e);
        }
    });
}

// Lấy danh sách bác sĩ theo chuyên khoa (dùng cho Hero search)
let getDoctorsBySpecialty = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId) {
                return resolve({ errCode: 1, errMessage: 'Missing specialtyId' });
            }

            let rows = await db.Doctor_Clinic_Specialty.findAll({
                where: { specialtyId: specialtyId },
                attributes: ['doctorId'],
                raw: true
            });

            if (!rows || rows.length === 0) {
                return resolve({ errCode: 0, data: [] });
            }

            let doctorIds = rows.map(r => r.doctorId);

            let doctors = await db.User.findAll({
                where: { id: doctorIds, roleId: 'R2' },
                attributes: { exclude: ['password'] },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Clinic_Specialty,
                        as: 'doctorSpecialties',
                        attributes: ['specialtyId'],
                        include: [
                            { model: db.Specialty, as: 'specialtyData', attributes: ['id', 'name'] }
                        ]
                    }
                ],
                nest: true,
                raw: false
            });

            if (doctors && doctors.length > 0) {
                doctors = doctors.map(d => {
                    let plain = d.toJSON();
                    if (plain.image) {
                        try { plain.image = Buffer.from(plain.image, 'base64').toString('binary'); } catch (e) { }
                    }
                    return plain;
                });
            }

            resolve({ errCode: 0, data: doctors });
        } catch (e) {
            reject(e);
        }
    });
}


let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // specialtyId now can be an array (many-to-many) or a single value (legacy)
            let specialtyIds = inputData.specialtyIds
                ? (Array.isArray(inputData.specialtyIds) ? inputData.specialtyIds : [inputData.specialtyIds])
                : (inputData.specialtyId ? [inputData.specialtyId] : []);

            // Build required fields check (allow specialtyId OR specialtyIds)
            let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
                'selectedPrice', 'selectedProvince', 'nameClinic', 'addressClinic', 'note'];
            let isValid = true, element = '';
            for (let f of arrFields) {
                if (!inputData[f]) { isValid = false; element = f; break; }
            }
            if (specialtyIds.length === 0) { isValid = false; element = 'specialtyId/specialtyIds'; }

            if (!isValid) {
                return resolve({ errCode: 1, errMessage: `Missing parameter: ${element}` });
            }

            // ── Upsert MarkDown ──
            if (inputData.action === 'CREATE') {
                await db.MarkDown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                });
            } else if (inputData.action === 'EDIT') {
                let doctorMackdown = await db.MarkDown.findOne({
                    where: { doctorId: inputData.doctorId }, raw: false
                });
                if (doctorMackdown) {
                    doctorMackdown.contentHTML = inputData.contentHTML;
                    doctorMackdown.contentMarkdown = inputData.contentMarkdown;
                    doctorMackdown.description = inputData.description;
                    doctorMackdown.updatedAt = new Date();
                    await doctorMackdown.save();
                }
            }

            // ── Upsert Doctor_Infor (keep specialtyId as primary for backward compat) ──
            let doctorInfor = await db.Doctor_Infor.findOne({
                where: { doctorId: inputData.doctorId }, raw: false
            });
            let primarySpecialtyId = specialtyIds[0];

            if (doctorInfor) {
                doctorInfor.priceId = inputData.selectedPrice;
                doctorInfor.provinceId = inputData.selectedProvince;
                doctorInfor.nameClinic = inputData.nameClinic;
                doctorInfor.addressClinic = inputData.addressClinic;
                doctorInfor.note = inputData.note;
                doctorInfor.specialtyId = primarySpecialtyId;
                doctorInfor.clinicId = inputData.clinicId || 1;
                await doctorInfor.save();
            } else {
                await db.Doctor_Infor.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.selectedPrice,
                    provinceId: inputData.selectedProvince,
                    nameClinic: inputData.nameClinic,
                    addressClinic: inputData.addressClinic,
                    note: inputData.note,
                    specialtyId: primarySpecialtyId,
                    clinicId: inputData.clinicId || 1
                });
            }

            // ── Sync doctor_clinic_specialty (many-to-many) ──
            // Delete old entries for this doctor
            await db.Doctor_Clinic_Specialty.destroy({
                where: { doctorId: inputData.doctorId }
            });
            // Insert new entries
            let newRows = specialtyIds.map(spId => ({
                doctorId: inputData.doctorId,
                clinicId: inputData.clinicId || 1,
                specialtyId: spId
            }));
            await db.Doctor_Clinic_Specialty.bulkCreate(newRows);

            resolve({ errCode: 0, errMessage: 'Saved doctor info successfully!' });
        } catch (e) {
            reject(e);
        }
    });
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.MarkDown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                {
                                    model: db.Specialty,
                                    as: 'specialtyData',
                                    attributes: ['name', 'id']
                                }
                            ]
                        },
                        // Include all specialties (many-to-many via junction table)
                        {
                            model: db.Doctor_Clinic_Specialty,
                            as: 'doctorSpecialties',
                            attributes: ['specialtyId'],
                            include: [
                                { model: db.Specialty, as: 'specialtyData', attributes: ['id', 'name'] }
                            ]
                        },
                    ],
                    nest: true,
                    raw: false
                })
                if (data) {
                    let plain = data.toJSON();
                    if (plain.image) {
                        try {
                            plain.image = Buffer.from(plain.image, 'base64').toString('binary');
                        } catch (e) { }
                    }
                    resolve({ errCode: 0, data: plain });
                } else {
                    resolve({ errCode: 0, data: {} });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                //get all existing
                let existing = await db.Schedule.findAll(
                    {
                        where: { doctorId: data.doctorId, date: data.formattedDate },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }
                );

                //compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },

                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    nest: true,
                    raw: false
                })

                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInforDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    nest: true,
                    raw: false
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.MarkDown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },

                    ],
                    nest: true,
                    raw: false
                })
                if (data && data.image) {
                    try {
                        let imageBase64 = Buffer.from(data.image, 'base64').toString('binary');
                        data.image = imageBase64;
                    } catch (e) {
                        data.image = data.image;
                    }
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                });
            }

            let data = await db.Booking.findAll({
                where: {
                    statusId: {
                        [Op.in]: ['S1', 'S2', 'S3', 'S4']
                    },
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['email', 'firstName', 'lastName', 'address', 'gender', 'phonenumber'],
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                        ],
                    },
                    {
                        model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.Allcode,
                        as: 'statusData',
                        attributes: ['valueEn', 'valueVi']
                    }

                ],
                order: [
                    ['createdAt', 'ASC']
                ],
                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                data: data
            });

        } catch (e) {
            reject(e);
        }
    });
};

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                });
            }
            else {
                //update patinet status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save();
                }

                //send email remedy
                await emailService.sendAttachment(data)

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let cancelBooking = async (data) => {
    try {
        const result = await db.Booking.update(
            { statusId: 'S4' },
            {
                where: {
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    timeType: data.timeType,
                    date: data.date,
                    statusId: {
                        [Op.in]: ['S1', 'S2']
                    }
                }
            }
        );

        if (result[0] === 0) {
            return {
                errCode: 1,
                errMessage: 'Appointment not found'
            };
        }

        try {
            // Nếu email không được truyền vào (bệnh nhân tự hủy), tự tra từ DB
            let emailToSend = data.email;
            let patientName = data.patientName;

            if (!emailToSend && data.patientId) {
                let patient = await db.User.findOne({
                    where: { id: data.patientId },
                    attributes: ['email', 'firstName']
                });
                if (patient) {
                    emailToSend = patient.email;
                    patientName = patientName || patient.firstName;
                }
            }

            if (emailToSend) {
                await emailService.sendCancelEmail({
                    ...data,
                    email: emailToSend,
                    patientName: patientName || 'Bệnh nhân',
                    language: data.language || 'vi'
                });
            }
        } catch (e) {
            console.log('Send cancel email failed:', e);
        }

        return {
            errCode: 0,
            errMessage: 'Cancel success'
        };
    } catch (e) {
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

let getAllSchedule = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Schedule.findAll({
                include: [
                    {
                        model: db.Allcode,
                        as: 'timeTypeData',
                        attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.User,
                        as: 'doctorData',
                        attributes: ['firstName', 'lastName']
                    }
                ],
                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                data: data
            });

        } catch (e) {
            reject(e);
        }
    });
};

let deleteScheduleDoctor = (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!scheduleId) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing scheduleId'
                });
            }

            let schedule = await db.Schedule.findOne({
                where: { id: scheduleId }
            });

            if (!schedule) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Schedule not found'
                });
            }

            await db.Schedule.destroy({
                where: { id: scheduleId }
            });

            return resolve({
                errCode: 0,
                errMessage: 'Delete success'
            });

        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    getDoctorsBySpecialty,
    saveDetailInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy,
    cancelBooking,
    getAllSchedule,
    deleteScheduleDoctor
}