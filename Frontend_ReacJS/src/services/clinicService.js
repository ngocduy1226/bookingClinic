import axios from "../axios";



const getTotalClinicService = () => {
    return axios.get(`/api/get-total-clinic`);
  } 

export {
   
      getTotalClinicService,


}


