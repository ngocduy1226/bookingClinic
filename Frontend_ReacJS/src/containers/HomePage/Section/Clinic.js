import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./Clinic.scss";
import { FormattedMessage } from "react-intl";
import { getTopClinicHomeService } from "../../../services/userService";
import Slider from "react-slick";
import { withRouter } from "react-router";


class Clinic extends Component {

  constructor(prop) {
    super(prop);
    this.state = {
      arrClinic: [],
    };
  }

  async componentDidMount() {
    let res = await getTopClinicHomeService("7");

    if (res && res.errCode === 0) {
      this.setState({
        arrClinic: res.data,
      })

    }

  }
  handleDetailFacility = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  }

  returnClinic = () => {
    if( this.props.history) {
      this.props.history.push(`/list/clinic`);
    }
  }


  render() {
    let { arrClinic } = this.state;
    return (
      <div className="section-share section-medical-facility">
        <div className="container section-container">
          <div className="section-header">
            <span className="title-section">Cơ sở y tế nổi bật</span>
            <button className="btn-section" onClick={() => this.returnClinic()}>Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrClinic && arrClinic.length > 0 &&
                arrClinic.map((item, index) => {
                  return (
                    <div className="p-1" >
                      <div className="section-customize section-customize-p" key={index} onClick={() => { this.handleDetailFacility(item) }}>

                        <div className="bg-image section-medical-facility" style={{ backgroundImage: `url(${item.image})` }}></div>
                        <div className="title-sub-section text-center p-1">{item.name}</div>
                      </div>
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

export default withRouter(  connect(mapStateToProps, mapDispatchToProps)(Clinic));
