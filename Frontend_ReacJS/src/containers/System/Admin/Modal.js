import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../utils/emitter";
import "./Modal.scss";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import _ from "lodash";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import localization from 'moment/locale/vi';


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



    checkValidInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'lastName', 'firstName', 'address', 'gender', 'roleId', 'positionId', 'phoneNumber', 'birthday'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input is required ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    }


    handleSubmitUser = () => {
        let isValid = this.checkValidInput();
        if (isValid === true) {
            this.props.handleSubmitUserParent(this.state);
        }
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

        console.log('state', this.state);
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => this.toggle()}
                className={"modal-user-container"}
                size="lg"
            >
                <ModalHeader toggle={this.toggle}>
                    {this.state.actions === 'CREATE' ? <FormattedMessage id="manage-user.title-create" /> : <FormattedMessage id="manage-user.title-edit" />}

                </ModalHeader>
                <ModalBody>

                    <div className="user-redux-body">
                        <div className="container px-3">
                            <div className="row">
                                <form class="row g-3">
                                    <div class="col-md-6">
                                        <label for="email" class="form-label">
                                            <FormattedMessage id="manage-user.email" />
                                        </label>
                                        <input type="email" class="form-control" id="email"
                                            value={email}
                                            onChange={(event) => { this.handleOnchangeInput(event, 'email') }}
                                            disabled={this.state.actions === CRUD_ACTIONS.EDIT ? true : false}
                                        />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="password" class="form-label">
                                            <FormattedMessage id="manage-user.password" />
                                        </label>
                                        <input
                                            type="password"
                                            class="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(event) => { this.handleOnchangeInput(event, 'password') }}
                                            disabled={this.state.actions === CRUD_ACTIONS.EDIT ? true : false}
                                        />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="firstName" class="form-label">
                                            <FormattedMessage id="manage-user.first-name" />
                                        </label>
                                        <input type="text" class="form-control" id="firstName"
                                            value={firstName}
                                            onChange={(event) => { this.handleOnchangeInput(event, 'firstName') }}
                                        />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="lastName" class="form-label">
                                            <FormattedMessage id="manage-user.last-name" />
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id="lastName"
                                            value={lastName}
                                            onChange={(event) => { this.handleOnchangeInput(event, 'lastName') }}
                                        />
                                    </div>
                                    <div class="col-12">
                                        <label for="address" class="form-label">
                                            <FormattedMessage id="manage-user.address" />
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id="address"
                                            placeholder="1234 Main St"
                                            value={address}
                                            onChange={(event) => { this.handleOnchangeInput(event, 'address') }}
                                        />
                                    </div>
                                    <div class="col-6">
                                        <label for="birthday" class="form-label">
                                            <FormattedMessage id="manage-user.birthday" />
                                        </label>
                                        <DatePicker
                                            onChange={this.handleOnChangeDatePicker}
                                            className="form-control"
                                            value={this.state.birthday}
                                            maxDate={yesterday}

                                        />
                                    </div>
                                    <div class="col-6">
                                        <label for="phoneNumber" class="form-label">
                                            <FormattedMessage id="manage-user.phone" />
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id="phoneNumber"
                                            placeholder="Apartment, studio, or floor"
                                            value={phoneNumber}
                                            onChange={(event) => { this.handleOnchangeInput(event, 'phoneNumber') }}
                                        />
                                    </div>

                                    <div class="col-6">
                                        <label for="gender" class="form-label">
                                            <FormattedMessage id="manage-user.gender" />
                                        </label>
                                        <select id="gender" class="form-select"
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
                                    <div class="col-6">
                                        <label for="position" class="form-label">
                                            <FormattedMessage id="manage-user.position" />
                                        </label>
                                        <select id="position" class="form-select"
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
                                    <div class="col-6">
                                        <label for="role" class="form-label">
                                            <FormattedMessage id="manage-user.role" />
                                        </label>
                                        <select id="role" class="form-select"
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
                        class={this.state.actions === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'}>

                        {this.state.actions === CRUD_ACTIONS.EDIT ?
                            <FormattedMessage id="manage-user.edit" />
                            :
                            <FormattedMessage id="manage-user.save" />
                        }


                    </button>
                    <button

                        className="px-3 btn btn-secondary"
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
