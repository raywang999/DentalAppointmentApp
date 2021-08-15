import React from 'react';

//import './PatientDetails.css';

class PatientDetails extends React.Component {
	render() {
		return (
			<div>
				<h1>{this.props.patient.firstName} - {this.props.patient.lastName}</h1>
				<h2>Date of Birth: {(new Date(this.props.patient.dateOfBirth)).toDateString()}</h2>
				<h2>Age: {new Date().getFullYear() - new Date(this.props.patient.dateOfBirth).getFullYear()}</h2>
				<h2>Phone Number: {this.props.patient.phoneNumber}</h2>
				<h2>Email: {this.props.patient.email}</h2>
			</div>
		);
	}
};

export default PatientDetails;