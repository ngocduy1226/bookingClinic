import React, { Component, useState, useMemo } from "react";
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
import ModalAllPres from '../../Doctor/ModalAllPres';
import Pagination from "../../../Pagination/Pagination";
import { getAllPrescriptionByPatientIdService } from "../../../../services/prescriptionService";


class UserManger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
      isOpenModalUser: false,
      userEdit: [],
      isLoading: true,

      currentPage: 1,
      recordPerPage: 5,
      records: [],
      nPages: 1,
      numbers: [],

      isShowAllPres: false,
      presCurrent: [],

    };
  }

  componentDidMount() {
    this.props.fetchUserRedux();

    this.getRecord(this.state.currentPage);
  }

  /** Life cycle
   * Run component
   *1. init state
   *2. mount(set state) /unmount
   *3. render
   */

  async componentDidUpdate(prevProps, prevState, snapchot) {
    // if (prevProps.listUsers !== this.props.listUsers) {
    //   let arrUser = this.props.listUsers
    //   for (let i = 0; i < arrUser.length; i++) {
    //     let resAllPres = await getAllPrescriptionByPatientIdService(arrUser[i].id);

    //     arrUser[i].allPres = resAllPres.arrPres;
    //   }

    //   this.setState({
    //     usersRedux: arrUser,
    //     isLoading: false,
    //   }, () => {
    //      this.getRecord(this.state.currentPage);
    //   });

     
    // }

    if (prevProps.listUsers !== this.props.listUsers) {

      let arrUser = this.props.listUsers
      for (let i = 0; i < arrUser.length; i++) {
        let resAllPres = await getAllPrescriptionByPatientIdService(arrUser[i].id);

        arrUser[i].allPres = resAllPres.arrPres;
      }
			this.setState({
				usersRedux: this.props.listUsers,
        isLoading: false,
			}, () => {
				this.getRecord(this.state.currentPage);
			});

			
		}

  }

  handleDeleteUser = (user) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Bạn có chắc chắn muốn xóa người dùng!")) {
      this.props.deleteUserRedux(user.id);
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


  handleOnchangeSearch = async (event) => {
    console.log('event', event.target.value.toLowerCase());
    let lowerCase = event.target.value;
    await this.props.fetchUserRedux();
    let listUser = this.state.usersRedux;

    let data = listUser.filter((item) => {

        if (lowerCase === '') {
            return;
        } else {
            return item && item.firstName.toLowerCase().includes(lowerCase);

        }
    })

    if (!_.isEmpty(data)) {
        this.setState({
          usersRedux: data
        }, () => {
            this.getRecord(this.state.currentPage);
        })
    }else {
      this.setState({
        usersRedux: []
      }, () => {
          this.getRecord(this.state.currentPage);
      })
    }

}




  getRecord = (currentPage) => {
    let arrUsers = this.state.usersRedux;
    let { recordPerPage } = this.state;

    let lastIndex = currentPage * recordPerPage;
    let firstIndex = lastIndex - recordPerPage;
    let records = arrUsers.slice(firstIndex, lastIndex);
    let nPages = Math.ceil(arrUsers.length / recordPerPage);
    let numbers = [...Array(nPages + 1).keys()].slice(1);
    this.setState({
      records: records,
      nPages: nPages,
      numbers: numbers,
    })

  }


  onClickSeeAllPres = (pres) => {
    this.setState({
      isShowAllPres: !this.state.isShowAllPres,
      presCurrent: pres,
    })
  }




  render() {
    let { records, nPages, currentPage, numbers } = this.state;

    console.log('state user', this.state);


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
  

          <ModalAllPres
            isOpen={this.state.isShowAllPres}
            toggleFromParent={this.onClickSeeAllPres}
            dataAllPres={this.state.presCurrent}

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
                  <th scope="col"><FormattedMessage id="manage-user.role" /></th>
                  <th scope="col"><FormattedMessage id="manage-user.action" /></th>
                </tr>
              </thead>
              <tbody>
                {records &&
                  records.length > 0 ?
                  records.map((item, index) => {
                  
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.email}</td>
                        <td>{!_.isEmpty(item.firstName) ? item.firstName : 'Trống' }</td>
                        <td>{!_.isEmpty(item.lastName) ? item.firstName : 'Trống'} </td>
                        <td>{!_.isEmpty(item.phoneNumber) ? item.phoneNumber : 'Trống'}</td>
                        <td>{!_.isEmpty(item.address) ? item.address : 'Trống'}</td>

                        {
                          item.genderData && item.genderData.valueVi ? <td>
                            {item.genderData.valueVi}
                          </td>
                            :
                            <td>
                              Trống
                            </td>
                        }
                        <td>
                          {item.roleData.valueVi}
                        </td>

                        <td className="action-user">
                        {
                            item.allPres && item.allPres.length > 0 &&
                            <div className="btn-review-pres"
                              onClick={() => { this.onClickSeeAllPres(item.allPres) }}>
                               <i class="fas fa-notes-medical"></i>
                            </div>
                          }

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
                  // <>
                  //   {this.state.isLoading === true &&
                  //     <ReactLoading
                  //       type="spinningBubbles"
                  //       color="#0000FF"
                  //       height={100}
                  //       width={50}
                  //     />
                  //   }

                  // </>
                  <>
                  <tr> <td colSpan={9}>Không có dữ liệu</td></tr>
                  </>
                }
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              numbers={numbers}
              getRecordParent={this.getRecord}
              nPages={nPages}
            />


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

export default connect(mapStateToProps, mapDispatchToProps)(UserManger);