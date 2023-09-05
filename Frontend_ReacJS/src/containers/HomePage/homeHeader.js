import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import logo from "../../assets/Logo_1.svg"
import { FormattedMessage} from "react-intl";
import { LANGUAGES } from "../../utils";

import { changeLanguageApp } from "../../store/actions/appActions";

class HomeHeader extends Component {
  changeLanguage = (language) => {
        //fire redux event: actions
        this.props.changeLanguageAppRedux(language)
        

  }
  render() {
 
    let language  = this.props.language;
    console.log('language: ', language);
    console.log('check user info: ', this.props.userInfo);
    return (
      <React.Fragment>
        <div className="home-header-container px-5">
          <div className="header-content">
            <div className="left-content">
              <i className="fa-solid  fas fa-bars"></i>
              <img className="header-logo" src={logo} />
             
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <b> <FormattedMessage id="homeheader.specialty"/></b>
                </div>
                <div className="subs-title"><FormattedMessage id="homeheader.search-doctor"/></div>
              </div>
              <div className="child-content">
                <div>
                  <b> <FormattedMessage id="homeheader.facility"/></b>
                </div>
                <div className="subs-title"><FormattedMessage id="homeheader.select-hospital"/></div>
              </div>
              <div className="child-content">
                <div>
                  <b><FormattedMessage id="homeheader.doctor"/> </b>
                </div>
                <div className="subs-title"><FormattedMessage id="homeheader.select-doctor"/></div>
              </div>
              <div className="child-content">
                <div>
                  <b> <FormattedMessage id="homeheader.medical-package"/> </b>
                </div>
                <div className="subs-title"> <FormattedMessage id="homeheader.health-check"/></div>
              </div>
            </div>
            <div className="right-content">
              <div className="support ">
                <i className="fas fa-question-circle"></i>
                <FormattedMessage id="homeheader.support"/>
              </div>
              <div>
                
              </div>
              <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={ () => this.changeLanguage(LANGUAGES.VI)}> VN</span></div>
              <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={ () => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
            </div>
          </div>
        </div>

        <div className="home-header-banner">
          <div className="content-up">
            <div className="title1"><FormattedMessage id="banner.medical-background"/></div>
            <div className="title2"><FormattedMessage id="banner.health-care"/></div>
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder=" tìm kiếm bác sĩ" />
            </div>
          </div>
          <div className="content-down">
            <div className="options">
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-hospital"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.specialist-exam"/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-phone-volume"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.remove-exam"/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="far fa-address-book"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.general-examination"/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-stethoscope"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.care-near"/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-vial"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.medical-examination"/></div>
              </div>
            </div>

            <div className="options">
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-universal-access"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.mental-health"/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-syringe"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.dental-examination"/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-bed"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.surgery-pack"/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-user-md"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.medical-products"/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-notes-medical"></i>
                </div>
                <div className="text-child"><FormattedMessage id="banner.medical-test"/></div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo : state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
