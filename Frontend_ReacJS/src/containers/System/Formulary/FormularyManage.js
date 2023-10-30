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
import { createNewFormularyService, editFormularyService } from "../../../services/medicineService";
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import ModalFormulary from './ModalFormulary';
import { emitter } from "../../../utils/emitter";
import _ from 'lodash';


class FormularyManage extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            arrFormulary: [],
            isOpenModalFormulary: false,
            formularyEdit: [],
        };
    }

    componentDidMount() {
        this.props.fetchAllFormularies();
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.listFormularies !== this.props.listFormularies) {

            // let arrFormulary = this.props.listFormularies;
            // let formularyId = arrFormulary && arrFormulary.length ? arrFormulary[0].id : "ALL";
            // this.props.fetchAllMedicine({ id: "ALL", formulary: formularyId });


            this.setState({
                arrFormulary: this.props.listFormularies,


            });


        }

    }


    handleAddNewFormulary = () => {
        this.setState({
            isOpenModalFormulary: true,
        });
    }

    toggleFormularyModal = () => {
        this.setState({
            isOpenModalFormulary: !this.state.isOpenModalFormulary,

        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
    };

    handleSubmitFormularyParent = async (data) => {

        let actions = data.actions;
        let res = '';
        if (actions === CRUD_ACTIONS.CREATE) {
            res = await createNewFormularyService({
                name: data.name,
                description: data.description,


            })
            if (res && res.errCode === 0) {
                this.props.fetchAllFormularies();
            }
            this.toggleFormularyModal();

        }
        if (actions === CRUD_ACTIONS.EDIT) {
            res = await editFormularyService({
                id: data.medicineIdEdit,
                name: data.name,
                description: data.description,


            });
            if (res && res.errCode === 0) {
                this.props.fetchAllFormularies();

            }
            this.toggleFormularyModal();

        }
    }

    handleEditFormulary = (formulary) => {
        this.setState({
            isOpenModalFormulary: true,
            formularyEdit: formulary,
        });
    }


    handleOnchangeSearch = (event) => {
        console.log('event', event.target.value.toLowerCase());
        let lowerCase = event.target.value;
        let listFormulary = this.state.arrFormulary;

        let data = listFormulary.filter((item) => {
    
            if (lowerCase === '') {
                return;
            } else {
                return item && item.name.toLowerCase().includes(lowerCase) ;

            }
        })

            if (!_.isEmpty(data)) {
            this.setState({
                arrFormulary: data
            })
        } else {
            this.props.fetchAllFormularies();

        }

    }


    render() {

        let { arrFormulary } = this.state;


        return (
            <>
                <div className='formulary-manage-container'>
                    <div className='formulary-manage-title'>
                        <FormattedMessage id="manage-formulary.title" />
                    </div>
                    <div className='formulary-manage-content'>
                        <ModalFormulary
                            isOpen={this.state.isOpenModalFormulary}
                            toggleFromParent={this.toggleFormularyModal}
                            currentFormulary={this.state.formularyEdit}
                            handleSubmitFormularyParent={this.handleSubmitFormularyParent}

                        />
                        <div className='formulary-manage-title-sub'>
                            <FormattedMessage id="manage-formulary.title-sub" />
                        </div>
                        <div className='body-content'>
                            <div className='btn-create-formulary'>
                                <button
                                    className="btn btn-primary p-3"
                                    onClick={() => this.handleAddNewFormulary()}
                                >
                                    <FormattedMessage id="manage-formulary.btn-create-formulary" /><i className="fas fa-plus mx-1"></i>
                                </button>
                            </div>
                            <div className='option-choose-formulary row'>
                                <div className='col-6 '>

                                </div>
                                <div className='col-6 search-formulary '>
                                    <label><FormattedMessage id="manage-formulary.search-formulary" /></label>
                                    <input className='form-control' 
                                    placeholder='search' 
                                    onChange={(event) => this.handleOnchangeSearch(event)}/>
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
                                        {arrFormulary &&
                                            arrFormulary.length > 0 ?
                                            arrFormulary.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.name}</td>
                                                        <td>{item.description}</td>

                                                        <td>
                                                            <div className='btn btn-detail' onClick={() => this.handleDetailFormulary(item)}><i class="fas fa-capsules"></i></div>
                                                            <div className='btn btn-update' onClick={() => this.handleEditFormulary(item)}><i className="fas fa-pencil-alt "></i></div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                            :
                                            <tr><td colSpan={6}><FormattedMessage id="manage-formulary.not-data" /></td></tr>
                                        }



                                    </tbody>
                                </table>
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
        fetchAllFormularies: () => dispatch(actions.fetchAllFormularies()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormularyManage));
