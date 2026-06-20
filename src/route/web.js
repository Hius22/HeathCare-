import express from "express";
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    //API
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.get('/api/get-doctors-by-specialty', doctorController.getDoctorsBySpecialty);
    router.post('/api/save-infor-doctors', doctorController.postInforDoctors);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.delete('/api/delete-schedule-doctor', doctorController.deleteScheduleDoctor);
    router.get('/api/get-all-schedule', doctorController.getAllSchedule);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);
    router.post('/api/cancel-booking', doctorController.cancelBooking);


    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);
    router.get('/api/get-all-bookings', patientController.getAllBookings);
    router.put('/api/update-booking-status', patientController.updateBookingStatus);
    router.get('/api/get-patient-history', patientController.getPatientHistory);
    router.post('/api/save-patient-history', patientController.savePatientHistory);
    router.get('/api/get-notifications', patientController.getNotifications);
    router.get('/api/get-notifications-doctor', patientController.getNotificationsDoctor);
    router.put('/api/update-patient-info', patientController.updatePatientInfo);
    router.get('/api/get-patient-by-email', patientController.getPatientByEmail);
    router.put('/api/reschedule-booking', patientController.rescheduleBooking);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    router.put('/api/update-specialty', specialtyController.updateSpecialty);
    router.delete('/api/delete-specialty', specialtyController.deleteSpecialty);

    router.get('/api/get-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    router.get('/api/get-clinic-info', clinicController.getClinicInfo);
    router.put('/api/update-clinic-info', clinicController.updateClinicInfo);
    router.post('/api/create-clinic-info', clinicController.createClinicInfo);
    router.delete('/api/delete-clinic', clinicController.deleteClinic);

    return app.use("/", router);
}

module.exports = initWebRoutes;