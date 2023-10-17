
import { Association } from "sequelize";
import medicineService from "../services/medicineService";




let handleGetAllMedicine = async (req, res) => {
    let id = req.query.id;
    let formulary = req.query.formulary;
    // id => user(id)
    // all => users
    if(!id || !formulary ) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters',
                medicines: [],
            })
        }
    let medicines = await medicineService.getAllMedicinesService(id, formulary);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        medicines,
    })
}

let handleCreateNewMedicine = async (req, res) => {
    let data = await medicineService.createNewMedicineService(req.body);
   
    return res.status(200).json({
        errMessage: data.errMessage,
        errCode: data.errCode,
    })   

}

let handleEditMedicine = async (req,res) => {
    let data = req.body;
   let medicine = await medicineService.handleEditMedicineService(data);
    return res.status(200).json({
        errMessage: medicine.errMessage,
        errCode: medicine.errCode
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
  
    handleCreateNewMedicine: handleCreateNewMedicine,
     handleGetAllMedicine: handleGetAllMedicine,
     handleEditMedicine: handleEditMedicine,
    // handleDeleteUser: handleDeleteUser,

    
}
