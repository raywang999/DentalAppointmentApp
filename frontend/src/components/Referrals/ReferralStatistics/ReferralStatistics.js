import React from 'react';

import authContext from '../../../context/auth-context';

class ReferralStatistic extends React.Component {
	static contextType = authContext;

	render() {
		const referrals = this.props.referrals;
		var users = {};
		referrals.forEach(referral => {
			const referee = referral.referee.email;
			const referrer = referral.referrer.email;
			if (!users[referee]) users[referee] = { receivedFromThem: 0, sentToThem: 0 };
			if (!users[referrer]) users[referrer] = { receivedFromThem: 0, sentToThem: 0 };
			++users[referee].sentToThem;
			++users[referrer].receivedFromThem;
		});
		return (
			<React.Fragment>
				{Object.entries(users).map(([key, value]) => {
					if (key === this.context.email) return <React.Fragment />;
					return (<div>
						<h1>{key}</h1>
						<h2>Referrals received from them: {value.receivedFromThem}</h2>
						<h2>Referrals sent to them: {value.sentToThem}</h2>
					</div>);
				})}
			</React.Fragment>
		);
	}
}

export default ReferralStatistic;