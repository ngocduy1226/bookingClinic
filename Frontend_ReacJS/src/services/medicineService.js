import axios from "../axios";


const getAllMedicinesService = (data) => {
 
    return axios.get(`./api/get-all-medicine?id=${data.id}&formulary=${data.formulary}&status=${data.status}`)
}

const createNewMedicineService = (data) => {
  return axios.post(`./api/create-new-medicine`, data);
}

// const deleteUserService = (idUser) => {
//   return axios.delete('./api/delete-user', {
//     data: {
//       id: idUser
//     } 
  
//     });
// }

const editMedicineService = (inputData) => {
  return axios.put(`./api/edit-medicine`, inputData);
}

const getAllFormulariesService = (data) => {
 
  return axios.get(`./api/get-all-formulary?id=${data.id}&status=${data.status}`)
}

const createNewFormularyService = (data) => {
return axios.post(`./api/create-new-formulary`, data);
}

const handleDeleteMedicineService = (idMedicine) => {
  return axios.get(`./api/delete-medicine?id=${idMedicine}`);
}


const restoreMedicineService = (idMedicine) => {
  return axios.get(`./api/restore-medicine?id=${idMedicine}`);
}



const handleDeleteFormularyService = (idFormulary) => {
  return axios.get(`./api/delete-formulary?id=${idFormulary}`);
}


const restoreFormularyService = (idFormulary) => {
  return axios.get(`./api/restore-formulary?id=${idFormulary}`);
}


const editFormularyService = (inputData) => {
return axios.put(`./api/edit-formulary`, inputData);
}



export {
    createNewMedicineService,
    editMedicineService,
    getAllMedicinesService,
    editFormularyService,
    getAllFormulariesService,
    createNewFormularyService,
    handleDeleteMedicineService,
    restoreMedicineService,
    handleDeleteFormularyService,
    restoreFormularyService
}