import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './DetailSpecialty.scss'
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
import { getDetailSpecialtyByIdService, getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
class DetailSpecialty extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            arrDoctorId: [],
            idSpecialCurrent: '',
            detailSpecialty: {},
            listProvince: {},
        };
    }

    async componentDidMount() {

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                idSpecialCurrent: id,
            })
            let resDetailSP = await getDetailSpecialtyByIdService({
                id: id,
                location: "ALL",
            });
            let resProvince = await getAllCodeService('PROVINCE');
            if (resDetailSP && resDetailSP.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let arrDoctorId = [];
                let data = resDetailSP.data
            
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                let dataProvince = resProvince.data;
                if(dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        keyMap: "ALL",
                        type: "PROVINCE",
                        valueEn: "All",
                        valueVi: "Toàn quốc",
                        createdAt: null,
                        updatedAt: null,
                    })
                }


                this.setState({
                    detailSpecialty: resDetailSP.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince ? dataProvince: [] ,
                })
            }

        }
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }


    }


   



    onClickProvince = async (event) => {
     

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;
            this.setState({
                idSpecialCurrent: id,
            })
            let resDetailSP = await getDetailSpecialtyByIdService({
                id: id,
                location: location,
            });
            
            if (resDetailSP && resDetailSP.errCode === 0) {
                let arrDoctorId = [];
                let data = resDetailSP.data
            
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                this.setState({
                    detailSpecialty: resDetailSP.data,
                    arrDoctorId: arrDoctorId,
                })
            }

        }
        
    }

    render() {


        let { arrDoctorId, detailSpecialty, listProvince } = this.state;
        let { language } = this.props;
        return (
            <div className="specialty-container">
                <HomeHeader />
                <div className='content-info-specialty container'>
                    {detailSpecialty && detailSpecialty.descriptionHTML
                        &&
                        <div dangerouslySetInnerHTML={{ __html: detailSpecialty.descriptionHTML }}></div>
                    }
                </div>

                <div className='content-all-doctor'>
                    <div className="select-province container">
                        <select onChange={(event) => { this.onClickProvince(event) }}>
                            {listProvince && listProvince.length > 0 &&
                                listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className='info-doctor container' >
                                    <div className='content-left-specialty'>
                                        <ProfileDoctor doctorId={item}
                                            isShowProfileDoctor={true}
                                           isShowLinkDetail={true}
                                           isShowPrice={false}
                                        />
                                        
                                    </div>
                                    <div className='content-right-specialty'>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty));
