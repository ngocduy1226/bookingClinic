
import { Association } from "sequelize";
import formularyService from "../services/formularyService";




let handleGetAllFormulary = async (req, res) => {
    let id = req.query.id;

    // id => user(id)
    // all => users
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            medicines: [],
        })
    }else {
     let data = await formularyService.getAllFormulariesService(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        data,
    })   
    }
    
}

let handleCreateNewFormulary = async (req, res) => {
    let data = await formularyService.handleCreateNewFormularyService(req.body);

    return res.status(200).json({
        errMessage: data.errMessage,
        errCode: data.errCode,
    })

}

let handleEditFormulary = async (req, res) => {
    let data = req.body;
    let formulary = await formularyService.handleEditFormularyService(data);
    return res.status(200).json({
        errMessage: formulary.errMessage,
        errCode: formulary.errCode
    })
}

// let handleDeleteUser = async (req, res) => {
//     if( !req.body.id) {
//         return res.status(200).json({
//             errCode: 1,
//             errMessage: 'Missing required parameters!',
//         })
//     } 

//     let message = await userService.deleteUser(req.body.id);

//     return res.status(200).json({
//         errMessage: message.errMessage,
//         errCode: message.errCode,
//     })   
// }




module.exports = {

    handleCreateNewFormulary: handleCreateNewFormulary,
    handleGetAllFormulary: handleGetAllFormulary,
    handleEditFormulary: handleEditFormulary,
    // handleDeleteUser: handleDeleteUser,


}
