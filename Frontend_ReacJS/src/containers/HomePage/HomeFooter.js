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
          {/* <div style={{ zIndex: '20000' }}>
            <Chat />
          </div> */}

          <div className='row '>
            <div className="col-4 content-info">
              <div className="child-content">
                <div className="image-footer-logo">
                  <img src={logo} onClick={() => this.returnHome()} />
                </div>
                <div className="text-content-info">
                  <div className="content-up">
                    <p className="phone"> +84 149 567 88</p>
                    <p className="text-phone">
                      <FormattedMessage id="homepage.call" />
                    </p>
                  </div>
                  <div className="content-down">
                    <FormattedMessage id="homepage.footer-content" />
                  </div>
                  <div className="text-start">
                    <FormattedMessage id="homepage.more-info" />
                    <i class="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 post-info">
              <div className="child-content">
                <div className="title-post">
                  <FormattedMessage id="homepage.footer-title-post" />
                </div>
                <div className="child-post">
                  <div className="image-post"
                    style={{ backgroundImage: `url(${post1})` }}
                  ></div>
                  <div className="text-post">
                    <p>
                      <FormattedMessage id="homepage.footer-post1" />
                    </p>
                    <p className="date"> <FormattedMessage id="homepage.footer-date-post1" /></p>
                  </div>
                </div>

                <hr style={{ color: 'beige' }} />
                <div className="child-post">
                  <div className="image-post"
                    style={{ backgroundImage: `url(${post2})` }}
                  ></div>
                  <div className="text-post">
                    <p>
                      <FormattedMessage id="homepage.footer-post2" />
                    </p>
                    <p className="date"><FormattedMessage id="homepage.footer-date-post2" /> </p>
                  </div>
                </div>
                <hr style={{ color: 'beige' }} />
                <div className="child-post">
                  <div className="image-post"
                    style={{ backgroundImage: `url(${post3})` }}
                  ></div>
                  <div className="text-post">
                    <p> <FormattedMessage id="homepage.footer-post3" /></p>
                    <p className="date"><FormattedMessage id="homepage.footer-date-post3" /></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 post-info contact-info">
              <div className="child-content">
                <div className="title-post">
                  <FormattedMessage id="homepage.footer-contact" />
                </div>
                <div className="child-post">

                  <div className="text-post">
                    <p><FormattedMessage id="homepage.contact-location" /></p>
                    <p className="date"><FormattedMessage id="homepage.content-location" /></p>
                  </div>
                </div>

                <hr style={{ color: 'beige' }} />
                <div className="child-post">

                  <div className="text-post">
                    <p><FormattedMessage id="homepage.open-door" /></p>
                    <p className="date"><FormattedMessage id="homepage.hour-open" /></p>
                  </div>
                </div>
                <hr style={{ color: 'beige' }} />
                <div className="child-post">

                  <div className="text-post">
                    <p><FormattedMessage id="homepage.support-client" /></p>
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
            <p>&copy; <FormattedMessage id="homepage.author" />
              <a href="#" >
                <FormattedMessage id="homepage.more-info" /></a>
            </p>
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
