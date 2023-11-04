import specialtyService from "../services/specialtyService";

let handleCreateNewSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.handleCreateNewSpecialtyService(req.body);
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

let handleEditSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.handleEditSpecialtyService(req.body);
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

let getTopSpecialtyHome = async (req,res) => {
    try {
        let limit = req.query.limit;
        if(!limit) limit = 10;

        let data = await specialtyService.getTopSpecialtyHomeService(+limit);
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

let getAllSpecialty = async (req,res) => {
    try {
        let data = await specialtyService.getAllSpecialtyService();
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

let getDetailSpecialtyById = async (req,res) => {
    try {
        let data = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location);
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
    handleCreateNewSpecialty : handleCreateNewSpecialty,
    getTopSpecialtyHome: getTopSpecialtyHome,
    getAllSpecialty : getAllSpecialty ,
    getDetailSpecialtyById: getDetailSpecialtyById,
    handleEditSpecialty : handleEditSpecialty,
}