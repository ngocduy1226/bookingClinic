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
} from "../../services/userService";
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

export const createNewUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewUserService(data);
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch(createUserSuccess());
        dispatch(fetchAllUsersStart());
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

export const deleteUser = (userId) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUserService(userId);
      //console.log( 'check user:', res);
      if (res && res.errCode === 0) {
        dispatch(deleteUserSuccess());
        dispatch(fetchAllUsersStart());
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
      let res = await getTopDoctorHomeService("");
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
      console.log("check get all", res);
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
      console.log("res", res);
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
        console.log("check res serve", res);
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

export const fetchRequiredDoctorInfo = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START,
      });

      let resPrice = await getAllCodeService("PRICE");
      let resPayment = await getAllCodeService("PAYMENT");
      let resProvince = await getAllCodeService("PROVINCE");

      if (
        resPrice &&
        resPrice.errCode === 0 &&
        resPayment &&
        resPayment.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0
      ) {
        let data = {
          resPrice: resPrice.data,
          resPayment: resPayment.data,
          resProvince: resProvince.data,
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
