import axios from "../axios";

const handleLoginApi = (email, password) => {
   return axios.post('./api/login', {email, password});

  // return axios.post('./api/login', {email: email, password:password});

}

const getAllUsers = (inputId) => {
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

export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
};