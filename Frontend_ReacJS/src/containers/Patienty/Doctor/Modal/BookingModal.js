
import React, { Component, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './BookingModal.scss'
import { LANGUAGES } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from 'lodash';
import DatePicker from "../../../../components/Input/DatePicker";
import { postPatientBookAppointmentService } from "../../../../services/userService";
import { toast } from 'react-toastify';
import Select from 'react-select';
import LoadingOverlay from 'react-loading-overlay';
import { emitter } from "../../../../utils/emitter";


class BookingModal extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            lastName: '',
            firstName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            listGender: '',
            selectedGender: '',
            doctorId: '',
            date: '',
            timeType: '',
            isShowLoading: false,
        };
        this.listenToEmitter();
    }

    componentDidMount() {
        this.props.getGenderStart();
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {
            this.setState({
                listGender: this.buildDataGender(this.props.genderRedux)

            })
        }

        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                listGender: this.buildDataGender(this.props.genderRedux)

            })
        }
        if (prevProps.dataScheduleTime !== this.props.dataScheduleTime) {
            // console.log('time', this.props.dataScheduleTime);
            if (this.props.dataScheduleTime && !_.isEmpty(this.props.dataScheduleTime)) {
                let doctorId = this.props.dataScheduleTime.doctorId;
                let date = this.props.dataScheduleTime.date;
                let timeType = this.props.dataScheduleTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    date: date,
                    timeType: timeType,
                })
            }
        }

    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }

    handleChangeSelectGender = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }


    handleOnchangeInput = (event, id) => {
        let valueDate = event.target.value;
        let copyValue = { ...this.state };
        copyValue[id] = valueDate;
        this.setState({
            ...copyValue,
        })
    }
    
    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0],
        })
    }

    buildDataTime = (dataScheduleTime) => {
        let { language } = this.props;
        if (dataScheduleTime && !_.isEmpty(dataScheduleTime)) {
            let time = language === LANGUAGES.VI ?
                dataScheduleTime.timeTypeData.valueVi
                : dataScheduleTime.timeTypeData.valueEn
            let date = language === LANGUAGES.VI ?
                moment.unix(+ dataScheduleTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+ dataScheduleTime.date / 1000).locale('en').format('dddd - DD/MM/YYYY')

            return (
                `${time} - ${date}`

            );

        }
        return ''
    }

    buildDataNameDoctor = (dataScheduleTime) => {
        let { language } = this.props;
        if (dataScheduleTime && !_.isEmpty(dataScheduleTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataScheduleTime.doctorData.lastName} ${dataScheduleTime.doctorData.firstName}`
                :
                `${dataScheduleTime.doctorData.firstName} ${dataScheduleTime.doctorData.lastName}`

            return name;

        }
        return ''
    }

    checkValidInput = () => {
        let isValid = true;
        let arrInput = [
            'lastName', 'firstName',
            'phoneNumber', 'email',
            'address', 'reason',
            'birthday', 'selectedGender',

        ];
        for (let i = 0; i < arrInput.length; i++) {
            console.log("check arr", arrInput[i]);
            if (!this.state[arrInput[i]]) {
                isValid = false;

                alert("Missing parameter: " + arrInput[i]);
                break;
            }
        }
        return isValid;
    };

    listenToEmitter() {
        emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
            //reset state
            this.setState({
                lastName: '',
                firstName: '',
                phoneNumber: '',
                email: '',
                address: '',
                reason: '',
                birthday: '',
                selectedGender: '',
             

            })
        });
    }

    handleBooking = async () => {
        let isValid = this.checkValidInput();
        if (isValid === true) {



            this.setState({
                isShowLoading: true,
            })
            let dataScheduleTime = this.props.dataScheduleTime;
            let time = this.buildDataTime(dataScheduleTime);
            let doctorName = this.buildDataNameDoctor(dataScheduleTime);
            let formatedDate = new Date(this.state.birthday).getTime();

            let res = await postPatientBookAppointmentService({
                doctorId: this.state.doctorId,
                lastName: this.state.lastName,
                firstName: this.state.firstName,
                birthday: formatedDate,
                email: this.state.email,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                reason: this.state.reason,
                date: this.state.date,
                timeType: this.state.timeType,
                gender: this.state.selectedGender.value,
                doctorName: doctorName,
                time: time,
                language: this.props.language,
            });
            this.setState({
                isShowLoading: false,
            })
            if (res && res.errCode === 0) {

                toast.success('booking clinic success !')
                

            } else {
                toast.warning('booking clinic failed !')
               
            }

            this.setState({
                lastName: '',
                firstName: '',
                phoneNumber: '',
                email: '',
                address: '',
                reason: '',
                birthday: '',
                selectedGender: '',
            })
            this.props.closeBookingModal();
        }

    }


    render() {
        let { doctorId } = this.state;
        let { isOpenModal, closeBookingModal, dataScheduleTime, language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        console.log(`Yesterday (oneliner)\n${yesterday}`);



        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading your content...'
            >
                <Modal
                    isOpen={isOpenModal}
                    // toggle={() => this.toggle()}
                    className={'booking-modal-container'}
                    size="lg"
                    centered

                >
                    <div className='booking-modal-content '>
                        <div className={'booking-modal-header'}>
                            <span className='left'>
                                <i class="fas fa-user-md mx-2"></i>
                                <FormattedMessage id="patient.patient-booking.title" />
                            </span>
                            <span className='right'
                                onClick={closeBookingModal}
                            >
                                <i className='fas fa-times'></i>
                            </span>
                        </div>
                        <div className='booking-modal-body m-2' >

                            <div className='doctor-info'>
                                <ProfileDoctor doctorId={doctorId}
                                    isShowProfileDoctor={false}
                                    dataScheduleTime={dataScheduleTime}
                                    isShowPrice={true}
                                    isShowLinkDetail={false}
                                />
                            </div>


                            <div className='row'>
                                <div className='col-6 form-group my-2'>
                                    <label>
                                        <FormattedMessage id="patient.patient-booking.firstName" />
                                    </label>
                                    <div className="wrap-input">
                                        <input
                                            value={this.state.firstName}
                                            onChange={(event) => this.handleOnchangeInput(event, 'firstName')}
                                            className='form-control data-input' placeholder='Ngoc Duy' />
                                        <span class="focus-input100"></span>
                                    </div>

                                </div>
                                <div className='col-6 form-group my-2'>
                                    <label>
                                        <FormattedMessage id="patient.patient-booking.lastName" />
                                    </label>
                                    <div className="wrap-input">
                                        <input
                                            value={this.state.lastName}
                                            onChange={(event) => this.handleOnchangeInput(event, 'lastName')}
                                            className='form-control data-input' placeholder='Lam' />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>
                                <div className='col-6 form-group my-2'>
                                    <label>
                                        <FormattedMessage id="patient.patient-booking.phone" />
                                    </label>
                                    <div className="wrap-input">
                                        <input className='form-control data-input'
                                            placeholder='0987677777'
                                            value={this.state.phoneNumber}
                                            onChange={(event) => { this.handleOnchangeInput(event, 'phoneNumber') }}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>
                                <div className='col-6 form-group my-2'>
                                    <label>
                                        <FormattedMessage id="patient.patient-booking.email" />

                                    </label>
                                    <div className="wrap-input">
                                        <input className='form-control data-input' placeholder='duy@gmail.com'
                                            value={this.state.email}
                                            onChange={(event) => { this.handleOnchangeInput(event, 'email') }}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>
                                <div className='col-12 form-group my-2'>
                                    <label>
                                        <FormattedMessage id="patient.patient-booking.address" />
                                    </label>
                                    <div className="wrap-input">
                                        <input className='form-control data-input' placeholder='Ca Mau'
                                            value={this.state.address}
                                            onChange={(event) => { this.handleOnchangeInput(event, 'address') }}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 form-group my-2'>
                                <label>
                                    <FormattedMessage id="patient.patient-booking.reason" />
                                </label>
                                <div className="wrap-input">
                                    <input className='form-control data-input' placeholder='ho'
                                        value={this.state.reason}
                                        onChange={(event) => { this.handleOnchangeInput(event, 'reason') }}
                                    />
                                    <span class="focus-input100"></span>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group my-2'>
                                    <label>
                                        <FormattedMessage id="patient.patient-booking.birthday" />
                                    </label>
                                    <div className='wrap-input'>
                                        <DatePicker
                                            onChange={this.handleOnChangeDatePicker}
                                            className="form-control data-input"
                                            value={this.state.birthday}
                                            maxDate={yesterday}
                                            placeholder="01/01/2001"

                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>
                                <div className='col-6 form-group my-3' >
                                    <label>
                                        <FormattedMessage id="patient.patient-booking.gender" />
                                    </label>
                                    <div className='wrap-input '>


                                        <Select

                                            value={this.state.selectedGender}
                                            onChange={this.handleChangeSelectGender}
                                            options={this.state.listGender}
                                        />
                                    </div>
                                </div>
                            </div>



                            {/* {JSON.stringify(dataScheduleTime)} */}

                        </div>
                        <div className={'booking-modal-footer'}>
                            <Button

                                className="btn btn-primary btn-save"
                                onClick={() => this.handleBooking()}
                            >
                                <FormattedMessage id="patient.patient-booking.save-appointment" />
                            </Button>
                            <Button

                                className="btn btn-warning btn-clean"
                                // onClick={() => this.toggle()}
                                onClick={closeBookingModal}
                            >
                                <FormattedMessage id="patient.patient-booking.close-appointment" />

                            </Button>
                        </div>
                    </div>

                </Modal>
            </LoadingOverlay>
        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
        genderRedux: state.admin.genders,

    };
};

const mapDispatchToProps = dispatch => {
    return {

        getGenderStart: () => { dispatch(actions.fetchGenderStart()) },

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingModal));
