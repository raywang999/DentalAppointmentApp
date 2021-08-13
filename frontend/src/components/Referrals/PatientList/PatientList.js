import React from 'react';

import PatientItem from '../PatientItem/PatientItem';

class PatientList extends React.Component {
	render() {
		const patients = this.props.patients.map(patient => {
			return <PatientItem 
				key = {patient._id}
				firstName = {patient.firstName}
				lastName = {patient.lastName}
				dateOfBirth = {patient.dateOfBirth}
				toothNumber = {patient.toothNumber}
				phoneNumber = {patient.phoneNumber}
				gender = {patient.gender}
			/>
		});
		return (<ul>{patients}</ul>);
	}
}

export default PatientList;