import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './AllDoctor.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getProfileDoctorInfoByIdService , getAllDoctorsService} from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/homeHeader';
import _ from 'lodash';
import Doctor from './Doctor';


class AllDoctor extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  allDoctors: [],
                  listInfoDoctor: [],
            };
      }

      async componentDidMount() {
            this.props.fetchAllDoctors(+0);


            
      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.allDoctors !== this.props.allDoctors) {
                  this.setState({
                        allDoctors: this.props.allDoctors,

                  })
               this.getListInfoDoctor();

            }

      }

      getListInfoDoctor = async () => {
            let listInfoDoctor = [];
            let arrDoctors = this.props.allDoctors;
           
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

      // handleOnClickDoctor = (doctor) => {
      //       if (this.props.history) {
      //             this.props.history.push(`/detail-doctor/${doctor.id}`);

      //       }

      // }

      onChangeInputSearch = (event) => {
            console.log('event', event.target.value.toLowerCase());
            let lowerCase = event.target.value;
            let listDoctor = this.state.listInfoDoctor;
    
            let data = listDoctor.filter((item) => {
        
                if (lowerCase === '') {
                    return;
                } else {
                    return item && item.lastName.toLowerCase().includes(lowerCase) ;
    
                }
            })
    
                if (!_.isEmpty(data)) {
                this.setState({
                  listInfoDoctor: data
                })
            } else {
                  this.getListInfoDoctor();
    
            }
      }

      render() {

          console.log('state 1', this.state);

            let {  listInfoDoctor} = this.state;

            return (
                  <>
                        <HomeHeader />
                        <div className='list-doctor-container container'>
                              <div className='nav-doctor'>
                                    <span className='icon-home'><Link to={'/home'}><i className='fas fa-hospital '></i>  </Link></span>
                                    <span className='mx-2'>/</span>
                                    <span className='nav-title'> <FormattedMessage id="patient.doctor.title-nav"/> </span>
                              </div>
                              <div className='all-doctor'>
                                    <div className='search-doctor input-group' >


                                          <i class="fas fa-search"></i>
                                          <input type="text" placeholder=" tìm kiếm bác sĩ" onChange={(event) => this.onChangeInputSearch(event)} />


                                    </div>
                                    <Doctor listInfoDoctor = {listInfoDoctor}  />
                              </div>
                        </div>
                  </>

            );
      }

}

const mapStateToProps = state => {
      return {
            allDoctors: state.admin.allDoctors,
            language: state.app.language,
      };
};

const mapDispatchToProps = dispatch => {
      return {
            fetchAllDoctors: (data) => dispatch(actions.fetchAllDoctors(data)),

      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllDoctor));
