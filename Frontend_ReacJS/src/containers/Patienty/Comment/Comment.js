import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './Comment.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { createNewCommentService } from "../../../services/commentService";
import { FormattedMessage } from 'react-intl';


class Comment extends Component {


      constructor(prop) {
            super(prop);
            this.state = {
                  comment: '',
                  email: '',
                  doctorId: '',
                  listComment: '',
            };
      }

      async componentDidMount() {
            let doctorId = this.props.doctorIdParent
            this.setState({
                  doctorId: doctorId,

            })

      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            if (prevProps.doctorIdParent !== this.props.doctorIdParent) {
                  let doctorId = this.props.doctorIdParent
                  this.setState({
                        doctorId: doctorId,

                  }, () => {
                        this.props.fetchAllCommentByDoctorIdService({
                              doctorId: doctorId,
                              status: 'S2',
                        })
                  })
            }

            if (prevProps.comments !== this.props.comments) {
                  let comments = this.props.comments
                  this.setState({
                        listComment: comments,

                  })
            }

      }

      handleOnchangeInput = (event, id) => {
            let valueDate = event.target.value;
            let copyValue = { ...this.state };
            copyValue[id] = valueDate;
            this.setState({
                  ...copyValue,
            })
      }


      checkValidInput = () => {
            let isValid = true;
            let arrInput = [
                  'email', 'comment',
            ];
            for (let i = 0; i < arrInput.length; i++) {
                  console.log("check arr", arrInput[i]);
                  if (!this.state[arrInput[i]]) {
                        isValid = false;

                        alert("Missing parameter: " + arrInput[i]);
                        break;
                  }
            }
            return isValid;
      };

      onClickSubmitComment = async () => {
            let time = new Date().getTime();
            let date  = new Date(moment(new Date()).startOf('day').valueOf()).getTime();
            console.log('date', date);
            let isValid = this.checkValidInput();
            if (isValid === true) {
                  let res = await createNewCommentService({
                        doctorId: this.state.doctorId,
                        email: this.state.email,
                        comment: this.state.comment,
                        date: date,
                        time: time,
                  })
                  //   console.log('res comment', res);
                  if (res && res.errCode === 0) {
                        this.setState({
                              email: '',
                              comment: '',
                        })
                  }
            }
      }

      render() {
            console.log('state comment', this.state);
            let { listComment } = this.state;
            return (
                  <>
                        <div className='patient-comment-container'>
                              <div className='title-comment container'>
                                    <span ><i class="fas fa-comments mr-2"></i></span>
                                    <span className='px-2'><FormattedMessage id="patient.comment.title"/></span>
                              </div>
                              <section className='list-comment'>
                                    <div class="container py-5 text-dark">
                                          <div class="row d-flex ">
                                                <div class="col-md-11 col-lg-9 col-xl-7">
                                                      {listComment && listComment.length > 0 ?
                                                            listComment.map((item, index) => {
                                                                  item.userCommentData.image = item.userCommentData.image
                                                                        ? item.userCommentData.image : `https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg`
                                                                  let name = item.userCommentData.lastName && item.userCommentData.firstName
                                                                        ? `${item.userCommentData.lastName} ${item.userCommentData.firstName}` 
                                                                        : `Người dùng`

                                                                  return (
                                                                        <div class="d-flex flex-start mb-4" key={index}>

                                                                              <div className='rounded-circle shadow-1-strong me-3 avatar'
                                                                                    style={{ backgroundImage: `url(${item.userCommentData.image} )` }}
                                                                              >  </div>
                                                                              <div class="card w-100">
                                                                                    <div class="card-body p-4">
                                                                                          <div class="">
                                                                                                <h5>{name}</h5>
                                                                                                <p class="small">{item.different}</p>
                                                                                                <p>
                                                                                                      {item.content}
                                                                                                </p>

                                                                                                <div class="d-flex justify-content-between align-items-center patient-like">
                                                                                                      <div class="d-flex align-items-center">
                                                                                                            <a href="#!" class="link-muted me-2"><i class="fas fa-thumbs-up me-1" style={{color: 'blue'}}></i>132</a>
                                                                                                            <a href="#!" class="link-muted"><i class="fas fa-thumbs-down me-1"></i>15</a>
                                                                                                      </div>
                                                                                                      <a href="#!" class="link-muted"><i class="fas fa-reply me-1"></i> Reply</a>
                                                                                                </div>
                                                                                          </div>
                                                                                    </div>
                                                                              </div>

                                                                        </div>
                                                                  );
                                                            })
                                                            :
                                                            <div className='not-comment'> <FormattedMessage id="patient.comment.not-comment"/></div>
                                                      }


                                                </div>

                                          </div>
                                    </div>
                              </section>

                              <section className='patient-comment' >
                                    <div class="container mb-5 text-dark">
                                          <div class="row d-flex ">
                                                <div class="col-md-11 col-lg-9 col-xl-7">

                                                      <div class="d-flex flex-start w-100">
                                                            <div className='rounded-circle shadow-1-strong me-3 avatar-user'
                                                                  style={{ backgroundImage: `url(https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg )` }}
                                                            >  </div>
                                                            <div class="w-100">
                                                                  <h5><FormattedMessage id="patient.comment.add-comment-title"/><i class="fas fa-comment-dots mx-2"></i></h5>
                                                                  <ul class="rating mb-3" >
                                                                        <li>
                                                                              <i class="far fa-star fa-sm text-danger" title="Bad"></i>
                                                                        </li>
                                                                        <li>
                                                                              <i class="far fa-star fa-sm text-danger" title="Poor"></i>
                                                                        </li>
                                                                        <li>
                                                                              <i class="far fa-star fa-sm text-danger" title="OK"></i>
                                                                        </li>
                                                                        <li>
                                                                              <i class="far fa-star fa-sm text-danger" title="Good"></i>
                                                                        </li>
                                                                        <li>
                                                                              <i class="far fa-star fa-sm text-danger" title="Excellent"></i>
                                                                        </li>
                                                                  </ul>

                                                                  <div className='form-group '>

                                                                        <div className='wrap-input'>
                                                                              <input className='form-control data-input'
                                                                                    placeholder='Email'
                                                                                    value={this.state.email}
                                                                                    onChange={(event) => { this.handleOnchangeInput(event, 'email') }} />
                                                                              <span class="focus-input100"></span>
                                                                        </div>

                                                                  </div>
                                                                  <div class="form-outline wrap-input mt-3">
                                                                        <textarea class="form-control data-comment"
                                                                              id="textAreaExample" placeholder='Bình luận' rows="4"
                                                                              value={this.state.comment}
                                                                              onChange={(event) => { this.handleOnchangeInput(event, 'comment') }}
                                                                        ></textarea>
                                                                        <span class="focus-input100"></span>
                                                                  </div>
                                                                  <div class="d-flex mt-3 btn-comment">

                                                                        <button type="button" class="btn  btn-submit" onClick={() => this.onClickSubmitComment()}>
                                                                        <FormattedMessage id="patient.comment.add-comment"/>
                                                                        <i class="fas fa-long-arrow-alt-right mx-1"></i>
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                      </div>


                                                </div>
                                          </div>
                                    </div>
                              </section>
                        </div>
                  </>
            );
      }

}

const mapStateToProps = state => {
      return {
            comments: state.admin.commentDoctors,
            language: state.app.language,
      };
};

const mapDispatchToProps = dispatch => {
      return {
            fetchAllCommentByDoctorIdService: (data) => { dispatch(actions.fetchAllCommentByDoctorIdService(data)) },
      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Comment));
