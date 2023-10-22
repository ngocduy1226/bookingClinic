import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ModalFormulary.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
// import { getModalFormularyByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../utils/emitter";
import _ from 'lodash';

class ModalFormulary extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            formularyIdEdit: '',
            description: '',
            name: '',
            actions: CRUD_ACTIONS.CREATE,
        };

        this.listenToEmitter();
    }

    componentDidMount() {
      
    }
     
    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (!_.isEmpty(this.props.currentFormulary) && prevProps.currentFormulary !== this.props.currentFormulary) {
            let medicine = this.props.currentFormulary;
       
            this.setState({
                medicineIdEdit: medicine.id,
                description: medicine.description,
                name: medicine.name,
                actions: CRUD_ACTIONS.EDIT,


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
                description: '',
                name: '',
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
            'name', 'description'
        ];
        for (let i = 0; i < arrInput.length; i++) {
            console.log("check arr", arrInput[i]);
            if (!this.state[arrInput[i]]) {
                isValid = false;

                alert("Missing parameter: " + arrInput[i]);
                break;
            }
        }
        return isValid;
    };

    handleSubmitFormulary = () => {
        let isValid = this.checkValidInput();
        if (isValid === true) {
            this.props.handleSubmitFormularyParent(this.state);
        }

    }
    
    render() {
        let {name, description} = this.state;
    


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
                            <FormattedMessage id="manage-formulary.title-create" />
                        </>
                        :
                        <>
                            <span className="mx-3"> <i class="fa-solid fas fa-user-check"></i></span>
                            <FormattedMessage id="manage-formulary.title-edit" />
                        </>
                    }

                </ModalHeader>

                <ModalBody>

                    <div className="user-redux-body">

                        <div className="container px-3">
                            <div className="row">
                                <form class="row g-3">

                                    <div class="col-md-6">
                                        <label for="name" class="form-label">
                                            <FormattedMessage id="manage-formulary.name" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input type="text" class="form-control data-input" id="name"
                                                value={name}
                                                placeholder="Ten"
                                                onChange={(event) => { this.handleOnchangeInput(event, 'name') }}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="description" class="form-label">
                                            <FormattedMessage id="manage-formulary.description" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="text"
                                                class="form-control data-input"
                                                placeholder="Mo ta "
                                                id="description"
                                                value={description}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'description') }}
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
                        onClick={() => this.handleSubmitFormulary()}
                        class={this.state.actions === CRUD_ACTIONS.EDIT ? 'btn btn-warning btn-submit-create' : 'btn btn-primary btn-submit-create'}>

                        {this.state.actions === CRUD_ACTIONS.EDIT ?
                            <FormattedMessage id="manage-formulary.edit" />
                            :
                            <FormattedMessage id="manage-formulary.save" />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalFormulary));
