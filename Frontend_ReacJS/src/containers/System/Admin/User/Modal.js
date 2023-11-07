import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../../utils/emitter";
import "./Modal.scss";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import moment from "moment";
import localization from 'moment/locale/vi';


import { injectIntl } from 'react-intl';

class ModelUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImageURL: '',

            email: '',
            password: '',
            lastName: '',
            firstName: '',
            address: '',
            phoneNumber: '',
            gender: '',
            roleId: '',
            positionId: '',
            avatar: '',

            actions: '',
            userIdEdit: '',
            birthday: '',
        };
        this.listenToEmitter();
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        await this.props.fetchUserRedux();
    }



    componentDidUpdate(prevProps, prevState, snapchot) {
        //render => didupate  
        // qua khu >< hien tai
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''

            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPosition = this.props.positionRedux
            this.setState({
                positionArr: arrPosition,
                positionId: arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : ''
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRole = this.props.roleRedux
            this.setState({
                roleArr: arrRole,
                roleId: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : ''
            })
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrRole = this.props.roleRedux
            let arrPosition = this.props.positionRedux
            let arrGenders = this.props.genderRedux;

            this.setState({
                email: '',
                password: '',
                lastName: '',
                firstName: '',
                address: '',
                phoneNumber: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                roleId: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : '',
                positionId: arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : '',
                avatar: '',
                actions: CRUD_ACTIONS.CREATE,
                previewImageURL: '',
                birthday: '',
            })

        }

        if (!_.isEmpty(this.props.currentUser) && prevProps.currentUser !== this.props.currentUser) {
            let user = this.props.currentUser;
            let userBirth = user.birthday;
            let birthday = moment.unix(+ userBirth / 1000).format('DD/MM/YYYY');

            let imageBase64 = '';
            if (user.image) {
                imageBase64 = new Buffer(user.image, 'base64').toString('binary');
            }

            this.setState({
                userIdEdit: user.id,
                email: user.email,
                password: 'hask',
                lastName: user.lastName,
                firstName: user.firstName,
                address: user.address,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                roleId: user.roleId,
                positionId: user.positionId,
                avatar: '',
                actions: CRUD_ACTIONS.EDIT,

                previewImageURL: imageBase64,
                birthday: birthday,
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
                previewImageURL: '',

                email: '',
                password: '',
                lastName: '',
                firstName: '',
                address: '',
                phoneNumber: '',
                gender: '',
                roleId: '',
                positionId: '',
                avatar: '',
                birthday: '',
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
            'email', 'password', 'lastName', 'firstName',
            'address', 'gender', 'roleId', 'positionId',
            'phoneNumber', 'birthday'
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


    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImageURL: objectUrl,
                // avatar: file,
                avatar: base64,
            })
        }

    }





    handleSubmitUser = () => {
        let isValid = this.checkValidInput();
        if (isValid === true) {
            this.props.handleSubmitUserParent(this.state);
        }

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0],
        })
    }

    render() {


        let language = this.props.language
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;

        let isLoadingGender = this.props.isLoadingGender;
        let { email, password, lastName, firstName, address, gender,
            roleId, positionId, phoneNumber, avatar, birthday
        } = this.state;

        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        console.log(`Yesterday (oneliner)\n${yesterday}`);

       
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
                            <FormattedMessage id="manage-user.title-create" />
                        </>
                        :
                        <>
                            <span className="mx-3"> <i class="fa-solid fas fa-user-check"></i></span>
                            <FormattedMessage id="manage-user.title-edit" />
                        </>
                    }
        

                </ModalHeader>

                <ModalBody>

                    <div className="user-redux-body">

                        <div className="container px-3">
                            <div className="row">
                                <form class="row g-3">

                                    <div className="col-md-6 ">
                                        <label for="email" class="form-label">
                                            <FormattedMessage id="manage-user.email" /></label>
                                        <div className="wrap-input ">


                                            <input class="data-input" type="email" id="email"
                                                value={email}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'email') }}
                                                disabled={this.state.actions === CRUD_ACTIONS.EDIT ? true : false} placeholder="duy@gmail.com" />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label for="password" class="form-label">
                                            <FormattedMessage id="manage-user.password" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="password"
                                                class="form-control data-input"
                                                id="password"
                                                value={password}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'password') }}
                                                disabled={this.state.actions === CRUD_ACTIONS.EDIT ? true : false}
                                                placeholder="*******"
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="firstName" class="form-label">
                                            <FormattedMessage id="manage-user.first-name" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input type="text" class="form-control data-input" id="firstName"
                                                value={firstName}
                                                placeholder="Duy"
                                                onChange={(event) => { this.handleOnchangeInput(event, 'firstName') }}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="lastName" class="form-label">
                                            <FormattedMessage id="manage-user.last-name" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="text"
                                                class="form-control data-input"
                                                placeholder="Lam"
                                                id="lastName"
                                                value={lastName}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'lastName') }}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label for="address" class="form-label">
                                            <FormattedMessage id="manage-user.address" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="text"
                                                class="form-control data-input"
                                                id="address"
                                                placeholder="1234 Main St"
                                                value={address}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'address') }}
                                            />
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label for="birthday" class="form-label">
                                            <FormattedMessage id="manage-user.birthday" />
                                        </label>
                                        <div className="wrap-input ">
                                            <DatePicker
                                                onChange={this.handleOnChangeDatePicker}
                                                className="form-control data-input"
                                                value={this.state.birthday}
                                                maxDate={yesterday}
                                                placeholder='01/01/2000'

                                            />
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label for="phoneNumber" class="form-label">
                                            <FormattedMessage id="manage-user.phone" />
                                        </label>
                                        <div className="wrap-input ">
                                            <input
                                                type="text"
                                                class="form-control data-input"
                                                id="phoneNumber"
                                                placeholder="0955747642"
                                                value={phoneNumber}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'phoneNumber') }}
                                            />
                                        </div>
                                    </div>

                                    <div class="col-6">
                                        <label for="gender" class="form-label">
                                            <FormattedMessage id="manage-user.gender" />
                                        </label>
                                        <div className="wrap-input ">
                                            <select id="gender" class="form-select input-select"
                                                value={gender}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'gender') }}
                                            >
                                                {/* <option selected>Choose...</option> */}
                                                {genders && genders.length > 0
                                                    && genders.map((item, index) => {

                                                        return (
                                                            <option key={index} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                                        );
                                                    })}


                                            </select>
                                        </div>
                                    </div>



                                    <div class="col-6">
                                        <label for="position" class="form-label">
                                            <FormattedMessage id="manage-user.position" />
                                        </label>
                                        <div className="wrap-input ">
                                            <select id="position" class="form-select input-select"
                                                value={positionId}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'positionId') }}
                                            >
                                                {positions && positions.length > 0 && positions.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.keyMap}  >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>

                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label for="role" class="form-label">
                                            <FormattedMessage id="manage-user.role" />
                                        </label>
                                        <div className="wrap-input ">
                                            <select id="role" class="form-select input-select"
                                                value={roleId}
                                                onChange={(event) => { this.handleOnchangeInput(event, 'roleId') }}
                                            >
                                                {roles && roles.length > 0 && roles.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>

                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label for="image" class="form-label">
                                            <FormattedMessage id="manage-user.image" />
                                        </label>

                                        <div className="preview-img-container">
                                            <input id="previewImg" type="file" hidden
                                                onChange={(event) => this.handleOnChangeImage(event)}

                                            />
                                            <label for="previewImg" className="label-upload">Tải ảnh<i className="fas fa-upload"></i></label>
                                            <div className="preview-image"
                                                style={{ backgroundImage: `url(${this.state.previewImageURL})` }}
                                            >

                                            </div>
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
                        onClick={() => this.handleSubmitUser()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModelUser);
