import db from "../models/index";

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }
            else {
                await db.Specialty.create({
                    name: data.name,
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

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({

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

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                });

                if (data) {
                    let doctorSpecialty = [];

                    // Query via junction table (many-to-many)
                    let junctionRows = await db.Doctor_Clinic_Specialty.findAll({
                        where: { specialtyId: inputId },
                        attributes: ['doctorId'],
                        raw: true
                    });

                    if (junctionRows && junctionRows.length > 0) {
                        let doctorIds = junctionRows.map(r => r.doctorId);

                        if (location === 'ALL') {
                            // All provinces — just need doctorId list
                            doctorSpecialty = doctorIds.map(id => ({ doctorId: id }));
                        } else {
                            // Filter by province via Doctor_Infor.provinceId
                            let filtered = await db.Doctor_Infor.findAll({
                                where: {
                                    doctorId: doctorIds,
                                    provinceId: location
                                },
                                attributes: ['doctorId', 'provinceId'],
                                raw: true
                            });
                            doctorSpecialty = filtered;
                        }
                    }

                    // Fallback: also check Doctor_Infor.specialtyId for legacy data
                    // that hasn't been migrated to junction table yet
                    if (doctorSpecialty.length === 0) {
                        if (location === 'ALL') {
                            doctorSpecialty = await db.Doctor_Infor.findAll({
                                where: { specialtyId: inputId },
                                attributes: ['doctorId', 'provinceId'],
                                raw: true
                            });
                        } else {
                            doctorSpecialty = await db.Doctor_Infor.findAll({
                                where: { specialtyId: inputId, provinceId: location },
                                attributes: ['doctorId', 'provinceId'],
                                raw: true
                            });
                        }
                    }

                    data.doctorSpecialty = doctorSpecialty;
                } else data = {};

                resolve({
                    errCode: 0,
                    errMessage: 'Found success!',
                    data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

let updateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }

            let specialty = await db.Specialty.findOne({
                where: { id: data.id },
                raw: false
            });

            if (specialty) {
                specialty.name = data.name;
                specialty.descriptionHTML = data.descriptionHTML;
                specialty.descriptionMarkdown = data.descriptionMarkdown;
                if (data.imageBase64) {
                    specialty.image = data.imageBase64;
                }

                await specialty.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Updated successfully!'
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Specialty not found'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }

            let specialty = await db.Specialty.findOne({
                where: { id: data.id }
            });

            if (specialty) {
                await db.Specialty.destroy({
                    where: { id: data.id }
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Deleted successfully!'
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Specialty not found'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    updateSpecialty: updateSpecialty,
    deleteSpecialty: deleteSpecialty,
}