import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { withRouter } from "react-router";




class Chat extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
           
        };
    }

    componentDidMount() {
      (function(d, m){
            var kommunicateSettings = {"appId":"1490888b5646d37f7dc286dd0f4fc9086","popupWidget":true,"automaticChatOpenOnNavigation":true};
            var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
            s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
            var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
            window.kommunicate = m; m._globals = kommunicateSettings;
          })(document, window.kommunicate || {});
    }
     
    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

      

    }
     

    
    
    render() {
        
    


        return (
            <div></div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));