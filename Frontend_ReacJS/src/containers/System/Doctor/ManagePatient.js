import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ManagePatient.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import DatePicker from "../../../components/Input/DatePicker";
import { getAllPatientForDoctor, postSendEmailPatientService } from "../../../services/userService"
import ModalSendMail from './ModalSendMail';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';




class ManagePatient extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenModal: false,
            dataBooking: {},
            isShowLoading: false,
        };
    }

    async componentDidMount() {

        this.handleGetPatient();

    }

    handleGetPatient = async () => {

        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();

        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate,
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
    render() {

        let { dataPatient, isOpenModal, dataBooking } = this.state;
        let {language} = this.props;

        return (
            <>

                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading your content...'
                >


                    <div className='manage-patient-container container'>
                        <div className="title-patient"><FormattedMessage id="manage-patient.title-patient"/></div>
                        <div className='content-manage row'>
                            <div className='title-manage-patient-sub'><FormattedMessage id="manage-patient.title-manage-patient-sub"/></div>
                           <div className='title-manage-patient'><FormattedMessage id="manage-patient.title-manage-patient"/></div>
                            <div className='manage-patient-date form-group col-6'>
                                <label><FormattedMessage id="manage-patient.choose-date"/></label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}

                                />
                            </div>
                            <div className='table-manage-patient col-12'>
                                <table class="table table-hover table-striped table-bordered">
                                    <thead className="thead-dark " >
                                        <tr className="table-dark">
                                            <th scope="col">#</th>
                                            <th scope="col"><FormattedMessage id="manage-patient.time"/></th>
                                            <th scope="col"><FormattedMessage id="manage-patient.fullName"/></th>
                                           
                                            <th scope="col"><FormattedMessage id="manage-patient.gender"/></th>
                                            <th scope="col"><FormattedMessage id="manage-patient.address"/></th>
                                            <th scope="col"><FormattedMessage id="manage-patient.reason"/></th>
                                            <th scope="col"><FormattedMessage id="manage-patient.action"/></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        {language === LANGUAGES.VI ?
                                                        <>
                                                           <td>{item.timeTypePatient.valueVi}</td>
                                                        <td>{item.userData.lastName + " " + item.userData.firstName}</td>
                                                        <td>{item.userData.genderData.valueVi}</td>
                                                        </>
                                                        :
                                                        <>
                                                           <td>{item.timeTypePatient.valueEn}</td>
                                                        <td>{item.userData.firstName + " " + item.userData.lastName }</td>
                                                        <td>{item.userData.genderData.valueEn}</td>
                                                        </>
                                                    }
                                                     
                                                          <td>{item.userData.address}</td>
                                                        <td>{item.reason}</td>
                                                        <td>

                                                            <button className='btn btn-warning mx-1 btn-print'
                                                                onClick={() => this.confirmSend(item)}
                                                            > <FormattedMessage id="manage-patient.confirm" /></button>
                                                        </td>
                                                    </tr>
                                                );
                                            })

                                            :
                                            <tr className='text-center'>
                                                <td Colspan='7'>   <FormattedMessage  id="manage-patient.empty-data"/> </td>


                                            </tr>
                                        }


                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                    <ModalSendMail
                        isOpenModal={isOpenModal}
                        closeModal={this.closeModal}
                        dataBooking={dataBooking}
                        sendEmail={this.sendEmail}
                    />

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


    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManagePatient));
