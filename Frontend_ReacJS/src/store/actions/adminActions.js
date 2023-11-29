import actionTypes from "./actionTypes";
import {
  getAllCodeService,
  createNewUserService,
  getAllUsersService,
  deleteUserService,
  editUserService,
  getTopDoctorHomeService,
  getAllDoctorsService,
  saveInfoDoctorService,
  detailDoctorService,
  getInfoDoctorMarkdownService,
  getAllSpecialtyService,
  getAllClinicService,
  getTotalUserService,
} from "../../services/userService";

import { getAllMedicinesService, getAllFormulariesService} from "../../services/medicineService";
import { getAllCommentServiceByDoctorId, getAllCommentService} from "../../services/commentService";
import {getAllPrescriptionByPatientIdService, getTotalPrescriptionService} from "../../services/prescriptionService";
import {getScheduleByIdDoctorService, getTotalDoctorService} from "../../services/doctorService";
import { getTotalClinicService, getAllRoomService, getAllScheduleBusinessHoursService, getScheduleRoomByDateService} from "../../services/clinicService";
import { toast } from "react-toastify";
// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START,
// })

export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_GENDER_START,
      });

      let res = await getAllCodeService("GENDER");
      if (res && res.errCode === 0) {
        dispatch(fetchGenderSuccess(res.data));
      } else {
        dispatch(fetchGenderFailed());
      }
    } catch (e) {
      dispatch(fetchGenderFailed());
      console.log("fetch gender start error: ", e);
    }
  };
};

export const fetchGenderSuccess = (genderData) => ({
  type: actionTypes.FETCH_GENDER_SUCCESS,
  data: genderData,
});

export const fetchGenderFailed = () => ({
  type: actionTypes.FETCH_GENDER_FAILED,
});

export const fetchPositionStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("POSITION");
      if (res && res.errCode === 0) {
        dispatch(fetchPositionSuccess(res.data));
      } else {
        dispatch(fetchPositionFailed());
      }
    } catch (e) {
      dispatch(fetchPositionFailed());
      console.log("fetch position start error: ", e);
    }
  };
};

export const fetchPositionSuccess = (positionData) => ({
  type: actionTypes.FETCH_POSITION_SUCCESS,
  data: positionData,
});

export const fetchPositionFailed = () => ({
  type: actionTypes.FETCH_POSITION_FAILED,
});

export const fetchRoleStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("ROLE");
      if (res && res.errCode === 0) {
        dispatch(fetchRoleSuccess(res.data));
      } else {
        dispatch(fetchRoleFailed());
      }
    } catch (e) {
      dispatch(fetchRoleFailed());
      console.log("fetch role start error: ", e);
    }
  };
};

export const fetchRoleSuccess = (roleData) => ({
  type: actionTypes.FETCH_ROLE_SUCCESS,
  data: roleData,
});

export const fetchRoleFailed = () => ({
  type: actionTypes.FETCH_ROLE_FAILED,
});


export const fetchDosageStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("DOSAGE");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_DOSAGE_SUCCESS,
          dosageData: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_DOSAGE_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_DOSAGE_FAILED,

      });
      console.log("fetch role start error: ", e);
    }
  };
};

export const fetchDosageSuccess = (dosageData) => ({
  type: actionTypes.FETCH_DOSAGE_SUCCESS,
  data: dosageData,
});

export const fetchDosageFailed = () => ({
  type: actionTypes.FETCH_DOSAGE_FAILED,
});

export const fetchFrequencyStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("FREQUENCY");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_FREQUENCY_SUCCESS,
          frequencyData: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_FREQUENCY_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_FREQUENCY_FAILED,

      });
      console.log("fetch role start error: ", e);
    }
  };
};

export const fetchFrequencySuccess = (frequencyData) => ({
  type: actionTypes.FETCH_FREQUENCY_SUCCESS,
  data: frequencyData,
});

export const fetchFrequencyFailed = () => ({
  type: actionTypes.FETCH_FREQUENCY_FAILED,
});



