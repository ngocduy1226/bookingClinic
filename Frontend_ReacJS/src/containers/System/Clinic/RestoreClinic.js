import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ManageClinic.scss'
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { emitter } from "../../../utils/emitter";
import { restoreClinicService } from "../../../services/clinicService";
import { toast } from 'react-toastify';
import ModalClinic from './ModalClinic';
import _ from 'lodash';
import Pagination from '../../Pagination/Pagination';


class RestoreClinic extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  listClinic: [],
                  isOpenModalClinic: false,
                  clinicEdit: {},

                  name: '',
                  address: '',
                  imageBase64: '',
                  imageBase64Sub: '',
                  descriptionMarkdown: '',
                  descriptionHTML: '',

                  currentPage: 1,
                  recordPerPage: 5,
                  records: [],
                  nPages: 1,
                  numbers: []

            };
      }

      componentDidMount() {
            this.props.fetchAllClinic(+1);
            this.getRecord(this.state.currentPage);
      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.allClinic !== this.props.allClinic) {
                  this.setState({
                        listClinic: this.props.allClinic,
                  }, () => {
                        this.getRecord(this.state.currentPage);
                  })


            }


      }


      getRecord = (currentPage) => {
            let arrClinics = this.state.listClinic;
            let { recordPerPage } = this.state;

            let lastIndex = currentPage * recordPerPage;
            let firstIndex = lastIndex - recordPerPage;
            let records = arrClinics.slice(firstIndex, lastIndex);
            let nPages = Math.ceil(arrClinics.length / recordPerPage);
            let numbers = [...Array(nPages + 1).keys()].slice(1);
            this.setState({
                  records: records,
                  nPages: nPages,
                  numbers: numbers,
            })
      }

      handleOnchangeSearch = async (event) => {
            console.log('event', event.target.value.toLowerCase());
            let lowerCase = event.target.value;
            await this.props.fetchAllClinic(+1);
            let listClinic = this.state.listClinic;

            let data = listClinic.filter((item) => {

                  if (lowerCase === '') {
                        return;
                  } else {
                        return item && item.name.toLowerCase().includes(lowerCase);
                  }
            })

            if (!_.isEmpty(data)) {
                  this.setState({
                        listClinic: data
                  }, () => {
                        this.getRecord(this.state.currentPage);
                  })
            }

      }


      handleRestoreClinic = async (clinicInput) => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Bạn có chắc chắn muốn khôi phục cơ sở y tế!")) {

                  let clinic = await restoreClinicService(
                        clinicInput.id
                  )

                  if (clinic && clinic.errCode === 0) {
                        toast.success('restore clinic success');
                        await this.props.fetchAllClinic(+1);
                  } else {
                        toast.error('restore clinic failed');
                  }


            }


      };

      render() {
            let { listClinic } = this.state;
            let { records, nPages, currentPage, numbers } = this.state;
            return (
                  <>
                        <ModalClinic
                              isOpen={this.state.isOpenModalClinic}
                              toggleFromParent={this.toggleClinicModal}
                              currentClinic={this.state.clinicEdit}
                              handleSubmitClinicParent={this.handleSubmitClinicParent}

                        />

                        <div className="manage-clinic-container container">
                              <div className='manage-clinic-title'>
                                    <FormattedMessage id="manage-clinic.title" /></div>
                              <div className='manage-clinic-content'>
                                    <div className='manage-clinic-title-sub'> <FormattedMessage id="manage-clinic.restore-clinic" /></div>
                                    <div className='manage-clinic-body'>

                                          <div className='option-choose-clinic row'>
                                                <div className='col-6 '>
                                                </div>
                                                <div className='col-6 search-clinic '>
                                                      <label><FormattedMessage id="manage-clinic.search-clinic" /></label>
                                                      <input className='form-control'
                                                            placeholder='search'
                                                            onChange={(event) => this.handleOnchangeSearch(event)} />
                                                </div>

                                          </div>

                                          <div className='table-clinic'>

                                                <table class="table table-hover table-striped table-bordered">
                                                      <thead className="thead-dark " >
                                                            <tr className="table-dark">
                                                                  <th scope="col">#</th>
                                                                  <th scope="col"><FormattedMessage id="manage-clinic.name" /></th>

                                                                  <th scope="col"><FormattedMessage id="manage-clinic.logo" /></th>
                                                                  <th scope="col"><FormattedMessage id="manage-clinic.art" /></th>
                                                                  <th scope="col"><FormattedMessage id="manage-clinic.description" /></th>

                                                                  <th scope="col"><FormattedMessage id="manage-clinic.action" /></th>
                                                            </tr>
                                                      </thead>
                                                      <tbody>
                                                            {records &&
                                                                  records.length > 0 ?
                                                                  records.map((item, index) => {
                                                                        item.image = item.image ? item.image : `https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg`

                                                                        let imageSub = `https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg`;
                                                                        if (item.imageSub) {
                                                                              imageSub = new Buffer(item.imageSub, 'base64').toString('binary');
                                                                        }
                                                                        return (
                                                                              <tr key={index}>
                                                                                    <th scope="row">{index + 1}</th>
                                                                                    <td>{item.name}</td>
                                                                                    <td>
                                                                                          <div className='image-clinic' style={{ backgroundImage: `url(${item.image})` }}></div>
                                                                                    </td>
                                                                                    <td>
                                                                                          <div className='image-clinic' style={{ backgroundImage: `url(${imageSub})` }}></div>
                                                                                    </td>
                                                                                    <td><div className='text-description'>{item.address}</div></td>
                                                                                    <td className='action-clinic'>
                                                                                          <div className='btn btn-detail'
                                                                                                onClick={() => this.handleRestoreClinic(item)}>
                                                                                                <i class="fas fa-window-restore"></i>
                                                                                          </div>
                                                                                    </td>
                                                                              </tr>
                                                                        );
                                                                  })
                                                                  :
                                                                  <tr><td colSpan={6}><FormattedMessage id="manage-clinic.not-data" /></td></tr>
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
            allClinic: state.admin.allClinic,
            language: state.app.language,
      };
};

const mapDispatchToProps = dispatch => {
      return {

            fetchAllClinic: (data) => dispatch(actions.fetchAllClinic(data)),

      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RestoreClinic));
