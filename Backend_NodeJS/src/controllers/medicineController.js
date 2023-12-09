
import { Association } from "sequelize";
import medicineService from "../services/medicineService";




let handleGetAllMedicine = async (req, res) => {
    let id = req.query.id;
    let formulary = req.query.formulary;
    let status = req.query.status;
    // id => user(id)
    // all => users
    if(!id || !formulary ) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters',
                medicines: [],
            })
        }
    let data = await medicineService.getAllMedicinesService(id, formulary, status);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        data,
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

let handleDeleteMedicine = async (req, res) => {
    if( !req.query.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!',
        })
    } 

    let message = await medicineService.deleteMedicine(req.query.id);
   
    return res.status(200).json(
        message
    )   
}


let handleRestoreMedicine = async (req, res) => {
    if( !req.query.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!',
        })
    } 

    let message = await medicineService.restoreMedicine(req.query.id);
   
    return res.status(200).json({
        errMessage: message.errMessage,
        errCode: message.errCode,
    })   
}

 
module.exports = {
    handleRestoreMedicine: handleRestoreMedicine,
    handleCreateNewMedicine: handleCreateNewMedicine,
     handleGetAllMedicine: handleGetAllMedicine,
     handleEditMedicine: handleEditMedicine,
    handleDeleteMedicine: handleDeleteMedicine,
    
}
