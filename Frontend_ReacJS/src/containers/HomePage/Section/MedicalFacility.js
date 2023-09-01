import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";

import Slider from "react-slick";



class MedicalFacility extends Component {
  render() {

    return (
      <div className="section-share section-medical-facility">
        <div className="container section-container">
          <div className="section-header">
            <span className="title-section">Cơ sở y tế nổi bật</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div className="section-customize">
               
                <div className="bg-image section-medical-facility"></div>
                <div className="title-sub-section">Bệnh viện Hữu nghị Việt Đức</div>
              </div>

              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                <div className="title-sub-section">Bệnh viện Hữu nghị Việt Đức</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                <div className="title-sub-section">Bệnh viện Hữu nghị Việt Đức</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-medical-facility" ></div>
                <div className="title-sub-section">Bệnh viện Hữu nghị Việt Đức</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                <div className="title-sub-section">Bệnh viện Hữu nghị Việt Đức</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                <div className="title-sub-section">Bệnh viện Hữu nghị Việt Đức</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                <div className="title-sub-section">Bệnh viện Hữu nghị Việt Đức</div>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
