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
import _, { isEmpty, result } from 'lodash';
import { toast } from 'react-toastify';
import { handleGetRoomStatusByDateService, handleChooseRoom } from '../../../services/clinicService'
import { bulkCreateScheduleService, getScheduleDoctorByDateService, getExtraDoctorInfoByIdService } from "../../../services/userService"
import CalendarSchedule from "./Calendar/CalendarSchedule"


class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //  listDoctors: [],
            //  selectedDoctor: {},new Date(new Date().setDate(new Date().getDate() - 1))
            currentDate: moment(new Date(new Date().setDate(new Date().getDate() + 1))).startOf('day').valueOf(),
            rangeTime: {},
            allTimes: [],
            listScheduleDoctor: [],
            doctor: {},
            listRooms: [],
            selectedRoom: {},
            roomId: '',
            clinic: ''

        }
    }

    async componentDidMount() {

        //this.props.fetchAllCodeScheduleTimeRedux();

        let { user } = this.props;

        let resDoctor = await getExtraDoctorInfoByIdService(this.props.user.id);
        if (resDoctor && resDoctor.errCode === 0) {
            this.setState({
                doctor: resDoctor.data,
                clinic: resDoctor.data.clinicId
            })
        }



        //rangTime doctor choose in full clinic
        this.props.fetchScheduleRoomByDate({
            currentDate: this.state.currentDate,
            clinic: resDoctor.data.clinicId,
        });

        //lich
        this.props.fetchAllScheduleByIdDoctor(user.id);

        //schedule doctor dy date
        let dateDoctor = this.state.currentDate;
        this.getScheduleDoctorByDate(dateDoctor);

        this.getRooms();

    }

    getRooms = async () => {
        //     //get room
        let currentDate = new Date(this.state.currentDate).getTime()
        let rooms = await handleGetRoomStatusByDateService({
            date: currentDate,
            status: 'SR1',
            clinic: this.state.clinic,
        })

        if (rooms && rooms.errCode === 0) {
            let dataSelect = this.buildDataInputSelect(rooms.data)
            this.setState({
                listRooms: dataSelect
            })
        }
    }

    getScheduleDoctorByDate = async (date) => {
        //schedule doctor

        let res = await getScheduleDoctorByDateService(this.props.user.id, date);
        if (res && res.errCode === 0) {
            let selected = {
                value: res.data && !_.isEmpty(res.data) ? res.data[0].RoomScheduleData.id : '',
                label: res.data && !_.isEmpty(res.data) ? res.data[0].RoomScheduleData.name : ''
            }

            this.setState({
                allTimes: res.data ? res.data : [],
                selectedRoom: selected


            })
            let { allTimes } = this.state;
            if (allTimes && allTimes.length > 0) {
                for (let i = 0; i < allTimes.length; i++) {
                    let { rangeTime } = this.state;
                    if (rangeTime && rangeTime.length > 0) {
                        rangeTime = rangeTime.map(item => {
                            if (item.timeType === allTimes[i].timeType) {
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
    }

    componentDidUpdate(prevProps, prevState, snapchot) {

        if (prevProps.arrScheduleRoomDate !== this.props.arrScheduleRoomDate) {

            this.initSchedule();
        }


        if (prevProps.arrScheduleDoctor !== this.props.arrScheduleDoctor) {
            this.setState({
                listScheduleDoctor: this.props.arrScheduleDoctor,

            })
        }

    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {

            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.name}`;

                object.label = labelVi;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }


    initSchedule = () => {
        let data = this.props.arrScheduleRoomDate;
        if (data && data.length > 0) {
            data = data.map(item => ({ ...item, isSelected: false }))
        }
        this.setState({
            rangeTime: data,
        })
    }


    handleOnChangeDatePicker = async (date) => {
        this.initSchedule();
        this.setState({
            currentDate: date[0],
        })

        let currentDate = new Date(this.state.currentDate).getTime()
        //rangTime doctor choose in full clinic
        this.props.fetchScheduleRoomByDate({
            currentDate: currentDate,
            clinic: this.state.clinic,
        });
        let dateDoctor = new Date(date[0]).getTime();
        this.getScheduleDoctorByDate(dateDoctor);
        this.getRooms();


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
        let { rangeTime, currentDate, selectedRoom } = this.state;
        let { user } = this.props;
        if (selectedRoom && _.isEmpty(selectedRoom)) {
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
            console.log('rang time', rangeTime)
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                console.log('rang selectedTime', selectedTime)
                selectedTime.map((schedule) => {
                    let object = {};
                    object.doctorId = user.id;
                    object.date = formatedDate;
                    object.timeType = schedule.timeType;
                    object.roomId = selectedRoom.value;
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
            roomId: selectedRoom.value,
        });

        if (res.errCode === 0) {
            toast.success('Create schedule success!');
            this.props.fetchAllScheduleByIdDoctor(user.id);



        } else {
            toast.error('Create schedule failed!');
            console.log('res failed', res);
        }
    }


    handleChangeSelect = async (selectedRoom) => {

        this.setState({ selectedRoom }, async () => {

            console.log(`Option selected:`, this.state.selectedRoom)
        });



    };

    render() {
        console.log('check state 1111111111111', this.state);

        let { listRooms } = this.state;
        let yesterday = new Date(new Date().setDate(new Date().getDate()));
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

                    <div className='row mb-4'>

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
                    <div className='row mb-2'>
                        <div><FormattedMessage id="manage-patient.choose-schedule" /></div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 ?
                                rangeTime.map((item, index) => {
                                    return (
                                        <button className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            onClick={() => this.handleClickBtnTime(item)}
                                            key={index}>
                                            {language === LANGUAGES.VI ? item.timeTypeHourData.valueVi : item.timeTypeHourData.valueEn}
                                        </button>
                                    );
                                })

                                :
                                <div className="not-schedule"><FormattedMessage id="manage-patient.not-schedule" /></div>
                            }
                        </div>
                    </div>

                    <div className="row list-rooms-content">
                        

                        <div className='manage-patient-doctor form-group col-6 p-3' style={{zIndex: '100'}}>
                            <label><FormattedMessage id="manage-patient.choose-room" /></label>
                            <Select
                                value={this.state.selectedRoom}
                                onChange={this.handleChangeSelect}
                                options={this.state.listRooms}
                                placeholder={<FormattedMessage id="manage-doctor.choose-doctor" />}
                            />
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
        arrScheduleDoctor: state.admin.arrScheduleDoctor,
        arrScheduleRoomDate: state.admin.arrScheduleRoomDate,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        fetchAllCodeScheduleTimeRedux: () => dispatch(actions.fetchAllCodeScheduleTime()),
        fetchAllScheduleByIdDoctor: (id) => dispatch(actions.fetchAllScheduleByIdDoctor(id)),
        fetchScheduleRoomByDate: (data) => dispatch(actions.fetchScheduleRoomByDate(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
