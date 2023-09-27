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

            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            listClinic: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedSpecialty: '',
            selectedClinic: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        this.props.fetchInfoDoctorMarkdown(this.state.selectedOption.value);
        this.props.fetchAllRequiredDoctorInfoRedux();
    }

    /** Life cycle
     * Run component
     *1. init state
     *2. mount(set state) /unmount
     *3. render
     */

    componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {

            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfo;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');

            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }

        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {

            let { resPrice, resPayment, resProvince, resSpecialty } = this.props.allRequiredDoctorInfo;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, "SPECIALTY");
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
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
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            selectedClinic: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value  : '',
            selectedSpecialty: this.state.selectedSpecialty.value, 

        })
        this.setState({
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
        })
    }



    handleChangeSelect = async (selectedOption) => {


        this.setState({
            selectedOption,
        });

        let { listPayment, listPrice, listProvince, listSpecialty, listClinic } = this.state;

        let res = await detailDoctorService(selectedOption.value);

        if (res && res.errCode === 0 && res.data && res.data.Markdown && res.data.Doctor_Info) {
            let markdown = res.data.Markdown;
            let doctorInfo = res.data.Doctor_Info;
        

            let paymentId = doctorInfo.paymentId;
            let selectedPayment = listPayment.find(item => {
                return item && item.value === paymentId;
            })

            let priceId = doctorInfo.priceId;
            let selectedPrice = listPrice.find(item => {
                return item && item.value === priceId;
            })

            let specialtyId = doctorInfo.specialtyId;
            let selectedSpecialty = listSpecialty.find(item => {
                return item && item.value === specialtyId;
            })
    

            let clinicId = doctorInfo.clinicId;
            let selectedClinic = listClinic.find(item => {
                return item && item.value === clinicId;
            })

            let provinceId = doctorInfo.provinceId;
            let selectedProvince = listProvince.find(item => {
                return item && item.value === provinceId;
            })
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true,


                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedClinic: selectedClinic,
                selectedSpecialty: selectedSpecialty,
                nameClinic: doctorInfo.nameClinic,
                addressClinic: doctorInfo.addressClinic,
                note: doctorInfo.note,
            })
        } else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                hasOldData: false,


                nameClinic: '',
                addressClinic: '',
                note: '',

                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedClinic: '',
                selectedSpecialty: '',

            })
        }


    };

    handleChangeSelectInfoDoctor = (selectedOption, name) => {
      //  console.log('check select', selectedOption, name);
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
        })

    }

    handleOnchangeText = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }


    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;

                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi} VND`;
                    let labelEn = `${item.valueEn} USD`;

                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'PROVINCE' || type === 'PAYMENT') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} `;

                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if(type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                })
            }

        }
        return result;
    }

    render() {
        let { hasOldData } = this.state;
        console.log('')
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
                                placeholder={<FormattedMessage id="manage-doctor.choose-doctor" />}
                            />
                        </div>
                        <div className="content-right">
                            <label>

                                <FormattedMessage id="manage-doctor.intro-doctor" />

                            </label>
                            <textarea className="form-control" id="w3review" name="w3review" rows="3" cols="10"
                                onChange={(event) => this.handleOnchangeText(event, 'description')}
                                value={this.state.description}

                            >

                            </textarea>

                        </div>

                    </div>

                    <div className="doctor-info row">
                        <div className="col-4 form-group my-3">
                            <label> <FormattedMessage id="manage-doctor.price" /></label>
                            <Select
                                value={this.state.selectedPrice}
                                onChange={this.handleChangeSelectInfoDoctor}
                                options={this.state.listPrice}
                                placeholder={<FormattedMessage id="manage-doctor.price" />}
                                name="selectedPrice"
                            />
                        </div>
                        <div className="col-4 form-group my-3 ">
                            <label> <FormattedMessage id="manage-doctor.payment" /></label>
                            <Select
                                value={this.state.selectedPayment}
                                onChange={this.handleChangeSelectInfoDoctor}
                                options={this.state.listPayment}
                                placeholder={<FormattedMessage id="manage-doctor.payment" />}
                                name="selectedPayment"
                            />
                        </div>
                        <div className="col-4 form-group my-3">
                            <label> <FormattedMessage id="manage-doctor.province" /></label>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelectInfoDoctor}
                                options={this.state.listProvince}
                                placeholder={<FormattedMessage id="manage-doctor.province" />}
                                name="selectedProvince"
                            />
                        </div>
                        <div className="col-4 form-group my-3">
                            <label> <FormattedMessage id="manage-doctor.name-clinic" /></label>
                            <input
                                className="form-control"
                                onChange={(event) => this.handleOnchangeText(event, 'nameClinic')}
                                value={this.state.nameClinic}
                            />
                        </div>
                        <div className="col-4 form-group my-3">
                            <label> <FormattedMessage id="manage-doctor.address-clinic" /></label>
                            <input
                                className="form-control"
                                onChange={(event) => this.handleOnchangeText(event, 'addressClinic')}
                                value={this.state.addressClinic}
                            />
                        </div>
                        <div className="col-4 form-group my-3">
                            <label> <FormattedMessage id="manage-doctor.note" /></label>
                            <input className="form-control"
                                onChange={(event) => this.handleOnchangeText(event, 'note')}
                                value={this.state.note}
                            />
                        </div>
                        <div className="col-4 form-group my-3">
                            <label> 
                                chuyen khoa
                             {/* <FormattedMessage id="manage-doctor.price" /> */}
                            </label>
                            <Select
                                value={this.state.selectedSpecialty}
                                onChange={this.handleChangeSelectInfoDoctor}
                                options={this.state.listSpecialty}
                                placeholder={<FormattedMessage id="manage-doctor.price" />}
                                name="selectedSpecialty"
                            />
                        </div>
                        <div className="col-4 form-group my-3">
                            <label> clinic <FormattedMessage id="manage-doctor.price" /></label>
                            <Select
                                value={this.state.selectedClinic}
                                onChange={this.handleChangeSelectInfoDoctor}
                                options={this.state.listClinic}
                                placeholder={<FormattedMessage id="manage-doctor.price" />}
                                name="selectedClinic"
                            />
                        </div>
                    </div>
                    <div className="manage-doctor-editor">
                        <label> <FormattedMessage id="manage-doctor.detail-info" /></label>
                        <MdEditor style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkdown}
                        />

                    </div>
                    <button className={hasOldData === true ? "save-content-doctor btn btn-warning" : "create-content-doctor btn btn-primary"}
                        type="button"
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
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        fetchAllRequiredDoctorInfoRedux: () => dispatch(actions.fetchRequiredDoctorInfo()),
        saveInfoDoctorRedux: (data) => dispatch(actions.saveInfoDoctor(data)),
        fetchInfoDoctorMarkdown: (id) => dispatch(actions.fetchInfoDoctorMarkdown(id)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
