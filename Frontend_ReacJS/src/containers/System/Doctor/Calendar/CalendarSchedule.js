import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './CalendarSchedule.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
// needed for dayClick
import { Calendar } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'




class CalendarSchedule extends Component {


  constructor(prop) {
    super(prop);
    this.state = {
      listScheduleDoctor: []
    };
  }

  componentDidMount() {
 
  }

  async componentDidUpdate(prevProps, prevState, snapchot) {
    if (prevProps.language !== this.props.language) {

    }

    if (prevProps.listScheduleDoctorParent !== this.props.listScheduleDoctorParent) {
      this.setState({
        listScheduleDoctor: this.props.listScheduleDoctorParent,

      })
    }

  }


  render() {

    console.log('state con', this.state);


    return (
      <div className='fullCalendar-container'>
        <FullCalendar

          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={this.state.listScheduleDoctor}
          _event_height = {{
            height: '30px'
          }}
          headerToolbar={{
            left: 'today prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          eventShortHeight = {{
            Number, default: 60
          }}
          eventMinHeight = {{
            Number, default: 60
          }}

          height={"90vh"}
        />

      </div>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CalendarSchedule));
