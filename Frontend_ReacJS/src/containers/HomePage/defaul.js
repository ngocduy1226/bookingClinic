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


class ScheduleDoctor extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
           
        };
    }

    componentDidMount() {
      
    }
     
    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        // if (prevProps.doctorIdParent !== this.props.doctorIdParent) {
        //     let allDays = this.getDaySchedule(this.props.language);
        //     let res = await getBookingModalByDateService(this.props.doctorIdParent, allDays[0].value);
        //     this.setState({
        //         allTimes: res.data ? res.data : [],

        //     })
        // }

    }
     

    
    
    render() {
        
    


        return (
            <div> ddsf</div>
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
