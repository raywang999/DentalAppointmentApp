import React from 'react';

import './PatientItem.css';
import PatientDetails from '../PatientDetails/PatientDetails';

class PatientItem extends React.Component {
	render() {
		return (
			<li key={this.props.patient._id} className="events__list-item">
				<PatientDetails 
					patient={this.props.patient}
				/>
				<div>
					<button
						className="btn"
						onClick={this.props.onDetail.bind(this, this.props.patient)}
					>{this.props.buttonText ? (this.props.buttonText) : ("View Details")}</button>
				</div>
			</li>
		);
	}
};

export default PatientItem;