import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LANGUAGES} from "../../../utils";
import { getProfileDoctorInfoByIdService } from "../../../services/userService"
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
class OutStandingDoctor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
      listInfoDoctor: [],
    }
  }
  componentDidMount() {
    this.props.loadTopDoctor();
  }


  componentDidUpdate(prevProps, prevState, snapchot) {

    if (prevProps.topDoctorRedux !== this.props.topDoctorRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorRedux,

      })
      this.getListInfoDoctor();
    }
  }

  getListInfoDoctor = async () => {
    let listInfoDoctor = [];
    let arrDoctors = this.props.topDoctorRedux;
   
    for(let i=0 ;i< arrDoctors.length; i++ ){
          let res = await getProfileDoctorInfoByIdService(arrDoctors[i].id);
          let doctor = {};
          doctor.id = res.data.id;
          doctor.lastName = res.data.lastName;
          doctor.firstName = res.data.firstName;
          doctor.image = res.data.image;
          doctor.specialty = res.data.Doctor_Info.specialtyData;
           doctor.position = res.data.positionData;
          doctor.provinceId = res.data.Doctor_Info.provinceId;
          listInfoDoctor.push(doctor);
    
    }
   

    this.setState({
          listInfoDoctor: listInfoDoctor
    })
}

 

  handleDetailDoctor = (doctor) => {
      if( this.props.history) {
        this.props.history.push(`/detail-doctor/${doctor.id}`);

      }
    }


    returnDoctor = () => {
      if( this.props.history) {
        this.props.history.push(`/list/doctor`);
  
      }
  
    }
  render() {

    let {listInfoDoctor } = this.state;
    let language = this.props.language;
    return (
      <div className="section-share section-out-standing-doctor">
        <div className="container section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage  id = "homepage.outstanding-doctor"/>
            </span>
            <button className="btn-section" onClick={() => this.returnDoctor()}>   <FormattedMessage  id = "homepage.more-info"/></button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>

              {listInfoDoctor && listInfoDoctor.length > 0 && listInfoDoctor.map((item, index) => {
                   let nameVi = `${item.position.valueVi}, ${item.lastName} ${item.firstName}`;
                   let nameEn = `${item.position.valueEn}, ${item.firstName} ${item.lastName}`;

                return (
                  <div className="section-customize" key={index} onClick={ () => { this.handleDetailDoctor(item)}}>
                    <div className="customize-border">
                      <div className="outer-background">
                        <div className="bg-image section-out-standing-doctor"
                            style={{ backgroundImage: `url(${item.image})`}}
                        ></div>
                      </div>

                      <div className="position text-center">
                        <div>
                          {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div>{item.specialty.name}</div>
                      </div>
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
    topDoctorRedux: state.admin.topDoctors,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctor: (data) => dispatch(actions.fetchTopDoctor(data))

  };
};

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
