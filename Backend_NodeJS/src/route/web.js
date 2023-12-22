import express from "express";
import multer from 'multer';

import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import medicineController from "../controllers/medicineController";
import formularyController from "../controllers/formularyController";
import prescriptionController from "../controllers/prescriptionController";
import commentController from "../controllers/commentController";
import roomController from "../controllers/roomController";

import { update } from "lodash";


let router = express.Router();


 
let initWebRoutes = (app) => {
   router.get('/', homeController.getHomePage);

   router.get('/user', homeController.getUser);
   router.get('/user/edit-user', homeController.getEditUser);
   router.post('/user/put-user', homeController.putUser);

   router.get('/user/delete-user', homeController.deleteUser);

   router.get('/user/login', homeController.getUserLogin);
   router.get('/user/sign', homeController.getUserSign);

   router.post('/user/user-sign', homeController.postUserSign);

   // router.get('/hehe', (req, res) => {
   //    return res.send("hello world hehe");
   //   });
  
   router.post('/api/login', userController.handleLogin);
   router.get('/api/get-all-users', userController.handleGetAllUser );
   router.post('/api/create-new-user', userController.handleCreateNewUser );
   router.put('/api/edit-user', userController.handleEditUser );
   router.delete('/api/delete-user', userController.handleDeleteUser );
   router.get('/api/restore-user', userController.handleRestoreUser );


   router.get('/api/allcode', userController.getAllCodes)
   router.get('/api/get-top-doctor-home', doctorController.getTopDoctorHome);
  
   router.get('/api/get-all-doctors', doctorController.getAllDoctors);
   router.post('/api/save-info-doctors', doctorController.createDetailInfoDoctor);
   router.get('/api/get-info-doctor-by-id', doctorController.getInfoDoctorByIdMarkdown);

   router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
   
   router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
   router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
   router.get('/api/get-check-booking-patient-by-date', doctorController.checkBookingPatient);
   router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraDoctorInfoById);
   router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorInfoById);

   router.get('/api/get-all-schedule-doctor-by-id', doctorController.getScheduleById);


   router.post('/api/post-patient-book-appointment', patientController.postPatientBookAppointment);
   router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);
  
   router.post('/api/create-new-specialty', specialtyController.handleCreateNewSpecialty);
   router.put('/api/edit-specialty', specialtyController.handleEditSpecialty );
   router.get('/api/get-top-specialty-home', specialtyController.getTopSpecialtyHome);
   router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
   router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
   router.get('/api/delete-specialty', specialtyController.handleDeleteSpecialty );
   router.get('/api/restore-specialty', specialtyController.handleRestoreSpecialty);

  
   router.post('/api/create-new-clinic', clinicController.handleCreateNewClinic);
   router.put('/api/edit-clinic', clinicController.handleEditClinic );
   router.get('/api/get-top-clinic-home', clinicController.getTopClinicHome);
   router.get('/api/get-all-clinic', clinicController.getAllClinic);
   router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
   router.get('/api/get-schedule-clinic-by-id', clinicController.getScheduleClinicById);
   router.get('/api/delete-clinic', clinicController.handleDeleteClinic );
   router.get('/api/restore-clinic', clinicController.handleRestoreClinic);




   router.post('/api/create-new-room', roomController.handleCreateNewRoom);
   router.put('/api/edit-room', roomController.handleEditRoom );
   router.get('/api/get-all-room', roomController.getAllRoom);

   
   router.get('/api/get-check-schedule-doctor', roomController.checkScheduleDoctor);
   router.get('/api/get-schedule-room', roomController.getScheduleRoomByDate);
   router.post('/api/bulk-create-business-hours', roomController.handleBulkCreateBusinessHours);
   router.get('/api/get-all-schedule-business-hours-by-id', roomController.getScheduleBusinessHoursById);
   router.get('/api/get-room-status-by-date', roomController.getRoomStatusByDate);
   
   router.get('/api/choose-room-by-date', roomController.handleChooseByDate);

    router.get('/api/get-patient-by-date-doctor-id', doctorController.getPatientByDateDoctor);
    router.post('/api/post-send-email-patient', doctorController.postSendEmailPatient);
    router.post('/api/cancel-send-email-patient', doctorController.postCancelEmailPatient);

   
    
   router.get('/api/get-all-medicine', medicineController.handleGetAllMedicine );
   router.post('/api/create-new-medicine', medicineController.handleCreateNewMedicine );
   router.put('/api/edit-medicine', medicineController.handleEditMedicine );
    router.get('/api/delete-medicine', medicineController.handleDeleteMedicine );
    router.get('/api/restore-medicine', medicineController.handleRestoreMedicine );


   router.get('/api/get-all-formulary', formularyController.handleGetAllFormulary );
   router.post('/api/create-new-formulary', formularyController.handleCreateNewFormulary );
   router.put('/api/edit-formulary', formularyController.handleEditFormulary );
   router.get('/api/delete-formulary', formularyController.handleDeleteFormulary );
   router.get('/api/restore-formulary', formularyController.handleRestoreFormulary);
  
   router.post('/api/create-new-prescription', prescriptionController.handleCreateNewPrescription );
   router.get('/api/get-all-prescription-by-id-patient', prescriptionController.getAllPrescriptionByPatientId );
   router.get('/api/get-prescription-by-booking-id', prescriptionController.getPrescriptionByBookingId );
   
   router.get('/api/get-total-user', userController.getTotalUser);
   router.get('/api/get-total-doctor', doctorController.getTotalDoctor);
   router.get('/api/get-total-clinic', clinicController.getTotalClinic);
   router.get('/api/get-total-prescription', prescriptionController.getTotalPrescription);
   router.get('/api/get-statistic-week', userController.getStatisticWeek);
   router.get('/api/get-statistic-pres-one-day', userController.getStatisticPresOneDay);
   router.get('/api/get-statistic-pres-by-doctor', userController.getStatisticPresByDoctor);



   router.post('/api/create-new-comment', commentController.handleCreateNewComment );
   router.get('/api/get-all-comment-by-doctorId', commentController.handleGetAllCommentByDoctorId);
   router.get('/api/get-all-comment', commentController.handleGetAllComment);
   router.get('/api/show-comment', commentController.handShowHideComment);
   router.get('/api/count-comment-by-doctor', commentController.handCountCommentByDoctor);

   router.get('/api/count-doctor-in-clinic-by-doctor', doctorController.handCountDoctorInClinicByDoctor);
  
  
 
  
   return app.use("/", router);

   
}

module.exports = initWebRoutes;
