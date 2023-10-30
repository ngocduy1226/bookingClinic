import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './PrescriptionPatient.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import localization from 'moment/locale/vi';
import { injectIntl } from 'react-intl';
import { get } from 'lodash';
import { withRouter } from "react-router";
import { createPrescriptionService } from "../../../services/prescriptionService"
import { FormattedMessage } from 'react-intl';
import MedicineTable from '../Admin/Medicine/MedicineTable';
import { getAllUsersService } from '../../../services/userService';
import { toast } from 'react-toastify';
import PDFFile from './pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ModalPrescription from './ModalPrescription';
import LoadingOverlay from 'react-loading-overlay';
import ModalAllPres from './ModalAllPres';
import _ from "lodash";

class PrescriptionPatient extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            listMedicine: [],
            dosageArr: [],
            frequencyArr: [],
            //     dosage: '',
            frequency: '',
            patient: '',
            infoPatient: {},
            infoDoctor: {},
            namePatient: '',
            phoneNumber: '',
            email: '',
            birthday: '',
            symptoms: '',
            diagnosis: '',
            chooseDosageArr: [],
            chooseFrequencyArr: [],

            dataBooking: {},
            isShowModalPrescription: false,
            dataPrescription: {},
            isShowLoading: false,
            isShowAllPres: false,
            allPres: [],
        };
    }

    async componentDidMount() {
        this.props.getDosageStart();
        this.props.getFrequencyStart();
        if (this.props.location && this.props.location.search) {


            let dataBooking = this.props.location.state

            let urlParams = new URLSearchParams(this.props.location.search);
            let patientId = urlParams.get('patientId');
            let doctorId = urlParams.get('doctorId');
            let date = urlParams.get('date');
            this.props.fetchUser(patientId);
            let user = this.props.user;
            let userBirth = user.birthday;
            let birthday = moment.unix(+ userBirth / 1000).format('DD/MM/YYYY');

            let doctor = await getAllUsersService(doctorId);
            if (doctor && doctor.errCode === 0) {

                this.setState({
                    infoDoctor: doctor.users
                })
            }
            this.setState({
                namePatient: user.firstName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                birthday: birthday,
                infoPatient: user,
                patient: patientId,
                doctor: doctorId,
                date: date,

                dataBooking: dataBooking,
            })

            this.props.fetchAllPrescriptionByPatient(patientId);
        }


    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.listDosage !== this.props.listDosage) {
            let arrDosages = this.props.listDosage;
            this.setState({
                dosageArr: arrDosages,
            })
        }

        if (prevProps.listFrequency !== this.props.listFrequency) {
            let arrFrequencies = this.props.listFrequency;
            this.setState({
                frequencyArr: arrFrequencies,
            })
        }

        if (prevProps.allPresByPatient !== this.props.allPresByPatient) {
            let arrPres = this.props.allPresByPatient;
            this.setState({
                allPres: arrPres,
            })
        }
    }


    createDrug = (medicine) => {

        let listMedicine = this.state.listMedicine;
        let isTrue = false;
        if (listMedicine && listMedicine.length > 0) {
            listMedicine.map(
                (item) => {
                    if (item.id === medicine.id) {
                        isTrue = true;
                        return isTrue;
                    }

                })

        }

        if (isTrue === false) {
            let drug = {};
            drug.id = medicine.id;
            drug.name = medicine.name;
            drug.dosage = this.props.listDosage && this.props.listDosage.length > 0 ? this.props.listDosage[0].keyMap : ''
            drug.frequency = this.props.listFrequency && this.props.listFrequency.length > 0 ? this.props.listFrequency[0].keyMap : ''
            listMedicine.push(drug);

            this.setState({
                listMedicine
            })
        }

    }

    deleteDrug = (medicine) => {
        let id = medicine.id;
        let arr = this.state.listMedicine;
        let listMedicine = arr.filter(
            item => item.id !== id
        )

        this.setState({
            listMedicine
        })
    }


    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0],
        })
    }

    handleOnchangeInput = (event, id) => {


        //good code
        let copyState = { ...this.state };

        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };

    handleOnchangeSelect = (event, id, name) => {

        let arrD = this.state.listMedicine;
        let list = arrD.filter(
            item => item.id === id
        )
        if (name === 'dosage') {

            let dosage = arrD.map(
                item => {
                    if (item.id === list[0].id) {
                        item.dosage = event.target.value;
                    }
                    return item;
                }
            )

            this.setState({
                listMedicine: dosage
            })

        } else {
            let frequency = arrD.map(
                item => {
                    if (item.id === list[0].id) {
                        item.frequency = event.target.value;
                    }
                    return item;
                }
            )

            this.setState({
                listMedicine: frequency
            })
        }


    };

    checkValidInput = () => {
        let isValid = true;
        let arrInput = [
            'namePatient', 'phoneNumber', 'email', 'birthday',
            'symptoms', 'diagnosis'
        ];
        for (let i = 0; i < arrInput.length; i++) {
            // console.log("check arr", arrInput[i]);
            if (!this.state[arrInput[i]]) {
                isValid = false;

                alert("Missing parameter: " + arrInput[i]);
                break;
            }
        }
        return isValid;
    };


    submitPrescription = async () => {
        let isValid = this.checkValidInput();
        if (isValid === true) {
            let { namePatient, patient, doctor,
                symptoms, diagnosis, listMedicine, date, dataBooking } = this.state;

            this.setState({
                isShowLoading: true,
            })

            let prescription = await createPrescriptionService({
                symptoms: symptoms,
                diagnosis: diagnosis,
                listMedicine: listMedicine,
                date: date,
                dataBooking: dataBooking

            })

            if (prescription.errCode === 0) {
                this.setState({
                    isShowLoading: false,
                })
                toast.success('Create prescription success');

                this.setState({
                    dataPrescription: prescription.data,
                    symptoms: '',
                    diagnosis: '',
                    listMedicine: '',

                    isShowModalPrescription: true,
                })
            } else {
                this.setState({
                    isShowLoading: false,
                })
                toast.error('Create prescription false')
            }


        }
    }

    togglePrescriptionModal = () => {
        this.setState({
            isShowModalPrescription: !this.state.isShowModalPrescription,

        });
        // emitter.emit("EVENT_CLEAR_MODAL_DATA");
    };

    onClickSeeAllPres = () => {
        this.setState({
            isShowAllPres: !this.state.isShowAllPres,
        })
    }

    render() {
        console.log('state arr', this.state);
        let language = this.props.language
        let { listMedicine, dosageArr, frequencyArr,
            dosage, frequency, infoPatient, infoDoctor,
            date, diagnosis, symptoms, allPres } = this.state;



        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));





        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading your content...'
                >

                    <ModalPrescription
                        isOpen={this.state.isShowModalPrescription}
                        toggleFromParent={this.togglePrescriptionModal}
                        dataPrescription={this.state.dataPrescription}

                    />


                    <ModalAllPres
                        isOpen={this.state.isShowAllPres}
                        toggleFromParent={this.onClickSeeAllPres}
                        dataAllPres={this.state.allPres}

                    />

                    <div className='prescription-container container'>
                        <div className='title-prescription'><FormattedMessage id="manage-prescription.title" /></div>
                        <div className='content-prescription'>
                            <div className='title-prescription-sub'><FormattedMessage id="manage-prescription.title-create" /></div>
                            <div className='body-prescription '>
                                <div className='row form-create-pres'>
                                    <div className='image-prescription'></div>
                                    <div className='name-prescription'><FormattedMessage id="manage-prescription.title-prescription" /></div>
                                    <div className='form-group col-6 my-3'>
                                        <label><FormattedMessage id="manage-prescription.name-patient" /></label>
                                        <div className='wrap-input'>
                                            <input type='text' className='form-control data-input'
                                                id="namePatient"
                                                value={this.state.namePatient} placeholder='Duy'
                                                onChange={(event) => this.handleOnchangeInput(event, 'namePatient')}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>
                                    <div className='form-group col-6 my-3'>
                                        <label><FormattedMessage id="manage-prescription.birthday" /></label>
                                        <div className='wrap-input'>

                                            <DatePicker
                                                onChange={this.handleOnChangeDatePicker}
                                                className="form-control data-input"
                                                value={this.state.birthday}
                                                maxDate={yesterday}
                                                placeholder='01/01/2000'

                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>

                                    <div className='form-group col-6 my-3'>
                                        <label><FormattedMessage id="manage-prescription.email" /></label>
                                        <div className='wrap-input'>
                                            <input type='text' className='form-control data-input'
                                                id="email"
                                                value={this.state.email} placeholder='Duy'
                                                onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>

                                    <div className='form-group col-6 my-3'>
                                        <label><FormattedMessage id="manage-prescription.phone" /></label>
                                        <div className='wrap-input'>
                                            <input type='text' className='form-control data-input'
                                                id="phoneNumber"
                                                value={this.state.phoneNumber} placeholder='Duy'
                                                onChange={(event) => this.handleOnchangeInput(event, 'phoneNumber')}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>

                                    <div className='form-group col-12 my-3'>
                                        <label><FormattedMessage id="manage-prescription.symptoms" /></label>
                                        <div className='wrap-input'>
                                            <input type='text' className='form-control data-input'
                                                id="symptoms"
                                                value={this.state.symptoms} placeholder='Duy'
                                                onChange={(event) => this.handleOnchangeInput(event, 'symptoms')}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>

                                    <div className='form-group col-12 my-3'>
                                        <label><FormattedMessage id="manage-prescription.diagnosis" /></label>
                                        <div className='wrap-input'>
                                            <input type='text' className='form-control data-input'
                                                id="diagnosis"
                                                value={this.state.diagnosis} placeholder='Duy'
                                                onChange={(event) => this.handleOnchangeInput(event, 'diagnosis')}
                                            />
                                            <span class="focus-input100"></span>
                                        </div>
                                    </div>




                                    <div className='list-medicine my-2'>
                                        <div><FormattedMessage id="manage-prescription.title-list-medicine" /></div>
                                        <table class="table table-hover table-striped table-bordered" style={{ textAlign: 'center' }}>
                                            <thead className="thead-dark " >
                                                <tr className="table-dark">
                                                    <th scope="col">#</th>
                                                    <th scope="col"><FormattedMessage id="manage-medicine.name" /></th>
                                                    <th scope="col"><FormattedMessage id="manage-medicine.dosage" /></th>
                                                    <th scope="col"><FormattedMessage id="manage-medicine.frequency" /></th>
                                                    <th scope="col"><FormattedMessage id="manage-medicine.action" /></th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listMedicine && listMedicine.length > 0 ?
                                                    listMedicine.map((item, index) => {
                                                        let a = this.state.chooseDosageArr;
                                                        let b = a.filter(
                                                            i => i.dosage.medicineId === item.id
                                                        )

                                                        let a1 = this.state.chooseFrequencyArr;
                                                        let b1 = a1.filter(
                                                            i => i.frequency.medicineId === item.id
                                                        )
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>
                                                                    <select id="dosage" class="form-select input-select"
                                                                        value={b.dosage}
                                                                        onChange={(event) => { this.handleOnchangeSelect(event, item.id, 'dosage') }}
                                                                    >
                                                                        {/* <option selected>Choose...</option> */}
                                                                        {dosageArr && dosageArr.length > 0
                                                                            && dosageArr.map((item, index) => {

                                                                                return (
                                                                                    <option key={index} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                                                                );
                                                                            })}


                                                                    </select>
                                                                </td>
                                                                <td>
                                                                    <select id="frequency" class="form-select input-select"
                                                                        value={b1.frequency}
                                                                        onChange={(event) => { this.handleOnchangeSelect(event, item.id, 'frequency') }}
                                                                    >
                                                                        {/* <option selected>Choose...</option> */}
                                                                        {frequencyArr && frequencyArr.length > 0
                                                                            && frequencyArr.map((item, index) => {

                                                                                return (
                                                                                    <option key={index} value={item.keyMap} >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                                                                );
                                                                            })}


                                                                    </select>
                                                                </td>
                                                                <td><button className='btn btn-danger' onClick={() => this.deleteDrug(item)}><FormattedMessage id="manage-prescription.delete-medicine" /></button></td>
                                                            </tr>
                                                        );
                                                    })
                                                    :
                                                    <tr>
                                                        <td colSpan={5}><FormattedMessage id="manage-prescription.not-data" /></td>
                                                    </tr>
                                                }

                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='col-12 my-4 text-center'>
                                        <div className='btn btn-primary btn-submit-pres mr-2' onClick={() => this.submitPrescription()}><FormattedMessage id="manage-prescription.btn-create-prescription" /></div>
                                        <div className='btn btn-warning btn-clean'><FormattedMessage id="manage-prescription.clean" /></div>
                                    </div>
                                </div>

                                {
                                    allPres && allPres.length > 0 &&

                                    <div className="see-pres my-2">
                                        <div className="btn btn-see-pres" onClick={() => { this.onClickSeeAllPres() }}>Xem toa thuoc truoc</div>
                                    </div>
                                }
                                <div className='row table-medicine '>
                                    <MedicineTable
                                        isShowManageMedicineParent={false}
                                        handleCreateMedicineParent={this.createDrug} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div >
                    <PDFDownloadLink document={<PDFFile />} fileName='FORM'>

                        {({ loading }) => (loading ? <button>Loading Doc ...</button> : <button>Download</button>)}
                    </PDFDownloadLink>

                </div> */}
                </LoadingOverlay  >

            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listDosage: state.admin.dosages,
        listFrequency: state.admin.frequencies,
        user: state.admin.user,
        language: state.app.language,
        allPresByPatient: state.admin.allPresByPatient,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUser: (id) => dispatch(actions.fetchUserStart(id)),
        getDosageStart: () => { dispatch(actions.fetchDosageStart()) },
        getFrequencyStart: () => { dispatch(actions.fetchFrequencyStart()) },
        fetchAllPrescriptionByPatient: (id) => { dispatch(actions.fetchAllPrescriptionByPatient(id)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrescriptionPatient));
