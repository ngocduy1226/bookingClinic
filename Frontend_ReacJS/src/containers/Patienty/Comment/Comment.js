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
import { getCommentByDateService } from "../../../services/userService"
import { FormattedMessage } from 'react-intl';



class Comment extends Component {


      constructor(prop) {
            super(prop);
            this.state = {

            };
      }

      componentDidMount() {

      }

      async componentDidUpdate(prevProps, prevState, snapchot) {
            if (prevProps.language !== this.props.language) {

            }

            // if (prevProps.doctorIdParent !== this.props.doctorIdParent) {
            //     let allDays = this.getDaySchedule(this.props.language);
            //     let res = await getBookingModalByDateService(this.props.doctorIdParent, allDays[0].value);
            //     this.setState({
            //         allTimes: res.data ? res.data : [],

            //     })
            // }

      }




      render() {


            return (
                  <>
                        <div className='patient-comment-container'>
                              <div className='title-comment container'>Binh luan</div>
                              <section className='list-comment'>
                                    <div class="container py-5 text-dark">
                                          <div class="row d-flex ">
                                                <div class="col-md-11 col-lg-9 col-xl-7">
                                                      <div class="d-flex flex-start mb-4">
                                                            <img class="rounded-circle shadow-1-strong me-3"
                                                                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp" alt="avatar" width="65"
                                                                  height="65" />
                                                            <div class="card w-100">
                                                                  <div class="card-body p-4">
                                                                        <div class="">
                                                                              <h5>Johny Cash</h5>
                                                                              <p class="small">3 hours ago</p>
                                                                              <p>
                                                                                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                                                                                    ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus
                                                                                    viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
                                                                                    Donec lacinia congue felis in faucibus ras purus odio, vestibulum in
                                                                                    vulputate at, tempus viverra turpis.
                                                                              </p>

                                                                              <div class="d-flex justify-content-between align-items-center patient-like">
                                                                                    <div class="d-flex align-items-center">
                                                                                          <a href="#!" class="link-muted me-2"><i class="fas fa-thumbs-up me-1"></i>132</a>
                                                                                          <a href="#!" class="link-muted"><i class="fas fa-thumbs-down me-1"></i>15</a>
                                                                                    </div>
                                                                                    <a href="#!" class="link-muted"><i class="fas fa-reply me-1"></i> Reply</a>
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      <div class="d-flex flex-start">
                                                            <img class="rounded-circle shadow-1-strong me-3"
                                                                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(31).webp" alt="avatar" width="65"
                                                                  height="65" />
                                                            <div class="card w-100">
                                                                  <div class="card-body p-4">
                                                                        <div class="">
                                                                              <h5>Mindy Campbell</h5>
                                                                              <p class="small">5 hours ago</p>
                                                                              <p>
                                                                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus
                                                                                    cumque doloribus dolorum dolor repellat nemo animi at iure autem fuga
                                                                                    cupiditate architecto ut quam provident neque, inventore nisi eos quas?
                                                                              </p>

                                                                              <div class="d-flex justify-content-between align-items-center">
                                                                                    <div class="d-flex align-items-center">
                                                                                          <a href="#!" class="link-muted me-2"><i class="fas fa-thumbs-up me-1"></i>158</a>
                                                                                          <a href="#!" class="link-muted"><i class="fas fa-thumbs-down me-1"></i>13</a>
                                                                                    </div>
                                                                                    <a href="#!" class="link-muted"><i class="fas fa-reply me-1"></i> Reply</a>
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </section>

                              <section className='patient-comment' >
                                    <div class="container my-5 py-5 text-dark">
                                          <div class="row d-flex ">
                                                <div class="col-md-10 col-lg-8 col-xl-6">
                                                      <div class="">
                                                            <div class="">
                                                                  <div class="d-flex flex-start w-100">
                                                                        <img class="rounded-circle shadow-1-strong me-3"
                                                                              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp" alt="avatar" width="65"
                                                                              height="65" />
                                                                        <div class="w-100">
                                                                              <h5>Add a comment</h5>
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
                                                                              <div class="form-outline">
                                                                                    <textarea class="form-control" id="textAreaExample" rows="4"></textarea>
                                                                                    <label class="form-label" for="textAreaExample">What is your view?</label>
                                                                              </div>
                                                                              <div class="d-flex justify-content-between mt-3">
                                                                                    <button type="button" class="btn btn-success">Danger</button>
                                                                                    <button type="button" class="btn btn-danger">
                                                                                          Send <i class="fas fa-long-arrow-alt-right ms-1"></i>
                                                                                    </button>
                                                                              </div>
                                                                        </div>
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

            language: state.app.language,
      };
};

const mapDispatchToProps = dispatch => {
      return {


      };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Comment));
