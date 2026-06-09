import clinicService from '../services/clinicService';

let createClinic = async (req, res) => {
    try {
        let infor = await clinicService.createClinic(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinic();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let getClinicInfo = async (req, res) => {
    try {
        let infor = await clinicService.getClinicInfo();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let updateClinicInfo = async (req, res) => {
    try {
        let infor = await clinicService.updateClinicInfo(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let createClinicInfo = async (req, res) => {
    try {
        let infor = await clinicService.createClinicInfo(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let deleteClinic = async (req, res) => {
    try {
        let infor = await clinicService.deleteClinic(req.body.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
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