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
            Chuyên mục chăm sóc sức khỏe
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
            <div className="about-right">
              <p>
                Theo các chuyên gia y tế, cơ thể mỗi chúng ta cũng là một
                cỗ máy, nếu muốn hoạt động tốt cần được kiểm tra, bảo dưỡng thường xuyên
                nếu muốn hoạt động tốt. Vì vậy, chúng ta nên kiểm tra sức khỏe toàn diện
                ít nhất mỗi lần một năm để hiểu cơ thể mình đang cần gì.
              </p>

              <p>
                Sự khác biệt mà các Gói khám sức khỏe tổng quát tại Vinmec mang lại là khả
                năng phát hiện sớm và kịp thời các bệnh đang gia tăng và được coi là nguyên
                nhân hàng đầu gây tử vong ở Việt Nam hiện nay như: Đột quỵ, ung thư, bệnh lý hô hấp,
                đái tháo đường; các bệnh lý hay gặp như tăng huyết áp, rốỉ loạn mỡ máu...).
                Với trẻ nhỏ là khả năng đánh giá toàn diện sức khỏe và tìm ra các bệnh lý trong giai
                đoạn tiềm ẩn có thể ảnh hưởng tới cuộc sống sau này.

              </p>

            </div>
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
