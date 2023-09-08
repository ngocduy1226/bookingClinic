import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";

import Slider from "react-slick";



class HandBook extends Component {
  render() {

    return (
      <div className="section-share section-hand-book">
        <div className="container section-container">
          <div className="section-header">
            <span className="title-section">Cẩm nang</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div className="section-customize">
               
                <div className="bg-image section-hand-book"></div>
                <div className="title-sub-section">Xem cẩm nang</div>
              </div>

              <div className="section-customize">
              <div className="bg-image section-hand-book"></div>
                <div className="title-sub-section">Xem cẩm nang</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-hand-book"></div>
                <div className="title-sub-section">Xem cẩm nang</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-hand-book" ></div>
                <div className="title-sub-section">Chuyen Khoa Nhi</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-hand-book"></div>
                <div className="title-sub-section">Xem cẩm nang</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-hand-book"></div>
                <div className="title-sub-section">Xem cẩm nang</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-hand-book"></div>
                <div className="title-sub-section">Xem cẩm nang</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
