import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
//import Header from '../containers/Header/Header';
import "./MangeSchedule.scss";
import Select from 'react-select';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils, dateFormat } from "../../../utils";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";
import moment from 'moment';
import { FormattedDate } from '../../../components/Formating/FormattedDate';
import _, { result } from 'lodash';
import { toast } from 'react-toastify';
import { bulkCreateScheduleService, getScheduleDoctorByDateService } from "../../../services/userService"
import CalendarSchedule from "./Calendar/CalendarSchedule"


class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //  listDoctors: [],
            //  selectedDoctor: {},
            currentDate: moment(new Date()).startOf('day').valueOf(),
            rangeTime: {},
            allTimes: [],
            listScheduleDoctor: []
        }
    }

    async componentDidMount() {
        //    this.props.fetchAllDoctorsRedux();
        this.props.fetchAllCodeScheduleTimeRedux();

        let { user } = this.props;

        this.props.fetchAllScheduleByIdDoctor(user.id);
        

        let dateDoctor = this.state.currentDate;
        let res = await getScheduleDoctorByDateService(this.props.user.id, dateDoctor);
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

    componentDidUpdate(prevProps, prevState, snapchot) {
        // if (prevProps.allDoctors !== this.props.allDoctors) {

        //     let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
        //     this.setState({
        //         listDoctors: dataSelect
        //     })
        // }

        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            this.initSchedule();


        }

       

        // if (prevProps.language !== this.props.language) {
        //     let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
        //     this.setState({
        //         listDoctors: dataSelect
        //     })
        // }

        if (prevProps.arrScheduleDoctor !== this.props.arrScheduleDoctor) {
            this.setState({
                listScheduleDoctor: this.props.arrScheduleDoctor,

            })
        }

    }

    initSchedule = () => {
        let data = this.props.allScheduleTime;
        if (data && data.length > 0) {
            // data.map(item => {
            //     item.isSelected = false;
            //     return item;
            // })
            data = data.map(item => ({ ...item, isSelected: false }))
        }
        this.setState({
            rangeTime: data,
        }) 
    }


    // buildDataInputSelect = (inputData) => {
    //     let result = [];
    //     let { language } = this.props;
    //     if (inputData && inputData.length > 0) {

    //         inputData.map((item, index) => {
    //             let object = {};
    //             let labelVi = `${item.lastName} ${item.firstName}`;
    //             let labelEn = `${item.firstName} ${item.lastName}`;
    //             object.label = language === language.EN ? labelEn : labelVi;
    //             object.value = item.id;
    //             result.push(object);
    //         })
    //     }
    //     return result;
    // }


    // handleChangeSelect = async (selectedDoctor) => {
    //     this.setState({ selectedDoctor }, () =>
    //         console.log(`Option selected:`, this.state.selectedDoctor)

    //     );

    // };

    handleOnChangeDatePicker = async (date) => {
        this.initSchedule();
        this.setState({
            currentDate: date[0],
        })

        let dateDoctor = new Date(date[0]).getTime();
        let res = await getScheduleDoctorByDateService(this.props.user.id, dateDoctor);
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
        let { rangeTime, currentDate, selectedDoctor } = this.state;
        let { user } = this.props;
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Invalid selected doctor!');
            return;
        }

        if (!currentDate) {
            toast.error('Invalid choose date!');
            return;
        }

        //let formatDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        let formatedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule) => {
                    let object = {};
                    object.doctorId = user.id;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                })



            } else {
                toast.error('Invalid choose time!');
                return;
            }
        }

        let res = await bulkCreateScheduleService({
            arrSchedule: result,
            doctorId: user.id,
            formatedDate: formatedDate,
        });
        if (res.errCode === 0) {
            toast.success('Create schedule success!');
            this.props.fetchAllScheduleByIdDoctor(user.id);

            // let data = this.props.allScheduleTime;
            // if (data && data.length > 0) {
            //     data = data.map(item => ({ ...item, isSelected: false }))
            // }
            // this.setState({
            //     rangeTime: data,
            // })


        } else {
            toast.error('Create schedule failed!');
            console.log('res failed', res);

        }


    }

    render() {
        console.log('check state', this.state);


        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        console.log(`Yesterday (oneliner)\n${yesterday}`);
        let rangeTime = this.state.rangeTime;
        let language = this.props.language;
        return (
            <div className='container-manage-schedule'>
                <div className="manage-title-schedule">
                   <FormattedMessage id="manage-patient.title-patient" />
                </div>


                <div className='schedule-content container'>
                    <div className='title-manage-schedule-sub'>
                    <FormattedMessage id="manage-schedule.title-schedule-sub" />
                    </div>
                    <div className='title-schedule'>
                        <FormattedMessage id="manage-schedule.title" />
                    </div>

                    <div className='row'>
                        {/* <div className='col-6 form-group'>
                            <label>
                                <FormattedMessage id="manage-schedule.choose-doctor" />
                            </label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div> */}
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

                    <div className='row'>
                        <CalendarSchedule listScheduleDoctorParent={this.state.listScheduleDoctor} />
                    </div>
                </div>
            </div>


        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime,
        user: state.user.userInfo,
        arrScheduleDoctor: state.admin.arrScheduleDoctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        fetchAllCodeScheduleTimeRedux: () => dispatch(actions.fetchAllCodeScheduleTime()),
        fetchAllScheduleByIdDoctor: (id) => dispatch(actions.fetchAllScheduleByIdDoctor(id))

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
