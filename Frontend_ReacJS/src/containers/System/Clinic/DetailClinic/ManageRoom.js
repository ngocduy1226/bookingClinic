import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ManageRoom.scss'
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { emitter } from "../../../../utils/emitter";
import { createNewRoomService, editRoomService } from "../../../../services/clinicService";
import { toast } from 'react-toastify';
import _ from 'lodash';
import Pagination from '../../../Pagination/Pagination';
import ModalRoom from './ModalRoom';
import Select from 'react-select';
import ScheduleRoom from './ScheduleRoom';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageRoom extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            listClinic: [],
            idRoomClinic: '',
            isOpenModalRoom: false,
            selectedClinic: {},
            roomEdit: {},


            listRoom: [],
            name: '',
            description: '',
            currentPage: 1,
            recordPerPage: 5,
            records: [],
            nPages: 1,
            numbers: []

        };
    }

    componentDidMount() {
        this.props.fetchAllClinic();

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            this.setState({
                idRoomClinic: id,

            })

            this.props.fetchAllRoom({ id: "ALL", clinic: id });

        }

        this.getRecord(this.state.currentPage);
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.allClinic !== this.props.allClinic) {
            let dataSelect = this.buildDataInputSelect(this.props.allClinic)
            this.setState({
                listClinic: dataSelect,

            });
        }


        if (prevProps.allRooms !== this.props.allRooms) {
            this.setState({
                listRoom: this.props.allRooms,
            }, () => {
                this.getRecord(this.state.currentPage);
            })


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
                let { idRoomClinic } = this.state

                if (+idRoomClinic === item.id) {

                    result.push(object);
                    this.setState({
                        selectedClinic: {
                            label: item.name,
                            value: item.id
                        },
                    })

                }

            })
        }
        return result;
    }

    onChangeInput(event, id) {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }


    handleEditRoom = (room) => {
        this.setState({
            isOpenModalRoom: true,
            roomEdit: room,
        });
    }

    toggleRoomModal = () => {
        this.setState({
            isOpenModalRoom: !this.state.isOpenModalRoom,

        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
    };

    getRecord = (currentPage) => {
        let arrRooms = this.state.listRoom;
        let { recordPerPage } = this.state;

        let lastIndex = currentPage * recordPerPage;
        let firstIndex = lastIndex - recordPerPage;
        let records = arrRooms.slice(firstIndex, lastIndex);
        let nPages = Math.ceil(arrRooms.length / recordPerPage);
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
        await this.props.fetchAllRoom({ id: "ALL", clinic: this.state.idRoomClinic });
        let listRoom = this.state.listRoom;

        let data = listRoom.filter((item) => {

            if (lowerCase === '') {
                return;
            } else {
                return item && item.name.toLowerCase().includes(lowerCase);

            }
        })

        if (!_.isEmpty(data)) {
            this.setState({
                listRoom: data
            }, () => {
                this.getRecord(this.state.currentPage);
            })
        }

    }




    handleSubmitRoomParent = async (data) => {

        let actions = data.actions;
        let res = '';
        if (actions === CRUD_ACTIONS.CREATE) {
            res = await createNewRoomService({
                name: data.name,
                description: data.description,
                clinicId: this.state.selectedClinic.value


            })
            if (res && res.errCode === 0) {
                toast.success('Create new specialty success');

                this.props.fetchAllRoom({ id: "ALL", clinic: this.state.selectedClinic.value });

            } else {
                toast.warning('Create new specialty failed');
                console.log('check res', res);

            }
            this.toggleRoomModal();


        }
        if (actions === CRUD_ACTIONS.EDIT) {
            res = await editRoomService({
                id: data.roomIdEdit,
                name: data.name,
                description: data.description,
                clinicId: this.state.selectedClinic.value


            });
            if (res && res.errCode === 0) {
                toast.success('Edit new specialty success');
                this.props.fetchAllRoom({ id: "ALL", clinic: this.state.selectedClinic.value });

            }
            this.toggleRoomModal();


        }
    }



    render() {
        let { listClinic, idRoomClinic } = this.state;

        let { records, nPages, currentPage, numbers } = this.state;
        console.log('stats', this.state)
        return (
            <>
                <ModalRoom
                    isOpen={this.state.isOpenModalRoom}
                    toggleFromParent={this.toggleRoomModal}
                    currentClinic={this.state.roomEdit}
                    handleSubmitRoomParent={this.handleSubmitRoomParent}
                    arrClinicParent={this.state.listClinic}
                />

                <div className="manage-room-container container">
                    <div className='manage-room-title'>
                        <FormattedMessage id="manage-clinic.title" /></div>
                    <div className='manage-room-content'>
                        <div className='manage-room-title-sub'> <FormattedMessage id="manage-clinic.detail-clinic" /></div>
                        <div className='manage-room-body'>

                            <ScheduleRoom
                                clinicId={idRoomClinic}
                            />

                            <div className='btn-create-room btn btn-primary' onClick={() => this.handleEditRoom()}>
                                <FormattedMessage id="manage-room.btn-create" />
                                <i className="fas fa-plus mx-1"></i>
                            </div>

                            <div className='option-choose-room row'>

                                <div className='col-6 search-room '>
                                    <label><FormattedMessage id="manage-room.search-room" /></label>
                                    <input className='form-control'
                                        placeholder='search'
                                        onChange={(event) => this.handleOnchangeSearch(event)} />
                                </div>
                                <div className='col-6 '>

                                    <label><FormattedMessage id="manage-clinic.choose-clinic" /></label>
                                    <Select
                                        //  isOptionDisabled={(option) => option.disabled}
                                        value={this.state.selectedClinic}

                                        options={listClinic}
                                        placeholder={<FormattedMessage id="manage-medicine.choose-formulary" />}
                                    />
                                </div>
                            </div>

                            <div className='table-room'>

                                <table class="table table-hover table-striped table-bordered">
                                    <thead className="thead-dark " >
                                        <tr className="table-dark">
                                            <th scope="col">#</th>
                                            <th scope="col"><FormattedMessage id="manage-room.name" /></th>

                                            <th scope="col"><FormattedMessage id="manage-room.description" /></th>

                                            <th scope="col"><FormattedMessage id="manage-room.action" /></th>
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

                                                        <td><div className='text-description'>{item.description}</div></td>
                                                        <td>
                                                            {/* <div className='btn btn-detail' onClick={() => this.handleDetailFormulary(item)}><i class="fas fa-capsules"></i></div> */}
                                                            <div className='btn btn-update' onClick={() => this.handleEditRoom(item)}><i className="fas fa-pencil-alt "></i></div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                            :
                                            <tr><td colSpan={6}><FormattedMessage id="manage-room.not-data" /></td></tr>
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
        allRooms: state.admin.allRooms,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllRoom: (data) => dispatch(actions.fetchAllRoom(data)),
        fetchAllClinic: () => dispatch(actions.fetchAllClinic()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageRoom));
