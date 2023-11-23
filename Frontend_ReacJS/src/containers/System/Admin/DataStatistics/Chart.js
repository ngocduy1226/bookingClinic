import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";

import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import './Chart.scss'
import { FormattedMessage } from 'react-intl';
import {
  getStatisticWeekService, getDetailClinicByIdService,
  getAllUsersService, getExtraDoctorInfoByIdService
} from "../../../../services/userService"
import ApexCharts from 'apexcharts';
import ReactApexChart from "react-apexcharts";
import DatePicker from "../../../../components/Input/DatePicker";
import Select from 'react-select';
import _ from 'lodash';
class Chart extends Component {

  constructor(prop) {
    super(prop);

    this.state = {
      currentDate: new Date(moment(new Date()).startOf('day').valueOf()).getTime(),
      series: [],
      options: {},
      listDoctors: [],
      listClinic: [],
      selectedDoctor: {},
      selectedClinic: {},

      checkClinic: false,
      doctor: {}
    };
  }


  async componentDidMount() {
    this.getStatistic();
    this.props.fetchAllDoctorsRedux();
    this.props.fetchAllClinic();
  }


  getStatistic = async () => {
    let { currentDate, selectedDoctor, selectedClinic } = this.state;
    let doctor = selectedDoctor.value ? selectedDoctor.value : 'ALL';
    let clinic = selectedClinic.value ? selectedClinic.value : 'ALL';
    if (this.props.user.roleId === 'R2') {
      doctor = this.props.user.id;
    }

    if (this.state.checkClinic === true) {
      let res = await getExtraDoctorInfoByIdService(this.props.user.id);
      if (res && res.errCode === 0) {
        this.setState({
          doctor: res.data,
        })
        clinic = res.data.clinicId;
        doctor = 'ALL'
      }
    }
    let formatedDate = new Date(currentDate).getTime();
    let resBook = await getStatisticWeekService({
      date: formatedDate,
      doctorId: doctor,
      clinicId: clinic,
    });

    if (resBook && resBook.dataBooking && resBook.errCode === 0) {
      let arrDate = [];
      let arrBook = [];
      let arrPres = [];
      for (let i = 0; i < resBook.dataBooking.length; i++) {
        let date = moment.unix(+ resBook.dataBooking[i].date / 1000).format('dddd - DD/MM/YYYY')
        arrDate.push(date);
        arrBook.push(resBook.dataBooking[i].total);
        arrPres.push(resBook.dataPres[i].count);
      }

      this.setState({
        series: [
          {
            name: "Lan dang ky kham - 2023",
            data: arrBook
          },
          {
            name: "Lan kham thuc te - 2023",
            data: arrPres
          }
        ],
        options: {
          chart: {
            height: 550,
            type: 'line',
            dropShadow: {
              enabled: true,
              color: '#000',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.2
            },
            toolbar: {
              show: false
            }
          },
          colors: ['#77B6EA', '#545454'],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Lan dang ky kham & Lan kham thuc te',
            align: 'left'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          markers: {
            size: 1
          },
          xaxis: {
            categories: arrDate,
            title: {
              text: 'Ngay'
            }
          },
          yaxis: {
            title: {
              text: 'So lan'
            },
            min: 0,
            max: 100
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
          },
          theme: {
            mode: 'light',
            palette: 'palette1',
            monochrome: {
              enabled: false,
              color: '#255aee',
              shadeTo: 'light',
              shadeIntensity: 0.65
            },
          },
        }
      })
    }
  }

  handleOnChangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    }, async () => {
      await this.getStatistic();
    })
  }
  buildDataInputSelect = (inputData, id) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      if (id === 'DOCTOR') {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.label = language === language.EN ? labelEn : labelVi;
          object.value = item.id;
          result.push(object);
        })
      } else if (id === 'CLINIC') {
        inputData.map((item, index) => {
          let object = {};
          let label = `${item.name}`;
          object.label = label;
          object.value = item.id;
          result.push(object);
        })

      }
    }
    return result;

  }


  handleChangeSelectDoctor = async (selectedDoctor) => {
    this.setState({ selectedDoctor: selectedDoctor }, async () => {
      await this.getStatistic();
      console.log(`Option selected doctor:`, this.state.selectedDoctor)
    });

  };

  handleChangeSelectClinic = async (selectedClinic) => {
    this.setState({
      selectedClinic: selectedClinic,
      selectedDoctor: {},
    }, async () => {
      await this.getStatistic();

      let resDetailClinic = await getDetailClinicByIdService({
        id: selectedClinic.value,
      });

      if (resDetailClinic && resDetailClinic.errCode === 0) {
        let arrDoctorId = [];
        let data = resDetailClinic.data

        if (data && !_.isEmpty(data)) {
          let arr = data.doctorClinic;
          if (arr && arr.length > 0) {
            arr.map(item => {
              arrDoctorId.push(item.doctorId)
            })
          }
        }

        let listDoctors = [];
        for (let i = 0; i < arrDoctorId.length; i++) {
          let doctor = await getAllUsersService(arrDoctorId[i]);
          listDoctors.push(doctor.users);
        }

        let dataSelect = this.buildDataInputSelect(listDoctors, 'DOCTOR')
        this.setState({
          listDoctors: dataSelect
        })
      }

      console.log(`Option selected clinic: `, this.state.selectedClinic)
    });

  };

  async componentDidUpdate(prevProps, prevState, snapchot) {
    if (prevProps.language !== this.props.language) {

    }

    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'DOCTOR')
      this.setState({
        listDoctors: dataSelect
      })
    }

    if (prevProps.allClinic !== this.props.allClinic) {
      let dataSelect = this.buildDataInputSelect(this.props.allClinic, 'CLINIC')
      this.setState({
        listClinic: dataSelect,
      })
    }



  }

  onClickClinic = () => {
    this.setState({
      checkClinic: !this.state.checkClinic,
    }, async () => {
      await this.getStatistic();
    });
  }



  render() {
    console.log('state char', this.state)
    let { checkClinic } = this.state;
    let { user } = this.props
    return (

      <div className='chart-container'>
        <div className="option-statistic my-4 row ">
          <div className='manage-patient-date form-group col-4'>
            <label><FormattedMessage id="manage-patient.choose-date" /></label>
            <DatePicker
              onChange={this.handleOnChangeDatePicker}
              className="form-control"
              value={this.state.currentDate}
            />
          </div>
          {user && user.roleId === 'R1' &&
            <>
              <div className='manage-patient-doctor form-group col-4 '>
                <label><FormattedMessage id="manage-patient.choose-doctor" /></label>
                <Select
                  value={this.state.selectedDoctor}
                  onChange={this.handleChangeSelectDoctor}
                  options={this.state.listDoctors}
                  placeholder={<FormattedMessage id="manage-doctor.choose-doctor" />}
                />
              </div>

              <div className='manage-patient-doctor form-group col-4 '>
                <label><FormattedMessage id="manage-patient.choose-clinic" /></label>
                <Select
                  value={this.state.selectedClinic}
                  onChange={this.handleChangeSelectClinic}
                  options={this.state.listClinic}
                  placeholder={<FormattedMessage id="manage-doctor.choose-doctor" />}
                />
              </div>
            </>
          }

          {user && user.roleId === 'R2' &&
            <div className='manage-patient-doctor form-group col-4 text-center'>
              <div style={{ marginTop: '13px' }} className={checkClinic === false ? 'btn btn-primary btn-see-clinic' : 'btn btn-warning'} onClick={this.onClickClinic}>

                {checkClinic === false ?
                  <>
                    <span><FormattedMessage id="manage-statistic.check-clinic" /></span>
                    <span><i className='fas fa-eye m-2'></i></span>
                  </>
                  :
                  <>
                    <span><FormattedMessage id="manage-statistic.uncheck-clinic" /></span>
                    <span><i className='far fa-eye-slash m-2'></i></span>
                  </>}

              </div>

            </div>
          }

        </div>
        <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={550} />
      </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    allDoctors: state.admin.allDoctors,
    allClinic: state.admin.allClinic,
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
    fetchAllClinic: () => dispatch(actions.fetchAllClinic()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chart));
