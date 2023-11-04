import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ModalSpecialty.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
// import { getModalSpecialtyByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../utils/emitter";
import _ from 'lodash';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalSpecialty extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  specialtyIdEdit: '',
                  preImageBase64: '',
                  name: '',
                  imageBase64: '',
                  descriptionMarkdown: '',
                  descriptionHTML: '',
                  actions: CRUD_ACTIONS.CREATE,
            };

            this.listenToEmitter();
      }

      componentDidMount() {

      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (!_.isEmpty(this.props.currentSpecialty) && prevProps.currentSpecialty !== this.props.currentSpecialty) {
                  let specialty = this.props.currentSpecialty;

                  this.setState({
                        specialtyIdEdit: specialty.id,
                        descriptionHTML: specialty.descriptionHTML,
                        descriptionMarkdown: specialty.descriptionMarkdown,
                        name: specialty.name,
                        imageBase64: specialty.imageBase64,
                        actions: CRUD_ACTIONS.EDIT,
                        preImageBase64: specialty.image,

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
                        preImageBase64: '',
                        name: '',
                        imageBase64: '',
                        descriptionMarkdown: '',
                        descriptionHTML: '',
                        actions: CRUD_ACTIONS.CREATE,

                  })
            });

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

                  'descriptionMarkdown',
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

      handleSubmitSpecialty = () => {
            let isValid = this.checkValidInput();
            if (isValid === true) {
                  this.props.handleSubmitSpecialtyParent(this.state);
            }

      }

      onChangeInput(event, id) {
            let copyState = { ...this.state };
            copyState[id] = event.target.value;
            this.setState({
                  ...copyState,
            })
      }

      handleOnChangeImage = async (event) => {
            let file = event.target.files[0];

            if (file) {
                  let base64 = await CommonUtils.getBase64(file);
                  let objectUrl = URL.createObjectURL(file);

                  this.setState({
                        preImageBase64: objectUrl,

                        imageBase64: base64,
                  })
            }

      }

      handleEditorChange = ({ html, text }) => {
            this.setState({
                  descriptionHTML: html,
                  descriptionMarkdown: text,
            })
      }



      render() {
            let { name, description } = this.state;


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
                                                <span className="mx-3"> <i class="fas fa-user-plus"></i></span>
                                                <FormattedMessage id="manage-specialty.title-create" />
                                          </>
                                          :
                                          <>
                                                <span className="mx-3"> <i class="fa-solid fas fa-user-check"></i></span>
                                                <FormattedMessage id="manage-specialty.title-edit" />
                                          </>
                                    }

                              </ModalHeader>

                              <ModalBody>


                                    <div className="user-redux-body">

                                          <div className="container px-3">
                                                <div className="row">
                                                      <form class="row g-3">

                                                            <div class="col-md-6">
                                                                  <label><FormattedMessage id="manage-specialty.name" /></label>
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

                                                                  <label for="description" class="form-label"><FormattedMessage id="manage-specialty.logo" /></label>

                                                                  <div className="preview-img-container">
                                                                        <input id="previewImg" type="file" hidden
                                                                              onChange={(event) => this.handleOnChangeImage(event)}

                                                                        />
                                                                        <label for="previewImg" className="label-upload">Tải ảnh<i className="fas fa-upload"></i></label>
                                                                        <div className="preview-image"
                                                                              style={{ backgroundImage: `url(${this.state.preImageBase64})` }}
                                                                        >

                                                                        </div>
                                                                  </div>
                                                            </div>
                                                            <div className='col-12 my-2'>
                                                                  <label><FormattedMessage id="manage-specialty.description" /></label>
                                                                  <MdEditor style={{ height: '300px' }}
                                                                        renderHTML={text => mdParser.render(text)}
                                                                        onChange={this.handleEditorChange}
                                                                        value={this.state.descriptionMarkdown}

                                                                  />
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
                                          onClick={() => this.handleSubmitSpecialty()}
                                          class={this.state.actions === CRUD_ACTIONS.EDIT ? 'btn btn-warning btn-submit-create' : 'btn btn-primary btn-submit-create'}>

                                          {this.state.actions === CRUD_ACTIONS.EDIT ?
                                                <FormattedMessage id="manage-specialty.edit-specialty" />
                                                :
                                                <FormattedMessage id="manage-specialty.create-specialty" />
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

            language: state.app.language,
      };
};

const mapDispatchToProps = dispatch => {
      return {


      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalSpecialty));
