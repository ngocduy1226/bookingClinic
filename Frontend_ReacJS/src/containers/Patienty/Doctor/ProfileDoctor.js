import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ProfileDoctor.scss'
import { LANGUAGES, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import _ from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getProfileDoctorInfoByIdService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';


class ProfileDoctor extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            profileDoctor: {}
        };
    }

    async componentDidMount() {
        this.getInfoDoctor(this.props.doctorId);


    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.doctorId !== this.props.doctorId) {
            this.getInfoDoctor(this.props.doctorId);

        }

    }

    getInfoDoctor = async (id) => {
        let result = {};
        let res = await getProfileDoctorInfoByIdService(id);

        if (res && res.errCode === 0) {
            this.setState({
                profileDoctor: res.data
            })
        }

        return result;
    }


    genderTime = (dataScheduleTime) => {
        let { language } = this.props;
        if (dataScheduleTime && !_.isEmpty(dataScheduleTime)) {
            let time = language === LANGUAGES.VI ?
                dataScheduleTime.timeTypeData.valueVi
                : dataScheduleTime.timeTypeData.valueEn
            let date = language === LANGUAGES.VI ?
                moment.unix(+ dataScheduleTime.date / 1000).format('dddd - DD/MM/YYYY ')
                :
                moment.unix(+ dataScheduleTime.date / 1000).locale('en').format('dddd - DD/MM/YYYY')



            return (
                <>
                    <div>  {time} - {date}</div>
                </>
            );

        }
        return <></>
    }

    handleDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor}`);

        }
    }

    render() {
        let { profileDoctor } = this.state;
        let { language, isShowProfileDoctor, dataScheduleTime, isShowPrice, isShowLinkDetail } = this.props;

        let nameVi = '', nameEn = '';
        if (profileDoctor && profileDoctor.positionData) {
            nameVi = `${profileDoctor.positionData.valueVi} , ${profileDoctor.lastName} ${profileDoctor.firstName}`;
            nameEn = `${profileDoctor.positionData.valueEn} , ${profileDoctor.firstName} ${profileDoctor.lastName}`;
        }


        return (
            <div className="profile-doctor-container">
                <div className='intro-doctor container'>
                    <div className='content-left'
                        style={{ backgroundImage: `url(${profileDoctor && profileDoctor.image ? profileDoctor.image : ''} )` }}
                    >

                    </div>
                    <div className='content-right'>
                        <div className='name-doctor'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        {isShowProfileDoctor === true ?
                            <>
                                <div className='intro-view-doctor'>
                                    {profileDoctor.Markdown && profileDoctor.Markdown.description &&
                                        <span>
                                            {profileDoctor.Markdown.description}
                                        </span>
                                    }

                                </div>
                            </>

                            :
                            <>
                                {this.genderTime(dataScheduleTime)}

                            </>
                        }
                    </div>
                </div>
                {isShowLinkDetail && <div className='more-info-doctor' 
                 onClick={() => this.handleDetailDoctor(this.props.doctorId) }
                >Xem thêm</div>}
                {isShowPrice && isShowPrice === true &&
                    <div className="price">
                        <FormattedMessage id="patient.extra-info-doctor.text-price" />
                        {profileDoctor.Doctor_Info && profileDoctor.Doctor_Info && language === LANGUAGES.VI
                            &&
                            <NumberFormat
                                value={profileDoctor.Doctor_Info.priceData.valueVi}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'VND'}
                            />
                        }

                        {profileDoctor.Doctor_Info && profileDoctor.Doctor_Info.priceData && language === LANGUAGES.EN
                            &&
                            <NumberFormat
                                value={profileDoctor.Doctor_Info.priceData.valueEn}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'VND'}
                            />
                        }
                    </div>
                }
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor));
