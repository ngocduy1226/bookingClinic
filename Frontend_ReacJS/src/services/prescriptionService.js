import axios from "../axios";



const createPrescriptionService = (data) => {
  return axios.post(`./api/create-new-prescription`, data);
}

const getInfoPrescriptionByBookingIdService = (data) => {
  return axios.get(`./api/get-prescription-by-booking-id?bookingId=${data.bookingId}`);
}


const getAllPrescriptionByPatientIdService = (data) => {
  return axios.get(`./api/get-all-prescription-by-id-patient?patientId=${data}`);
}

export {
    createPrescriptionService,
    getInfoPrescriptionByBookingIdService,
    getAllPrescriptionByPatientIdService


}