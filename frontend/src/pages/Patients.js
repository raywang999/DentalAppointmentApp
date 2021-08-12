import React, { Component } from 'react';

import Modal from '../components/modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Patients.css';
import AuthContext from '../context/auth-context';
import PatientList from '../components/Patients/PatientList/PatientList';
import Spinner from '../components/Spinner/Spinner';
import helpers from '../helpers/helpers';

class PatientsPage extends Component {
	state = {
		creating: false,
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
			toothNumberElRef: React.createRef(),
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
		console.log(formData);

		const requestBody = {
			query: `
				mutation CreatePatient ($firstName: String!, $lastName: String!, $dateOfBirth: String!, $gender: String!, $toothNumber: Int!, $email: String, $phoneNumber: String){
					createPatient (patientInput: {firstName: $firstName, lastName: $lastName, dateOfBirth: $dateOfBirth, gender: $gender, toothNumber: $toothNumber, email: $email, phoneNumber: $phoneNumber}){
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

	showDetailHandler = (eventId) => {
		this.setState(prevState => {
			const selectedPatient = prevState.events.find(e => e._id === eventId);
			return { selectedPatient: selectedPatient };
		});
	}

	bookEventHandler = async () => {
		if (!this.context.token) {
			this.setState({ selectedPatient: null });
			return;
		}
		const requestBody = {
			query: `
				mutation BookEvent ($id: ID!) {
					bookEvent(eventId: $id) {
						_id
						createdAt
						updatedAt
					}
				}
			`,
			variables: {
				id: this.state.selectedPatient._id
			}
		};

		try {
			const resData = await helpers.queryAPI(requestBody, this.context);
			console.log(resData);
		} catch (err) {
			console.log(err);
		}
		this.setState({ selectedPatient: null });
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
						toothNumber
						dateOfBirth
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
								<label htmlFor="toothNumber">Tooth Number</label>
								<input type="number" id="toothNumber" ref={this.createPatientFormData.toothNumberElRef}></input>
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
				{this.state.selectedPatient && (
					<Modal
						title={this.state.selectedPatient.title}
						canCancel
						canConfirm
						onCancel={this.modalCancelHandler}
						onConfirm={this.bookEventHandler}
						confirmText={this.context.token ? ("Book") : ("Confirm")}
					>
						<h1>{this.state.selectedPatient.title}</h1>
						<h2>
							${this.state.selectedPatient.price} - {new Date(this.state.selectedPatient.date).toLocaleDateString()}
						</h2>
						<p>
							{this.state.selectedPatient.description}
						</p>
					</Modal>
				)}
				<div className="events-control">
					<button className="btn" onClick={this.startCreatePatientHandler}>Create Patient</button>
				</div>
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<PatientList
						patients={this.state.patients}
						authUserId={this.context.userId}
						onViewDetail={this.showDetailHandler}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default PatientsPage;