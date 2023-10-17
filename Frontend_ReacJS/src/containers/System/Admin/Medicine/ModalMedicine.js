import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../../utils/emitter";
import "./ModalMedicine.scss";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import moment from "moment";
import localization from 'moment/locale/vi';


import { injectIntl } from 'react-intl';

class ModalMedicine extends Component {
    constructor(props) {
        super(props);
        this.state = {
    

            actions: '',
            medicineIdEdit: '',
          
        };
        this.listenToEmitter();
    }

    async componentDidMount() {
        await this.props.fetchUserRedux();
    }



    componentDidUpdate(prevProps, prevState, snapchot) {
        //render => didupate  
        // qua khu >< hien tai
        // if (prevProps.genderRedux !== this.props.genderRedux) {
        //     let arrGenders = this.props.genderRedux;
        //     this.setState({
        //         genderArr: arrGenders,
        //         gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''

        //     })
        // }
        
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrRole = this.props.roleRedux
           

            this.setState({
                
                
                formularyId: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : '',
            
               
                actions: CRUD_ACTIONS.CREATE,
               
            })

        }

        // if (!_.isEmpty(this.props.currentUser) && prevProps.currentUser !== this.props.currentUser) {
        //     let user = this.props.currentUser;
        //     let userBirth = user.birthday;
        //     let birthday = moment.unix(+ userBirth / 1000).format('DD/MM/YYYY');

        //     let imageBase64 = '';
        //     if (user.image) {
        //         imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        //     }

        //     this.setState({
        //         userIdEdit: user.id,
        //         email: user.email,
        //         password: 'hask',
        //         description: user.description,
        //         name: user.name,
        //         address: user.address,
        //         phoneNumber: user.phoneNumber,
        //         gender: user.gender,
        //         formularyId: user.formularyId,
        //         positionId: user.positionId,
        //         avatar: '',
        //         actions: CRUD_ACTIONS.EDIT,

        //         previewImageURL: imageBase64,
        //         birthday: birthday,
        //     })
        // }
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
                
                formularyId: '',
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
            'name','description','uses','using',
            'ingredient','producer'
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


    handleSubmitMedicine = () => {
        let isValid = this.checkValidInput();
        if (isValid === true) {
            this.props.handleSubmitMedicineParent(this.state);
        }

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0],
        })
    }
    
    toggle = () => {
        this.props.toggleFromParent();
    };

    render() {


        let language = this.props.language
        let genders = this.state.genderArr;
    

        
        let { name,  description,  uses , using, ingredient, producer, formularyId
        } = this.state;

       
       
        return (
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
                            <FormattedMessage id="manage-medicine.title-create" />
                        </>
                        :
                        <>
                            <span className="mx-3"> <i class="fa-solid fas fa-user-check"></i></span>
                            <FormattedMessage id="manage-medicine.title-edit" />
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
                                            <FormattedMessage id="manage-medicine.name" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input type="text" class="form-control data-input" id="name"
                                                value={name}
                                                placeholder="ten thuoc"
                                                onChange={(event) => { this.handleOnchangeInput(event, 'name') }}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="description" class="form-label">
                                            <FormattedMessage id="manage-medicine.description" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="text"
                                                class="form-control data-input"
                                                placeholder="Lam"
                                                id="description"
                                                value={description}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'description') }}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="uses" class="form-label">
                                            <FormattedMessage id="manage-medicine.uses" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="text"
                                                class="form-control data-input"
                                                placeholder="Lam"
                                                id="uses"
                                                value={uses}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'uses') }}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>
                                   
                                    <div class="col-md-6">
                                        <label for="using" class="form-label">
                                            <FormattedMessage id="manage-medicine.using" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="text"
                                                class="form-control data-input"
                                                placeholder="Lam"
                                                id="using"
                                                value={using}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'using') }}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label for="ingredient" class="form-label">
                                            <FormattedMessage id="manage-medicine.ingredient" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="text"
                                                class="form-control data-input"
                                                placeholder="Lam"
                                                id="ingredient"
                                                value={ingredient}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'ingredient') }}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>
                            

                                    <div class="col-md-6">
                                        <label for="producer" class="form-label">
                                            <FormattedMessage id="manage-medicine.producer" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="text"
                                                class="form-control data-input"
                                                placeholder="Lam"
                                                id="producer"
                                                value={producer}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'producer') }}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>


                                    <div class="col-md-6">
                                        <label for="formularyId" class="form-label">
                                            <FormattedMessage id="manage-medicine.formulary" />
                                        </label>
                                        <div className="wrap-input ">
                                        <select id="role" class="form-select input-select"
                                                value={formularyId}
                                                placeholder="chon danh muc"

                                              //  onChange={(event) => { this.handleOnchangeInput(event, 'formularyId') }}
                                            >
                                                {/* {roles && roles.length > 0 && roles.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>

                                                    );
                                                })} */}
                                            </select>
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
                        onClick={() => this.handleSubmitMedicine()}
                        class={this.state.actions === CRUD_ACTIONS.EDIT ? 'btn btn-warning btn-submit-create' : 'btn btn-primary btn-submit-create'}>

                        {this.state.actions === CRUD_ACTIONS.EDIT ?
                            <FormattedMessage id="manage-user.edit" />
                            :
                            <FormattedMessage id="manage-user.save" />
                        }


                    </button>
                    <button
                        type="button"
                        className="px-3 btn btn-secondary btn-submit-create"
                        onClick={() => this.toggle()}
                    >
                        Close
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => { dispatch(actions.fetchGenderStart()) },
        getPositionStart: () => { dispatch(actions.fetchPositionStart()) },
        getRoleStart: () => { dispatch(actions.fetchRoleStart()) },
        //    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
        createNewUser: (data) => { dispatch(actions.createNewUser(data)) },
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalMedicine);
