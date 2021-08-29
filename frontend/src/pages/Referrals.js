import React, { useState, useContext, useEffect } from 'react';
import _get from 'lodash.get';

import Modal from '../components/modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Patients.css';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import helpers from '../helpers/helpers';
import PatientDetails from '../components/Patients/PatientDetails/PatientDetails';
import PatientSearch from '../components/Patients/PatientSearch/PatientSearch';
import ReferralStatistic from '../components/Referrals/ReferralStatistics/ReferralStatistics';
import ReferralTable from '../components/Referrals/ReferralTable/ReferralTable';
import Pagination from '../components/Pagination/Pagination';

export default async (props) => {
	const [creating, setCreating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fetchReferrals = async () => {
		setIsLoading(true);
		const requestBody = {
			query: `
				query {
					referrals {
						${requiredReferralInformation}
					}
				}
			`
		};

		try {
			const resData = await helpers.queryAPI(requestBody, context);
			if (isActive) {
				sortReferrals();
				return resData.data.referrals;
			}
		} catch (err) {
			console.log(err);
		}
		setIsLoading(false);
	}

	const fetchPatients = async () => {
		setIsLoading(true);
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
			setIsLoading(false);
			return resData.data.patients;
		} catch (err) {
			console.log(err);
		}
	}

	const fetchUsers = async () => {
		setIsLoading(true);
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
			const resData = await helpers.queryAPI(requestBody, context);
			setIsLoading(false);
			if (isActive) {
				return resData.data.users;
			}
		} catch (err) {
			console.log(err);
		}
	}

	const [referrals, setReferrals] = useState(await fetchReferrals());
	const [patients, setPatients] = useState([await fetchPatients()]);
	//const [events, setEvents] = useState([]);
	const [users, setUsers] = useState(await fetchUsers());
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [selectedReferral, setSelectedReferral] = useState(null);
	const [activePaginationPage, setActivePaginationPage] = useState(1);

	var isActive = true;
	const context = useContext(AuthContext);

	const requiredReferralInformation = `
		_id
		toothNumber
		patient {
			firstName
			lastName
			dateOfBirth
		}
		comments
		referrer {
			email
		}
		referee{
			email
		}
		createdAt
		treatmentDate
		consultationDate
	`;

	const patientElRef = React.createRef();
	const refereeElRef = React.createRef();
	const toothNumberElRef = React.createRef();
	const commentsElRef = React.createRef();
	const maxDisplayedReferrals = 6;

	if (props.location && props.location.state) {
		setSelectedPatient(props.location.state.selectedPatient);
	}

	useEffect(() => {
		return function cleanup() { isActive = false };
	});

	const sortReferrals = (filterKey, filterNonDecreasing) => {
		if (!filterKey) {
			filterKey = "createdAt";
		}
		setReferrals(
			referrals.sort((el1, el2) => {
				const toString = (obj) => {
					obj = _get(obj, filterKey);
					if (obj) return obj.toString();
					return "";
				};
				el1 = toString(el1);
				el2 = toString(el2);
				var result = el1.localeCompare(el2);
				if (!filterNonDecreasing) result *= -1;
				return result;
			})
		);
	};

	const setPaginationHandler = (page) => {
		setActivePaginationPage(page);
	};

	const startCreateReferralHandler = () => {
		setCreating(true);
	};

	const modalConfirmHandler = async () => {
		const refereeId = refereeElRef.current.value;
		const toothNumber = toothNumberElRef.current.value;
		const comments = commentsElRef.current.value;
		if (!selectedPatient || !refereeId || !toothNumber || !comments) {
			alert("Incomplete Data!");
			return;
		}
		const patientId = selectedPatient._id;

		setIsLoading(true);
		modalCancelHandler();

		const formData = {
			refereeId: refereeId,
			patientId: patientId,
			comments: comments,
			toothNumber: +toothNumber,
		};

		const requestBody = {
			query: `
				mutation CreateReferral ($patientId: ID!, $refereeId: ID!, $toothNumber: Int!, $comments: String){
					createReferral (patientId: $patientId, refereeId: $refereeId, toothNumber: $toothNumber, comments: $comments){
						${requiredReferralInformation}
					}
				}
			`,
			variables: formData,
		};

		try {
			const resData = await helpers.queryAPI(requestBody, context);
			setReferrals(referrals.unshift({
				...resData.data.createReferral,
			}));
		} catch (err) {
			console.log(err);
		}
		setIsLoading(false);
	};

	const modalCancelHandler = () => {
		setCreating(false);
		setSelectedPatient(null);
		setSelectedReferral(null);
	}

	const showDetailHandler = (referral) => {
		setSelectedReferral(referral);
	}

	return (
		<React.Fragment>
			{(creating || selectedPatient) && (
				<React.Fragment>
					<Backdrop />
					<Modal
						title="Send Referral"
						canCancel
						canConfirm
						onCancel={modalCancelHandler}
						onConfirm={modalConfirmHandler}
						confirmText="Confirm"
					>
						<form>
							<div className="form-control">
								<label htmlFor="patient">Patient</label>
								{!selectedPatient ? (
									<PatientSearch
										patients={patients}
										onDetail={((patient) => { setSelectedPatient(patient) }).bind(this)}
										buttonText="Select"
									/>
								) : (<div>
									Selected Patient: <PatientDetails
										patient={selectedPatient}
									/>
								</div>
								)}
							</div>
							<div className="form-control">
								<label htmlFor="toothNumber">Tooth Number</label>
								<input type="number" id="toothNumber" ref={toothNumberElRef}></input>
							</div>
							<div className="form-control">
								<label htmlFor="comments">Comments</label>
								<textarea id="comments" ref={commentsElRef}></textarea>
							</div>
							<div className="form-control">
								<label htmlFor="referee">Doctor</label>
								<select id="referee" ref={refereeElRef}>
									{users.map(user => {
										return <option value={user._id}>{user.email}</option>
									})}
								</select>
							</div>
						</form>
					</Modal>)
				</React.Fragment>
			)}
			{selectedReferral && (
				<React.Fragment>
					<Backdrop />
					<Modal
						title="Referral Details"
						canCancel
						canConfirm
						onCancel={modalCancelHandler}
						onConfirm={modalCancelHandler}
						confirmText={"Confirm"}
					>
						<PatientDetails
							patient={selectedReferral.patient}
						/>
						<h2>Comments: {selectedReferral.comments}</h2>
						<h2>Tooth Number: {selectedReferral.toothNumber}</h2>
					</Modal>
				</React.Fragment>
			)}
			<div className="events-control">
				<button className="btn" onClick={startCreateReferralHandler}>Create Referral</button>
			</div>
			{isLoading ? (
				<Spinner />
			) : (
				<React.Fragment>
					<ReferralTable
						referrals={referrals.slice(
							(activePaginationPage - 1) * maxDisplayedReferrals,
							activePaginationPage * maxDisplayedReferrals,
						)}
						onDetail={showDetailHandler}
						sortReferrals={sortReferrals.bind(this)}
					/>
					<Pagination
						totalItemCount={referrals.length}
						itemsPerPage={maxDisplayedReferrals}
						currentActivePage={activePaginationPage}
						setPagination={setPaginationHandler.bind(this)}
					/>
					<ReferralStatistic referrals={referrals} />
				</React.Fragment>
			)}
		</React.Fragment>
	);
}
