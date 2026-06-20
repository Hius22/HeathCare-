import db from "../models/index";

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown || !data.address) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }
            else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Created successfully!'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}


let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({

            });
            if (data && data.length > 0) {
                data.map(item => {
                    if (item.image) {
                        try {
                            item.image = Buffer.from(item.image, 'base64').toString('binary');
                        } catch (e) {
                            // image might not be base64
                        }
                    }
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Found success!',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address', 'image', 'descriptionHTML', 'descriptionMarkdown'],
                })

                if (data && data.image) {
                    try {
                        data.image = Buffer.from(data.image, 'base64').toString('binary');
                    } catch (e) { }
                }

                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: inputId
                        },
                        attributes: ['doctorId', 'provinceId', 'specialtyId'],
                        include: [
                            { model: db.Specialty, as: 'specialtyData', attributes: ['id', 'name'] }
                        ],
                        raw: false,
                        nest: true
                    })

                    data.doctorClinic = doctorClinic;

                } else data = {}

                resolve({
                    errCode: 0,
                    errMessage: 'Found success!',
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getClinicInfo = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Find ANY clinic (not just id: 1)
            let clinic = await db.Clinic.findOne({
                order: [['id', 'ASC']] // Get the first one
            });

            if (clinic && clinic.image) {
                try {
                    clinic.image = Buffer.from(clinic.image, 'base64').toString('binary');
                } catch (e) { }
            }

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: clinic
            });
        } catch (e) {
            reject(e);
        }
    })
}

// Service
let updateClinicInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing clinic ID'
                });
                return;
            }

            let clinic = await db.Clinic.findOne({
                where: { id: data.id },
                raw: false
            });

            if (!clinic) {
                resolve({
                    errCode: 2,
                    errMessage: 'Không tìm thấy phòng khám trong cơ sở dữ liệu.'
                });
                return;
            }

            // Update it
            clinic.name = data.name;
            clinic.address = data.address;
            clinic.descriptionHTML = data.descriptionHTML;
            clinic.descriptionMarkdown = data.descriptionMarkdown;

            if (data.imageBase64) {
                clinic.image = data.imageBase64;
            }

            await clinic.save();

            resolve({
                errCode: 0,
                errMessage: 'OK'
            });
        } catch (e) {
            reject(e);
        }
    })
}

let createClinicInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
                return;
            }

            // Create new clinic
            let clinic = await db.Clinic.create({
                name: data.name,
                address: data.address,
                image: data.imageBase64 || '',
                descriptionHTML: data.descriptionHTML || '',
                descriptionMarkdown: data.descriptionMarkdown || ''
            });

            console.log('Clinic created successfully with ID:', clinic.id);

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: clinic
            });
        } catch (e) {
            console.log('Create clinic error:', e);
            reject(e);
        }
    })
}

let deleteClinic = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
                return;
            }

            let clinic = await db.Clinic.findOne({
                where: { id: inputId },
                raw: false
            });

            if (!clinic) {
                resolve({
                    errCode: 2,
                    errMessage: 'Phòng khám không tồn tại.'
                });
                return;
            }

            await clinic.destroy();

            resolve({
                errCode: 0,
                errMessage: 'OK'
            });
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    getClinicInfo: getClinicInfo,
    updateClinicInfo: updateClinicInfo,
    createClinicInfo: createClinicInfo,
    deleteClinic: deleteClinic,
}
