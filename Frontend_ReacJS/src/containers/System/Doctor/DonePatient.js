import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './DonePatient.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get, slice } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getAllPatientForDoctor } from "../../../services/userService";

import { getInfoPrescriptionByBookingIdService } from "../../../services/prescriptionService"
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import ModalPrescription from '../../../components/../containers/System/Doctor/ModalPrescription';
import Select from 'react-select';
import _ from 'lodash';
import Pagination from '../../Pagination/Pagination';


class DonePatient extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isShowModalPrescription: false,
            dataBooking: {},
            // isShowLoading: false,
            dataPrescription: {},
            listDoctors: [],
            selectedDoctor: {},

            currentPage: 1,
            recordPerPage: 5,
            records: [],
            nPages: 1,
            numbers: []


        };
    }

    componentDidMount() {
        this.handleGetPatient();
        this.props.fetchAllDoctorsRedux();
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.allDoctors !== this.props.allDoctors) {

            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }

    }
    togglePrescriptionModal = () => {
        this.setState({
            isShowModalPrescription: !this.state.isShowModalPrescription,

        });
        // emitter.emit("EVENT_CLEAR_MODAL_DATA");
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        }, async () => {
            await this.handleGetPatient();
        })
    }

    handleGetPatient = async () => {

        let { user } = this.props;
        let { currentDate, selectedDoctor } = this.state;
        let formatedDate = new Date(currentDate).getTime();


        if (selectedDoctor && !_.isEmpty(selectedDoctor)) {
            user.id = selectedDoctor.value
        } else {
            if (user.roleId === 'R1') {
                user.id = 'ALL'
            }
        }

        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate,
            patientId: "ALL",
            status: "S3"
        });


        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.patient,
            }, () => {
                this.getRecord(this.state.currentPage);
            })
        }
    }


    handleSeePrescription = async (item) => {
        let res = await getInfoPrescriptionByBookingIdService({
            bookingId: item.id
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPrescription: res.prescription,
                isShowModalPrescription: true
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {

            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === language.EN ? labelEn : labelVi;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }


    handleChangeSelect = async (selectedDoctor) => {

        this.setState({ selectedDoctor }, async () => {
            await this.handleGetPatient();
            console.log(`Option selected:`, this.state.selectedDoctor)
        });


    };

    getRecord = (currentPage) => {
        let dataPatient = this.state.dataPatient;
        let { recordPerPage } = this.state;

        let lastIndex = currentPage * recordPerPage;
        let firstIndex = lastIndex - recordPerPage;
        let records = dataPatient.slice(firstIndex, lastIndex);
        let nPages = Math.ceil(dataPatient.length / recordPerPage);
        let numbers = [...Array(nPages + 1).keys()].slice(1);
        this.setState({
            records: records,
            nPages: nPages,
            numbers: numbers,
        })
    }


    handleOnchangeSearch = async (event) => {
        console.log('event', event.target.value.toLowerCase());
        let lowerCase = event.target.value;
        await this.handleGetPatient();
        let listPatient = this.state.dataPatient;

        let data = listPatient.filter((item) => {

            if (lowerCase === '') {
                return;
            } else {
                return item && item.userData.firstName.toLowerCase().includes(lowerCase);

            }
        })

        if (!_.isEmpty(data)) {
            this.setState({
                dataPatient: data
            }, () => {
                this.getRecord(this.state.currentPage);
            })
        }

    }



    render() {

        let { dataPatient, isOpenModal, dataBooking } = this.state;
        let { language } = this.props;
        let { records, nPages, currentPage, numbers } = this.state;
        console.log('stats', this.state)
        return (
            <>
                <ModalPrescription
                    isOpen={this.state.isShowModalPrescription}
                    toggleFromParent={this.togglePrescriptionModal}
                    dataPrescription={this.state.dataPrescription}

                />

                <div className='manage-patient-container container'>
                    <div className="title-patient"><FormattedMessage id="manage-patient.title-patient" /></div>
                    <div className='content-manage row'>
                        <div className='title-manage-patient-sub'><FormattedMessage id="manage-patient.title-manage-patient-sub" /></div>
                        <div className='title-manage-patient'><FormattedMessage id="manage-patient.title-manage-patient" /></div>
                        <div className='manage-patient-date form-group col-6'>
                            <label><FormattedMessage id="manage-patient.choose-date" /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}

                            />
                        </div>
                        {this.props.user.roleId === 'R1' &&
                            <div className='manage-patient-doctor form-group col-6 p-3'>
                                <label><FormattedMessage id="manage-patient.choose-doctor" /></label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                    placeholder={<FormattedMessage id="manage-doctor.choose-doctor" />}
                                />
                            </div>
                        }

                        <div className='col-6 search-patient'>
                            <label><FormattedMessage id="manage-patient.search-patient" /></label>
                            <input className='form-control'
                                placeholder='search'
                                onChange={(event) => this.handleOnchangeSearch(event)}
                            />
                        </div>
                        <div className='table-manage-patient col-12'>
                            <table class="table table-hover table-striped table-bordered">
                                <thead className="thead-dark " >
                                    <tr className="table-dark">
                                        <th scope="col">#</th>
                                        <th scope="col"><FormattedMessage id="manage-patient.time" /></th>
                                        <th scope="col"><FormattedMessage id="manage-patient.fullName" /></th>

                                        <th scope="col"><FormattedMessage id="manage-patient.gender" /></th>
                                        <th scope="col"><FormattedMessage id="manage-patient.address" /></th>
                                        <th scope="col"><FormattedMessage id="manage-patient.reason" /></th>
                                        <th scope="col"><FormattedMessage id="manage-patient.action" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records && records.length > 0 ?
                                        records.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    {language === LANGUAGES.VI ?
                                                        <>
                                                            <td>{item.timeTypePatient.valueVi}</td>
                                                            <td>{item.userData.lastName + " " + item.userData.firstName}</td>
                                                            <td>{item.userData.genderData.valueVi}</td>
                                                        </>
                                                        :
                                                        <>
                                                            <td>{item.timeTypePatient.valueEn}</td>
                                                            <td>{item.userData.firstName + " " + item.userData.lastName}</td>
                                                            <td>{item.userData.genderData.valueEn}</td>
                                                        </>
                                                    }

                                                    <td>{item.userData.address}</td>
                                                    <td>{item.reason}</td>
                                                    <td>
                                                        <button className='btn btn-primary mx-1 btn-print'
                                                            onClick={() => this.handleSeePrescription(item)}
                                                        >Xem toa thuoc</button>

                                                        {/* <button className='btn btn-warning mx-1 btn-print'
                                                    onClick={() => this.confirmSend(item)}
                                                > <FormattedMessage id="manage-patient.confirm" /></button> */}
                                                    </td>
                                                </tr>
                                            );
                                        })

                                        :
                                        <tr className='text-center'>
                                            <td Colspan='7'>   <FormattedMessage id="manage-patient.empty-data" /> </td>


                                        </tr>
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
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,

        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {

        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DonePatient));
