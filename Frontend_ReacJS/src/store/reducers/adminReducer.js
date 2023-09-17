import { startCase } from 'lodash';
import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctors: [],
    allDoctors: [],
    detailDoctor: [],
    infoDoctor: [],
    allScheduleTime: [],

    allRequiredDoctorInfo: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            state.isLoadingGender = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            let copyState = { ...state };
            copyState.genders = action.data;
            copyState.isLoadingGender = false;
            return {
                ...copyState,
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGender = true;
            state.genders = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            let copyState1 = { ...state };
            copyState1.positions = action.data;
            return {
                ...copyState1,
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            let copyState2 = { ...state };
            copyState2.roles = action.data;
            return {
                ...copyState2,
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            state.topDoctors = action.dataDoctors;
            return {
                ...state,
            }
        case actionTypes.FETCH_TOP_DOCTOR_FAILED:
            state.topDoctors = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
            state.allDoctors = action.dataDoctors;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTOR_FAILED:
            state.allDoctors = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_DETAIL_DOCTOR_SUCCESS:
            state.detailDoctor = action.dataDoctor;
            return {
                ...state,
            }
        case actionTypes.FETCH_DETAIL_DOCTOR_FAILED:
            state.detailDoctor = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_INFO_DOCTOR_MARKDOWN_SUCCESS:
            state.infoDoctor = action.infoDoctor;
            return {
                ...state,
            }
        case actionTypes.FETCH_INFO_DOCTOR_MARKDOWN_FAILED:
            state.infoDoctor = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            state.allScheduleTime = action.dataTimes;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            state.allScheduleTime = [];
            return {
                ...state,
            }
            case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS:
            state.allRequiredDoctorInfo = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED:
            state.allRequiredDoctorInfo = [];
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;