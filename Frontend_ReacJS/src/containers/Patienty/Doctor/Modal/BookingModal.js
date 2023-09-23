import React, { Component } from 'react';
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


class BookingModal extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            listGender: '',
            selectedGender : '',            
            doctorId: '',
            date: '',
            timeType: '',
        };
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

    buildDataGender  = (data) => {
        let result = [];
        let language = this.props.language;
        if(data && data.length > 0) {
            data.map(item => {
                let object  = {};
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
        let {language} = this.props;
        if (dataScheduleTime && !_.isEmpty(dataScheduleTime)) {
           let time = language === LANGUAGES.VI ?
            dataScheduleTime.timeTypeData.valueVi
            : dataScheduleTime.timeTypeData.valueEn
           let date = language === LANGUAGES.VI ?  
           moment.unix( + dataScheduleTime.date /1000).format('dddd - DD/MM/YYYY')
           :
           moment.unix( + dataScheduleTime.date /1000 ).locale('en').format('dddd - DD/MM/YYYY')

            return (
                 `${time} - ${date}`
             
            );
            
        }
        return ''
    }

    buildDataNameDoctor = (dataScheduleTime) => {
        let {language} = this.props;
        if (dataScheduleTime && !_.isEmpty(dataScheduleTime)) {
           let name = language === LANGUAGES.VI ?
           `${dataScheduleTime.doctorData.lastName} ${dataScheduleTime.doctorData.firstName}`
           :
           `${dataScheduleTime.doctorData.firstName} ${dataScheduleTime.doctorData.lastName}`
            
           return name;
            
        }
        return ''
    }

    handleBooking = async () => {
        
        let dataScheduleTime = this.props.dataScheduleTime;
        let time = this.buildDataTime(dataScheduleTime);
        let doctorName = this.buildDataNameDoctor(dataScheduleTime);
        
        let res = await postPatientBookAppointmentService({
            doctorId: this.state.doctorId,
            fullName: this.state.fullName,
            email: this.state.email,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            reason: this.state.reason,
            date: this.state.date,
            timeType: this.state.timeType,
            gender: this.state.selectedGender.value,
            doctorName : doctorName,
            time: time,
            language:  this.props.language,
        });

        if (res && res.errCode === 0) {
            toast.success('booking clinic success !')
            this.props.closeBookingModal();
        } else {
            toast.warning('booking clinic failed !')

        }

    }

    
    render() {
        let {  doctorId } = this.state;
        let { isOpenModal, closeBookingModal, dataScheduleTime, language } = this.props;

        return (

            <Modal
                isOpen={isOpenModal}
                // toggle={() => this.toggle()}
                className={'booking-modal-container'}
                size="lg"
                centered
            >
                <div className='booking-modal-content'>
                    <div className={'booking-modal-header'}>
                        <span className='left'> 
                        <FormattedMessage  id="patient.patient-booking.title"/>
                        </span>
                        <span className='right'
                            onClick={closeBookingModal}
                        >
                            <i className='fas fa-times'></i>
                        </span>
                    </div>
                    <div className={'booking-modal-body'} >

                        <div className='doctor-info'>
                            <ProfileDoctor doctorId={doctorId}
                                isShowProfileDoctor={false}
                                dataScheduleTime={dataScheduleTime}
                            />
                        </div>


                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>
                                <FormattedMessage  id="patient.patient-booking.name"/>
                                </label>
                                <input
                                    value={this.state.fullName}
                                    onChange={(event) => this.handleOnchangeInput(event, 'fullName')}
                                    className='form-control' placeholder='Lam Ngoc Duy' />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                <FormattedMessage  id="patient.patient-booking.phone"/>
                                </label>
                                <input className='form-control'
                                    placeholder='Lam Ngoc Duy'
                                    value={this.state.phoneNumber}
                                    onChange={(event) => { this.handleOnchangeInput(event, 'phoneNumber') }}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                <FormattedMessage  id="patient.patient-booking.email"/>

                                </label>
                                <input className='form-control' placeholder='Lam Ngoc Duy'
                                    value={this.state.email}
                                    onChange={(event) => { this.handleOnchangeInput(event, 'email') }}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                <FormattedMessage  id="patient.patient-booking.address"/>
                                </label>
                                <input className='form-control' placeholder='Lam Ngoc Duy'
                                    value={this.state.address}
                                    onChange={(event) => { this.handleOnchangeInput(event, 'address') }}
                                />
                            </div>
                            <div className='col-12 form-group'>
                                <label>
                                <FormattedMessage  id="patient.patient-booking.reason"/>
                                </label>
                                <input className='form-control' placeholder='Lam Ngoc Duy'
                                    value={this.state.reason}
                                    onChange={(event) => { this.handleOnchangeInput(event, 'reason') }}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    Ngayf sinh
                                </label>

                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.birthday}

                                />

                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                <FormattedMessage  id="patient.patient-booking.gender"/>
                                </label>
                                 
                                 <Select 
                                    value={this.state.selectedGender}
                                    onChange = {this.handleChangeSelectGender}
                                    options = {this.state.listGender}
                                 />
                            </div>
                    
                        </div>
                        {/* {JSON.stringify(dataScheduleTime)} */}

                    </div>
                    <div className={'booking-modal-footer'}>
                        <Button

                            className="px-3 btn btn-primary btn-save"
                            onClick={() => this.handleBooking()}
                        >
                        <FormattedMessage  id="patient.patient-booking.save-appointment"/>
                        </Button>
                        <Button

                            className="px-3 btn btn-warning "
                            // onClick={() => this.toggle()}
                            onClick={closeBookingModal}
                        >
                            <FormattedMessage  id="patient.patient-booking.close-appointment"/>

                        </Button>
                    </div>
                </div>

            </Modal>
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
