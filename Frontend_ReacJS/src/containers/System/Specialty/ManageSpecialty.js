import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ManageSpecialty.scss'
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import { FormattedMessage } from 'react-intl';

import 'react-markdown-editor-lite/lib/index.css';
import './ManageSpecialty.scss'
import { createNewSpecialtyService, editSpecialtyService } from "../../../services/userService";
import { toast } from 'react-toastify';
import { emitter } from "../../../utils/emitter";
import ModalSpecialty from './ModalSpecialty';
import _ from 'lodash';
import Pagination from '../../Pagination/Pagination';
import ReactLoading from "react-loading";


class ManageSpecialty extends Component {


    constructor(prop) {
        super(prop);
        this.state = {

            specialtyEdit: {},
            listSpecialty: [],
            isOpenModalSpecialty: false,

            
            isLoading: true,
            currentPage: 1,
            recordPerPage: 5,
            records: [],
            nPages: 1,
            numbers: [],
        };
    }

    componentDidMount() {
        this.props.fetchAllSpecialty();
        this.getRecord(this.state.currentPage);
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }
        if (prevProps.allSpecialty !== this.props.allSpecialty) {
            this.setState({
                listSpecialty: this.props.allSpecialty,
                isLoading: false,
            }, ()=> {
                this.getRecord(this.state.currentPage); 
            })
        }


    }




    handleSubmitSpecialtyParent = async (data) => {

        let actions = data.actions;
        let res = '';
        if (actions === CRUD_ACTIONS.CREATE) {
            res = await createNewSpecialtyService({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                imageBase64: data.imageBase64

            })
            if (res && res.errCode === 0) {
                toast.success('Create new specialty success');
                this.props.fetchAllSpecialty();

            } else {
                toast.warning('Create new specialty failed');
                console.log('check res', res);

            }
            this.toggleSpecialtyModal();

        }
        if (actions === CRUD_ACTIONS.EDIT) {
            res = await editSpecialtyService({
                id: data.specialtyIdEdit,
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                imageBase64: data.imageBase64


            });
            if (res && res.errCode === 0) {
                toast.success('Edit new specialty success');
                this.props.fetchAllSpecialty();

            }
            this.toggleSpecialtyModal();

        }
    }

    handleCreateSpecialty = () => {
        this.setState({
            isOpenModalSpecialty: true,
        });
    }

    toggleSpecialtyModal = () => {
        this.setState({
            isOpenModalSpecialty: !this.state.isOpenModalSpecialty,

        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
    };

    handleEditSpecialty = (specialty) => {
        this.setState({
            isOpenModalSpecialty: true,
            specialtyEdit: specialty,
        })
    }

    
    handleOnchangeSearch = async (event) => {
        console.log('event', event.target.value.toLowerCase());
        await this.props.fetchAllSpecialty();
        let lowerCase = event.target.value;
        let listSpecialty = this.state.listSpecialty;

        let data = listSpecialty.filter((item) => {
    
            if (lowerCase === '') {
                return;
            } else {
                return item && item.name.toLowerCase().includes(lowerCase) ;

            }
        })

            if (!_.isEmpty(data)) {
            this.setState({
                listSpecialty: data
            }, ()=> {
                this.getRecord(this.state.currentPage); 
             })
        }
    }

    getRecord = (currentPage) => {
        let arrSpecialty = this.state.listSpecialty;
        let { recordPerPage } = this.state;

        let lastIndex = currentPage * recordPerPage;
        let firstIndex = lastIndex - recordPerPage;
        let records = arrSpecialty.slice(firstIndex, lastIndex);
        let nPages = Math.ceil(arrSpecialty.length / recordPerPage);
        let numbers = [...Array(nPages + 1).keys()].slice(1);
        this.setState({
            records: records,
            nPages: nPages,
            numbers: numbers,
        })
      
    }

    render() {

        let { listSpecialty } = this.state;
        // console.log('state cha', this.state);
        let { records, nPages, currentPage, numbers } = this.state;

        return (
            <>
                <ModalSpecialty
                    isOpen={this.state.isOpenModalSpecialty}
                    toggleFromParent={this.toggleSpecialtyModal}
                    currentSpecialty={this.state.specialtyEdit}
                    handleSubmitSpecialtyParent={this.handleSubmitSpecialtyParent}

                />
                <div className="manage-specialty-container container">
                    <div className='manage-specialty-title'>
                        <FormattedMessage id="manage-specialty.title" /></div>
                    <div className='manage-specialty-content'>
                        <div className='manage-specialty-title-sub'> <FormattedMessage id="manage-specialty.list-specialty" /></div>
                        <div className='manage-specialty-body'>
                            <div className='btn-create-specialty btn btn-primary' onClick={() => this.handleCreateSpecialty()}>
                            <FormattedMessage id="manage-specialty.btn-create" />
                                <i className="fas fa-plus mx-1"></i>
                            </div>

                            <div className='option-choose-specialty row'>
                                <div className='col-6 '>

                                </div>
                                <div className='col-6 search-specialty '>
                                    <label><FormattedMessage id="manage-specialty.search-specialty" /></label>
                                    <input className='form-control' 
                                    placeholder='search' 
                                    onChange={(event) => this.handleOnchangeSearch(event)}/>
                                </div>

                            </div>

                            <div className='table-specialty'>

                                <table class="table table-hover table-striped table-bordered">
                                    <thead className="thead-dark " >
                                        <tr className="table-dark">
                                            <th scope="col">#</th>
                                            <th scope="col"><FormattedMessage id="manage-specialty.name" /></th>
                                            <th scope="col"><FormattedMessage id="manage-specialty.avatar" /></th>
                                            <th scope="col"><FormattedMessage id="manage-specialty.description" /></th>


                                            <th scope="col"><FormattedMessage id="manage-specialty.action" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records &&
                                            records.length > 0 ?
                                            records.map((item, index) => {
                                                item.image = item.image ? item.image : `https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg`
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.name}</td>
                                                        <td>
                                                            <div className='image-specialty' style={{ backgroundImage: `url(${item.image})` }}></div>
                                                        </td>
                                                        <td><div className='text-description'>{item.descriptionHTML}</div></td>
                                                        <td>
                                                            <div className='btn btn-detail' onClick={() => this.handleDetailFormulary(item)}><i class="fas fa-capsules"></i></div>
                                                            <div className='btn btn-update' onClick={() => this.handleEditSpecialty(item)}><i className="fas fa-pencil-alt "></i></div>
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


                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        allSpecialty: state.admin.allSpecialty,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialty: () => dispatch(actions.fetchAllSpecialty()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty));
