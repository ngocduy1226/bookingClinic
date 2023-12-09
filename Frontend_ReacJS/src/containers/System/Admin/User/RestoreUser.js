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


class RestoreUser extends Component {
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
      allPres: [],
      presCurrent: [],

    };
  }

  componentDidMount() {
    this.props.fetchUserRedux(+1);

    this.getRecord(this.state.currentPage);
  }

  /** Life cycle
   * Run component
   *1. init state
   *2. mount(set state) /unmount
   *3. render
   */

  async componentDidUpdate(prevProps, prevState, snapchot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      let arrUser = this.props.listUsers
      for (let i = 0; i < arrUser.length; i++) {
        let resAllPres = await getAllPrescriptionByPatientIdService(arrUser[i].id);

        arrUser[i].allPres = resAllPres.arrPres;
      }

      this.setState({
        usersRedux: arrUser,
        isLoading: false,
      });

      this.getRecord(this.state.currentPage);
    }

  }

  handleRestoreUser = (user) => {
   
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Bạn có chắc chắn muốn khôi phục người dùng!")) {
      this.props.restoreUserRedux(user.id);
   } 
  };


  handleOnchangeSearch = (event) => {
    let lowerCase = event.target.value;
    this.props.fetchUserRedux(+1);
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
      })
    } else {
      this.props.fetchUserRedux(+1);

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
          <div className="title-content"><FormattedMessage id="manage-user.restore-user" /> </div>
         
         


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
                    console.log('gender', item)
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
                            className="btn btn-delete"
                            onClick={() => this.handleRestoreUser(item)}
                          >
                            <i className="fas fa-window-restore"></i>
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
    fetchUserRedux: (data) => dispatch(actions.fetchAllUsersStart(data)),
    restoreUserRedux: (id) => dispatch(actions.restoreUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RestoreUser);