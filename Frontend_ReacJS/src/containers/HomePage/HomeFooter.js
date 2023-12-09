import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import './HomeFooter.scss'
import { FormattedMessage } from "react-intl";
import logo from "../../assets/logo-white.png"

import post1 from "../../assets/footer/post-1.jpg"
import post2 from "../../assets/footer/post-2.jpg"
import post3 from "../../assets/footer/post-3.jpg"
 import Chat from "../Patienty/chat";
class HomeFooter extends Component {
  render() {

    return (

      <div className="home-footer ">

        <div className="container">
          <div style={{zIndex: '20000'}}>
          

<Chat />

          </div>
        



          <div className='row '>
            <div className="col-4 content-info">
              <div className="child-content">
                <div className="image-footer-logo">
                  <img src={logo} onClick={() => this.returnHome()} />
                </div>
                <div className="text-content-info">
                  <div className="content-up">
                    <p className="phone"> +84 149 567 88</p>
                    <p className="text-phone">Gọi ngay cho tổng đài!</p>
                  </div>
                  <div className="content-down">
                   Lợi ích của khách hàng là rất quan trọng,
                    chúng tôi sẽ dành nhiều thời gian để theo dõi dịch vụ khách hàng.
                    Nhưng chúng tôi cũng sẽ dành thời gian tương tự cho 
                    việc nâng cao kinh nghiệm, cũng như cơ sở vật chất.
                  </div>
                  <div className="text-start">
                    Xem thêm
                    <i class="fas fa-arrow-right"></i>
                  </div>


                </div>
              </div>
            </div>
            <div className="col-4 post-info">
              <div className="child-content">
                <div className="title-post">Bài đăng</div>
                <div className="child-post">
                  <div className="image-post"  
                   style={{ backgroundImage: `url(${post1})`}}
                  ></div>
                  <div className="text-post">
                    <p> Trầm cảm có thể làm tăng nguy cơ mắc bệnh tim?</p>
                    <p className="date"> T2, 27/10/2023</p>
                  </div>
                </div>

                <hr style={{ color: 'beige' }} />
                <div className="child-post">
                  <div className="image-post" 
                  style={{ backgroundImage: `url(${post2})`}}
                  ></div>
                  <div className="text-post">
                    <p>  6 câu hỏi để hỏi bác sĩ tim mạch của bạn ?</p>
                    <p className="date"> T5, 01/11/2023</p>
                  </div>
                </div>
                <hr style={{ color: 'beige' }} />
                <div className="child-post">
                  <div className="image-post" 
                  style={{ backgroundImage: `url(${post3})`}}
                  ></div>
                  <div className="text-post">
                    <p> Các loại tăng huyết áp khác nhau ?</p>
                    <p className="date"> T2, 09/11/2023</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 post-info contact-info">
              <div className="child-content">
                <div className="title-post">Kết nối</div>
                <div className="child-post">

                  <div className="text-post">
                    <p>Vị trí</p>
                    <p className="date">Đường 3/2, Ninh Kiều, TP Cần Thơ </p>
                  </div>
                </div>

                <hr style={{ color: 'beige' }} />
                <div className="child-post">

                  <div className="text-post">
                    <p>Mở cửa</p>
                    <p className="date"> 9.00am đến 6.00pm (Thứ 2 - Thứ 7)</p>
                  </div>
                </div>
                <hr style={{ color: 'beige' }} />
                <div className="child-post">

                  <div className="text-post">
                    <p>  Hỗ trợ khách hàng</p>
                    <p className="date"> healthycare@gmail.com </p>
                  </div>
                </div>
                <div className="list-social">

                  <i className="fab fa-google-plus-g google"></i>
                  <i className="fab fa-facebook-f facebook"></i>
                  <i className="fab fa-twitter twitter"></i>

                </div>
              </div>
            </div>
          </div>
          <hr style={{ color: 'beige' }} />
          <div className="row author-text">
          <p>&copy; 2023 Công ty TNHH Trường Thịnh !!! <a href="#" >Xem thêm</a> </p>
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


export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
