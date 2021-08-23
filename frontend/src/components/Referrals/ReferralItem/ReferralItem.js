import React from 'react';
import PatientDetails from '../../Patients/PatientDetails/PatientDetails';

import './PatientItem.css';

class ReferralItem extends React.Component {
	render() {
		const referral = this.props.referral;
		return (
			<li key={referral._id} className="events__list-item">
				<div>
					<PatientDetails 
						patient={referral.patient}
					/>
				</div>
				<div>
						(<button className="btn" onClick={this.props.onDetail.bind(this, referral)}>View Details</button>)
				</div>
			</li>
		);
	}
};

export default ReferralItem ;