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
			/>
		});
		return (<ul>{patients}</ul>);
	}
}

export default PatientList;