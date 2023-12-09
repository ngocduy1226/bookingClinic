import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './AllClinic.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getProfileclinicInfoByIdService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/homeHeader';
import _ from 'lodash';
import Clinic from './Clinic';


class AllClinic extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  allClinic: [],

            };
      }

      async componentDidMount() {
            this.props.fetchAllClinic(+0);



      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.allClinic !== this.props.allClinic) {
                  this.setState({
                        allClinic: this.props.allClinic,
                  })
                  this.props.fetchAllClinic(+0);

            }

      }



      onChangeInputSearch = (event) => {
            let lowerCase = event.target.value;
            let allClinic = this.state.allClinic;
            let data = allClinic.filter((item) => {

                  if (lowerCase === '') {
                        return;
                  } else {
                        return item && item.name.toLowerCase().includes(lowerCase);

                  }
            })

            if (!_.isEmpty(data)) {
                  this.setState({
                        allClinic: data
                  })
            } else {
                  this.props.fetchAllClinic(+0);
            }
      }

      render() {
            let { allClinic } = this.state;

            return (
                  <>
                        <HomeHeader />
                        <div className='list-clinic-container container'>
                              <div className='nav-clinic'>
                                    <span className='icon-home'><Link to={'/home'}><i className='fas fa-hospital '></i>  </Link></span>
                                    <span className='mx-2'>/</span>
                                    <span className='nav-title'> <FormattedMessage id="patient.clinic.title-nav" /> </span>
                              </div>
                              <div className='all-clinic'>
                                    <div className='search-clinic input-group' >
                                          <i class="fas fa-search"></i>
                                          <input type="text" placeholder="Tìm kiếm cơ sở y tế"
                                                onChange={(event) => this.onChangeInputSearch(event)} />
                                    </div>

                                    <Clinic allClinic={allClinic} />
                              </div>
                        </div>
                  </>

            );
      }

}

const mapStateToProps = state => {
      return {
            allClinic: state.admin.allClinic,
            language: state.app.language,
      };
};

const mapDispatchToProps = dispatch => {
      return {
            fetchAllClinic: (data) => dispatch(actions.fetchAllClinic(data)),

      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllClinic));
