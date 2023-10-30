import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ModalSchedule.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormattedMessage } from 'react-intl';
import CalendarSchedule from '../../Doctor/Calendar/CalendarSchedule';


class ModalSchedule extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  currentDoctor: {},
                  listScheduleDoctor: [],
            };
      }

      componentDidMount() {

            let id = this.props.currentDoctor.id;

            this.props.fetchAllScheduleByIdDoctor(id);

      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.currentDoctor !== this.props.currentDoctor) {

                  this.setState({
                        currentDoctor: this.props.currentDoctor,
                  })
                  let id = this.props.currentDoctor.id;
                  this.props.fetchAllScheduleByIdDoctor(id);
            }

            if (prevProps.arrScheduleDoctor !== this.props.arrScheduleDoctor) {
                  this.setState({
                        listScheduleDoctor: this.props.arrScheduleDoctor,

                  })
            }

      }



      toggle = () => {
            this.props.toggleFromParent();

      };

      render() {
            console.log('this state', this.state);



            return (
                  <div>
                        <Modal
                              isOpen={this.props.isOpen}
                              toggle={() => this.toggle()}
                              className={"modal-user-container"}
                              size="lg"
                        >
                              <ModalHeader toggle={this.toggle} className={"header-modal"}>
                                    <span className="mx-3">
                                    <i class="fas fa-user-md"></i>
                                    </span>
                                    <FormattedMessage id="manage-schedule.title-schedule-sub" />
                              </ModalHeader>

                              <ModalBody>
                                    <div className="user-redux-body">
                                          <div className="container px-3">
                                                <div className="row">
                                                      <CalendarSchedule listScheduleDoctorParent={this.state.listScheduleDoctor} />
                                                </div>
                                          </div>
                                    </div>

                              </ModalBody>
                              <ModalFooter>
                                    <button
                                          type="button"
                                          className="px-3 btn btn-secondary btn-submit-create"
                                          onClick={() => this.toggle()}
                                    >
                                          <FormattedMessage id="manage-medicine.close" />
                                    </button>
                              </ModalFooter>
                        </Modal>
                  </div>
            );
      }

}

const mapStateToProps = state => {
      return {
            arrScheduleDoctor: state.admin.arrScheduleDoctor,
            language: state.app.language,
      };
};

const mapDispatchToProps = dispatch => {
      return {

            fetchAllScheduleByIdDoctor: (id) => dispatch(actions.fetchAllScheduleByIdDoctor(id))
      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalSchedule));
