import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './PrescriptionPatient.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";

import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
//import { getPrescriptionPatientByDateService } from "../../../../services/userService"
import { FormattedMessage } from 'react-intl';



class PrescriptionPatient extends Component {


    constructor(prop) {
        super(prop);
        this.state = {

        };
    }

    componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        // if (prevProps.doctorIdParent !== this.props.doctorIdParent) {
        //     let allDays = this.getDaySchedule(this.props.language);
        //     let res = await getBookingModalByDateService(this.props.doctorIdParent, allDays[0].value);
        //     this.setState({
        //         allTimes: res.data ? res.data : [],

        //     })
        // }

    }




    render() {




        return (
            <>
                <div className='prescription-container container'>
                    <div className='title-prescription'>Quan ly toa thuoc</div>
                    <div className='content-prescription'>
                        <div className='title-prescription-sub'>Tao toa thuoc</div>
                        <div className='body-prescription '>
                            <div className='row form-create-pres'>
                               <div className='image-prescription'></div>
 <div className='name-prescription'>Toa thuoc</div>
                                <div className='form-group col-6 my-3'>
                                    <label><FormattedMessage id="manage-patient.name-patient" /></label>
                                    <div className='wrap-input'>
                                        <input type='text' className='form-control data-input'
                                        // value={this.state.email} placeholder='email@gmail.com'
                                        // onChange={(event) => this.handleOnchangeEmail(event)}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>
                                <div className='form-group col-6 my-3'>
                                    <label><FormattedMessage id="manage-patient.birthday" /></label>
                                    <div className='wrap-input'>
                                        <input type='text' className='form-control data-input'
                                        // value={this.state.email} placeholder='email@gmail.com'
                                        // onChange={(event) => this.handleOnchangeEmail(event)}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>

                                <div className='form-group col-6 my-3'>
                                    <label><FormattedMessage id="manage-patient.email" /></label>
                                    <div className='wrap-input'>
                                        <input type='text' className='form-control data-input'
                                        // value={this.state.email} placeholder='email@gmail.com'
                                        // onChange={(event) => this.handleOnchangeEmail(event)}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>

                                <div className='form-group col-6 my-3'>
                                    <label><FormattedMessage id="manage-patient.phone" /></label>
                                    <div className='wrap-input'>
                                        <input type='text' className='form-control data-input'
                                        // value={this.state.email} placeholder='email@gmail.com'
                                        // onChange={(event) => this.handleOnchangeEmail(event)}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>

                                <div className='form-group col-12 my-3'>
                                    <label><FormattedMessage id="manage-patient.SYMPTOMS" /></label>
                                    <div className='wrap-input'>
                                        <input type='text' className='form-control data-input'
                                        // value={this.state.email} placeholder='email@gmail.com'
                                        // onChange={(event) => this.handleOnchangeEmail(event)}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>

                                <div className='form-group col-12 my-3'>
                                    <label><FormattedMessage id="manage-patient.DIAGNOSIS" /></label>
                                    <div className='wrap-input'>
                                        <input type='text' className='form-control data-input'
                                        // value={this.state.email} placeholder='email@gmail.com'
                                        // onChange={(event) => this.handleOnchangeEmail(event)}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>


                                <div className='form-group col-12 my-3'>
                                    <label><FormattedMessage id="manage-patient.PRESCRIPTION" /></label>
                                    <div className='wrap-input'>
                                        <input type='text' className='form-control data-input'
                                        // value={this.state.email} placeholder='email@gmail.com'
                                        // onChange={(event) => this.handleOnchangeEmail(event)}
                                        />
                                        <span class="focus-input100"></span>
                                    </div>
                                </div>

                                <div className='col-12 my-4 text-center'>
                                    <div className='btn btn-primary btn-submit-pres mr-2'>Submit</div>
                                    <div className='btn btn-warning btn-clean'>Clean</div>
                                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrescriptionPatient));
