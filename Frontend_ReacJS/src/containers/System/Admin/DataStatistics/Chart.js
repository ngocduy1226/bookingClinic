import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";

import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import './Chart.scss'
import { FormattedMessage } from 'react-intl';
import { getStatisticDayService } from "../../../../services/userService"
import ApexCharts from 'apexcharts';
import ReactApexChart from "react-apexcharts";

class Chart extends Component {

  constructor(prop) {
    super(prop);

    this.state = {

      series: [],
      options: {

      },


    };
  }


  async componentDidMount() {
    let resBook = await getStatisticDayService();

    let arrDate = [];
    let arrBook = [];
    let arrPres = [];
    for (let i = 0; i < resBook.dataBooking.length; i++) {
      let date = moment.unix(+ resBook.dataBooking[i].date / 1000).format('dddd - DD/MM/YYYY')
      arrDate.push(date);
      arrBook.push(resBook.dataBooking[i].total);
    }

    for (let i = 0; i < resBook.dataPres.length; i++) {

      arrPres.push(resBook.dataPres[i].total);
    }

    if (resBook && resBook.errCode === 0) {
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

  async componentDidUpdate(prevProps, prevState, snapchot) {
    if (prevProps.language !== this.props.language) {

    }

    // if (prevProps.doctorIdParent !== this.props.doctorIdParent) {
    //     let allDays = this.getDaySchedule(this.props.language);
    //     let resBook = await getBookingModalByDateService(this.props.doctorIdParent, allDays[0].value);
    //     this.setState({
    //         allTimes: resBook.data ? resBook.data : [],

    //     })
    // }

  }




  render() {

    return (
      <div className='chart-container'>
        <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={550} />
      </div>

    );
  }

}

const mapStateToProps = state => {
  return {

    language: state.app.language,
  };
};

const mapDispatchToProps = dispatch => {
  return {


  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chart));
