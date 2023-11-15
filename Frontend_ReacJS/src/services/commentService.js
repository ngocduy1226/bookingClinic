import axios from "../axios";


const getAllCommentServiceByDoctorId = (data) => {

    return axios.get(`./api/get-all-comment-by-doctorId?doctorId=${data.doctorId}&status=${data.status}`)
}

const getAllCommentService = (data) => {
  return axios.get(`./api/get-all-comment?doctorId=${data.doctorId}&currentDate=${data.currentDate}`)
}


const createNewCommentService = (data) => {
  return axios.post(`./api/create-new-comment`, data);
}

const handleShowHideCommentService = (data) => {

  return axios.get(`./api/show-comment?commentId=${data.commentId}&status=${data.status}`)
}


export {
      createNewCommentService,
      getAllCommentServiceByDoctorId,
      getAllCommentService,
      handleShowHideCommentService,
  
  }