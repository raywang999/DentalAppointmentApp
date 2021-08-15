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

class ReferralsPage extends Component {
	state = {
		creating: false,
		referrals: [],
		events: [],
		isLoading: false,
		selectedPatient: null,
		selectedReferral: null,
	};

	isActive = true;
	static contextType = AuthContext;

	constructor(props) {
		super(props);
		if (props.selectedPatient) {
			this.props.selectedPatient = props.selectedPatient;
		}
		this.createPatientFormData = {
			patientElRef: React.createRef(),
			refereeElRef: React.createRef(),
			toothNumberElRef: React.createRef(),
		};
	}

	componentDidMount() {
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

	render() {
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
									<input type="text" id="patient" ref={this.createPatientFormData.firstNameElRef}></input>
								</div>
								<div className="form-control">
									<label htmlFor="toothNumber">Tooth Number</label>
									<input type="number" id="toothNumber" ref={this.createPatientFormData.toothNumberElRef}></input>
								</div>
								<div className="form-control">
									<label htmlFor="referee">Doctor</label>
									<input type="number" id="referee" ref={this.createPatientFormData.refereeElRef}></input>
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
						onConfirm={this.bookEventHandler}
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
						getReferrals={this.state.getReferrals}
						onDetail={this.showDetailHandler}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default ReferralsPage;