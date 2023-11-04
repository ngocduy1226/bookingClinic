import clinicService from "../services/clinicService";

let handleCreateNewClinic = async (req, res) => {
    try {
        let data = await clinicService.handleCreateNewClinicService(req.body);
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


let handleEditClinic = async (req, res) => {
    try {
        let data = await clinicService.handleEditClinicService(req.body);
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

let getTopClinicHome = async (req,res) => {
    try {
        let limit = req.query.limit;
        if(!limit) limit = 10;

        let data = await clinicService.getTopClinicHomeService(+limit);
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

let getAllClinic = async (req,res) => {
    try {
        let data = await clinicService.getAllClinicService();
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

let getDetailClinicById = async (req,res) => {
    try {
        let data = await clinicService.getDetailClinicByIdService(req.query.id);
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

let getScheduleClinicById = async (req,res) => {
    try {
        let data = await clinicService.getScheduleClinicByIdService(req.query.arr);
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
    handleCreateNewClinic : handleCreateNewClinic,
    handleEditClinic: handleEditClinic,
     getTopClinicHome: getTopClinicHome,
     getDetailClinicById: getDetailClinicById,
     getAllClinic : getAllClinic ,
     getScheduleClinicById: getScheduleClinicById,
   
}