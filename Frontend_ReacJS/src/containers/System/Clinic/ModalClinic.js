import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ModalClinic.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
// import { getModalClinicByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../utils/emitter";
import _ from 'lodash';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalClinic extends Component {


      constructor(prop) {
            super(prop);
            this.state = {

                  clinicIdEdit: '',
                  preImageBase64: '',
                  imageBase64: '',
                  name: '',
                  address: '',
                  preImageBase64Sub: '',
                  imageBase64Sub: '',
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

            if (!_.isEmpty(this.props.currentClinic) && prevProps.currentClinic !== this.props.currentClinic) {
                  let clinic = this.props.currentClinic;
                  let imageBase64Sub = '';
                  if (clinic.imageSub) {
                      imageBase64Sub = new Buffer(clinic.imageSub, 'base64').toString('binary');
                  }
      
                  this.setState({
                        clinicIdEdit: clinic.id,
                        address: clinic.address,
                        descriptionHTML: clinic.descriptionHTML,
                        descriptionMarkdown: clinic.descriptionMarkdown,
                        name: clinic.name,
                        imageBase64: clinic.imageBase64,
                        imageBase64Sub: clinic.imageBase64Sub,
                        actions: CRUD_ACTIONS.EDIT,
                        preImageBase64: clinic.image,
                        preImageBase64Sub: imageBase64Sub,

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
                        imageBase64: '',
                        name: '',
                        address: '',
                        preImageBase64Sub: '',
                        imageBase64Sub: '',
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
                  "address",
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

      handleSubmitClinic = () => {
            let isValid = this.checkValidInput();
            if (isValid === true) {
                  this.props.handleSubmitClinicParent(this.state);
            }

      }

      onChangeInput(event, id) {
            let copyState = { ...this.state };
            copyState[id] = event.target.value;
            this.setState({
                  ...copyState,
            })
      }


      handleOnChangeImage = async (event, id) => {
            let file = event.target.files[0];
            if (id === 'avatar') {
                  if (file) {
                        let base64 = await CommonUtils.getBase64(file);
                        let objectUrl = URL.createObjectURL(file);

                        this.setState({
                              preImageBase64: objectUrl,

                              imageBase64: base64,
                        })
                  }
            }

            if (id === 'imageSub') {
                  if (file) {
                        let base64 = await CommonUtils.getBase64(file);
                        let objectUrl = URL.createObjectURL(file);

                        this.setState({
                              preImageBase64Sub: objectUrl,

                              imageBase64Sub: base64,
                        })
                  }
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
                                                <FormattedMessage id="manage-clinic.title-create" />
                                          </>
                                          :
                                          <>
                                                <span className="mx-3"> <i class="fas fa-hospital"></i></span>
                                                <FormattedMessage id="manage-clinic.title-edit" />
                                          </>
                                    }

                              </ModalHeader>

                              <ModalBody>


                                    <div className="user-redux-body">

                                          <div className="container px-3">
                                                <div className="row">
                                                      <form class="row g-3">

                                                            <div class="col-md-6">
                                                                  <label><FormattedMessage id="manage-clinic.name" /></label>
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
                                                                  <label><FormattedMessage id="manage-clinic.address" /></label>
                                                                  <div className="wrap-input ">
                                                                        <input type="text" class="form-control data-input" id="address"
                                                                              value={this.state.address}
                                                                              placeholder="ca mau"
                                                                              onChange={(event) => this.onChangeInput(event, 'address')}
                                                                        />

                                                                        <span class="focus-input100"></span>
                                                                  </div>
                                                            </div>

                                                            <div class="col-md-6">

                                                                  <label for="previewImg" class="form-label"><FormattedMessage id="manage-clinic.logo" /></label>

                                                                  <div className="preview-img-container">
                                                                        <input id="previewImg" type="file" hidden
                                                                              onChange={(event) => this.handleOnChangeImage(event, "avatar")}

                                                                        />
                                                                        <label for="previewImg" className="label-upload">Tải ảnh<i className="fas fa-upload"></i></label>
                                                                        <div className="preview-image"
                                                                              style={{ backgroundImage: `url(${this.state.preImageBase64})` }}
                                                                        >

                                                                        </div>
                                                                  </div>
                                                            </div>

                                                            <div class="col-md-6">

                                                                  <label for="previewImgSub" class="form-label"><FormattedMessage id="manage-clinic.art" /></label>

                                                                  <div className="preview-img-container">
                                                                        <input id="previewImgSub" type="file" hidden
                                                                              onChange={(event) => this.handleOnChangeImage(event, "imageSub")}

                                                                        />
                                                                        <label for="previewImgSub" className="label-upload">Tải ảnh<i className="fas fa-upload"></i></label>
                                                                        <div className="preview-image"
                                                                              style={{ backgroundImage: `url(${this.state.preImageBase64Sub})` }}
                                                                        >

                                                                        </div>
                                                                  </div>
                                                            </div>
                                                            <div className='col-12 my-2'>
                                                                  <label><FormattedMessage id="manage-clinic.description" /></label>
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
                                          onClick={() => this.handleSubmitClinic()}
                                          class={this.state.actions === CRUD_ACTIONS.EDIT ? 'btn btn-warning btn-submit-create' : 'btn btn-primary btn-submit-create'}>

                                          {this.state.actions === CRUD_ACTIONS.EDIT ?
                                                <FormattedMessage id="manage-clinic.edit-clinic" />
                                                :
                                                <FormattedMessage id="manage-clinic.create-clinic" />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalClinic));
