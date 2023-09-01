import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";

import Slider from "react-slick";

class OutStandingDoctor extends Component {
  render() {
    return (
      <div className="section-share section-out-standing-doctor">
        <div className="container section-container">
          <div className="section-header">
            <span className="title-section">Bác sĩ nổi bật tuần qua</span>
            <button className="btn-section">Tìm kiếm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-background">
                    <div className="bg-image section-out-standing-doctor"></div>
                  </div>

                  <div className="position text-center">
                    <div>Tên bác sĩ</div>
                    <div>Chuyên khoa</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-background">
                    <div className="bg-image section-out-standing-doctor"></div>
                  </div>

                  <div className="position text-center">
                    <div>Tên bác sĩ</div>
                    <div>Chuyên khoa</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-background">
                    <div className="bg-image section-out-standing-doctor"></div>
                  </div>

                  <div className="position text-center">
                    <div>Tên bác sĩ</div>
                    <div>Chuyên khoa</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-background">
                    <div className="bg-image section-out-standing-doctor"></div>
                  </div>

                  <div className="position text-center">
                    <div>Tên bác sĩ</div>
                    <div>Chuyên khoa</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-background">
                    <div className="bg-image section-out-standing-doctor"></div>
                  </div>

                  <div className="position text-center">
                    <div>Tên bác sĩ</div>
                    <div>Chuyên khoa</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-background">
                    <div className="bg-image section-out-standing-doctor"></div>
                  </div>

                  <div className="position text-center">
                    <div>Tên bác sĩ</div>
                    <div>Chuyên khoa</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-background">
                    <div className="bg-image section-out-standing-doctor"></div>
                  </div>

                  <div className="position text-center">
                    <div>Tên bác sĩ</div>
                    <div>Chuyên khoa</div>
                  </div>
                </div>
              </div>
              <div className="section-customize">
                <div className="customize-border">
                  <div className="outer-background">
                    <div className="bg-image section-out-standing-doctor"></div>
                  </div>

                  <div className="position text-center">
                    <div>Tên bác sĩ</div>
                    <div>Chuyên khoa</div>
                  </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);
