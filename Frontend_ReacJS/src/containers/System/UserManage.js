import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
  getAllUsersService,
  createNewUserService,
  deleteUserService,
  editUserService
} from "../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
import { emitter } from "../../utils/emitter";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      isOpenModalUser: false,
      isOpenModalEditUser: false,
      userEdit: {}
    };
  }

  async componentDidMount() {
    // console.log('get user', response);
    await this.getAllUsersFromReacJS();
  }

  /** Life cycle
   * Run component
   *1. init state
   *2. mount(set state) /unmount
   *3. render
   */

  getAllUsersFromReacJS = async () => {
    let response = await getAllUsersService("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUsers: response.users,
      });
    }
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
  };

  toggleUserEditModal = () => {
    this.setState({
      isOpenModalEditUser: !this.state.isOpenModalEditUser,
    });
  };

  handleDeleteUser = async (user) => {
    
    try {
      let res = await deleteUserService(user.id);
      console.log(res);
      if (res && res.errCode === 0) {
        this.getAllUsersFromReacJS();
      } else {
        alert(res.errMessage);
      }
    } catch (err) {
      console.log(err);
    }
  };
 
  handleEditUser = async (user) => {
    console.log("check edit user", user);
    this.setState({
        isOpenModalEditUser: true,
        userEdit: user,
       
    })
 
  };

  doEditUser = async (user) => {
      try{
        let res = await editUserService(user);
         if(res && res.errCode === 0) {
          this.setState({
            isOpenModalEditUser: false,
          })
          await this.getAllUsersFromReacJS();
         }else {
          alert(res.errMessage);
         }
      }
      catch(err){
          console.log(err);
      }


  }
 

  createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
     // console.log('check response', response);
      if (response && response.errCode !== 0) {
        //  console.log('check response', response);
        alert(response.errMessage);
      } else {
        await this.getAllUsersFromReacJS();
        this.setState({
          isOpenModalUser: false,
        });
        //create event
        // emitter.emit('EVENT_CLEAR_MODAL_DATA', {'id data': 'data'});
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    } catch (e) {
      console.log(e);
    }
    // console.log('check data', data);
  };

  render() {
    // console.log('check', this.state.arrUsers),
    let arrUsers = this.state.arrUsers;

    return (
      <div className="user-container container">
        <div className="title mt-4">Manage users</div>
        <div className="">
          <button
            className="btn btn-primary px-3"
            onClick={() => this.handleAddNewUser()}
          >
            Add new user<i className="fas fa-plus mx-1"></i>
          </button>
        </div>
        <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggleFromParent={this.toggleUserModal}
          createNewUser={this.createNewUser}
        />
        {
          this.state.isOpenModalEditUser &&
          <ModalEditUser
          isOpen={this.state.isOpenModalEditUser}
           toggleFromParent = { this.toggleUserEditModal}
           currentUser = { this.state.userEdit}
           editUser = {this.doEditUser}
          // createNewUser = {this.createNewUser}
        />
        }

        

        <div className="user-table my-5">
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr className="table-primary">
                <th scope="col">#</th>
                <th scope="col">Email</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Address</th>
                <th scope="col">Gender</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {arrUsers &&
                arrUsers.map((item, index) => {
                  //console.log('duy check', item, index);
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
                        <button className="btn btn-edit"  onClick={() => this.handleEditUser(item)}>
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
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
