import axios from "../axios";

const handleLoginApi = (email, password) => {
   return axios.post('./api/login', {email, password});

  // return axios.post('./api/login', {email: email, password:password});

}

const getAllUsersService = (inputId) => {
    return axios.get(`./api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
  return axios.post('./api/create-new-user', data);
}

const deleteUserService = (idUser) => {
  return axios.delete('./api/delete-user', {
    data: {
      id: idUser
    } 
  
    });
}

const editUserService = (inputData) => {
  return axios.put('./api/edit-user', inputData);
}

const getAllCodeService = (inputType) => {
     return axios.get(`/api/allcode?type=${inputType}`);
}

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/get-top-doctor-home?limit=${limit}`);
}


const getAllDoctorsService = () => {
  return axios.get(`/api/get-all-doctors`);
}


const saveInfoDoctorService = (data) => {
  return axios.post('./api/save-info-doctors', data);
}

const detailDoctorService = (id) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
}


const getInfoDoctorMarkdownService = (id) => {
  return axios.get(`/api/get-info-doctor-by-id?id=${id}`);
}

const bulkCreateScheduleService = (data) => {
  return axios.post(`/api/bulk-create-schedule`, data);
}

const getScheduleDoctorByDateService = (doctorId, date) => {
  return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);

}

const getExtraDoctorInfoByIdService  = (doctorId) => {
  return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`);

}
const getProfileDoctorInfoByIdService  = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);

}

const postPatientBookAppointmentService  = (data) => {
  return axios.post(`/api/post-patient-book-appointment`, data);

}
  
const verifyBookAppointmentService  = (data) => {
  return axios.post(`/api/verify-book-appointment`, data);

}

const createNewSpecialtyService  = (data) => {
  return axios.post(`/api/create-new-specialty`, data);

}

const editSpecialtyService  = (data) => {
  return axios.put('/api/edit-specialty', data);

}


const getTopSpecialtyHomeService = (limit) => {
  return axios.get(`/api/get-top-specialty-home?limit=${limit}`);
}

const  getAllSpecialtyService = () => {
  return axios.get(`/api/get-all-specialty`);
}

const  getDetailSpecialtyByIdService = (data) => {
  return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);
}


const editClinicService  = (data) => {
  return axios.put('/api/edit-clinic', data);

}

const createNewClinicService  = (data) => {
  return axios.post(`/api/create-new-clinic`, data);
}

const getTopClinicHomeService = (limit) => {
  return axios.get(`/api/get-top-clinic-home?limit=${limit}`);
}


const  getDetailClinicByIdService = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
}

const  getAllClinicService = () => {
  return axios.get(`/api/get-all-clinic`);
}

const getAllPatientForDoctor = (data) => {
  return axios.get(`/api/get-patient-by-date-doctor-id?doctorId=${data.doctorId}&date=${data.date}&patientId=${data.patientId}&status=${data.status}`);
} 



const postSendEmailPatientService  = (data) => {
  return axios.post(`/api/post-send-email-patient`, data);
}


const postCancelEmailPatientService  = (data) => {
  return axios.post(`/api/cancel-send-email-patient`, data);
}

const getTotalUserService = () => {
  return axios.get(`/api/get-total-user`);
} 
const getStatisticWeekService = (data) => {
  return axios.get(`/api/get-statistic-week?date=${data.date}&doctorId=${data.doctorId}&clinicId=${data.clinicId}`);
}

const getStatisticPresByDoctorService = (doctor) => {
  return axios.get(`/api/get-statistic-pres-by-doctor?doctorId=${doctor}`);
}


const getCountCommentByDoctorService = (data) => {
  return axios.get(`/api/count-comment-by-doctor?doctorId=${data.doctorId}&status=${data.status}`);
}


const getCountDoctorInClinicByDoctorService = (data) => {
  return axios.get(`/api/count-doctor-in-clinic-by-doctor?doctorId=${data}`);
}

export {
  handleLoginApi,
  getAllUsersService,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctorsService,
  saveInfoDoctorService,
  getInfoDoctorMarkdownService,
  detailDoctorService,
  bulkCreateScheduleService,
  getScheduleDoctorByDateService,
  getExtraDoctorInfoByIdService,
  getProfileDoctorInfoByIdService ,
  postPatientBookAppointmentService,
  verifyBookAppointmentService,
  createNewSpecialtyService,
  editSpecialtyService,
  getTopSpecialtyHomeService,
  getAllSpecialtyService,
  getDetailSpecialtyByIdService,
  createNewClinicService,
  editClinicService,
  getTopClinicHomeService,
  getDetailClinicByIdService,
  getAllClinicService,
  getAllPatientForDoctor,
  postSendEmailPatientService,
  getTotalUserService,
  getStatisticWeekService,
  getStatisticPresByDoctorService,
  getCountCommentByDoctorService,
  getCountDoctorInClinicByDoctorService,
  postCancelEmailPatientService,
};


