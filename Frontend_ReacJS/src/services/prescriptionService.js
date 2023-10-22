import axios from "../axios";



const createPrescriptionService = (data) => {
  return axios.post(`./api/create-new-prescription`, data);
}




export {
    createPrescriptionService,



}