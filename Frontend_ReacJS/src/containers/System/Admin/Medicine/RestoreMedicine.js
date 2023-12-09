import React, { Component  ,  useEffect,
      useState} from 'react';
  import { Redirect } from 'react-router-dom';
  import { connect } from 'react-redux';
  import './MedicineManage.scss'
  import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
  import * as actions from "../../../../store/actions";
  import { get } from 'lodash';
  import { withRouter } from "react-router";
  import moment, { relativeTimeThreshold } from 'moment';
  import localization from 'moment/locale/vi';
  import {  restoreMedicineService , handleDeleteMedicineService} from "../../../../services/medicineService"
  import { FormattedMessage } from 'react-intl';
  import Select from 'react-select';
  import { emitter } from "../../../../utils/emitter";
import _ from 'lodash';
import Pagination from '../../../Pagination/Pagination';
import { toast } from 'react-toastify';

  
  class RestoreMedicine extends Component {
  
  
      constructor(prop) {
          super(prop);
          this.state = {
            isOpenModalMedicine: false,
            selectedFormulary: {},
            arrMedicine: [],
            medicineEdit: [],
            arrFormulary: [],

            currentPage: 1,
            recordPerPage: 5,
            records: [],
            nPages: 1,
            numbers: [],


            medicineDelete: {},
        
          };
      }
  
      componentDidMount() {
      
            this.props.fetchAllMedicine({ id: "ALL", formulary: "ALL", status: +1});
            this.props.fetchAllFormularies({id: 'ALL', status: +0})
      }
  
      async componentDidUpdate(prevProps, prevState, snapchot) {
          if (prevProps.language !== this.props.language) {
  
          }
  
          if (prevProps.listMedicines !== this.props.listMedicines) {
            this.setState({
                arrMedicine: this.props.listMedicines,
            }, () => {
                this.getRecord(this.state.currentPage);
            });
        }
        if (prevProps.listFormularies !== this.props.listFormularies) {

            // let arrFormulary = this.props.listFormularies;
            // let formularyId = arrFormulary && arrFormulary.length ? arrFormulary[0].id : "ALL";
            // this.props.fetchAllMedicine({ id: "ALL", formulary: formularyId });

            let dataSelect = this.buildDataInputSelect(this.props.listFormularies)
            this.setState({
                arrFormulary: dataSelect,
            });


        }
          
      }


      buildDataInputSelect = (inputData) => {
            let result = [];
            let { language } = this.props;
            if (inputData && inputData.length > 0) {
    
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.name}`;
                    // let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === language.VI ? labelVi : labelVi;
                    object.value = item.id;
                    result.push(object);
                })
            }
            return result;
        }
    
      
    
    
    
        handleChangeSelect = async (selectedFormulary) => {
    
            this.setState({ selectedFormulary }, async () => {
                await this.props.fetchAllMedicine({ id: "ALL", formulary: selectedFormulary.value , status : +1});
                console.log(`Option selected:`, this.state.selectedFormulary)
            });
    
    
        };

        handleRestoreMedicine = async (medicineInput) => {
      
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Bạn có chắc chắn muốn khôi phục thuốc!")) {
                let medicine = await restoreMedicineService(
                    medicineInput.id
                )
    
                if (medicine && medicine.errCode === 0) {
                    toast.success('restore medicine success');
                    await this.props.fetchAllMedicine({ id: "ALL", formulary: "ALL", status: +1});
                } else {
                    toast.error('restore medicine failed');
                }
    
            }
        }
    

    
        handleOnchangeSearch = async (event) => {
            console.log('event', event.target.value.toLowerCase());
            let lowerCase = event.target.value;
            await this.props.fetchAllMedicine({ id: "ALL", formulary: "ALL", status : +1 });
            let listMedicine = this.state.arrMedicine;
    
            // console.log('list user', listMedicine);
            let data = listMedicine.filter((item) => {
                if (lowerCase === '') {
                    return;
                } else {
                    return item && item.name.toLowerCase().includes(lowerCase);
    
                }
            })
    
            if (!_.isEmpty(data)) {
                this.setState({
                    arrMedicine: data
                }, () => {
                    this.getRecord(this.state.currentPage);
                })
            }
        }
    
        getRecord = (currentPage) => {
            let arrMedicine = this.state.arrMedicine;
            let { recordPerPage } = this.state;
    
            let lastIndex = currentPage * recordPerPage;
            let firstIndex = lastIndex - recordPerPage;
            let records = arrMedicine.slice(firstIndex, lastIndex);
            let nPages = Math.ceil(arrMedicine.length / recordPerPage);
            let numbers = [...Array(nPages + 1).keys()].slice(1);
            this.setState({
                records: records,
                nPages: nPages,
                numbers: numbers,
            })
        }
    
  
      render() {
         
            let { arrMedicine, arrFormulary } = this.state;
            let { isShowManageMedicineParent } = this.props;
            let { records, nPages, currentPage, numbers } = this.state;

          return (
              <div className='medicine-manage-container'>
                  <div className='medicine-manage-title'>
                      <FormattedMessage id="manage-medicine.title" />
                  </div>
                  
                  <div className='medicine-manage-content'>
                  <div className='medicine-manage-title-sub'>
                      <FormattedMessage id="manage-medicine.restore-medicine" />
                      </div>
                      <div className='body-content'>
                        
            <>

                <div className='option-choose-medicine row'>
                    <div className='col-6 search-medicine '>
                        <label><FormattedMessage id="manage-medicine.search-medicine" /></label>
                        <input className='form-control'
                            placeholder='search'
                            onChange={(event) => this.handleOnchangeSearch(event)}
                        />
                    </div>

                    <div className='col-6 choose-formulary'>

                        <label><FormattedMessage id="manage-medicine.choose-formulary" /></label>
                        <Select

                            value={this.state.selectedFormulary}
                            onChange={this.handleChangeSelect}
                            options={arrFormulary}
                            placeholder={<FormattedMessage id="manage-medicine.choose-formulary" />}
                        />
                    </div>
                </div>
                <div className='table-manage-medicine'>


                    <table class="table table-hover table-striped table-bordered">
                        <thead className="thead-dark " >
                            <tr className="table-dark">
                                <th scope="col">#</th>
                                <th scope="col"><FormattedMessage id="manage-medicine.name" /></th>
                                <th scope="col"><FormattedMessage id="manage-medicine.description" /></th>

                                <th scope="col"><FormattedMessage id="manage-medicine.ingredient" /></th>
                                <th scope="col"><FormattedMessage id="manage-medicine.producer" /></th>

                                <th scope="col"><FormattedMessage id="manage-medicine.action" /></th>
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
                                            <td>{item.ingredient}</td>
                                            <td>{item.producer}</td>
                                            <td className='action-medicine'>
                                                    <>
                                                        <div className='btn btn-detail'
                                                            onClick={() => this.handleRestoreMedicine(item)}>
                                                            <i class="fas fa-window-restore"></i>
                                                        </div>

                                                       
                                                    </>
                                                   
                                              


                                            </td>
                                        </tr>
                                    );
                                })
                                :
                                <tr><td colSpan={6}><FormattedMessage id="manage-medicine.not-data" /></td></tr>
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
            </>

                      </div>
                      
                  </div>
  
              </div>
          );
      }
  
  }
  
  const mapStateToProps = state => {
      return {
            listMedicines: state.admin.medicines,
            language: state.app.language,
            listFormularies: state.admin.formularies,
      };
  };
  
  const mapDispatchToProps = dispatch => {
      return {
     fetchAllMedicine: (data) => dispatch(actions.fetchAllMedicines(data)),
        fetchAllFormularies: (data) => dispatch(actions.fetchAllFormularies(data)),
      };
  };
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RestoreMedicine));
  