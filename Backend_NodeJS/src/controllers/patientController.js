import { Association } from "sequelize";
import patientService from "../services/patientService";

let postPatientBookAppointment = async (req, res) => {
    try {
        let data = await patientService.postPatientBookAppointmentService(req.body);
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

let postVerifyBookAppointment = async (req, res) => {
    try {
        let data = await patientService.postVerifyBookAppointmentService(req.body);
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
    postPatientBookAppointment : postPatientBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
}