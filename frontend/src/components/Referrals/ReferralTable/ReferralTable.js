import Table from 'react-bootstrap/Table';
import React from 'react';

class ReferralTable extends React.Component {
	render(){
		return (<React.Fragment>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Date Referred</th>
						<th>Consultation Date</th>
						<th>Treatment Date</th>
						<th>Referrer</th>
					</tr>
				</thead>
				<tbody>
					{this.props.referrals.map(referral => {
						return (<tr>
							<td>{referral.patient.firstName}</td>
							<td>{referral.patient.lastName}</td>
							<td>{new Date(referral.createdAt).toDateString()}</td>
							<td>{referral.treatmentDate ? referral.treatmentDate : "None"}</td>
							<td>{referral.consulationDate ? referral.consulationDate : "None"}</td>
							<td>{referral.referrer.email}</td>
						</tr>);
					})}
				</tbody>
			</Table>
		</React.Fragment>);
	}
}

export default ReferralTable;