import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import './HandBook.scss';
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
               
                <div className="bg-image section-hand-book"    style={{ backgroundImage: `url(https://cdn.bookingcare.vn/fo/2018/04/05/235325invisible-braces.jpg)`}}></div>
                <div className="title-sub-section">10 địa chỉ Niềng răng ở Hà Nội được tìm kiếm nhiều</div>
              </div>

              <div className="section-customize">
              <div className="bg-image section-hand-book" style={{ backgroundImage: `url(https://cdn.bookingcare.vn/fo/2023/10/25/000124-teamrung-gia.jpg)`}}></div>
                <div className="title-sub-section">Bài 2: Kinh nghiệm leo đỉnh Tà Xùa</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-hand-book" style={{ backgroundImage: `url(https://cdn.bookingcare.vn/fo/w1920/2023/10/25/230249-porter-cung-doan.jpg)`}}></div>
                <div className="title-sub-section">Bài 4: Những người đồng hành trong hành trình leo đỉnh Tà Xùa</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-hand-book" style={{ backgroundImage: `url(https://cdn.bookingcare.vn/fo/w1920/2023/10/25/235130-teamanh-dinh-ta-xua.jpg)`}}></div>
                <div className="title-sub-section">Bài 1: Team BookingCare leo đỉnh Tà Xùa thành công</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-hand-book" style={{ backgroundImage: `url(https://cdn.bookingcare.vn/fo/w1920/2023/10/25/223641-chan-nui-ben-canh-homestay.jpg)`}}></div>
                <div className="title-sub-section">Bài 3: Xuống núi và kết thúc hành trình</div>
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
