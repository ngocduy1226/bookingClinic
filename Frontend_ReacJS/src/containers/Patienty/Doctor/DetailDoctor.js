import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/homeHeader';
import './DetailDoctor.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import ScheduleDoctor from './ScheduleDoctor';
import ExtraDoctorInfo from './ExtraInfoDoctor';
class DetailDoctor extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            detailDoctor: {},
            idDoctorCurrent: -1,
        };
    }

    componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            this.setState({
                idDoctorCurrent: id,
            })
            this.props.fetchDetailDoctorRedux(id)

        }
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.dataDoctor !== this.props.dataDoctor) {
            let data = this.props.dataDoctor
         //   console.log('dat doc', this.props.dataDoctor);
            this.setState({
                detailDoctor: data,
            })

        }

    }


    render() {
        let { language } = this.props;

        //   console.log('checl jdjsz', this.state.detailDoctor);
        let { detailDoctor } = this.state;

        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi} , ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn} , ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor container'>
                        <div className='content-left'
                            style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''} )` }}
                        >

                        </div>
                        <div className='content-right'>
                            <div className='name-doctor'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='intro-view-doctor'>
                                {detailDoctor.Markdown && detailDoctor.Markdown.description &&
                                    <span>
                                        {detailDoctor.Markdown.description}
                                    </span>
                                }

                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor container'>
                        <div className='schedule-doctor-right'>
                            <ScheduleDoctor
                                doctorIdParent={this.state.idDoctorCurrent}
                            />
                        </div>
                        <div className='schedule-doctor-right'>
                             <ExtraDoctorInfo 
                              doctorIdParent={this.state.idDoctorCurrent}
                              /> 
                        </div>

                    </div>
                    <div className='detail-info-doctor'>
                        <div className='container'>
                            {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML
                                &&
                                <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}></div>
                            }
                        </div>
                    </div>

                    <div className='comment-doctor'>
                        các comment doctor
                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        dataDoctor: state.admin.detailDoctor,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDetailDoctorRedux: (id) => dispatch(actions.fetchDetailDoctor(id)),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailDoctor));
