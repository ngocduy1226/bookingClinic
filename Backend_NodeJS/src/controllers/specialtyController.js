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
        let data = await specialtyService.getAllSpecialtyService(req.query.status);
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


let handleDeleteSpecialty = async (req, res) => {
    if( !req.query.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!',
        })
    } 

    let message = await specialtyService.deleteSpecialty(req.query.id);
   
    return res.status(200).json(
        message
    )   
}


let handleRestoreSpecialty = async (req, res) => {
    if( !req.query.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!',
        })
    } 

    let message = await specialtyService.restoreSpecialty(req.query.id);
   
    return res.status(200).json({
        errMessage: message.errMessage,
        errCode: message.errCode,
    })   
}


module.exports = {
    handleRestoreSpecialty: handleRestoreSpecialty,
    handleDeleteSpecialty: handleDeleteSpecialty,
    handleCreateNewSpecialty : handleCreateNewSpecialty,
    getTopSpecialtyHome: getTopSpecialtyHome,
    getAllSpecialty : getAllSpecialty ,
    getDetailSpecialtyById: getDetailSpecialtyById,
    handleEditSpecialty : handleEditSpecialty,
}