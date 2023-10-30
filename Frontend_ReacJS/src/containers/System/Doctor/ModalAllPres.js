import React, { Component, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../utils/emitter";
import "./ModalAllPres.scss";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import _ from "lodash";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import localization from 'moment/locale/vi';


import { useReactToPrint } from 'react-to-print';
import { injectIntl } from 'react-intl';
import { ComponentToPrint } from './ComponentToPrint';

import ReactToPrint from 'react-to-print';


class ModalAllPres extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  dataAllPres: [],
            };
            this.listenToEmitter();
      }

      async componentDidMount() {
            if (this.props.dataAllPres) {
                  let dataAllPres = this.props.dataAllPres;
                  this.setState({
                        dataAllPres

                  })
            }
      }



      componentDidUpdate(prevProps, prevState, snapchot) {
            //render => didupate  
            // qua khu >< hien tai
            if (prevProps.dataAllPres !== this.props.dataAllPres) {
                  let dataAllPres = this.props.dataAllPres;
                  this.setState({
                        dataAllPres

                  })
            }

      }



      toggle = () => {


            this.props.toggleFromParent();

      };
      // listen from parent
      //  listenToEmitter () {
      //   emitter.on('EVENT_CLEAR_MODAL_DATA', data => {
      //     console.log('listen emitter from parent: ', data);
      //   })
      //  }

      listenToEmitter() {
            emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
                  //reset state
                  this.setState({

                  })
            });
      }

      handleDownloadPrescription = () => {
            alert('hi');
      }



      render() {

            console.log('check state Modal', this.state);
            let { dataAllPres } = this.state;

            return (
                  <Modal
                        isOpen={this.props.isOpen}
                        toggle={() => this.toggle()}
                        className={"modal-prescription-container"}
                        size="lg"
                  >
                        <div className={'modal-prescription-header'}>
                              <span className='left'>
                                    <i class="fas fa-user-md mx-2"></i>
                                    <FormattedMessage id="manage-prescription.title-prescription" />
                              </span>
                              <span className='right'
                              // onClick={() => this.handleDownloadPrescription}
                              >

                                    <ReactToPrint
                                          trigger={() => {
                                                // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                                // to the root node of the returned component as it will be overwritten.
                                                return <a href="#"><div className="btn btn-primary download">   <FormattedMessage id="manage-prescription.print" /></div></a>;
                                          }}
                                          content={() => this.componentRef}
                                    />
                              </span>
                        </div>

                        <ModalBody>

                              <div>
                                    {
                                       dataAllPres && dataAllPres.length > 0 &&  dataAllPres.map(item => {
      
                                                      return (
                                                            <>
                                                      <ComponentToPrint
                                                            ref={el => (this.componentRef = el)}
                                                            data={item}
                                                      />
                                                      <div><hr></hr></div>
                                                      </>
                                                      );
                                              

                                          })
                                    }

                              </div>

                        </ModalBody>
                        <ModalFooter>

                              <button
                                    type="button"
                                    className="px-3 btn btn-secondary btn-close-pres"
                                    onClick={() => this.toggle()}
                              >
                                    <FormattedMessage id="manage-prescription.close" />
                              </button>
                        </ModalFooter>
                  </Modal>
            );
      }
}

const mapStateToProps = (state) => {
      return {

      };
};

const mapDispatchToProps = (dispatch) => {
      return {

      };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAllPres);
