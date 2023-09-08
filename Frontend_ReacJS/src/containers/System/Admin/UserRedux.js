import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS ,CommonUtils} from "../../../utils";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import { before } from "lodash";
import TableManagerUser from './TableManagerUser';

class UserManageRedux extends Component {


    constructor(prop) {
        super(prop);
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
            userIdEdit: ''
        };
    }

    async componentDidMount() {

        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();

    }

    changeLanguage = (language) => {
        //fire redux event: actions
        this.props.changeLanguageAppRedux(language);
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

            }) 
            //console.log('image', this.state);
        }
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            //   console.log("file imag", objectUrl);
            this.setState({
                previewImageURL: objectUrl,
                // avatar: file,
                avatar: base64,
            })
        }

    }
    handleSubmit = () => {

        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        let { actions } = this.state;

        if (actions === CRUD_ACTIONS.CREATE) {
            //fire redux action
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                gender: this.state.gender,
                roleId: this.state.roleId,
                positionId: this.state.positionId,
                image: this.state.avatar,
            })
        }
        if (actions === CRUD_ACTIONS.EDIT) {
            console.log('edit');
            //fire redux action edit
            this.props.editUserRedux({
                id: this.state.userIdEdit,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                gender: this.state.gender,
                roleId: this.state.roleId,
                positionId: this.state.positionId,
                image: this.state.avatar,
            });
        }



    }



    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        }, () => {

        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'lastName', 'firstName', 'address', 'gender', 'roleId', 'positionId', 'phoneNumber'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input is required ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    }

    handleEditUserParent = (user) => {
       let imageBase64 = '';
       if( user.image) {
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
        })
    }

    render() {

        let language = this.props.language
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;

        let isLoadingGender = this.props.isLoadingGender;
        let { email, password, lastName, firstName, address, gender,
            roleId, positionId, phoneNumber, avatar
        } = this.state;


        return (
            <div className="user-redux-container">
                <div className="title">
                    <FormattedMessage id="manage-user.add" />
                </div>
                <div className="user-redux-body">
                    <div className="container px-5">
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
                                <div class="col-6">
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

                                <div class="col-md-3">
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
                                <div class="col-md-3">
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
                                <div class="col-md-3">
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
                                <div class="col-md-3">
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
                                    <button
                                        type="button"
                                        onClick={() => this.handleSubmit()}
                                        class={this.state.actions === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'}>

                                        {this.state.actions === CRUD_ACTIONS.EDIT ?
                                            <FormattedMessage id="manage-user.edit" />
                                            :
                                            <FormattedMessage id="manage-user.save" />
                                        }


                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <TableManagerUser
                    handleEditUserParentKey={this.handleEditUserParent}
                />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManageRedux);