export const createNewUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewUserService(data);
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch(createUserSuccess());
        dispatch(fetchAllUsersStart());
        dispatch(fetchAllDoctors());
        toast.success("Create a new user success!");
      } else {
        dispatch(createUserFailed());
      }
    } catch (e) {
      dispatch(createUserFailed());
      console.log("fetch role start error: ", e);
    }
  };
};

export const createUserSuccess = () => ({
  type: actionTypes.CREATE_USER_SUCCESS,
});

export const createUserFailed = () => ({
  type: actionTypes.CREATE_USER_FAILED,
});

export const fetchAllUsersStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllUsersService("ALL");
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch(fetchAllUsersSuccess(res.users.reverse()));
      } else {
        dispatch(fetchAllUsersFailed());
      }
    } catch (e) {
      dispatch(fetchAllUsersFailed());
      console.log("get all users error: ", e);
    }
  };
};



export const fetchAllUsersSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_USERS_SUCCESS,
  users: data,
});

export const fetchAllUsersFailed = () => ({
  type: actionTypes.FETCH_ALL_USERS_FAILED,
});

export const fetchUserStart = (id) => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllUsersService(id);
     
      if (res && res.errCode === 0) {
        dispatch(fetchUsersSuccess(res.users));
      } else {
        dispatch(fetchUsersFailed());
      }
    } catch (e) {
      dispatch(fetchUsersFailed());
      console.log("get all users error: ", e);
    }
  };
};



export const fetchUsersSuccess = (data) => ({
  type: actionTypes.FETCH_USER_SUCCESS,
  users: data,
});

export const fetchUsersFailed = () => ({
  type: actionTypes.FETCH_USER_FAILED,
});

export const deleteUser = (userId) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUserService(userId);
      
      if (res && res.errCode === 0) {
        dispatch(deleteUserSuccess());
        dispatch(fetchAllUsersStart());
        dispatch(fetchAllDoctors());
        toast.success("Delete a new user success!");
      } else {
        dispatch(deleteUserFailed());
        toast.warn("Delete a new user error!");
      }
    } catch (e) {
      dispatch(deleteUserFailed());
      console.log("fetch role start error: ", e);
    }
  };
};

export const deleteUserSuccess = () => ({
  type: actionTypes.DELETE_USER_SUCCESS,
});

export const deleteUserFailed = () => ({
  type: actionTypes.DELETE_USER_FAILED,
});

export const editUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUserService(data);
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch(editUserSuccess());
        dispatch(fetchAllUsersStart());
        dispatch(fetchAllDoctors());
        toast.success("Edit a user success!");
      } else {
        dispatch(editUserFailed());
      }
    } catch (e) {
      dispatch(editUserFailed());
      console.log("Fetch edit user error: ", e);
    }
  };
};

export const editUserSuccess = () => ({
  type: actionTypes.EDIT_USER_SUCCESS,
});

export const editUserFailed = () => ({
  type: actionTypes.EDIT_USER_FAILED,
});

export const fetchTopDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService("7");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
          dataDoctors: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
        });
      }
    } catch (e) {
      console.log("server err", e);
      dispatch({
        type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
      });
    }
  };
};

export const fetchAllDoctors = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctorsService();
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
          dataDoctors: res.data,
        });
        
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
        });
      }
    } catch (e) {
      console.log("server err", e);
      dispatch({
        type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
      });
    }
  };
};

export const saveInfoDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveInfoDoctorService(data);
  
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.SAVE_INFO_DOCTOR_SUCCESS,
        });
        toast.success("Save info doctor success!");
      } else {
        dispatch({
          type: actionTypes.SAVE_INFO_DOCTOR_FAILED,
        });
        toast.warn("Save info doctor error!");
      }
    } catch (e) {
      console.log("server err", e);
      dispatch({
        type: actionTypes.SAVE_INFO_DOCTOR_FAILED,
      });
      toast.warn("Save info doctor error!");
    }
  };
};

