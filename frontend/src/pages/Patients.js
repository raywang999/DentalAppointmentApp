import React, { useContext, useState, useEffect } from 'react';

import Modal from '../components/modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Patients.css';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import helpers from '../helpers/helpers';
import PatientSearch from '../components/Patients/PatientSearch/PatientSearch';
import { Redirect } from 'react-router-dom';

export default (props) => {
	const fetchPatients = async () => {
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
			const resData = await helpers.queryAPI(requestBody, context);
			return resData.data.patients;
		} catch (err) {
			console.log(err);
		}
	}

	const [creating, setCreating] = useState(false);
	const [creatingReferral, setCreatingReferral] = useState(false);
	const [patients, setPatients] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const context = useContext(AuthContext);

	const createPatientFormData = {
		firstNameElRef: React.createRef(),
		lastNameElRef: React.createRef(),
		dateOfBirthElRef: React.createRef(),
		genderElRef: React.createRef(),
		phoneNumberElRef: React.createRef(),
		emailElRef: React.createRef(),
	};

	const startCreatePatientHandler = () => {
		setCreating(true);
	};

	const modalConfirmHandler = async () => {
		let dataIsValid = true;
		const formData = {
			...Object.fromEntries(
				Object.entries(createPatientFormData).map(
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
		setCreating(false);

		formData.toothNumber = +formData.toothNumber;

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
			const resData = await helpers.queryAPI(requestBody, context);
			const updatedPatients = [...patients];
			updatedPatients.push({
				...formData,
				_id: resData.data.createPatient._id,
				referrer: context.userId,
			});
			setPatients(updatedPatients);
		} catch (err) {
			console.log(err);
		}
	};

	const modalCancelHandler = () => {
		setCreating(false);
		setSelectedPatient(null);
	}

	const showDetailHandler = (patient) => {
		setSelectedPatient(patient);
	}

	const referPatientHandler = () => {
		if (!context.token) {
			setSelectedPatient(null);
			return;
		}
		setCreatingReferral(true);
	}

	useEffect(async () => {
		setPatients(await fetchPatients());
		setIsLoading(false);
	},[]);

	return (
		<React.Fragment>
			{(creating || selectedPatient) && (<Backdrop />)}
			{creating && (
				<Modal
					title="Add Patient"
					canCancel
					canConfirm
					onCancel={modalCancelHandler}
					onConfirm={modalConfirmHandler}
					confirmText="Confirm"
				>
					<form>
						<div className="form-control">
							<label htmlFor="firstName">First Name</label>
							<input type="text" id="firstName" ref={createPatientFormData.firstNameElRef}></input>
						</div>
						<div className="form-control">
							<label htmlFor="lastName">Last Name</label>
							<input type="text" id="lastName" ref={createPatientFormData.lastNameElRef}></input>
						</div>
						<div className="form-control">
							<label htmlFor="dateOfBirth">Date of Birth</label>
							<input type="date" id="dateOfBirth" ref={createPatientFormData.dateOfBirthElRef}></input>
						</div>
						<div className="form-control">
							<label htmlFor="gender">Gender</label>
							<input type="text" id="gender" ref={createPatientFormData.genderElRef}></input>
						</div>
						<div className="form-control">
							<label htmlFor="phoneNumber">Phone Number</label>
							<input type="tel" id="phoneNumber" ref={createPatientFormData.phoneNumberElRef}></input>
						</div>
						<div className="form-control">
							<label htmlFor="email">Email</label>
							<input type="email" id="email" ref={createPatientFormData.emailElRef}></input>
						</div>
					</form>
				</Modal>)
			}
			{creatingReferral && (<Redirect to={{
				pathname: "/referrals",
				state: { selectedPatient: selectedPatient }
			}} />)}
			{selectedPatient && (
				<Modal
					title={`${selectedPatient.firstName} - ${selectedPatient.lastName}`}
					canCancel
					canConfirm
					onCancel={modalCancelHandler}
					onConfirm={referPatientHandler.bind(this)}
					confirmText={context.token ? ("Refer") : ("Confirm")}
				>
					<h2>
						First Name: {selectedPatient.firstName}
					</h2>
					<h2>
						Last Name: {selectedPatient.lastName}
					</h2>
					<h2>
						Age: {new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()}
					</h2>
					<p>
						Birth Date: {new Date(selectedPatient.dateOfBirth).toDateString()}
					</p>
					<p>
						Email: {selectedPatient.email}
					</p>
					<p>
						Phone Number: {selectedPatient.phoneNumber}
					</p>
				</Modal>
			)}
			<div className="events-control">
				<button className="btn" onClick={startCreatePatientHandler}>Create Patient</button>
			</div>
			{isLoading ? (
				<Spinner />
			) : (
				<PatientSearch
					patients={patients}
					authUserId={context.userId}
					onDetail={showDetailHandler}
				/>
			)}
		</React.Fragment>
	);
}