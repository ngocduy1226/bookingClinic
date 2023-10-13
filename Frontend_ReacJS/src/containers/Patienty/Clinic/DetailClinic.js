import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './DetailClinic.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import HomeHeader from '../../HomePage/homeHeader';
import { FormattedMessage } from 'react-intl';
import ScheduleDoctor from '../Doctor/ScheduleDoctor';
import ExtraInfoDoctor from '../Doctor/ExtraInfoDoctor';
import ProfileDoctor from '../Doctor/ProfileDoctor'
import { getDetailClinicByIdService } from '../../../services/userService';
import _ from 'lodash';
class DetailClinic extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            arrDoctorId: [],
            idSpecialCurrent: '',
            detailClinic: {},

        };
    }

    async componentDidMount() {

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                idSpecialCurrent: id,
            })
            let resDetailClinic = await getDetailClinicByIdService({
                id: id,
            });
            ;
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
                })
            }

        }
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }


    }




    render() {


        let { arrDoctorId, detailClinic } = this.state;
        let { language } = this.props;
        return (
            <div className="clinic-container">

                <HomeHeader />
               <div>
                 <div className="logo-clinic" 
                 style={{ backgroundImage: `url(${detailClinic && detailClinic.imageSub ? detailClinic.imageSub : ''} )` }}
                    ></div>
                <div className='info-clinic-bg'>
                    <div className="logo"
                     style={{ backgroundImage: `url(${detailClinic && detailClinic.image ? detailClinic.image : ''} )` }}
                    ></div>
                    <div className="info-clinic">
                        <div className="name-clinic">{detailClinic.name}</div>
                        <div className='address-clinic'>{detailClinic.address}</div>
                    </div>
                </div>

               </div>
               <div style={{height: "200px"}}>

               </div>
                <div className='content-info-clinic container'>
                    {detailClinic && detailClinic.descriptionHTML
                        &&
                        <div dangerouslySetInnerHTML={{ __html: detailClinic.descriptionHTML }}></div>
                    }
                </div>


                <div className='content-all-doctor'>

                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className='info-doctor container' >
                                    <div className='content-left-clinic'>
                                        <ProfileDoctor doctorId={item}
                                            isShowProfileDoctor={true}
                                           isShowLinkDetail={true}
                                           isShowPrice={false}
                                        />
                                        
                                    </div>
                                    <div className='content-right-clinic'>
                                        <div className='content-schedule'>
                                            <ScheduleDoctor
                                                doctorIdParent={item}
                                            />
                                        </div>
                                        <div className='content-extra-doctor'>
                                            <ExtraInfoDoctor
                                                doctorIdParent={item}
                                            />
                                        </div>




                                    </div>
                                </div>
                            );
                        })
                    }

                </div> 
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailClinic));
