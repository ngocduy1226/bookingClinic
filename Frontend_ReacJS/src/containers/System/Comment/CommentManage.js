import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './CommentManage.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { handleShowHideCommentService } from "../../../services/commentService"
import { FormattedMessage } from 'react-intl';
import Pagination from '../../Pagination/Pagination';
import _ from 'lodash';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from "../../../components/Input/DatePicker";


class CommentManage extends Component {

    constructor(prop) {
        super(prop);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            listComment: [],
            currentPage: 1,
            recordPerPage: 5,
            records: [],
            nPages: 1,
            numbers: [],

            isShowComment: false,
            selectedDoctor: {},
            listDoctors: [],
        };
    }

    async componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        await this.handleGetComment();
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }


        if (prevProps.comments !== this.props.comments) {
            this.setState({
                listComment: this.props.comments,
            },
                () => {
                    this.getRecord(this.state.currentPage);
                }
            )


        }

        if (prevProps.allDoctors !== this.props.allDoctors) {

            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }
    }


    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {

            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === language.EN ? labelEn : labelVi;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    getRecord = (currentPage) => {
        let listComment = this.state.listComment;
        let { recordPerPage } = this.state;

        let lastIndex = currentPage * recordPerPage;
        let firstIndex = lastIndex - recordPerPage;
        let records = listComment.slice(firstIndex, lastIndex);
        let nPages = Math.ceil(listComment.length / recordPerPage);
        let numbers = [...Array(nPages + 1).keys()].slice(1);
        this.setState({
            records: records,
            nPages: nPages,
            numbers: numbers,
        })
    }

    handleShowHideComment = async (commentInput) => {
        let comment = await handleShowHideCommentService({
            commentId: commentInput.id,
            status: commentInput.statusId,
        })

        if (comment && comment.errCode === 0) {
            toast.success('show hide success');
            await this.handleGetComment();
        } else {
            toast.error('show hide success');
        }

    }

    handleGetComment = async () => {
        let { currentDate, selectedDoctor } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        let {user} = this.props;
        let id = selectedDoctor.value ? selectedDoctor.value : 'ALL';
   
        if(user.roleId === 'R2') {
            id = user.id
        }
        this.props.fetchAllCommentService({
            doctorId: id,
            currentDate: formatedDate,
        })
    }

    handleChangeSelect = async (selectedDoctor) => {

        this.setState({ selectedDoctor }, async () => {
            await this.handleGetComment();
            console.log(`Option selected:`, this.state.selectedDoctor)
        });


    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        }, async () => {
            await this.handleGetComment();
        })
    }


    render() {

        let { user } = this.props;
        let { records, nPages, currentPage, numbers } = this.state;
        console.log('check state', this.state);
        return (
            <>


                <div className="manage-comment-container container">
                    <div className='manage-comment-title'>
                        <FormattedMessage id="manage-comment.title" /></div>
                    <div className='manage-comment-content'>
                        <div className='manage-comment-title-sub'> <FormattedMessage id="manage-comment.list-comment" /></div>
                        <div className='manage-comment-body'>

                            <div className='option-choose-comment row'>
                                <div className='col-6  search-date'>
                                    <label><FormattedMessage id="manage-patient.choose-date" /></label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className="form-control"
                                        value={this.state.currentDate}

                                    />
                                </div>
                                {user && user.roleId === 'R1' && 
                                 <div className='col-6 search-comment '>
                                    <label><FormattedMessage id="manage-patient.choose-doctor" /></label>
                                    <Select
                                        value={this.state.selectedDoctor}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.listDoctors}
                                        placeholder={<FormattedMessage id="manage-doctor.choose-doctor" />}
                                    />
                                </div>
                                }
                               

                            </div>

                            <div className='table-comment'>

                                <table class="table table-hover table-striped table-bordered">
                                    <thead className="thead-dark " >
                                        <tr className="table-dark">
                                            <th scope="col">#</th>
                                            <th scope="col"><FormattedMessage id="manage-comment.name-user" /></th>

                                            <th scope="col"><FormattedMessage id="manage-comment.email-user" /></th>
                                            <th scope="col"><FormattedMessage id="manage-comment.name-doctor" /></th>
                                            <th scope="col"><FormattedMessage id="manage-comment.content" /></th>
                                            <th scope="col"><FormattedMessage id="manage-comment.time" /></th>
                                            <th scope="col"><FormattedMessage id="manage-comment.action" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records &&
                                            records.length > 0 ?
                                            records.map((item, index) => {
                                                let patient = item.userCommentData;
                                                let doctor = item.infoDoctorData.User
                                                let nameDoctor = `${doctor.lastName} ${doctor.firstName}`
                                                let namePatient = patient.lastName && patient.firstName
                                                    ? `${patient.lastName} ${patient.firstName}`
                                                    : `Người dùng`
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{namePatient}</td>

                                                        <td><div className='text-description'>{patient.email}</div></td>
                                                        <td><div className='text-description'>{nameDoctor}</div></td>
                                                        <td><div className='text-description'>{item.content}</div></td>
                                                        <td><div className='text-description'>{item.different}</div></td>
                                                        <td>
                                                            <div className='' onClick={() => this.handleShowHideComment(item)}>
                                                                <i className={item.statusId === 'S1' ? "far fa-eye-slash " : "fas fa-eye"}></i>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            })
                                            :
                                            <tr><td colSpan={7}><FormattedMessage id="manage-comment.not-data" /></td></tr>
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
        comments: state.admin.comments,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        fetchAllCommentService: (data) => { dispatch(actions.fetchAllCommentService(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CommentManage));
