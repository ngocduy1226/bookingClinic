import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './ManageSpecialty.scss'
import { LANGUAGES, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
           name: '',
           imageBase64 : '',
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
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
           // let objectUrl = URL.createObjectURL(file);
         
            this.setState({
            //    preImageBase64: objectUrl,
                
                 imageBase64: base64,
            })
        }

    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handleSaveSpecialty = () => {
        console.log('checl stae', this.state);
    }
    render() {

        return (
            <div className="manage-specialty-container container">
                <div className='title-sp'>Quan ly chuyen khoa</div>
                <div className='specialty-all row'>
                    <div className='col-6 form-group'>
                        <label>Ten chuyen khoa</label>
                        <input className='form-control' value={this.state.name} type='text' onChange={ (event) => this.onChangeInput(event, 'name')} />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Anh dai dien</label>nt
                        <input class="form-control"  type="file" onChange={ (event) => this.handleOnChangeImage(event)}/>
                    </div>
                    <div className='col-12'>
                      <label>Mo ta chi tiet</label>  
                    <MdEditor style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                </div>
                <div className='btn-add-specialty col-12'>
                    <button className='btn btn-primary' onClick={() => this.handleSaveSpecialty()}>Them moi</button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty));
