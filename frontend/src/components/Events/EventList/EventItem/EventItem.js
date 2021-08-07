import React from 'react';

import './EventItem.css';

class eventItem extends React.Component {
	render() {
		return (
			<li key={this.props.eventId} className="events__list-item">
				<div>
					<h1>{this.props.title}</h1>
					<h2>${this.props.price} - {new Date(this.props.date).toLocaleDateString()}</h2>
				</div>
				<div>
					{this.props.userId === this.props.creatorId ?
						(<p>You're the owner of this event.</p>) :
						(<button className="btn" onClick={this.props.onDetail.bind(this, this.props.eventId)}>View Details</button>)
					}
				</div>
			</li>
		);
	}
};

export default eventItem;