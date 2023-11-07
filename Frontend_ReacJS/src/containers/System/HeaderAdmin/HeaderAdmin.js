import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './HeaderAdmin.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils, USER_ROLE } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';

import { FormattedMessage } from 'react-intl';

// import Navigator from '../../../components/Navigator';
import NavigatorAdmin from './NavigatorAdmin';
import { adminMenu, doctorMenu } from './MenuApp';
import _ from 'lodash';
import { ToastContainer } from "react-toastify";
import CustomScrollbars from "../../../components/CustomScrollbars";


class HeaderAdmin extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            isShowNavData: false,
            isShowNavUser: false,
            menuApp: [],
        };
    }

    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];
        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }
            if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }
        this.setState({
            menuApp: menu
        })
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        // if (prevProps.doctorIdParent !== this.props.doctorIdParent) {
        //     let allDays = this.getDaySchedule(this.props.language);
        //     let res = await getBookingModalByDateService(this.props.doctorIdParent, allDays[0].value);
        //     this.setState({
        //         allTimes: res.data ? res.data : [],

        //     })
        // }

    }

    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }


    isShowNavLink = (id) => {
        if (id === 'data') {
            this.setState({
                isShowNavData: !this.state.isShowNavData,
            })
        } else if (id === 'user') {
            this.setState({
                isShowNavUser: !this.state.isShowNavUser,
            })
        }

    }

    render() {

        let { isShowNavData, isShowNavUser } = this.state;
        const { processLogout, language, userInfo } = this.props;
        console.log('chech user info', this.props.userInfo)
        let imageUser = new Buffer(this.props.userInfo.image, 'base64').toString('binary');
        return (
            <>

                <div className='hold-transition sidebar-mini layout-fixed'>

                    <div class="wrapper ">
                        {/* nav header */}

                        <nav class="main-header navbar navbar-expand navbar-white navbar-light">

                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                                </li>
                                <li class="nav-item d-none d-sm-inline-block">
                                    
                                   <Link to={'/home'} class="nav-link"> <FormattedMessage id="menu.admin.render-home" /></Link>
                                  
                                </li>
                                <li class="nav-item d-none d-sm-inline-block">
                                    <a href="#" class="nav-link">Contact</a>
                                </li>
                            </ul>


                            <ul class="navbar-nav ml-auto">

                                {/* <!-- Messages Dropdown Menu --> */}
                                <li class="nav-item dropdown">
                                    <a class="nav-link" data-toggle="dropdown" href="#">
                                        <i class="far fa-comments"></i>
                                        <span class="badge badge-danger navbar-badge">3</span>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                                        <a href="#" class="dropdown-item">
                                            {/* <!-- Message Start --> */}
                                            <div class="media">
                                                <img src="dist/img/user1-128x128.jpg" alt="User Avatar" class="img-size-50 mr-3 img-circle" />
                                                <div class="media-body">
                                                    <h3 class="dropdown-item-title">
                                                        Brad Diesel
                                                        <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
                                                    </h3>
                                                    <p class="text-sm">Call me whenever you can...</p>
                                                    <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
                                                </div>
                                            </div>
                                            {/* <!-- Message End --> */}
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a href="#" class="dropdown-item">
                                            {/* <!-- Message Start --> */}
                                            <div class="media">
                                                <img src="dist/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3" />
                                                <div class="media-body">
                                                    <h3 class="dropdown-item-title">
                                                        John Pierce
                                                        <span class="float-right text-sm text-muted"><i class="fas fa-star"></i></span>
                                                    </h3>
                                                    <p class="text-sm">I got your message bro</p>
                                                    <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
                                                </div>
                                            </div>
                                            {/* <!-- Message End --> */}
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a href="#" class="dropdown-item">
                                            {/* <!-- Message Start --> */}
                                            <div class="media">
                                                <img src="dist/img/user3-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3" />
                                                <div class="media-body">
                                                    <h3 class="dropdown-item-title">
                                                        Nora Silvester
                                                        <span class="float-right text-sm text-warning"><i class="fas fa-star"></i></span>
                                                    </h3>
                                                    <p class="text-sm">The subject goes here</p>
                                                    <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
                                                </div>
                                            </div>
                                            {/* <!-- Message End --> */}
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
                                    </div>
                                </li>
                                {/* <!-- Notifications Dropdown Menu --> */}
                                <li class="nav-item dropdown">
                                    <a class="nav-link" data-toggle="dropdown" href="#">
                                        <i class="far fa-bell"></i>
                                        <span class="badge badge-warning navbar-badge">15</span>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                                        <span class="dropdown-item dropdown-header">15 Notifications</span>
                                        <div class="dropdown-divider"></div>
                                        <a href="#" class="dropdown-item">
                                            <i class="fas fa-envelope mr-2"></i> 4 new messages
                                            <span class="float-right text-muted text-sm">3 mins</span>
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a href="#" class="dropdown-item">
                                            <i class="fas fa-users mr-2"></i> 8 friend requests
                                            <span class="float-right text-muted text-sm">12 hours</span>
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a href="#" class="dropdown-item">
                                            <i class="fas fa-file mr-2"></i> 3 new reports
                                            <span class="float-right text-muted text-sm">2 days</span>
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
                                    </div>
                                </li>

                                <li className="nav-item dropdown">
                                    <div className="languages">

                                        <span className={language === LANGUAGES.VI ? "language-vi active" : "language-vi"} onClick={() => { this.handleChangeLanguage(LANGUAGES.VI) }}>VN</span>
                                        <span className={language === LANGUAGES.EN ? "language-en active" : "language-en"} onClick={() => { this.handleChangeLanguage(LANGUAGES.EN) }}>EN</span>
                                        {/* nút logout */}
                                        <div className="btn-logout" onClick={processLogout} title='Log out'>
                                            <i className="fas fa-sign-out-alt"></i>
                                        </div>
                                    </div>
                                </li>

                            </ul>
                        </nav>


                        <aside className='nav-aside-content main-sidebar sidebar-dark-primary elevation-4'>
                        <a href="#" class="brand-link">
                                <div className='background-img' style={{ backgroundImage: `url(${imageUser})`}}></div>

                                <span class="brand-text font-weight-light">AdminLTE 3</span>
                            </a>
                        <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                           
                         
                            <div class="sidebar sidebar-content-down ">

                          
                                {/* <!-- Sidebar user panel (optional) --> */}
                                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                                    <div class="image-user"  style={{ backgroundImage: `url(${imageUser})`}}>


                                    </div>
                                    <div class="info">
                                        <a href="#" class="d-block">
                                            <span className='welcome'><FormattedMessage id="homeheader.welcome" />
                                                
                                                {userInfo && userInfo.roleId === 'R1' ? 'Admin ' : 'Bác sĩ '}
                                                {userInfo && userInfo.firstName ? userInfo.firstName : ''} !
                                            </span>
                                        </a>
                                    </div>
                                </div>

                                {/* <!-- SidebarSearch Form --> */}
                                <div class="form-inline form-search">
                                    <div class="input-group" data-widget="sidebar-search">
                                        <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                                        <div class="input-group-append">
                                            <button class="btn btn-sidebar">
                                                <i class="fas fa-search fa-fw"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <nav class="mt-2">
                                    <NavigatorAdmin menus={this.state.menuApp} />
                                </nav>


                       
                            </div>
                              </CustomScrollbars>
                        </aside>


                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };

};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderAdmin));
