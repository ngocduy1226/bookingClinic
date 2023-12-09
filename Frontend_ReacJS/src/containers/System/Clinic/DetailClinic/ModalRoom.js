import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ModalRoom.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
// import { getModalClinicByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../../utils/emitter";
import _ from 'lodash';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import Select from 'react-select';
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalRoom extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  roomIdEdit: '',
                  name: '',
                  description: '',
                  actions: CRUD_ACTIONS.CREATE,
                  listClinic: [],
                  selectedClinic: {},
            };

            this.listenToEmitter();
      }

      componentDidMount() {

      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (!_.isEmpty(this.props.currentClinic) && prevProps.currentClinic !== this.props.currentClinic) {
                  let room = this.props.currentClinic;

                  this.setState({
                        roomIdEdit: room.id,
                        description: room.description,
                        clinicId: room.roomClinicData.id,
                        name: room.name,
                        actions: CRUD_ACTIONS.EDIT,


                  })
            }

            if (prevProps.arrClinicParent !== this.props.arrClinicParent) {
                  let listClinic = this.props.arrClinicParent;
                  this.setState({
                        listClinic: listClinic,
                        selectedClinic: listClinic
                  })
            }

      }

      toggle = () => {
            this.props.toggleFromParent();

      };

      listenToEmitter() {
            emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
                  //reset state
                  this.setState({
                        name: '',
                        description: '',
                        actions: CRUD_ACTIONS.CREATE,

                  })
            });

      }

      buildDataInputSelect = (inputData) => {
            let result = [];
            let { language } = this.props;
            if (inputData && inputData.length > 0) {

                  inputData.map((item, index) => {
                        let object = {};
                        let labelVi = `${item.name}`;
                        // let labelEn = `${item.firstName} ${item.lastName}`;
                        object.label = language === language.VI ? labelVi : labelVi;
                        object.value = item.id;
                        let { idRoomClinic } = this.state

                        if (+idRoomClinic === item.id) {

                              result.push(object);
                              this.setState({

                                    selectedClinic: {
                                          label: item.name,
                                          value: item.id
                                    },

                              })

                        }

                  })
            }
            return result;
      }

      handleOnchangeInput = (event, id) => {
            //good code
            let copyState = { ...this.state };
            copyState[id] = event.target.value;
            this.setState({
                  ...copyState,
            });
      };

      checkValidInput = () => {
            let isValid = true;
            let arrInput = [
                  'name',
                  "description",

            ];
            for (let i = 0; i < arrInput.length; i++) {

                  if (!this.state[arrInput[i]]) {
                        isValid = false;

                        alert("Missing parameter: " + arrInput[i]);
                        break;
                  }
            }
            return isValid;
      };

      handleSubmitRoom = () => {
            let isValid = this.checkValidInput();
            if (isValid === true) {
                  this.props.handleSubmitRoomParent(this.state);
            }

      }

      onChangeInput(event, id) {
            let copyState = { ...this.state };
            copyState[id] = event.target.value;
            this.setState({
                  ...copyState,
            })
      }





      render() {
            let { name, description, listClinic } = this.state;
            console.log('state modal', this.state);

            return (
                  <>
                        <Modal
                              isOpen={this.props.isOpen}
                              toggle={() => this.toggle()}
                              className={"modal-user-container"}
                              size="lg"
                        >
                              <ModalHeader toggle={this.toggle} className={"header-modal"}>

                                    {this.state.actions === 'CREATE' ?
                                          <>
                                                <span className="mx-3"> <i class="fas fa-hospital"></i></span>
                                                <FormattedMessage id="manage-room.title-create" />
                                          </>
                                          :
                                          <>
                                                <span className="mx-3"> <i class="fas fa-hospital"></i></span>
                                                <FormattedMessage id="manage-room.title-edit" />
                                          </>
                                    }

                              </ModalHeader>

                              <ModalBody>


                                    <div className="user-redux-body">

                                          <div className="container px-3">
                                                <div className="row">
                                                      <form class="row g-3">

                                                            <div class="col-md-6">
                                                                  <label><FormattedMessage id="manage-room.name" /></label>
                                                                  <div className="wrap-input ">
                                                                        <input type="text" class="form-control data-input" id="name"
                                                                              value={this.state.name}
                                                                              placeholder="Ten"
                                                                              onChange={(event) => this.onChangeInput(event, 'name')}
                                                                        />

                                                                        <span class="focus-input100"></span>
                                                                  </div>
                                                            </div>

                                                            <div class="col-md-6">
                                                                  <label><FormattedMessage id="manage-room.description" /></label>
                                                                  <div className="wrap-input ">
                                                                        <input type="text" class="form-control data-input" id="description"
                                                                              value={this.state.description}
                                                                              placeholder="ca mau"
                                                                              onChange={(event) => this.onChangeInput(event, 'description')}
                                                                        />

                                                                        <span class="focus-input100"></span>
                                                                  </div>
                                                            </div>


                                                            <div class="col-md-6">
                                                                  <label for="clinicId" class="form-label">
                                                                        <FormattedMessage id="manage-clinic.choose-clinic" />
                                                                  </label>
                                                                  <div className="wrap-input ">
                                                                        <Select

                                                                              value={this.state.selectedClinic}
                                                                              options={listClinic}
                                                                              placeholder={<FormattedMessage id="manage-medicine.choose-formulary" />}
                                                                        />
                                                                        <span class="focus-input100"></span>
                                                                  </div>
                                                            </div>


                                                            <div class="col-12">
                                                                  <div class="form-check">
                                                                        <input
                                                                              class="form-check-input"
                                                                              type="checkbox"
                                                                              id="gridCheck"
                                                                        />
                                                                        <label class="form-check-label" for="gridCheck">
                                                                              Check me out
                                                                        </label>
                                                                  </div>
                                                            </div>
                                                            <div class="col-12">

                                                            </div>
                                                      </form>
                                                </div>
                                          </div>
                                    </div>

                              </ModalBody>
                              <ModalFooter>
                                    <button
                                          type="button"
                                          onClick={() => this.handleSubmitRoom()}
                                          class={this.state.actions === CRUD_ACTIONS.EDIT ? 'btn btn-warning btn-submit-create' : 'btn btn-primary btn-submit-create'}>

                                          {this.state.actions === CRUD_ACTIONS.EDIT ?
                                                <FormattedMessage id="manage-room.edit-room" />
                                                :
                                                <FormattedMessage id="manage-room.create-room" />
                                          }


                                    </button>

                                    <button
                                          type="button"
                                          className="px-3 btn btn-secondary btn-submit-create"
                                          onClick={() => this.toggle()}
                                    >
                                          <FormattedMessage id="manage-formulary.close" />
                                    </button>
                              </ModalFooter>
                        </Modal>
                  </>
            );
      }

}

const mapStateToProps = state => {
      return {
            allClinic: state.admin.allClinic,
            language: state.app.language,
      };
};

const mapDispatchToProps = dispatch => {
      return {

            fetchAllClinic: (data) => dispatch(actions.fetchAllClinic(data)),
      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalRoom));
