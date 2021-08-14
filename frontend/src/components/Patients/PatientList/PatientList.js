import React from 'react';

import PatientItem from '../PatientItem/PatientItem';

class PatientList extends React.Component {
	render() {
		const patients = this.props.patients.map(patient => {
			return <PatientItem 
				key = {patient._id}
				patient = {patient}
				onDetail = {this.props.onDetail}
			/>
		});
		return (<ul>{patients}</ul>);
	}
}

export default PatientList;