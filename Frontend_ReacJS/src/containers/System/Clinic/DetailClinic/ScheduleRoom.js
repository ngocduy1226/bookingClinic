import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ScheduleRoom.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getScheduleRoomByDateService, bulkCreateBusinessHoursService } from "../../../../services/clinicService"
import { FormattedMessage } from 'react-intl';
import DatePicker from "../../../../components/Input/DatePicker";
import { toast } from 'react-toastify';
import _ from 'lodash';

import CalendarSchedule from '../../Doctor/Calendar/CalendarSchedule';


class ScheduleRoom extends Component {

      constructor(prop) {
            super(prop);
            this.state = {
                  currentDate: moment(new Date(new Date().setDate(new Date().getDate() + 1))).startOf('day').valueOf(),
                  rangeTime: {},
                  clinicId: '',
            };
      }
      initSchedule = () => {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {

                  data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                  rangeTime: data,
            })
      }


      async componentDidMount() {
            this.props.fetchAllCodeScheduleTimeRedux();
            this.setState({
                  clinicId: this.props.clinicId
            }, async () => {
                  await this.getSchedule(this.state.currentDate);
                  await this.props.getAllScheduleBusinessHours(this.props.clinicId);
            })


      }

      getSchedule = async (date) => {

            let res = await getScheduleRoomByDateService({
                  clinic: this.state.clinicId,
                  currentDate: date
            });
            this.setState({
                  allTimes: res.data ? res.data : [],

            })
            let { allTimes } = this.state;
            if (allTimes && allTimes.length > 0) {
                  for (let i = 0; i < allTimes.length; i++) {
                        let { rangeTime } = this.state;
                        if (rangeTime && rangeTime.length > 0) {
                              rangeTime = rangeTime.map(item => {
                                    if (item.keyMap === allTimes[i].timeType) {
                                          item.isSelected = true;
                                    }
                                    return item
                              })
                              this.setState({
                                    rangeTime: rangeTime,
                              })
                        }
                  }
            }
      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
                  this.initSchedule();


            }

            if (prevProps.clinicId !== this.props.clinicId) {
                  this.setState({
                        clinicId: this.props.clinicId
                  }, async () => {
                        await this.getSchedule(this.state.currentDate);
                  })


            }

            if (prevProps.arrScheduleClinic !== this.props.arrScheduleClinic) {

                  this.setState({
                        listSchedule: this.props.arrScheduleClinic,

                  })
            }
      }

      handleOnChangeDatePicker = async (date) => {
            this.initSchedule();
            this.setState({
                  currentDate: date[0],
            })

            let currentDate = new Date(date[0]).getTime();
            await this.getSchedule(currentDate);


      }

      handleClickBtnTime = (time) => {
            let { rangeTime } = this.state;
            if (rangeTime && rangeTime.length > 0) {
                  rangeTime = rangeTime.map(item => {
                        if (item.id === time.id) {
                              item.isSelected = !item.isSelected;
                        }
                        return item
                  })
                  this.setState({
                        rangeTime: rangeTime,
                  })
            }

      }



      handleSaveSchedule = async () => {
            let result = [];
            let { rangeTime, currentDate, clinicId } = this.state;

            if (!currentDate) {
                  toast.error('Invalid choose date!');
                  return;
            }

            let formatedDate = new Date(currentDate).getTime();

            if (rangeTime && rangeTime.length > 0) {
                  let selectedTime = rangeTime.filter(item => item.isSelected === true);
                  if (selectedTime && selectedTime.length > 0) {
                        selectedTime.map((schedule) => {
                              let object = {};
                              object.clinicId = clinicId;
                              object.date = formatedDate;
                              object.timeType = schedule.keyMap;
                              result.push(object);
                        })



                  } else {
                        toast.error('Invalid choose time!');
                        return;
                  }
            }

            let res = await bulkCreateBusinessHoursService({
                  arrSchedule: result,
                  clinicId: clinicId,
                  formatedDate: formatedDate,
            });
            if (res.errCode === 0) {
                  toast.success('Create schedule success!');
                  this.props.getAllScheduleBusinessHours(this.props.clinicId);



            } else {
                  toast.error('Create schedule failed!');
                  console.log('res failed', res);

            }


      }



      render() {
            console.log('check state', this.state);
            let rangeTime = this.state.rangeTime;
            let language = this.props.language;
            let yesterday = new Date(new Date().setDate(new Date().getDate()));
            console.log(`Yesterday (oneliner)\n${yesterday}`);

            return (
                  <div className='schedule-room-container'>

                        <div className='row'>

                              <div className='col-6 form-group'>
                                    <label>
                                          <FormattedMessage id="manage-schedule.choose-date" />
                                    </label>
                                    <DatePicker
                                          onChange={this.handleOnChangeDatePicker}
                                          className="form-control"
                                          value={this.state.currentDate}
                                          minDate={yesterday}
                                    />

                              </div>
                        </div>

                        <div className='row'>
                              <div className='col-12 pick-hour-container'>
                                    {rangeTime && rangeTime.length > 0 &&
                                          rangeTime.map((item, index) => {
                                                return (
                                                      <button className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                                            onClick={() => this.handleClickBtnTime(item)}
                                                            key={index}>
                                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                      </button>
                                                );
                                          })
                                    }
                              </div>
                        </div>
                        <div className='btn-save-schedule'>
                              <button className='btn btn-primary'
                                    onClick={() => this.handleSaveSchedule()}
                              >
                                    <FormattedMessage id="manage-schedule.save" />
                              </button>

                        </div>


                        <div>

                              <CalendarSchedule
                                    listScheduleDoctorParent={this.state.listSchedule} />
                        </div>

                  </div>
            );
      }

}

const mapStateToProps = state => {
      return {
            allScheduleTime: state.admin.allScheduleTime,
            language: state.app.language,
            arrScheduleClinic: state.admin.arrScheduleClinic
      };
};

const mapDispatchToProps = dispatch => {
      return {
            getAllScheduleBusinessHours: (id) => dispatch(actions.getAllScheduleBusinessHours(id)),
            fetchAllCodeScheduleTimeRedux: () => dispatch(actions.fetchAllCodeScheduleTime()),
      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleRoom));
