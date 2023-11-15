
import { Association } from "sequelize";
import prescriptionService from "../services/prescriptionService";



let handleCreateNewPrescription = async (req, res) => {
    let pres = await prescriptionService.createNewPrescriptionService(req.body);
    return res.status(200).json({
        errMessage: pres.errMessage,
        errCode: pres.errCode,
        data: pres.prescription,

    })   

}

let getAllPrescriptionByPatientId = async (req, res) => {
    try {
        let data = await prescriptionService.getAllPrescriptionByPatientIdService(req.query.patientId);
        return res.status(200).json(
            data
        );
    }catch(e){
        console.log('error code server', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error server'
        })
    }
}



let getPrescriptionByBookingId = async (req, res) => {
    try {
        let data = await prescriptionService.getPrescriptionByBookingIdService(req.query.bookingId);
        return res.status(200).json(
            data
        );
    }catch(e){
        console.log('error code server', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error server'
        })
    }
}


let getTotalPrescription = async (req, res) => {
    try {
        let data = await prescriptionService.getTotalPrescriptionService();
        return res.status(200).json(
            data
        );
    }catch(e){
        console.log('error code server', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error server'
        })
    }
}

 
module.exports = {
  
    handleCreateNewPrescription: handleCreateNewPrescription,
    getAllPrescriptionByPatientId: getAllPrescriptionByPatientId,
    getPrescriptionByBookingId : getPrescriptionByBookingId,
   
    getTotalPrescription: getTotalPrescription,
}
