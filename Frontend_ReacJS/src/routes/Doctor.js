import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import Header from '../containers/Header/Header';
import HeaderAdmin from '../containers/System/HeaderAdmin/HeaderAdmin';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import PrescriptionPatient from '../containers/System/Doctor/PrescriptionPatient';
import DonePatient from '../containers/System/Doctor/DonePatient';
import CancelPatient from '../containers/System/Doctor/CancelPatient';
import CalendarSchedule from '../containers/System/Admin/Calendar/CalendarSchedule';
class Doctor extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment >
                {isLoggedIn && <HeaderAdmin />}
                <div className="system-container">
                    <div className="system-list">
                        <div style={{ marginLeft: '250px' }}>
                            <Switch>
                                <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                                <Route path="/doctor/manage-patient" component={ManagePatient} />
                                <Route path="/doctor/create-prescription" component={PrescriptionPatient} />
                                <Route path="/doctor/done-patient" component={DonePatient} />
                                <Route path="/doctor/cancel-patient" component={CancelPatient} />
                                <Route path="/doctor/calendar-schedule" component={CalendarSchedule} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
