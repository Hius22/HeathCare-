import patientService from '../services/patientService';

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let getAllBookings = async (req, res) => {
    try {
        let bookings = await patientService.getAllBookings(req.query);
        return res.status(200).json(bookings);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let updateBookingStatus = async (req, res) => {
    try {
        let result = await patientService.updateBookingStatus(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let getPatientHistory = async (req, res) => {
    try {
        let result = await patientService.getPatientHistory(req.query.patientId);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let savePatientHistory = async (req, res) => {
    try {
        let result = await patientService.savePatientHistory(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from the server.'
        })
    }
}

let getNotifications = async (req, res) => {
    try {
        let result = await patientService.getNotificationsAdmin();
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errCode: -1, errMessage: 'Error from the server.' });
    }
}

let getNotificationsDoctor = async (req, res) => {
    try {
        let result = await patientService.getNotificationsDoctor(req.query.doctorId);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errCode: -1, errMessage: 'Error from the server.' });
    }
}

let updatePatientInfo = async (req, res) => {
    try {
        let result = await patientService.updatePatientInfo(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errCode: -1, errMessage: 'Error from the server.' });
    }
}

let getPatientByEmail = async (req, res) => {
    try {
        let result = await patientService.getPatientByEmail(req.query.email);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errCode: -1, errMessage: 'Error from the server.' });
    }
}

let rescheduleBooking = async (req, res) => {
    try {
        let result = await patientService.rescheduleBooking(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errCode: -1, errMessage: 'Error from the server.' });
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAllBookings: getAllBookings,
    updateBookingStatus: updateBookingStatus,
    getPatientHistory: getPatientHistory,
    savePatientHistory: savePatientHistory,
    getNotifications: getNotifications,
    getNotificationsDoctor: getNotificationsDoctor,
    updatePatientInfo: updatePatientInfo,
    getPatientByEmail: getPatientByEmail,
    rescheduleBooking: rescheduleBooking
}