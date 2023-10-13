
import { Association } from "sequelize";
import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10;

    try {
        let doctors = await doctorService.getTopDoctorHomeServer(+limit);
        return res.status(200).json(doctors);

    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}


let getAllDoctors = async (req, res) => {
   try {
        let doctors = await doctorService.getAllDoctorsServer();
     //   console.log("check doctor", doctors);
        return res.status(200).json(doctors);

    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let createDetailInfoDoctor = async ( req, res) => {
    try {
        let info = await doctorService.createDetailInfoDoctorService(req.body);
       
        return res.status(200).json({
            errCode: info.errCode,
            errMessage: info.errMessage,
        })

    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}


let getDetailDoctorById = async (req,res) => {
    try {
       let infoDoctor = await doctorService.getDetailDoctorByIdService(req.query.id);
       return res.status(200).json(infoDoctor);
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let getInfoDoctorByIdMarkdown  = async (req,res) => {
    try {
        let infoDoctor = await doctorService.getInfoDoctorByIdMarkdownService(req.query.id);
        return res.status(200).json(infoDoctor);
     }
     catch(e){
         console.log(e);
         return res.status(200).json({
             errCode: -1,
             errMessage: 'Error from server!'
         })
     }
}

let bulkCreateSchedule = async (req,res) => {
   try {
     let info = await doctorService.bulkCreateScheduleService(req.body);
     return res.status(200).json(info);
   }catch(e) {
    console.log(e);
         return res.status(200).json({
             errCode: -1,
             errMessage: 'Error from server!'
         })
   }
 
}
 let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
      }catch(e) {
       console.log(e);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server!'
            })
      }
 }


 let getExtraDoctorInfoById = async (req,res) => {
    try {
        let info = await doctorService.getExtraDoctorInfoByIdService(req.query.doctorId);
        return res.status(200).json(info);
      }catch(e) {
       console.log(e);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server!'
            })
      }
 }

 let getProfileDoctorInfoById  = async (req, res) => {
    try {
        let data = await doctorService.getProfileDoctorInfoByIdService(req.query.doctorId);
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

let getPatientByDateDoctor = async (req, res) => {
    try {
        let data = await doctorService.getPatientByDateDoctorService(req.query.doctorId, req.query.date);
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


let postSendEmailPatient = async (req, res) => {
    try {
        let data = await doctorService.postSendEmailPatientService(req.body);
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
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    createDetailInfoDoctor: createDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    getInfoDoctorByIdMarkdown: getInfoDoctorByIdMarkdown,
    bulkCreateSchedule:bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraDoctorInfoById: getExtraDoctorInfoById,
    getProfileDoctorInfoById: getProfileDoctorInfoById,
    getPatientByDateDoctor : getPatientByDateDoctor,
    postSendEmailPatient: postSendEmailPatient,
}

