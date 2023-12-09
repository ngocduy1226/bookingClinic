const actionTypes = Object.freeze({
    //app
    APP_START_UP_COMPLETE: 'APP_START_UP_COMPLETE',
    SET_CONTENT_OF_CONFIRM_MODAL: 'SET_CONTENT_OF_CONFIRM_MODAL',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',


    // //admin
    // ADMIN_LOGIN_SUCCESS: 'ADMIN_LOGIN_SUCCESS',
    // ADMIN_LOGIN_FAIL: 'ADMIN_LOGIN_FAIL',
    // PROCESS_LOGOUT: 'PROCESS_LOGOUT',

    //user
    ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',
    USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
    USER_LOGIN_FAIL: 'USER_LOGIN_FAIL',
    PROCESS_LOGOUT: 'PROCESS_LOGOUT',

    //admin
    FETCH_GENDER_START: 'FETCH_GENDER_START',
    FETCH_GENDER_SUCCESS: 'FETCH_GENDER_SUCCESS',
    FETCH_GENDER_FAILED: 'FETCH_GENDER_FAILED',

    FETCH_POSITION_START: 'FETCH_POSITION_START',
    FETCH_POSITION_SUCCESS: 'FETCH_POSITION_SUCCESS',
    FETCH_POSITION_FAILED: 'FETCH_POSITION_FAILED',

    FETCH_ROLE_START: 'FETCH_ROLE_START',
    FETCH_ROLE_SUCCESS: 'FETCH_ROLE_SUCCESS',
    FETCH_ROLE_FAILED: 'FETCH_ROLE_FAILED',

    FETCH_DOSAGE_START: 'FETCH_DOSAGE_START',
    FETCH_DOSAGE_SUCCESS: 'FETCH_DOSAGE_SUCCESS',
    FETCH_DOSAGE_FAILED: 'FETCH_DOSAGE_FAILED',

    FETCH_FREQUENCY_START: 'FETCH_FREQUENCY_START',
    FETCH_FREQUENCY_SUCCESS: 'FETCH_FREQUENCY_SUCCESS',
    FETCH_FREQUENCY_FAILED: 'FETCH_FREQUENCY_FAILED',
    
    CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
    CREATE_USER_FAILED : ' CREATE_USER_FAILED',
    
    FETCH_ALL_USERS_SUCCESS: 'FETCH_ALL_USERS_SUCCESS',
    FETCH_ALL_USERS_FAILED: 'FETCH_ALL_USERS_FAILED',
   
    
    FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',
    FETCH_USER_FAILED: 'FETCH_USER_FAILED',

    DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
    DELETE_USER_FAILED: 'DELETE_USER_FAILED',

    RESTORE_USER_SUCCESS: 'RESTORE_USER_SUCCESS',
    RESTORE_USER_FAILED: 'RESTORE_USER_FAILED',

    EDIT_USER_SUCCESS: 'EDIT_USER_SUCCESS',
    EDIT_USER_FAILED : ' EDIT_USER_FAILED',

    FETCH_TOP_DOCTOR_START: 'FETCH_TOP_DOCTOR_START',
    FETCH_TOP_DOCTOR_SUCCESS: 'FETCH_TOP_DOCTOR_SUCCESS',
    FETCH_TOP_DOCTOR_FAILED: 'FETCH_TOP_DOCTOR_FAILED',

    FETCH_ALL_DOCTOR_SUCCESS: 'FETCH_ALL_DOCTOR_SUCCESS',
    FETCH_ALL_DOCTOR_FAILED: 'FETCH_ALL_DOCTOR_FAILED',

    SAVE_INFO_DOCTOR_SUCCESS: 'SAVE_INFO_DOCTOR_SUCCESS',
    SAVE_INFO_DOCTOR_FAILED: 'SAVE_INFO_DOCTOR_FAILED',

    FETCH_INFO_DOCTOR_MARKDOWN_SUCCESS: 'FETCH_INFO_DOCTOR_MARKDOWN_SUCCESS',
    FETCH_INFO_DOCTOR_MARKDOWN_FAILED: 'FETCH_INFO_DOCTOR_MARKDOWN_FAILED',

    FETCH_DETAIL_DOCTOR_SUCCESS: 'FETCH_DETAIL_DOCTOR_SUCCESS',
    FETCH_DETAIL_DOCTOR_FAILED: 'FETCH_DETAIL_DOCTOR_FAILED',

    FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS: 'FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS',
    FETCH_ALLCODE_SCHEDULE_TIME_FAILED: 'FETCH_ALLCODE_SCHEDULE_TIME_FAILED',
    
    FETCH_REQUIRED_DOCTOR_INFO_START: 'FETCH_REQUIRED_DOCTOR_INFO_START',
    FETCH_REQUIRED_DOCTOR_INFO_SUCCESS: 'FETCH_REQUIRED_DOCTOR_INFO_SUCCESS',
    FETCH_REQUIRED_DOCTOR_INFO_FAILED: 'FETCH_REQUIRED_DOCTOR_INFO_FAILED',

    FETCH_MEDICINE_START: 'FETCH_MEDICINE_START',
    FETCH_MEDICINE_SUCCESS: 'FETCH_MEDICINE_SUCCESS',
    FETCH_MEDICINE_FAILED: 'FETCH_MEDICINE_FAILED',

    FETCH_FORMULARY_SUCCESS: 'FETCH_FORMULARY_SUCCESS',
    FETCH_FORMULARY_FAILED: 'FETCH_FORMULARY_FAILED',


    FETCH_ALL_PRESCRIPTION_BY_PATIENT_ID_SUCCESS: 'FETCH_ALL_PRESCRIPTION_BY_PATIENT_ID_SUCCESS',
    FETCH_ALL_PRESCRIPTION_BY_PATIENT_ID_FAILED: 'FETCH_ALL_PRESCRIPTION_BY_PATIENT_ID_FAILED',

   
    FETCH_ALL_SCHEDULE_BY_DOCTOR_ID_SUCCESS: 'FETCH_ALL_SCHEDULE_BY_DOCTOR_ID_SUCCESS',
    FETCH_ALL_SCHEDULE_BY_DOCTOR_ID_FAILED: 'FETCH_ALL_SCHEDULE_BY_DOCTOR_ID_FAILED',
  
    FETCH_SCHEDULE_DOCTOR_BY_DATE_SUCCESS: 'FETCH_SCHEDULE_DOCTOR_BY_DATE_SUCCESS',
    FETCH_SCHEDULE_DOCTOR_BY_DATE_FAILED: 'FETCH_SCHEDULE_DOCTOR_BY_DATE_FAILED',

    FETCH_ALL_CLINICS_SUCCESS: 'FETCH_ALL_CLINICS_SUCCESS',
    FETCH_ALL_CLINICS_FAILED: 'FETCH_ALL_CLINICS_FAILED',

    FETCH_ALL_ROOMS_SUCCESS: 'FETCH_ALL_ROOMS_SUCCESS',
    FETCH_ALL_ROOMS_FAILED: 'FETCH_ALL_ROOMS_FAILED',

    FETCH_ALL_SCHEDULE_BUSINESS_HOURS_SUCCESS: 'FETCH_ALL_SCHEDULE_BUSINESS_HOURS_SUCCESS',
    FETCH_ALL_SCHEDULE_BUSINESS_HOURS_FAILED: 'FETCH_ALL_SCHEDULE_BUSINESS_HOURS_FAILED',

    FETCH_SCHEDULE_ROOMS_BY_DATE_FAILED: 'FETCH_SCHEDULE_ROOMS_BY_DATE_FAILED',
    FETCH_SCHEDULE_ROOMS_BY_DATE_SUCCESS: 'FETCH_SCHEDULE_ROOMS_BY_DATE_SUCCESS',


    FETCH_ALL_SPECIALTY_SUCCESS: 'FETCH_ALL_SPECIALTY_SUCCESS',
    FETCH_ALL_SPECIALTY_FAILED: 'FETCH_ALL_SPECIALTY_FAILED',
 
    FETCH_TOTAL_USER_SUCCESS: 'FETCH_TOTAL_USER_SUCCESS',
    FETCH_TOTAL_USER_FAILED: 'FETCH_TOTAL_USER_FAILED',

    FETCH_TOTAL_CLINIC_SUCCESS: 'FETCH_TOTAL_CLINIC_SUCCESS',
    FETCH_TOTAL_CLINIC_FAILED: 'FETCH_TOTAL_CLINIC_FAILED',

    FETCH_TOTAL_DOCTOR_SUCCESS: 'FETCH_TOTAL_DOCTOR_SUCCESS',
    FETCH_TOTAL_DOCTOR_FAILED: 'FETCH_TOTAL_DOCTOR_FAILED',

    FETCH_TOTAL_PRESCRIPTION_SUCCESS: 'FETCH_TOTAL_PRESCRIPTION_SUCCESS',
    FETCH_TOTAL_PRESCRIPTION_FAILED: 'FETCH_TOTAL_PRESCRIPTION_FAILED',

    FETCH_COMMENT_SUCCESS: 'FETCH_COMMENT_SUCCESS',
    FETCH_COMMENT_FAILED: 'FETCH_COMMENT_FAILED',

    FETCH_COMMENT_BY_DOCTOR_SUCCESS: 'FETCH_COMMENT_BY_DOCTOR_SUCCESS',
    FETCH_COMMENT_BY_DOCTOR_FAILED: 'FETCH_COMMENT_BY_DOCTOR_FAILED',

})

export default actionTypes;


//getInfoDoctorMarkdownService