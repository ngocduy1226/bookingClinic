import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './MedicineTable.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment, { relativeTimeThreshold } from 'moment';
import localization from 'moment/locale/vi';
import { createNewMedicineService, editMedicineService, handleDeleteMedicineService } from "../../../../services/medicineService"
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import ModalMedicine from './ModalMedicine';
import { emitter } from "../../../../utils/emitter";
import _ from 'lodash';
import Pagination from '../../../Pagination/Pagination';
import { toast } from 'react-toastify';


class MedicineTable extends Component {


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
        // let arrFormulary = this.props.listFormularies;
        // let formularyId = arrFormulary && arrFormulary.length ? arrFormulary[0].id : "ALL";

        this.props.fetchAllMedicine({ id: "ALL", formulary: "ALL", status: +0});
        this.props.fetchAllFormularies({id: "ALL", status: +0})


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


    handleSubmitMedicineParent = async (data) => {

        let actions = data.actions;
        let res = '';
        if (actions === CRUD_ACTIONS.CREATE) {
            res = await createNewMedicineService({
                name: data.name,
                description: data.description,
                uses: data.uses,
                using: data.using,
                ingredient: data.ingredient,
                producer: data.producer,
                formularyId: data.selectedFormulary.value,

            })
            if (res && res.errCode === 0) {
                this.props.fetchAllMedicine({ id: "ALL", formulary: data.selectedFormulary.value, status : +0 });
            }
            this.toggleMedicineModal();
            this.setState({
                selectedFormulary: {
                    label: data.selectedFormulary.label,
                    value: data.selectedFormulary.value
                },
            })
        }
        if (actions === CRUD_ACTIONS.EDIT) {
            res = await editMedicineService({
                id: data.medicineIdEdit,
                name: data.name,
                description: data.description,
                uses: data.uses,
                using: data.using,
                ingredient: data.ingredient,
                producer: data.producer,
                formularyId: data.selectedFormulary.value,

            });
            if (res && res.errCode === 0) {
                this.props.fetchAllMedicine({ id: "ALL", formulary: data.selectedFormulary.value });

            }
            this.toggleMedicineModal();
            this.setState({
                selectedFormulary: {
                    label: data.selectedFormulary.label,
                    value: data.selectedFormulary.value
                },
            })
        }
    }

    handleChangeSelect = async (selectedFormulary) => {

        this.setState({ selectedFormulary }, async () => {
            await this.props.fetchAllMedicine({ id: "ALL", formulary: selectedFormulary.value , status : +0});
            console.log(`Option selected:`, this.state.selectedFormulary)
        });


    };

    handleEditMedicine = (medicine) => {

        this.setState({
            isOpenModalMedicine: true,
            medicineEdit: medicine,
        });
    }

    handleDeleteMedicine = async (medicineInput) => {
        // if (this.props.history) {
        //     this.props.history.push(`/system/medicine-detail/${medicine.id}`);

        // }
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Bạn có chắc chắn muốn xóa người dùng!")) {
            let medicine = await handleDeleteMedicineService(
                medicineInput.id
            )

            if (medicine && medicine.errCode === 0) {
                toast.success('show hide success');
                await this.props.fetchAllMedicine({ id: "ALL", formulary: "ALL", status: +0});
            } else {
                toast.error('show hide success');
            }

        }
    }


    handleCreateMedicine = (item) => {
        this.props.handleCreateMedicineParent(item);
    }



    handleOnchangeSearch = async (event) => {
        console.log('event', event.target.value.toLowerCase());
        let lowerCase = event.target.value;
        await this.props.fetchAllMedicine({ id: "ALL", formulary: "ALL", status : +0 });
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

            <>
                <ModalMedicine
                    isOpen={this.state.isOpenModalMedicine}
                    toggleFromParent={this.toggleMedicineModal}
                    currentMedicine={this.state.medicineEdit}
                    handleSubmitMedicineParent={this.handleSubmitMedicineParent}
                    arrFormularyParent={this.state.arrFormulary}
                />
                {isShowManageMedicineParent && isShowManageMedicineParent === true &&
                    <div className='btn-create-medicine'>
                        <button
                            className="btn btn-primary p-3"
                            onClick={() => this.handleAddNewMedicine()}
                        >
                            <FormattedMessage id="manage-medicine.btn-create-medicine" /><i className="fas fa-plus mx-1"></i>
                        </button>
                    </div>
                }

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

                                                {isShowManageMedicineParent
                                                    && isShowManageMedicineParent === true ?
                                                    <>
                                                        <div className='btn btn-detail'
                                                            onClick={() => this.handleDeleteMedicine(item)}>
                                                            <i class="fas fa-trash"></i>
                                                        </div>

                                                        <div className='btn btn-update'
                                                            onClick={() => this.handleEditMedicine(item)}>
                                                            <i className="fas fa-pencil-alt "></i>
                                                        </div>
                                                    </>
                                                    :
                                                    <div className='btn btn-create-medicine'
                                                        onClick={() => this.handleCreateMedicine(item)}
                                                    >

                                                        <i className="fas fa-plus mx-1"></i>
                                                    </div>
                                                }


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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicineTable));
