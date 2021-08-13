import React from 'react';

import './PatientItem.css';

class eventItem extends React.Component {
	render() {
		return (
			<li key={this.props.eventId} className="events__list-item">
				<div>
					<h1>{this.props.firstName} - {this.props.lastName}</h1>
					<h2>Date of Birth: {(new Date(this.props.dateOfBirth)).toDateString()}</h2>
					<h2>Age: {new Date().getFullYear() - new Date(this.props.dateOfBirth).getFullYear()}</h2>
					<h2>Phone Number: {this.props.phoneNumber}</h2>
				</div>
				<div>
					{<h1>{this.props.gender}</h1>/*this.props.userId === this.props.creatorId ?
						(<p>You're the owner of this event.</p>) :
						(<button className="btn" onClick={this.props.onDetail.bind(this, this.props.eventId)}>View Details</button>)
					*/}
				</div>
			</li>
		);
	}
};

export default eventItem;