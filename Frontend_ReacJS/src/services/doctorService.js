import axios from "../axios";


const getScheduleByIdDoctorService = (data) => {
 
    return axios.get(`./api/get-all-schedule-doctor-by-id?doctorId=${data}`)
}

const getTotalDoctorService = () => {
    return axios.get(`/api/get-total-doctor`);
  } 

export {
    getScheduleByIdDoctorService,
    getTotalDoctorService,


}


