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

export {
  handleLoginApi,
  getAllUsersService,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
};