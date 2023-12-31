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
import { createNewClinicService, editClinicService } from "../../../services/userService";
import { handleDeleteClinicService } from "../../../services/clinicService";
import { toast } from 'react-toastify';
import ModalClinic from './ModalClinic';
import _ from 'lodash';
import Pagination from '../../Pagination/Pagination';



const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {


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
        this.props.fetchAllClinic(+0);
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


    onChangeInput(event, id) {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }

    handleOnChangeImage = async (event, id) => {
        let file = event.target.files[0];
        if (id === 'avatar') {
            if (file) {
                let base64 = await CommonUtils.getBase64(file);
                // let objectUrl = URL.createObjectURL(file);

                this.setState({
                    //    preImageBase64: objectUrl,

                    imageBase64: base64,
                })
            }
        }

        if (id === 'imageSub') {
            if (file) {
                let base64 = await CommonUtils.getBase64(file);
                // let objectUrl = URL.createObjectURL(file);

                this.setState({
                    //    preImageBase64: objectUrl,

                    imageBase64Sub: base64,
                })
            }
        }




    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handleSaveClinic = async () => {
        let res = await createNewClinicService(this.state);
        if (res && res.errCode === 0) {
            toast.success('Create new clinic success');
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                descriptionMarkdown: '',
                descriptionHTML: '',
            })

        } else {
            toast.warning('Create new clinic failed');
            console.log('check res', res);

        }

    }


    handleCreateClinic = () => {
        this.setState({
            isOpenModalClinic: true,
        });
    }

    handleEditClinic = (clinic) => {
        this.setState({
            isOpenModalClinic: true,
            clinicEdit: clinic,
        });
    }

    toggleClinicModal = () => {
        this.setState({
            isOpenModalClinic: !this.state.isOpenModalClinic,

        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
    };

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
        await this.props.fetchAllClinic(+0);
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


    handleSubmitClinicParent = async (data) => {

        let actions = data.actions;
        let res = '';
        if (actions === CRUD_ACTIONS.CREATE) {
            res = await createNewClinicService({
                name: data.name,
                address: data.address,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                imageBase64: data.imageBase64,
                imageBase64Sub: data.imageBase64Sub,

            })
            if (res && res.errCode === 0) {
                toast.success('Create new specialty success');
                this.props.fetchAllClinic(+0);

            } else {
                toast.warning('Create new specialty failed');
                console.log('check res', res);

            }
            this.toggleClinicModal();

        }
        if (actions === CRUD_ACTIONS.EDIT) {
            res = await editClinicService({
                id: data.clinicIdEdit,
                name: data.name,
                address: data.address,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                imageBase64: data.imageBase64,
                imageBase64Sub: data.imageBase64Sub,


            });
            if (res && res.errCode === 0) {
                toast.success('Edit new specialty success');
                this.props.fetchAllClinic(+0);

            }
            this.toggleClinicModal();

        }
    }

    handleDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/system/manage-detail-clinic/${clinic.id}`);

        }
    }
    handleDeleteClinic = async (clinicInput) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Bạn có chắc chắn muốn xóa cơ sở y tế!")) {

            let clinic = await handleDeleteClinicService(
                clinicInput.id
            )

            if (clinic && clinic.errCode === 0) {
                toast.success('delete clinic success');
                await this.props.fetchAllClinic(+0);

            } else {
                toast.error('delete clinic failed');
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
                        <div className='manage-clinic-title-sub'> <FormattedMessage id="manage-clinic.list-clinic" /></div>
                        <div className='manage-clinic-body'>
                            <div className='btn-create-clinic btn btn-primary' onClick={() => this.handleCreateClinic()}>
                                <FormattedMessage id="manage-clinic.btn-create" />
                                <i className="fas fa-plus mx-1"></i>
                            </div>

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
                                                            <div className='btn btn-detail' onClick={() => this.handleDetailClinic(item)}><i class="fas fa-capsules"></i></div>
                                                            <div className='btn btn-update' onClick={() => this.handleEditClinic(item)}><i className="fas fa-pencil-alt "></i></div>
                                                            <div className='btn btn-delete' onClick={() => this.handleDeleteClinic(item)}><i className="fas fa-trash"></i></div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageClinic));
