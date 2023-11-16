import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './DataBooking.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';

import { FormattedMessage } from 'react-intl';
import Chart from './Chart';
import TableMedicalExamination from '../Doctor/TableMedicalExamination';
class DataBooking extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            countUser: '',
            countDoctor: '',
            countClinic: '',
            countPrescription: '',
        };
    }

    componentDidMount() {
        this.props.fetchTotalUser();
        this.props.fetchTotalDoctor();
        this.props.fetchTotalClinic();
        this.props.fetchTotalPrescription();
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.countDoctor !== this.props.countDoctor) {

            this.setState({
                countDoctor: this.props.countDoctor,
            })
        }

        if (prevProps.countUser !== this.props.countUser) {

            this.setState({
                countUser: this.props.countUser,
            })
        }

        if (prevProps.countClinic !== this.props.countClinic) {

            this.setState({
                countClinic: this.props.countClinic,
            })
        }

        if (prevProps.countPrescription !== this.props.countPrescription) {

            this.setState({
                countPrescription: this.props.countPrescription,
            })
        }
    }




    render() {
        let { countUser, countDoctor, countClinic, countPrescription } = this.state;
        console.log('state', this.state)
        let { user } = this.props;
        return (
            <>
                <div className="statistic-container">
                    <div className='title-statistic'>
                        <FormattedMessage id="manage-statistic.title-statistic" />
                    </div>
                    <div className='content-statistic'>

                        <div className='body-statistic'>
                            <div className='row total-data-all'>
                                <div class="col-lg-3 col-6">

                                    <div class="small-box prescription-total ">
                                        <div class="inner">
                                            <h3>{countPrescription}</h3>

                                            <p><FormattedMessage id="manage-statistic.count-prescription" /></p>
                                        </div>
                                        <div class="icon">
                                            <i class="fas fa-stethoscope"></i>
                                        </div>
                                        <a href="#" class="small-box-footer">
                                            <FormattedMessage id="manage-statistic.more-info" />
                                            <i class="fas fa-arrow-circle-right"></i></a>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-6">

                                    <div class="small-box user-total">
                                        <div class="inner">
                                            <h3>{countUser}</h3>

                                            <p><FormattedMessage id="manage-statistic.count-user" /></p>
                                        </div>
                                        <div class="icon">
                                            <i class="far fa-address-book"></i>
                                        </div>
                                        <a href="#" class="small-box-footer">
                                            <FormattedMessage id="manage-statistic.more-info" />
                                            <i class="fas fa-arrow-circle-right"></i></a>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-6">

                                    <div class="small-box doctor-total ">
                                        <div class="inner">
                                            <h3>{countDoctor}</h3>

                                            <p><FormattedMessage id="manage-statistic.count-doctor" /></p>
                                        </div>
                                        <div class="icon">
                                            <i class="fas fa-user-md"></i>
                                        </div>
                                        <a href="#" class="small-box-footer">
                                            <FormattedMessage id="manage-statistic.more-info" />
                                            <i class="fas fa-arrow-circle-right"></i></a>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-6">

                                    <div class="small-box clinic-total">
                                        <div class="inner">
                                            <h3>{countClinic}</h3>

                                            <p><FormattedMessage id="manage-statistic.count-clinic" /></p>
                                        </div>
                                        <div class="icon">
                                            <i class="fas fa-hospital"></i>
                                        </div>
                                        <a href="#" class="small-box-footer">
                                            <FormattedMessage id="manage-statistic.more-info" />
                                            <i class="fas fa-arrow-circle-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <Chart />
                            {user && user.roleId === 'R1' &&
                                <div className='examination-content'>
                                    <TableMedicalExamination />
                                </div>
                            }

                        </div>
                    </div>
                </div>

            </>

        );
    }

}

const mapStateToProps = state => {
    return {
        countUser: state.admin.countUser,
        countDoctor: state.admin.countDoctor,
        countClinic: state.admin.countClinic,
        countPrescription: state.admin.countPrescription,
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchTotalUser: () => dispatch(actions.fetchTotalUser()),
        fetchTotalDoctor: () => dispatch(actions.fetchTotalDoctor()),
        fetchTotalClinic: () => dispatch(actions.fetchTotalClinic()),
        fetchTotalPrescription: () => dispatch(actions.fetchTotalPrescription()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DataBooking));
