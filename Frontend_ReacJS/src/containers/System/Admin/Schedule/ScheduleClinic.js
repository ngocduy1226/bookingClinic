import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ScheduleClinic.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getDetailClinicByIdService, getProfileDoctorInfoByIdService } from "../../../../services/userService"
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import './ScheduleClinic.scss'
import ModalSchedule from './ModalSchedule';
import Pagination from '../../../Pagination/Pagination';
import ReactLoading from "react-loading";

class ScheduleClinic extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            idClinicCurrent: -1,
            detailClinic: [],
            arrDoctorId: [],
            arrInfoDoctor: [],
            isShowSchedule: false,
            doctorSchedule: {},

            currentPage: 1,
            recordPerPage: 5,
            records: [],
            nPages: 1,
            numbers: []
        };
    }

    async componentDidMount() {

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                idClinicCurrent: id,
            })
            let resDetailClinic = await getDetailClinicByIdService({
                id: id,
            });

            if (resDetailClinic && resDetailClinic.errCode === 0) {
                let arrDoctorId = [];
                let data = resDetailClinic.data

                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                this.setState({
                    detailClinic: resDetailClinic.data,
                    arrDoctorId: arrDoctorId,
                }, () => {
                    this.getInfoDoctor(this.state.arrDoctorId);
                })


            }

        }
    }

    getInfoDoctor = async (arrDoctorId) => {
        let arrInfoDoctor = [];

        for (let i = 0; i < arrDoctorId.length; i++) {
            let doctor = await getProfileDoctorInfoByIdService(arrDoctorId[i]);
            if (doctor && doctor.errCode === 0) {
                let object = {};
                object.lastName = doctor.data.lastName;
                object.firstName = doctor.data.firstName;
                object.id = doctor.data.id;
                object.specialty = doctor.data.Doctor_Info.specialtyData.name;
                arrInfoDoctor.push(object);
            }

        }
        this.setState({
            arrInfoDoctor: arrInfoDoctor,
        }, () => {
            this.getRecord(this.state.currentPage);
        })
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

    }

    getRecord = (currentPage) => {
        let arrInfoDoctor = this.state.arrInfoDoctor;
        let { recordPerPage } = this.state;

        let lastIndex = currentPage * recordPerPage;
        let firstIndex = lastIndex - recordPerPage;
        let records = arrInfoDoctor.slice(firstIndex, lastIndex);
        let nPages = Math.ceil(arrInfoDoctor.length / recordPerPage);
        let numbers = [...Array(nPages + 1).keys()].slice(1);
        this.setState({
            records: records,
            nPages: nPages,
            numbers: numbers,
        })
    }

    handleShowSchedule = (doctor) => {
        this.setState({
            isShowSchedule: true,
            doctorSchedule: doctor
        })
    }

    toggleScheduleModal = () => {
        this.setState({
            isShowSchedule: !this.state.isShowSchedule,

        });
    };

    handleOnchangeSearch = async (event) => {
        let lowerCase = event.target.value;
        await this.getInfoDoctor(this.state.arrDoctorId)

        let arrInfoDoctor = this.state.arrInfoDoctor;

        let data = arrInfoDoctor.filter((item) => {
            if (lowerCase === '') {
                return;
            } else {
                return item && item.firstName.toLowerCase().includes(lowerCase);

            }
        })

        if (!_.isEmpty(data)) {
            this.setState({
                arrInfoDoctor: data
            }, () => {
                this.getRecord(this.state.currentPage);
            })
        }

    }


    render() {

        console.log('state modal', this.state);
        let { records, nPages, currentPage, numbers } = this.state;
        let { arrInfoDoctor, doctorSchedule } = this.state;

        return (
            <>
                <ModalSchedule
                    isOpen={this.state.isShowSchedule}
                    toggleFromParent={this.toggleScheduleModal}
                    currentDoctor={doctorSchedule}
                />

                <div className='container-schedule-clinic'>
                    <div className='title-schedule-clinic'>
                        <FormattedMessage id="manage-patient.title-patient" /></div>
                    <div className='schedule-clinic-content'>
                        <div className='title-schedule-clinic-sub'>
                            <FormattedMessage id="manage-schedule.title-schedule-sub" /></div>
                        <div className='schedule-clinic-body'>
                            <div className='title-schedule-clinic-body'>
                                <FormattedMessage id="manage-schedule.list-doctor" />
                            </div>

                            <div className='col-6 search-user m-4'>
                                <label><FormattedMessage id="manage-user.search-user" /></label>
                                <input className='form-control'
                                    placeholder='search'
                                    onChange={(event) => this.handleOnchangeSearch(event)}
                                />
                            </div>

                            <div className='table-schedule-clinic'>

                                <table className="table table-hover table-striped table-bordered">
                                    <thead className="thead-dark ">
                                        <tr className="table-dark">
                                            <th scope="col">#</th>
                                            <th scope="col"><FormattedMessage id="manage-schedule.fullName" /></th>
                                            <th scope="col"><FormattedMessage id="manage-schedule.specialty" /></th>

                                            <th scope="col"><FormattedMessage id="manage-user.action" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records &&
                                            records.length > 0 ?
                                            records.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.lastName} {item.firstName}</td>
                                                        <td>{item.specialty}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-schedule-doctor"
                                                                onClick={() => this.handleShowSchedule(item)}
                                                            >
                                                                <i class="fas fa-clipboard-list"></i>
                                                            </button>

                                                        </td>
                                                    </tr>
                                                );
                                            })
                                            :
                                            <>
                                                {this.state.isLoading === true &&
                                                    <ReactLoading
                                                        type="spinningBubbles"
                                                        color="#0000FF"
                                                        height={100}
                                                        width={50}
                                                    />
                                                }

                                            </>
                                        }
                                    </tbody>
                                </table>

                                <Pagination
                                    currentPage={currentPage}
                                    numbers={numbers}
                                    getRecordParent={this.getRecord}
                                    nPages={nPages}
                                />
                            </div>

                        </div>
                    </div>
                </div>


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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleClinic));
