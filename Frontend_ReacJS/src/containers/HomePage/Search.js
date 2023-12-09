import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './Search.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../utils";
import * as actions from "../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getProfileDoctorInfoByIdService } from "../../services/userService"
import { FormattedMessage } from 'react-intl';
import HomeHeader from './homeHeader';
import Doctor from '../Patienty/Doctor/Doctor';
import Specialty from '../Patienty/Specialty/Specialty';
import Clinic from '../Patienty/Clinic/Clinic';
import _ from 'lodash';



class Search extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
            allDoctors: [],
            listInfoDoctor: [],
            arrSpecialty: [],
            allClinic: [],
            isLoading: true,

            isShowDoctor: true,
            isShowSpecialty: true,
            isShowClinic: true,

        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors(+0);
        this.props.fetchAllSpecialty(+0);
        this.props.fetchAllClinic(+0);
    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.allDoctors !== this.props.allDoctors) {
            this.setState({
                allDoctors: this.props.allDoctors,
                isLoading: false,
            })
            this.getListInfoDoctor();

        }
        if (prevProps.allSpecialty !== this.props.allSpecialty) {


            this.setState({
                arrSpecialty: this.props.allSpecialty,
                isLoading: false,
            })
        }

        if (prevProps.allClinic !== this.props.allClinic) {


            this.setState({
                allClinic: this.props.allClinic,
                isLoading: false,

            })
            this.props.fetchAllClinic(+0);

        }

    }


    getListInfoDoctor = async () => {
        let listInfoDoctor = [];
        let arrDoctors = this.props.allDoctors;

        for (let i = 0; i < arrDoctors.length; i++) {
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

    onClickSelect = (event) => {
        console.log('event', event.target.value);
        let option = event.target.value;

        if (option === '1') {
            this.setState({
                isShowDoctor: true,
                isShowSpecialty: false,
                isShowClinic: false,
            })
            this.getListInfoDoctor();
        }
        if (option === '2') {
            this.setState({
                isShowSpecialty: true,
                isShowDoctor: false,
                isShowClinic: false,
            })
            this.props.fetchAllSpecialty(+0);
        }
        if (option === '3') {
            this.setState({
                isShowClinic: true,
                isShowDoctor: false,
                isShowSpecialty: false,
            })
            this.props.fetchAllClinic(+0);
        }
        if (option === '0') {
            this.setState({
                isShowDoctor: true,
                isShowSpecialty: true,
                isShowClinic: true,
            })
            this.props.fetchAllDoctors(+0);
            this.props.fetchAllSpecialty(+0);
            this.props.fetchAllClinic(+0);
        }
    }

    onChangeInputSearch = (event) => {
        console.log('event', event.target.value.toLowerCase());
        let lowerCase = event.target.value;

        let listInfoDoctor = this.state.listInfoDoctor;
        let dataDoctor = listInfoDoctor.filter((item) => {

            if (lowerCase === '') {
                return;
            } else {
                return item && item.firstName.toLowerCase().includes(lowerCase);

            }
        })

        if (!_.isEmpty(dataDoctor)) {
            this.setState({
                listInfoDoctor: dataDoctor
            })
        } else {
            this.props.fetchAllDoctors(+0);
            this.getListInfoDoctor();
        }

        let arrSpecialty = this.state.arrSpecialty;
        let dataSpecialty = arrSpecialty.filter((item) => {

            if (lowerCase === '') {
                return;
            } else {
                return item && item.name.toLowerCase().includes(lowerCase);

            }
        })

        if (!_.isEmpty(dataSpecialty)) {
            this.setState({
                arrSpecialty: dataSpecialty
            })
        } else {
            this.props.fetchAllSpecialty(+0);
        }

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

        let { listInfoDoctor, arrSpecialty, allClinic, isShowAll,
            isShowDoctor, isShowSpecialty, isShowClinic, isLoading } = this.state;

        console.log('state', this.state);
        return (
            <>
                <HomeHeader />
                <div className='search-container container'>

                    <div className='key-search input-group' >
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Tìm kiếm ..."
                            onChange={(event) => this.onChangeInputSearch(event)} />

                        <select id="select" name="select"
                            onChange={(event) => { this.onClickSelect(event) }}
                            className=" select-option">
                            {/* <option selected>Choose...</option> */}
                            <option value="0">Tất cả</option>
                            <option value="1">Bác sĩ</option>
                            <option value="2">Chuyên khoa</option>
                            <option value="3">Cơ sở y tế</option>
                        </select>

                    </div>

                    <div className='content-search '>

                        <>
                            {isShowDoctor && isShowDoctor === true &&
                                <Doctor listInfoDoctor={listInfoDoctor} />
                            }
                            {isShowSpecialty && isShowSpecialty === true &&
                                <Specialty listSpecialty={arrSpecialty} />
                            }

                            {isShowClinic && isShowClinic === true &&
                                <Clinic allClinic={allClinic} />
                            }


                        </>


                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        allSpecialty: state.admin.allSpecialty,
        allClinic: state.admin.allClinic,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinic: (data) => dispatch(actions.fetchAllClinic(data)),
        fetchAllSpecialty: (data) => dispatch(actions.fetchAllSpecialty(data)),
        fetchAllDoctors: (data) => dispatch(actions.fetchAllDoctors(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));
