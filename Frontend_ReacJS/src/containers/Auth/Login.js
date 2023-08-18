import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";

import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";



class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        isShowPasssword: false,
        errMessage: '',
    }
  }

  handleOnChangerUsername = (event) => {
  //  console.log(event.target.value);
    this.setState({
        username: event.target.value,
    })
  }

  handleOnChangerPassword = (event) => {
   // console.log(event.target.value);
    this.setState({
        password: event.target.value,
    })
  }

  handleLogin = async () =>{
    //  console.log("username", this.state.username, "pass", this.state.password);
    //  console.log("all", this.state);
  
    this.setState({
      errMessage: ''
    })

      try{
         const data =  await handleLoginApi(this.state.username, this.state.password);
        // console.log(data);
        //login failed
        if(data && data.errCode != 0){
          this.setState({
            errMessage: data.message
          })
        }
        //login successful
        if(data && data.errCode === 0) {
             this.props.userLoginSuccess(data.user);
             console.log('login success');
             
        }
        }catch(error) {
          if(error.response){
            if(error.response.data){
               this.setState({
            errMessage: error.response.data.message,
          })
            }
          }
         // console.log('hih', error.response);

          
      }
    
  }

   handleShowHidePassword = () => {
    this.setState({
        isShowPasssword: !this.state.isShowPasssword,
    })
   }

  render() {
    return (
    <div className="login-background"> 
      <div className="login-container">
            <div className="login-content row">
                 <div className="col-12 text-center py-2 text-login">
                    Login
                   
                 </div>
                 <div className="col-12 form-group my-3">
                    <label className="fs-5">UserName</label>
                    <input type="text" className="form-control" placeholder="Enter Email" value={this.state.username} onChange={ (event) => this.handleOnChangerUsername(event)}/>
                   
                 </div>
                 <div className="col-12 form-group my-3">
                    <label className="fs-5">Password</label>
                    <div className="custom-input-password">
                         <input type={this.state.isShowPasssword ? 'text': 'password'} className="form-control" placeholder="Enter password" value={this.state.password} onChange={ (event)=> {this.handleOnChangerPassword(event)}}/>
                        <span onClick={ () => {this.handleShowHidePassword()}}
                        > 
                           <i class={this.state.isShowPasssword ? "fas fa-eye" : "far fa-eye-slash "}></i> 
                           </span>  
                    </div>

                 </div>

                  <div className="col-12" style={{color:'red'}}>
                      {this.state.errMessage}
                  </div>

                 <div className="my-3">
                     <button className="btn-login text-white" onClick={ ()=> { this.handleLogin()}}>Login</button>
                 </div>
                
                 <div className="col-12 mb-5">
                    <span className="fs-6 ">Forgot your password</span>
                 </div>
                 <div className="col-12 text-login-with text-center my-3">
                    <span >Or Login with</span>
                    
                 </div>
                 <div className="col-12 social-login">
                    <i class="fab fa-google-plus-g google"></i> 
                    <i class="fab fa-facebook-f facebook"></i> 
                    <i class="fab fa-twitter twitter"></i>
                    
                 </div>
            </div>
      </div>
  </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    // adminLoginSuccess: (adminInfo) =>
    //   dispatch(actions.adminLoginSuccess(adminInfo)),

    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
