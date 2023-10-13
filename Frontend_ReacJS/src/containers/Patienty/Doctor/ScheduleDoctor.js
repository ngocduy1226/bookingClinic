import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ScheduleDoctor.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getScheduleDoctorByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';
import { emitter } from "../../../utils/emitter";

class ScheduleDoctor extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            allDays: [],
            allTimes: [],
            isOpenModalBooking: false,
            dataScheduleTime: {},
        };
    }

    async componentDidMount() {
        let { language } = this.props;
        // console.log('moment vi', moment(new Date()).format('dddd - DD/MM'));
        // console.log('moment en', moment(new Date()).locale('en').format('ddd - DD/MM'));
        let allDays = this.getDaySchedule(language);
   
        if(this.props.doctorIdParent) {
            let res = await getScheduleDoctorByDateService(this.props.doctorIdParent, allDays[0].value);
            this.setState({
                allTimes: res.data ? res.data : [],

            })
        }

        this.setState({
            allDays: allDays,

        })


    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getDaySchedule = (language) => {
        let allDays = [];
      
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let DDMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${DDMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM')
                    object.label = this.capitalizeFirstLetter(labelVi);
                }

            } else {
                if (i === 0) {
                    let DDMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${DDMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
                }
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);

        }

        return allDays;
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {
            let allDays = this.getDaySchedule(this.props.language);
            this.setState({
                allDays: allDays,

            })
        }

        if (prevProps.doctorIdParent !== this.props.doctorIdParent) {
            let allDays = this.getDaySchedule(this.props.language);
            let res = await getScheduleDoctorByDateService(this.props.doctorIdParent, allDays[0].value);
            this.setState({
                allTimes: res.data ? res.data : [],

            })
        }

    }

    onChangeSelect = async (event) => {
        let doctorId = this.props.doctorIdParent;
        let date = event.target.value;
        if (doctorId && doctorId !== -1) {
            let res = await getScheduleDoctorByDateService(doctorId, date);
            if (res && res.errCode === 0) {
                this.setState({
                    allTimes: res.data
                })
            }
          

        }

    }

    onClickHandleSchedule = (time) => {
       
         this.setState({
            isOpenModalBooking: true,
            dataScheduleTime: time,
        
         })

    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false,
        
         })

         emitter.emit("EVENT_CLEAR_MODAL_DATA");
    }
    
    render() {
        let { allDays, allTimes } = this.state;
        let { language } = this.props;
    


        return (
            <>
                <div className='container-schedule-doctor'>

                    <div className='select-all-time'>
                        <select onChange={(event) => this.onChangeSelect(event)}>
                            {allDays && allDays.length > 0 && allDays.map((item, index) => {
                                return (
                                    <option value={item.value}
                                        key={index}>
                                        {item.label}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className='all-time-valid-doctor'>
                        <div className='text-calendar'>
                            <span>  <i className="fas fa-calendar-alt"> </i>
                                <FormattedMessage id="patient.doctor-detail.schedule" />
                            </span>
                        </div>
                        <div className='schedule-calendar'>
                            
                                {allTimes && allTimes.length > 0 ?
                                    <>
                                        <div className='schedule-btns'>
                                            {
                                                allTimes.map((item, index) => {
                                                    let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn;

                                                    return (
                                                        <button 
                                                        onClick={ () => this.onClickHandleSchedule(item)}
                                                        key={index} 
                                                        className={language === LANGUAGES.VI ? 'btn btn-warning btn-time btn-vi' : 'btn btn-warning btn-time btn-en'} >{timeDisplay}</button>
                                                    );
                                                })
                                            }
                                        </div>

                                        <div className='schedule-text'>
                                            <FormattedMessage id= "patient.doctor-detail.choose"  />
                                            <i className='far fa-hand-point-up'></i>
                                            <FormattedMessage id= "patient.doctor-detail.book-free"  />
                                        </div>
                                    </>

                                    :
                                    <div className='no-schedule'>  <FormattedMessage id="patient.doctor-detail.no-schedule" /> </div>
                                }
                    




                        </div>
                    </div>
                </div>

                <BookingModal 
                   dataScheduleTime = { this.state.dataScheduleTime }
                   closeBookingModal = {this.closeBookingModal}
                   isOpenModal = {this.state.isOpenModalBooking}
                />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {


    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleDoctor));
