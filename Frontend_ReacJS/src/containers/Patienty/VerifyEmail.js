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
                    {stateEmail === false ?
                        <div className='verify-fail'>Loading data ... </div>
                        :
                        <div className='verify-success'>
                            {+errCode === 0 ?
                                <div className='booking-success'> Xac nhan lich hen thanh cong</div>
                                :
                                <div className='booking-error'>Lich hen khong ton tai</div>
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