export const fetchDetailDoctor = (id) => {
  return async (dispatch, getState) => {
    try {
      let res = await detailDoctorService(id);
      
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_DETAIL_DOCTOR_SUCCESS,
          dataDoctor: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_DETAIL_DOCTOR_FAILED,
        });
      }
    } catch (e) {
      console.log("server err", e);
      dispatch({
        type: actionTypes.FETCH_DETAIL_DOCTOR_FAILED,
      });
      toast.warn("Save info doctor error!");
    }
  };
};

export const fetchInfoDoctorMarkdown = (id) => {
  return async (dispatch, getState) => {
    try {
      let res = await getInfoDoctorMarkdownService(id);

      if (res && res.errCode === 0 && res.data) {
        dispatch({
          type: actionTypes.FETCH_INFO_DOCTOR_MARKDOWN_SUCCESS,
          infoDoctor: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_INFO_DOCTOR_MARKDOWN_FAILED,
        });
      }
    } catch (e) {
      console.log("server err", e);
      dispatch({
        type: actionTypes.FETCH_INFO_DOCTOR_MARKDOWN_FAILED,
      });
      toast.warn("Save info doctor error!");
    }
  };
};

export const fetchAllCodeScheduleTime = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("TIME");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
          dataTimes: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
        });
      }
    } catch (e) {
      console.log("server err", e);
      dispatch({
        type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
      });
    }
  };
};

export const fetchScheduleRoomByDate = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await getScheduleRoomByDateService(data);
      if (res && res.errCode === 0) {
        console.log('res', res);
        dispatch({
          type: actionTypes.FETCH_SCHEDULE_ROOMS_BY_DATE_SUCCESS,
          data: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_SCHEDULE_ROOMS_BY_DATE_FAILED,
        });
      }
    } catch (e) {
      console.log("server err", e);
      dispatch({
        type: actionTypes.FETCH_SCHEDULE_ROOMS_BY_DATE_FAILED,
      });
    }
  };
};

export const fetchRequiredDoctorInfo = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START,
      });

      let resPrice = await getAllCodeService("PRICE");
      let resPayment = await getAllCodeService("PAYMENT");
      let resProvince = await getAllCodeService("PROVINCE");
      let resSpecialty = await getAllSpecialtyService();
      let resClinic = await getAllClinicService();
      if (
        resPrice &&
        resPrice.errCode === 0 &&
        resPayment &&
        resPayment.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0 &&
        resSpecialty &&
        resSpecialty.errCode === 0 &&
        resClinic &&
        resClinic.errCode === 0
      ) {
        let data = {
          resPrice: resPrice.data,
          resPayment: resPayment.data,
          resProvince: resProvince.data,
          resSpecialty: resSpecialty.data,
          resClinic: resClinic.data,
        };
        dispatch(fetchRequiredDoctorInfoSuccess(data));
      } else {
        dispatch(fetchRequiredDoctorInfoFailed());
      }
    } catch (e) {
      dispatch(fetchRequiredDoctorInfoFailed());
      console.log("fetch info doctor start error: ", e);
    }
  };
};

export const fetchRequiredDoctorInfoSuccess = (infoRequiredData) => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
  data: infoRequiredData,
});

export const fetchRequiredDoctorInfoFailed = () => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED,
});



export const fetchAllMedicines = (data) => {

  return async (dispatch, getState) => {
    try {
      let res = await getAllMedicinesService(data);
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_MEDICINE_SUCCESS,
          data: res.data,

        });
      } else {
        dispatch({
          type: actionTypes.FETCH_MEDICINE_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_MEDICINE_FAILED,

      });
      console.log("get all medicines error: ", e);
    }
  };
};


export const fetchAllFormularies = () => {

  return async (dispatch, getState) => {
    try {
      let res = await getAllFormulariesService('ALL');
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_FORMULARY_SUCCESS,
          data: res.data,

        });
      } else {
        dispatch({
          type: actionTypes.FETCH_FORMULARY_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_FORMULARY_FAILED,

      });
      console.log("get all medicines error: ", e);
    }
  };
};



