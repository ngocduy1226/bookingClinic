import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import { verifyBookAppointmentService } from '../../services/userService';
import HomeHeader from '../HomePage/homeHeader';
import "./VerifyEmail.scss";
class VerifyEmail extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            stateEmail: false,
            errCode: 0
        };
    }

    async componentDidMount() {

        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');

            let res = await verifyBookAppointmentService({
                doctorId: doctorId,
                token: token,
            });

            if (res && res.errCode === 0) {
                this.setState({
                    stateEmail: true,
                    errCode: res.errCode,
                })
            } else {
                this.setState({
                    stateEmail: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }





    }




    render() {

        let { errCode, stateEmail } = this.state;


        return (

            <>
                <HomeHeader />
                <div className="verify-email-container">
                    {/* {stateEmail === false ?
                        <div className='verify-fail'>Loading data ... </div>
                        :
                        <div className='verify-success'>
                            {+errCode === 0 ?
                                <div className='booking-success'> Xac nhan lich hen thanh cong</div>
                                :
                                <div className='booking-error'>Lich hen khong ton tai</div>
                            }
                        </div>
                    } */}
                    {stateEmail === false ?
                        <div className='verify-fail'>Loading data ... </div>
                        :
                        <div id="container">
                            {+errCode === 0 ?
                                <div id="success-box">
                                    <div class="dot"></div>
                                    <div class="dot two"></div>
                                    <div class="face">
                                        <div class="eye"></div>
                                        <div class="eye right"></div>
                                        <div class="mouth happy"></div>
                                    </div>
                                    <div class="shadow scale"></div>
                                    <div class="message"><h1 class="alert">Success!</h1><p>Hi bro, Bạn đã xác nhận lịch hẹn thành công</p></div>
                                    <button class="button-box"><h1 class="green">continue</h1></button>
                                </div>
                                :
                                <div id="error-box">
                                    <div class="dot"></div>
                                    <div class="dot two"></div>
                                    <div class="face2">
                                        <div class="eye"></div>
                                        <div class="eye right"></div>
                                        <div class="mouth sad"></div>
                                    </div>
                                    <div class="shadow move"></div>
                                    <div class="message"><h1 class="alert">Error!</h1><p>oh no, Lịch hẹn không tồn tại hoặc đã được xác nhận trước đó.</p>
                                    </div>
                                    <button class="button-box"><h1 class="red">try again</h1></button>
                                </div>
                            }
                        </div>

                    }


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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifyEmail));
