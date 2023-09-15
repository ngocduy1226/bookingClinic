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
  
};
