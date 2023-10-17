import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './MedicineManage.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
//import { getMedicineManageByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import ModalMedicine from './ModalMedicine';
import { emitter } from "../../../../utils/emitter";

class MedicineManage extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            isOpenModalMedicine: false,
        };
    }

    componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        // if (prevProps.doctorIdParent !== this.props.doctorIdParent) {
        //     let allDays = this.getDaySchedule(this.props.language);
        //     let res = await getBookingModalByDateService(this.props.doctorIdParent, allDays[0].value);
        //     this.setState({
        //         allTimes: res.data ? res.data : [],

        //     })
        // }

    }


    handleAddNewMedicine = () => {
        this.setState({
          isOpenModalMedicine: true,
        });
      };

      toggleMedicineModal = () => {
        this.setState({
            isOpenModalMedicine: !this.state.isOpenModalMedicine,
          
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      };


      handleSubmitMedicineParent  = (data) => {
        console.log('data', data)
    
        let actions = data.actions;
        return ;
        if (actions === CRUD_ACTIONS.CREATE) {
              
            //fire redux action
            this.props.createNewMedicine({
                name : data.name,
                description : data.description,
                uses : data.uses,
                using : data.using,
                ingredient : data.ingredient,
                producer : data.producer,
                formularyId : data.formularyId,
             
            })
            this.toggleMedicineModal();
      
          }
          if (actions === CRUD_ACTIONS.EDIT) {
            //fire redux action edit
            this.props.editMedicineRedux({
              id: data.medicineIdEdit,
              name : data.name,
              description : data.description,
              uses : data.uses,
              using : data.using,
              ingredient : data.ingredient,
              producer : data.producer,
              formularyId : data.formularyId,
             
            });
            this.toggleMedicineModal();
          }
      }

medicineEdit = () => {

}

    render() {





        return (
            <div className='medicine-manage-container'>
                <div className='medicine-manage-title'>
                    Quan ly thuoc
                </div>
                <div className='medicine-manage-content'>
                <ModalMedicine
            isOpen={this.state.isOpenModalMedicine}
            toggleFromParent={this.toggleMedicineModal}
            currentMedicine={this.state.medicineEdit}
            handleSubmitMedicineParent={this.handleSubmitMedicineParent}
          />
                    <div className='medicine-manage-title-sub'>
                        Danh sach thuoc
                    </div>
                    <div className='body-content'>
                        <div className='btn-create-medicine'>
                            <button
                                className="btn btn-primary p-3"
                              onClick={() => this.handleAddNewMedicine()}
                            >
                                <FormattedMessage id="manage-doctor.btn-create-medicine" /><i className="fas fa-plus mx-1"></i>
                            </button>
                        </div>
                        <div className='option-choose-medicine row'>
                            <div className='col-6 search-medicine '>
                                <label>Tim kiem</label>
                                <input className='form-control' placeholder='tim kiem' />
                            </div>

                            <div className='col-6 choose-formulary'>

                                <label><FormattedMessage id="manage-medicine.choose-formulary" /></label>
                                <Select


                                    // value={this.state.selectedOption}
                                    // onChange={this.handleChangeSelect}
                                    // options={this.state.listDoctors}
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

                                        <th scope="col"><FormattedMessage id="manage-patient.ingredient" /></th>
                                        <th scope="col"><FormattedMessage id="manage-patient.producer" /></th>

                                        <th scope="col"><FormattedMessage id="manage-patient.action" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Tene thuoc</td>
                                        <td>Mo ta</td>
                                        <td>ban thanh phan thuoc</td>
                                        <td>nha san xuat</td>
                                        <td>
                                            <div className='btn btn-detail'>xem</div>
                                            <div className='btn btn-update'><i className="fas fa-pencil-alt "></i></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Tene thuoc</td>
                                        <td>Mo ta</td>
                                        <td>ban thanh phan thuoc</td>
                                        <td>nha san xuat</td>
                                        <td><div className='btn btn-detail'>xem</div></td>
                                    </tr>

                                    <tr>
                                        <td>1</td>
                                        <td>Tene thuoc</td>
                                        <td>Mo ta</td>
                                        <td>ban thanh phan thuoc</td>
                                        <td>nha san xuat</td>
                                        <td><div className='btn btn-detail'>xem</div></td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Tene thuoc</td>
                                        <td>Mo ta</td>
                                        <td>ban thanh phan thuoc</td>
                                        <td>nha san xuat</td>
                                        <td><div className='btn btn-detail'>xem</div></td>
                                    </tr>
                                    {/* {dataPatient && dataPatient.length > 0 ?
                                        dataPatient.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    {language === LANGUAGES.VI ?
                                                        <>
                                                            <td>{item.timeTypePatient.valueVi}</td>
                                                            <td>{item.userData.lastName + " " + item.userData.firstName}</td>
                                                            <td>{item.userData.genderData.valueVi}</td>
                                                        </>
                                                        :
                                                        <>
                                                            <td>{item.timeTypePatient.valueEn}</td>
                                                            <td>{item.userData.firstName + " " + item.userData.lastName}</td>
                                                            <td>{item.userData.genderData.valueEn}</td>
                                                        </>
                                                    }

                                                    <td>{item.userData.address}</td>
                                                    <td>{item.reason}</td>
                                                    <td>


                                                        <button className='btn btn-warning mx-1 btn-print'
                                                            onClick={() => this.confirmSend(item)}
                                                        > <FormattedMessage id="manage-patient.confirm" /></button>
                                                    </td>
                                                </tr>
                                            );
                                        })

                                        :
                                        <tr className='text-center'>
                                            <td Colspan='7'>   <FormattedMessage id="manage-patient.empty-data" /> </td>


                                        </tr>
                                    } */}


                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {


    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicineManage));