export const fetchAllPrescriptionByPatient = (patientId) => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getAllPrescriptionByPatientIdService(patientId);
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_PRESCRIPTION_BY_PATIENT_ID_SUCCESS,
          data: res.arrPres,
        });
  
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_PRESCRIPTION_BY_PATIENT_ID_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_ALL_PRESCRIPTION_BY_PATIENT_ID_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };


  
};



export const fetchAllScheduleByIdDoctor = (doctorId) => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getScheduleByIdDoctorService(doctorId);
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_SCHEDULE_BY_DOCTOR_ID_SUCCESS,
          data: res.data,

        });
  
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_SCHEDULE_BY_DOCTOR_ID_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_ALL_SCHEDULE_BY_DOCTOR_ID_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };

};



export const getAllScheduleBusinessHours = (clinicId) => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getAllScheduleBusinessHoursService(clinicId);
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_SCHEDULE_BUSINESS_HOURS_SUCCESS,
          data: res.data,

        });
  
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_SCHEDULE_BUSINESS_HOURS_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_ALL_SCHEDULE_BUSINESS_HOURS_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };

};


export const fetchAllClinic = () => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getAllClinicService();
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_CLINICS_SUCCESS,
          data: res.data,

        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_CLINICS_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_ALL_CLINICS_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };

};



export const fetchAllRoom = (data) => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getAllRoomService(data);
      console.log( 'check user:', data);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_ROOMS_SUCCESS,
          data: res.data,

        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_ROOMS_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_ALL_ROOMS_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };

};

export const fetchAllSpecialty = () => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getAllSpecialtyService();
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_SPECIALTY_SUCCESS,
          data: res.data,

        });
        console.log('res', res);
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_SPECIALTY_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_ALL_SPECIALTY_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };

};



export const fetchTotalUser = () => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getTotalUserService();
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOTAL_USER_SUCCESS,
          data: res.data,

        });
       
      } else {
        dispatch({
          type: actionTypes.FETCH_TOTAL_USER_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_TOTAL_USER_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };

};


export const fetchTotalDoctor = () => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getTotalDoctorService();
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOTAL_DOCTOR_SUCCESS,
          data: res.data,

        });
       
      } else {
        dispatch({
          type: actionTypes.FETCH_TOTAL_DOCTOR_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_TOTAL_DOCTOR_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };

};


export const fetchTotalClinic = () => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getTotalClinicService();
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOTAL_CLINIC_SUCCESS,
          data: res.data,

        });
       
      } else {
        dispatch({
          type: actionTypes.FETCH_TOTAL_CLINIC_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_TOTAL_CLINIC_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };

};


export const fetchTotalPrescription = () => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getTotalPrescriptionService();
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOTAL_PRESCRIPTION_SUCCESS,
          data: res.data,

        });
       
      } else {
        dispatch({
          type: actionTypes.FETCH_TOTAL_PRESCRIPTION_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_TOTAL_PRESCRIPTION_FAILED,

      });
      console.log("get all prescription error: ", e);
    }
  };

};



export const fetchAllCommentByDoctorIdService = (data) => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getAllCommentServiceByDoctorId(data);
      if (res.data && res.data.errCode === 0) {

        dispatch({
          type: actionTypes.FETCH_COMMENT_BY_DOCTOR_SUCCESS,
          data: res.data.comments,

        });
       
      } else {
        dispatch({
          type: actionTypes.FETCH_COMMENT_BY_DOCTOR_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_COMMENT_BY_DOCTOR_FAILED,

      });
      console.log("get all comment error: ", e);
    }
  };

};



export const fetchAllCommentService = (data) => {
  
  return async (dispatch, getState) => {
    try {
      let res = await getAllCommentService(data); 
      if (res.data && res.data.errCode === 0) {

        dispatch({
          type: actionTypes.FETCH_COMMENT_SUCCESS,
          data: res.data.comments,

        });
       
      } else {
        dispatch({
          type: actionTypes.FETCH_COMMENT_FAILED,

        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_COMMENT_FAILED,

      });
      console.log("get all comment error: ", e);
    }
  };

};


