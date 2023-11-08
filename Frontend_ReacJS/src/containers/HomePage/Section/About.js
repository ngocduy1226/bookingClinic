import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="container py-4">
          <div className="section-about-header">
            Truyền thông nói gì về healthy booking
          </div>
          <div className="section-about-content">
            <div className="about-left">
              <iframe
                width="100%"
                height="300px"
                src="https://www.youtube.com/embed/ugeNGPJS6UA"
                title="Top 10 website chăm sóc sức khỏe chủ động cung cấp kiến thức thú vị | Sống lành mạnh"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div className="about-right"> Trụ sở tại Hà Nội
Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Thành phố Hà Nội, Việt Nam

Văn phòng tại TP Hồ Chí Minh
Số 01, Hồ Bá Kiện, Phường 15, Quận 10

Hỗ trợ khách hàng
support@bookingcare.vn (7h - 18h)

Hotline
024-7301-2468 (7h - 18h) </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
