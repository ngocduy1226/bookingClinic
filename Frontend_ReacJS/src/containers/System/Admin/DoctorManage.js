import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./DoctorManage.scss";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as ReactDOM from 'react-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

import Select from 'react-select';


import { detailDoctorService } from "../../../services/userService"

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);



class DoctorManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
            doctor: {},
            hasOldData: false,
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        this.props.fetchInfoDoctorMarkdown(this.state.selectedOption.value);

    }

    /** Life cycle
     * Run component
     *1. init state
     *2. mount(set state) /unmount
     *3. render
     */

    componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {

            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }

    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        })
    }

    handleSaveDoctorContent() {
        let { hasOldData } = this.state;

        this.props.saveInfoDoctorRedux({
            contentHTML: this.state.contentHTML,
            doctorId: this.state.selectedOption.value,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE

        })
        this.setState({
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
        })
    }

    handleChangeSelect = async (selectedOption) => {

        this.setState({ selectedOption }, () =>
            console.log(`Option selected:`, this.state.selectedOption)

        );

        let res = await detailDoctorService(selectedOption.value);
        console.log('check res doctor', res);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true,
            })
        } else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                hasOldData: false,

            })
        }


    };

    handleOnchangeDesc = (event) => {
        this.setState({
            description: event.target.value
        })
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

    render() {
        let { hasOldData } = this.state;
        return (

            <React.Fragment>
                <div className="manage-doctor-container container">
                    <div className="manage-doctor-title">
                        <FormattedMessage id="manage-doctor.title" />
                    </div>
                    <div className="doctor-content">
                        <div className="content-left">
                            <label>
                                <FormattedMessage id="manage-doctor.choose-doctor" />
                            </label>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className="content-right">
                            <label>

                                <FormattedMessage id="manage-doctor.intro-doctor" />

                            </label>
                            <textarea className="form-control" id="w3review" name="w3review" rows="4" cols="10"
                                onChange={(event) => this.handleOnchangeDesc(event)}
                                value={this.state.description}
                            >

                            </textarea>

                        </div>

                    </div>
                    <div className="manage-doctor-editor">
                        <MdEditor style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkdown}
                        />

                    </div>
                    <button className={hasOldData === true ? "save-content-doctor btn btn-warning" : "create-content-doctor btn btn-primary"}
                        onClick={() => { this.handleSaveDoctorContent() }}
                    >
                        {hasOldData === true ?
                            <FormattedMessage id="manage-doctor.save-intro-doctor" />
                            : <FormattedMessage id="manage-doctor.create-intro-doctor" />
                        }

                    </button>
                </div>

            </React.Fragment>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        infoDoctorMarkdown: state.admin.infoDoctor,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        saveInfoDoctorRedux: (data) => dispatch(actions.saveInfoDoctor(data)),
        fetchInfoDoctorMarkdown: (id) => dispatch(actions.fetchInfoDoctorMarkdown(id)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
