import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ManageClinic.scss'
import { LANGUAGES, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import { createNewClinicService } from "../../../services/userService";
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            imageBase64Sub: '',
            descriptionMarkdown: '',
            descriptionHTML: '',
        };
    }

    componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

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
    render() {

        return (
            <div className="manage-specialty-container container">
                <div className='title-sp'>
                    <FormattedMessage id="manage-clinic.title" />
                </div>
                <div className='specialty-all row'>
                    <div className='col-6 form-group my-2'>
                        <label>
                            <FormattedMessage id="manage-clinic.name" />
                        </label>
                        <input className='form-control' value={this.state.name} type='text'
                         onChange={(event) => this.onChangeInput(event, 'name')} 
                         placeholder={  <FormattedMessage id="manage-clinic.name" />}
                         />
                    </div>

                    <div className='col-6 form-group my-2'>
                        <label> <FormattedMessage id="manage-clinic.address" /></label>
                        <input className='form-control' value={this.state.address}
                         type='text' 
                         onChange={(event) => this.onChangeInput(event, 'address')} 
                         placeholder={  <FormattedMessage id="manage-clinic.address" />}
                         />
                    </div>

                    <div className='col-6 form-group my-2'>
                        <label> <FormattedMessage id="manage-clinic.art" /></label>
                        <input class="form-control" type="file" onChange={(event) => this.handleOnChangeImage(event, "imageSub")} />
                    </div>

                    <div className='col-6 form-group my-2'>
                        <label><FormattedMessage id="manage-clinic.logo" /></label>
                        <input class="form-control" type="file" onChange={(event) => this.handleOnChangeImage(event, "avatar")} />
                    </div>

                    <div className='col-12 my-2'>
                        <label><FormattedMessage id="manage-clinic.description" /></label>
                        <MdEditor style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='btn-add-specialty col-12 my-2'>
                        <button className='btn btn-primary'
                            onClick={() => this.handleSaveClinic()}>
                            <FormattedMessage id="manage-clinic.create-clinic" />
                        </button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageClinic));
