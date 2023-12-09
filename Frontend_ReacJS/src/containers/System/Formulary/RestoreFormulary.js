import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './FormularyManage.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { createNewFormularyService, editFormularyService, restoreFormularyService } from "../../../services/medicineService";
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import ModalFormulary from './ModalFormulary';
import { emitter } from "../../../utils/emitter";
import _ from 'lodash';
import Pagination from '../../Pagination/Pagination';
import ReactLoading from "react-loading";
import { toast } from 'react-toastify';

class RestoreFormulary extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  arrFormulary: [],

                  isLoading: true,
                  currentPage: 1,
                  recordPerPage: 5,
                  records: [],
                  nPages: 1,
                  numbers: [],
            };
      }

      componentDidMount() {
            this.props.fetchAllFormularies({ id: "ALL", status: +1 });
            this.getRecord(this.state.currentPage);
      }

      componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.listFormularies !== this.props.listFormularies) {
                  this.setState({
                        arrFormulary: this.props.listFormularies,
                        isLoading: false,
                  }, () => {
                        this.getRecord(this.state.currentPage);
                  });


            }

      }







      handleOnchangeSearch = async (event) => {
            console.log('event', event.target.value.toLowerCase());
            await this.props.fetchAllFormularies({ id: 'ALL', status: +1 });
            let lowerCase = event.target.value;
            let listFormulary = this.state.arrFormulary;

            let data = listFormulary.filter((item) => {

                  if (lowerCase === '') {
                        return;
                  } else {
                        return item && item.name.toLowerCase().includes(lowerCase);

                  }
            })

            if (!_.isEmpty(data)) {
                  this.setState({
                        arrFormulary: data
                  }, () => {
                        this.getRecord(this.state.currentPage);
                  })
            }

      }

      handleRestoreFormulary = async (formularyInput) => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Bạn có chắc chắn muốn khôi phục danh mục!")) {

                  let formulary = await restoreFormularyService(
                        formularyInput.id
                  )

                  if (formulary && formulary.errCode === 0) {
                        toast.success('restore formulary success');
                        await this.props.fetchAllFormularies({ id: "ALL", status: +1 });
                  } else {
                        toast.error('restore formulary failed');
                  }
            }
      };


      getRecord = (currentPage) => {
            let arrFormulary = this.state.arrFormulary;
            let { recordPerPage } = this.state;

            let lastIndex = currentPage * recordPerPage;
            let firstIndex = lastIndex - recordPerPage;
            let records = arrFormulary.slice(firstIndex, lastIndex);
            let nPages = Math.ceil(arrFormulary.length / recordPerPage);
            let numbers = [...Array(nPages + 1).keys()].slice(1);
            this.setState({
                  records: records,
                  nPages: nPages,
                  numbers: numbers,
            })

      }

      render() {
            console.log('stat', this.state);
            let { arrFormulary } = this.state;
            let { records, nPages, currentPage, numbers } = this.state;


            return (
                  <>
                        <div className='formulary-manage-container'>
                              <div className='formulary-manage-title'>
                                    <FormattedMessage id="manage-formulary.title" />
                              </div>
                              <div className='formulary-manage-content'>

                                    <div className='formulary-manage-title-sub'>
                                          <FormattedMessage id="manage-formulary.restore-formulary" />
                                    </div>
                                    <div className='body-content'>

                                          <div className='option-choose-formulary row'>
                                                <div className='col-6 '>

                                                </div>
                                                <div className='col-6 search-formulary '>
                                                      <label><FormattedMessage id="manage-formulary.search-formulary" /></label>
                                                      <input className='form-control'
                                                            placeholder='search'
                                                            onChange={(event) => this.handleOnchangeSearch(event)} />
                                                </div>

                                          </div>
                                          <div className='table-manage-formulary'>
                                                <table class="table table-hover table-striped table-bordered">
                                                      <thead className="thead-dark " >
                                                            <tr className="table-dark">
                                                                  <th scope="col">#</th>
                                                                  <th scope="col"><FormattedMessage id="manage-formulary.name" /></th>
                                                                  <th scope="col"><FormattedMessage id="manage-formulary.description" /></th>
                                                                  <th scope="col"><FormattedMessage id="manage-formulary.action" /></th>
                                                            </tr>
                                                      </thead>
                                                      <tbody>
                                                            {records &&
                                                                  records.length > 0 ?
                                                                  records.map((item, index) => {
                                                                        return (
                                                                              <tr key={index}>
                                                                                    <th scope="row">{index + 1}</th>
                                                                                    <td>{item.name}</td>
                                                                                    <td>{item.description}</td>

                                                                                    <td>
                                                                                          <div className='btn btn-detail'
                                                                                                onClick={() => this.handleRestoreFormulary(item)}>
                                                                                                <i class="fas fa-window-restore"></i>
                                                                                          </div>

                                                                                    </td>
                                                                              </tr>
                                                                        );
                                                                  })
                                                                  :
                                                                  <>
                                                                        <tr>
                                                                              <td colSpan={4} >
                                                                                    <FormattedMessage id="manage-formulary.not-data" />
                                                                              </td>
                                                                        </tr>

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

                        </div>
                  </>
            );
      }

}

const mapStateToProps = state => {
      return {

            language: state.app.language,
            listFormularies: state.admin.formularies,
      };
};

const mapDispatchToProps = dispatch => {
      return {
            fetchAllFormularies: (data) => dispatch(actions.fetchAllFormularies(data)),

      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RestoreFormulary));
