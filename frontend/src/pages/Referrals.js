import React, { Component } from 'react';

import Modal from '../components/modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Patients.css';
import AuthContext from '../context/auth-context';
import PatientList from '../components/Patients/PatientList/PatientList';
import Spinner from '../components/Spinner/Spinner';
import helpers from '../helpers/helpers';
import PatientItem from '../components/Patients/PatientItem/PatientItem';
import PatientDetails from '../components/Patients/PatientDetails/PatientDetails';
import ReferralList from '../components/Referrals/ReferralsList/ReferralsList';
import PatientSearch from '../components/Patients/PatientSearch/PatientSearch';

class ReferralsPage extends Component {
	state = {
		creating: false,
		referrals: [],
		patients: [],
		events: [],
		users: [],
		isLoading: false,
		selectedPatient: null,
		selectedReferral: null,
	};

	isActive = true;
	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.patientElRef = React.createRef();
		this.refereeElRef = React.createRef();
		this.toothNumberElRef = React.createRef();
	}

	componentDidMount() {
		if (this.props.location&&this.props.location.state){
			this.setState({selectedPatient: this.props.location.state.selectedPatient});
		}
		this.fetchUsers();
		this.fetchPatients();
		this.fetchReferrals();
	};

	componentWillUnmount() {
		this.isActive = false;
	}

	startCreatePatientHandler = () => {
		this.setState({ creating: true });
	};

	modalConfirmHandler = async () => {
		let dataIsValid = true;
		const refereeId = this.refereeElRef.current.value;
		const toothNumber = this.toothNumberElRef.current.value;
		if (!this.state.selectedPatient||!refereeId||!toothNumber){
			alert("Incomplete Data!");
			return;
		}
		const patientId = this.state.selectedPatient._id;
		
		this.setState({ creating: false, selectedPatient: null});

		const formData = {
			refereeId: refereeId,
			patientId: patientId,
			toothNumber: +toothNumber,
		};
		console.log(formData);

		const requestBody = {
			query: `
				mutation CreateReferral ($patientId: ID!, $refereeId: ID!, $toothNumber: Int!){
					createReferral (patientId: $patientId, refereeId: $refereeId, toothNumber: $toothNumber){
						_id
						toothNumber
						patient {
							firstName
							lastName
							dateOfBirth
						}
						referrer {
							email
						}
						createdAt
					}
				}
			`,
			variables: formData,
		};

		try {
			const resData = await helpers.queryAPI(requestBody, this.context);
			this.setState(prevState => {
				const updatedReferrals = [...prevState.referrals];
				updatedReferrals.push({
					...resData.data.createReferral,
				});
				return { referrals: updatedReferrals };
			});
		} catch (err) {
			console.log(err);
		}
	};

	modalCancelHandler = () => {
		this.setState({ creating: false, selectedPatient: null });
	}

	showDetailHandler = (eventId) => {
		this.setState(prevState => {
			const selectedPatient = prevState.events.find(e => e._id === eventId);
			return { selectedPatient: selectedPatient };
		});
	}

	fetchReferrals = async () => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
				query {
					referrals {
						_id
						toothNumber
						patient {
							firstName
							lastName
							dateOfBirth
						}
						referrer {
							email
						}
						createdAt
					}
				}
			`
		};

		try {
			const resData = await helpers.queryAPI(requestBody, this.context);
			const referrals = resData.data.referrals;
			console.log(referrals);
			if (this.isActive) {
				this.setState({ referrals: referrals });
			}
		} catch (err) {
			console.log(err);
		}
		this.setState({ isLoading: false });
	}

	fetchPatients = async () => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
				query {
					patients {
						_id
						firstName
						lastName
						phoneNumber
						email
						dateOfBirth
						gender
					}
				}
			`
		};

		try {
			const resData = await helpers.queryAPI(requestBody, this.context);
			const patients = resData.data.patients;
			if (this.isActive) {
				this.setState({ patients: patients });
			}
		} catch (err) {
			console.log(err);
		}
		this.setState({ isLoading: false });
	}

	fetchUsers = async () => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
				query {
					users {
						_id
						email
					}
				}
			`
		};

		try {
			const resData = await helpers.queryAPI(requestBody, this.context);
			const users = resData.data.users;
			if (this.isActive) {
				this.setState({ users: users });
			}
		} catch (err) {
			console.log(err);
		}
		this.setState({ isLoading: false });
	}

	render() {
		console.log("ReferralsPage.render()", this.state.referrals);
		return (
			<React.Fragment>
				{(this.state.creating || this.state.selectedPatient) && (
					<React.Fragment>
						<Backdrop />
						<Modal
							title="Send Referral"
							canCancel
							canConfirm
							onCancel={this.modalCancelHandler}
							onConfirm={this.modalConfirmHandler}
							confirmText="Confirm"
						>
							<form>
								<div className="form-control">
									<label htmlFor="patient">Patient</label>
									{!this.state.selectedPatient ? (
										<PatientSearch
											patients={this.state.patients}
											onDetail={((patient) => { this.setState({ selectedPatient: patient }) }).bind(this)}
											buttonText="Select"
										/>
									) : (<div>
										Selected Patient: <PatientDetails
											patient={this.state.selectedPatient}
										/>
									</div>
									)}
								</div>
								<div className="form-control">
									<label htmlFor="toothNumber">Tooth Number</label>
									<input type="number" id="toothNumber" ref={this.toothNumberElRef}></input>
								</div>
								<div className="form-control">
									<label htmlFor="referee">Doctor</label>
									<select id="referee" ref={this.refereeElRef}>
										{this.state.users.map(user => {
											return <option value={user._id}>{user.email}</option>
										})}
									</select>
								</div>
							</form>
						</Modal>)
					</React.Fragment>
				)}
				{this.state.selectedReferral && (
					<Modal
						title={this.state.selectedPatient.title}
						canCancel
						canConfirm
						onCancel={this.modalCancelHandler}
						onConfirm={this.createReferralHandler}
						confirmText={"Confirm"}
					>
						<PatientDetails
							patient={this.props.selectedPatient}
						/>
					</Modal>
				)}
				<div className="events-control">
					<button className="btn" onClick={this.startCreatePatientHandler}>Create Referral</button>
				</div>
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<ReferralList
						referrals={this.state.referrals}
						onDetail={this.showDetailHandler}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default ReferralsPage;