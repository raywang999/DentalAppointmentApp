import React, { Component } from 'react';

import Modal from '../components/modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Patients.css';
import AuthContext from '../context/auth-context';
import PatientList from '../components/Patients/PatientList/PatientList';
import Spinner from '../components/Spinner/Spinner';
import helpers from '../helpers/helpers';
import PatientSearch from '../components/Patients/PatientSearch/PatientSearch';
import { Redirect } from 'react-router-dom';

class PatientsPage extends Component {
	state = {
		creating: false,
		creatingReferral: false,
		patients: [],
		events: [],
		isLoading: false,
		selectedPatient: null
	};

	isActive = true;
	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.createPatientFormData = {
			firstNameElRef: React.createRef(),
			lastNameElRef: React.createRef(),
			dateOfBirthElRef: React.createRef(),
			genderElRef: React.createRef(),
			phoneNumberElRef: React.createRef(),
			emailElRef: React.createRef(),
		};
	}

	componentDidMount() {
		this.fetchPatients();
	};

	componentWillUnmount() {
		this.isActive = false;
	}

	startCreatePatientHandler = () => {
		this.setState({ creating: true });
	};

	modalConfirmHandler = async () => {
		let dataIsValid = true;
		const formData = {
			...Object.fromEntries(
				Object.entries(this.createPatientFormData).map(
					([key, value]) => {
						if (!value || !value.current.value) {
							dataIsValid = false;
						} else {
							value = value.current.value;
						} return [key.replace('ElRef', ''), value];
					})
			)
		};
		if (!dataIsValid) {
			alert("Incomplete Data!");
			return;
		}
		this.setState({ creating: false });

		formData.toothNumber = + formData.toothNumber;

		const requestBody = {
			query: `
				mutation CreatePatient ($firstName: String!, $lastName: String!, $dateOfBirth: String!, $gender: String!, $email: String, $phoneNumber: String){
					createPatient (patientInput: {firstName: $firstName, lastName: $lastName, dateOfBirth: $dateOfBirth, gender: $gender, email: $email, phoneNumber: $phoneNumber}){
						_id
					}
				}
			`,
			variables: formData,
		};

		try {
			const resData = await helpers.queryAPI(requestBody, this.context);
			this.setState(prevState => {
				const updatedPatients = [...prevState.patients];
				updatedPatients.push({
					...formData,
					_id: resData.data.createPatient._id,
					referrer: this.context.userId,
				});
				return { patients: updatedPatients };
			});
		} catch (err) {
			console.log(err);
		}
	};

	modalCancelHandler = () => {
		this.setState({ creating: false, selectedPatient: null });
	}

	showDetailHandler = (patient) => {
		this.setState({selectedPatient: patient});
	}

	referPatientHandler() {
		if (!this.context.token) {
			this.setState({ selectedPatient: null });
			return;
		}
		this.setState({ creatingReferral: true });
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

	getPatients() {
		return this.state.patients;
	}

	render() {
		return (
			<React.Fragment>
				{(this.state.creating || this.state.selectedPatient) && (<Backdrop />)}
				{this.state.creating && (
					<Modal
						title="Add Patient"
						canCancel
						canConfirm
						onCancel={this.modalCancelHandler}
						onConfirm={this.modalConfirmHandler}
						confirmText="Confirm"
					>
						<form>
							<div className="form-control">
								<label htmlFor="firstName">First Name</label>
								<input type="text" id="firstName" ref={this.createPatientFormData.firstNameElRef}></input>
							</div>
							<div className="form-control">
								<label htmlFor="lastName">Last Name</label>
								<input type="text" id="lastName" ref={this.createPatientFormData.lastNameElRef}></input>
							</div>
							<div className="form-control">
								<label htmlFor="dateOfBirth">Date of Birth</label>
								<input type="date" id="dateOfBirth" ref={this.createPatientFormData.dateOfBirthElRef}></input>
							</div>
							<div className="form-control">
								<label htmlFor="gender">Gender</label>
								<input type="text" id="gender" ref={this.createPatientFormData.genderElRef}></input>
							</div>
							<div className="form-control">
								<label htmlFor="phoneNumber">Phone Number</label>
								<input type="tel" id="phoneNumber" ref={this.createPatientFormData.phoneNumberElRef}></input>
							</div>
							<div className="form-control">
								<label htmlFor="email">Email</label>
								<input type="email" id="email" ref={this.createPatientFormData.emailElRef}></input>
							</div>
						</form>
					</Modal>)
				}
				{this.state.creatingReferral && (<Redirect to={{
					pathname: "/referrals",
					state: {selectedPatient: this.state.selectedPatient}
				}}/>)}
				{this.state.selectedPatient && (
					<Modal
						title={`${this.state.selectedPatient.firstName} - ${this.state.selectedPatient.lastName}`}
						canCancel
						canConfirm
						onCancel={this.modalCancelHandler}
						onConfirm={this.referPatientHandler.bind(this)}
						confirmText={this.context.token ? ("Refer") : ("Confirm")}
					>
						<h2>
							First Name: {this.state.selectedPatient.firstName}
						</h2>
						<h2>
							Last Name: {this.state.selectedPatient.lastName}
						</h2>
						<h2>
							Age: {new Date().getFullYear() - new Date(this.state.selectedPatient.dateOfBirth).getFullYear()}
						</h2>
						<p>
							Birth Date: {new Date(this.state.selectedPatient.dateOfBirth).toDateString()}
						</p>
						<p>
							Email: {this.state.selectedPatient.email}
						</p>
						<p>
							Phone Number: {this.state.selectedPatient.phoneNumber}
						</p>
					</Modal>
				)}
				<div className="events-control">
					<button className="btn" onClick={this.startCreatePatientHandler}>Create Patient</button>
				</div>
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<PatientSearch
						patients={this.state.patients}
						authUserId={this.context.userId}
						onDetail={this.showDetailHandler}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default PatientsPage;