import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ModalSendMail.scss'


import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from 'lodash';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils';


class ModalSendMail extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            email: '',
            imageBase64: '',

        };
    }

    componentDidMount() {

        this.setState({
            email: this.props.dataBooking.email,

        })
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {
            this.setState({


            })
        }

        if (prevProps.dataBooking !== this.props.dataBooking) {

            this.setState({
                email: this.props.dataBooking.email,

            })
        }



    }

    handleOnchangeEmail = (event) => {
        let email = event.target.value
        this.setState({
            email: email,
        })
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            })
        }

    }
    handleSendInfo = () => {
        this.props.sendEmail(this.state);
    }



    render() {
        let { isOpenModal, closeModal, dataBooking, language, sendEmail } = this.props;

        return (
            <Modal isOpen={isOpenModal}
                className='modal-content-send-email'
            >
                <div class="modal-header">
                    <span className='icon-email'><i class="fas fa-envelope"></i></span>
                    <h5 class="modal-title"><FormattedMessage id="manage-patient.send-email-prescription" /> </h5>
                    <button type="button" class="btn-close" aria-label="Close" onClick={closeModal}></button>
                </div>
                <ModalBody>
                    <div className='body-modal-send'>
                        <div className='form-group col-12 my-3'>
                            <label><FormattedMessage id="manage-patient.send-email" /></label>
                            <div className='wrap-input'>
                                <input type='text' className='form-control data-input'
                                    value={this.state.email} placeholder='email@gmail.com'
                                    onChange={(event) => this.handleOnchangeEmail(event)}
                                />
                                <span class="focus-input100"></span>
                            </div>

                        </div>

                        <div className='form-group col-12 my-3'>
                            <label><FormattedMessage id="manage-patient.send-file" /></label>
                            <div className='wrap-input'>
                                <input type='file' className='form-control data-input' onChange={(event) => { this.handleOnChangeImage(event) }} />
                                <span class="focus-input100"></span>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className='modal-footer'>
                    <Button color="primary" className='btn-email' onClick={() => this.handleSendInfo()}>
                        <FormattedMessage id="manage-patient.submit-confirm" />
                    </Button>
                    <Button color="secondary" className='btn-email' onClick={closeModal}>
                        <FormattedMessage id="manage-patient.cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
        genderRedux: state.admin.genders,

    };
};

const mapDispatchToProps = dispatch => {
    return {



    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalSendMail));
