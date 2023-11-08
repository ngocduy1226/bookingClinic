import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './Clinic.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
//import { getAllClinicByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import ReactLoading from "react-loading";

class Clinic extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  allClinic: [],
                  isLoading: true,
            };
      }

      componentDidMount() {

      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.allClinic !== this.props.allClinic) {
                  this.setState({
                        allClinic: this.props.allClinic,
                        isLoading: false,
                  })
            }

      }



      handleOnClickClinic = (clinic) => {
            if (this.props.history) {
                  this.props.history.push(`/detail-clinic/${clinic.id}`);
            }

      }

      render() {

            let { allClinic } = this.state;

            return (
                  <div className='content-clinic'>
                        <div className='title-sub'><FormattedMessage id="patient.clinic.title-clinic" /></div>
                        <div className='list-content-clinic '>
                              {allClinic && allClinic.length > 0 ?
                                    allClinic.map((item, index) => {
                                          return (
                                                <>
                                                      <div key={index}>
                                                            <div className='child-content row' onClick={() => this.handleOnClickClinic(item)} >
                                                                  <div className='content-left'>
                                                                        <div className='image-clinic col-3' style={{ backgroundImage: `url(${item.image})` }}></div>
                                                                  </div>
                                                                  <div className='content-right'>
                                                                        <div className='title-clinic col-9'>{item.name}</div>
                                                                        <div className='address-clinic col-9'>{item.address}</div>
                                                                  </div>

                                                            </div>

                                                            <hr></hr>
                                                      </div>

                                                </>
                                          );
                                    })
                                    :
                                    <>
                                          {this.state.isLoading === true &&
                                                <ReactLoading
                                                      type="spinningBubbles"
                                                      color="#0000FF"
                                                      height={100}
                                                      width={50}
                                                />
                                          }
                                    
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Clinic));
