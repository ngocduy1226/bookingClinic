import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { getTopSpecialtyHomeService } from "../../../services/userService";
import { withRouter } from "react-router";

class Specialty extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      arrSpecialty: [],
    };
  }

  async componentDidMount() {
    let res = await getTopSpecialtyHomeService("7");

    if (res && res.errCode === 0) {
      this.setState({
        arrSpecialty: res.data,
      })

    }

  }
  handleDetailSpecialty = (specialty) => {
    if( this.props.history) {
      this.props.history.push(`/detail-specialty/${specialty.id}`);

    }
  }


  handleOnClickSpecialty = () => {
    if( this.props.history) {
      this.props.history.push(`/list/specialty`);
    }

  }

  render() {
    let { arrSpecialty } = this.state;

    return (
      <div className="section-share section-specialty"  >
        <div className="container section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage  id="homepage.specialty-popular"/>
            </span>
            <button className="btn-section" onClick={() => this.handleOnClickSpecialty()}>
            <FormattedMessage  id="homepage.more-info"/>
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrSpecialty && arrSpecialty.length > 0 &&
                arrSpecialty.map((item, index) => {
                  return (
                    <div className="section-customize" key={index}  onClick={ () => { this.handleDetailSpecialty(item)}} >

                      <div className="bg-image section-specialty"  
                          style={{ backgroundImage: `url(${item.image})`}}
                      ></div>
                      <div className="title-sub-section">{item.name}</div>
                    </div>
                  );
                })}

            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default  withRouter(  connect(mapStateToProps, mapDispatchToProps)(Specialty));
