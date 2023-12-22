import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactLoading from "react-loading";
import './Doctor.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
//import { getAllDoctorByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';



class Doctor extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  listInfoDoctor: [],
                  isLoading: true,
            };
      }

      componentDidMount() {

      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.listInfoDoctor !== this.props.listInfoDoctor) {


                  this.setState({
                        listInfoDoctor: this.props.listInfoDoctor,
                        isLoading: false,
                  })
            }

      }


      handleOnClickDoctor = (doctor) => {
            if (this.props.history) {
                  this.props.history.push(`/detail-doctor/${doctor.id}`);

            }

      }

      render() {
            let { language } = this.props;
            let { listInfoDoctor, isLoading } = this.state;

            return (
                  <div className='content-doctor'>
                        <div className='title-sub'><FormattedMessage id="patient.doctor.title-doctor" /></div>
                        <div className='list-content-doctor '>
                              {listInfoDoctor && listInfoDoctor.length > 0 ?
                                    listInfoDoctor.map((item, index) => {
                                          return (
                                                <>
                                                      <div key={index}>
                                                            <div className='child-content row'
                                                                  onClick={() => this.handleOnClickDoctor(item)} >
                                                                  <div className='content-left'>
                                                                        <div className='image-doctor col-3'
                                                                              style={{ backgroundImage: `url(${item.image})` }}>

                                                                        </div>
                                                                  </div>
                                                                  <div className='content-right'>
                                                                        <div className='title-doctor col-9'>
                                                                              {language === LANGUAGES.VI ?
                                                                                    <>{item.position.valueVi}, {item.lastName} {item.firstName}</>
                                                                                    :
                                                                                    <>{item.position.valueEn}, {item.firstName} {item.lastName}</>
                                                                              }

                                                                        </div>
                                                                        <div className='specialty-doctor col-9'>
                                                                              {item.specialty.name}
                                                                        </div>
                                                                  </div>

                                                            </div>

                                                            <hr></hr>
                                                      </div>

                                                </>
                                          );
                                    })
                                    :
                                    <>
                                          {isLoading === true &&
                                                <ReactLoading
                                                      type="spinningBubbles"
                                                      color="#0000FF"
                                                      height={100}
                                                      width={50}
                                                />
                                          }
                                          {/* <div className='row'> <FormattedMessage id="patient.doctor.not-data" /></div> */}
                                    </>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Doctor));
