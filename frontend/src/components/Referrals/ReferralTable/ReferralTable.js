import Table from 'react-bootstrap/Table';
import React from 'react';

import './ReferralTable.scss';

class ReferralTable extends React.Component {
	state = {
		filterKey: "dateCreated",
		filterNonDecreasing: false,
	};
	onSortHandler(filterKey) {
		var filterNonDecreasing = !this.state.filterNonDecreasing;
		this.setState(prevState => {
			if (prevState.filterKey !== filterKey) filterNonDecreasing = false;
			return { filterKey: filterKey, filterNonDecreasing: filterNonDecreasing };
		});
		this.props.sortReferrals(filterKey, filterNonDecreasing);
	}
	render() {
		return (<React.Fragment>
			<Table striped bordered hover responsive="xxl">
				<thead>
					<tr>
						{[
							{ filterKey: "patient.firstName", displayText: "First Name"},
							{ filterKey: "patient.lastName", displayText: "Last Name" },
							{ filterKey: "createdAt", displayText: "Date Referred" },
							{ filterKey: "consultationDate", displayText: "Consultation Date" },
							{ filterKey: "treatmentDate", displayText: "Treatment Date" },
							{ filterKey: "referrer.email", displayText: "Referrer" },
						].map(el => {
							const active = this.state.filterKey === el.filterKey;
							return <th
								onClick={this.onSortHandler.bind(this, el.filterKey)}
								class={`${active && "active"}`}
							>{el.displayText}  {active && ((this.state.filterNonDecreasing) ? "˄" : "˅")}</th>
						})}
					</tr>
				</thead>
				<tbody>
					{this.props.referrals.map(referral => {
						return (<tr
							key={referral._id}
							onClick={this.props.onDetail.bind(this, referral)}
						>
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