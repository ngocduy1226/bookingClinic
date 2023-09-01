import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import  HomeHeader from './homeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './homePage.scss';
import OutStandingDoctor from './Section/OutStandingDoctor';
import HandBook from './Section/HandBook';
import About from './Section/About'
import HomeFooter from './Section/HomeFooter';

class HomePage extends Component {

    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
          };

        return (
            <div>
                <HomeHeader/>
                <Specialty settings = {settings} />
                <MedicalFacility settings = {settings} />
                <OutStandingDoctor settings= {settings} />
                <HandBook settings = {settings} />
                <About />
                <HomeFooter />
                <div style={{height: '300px'}} ></div>
             
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
