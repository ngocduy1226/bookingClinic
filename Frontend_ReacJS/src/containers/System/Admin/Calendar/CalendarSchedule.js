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
    let user = this.props.user
    this.props.fetchAllScheduleByIdDoctor(user.id);
  }

  async componentDidUpdate(prevProps, prevState, snapchot) {
    if (prevProps.language !== this.props.language) {

    }

    if (prevProps.arrScheduleDoctor !== this.props.arrScheduleDoctor) {

      this.setState({
        listScheduleDoctor: this.props.arrScheduleDoctor,

      })
    }

  }


  render() {

    console.log('state', this.state);


    return (
      <div className='fullCalendar-container'>
        <FullCalendar

          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"

          events={this.state.listScheduleDoctor}

          headerToolbar={{
            left: 'today prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
    arrScheduleDoctor: state.admin.arrScheduleDoctor
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllScheduleByIdDoctor: (id) => dispatch(actions.fetchAllScheduleByIdDoctor(id))

  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CalendarSchedule));
