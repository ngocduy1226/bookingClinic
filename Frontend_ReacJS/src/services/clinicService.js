import axios from "../axios";



const getTotalClinicService = () => {
    return axios.get(`/api/get-total-clinic`);
  } 


  
  const getAllRoomService = (data) => {
    
    return axios.get(`./api/get-all-room?id=${data.id}&clinic=${data.clinic}`)
  } 

  const editRoomService  = (data) => {
    return axios.put('/api/edit-room', data);
  
  }
  
  const createNewRoomService  = (data) => {
    return axios.post(`/api/create-new-room`, data);
  }

  const getScheduleRoomByDateService = (data) => {
    
    return axios.get(`/api/get-schedule-room?date=${data.currentDate}&clinic=${data.clinic}`)
  } 

 
  const bulkCreateBusinessHoursService  = (data) => {
    return axios.post(`/api/bulk-create-business-hours`, data);
  }

  
  const getAllScheduleBusinessHoursService = (data) => {
    
    return axios.get(`/api/get-all-schedule-business-hours-by-id?clinicId=${data}`)
  } 

  const handleGetRoomStatusByDateService = (data) => {
    return axios.get(`/api/get-room-status-by-date?clinic=${data.clinic}&status=${data.status}&date=${data.date}`)
  }
  

  const handleChooseRoom = (data) => {
    return axios.get(`/api/choose-room-by-date?room=${data.roomId}&date=${data.date}&clinic=${data.clinic}`)
  }
  

export {
      getTotalClinicService,
      getAllRoomService,
      editRoomService,
      createNewRoomService,
      getScheduleRoomByDateService,
      bulkCreateBusinessHoursService,
      getAllScheduleBusinessHoursService,
      handleGetRoomStatusByDateService,
      handleChooseRoom,
}



