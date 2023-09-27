import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ExtraInfoDoctor.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import localization from 'moment/locale/vi';
import { getExtraDoctorInfoByIdService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';


class ExtraInfoDoctor extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            isShowDetailDoctor: false,
            extraInfoDoctor: {},
        };
    }

    async componentDidMount() {
       if(this.props.doctorIdParent) {
         let res = await getExtraDoctorInfoByIdService(this.props.doctorIdParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfoDoctor: res.data,
                })
            }
       }
    }



    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevState.doctorIdParent !== this.props.doctorIdParent) {

            let res = await getExtraDoctorInfoByIdService(this.props.doctorIdParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfoDoctor: res.data,
                })
            }


        }



    }
    showDetailDoctor(status) {
        this.setState({
            isShowDetailDoctor: status
        })
    }


    render() {
        // console.log('check', this.state);
        let { isShowDetailDoctor, extraInfoDoctor } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className='doctor-container-extra-info'>
                    <div className='content-up'>
                        <div className='text-address'>
                            <FormattedMessage  id="patient.extra-info-doctor.text-address"/> 
                            </div>
                        <div className='name-clinic'>
                            {extraInfoDoctor && extraInfoDoctor.nameClinic ? extraInfoDoctor.nameClinic : ''}
                        </div>
                        <div className='detail-address'> {extraInfoDoctor && extraInfoDoctor.addressClinic ? extraInfoDoctor.addressClinic : ''}</div>
                    </div>
                    <hr />
                    <div className='content-down'>

                        {
                            isShowDetailDoctor === false ?
                                <div className='short-info'>
                                    <span className='short-info-name'>
                                <FormattedMessage  id="patient.extra-info-doctor.text-price"/> 

                                    </span>
                                    <span className='short-info-price'>
                                        {extraInfoDoctor && extraInfoDoctor.priceData && language === LANGUAGES.VI &&
                                            <NumberFormat
                                                value={extraInfoDoctor.priceData.valueVi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'VND'}
                                            />
                                        }
                                        {extraInfoDoctor && extraInfoDoctor.priceData && language === LANGUAGES.EN &&
                                            <NumberFormat
                                                value={extraInfoDoctor.priceData.valueEn}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'$'}
                                            />
                                        }
                                    </span>
                                    <span className='more-short' onClick={() => this.showDetailDoctor(true)}>
                                    <FormattedMessage  id="patient.extra-info-doctor.more-detail"/> 

                                    </span>

                                </div>
                                :
                                <>

                                    <div className='title-price'>                      
                                              <FormattedMessage  id="patient.extra-info-doctor.text-price"/> 
 </div>
                                    <div className='detail-price'>
                                        <div className='price'>
                                            <span className='right'><FormattedMessage  id="patient.extra-info-doctor.text-price"/> 
 </span>
                                            <span className='left'>
                                                {extraInfoDoctor && extraInfoDoctor.priceData && language === LANGUAGES.VI
                                                    &&
                                                    <NumberFormat
                                                        value={extraInfoDoctor.priceData.valueVi}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'VND'}
                                                    />
                                                }
                                                {extraInfoDoctor && extraInfoDoctor.priceData && language === LANGUAGES.EN
                                                    &&
                                                    <NumberFormat
                                                        value={extraInfoDoctor.priceData.valueEn}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'$'}
                                                    />
                                                }

                                            </span>
                                        </div>

                                        <div className='text-price'>
                                            {extraInfoDoctor && extraInfoDoctor.note ? extraInfoDoctor.note : ''}

                                        </div>

                                    </div>
                                    <div className='payment'>
                                    <FormattedMessage  id="patient.extra-info-doctor.payment"/> 

                                        {extraInfoDoctor && extraInfoDoctor.paymentData 
                                             && language === LANGUAGES.VI 
                                             ? extraInfoDoctor.paymentData.valueVi 
                                             : extraInfoDoctor.paymentData.valueEn
                                             }

                                    </div>


                                    <div className='hide-price'>
                                        <span onClick={() => this.showDetailDoctor(false)}>
                                        <FormattedMessage  id="patient.extra-info-doctor.hide-detail"/> 

                                        </span>
                                    </div>

                                </>
                        }


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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExtraInfoDoctor));
