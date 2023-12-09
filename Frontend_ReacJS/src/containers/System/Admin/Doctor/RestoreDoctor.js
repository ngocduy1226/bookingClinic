import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import "./TableDoctor.scss";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";

import * as ReactDOM from "react-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import ModalDoctor from "./ModalDoctor";
import { emitter } from "../../../../utils/emitter";
import _ from "lodash";
import Pagination from "../../../Pagination/Pagination";

class RestoreDoctor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usersRedux: [],
			isOpenModalUser: false,
			userEdit: [],

			currentPage: 1,
			recordPerPage: 5,
			records: [],
			nPages: 1,
			numbers: []
		};
	}

	componentDidMount() {
		this.props.fetchUserRedux(+1);

		this.getRecord(this.state.currentPage);
	}

	/** Life cycle
	 * Run component
	 *1. init state
	 *2. mount(set state) /unmount
	 *3. render
	 */

	componentDidUpdate(prevProps, prevState, snapchot) {
		if (prevProps.listUsers !== this.props.listUsers) {
                 
			this.setState({
				usersRedux: this.props.listUsers,
			}, () => {
				this.getRecord(this.state.currentPage);
			});

			

		}
	}

	handleRestoreUser = (user) => {
		// eslint-disable-next-line no-restricted-globals
		if (confirm("Bạn có chắc chắn muốn khôi phục người dùng!")) {
			 this.props.restoreUserRedux(user.id);
		    } 

	};


	 handleOnchangeSearch = async (event) => {
		let lowerCase = event.target.value;
	
		await this.props.fetchUserRedux(+1);
		let listDoctor = this.state.usersRedux;
		let data = listDoctor.filter((item) => {
			if (lowerCase === '') {
				return;
			} else {
				return item && item.firstName.toLowerCase().includes(lowerCase);
			}
		})

		if (!_.isEmpty(data)) {
			this.setState({
				usersRedux: data
			}, () => {
				this.getRecord(this.state.currentPage);
			})
		}

	}

	getRecord = (currentPage) => {
		let arrUsers = this.state.usersRedux;
		let { recordPerPage } = this.state;

		let lastIndex = currentPage * recordPerPage;
		let firstIndex = lastIndex - recordPerPage;
		let records = arrUsers.slice(firstIndex, lastIndex);
		let nPages = Math.ceil(arrUsers.length / recordPerPage);
		let numbers = [...Array(nPages + 1).keys()].slice(1);
		this.setState({
			records: records,
			nPages: nPages,
			numbers: numbers,
		})
	}

	render() {

		let arrUsers = this.state.usersRedux;
		console.log('state', this.state);

		let { records, nPages, currentPage, numbers } = this.state;
		return (
			<div className="user-container container">
				<div className="title-user">
				<FormattedMessage id="manage-doctor.title-doctor" />
				</div>
				<div className="user-content">
					<div className="title-content">
					<FormattedMessage id="manage-doctor.title-list-restore-doctor" />
					</div>
					

					<div className="col-6"></div>
					<div className='col-6 search-medicine m-4 float-right'>
						<label><FormattedMessage id="manage-doctor.search-doctor" /></label>
						<input className='form-control'
							placeholder='search'
							onChange={(event) => this.handleOnchangeSearch(event)}
						/>
					</div>


					<div className="user-table m-4">
						<table className="table table-hover table-striped table-bordered">
							<thead className="thead-dark ">
								<tr className="table-dark">
									<th scope="col">#</th>
									<th scope="col"><FormattedMessage id="manage-user.email" /></th>
									<th scope="col"><FormattedMessage id="manage-user.first-name" /></th>
									<th scope="col"><FormattedMessage id="manage-user.last-name" /></th>
									<th scope="col"><FormattedMessage id="manage-user.phone" /></th>
									<th scope="col"><FormattedMessage id="manage-user.address" /></th>
									<th scope="col"><FormattedMessage id="manage-user.gender" /></th>
									<th scope="col"><FormattedMessage id="manage-user.position" /></th>
									<th scope="col"><FormattedMessage id="manage-user.action" /></th>
								</tr>
							</thead>
							<tbody>
								{records &&
									records.length > 0 ?
									records.map((item, index) => {
										return (
											<tr key={index}>
												<th scope="row">{index + 1}</th>
												<td>{item.email}</td>
												<td>{item.firstName}</td>
												<td>{item.lastName}</td>
												<td>{item.phoneNumber}</td>
												<td>{item.address}</td>

												{
													item.genderData && item.genderData.valueVi ? <td>
														{item.genderData.valueVi}
													</td>
														:
														<td></td>
												}
												{
													item.positionData && item.positionData.valueVi ? <td>
														{item.positionData.valueVi}
													</td>
														:
														<td></td>
												}

												<td>
													
													<button
														className="btn btn-delete"
													
                                                                                    onClick={() => this.handleRestoreUser(item)}
													>
                                                                                    <i class="fas fa-window-restore"></i>
                                                                                
													</button>
												</td>
											</tr>
										);
									})
                                                :
                                                <tr>
                                                      <td colSpan={9} ><FormattedMessage id="manage-user.not-data" /></td>
                                                </tr>
                                                }
							</tbody>
						</table>

						<Pagination
							currentPage={currentPage}
							numbers={numbers}
							getRecordParent={this.getRecord}
							nPages={nPages}
						/>
					</div>




				</div>


			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		listUsers: state.admin.allDoctors,
		language: state.app.language,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {

		fetchUserRedux: (data) => dispatch(actions.fetchAllDoctors(data)),
		restoreUserRedux: (id) => dispatch(actions.restoreUser(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RestoreDoctor);
