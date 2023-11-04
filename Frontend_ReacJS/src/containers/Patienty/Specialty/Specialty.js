import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactLoading from "react-loading";
import './Specialty.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
//import { getAllSpecialtyByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';



class Specialty extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  arrSpecialty: [],
                  isLoading: true,
            };
      }

      componentDidMount() {

      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.listSpecialty !== this.props.listSpecialty) {


                  this.setState({
                        arrSpecialty: this.props.listSpecialty,
                        isLoading: false,
                  })
            }

      }


      handleOnClickSpecialty = (specialty) => {
            if (this.props.history) {
                  this.props.history.push(`/detail-specialty/${specialty.id}`);

            }

      }

      render() {

            let { arrSpecialty } = this.state;

            return (
                  <div className='content-specialty'>
                        <div className='title-sub'><FormattedMessage id="patient.specialty.title-specialty" /></div>
                        <div className='list-content-specialty '>
                              {arrSpecialty && arrSpecialty.length > 0 ?
                                    arrSpecialty.map((item, index) => {
                                          return (
                                                <>
                                                      <div className='child-content row' key={index} onClick={() => this.handleOnClickSpecialty(item)} >
                                                            <div className='content-left'>
                                                                  <div className='image-specialty col-3' style={{ backgroundImage: `url(${item.image})` }}></div>
                                                            </div>
                                                            <div className='content-right'>
                                                                  <div className='title-specialty col-9'>{item.name}</div>
                                                            </div>

                                                      </div>

                                                      <hr></hr>
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

                                          {/* <div className='row'> <FormattedMessage id="patient.specialty.not-data" /></div> */}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
