import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/Admin/User/UserManager';
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
import MedicineDetail from '../containers/System/Admin/Medicine/MedicineDetail';
import FormularyManage from '../containers/System/Formulary/FormularyManage';
import DonePatient from '../containers/System/Doctor/DonePatient';
import AdminManageSchedule from '../containers/System/Admin/Schedule/AdminManageSchedule'
import ScheduleClinic from '../containers/System/Admin/Schedule/ScheduleClinic';
import CommentManage from '../containers/System/Comment/CommentManage';
import CancelPatient from '../containers/System/Doctor/CancelPatient';
import ManageRoom from '../containers/System/Clinic/DetailClinic/ManageRoom';
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
                        {/* <Route path="/doctor/manage-schedule" component={ManageSchedule} /> */}
                        <Route path="/system/admin-manage-schedule" component={AdminManageSchedule} />
                        <Route path="/system/schedule-clinic/:id" component={ScheduleClinic} />
                        <Route path="/system/manage-specialty" component={ManageSpecialty} />
                        <Route path="/system/manage-clinic" component={ManageClinic} />
                        <Route path="/system/manage-detail-clinic/:id" component={ManageRoom} />
                        <Route path="/system/data-booking" component={DataBooking} />
                        <Route path="/system/manage-medicine" component={MedicineManage} />
                        <Route path="/system/medicine-detail/:id" component={MedicineDetail} />
                        <Route path="/system/manage-formulary" component={FormularyManage} />
                        <Route path="/doctor/done-patient" component={DonePatient} />
                        <Route path="/doctor/cancel-patient" component={CancelPatient} />
                        <Route path="/system/manage-comment" component={CommentManage} />
               
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
