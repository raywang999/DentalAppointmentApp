import React, { useState, useContext, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
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
	attachments{
		filename
	}
`;

const CREATE_REFERRAL_MUTATION = gql(`
	mutation CreateReferral ($patientId: ID!, $refereeId: ID!, $toothNumber: Int!, $comments: String, $attachments: [Upload!]){
		createReferral (patientId: $patientId, refereeId: $refereeId, toothNumber: $toothNumber, comments: $comments, attachments: $attachments){
			${requiredReferralInformation}
		}
	}
`);

export default (props) => {
	var isActive = true;
	const [creating, setCreating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [referrals, setReferrals] = useState([]);
	const [patients, setPatients] = useState([]);
	const [users, setUsers] = useState([]);
	const [selectedPatient, setSelectedPatient] = useState(null);
	const [selectedReferral, setSelectedReferral] = useState(null);
	const [activePaginationPage, setActivePaginationPage] = useState(1);
	const context = useContext(AuthContext);
	const [createReferral] = useMutation(CREATE_REFERRAL_MUTATION);

	const patientElRef = React.createRef();
	const refereeElRef = React.createRef();
	const toothNumberElRef = React.createRef();
	const commentsElRef = React.createRef();
	const attachmentsElRef = React.createRef();
	const maxDisplayedReferrals = 6;

	const fetchReferrals = async () => {
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
				return resData.data.referrals;
			}
		} catch (err) {
			console.log(err);
		}
	}

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

	const fetchUsers = async () => {
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
			if (isActive) {
				return resData.data.users;
			}
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(async () => {
		setReferrals(await fetchReferrals());
		setUsers(await fetchUsers());
		setPatients(await fetchPatients());
		if (props.location && props.location.state) {
			setSelectedPatient(props.location.state.selectedPatient);
		}
	}, []);

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
		const attachments = attachmentsElRef.current.files;
		var comments = commentsElRef.current.value;
		if (!selectedPatient || !refereeId || !toothNumber) {
			alert("Incomplete Data!");
			return;
		}
		if (!comments) comments = null;
		const patientId = selectedPatient._id;

		modalCancelHandler();

		const formData = {
			refereeId: refereeId,
			patientId: patientId,
			comments: comments,
			toothNumber: +toothNumber,
			attachments: attachments,
		};


		try {
			const resData = await createReferral({
			variables: formData,
		});
			const newReferrals = [resData.data.createReferral, ...referrals];
			setReferrals(newReferrals);
		} catch (err) {
			console.log(err);
		}
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
								<label htmlFor="attachments">Attachments</label>
								<input type="file" multiple id="attachments" ref={attachmentsElRef}></input>
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
