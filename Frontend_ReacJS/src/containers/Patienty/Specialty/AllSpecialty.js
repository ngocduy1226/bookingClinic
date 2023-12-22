import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './AllSpecialty.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
//import { getAllSpecialtyByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/homeHeader';
import _ from 'lodash';
import Specialty from './Specialty';



class AllSpecialty extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  arrSpecialty: [],
            };
      }

      componentDidMount() {
            this.props.fetchAllSpecialty(+0);
      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.allSpecialty !== this.props.allSpecialty) {


                  this.setState({
                        arrSpecialty: this.props.allSpecialty,

                  })
            }

      }


   

      onChangeInputSearch = (event) => {
            console.log('event', event.target.value.toLowerCase());
            let lowerCase = event.target.value;
            let listSpecialty = this.state.arrSpecialty;
    
            let data = listSpecialty.filter((item) => {
        
                if (lowerCase === '') {
                    return;
                } else {
                    return item && item.name.toLowerCase().includes(lowerCase) ;
    
                }
            })
    
                if (!_.isEmpty(data)) {
                this.setState({
                  arrSpecialty: data
                })
            } else {
                  this.props.fetchAllSpecialty(+0);
    
            }
      }

      render() {

            let {language} = this.props; 
            let { arrSpecialty } = this.state;

            return (
                  <>
                        <HomeHeader />
                        <div className='list-specialty-container container'>
                              <div className='nav-specialty'>
                                    <span className='icon-home'><Link to={'/home'}><i className='fas fa-hospital '></i>  </Link></span>
                                    <span className='mx-2'>/</span>
                                    <span className='nav-title'> <FormattedMessage id="patient.specialty.title-nav"/> </span>
                              </div>
                              <div className='all-specialty'>
                                    <div className='search-specialty input-group' >


                                          <i class="fas fa-search"></i>
                                          <input type="text" placeholder={language === LANGUAGES.VI ? 'Tìm kiếm chuyên khoa' : "Search for specialties" } 
                                          onChange={(event) => this.onChangeInputSearch(event)} />

     
                                    </div>
                                    <Specialty listSpecialty = {arrSpecialty} />
                              </div>
                        </div>
                  </>

            );
      }

}

const mapStateToProps = state => {
      return {
            allSpecialty: state.admin.allSpecialty,
            language: state.app.language,
      };
};

const mapDispatchToProps = dispatch => {
      return {
            fetchAllSpecialty: (data) => dispatch(actions.fetchAllSpecialty(data)),

      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSpecialty));
