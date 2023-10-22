import axios from "../axios";


const getAllMedicinesService = (data) => {
 
    return axios.get(`./api/get-all-medicine?id=${data.id}&formulary=${data.formulary}`)
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

const getAllFormulariesService = (id) => {
 
  return axios.get(`./api/get-all-formulary?id=${id}`)
}

const createNewFormularyService = (data) => {
return axios.post(`./api/create-new-formulary`, data);
}

// const deleteUserService = (idUser) => {
//   return axios.delete('./api/delete-user', {
//     data: {
//       id: idUser
//     } 

//     });
// }

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


}