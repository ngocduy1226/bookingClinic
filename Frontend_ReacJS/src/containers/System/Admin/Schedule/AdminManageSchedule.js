import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './AdminManageSchedule.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getAdminManageScheduleByDateService } from "../../../../services/userService"
import { FormattedMessage } from 'react-intl';
import Pagination from '../../../Pagination/Pagination';
import _ from 'lodash';
import ReactLoading from "react-loading";


class AdminManageSchedule extends Component {

    constructor(prop) {
        super(prop);
        this.state = {
            listClinics: [],
            isLoading: true,

            currentPage: 1,
            recordPerPage: 5,
            records: [],
            nPages: 1,
            numbers: []
        };
    }

    componentDidMount() {
        this.props.fetchAllClinic();
        this.getRecord(this.state.currentPage);
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.allClinic !== this.props.allClinic) {

            this.setState({
                listClinics: this.props.allClinic,
                isLoading: false,
            }, () => {
                  this.getRecord(this.state.currentPage);
            })

          
         
        }

    }


    onClickSeeSchedule = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/system/schedule-clinic/${clinic.id}`);

        }

    }


    getRecord = (currentPage) => {
        let arrClinics = this.state.listClinics;
        let { recordPerPage } = this.state;

        let lastIndex = currentPage * recordPerPage;
        let firstIndex = lastIndex - recordPerPage;
        let records = arrClinics.slice(firstIndex, lastIndex);
        let nPages = Math.ceil(arrClinics.length / recordPerPage);
        let numbers = [...Array(nPages + 1).keys()].slice(1);
        this.setState({
            records: records,
            nPages: nPages,
            numbers: numbers,
        })
    }


    handleOnchangeSearch = async (event) => {
        let lowerCase = event.target.value;
        await this.props.fetchAllClinic();
        let listClinics = this.state.listClinics;

        let data = listClinics.filter((item) => {
            if (lowerCase === '') {
                return;
            } else {
                return item && item.name.toLowerCase().includes(lowerCase);

            }
        })

        if (!_.isEmpty(data)) {
            this.setState({
                listClinics: data
            }, () => {
                this.getRecord(this.state.currentPage);
            })
        }

    }


    render() {
        let { records, nPages, currentPage, numbers } = this.state;
        let { listClinics } = this.state;
        console.log('chstare', this.state)
        return (
            <>

                <div className='admin-manage-schedule-container'>
                    <div className='manage-schedule-title'>
                        <FormattedMessage id="manage-patient.title-patient" />
                    </div>
                    <div className='manage-schedule-content'>
                        <div className='manage-schedule-title-sub'>
                            <FormattedMessage id="manage-schedule.title-schedule-sub" />
                        </div>
                        <div className='manage-schedule-body'>
                            <div className='title-clinic'>
                                <FormattedMessage id="manage-schedule.title-schedule-clinic" />
                            </div>

                            <div className='col-6 search-user m-4'>
                                <label><FormattedMessage id="manage-user.search-user" /></label>
                                <input className='form-control'
                                    placeholder='search'
                                    onChange={(event) => this.handleOnchangeSearch(event)}
                                />
                            </div>

                            <div className='table-clinic'>
                                <table class="table table-hover table-striped table-bordered">
                                    <thead className="thead-dark " >
                                        <tr className="table-dark">
                                            <th scope="col">#</th>
                                            <th scope="col"><FormattedMessage id="manage-schedule.name-clinic" /></th>
                                            <th scope="col"><FormattedMessage id="manage-schedule.address-clinic" /></th>

                                            <th scope="col"><FormattedMessage id="manage-medicine.action" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records && records.length > 0 ?
                                            records.map((item, index) => {
                                                return (
                                                    <tr key={index} >
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.name}</td>
                                                        <td>{item.address}</td>

                                                        <td>
                                                            <div className='btn btn-primary' onClick={() => this.onClickSeeSchedule(item)}>
                                                                <FormattedMessage id="manage-schedule.specialty" />

                                                            </div>
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
        allClinic: state.admin.allClinic,
    };
};

const mapDispatchToProps = dispatch => {
    return {

        fetchAllClinic: () => dispatch(actions.fetchAllClinic()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminManageSchedule));
