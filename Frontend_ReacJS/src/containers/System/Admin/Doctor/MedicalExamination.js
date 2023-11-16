import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './MedicalExamination.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import DatePicker from "../../../../components/Input/DatePicker";
import { getAllPatientForDoctor, postSendEmailPatientService } from "../../../../services/userService"
// import ModalSendMail from './ModalSendMail';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import Select from 'react-select';
import _ from 'lodash';
import TableMedicalExamination from './TableMedicalExamination';


class MedicalExamination extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenModal: false,
            dataBooking: {},
            isShowLoading: false,
            listDoctors: [],
            selectedDoctor: {},
        };
    }

    async componentDidMount() {

        this.handleGetPatient();
        this.props.fetchAllDoctorsRedux();

    }

    handleGetPatient = async () => {

        let { currentDate, selectedDoctor } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        let id = selectedDoctor.value ? selectedDoctor.value : 'ALL'
        let res = await getAllPatientForDoctor({
            doctorId: id,
            date: formatedDate,
            patientId: "ALL",
            status: "S2"
        });
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.patient,
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.allDoctors !== this.props.allDoctors) {

            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }

       

    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {

            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === language.EN ? labelEn : labelVi;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }



    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        }, async () => {
            await this.handleGetPatient();
        })
    }

    confirmSend = (item) => {
    
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.userData.email,
            timeType: item.timeType,
            patientName: item.userData.firstName,
        }


        this.setState({
            isOpenModal: true,
            dataBooking: data,
        })

    }

    closeModal = () => {
        this.setState({
            isOpenModal: false,
        })
    }

    sendEmail = async (dataSendMail) => {

        this.setState({
            isShowLoading: true,
        })
        let dataBooking = this.state.dataBooking;


        let res = await postSendEmailPatientService({
            doctorId: dataBooking.doctorId,
            patientId: dataBooking.patientId,
            timeType: dataBooking.timeType,
            email: dataSendMail.email,
            imageBase64: dataSendMail.imageBase64,
            language: this.props.language,
            patientName: dataBooking.patientName,

        })

        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false,
            })
            toast.success('send email success');
            this.handleGetPatient();
            this.closeModal();


        } else {
            this.setState({
                isShowLoading: false,
            })
            toast.error('send email failed');
            console.log('check error', res);

        }

    }

    handleChangeSelect = async (selectedDoctor) => {

        this.setState({ selectedDoctor }, async () => {
                await this.handleGetPatient();
                console.log(`Option selected:`, this.state.selectedDoctor)
            });


    };
    
  
    handleOnchangeSearch = (event) => {
        console.log('event', event.target.value.toLowerCase());
        let lowerCase = event.target.value;
        let listPatient = this.state.dataPatient;
        let data = listPatient.filter((item) => {
    
            if (lowerCase === '') {
                return;
            } else {
                return item && item.userData.firstName.toLowerCase().includes(lowerCase) ;

            }
        })

            if (!_.isEmpty(data)) {
            this.setState({
                dataPatient: data
            })
        } else {
            this.handleGetPatient();

        }

    }



    render() {

        let { dataPatient, isOpenModal, dataBooking } = this.state;
        let {language} = this.props;
       console.log('statsu', this.state);
        return (
            <>

                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading your content...'
                >


                    <div className='manage-patient-container container'>
                        <div className="title-patient"><FormattedMessage id="manage-patient.title-patient"/></div>
                        <TableMedicalExamination />
                    </div>
                    {/* <ModalSendMail
                        isOpenModal={isOpenModal}
                        closeModal={this.closeModal}
                        dataBooking={dataBooking}
                        sendEmail={this.sendEmail}
                    /> */}

                </LoadingOverlay>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
        user: state.user.userInfo,
       
    };
};

const mapDispatchToProps = dispatch => {
    return {

        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalExamination));
