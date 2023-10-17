import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/Admin/User/UserManager';
import UserRedux from '../containers/System/Admin/UserRedux';
import DoctorManage from '../containers/System/Admin/Doctor/DoctorManage';
import Header from '../containers/Header/Header';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import HeaderAdmin from '../containers/System/HeaderAdmin/HeaderAdmin';
import DataBooking from '../containers/System/Admin/DataStatistics/DataBooking';
import TableDoctor from '../containers/System/Admin/Doctor/TableDoctor';
import MedicalExamination from '../containers/System/Admin/Doctor/MedicalExamination';
import MedicineManage from '../containers/System/Admin/Medicine/MedicineManage';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
           <React.Fragment >
              {isLoggedIn && <HeaderAdmin/>}
            {/* {isLoggedIn && <Header />} */}
            <div className="system-container">
                <div className="system-list">
                    <div style={{marginLeft: '250px'}}>
                       <Switch>
                        {/* <Route path="/system/header" component={HeaderAdmin} /> */}
                        <Route path="/system/user-manage" component={UserManage} />
                        <Route path="/system/table-doctor" component={TableDoctor} />
                        <Route path="/system/manage-doctor" component={DoctorManage} />
                        <Route path="/system/medical-examination" component={MedicalExamination} />
                        <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                        <Route path="/system/manage-specialty" component={ManageSpecialty} />
                        <Route path="/system/manage-medicine" component={MedicineManage} />
                        <Route path="/system/manage-clinic" component={ManageClinic} />
                        <Route path="/system/data-booking" component={DataBooking} />

                        <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                    </Switch>   
                    </div>
                  
                </div>
            </div>
           </React.Fragment>
             
            
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
