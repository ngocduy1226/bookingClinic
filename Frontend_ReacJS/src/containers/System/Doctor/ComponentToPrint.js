import React, { Component, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../utils/emitter";
import "./ComponentToPrint.scss";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import _ from "lodash";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import localization from 'moment/locale/vi';


import { useReactToPrint } from 'react-to-print';
import { injectIntl } from 'react-intl';


import ReactToPrint from 'react-to-print';

export class ComponentToPrint extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            listMedicine: [],
            booking: {},
            doctor: {},
            patient: {},

            // date: '',
            diagnosis: '',
            symptoms: '',
        };

    }

    async componentDidMount() {
        if (this.props.data) {
            let data = this.props.data;
            //    let date = moment.unix(+data.date / 1000).format('dddd - DD/MM/YYYY ')
            this.setState({
                listMedicine: data.medicine,
                booking: data.pres.Booking,
                diagnosis: data.pres.diagnosis,
                symptoms: data.pres.symptoms,

                doctor: data.pres.Booking.bookingDoctorData,
                patient: data.pres.Booking.userData,

                // date: date,
            })
        }

    }



    componentDidUpdate(prevProps, prevState, snapchot) {
        //render => didupate  
        // qua khu >< hien tai
        if (prevProps.data !== this.props.data) {
            let data = this.props.data;
            //    let date = moment.unix(+data.date / 1000).format('dddd - DD/MM/YYYY ')
            this.setState({
                listMedicine: data.medicine,
                booking: data.pres.Booking,
                diagnosis: data.pres.diagnosis,
                symptoms: data.pres.symptoms,

                doctor: data.pres.Booking.bookingDoctorData,
                patient: data.pres.Booking.userData,

                // date: date,
            })
        }

    }




    render() {

        let { listMedicine,
            booking,
            diagnosis,
            symptoms,
            patient, doctor } = this.state;
        let birthday = moment.unix(+patient.birthday / 1000).format('DD/MM/YYYY ');
        let date = moment.unix(+booking.date / 1000).format('DD/MM/YYYY ');
        


        return (
            <div className="modal-prescription-content m-5">
                <div className="title-modal-prescription" >
                <FormattedMessage id="manage-prescription.title-prescription" />
                </div>
                <div className="border-break"></div>
                <div className="date-create-prescription row">
                    <div className="col-6"></div>
                    <div className="col-6 date">
                        <div className="title-sub">
                        <FormattedMessage id="manage-prescription.data-booking" />
                             </div>
                        <div> {date}</div>
                    </div>
                </div>



                <div className="border-break col-6"></div>
                <div className="info-patient row">
                    <div className="title-info-patient" >
                    <FormattedMessage id="manage-prescription.info-patient" />
                    </div>
                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.name-patient" /></div>
                        <div> {patient.lastName} {patient.firstName}</div>

                    </div>
                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.birthday" /></div>
                        <div>{birthday}</div>

                    </div>
                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.phone" /></div>
                        <div>{patient.phoneNumber}</div>

                    </div>
                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.gender" /></div>
                        <div>
                            {patient.gender === "M" && 'Nam'}
                            {patient.gender === "F" && 'Nữ'}
                            {patient.gender === "O" && 'Khác'}
                        </div>

                    </div>
                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.address" /></div>
                        <div>{patient.address}</div>

                    </div>

                </div>
                <div className="border-break col-6"></div>
                <div className="info-patient row">
                    <div className="title-info-patient" ><FormattedMessage id="manage-prescription.booking" /></div>
                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.symptoms" /></div>
                        <div>{symptoms} </div>

                    </div>
                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.diagnosis" /></div>
                        <div>{diagnosis} </div>

                    </div>
                </div>
                <div className="border-break col-6"></div>
                <div className="list-medicine-content">
                    <div className="title-list-medicine "><FormattedMessage id="manage-prescription.title-list-medicine" /></div>
                    <div className="table-medicine my-2">
                        <table className="table table-hover table-striped table-bordered">
                            <thead className="thead-dark ">
                                <tr className="table-dark">
                                    <th scope="col">#</th>
                                    <th scope="col"><FormattedMessage id="manage-medicine.name" /></th>
                                    <th scope="col"><FormattedMessage id="manage-medicine.dosage" /></th>
                                    <th scope="col"><FormattedMessage id="manage-medicine.frequency" /></th>


                                </tr>
                            </thead>
                            <tbody>

                                {listMedicine && listMedicine.length > 0 ?
                                    listMedicine.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">1</th>
                                                <td>{item.medicineData.name}</td>
                                                <td>

                                                    {item.dosageData.valueVi}
                                                </td>
                                                <td>
                                                    {item.frequencyData.valueVi}

                                                </td>


                                            </tr>
                                        );
                                    })
                                    : <tr><td><FormattedMessage id="manage-prescription.not-data" /></td></tr>
                                }



                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="border-break col-6"></div>
                <div className="info-doctor row ">
                    <div className="title-info-doctor" ><FormattedMessage id="manage-prescription.info-doctor" /></div>
                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.name-doctor" /></div>
                        <div>{doctor.firstName} {doctor.lastName}</div>

                    </div>


                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.phone" /></div>
                        <div>{doctor.phoneNumber} </div>

                    </div>
                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.key-doctor" /></div>
                        <div>ten</div>

                    </div>

                    <div className="col-6 my-2">
                        <div className="title-sub"><FormattedMessage id="manage-prescription.email" /></div>
                        <div>{doctor.email} </div>

                    </div>
                </div>
            </div>

        );
    }
}

// Using a functional component, you must wrap it in React.forwardRef, and then forward the ref to
// the node you want to be the root of the print (usually the outer most node in the ComponentToPrint)
// https://reactjs.org/docs/refs-and-the-dom.html#refs-and-function-components
//   export const ComponentToPrint = React.forwardRef((props, ref) => {
//     return (
//       <div ref={ref}>My cool content here!</div>
//     );
//   });