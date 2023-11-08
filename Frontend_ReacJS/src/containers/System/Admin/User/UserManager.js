import React, { Component, useState, useMemo   } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import "./UserManager.scss";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";

import * as ReactDOM from "react-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Modal from "./Modal";
import { emitter } from "../../../../utils/emitter";
import _ from "lodash";
import ReactLoading from "react-loading";


class UserManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
      isOpenModalUser: false,
      userEdit: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.fetchUserRedux();

    
  }

  /** Life cycle
   * Run component
   *1. init state
   *2. mount(set state) /unmount
   *3. render
   */

  componentDidUpdate(prevProps, prevState, snapchot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({
        usersRedux: this.props.listUsers,
        isLoading: false,
      });
    }

  }

  handleDeleteUser = (user) => {
    this.props.deleteUserRedux(user.id);
  };

 

  handleAddNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
  };

  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,

    });
    emitter.emit("EVENT_CLEAR_MODAL_DATA");
  };

  handleSubmitUserParent = async (data) => {
    let actions = data.actions;
    let formatedDate = new Date(data.birthday).getTime();
    if (actions === CRUD_ACTIONS.CREATE) {

      //fire redux action
      this.props.createNewUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        gender: data.gender,
        roleId: data.roleId,
        positionId: data.positionId,
        image: data.avatar,
        birthday: formatedDate,
      })
      this.toggleUserModal();

    }
    if (actions === CRUD_ACTIONS.EDIT) {
      //fire redux action edit
      this.props.editUserRedux({
        id: data.userIdEdit,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        gender: data.gender,
        roleId: data.roleId,
        positionId: data.positionId,
        image: data.avatar,
        birthday: formatedDate,
      });
      this.toggleUserModal();
    }

  }


  handleEditUser = (item) => {
    this.setState({
      isOpenModalUser: true,
      userEdit: item,
    });
  }


  handleOnchangeSearch = (event) => {
    let lowerCase = event.target.value;
    let listUser = this.state.usersRedux;
    
    console.log('list user', listUser);
    let data = listUser.filter((item) => {
      if (lowerCase === '') {
        return;
      } else {
        return item && item.email && item.firstName.toLowerCase().includes(lowerCase);

      }
    })

    if (!_.isEmpty(data)) {
      this.setState({
        usersRedux: data
      })
    }else {
      this.props.fetchUserRedux();
      
    }

  }

  

  render() {
    
   
    
    let arrUsers = this.state.usersRedux;


    return (
      <div className="user-container container">
        <div className="title-user"><FormattedMessage id="manage-user.title" /></div>


        <div className="user-content">
          <div className="title-content">Danh sách người dùng </div>
          <div className="m-4">
            <button
              className="btn btn-primary p-3"
              onClick={() => this.handleAddNewUser()}
            >
              <FormattedMessage id="manage-user.btn-create" /><i className="fas fa-plus mx-1"></i>
            </button>
          </div>
          <Modal
            isOpen={this.state.isOpenModalUser}
            toggleFromParent={this.toggleUserModal}
            currentUser={this.state.userEdit}
            handleSubmitUserParent={this.handleSubmitUserParent}
          />

          <div className='col-6 search-user m-4'>
            <label><FormattedMessage id="manage-user.search-user" /></label>
            <input className='form-control'
              placeholder='search'
              onChange={(event) => this.handleOnchangeSearch(event)}
            />
          </div>


          <div className="user-table m-4">
            <table className="table table-hover table-striped table-bordered">
              <thead className="thead-dark ">
                <tr className="table-dark">
                  <th scope="col">#</th>
                  <th scope="col"><FormattedMessage id="manage-user.email" /></th>
                  <th scope="col"><FormattedMessage id="manage-user.first-name" /></th>
                  <th scope="col"><FormattedMessage id="manage-user.last-name" /></th>
                  <th scope="col"><FormattedMessage id="manage-user.phone" /></th>
                  <th scope="col"><FormattedMessage id="manage-user.address" /></th>
                  <th scope="col"><FormattedMessage id="manage-user.gender" /></th>
                  <th scope="col"><FormattedMessage id="manage-user.action" /></th>
                </tr>
              </thead>
              <tbody>
                {arrUsers &&
                  arrUsers.length > 0 ?
                  arrUsers.map((item, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.email}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{item.address}</td>
                        <td>{item.gender}</td>
                        <td>
                          <button
                            className="btn btn-edit"
                            onClick={() => this.handleEditUser(item)}
                          >
                            <i className="fas fa-pencil-alt "></i>
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => this.handleDeleteUser(item)}
                          >
                            <i className="fas fa-trash "></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                :
                <>
                {this.state.isLoading === true &&
                      <ReactLoading
                            type="spinningBubbles"
                            color="#0000FF"
                            height={100}
                            width={50}
                      />
                }
              
          </>
                }
              </tbody>
            </table>
          </div>


        </div>


      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    createNewUser: (data) => { dispatch(actions.createNewUser(data)) },
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    editUserRedux: (data) => dispatch(actions.editUser(data)),
    deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManager);
