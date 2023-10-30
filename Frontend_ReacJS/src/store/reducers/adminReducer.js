import { startCase } from 'lodash';
import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    dosages: [],
    frequencies: [],
    positions: [],
    users: [],
    user: [],
    medicines: [],
    topDoctors: [],
    allDoctors: [],
    detailDoctor: [],
    infoDoctor: [],
    allScheduleTime: [],
    formularies: [],
    allRequiredDoctorInfo: [],
    allPresByPatient: [],
    arrScheduleDoctor: [],
    allClinic: [],
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
        case actionTypes.FETCH_DOSAGE_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_DOSAGE_SUCCESS:
            state.dosages = action.dosageData;

            return {
                ...state,
            }
        case actionTypes.FETCH_DOSAGE_FAILED:
            state.dosages = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_FREQUENCY_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_FREQUENCY_SUCCESS:
            state.frequencies = action.frequencyData;
            return {
                ...state,
            }
        case actionTypes.FETCH_FREQUENCY_FAILED:
            state.frequencies = [];
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
        case actionTypes.FETCH_USER_SUCCESS:
            state.user = action.users;
            return {
                ...state,
            }
        case actionTypes.FETCH_USER_FAILED:
            state.user = [];
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
        case actionTypes.FETCH_MEDICINE_SUCCESS:
            state.medicines = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_MEDICINE_FAILED:
            state.medicines = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_FORMULARY_SUCCESS:
            state.formularies = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_FORMULARY_FAILED:
            state.formularies = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRESCRIPTION_BY_PATIENT_ID_SUCCESS:
            state.allPresByPatient = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRESCRIPTION_BY_PATIENT_ID_FAILED:
            state.allPresByPatient = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_SCHEDULE_BY_DOCTOR_ID_SUCCESS:
            state.arrScheduleDoctor = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_SCHEDULE_BY_DOCTOR_ID_FAILED:
            state.arrScheduleDoctor = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_CLINICS_SUCCESS:
            state.allClinic = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_CLINICS_FAILED:
            state.allClinic = [];
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;

