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



class AdminManageSchedule extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            listClinics: [],

        };
    }

    componentDidMount() {
        this.props.fetchAllClinic();
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.allClinic !== this.props.allClinic) {

            this.setState({
                listClinics: this.props.allClinic,

            })
        }

    }


    onClickSeeSchedule = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/system/schedule-clinic/${clinic.id}`);

        }

    }


    render() {

        let { listClinics } = this.state;

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
                                        {listClinics && listClinics.length > 0 ?
                                            listClinics.map((item, index) => {
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
                                            <tr>
                                                <td colSpan={4}> <FormattedMessage id="manage-schedule.no-data" /></td>
                                            </tr>
                                        }

                                    </tbody>
                                </table>
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
