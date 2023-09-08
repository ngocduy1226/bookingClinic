import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./TableManagerUser.scss";

import * as ReactDOM from "react-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);



// Finish!

class TableManagerUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
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
      });
    }
  }

  handleDeleteUser = (user) => {
    this.props.deleteUserRedux(user.id);
  };

  handleEditUser = (user) => {
    this.props.handleEditUserParentKey(user);
  };
  render() {
    console.log("check get all user", this.props.listUsers);
    let arrUsers = this.state.usersRedux;
    return (
      <div className="user-container container">
        <div className="title mt-4">Manage users</div>

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
                arrUsers.length > 0 &&
                arrUsers.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">1</th>
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
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerUser);
