import React from 'react';

import ReferralItem from '../ReferralItem/ReferralItem';

class ReferralList extends React.Component {
	render() {
		const referrals = this.props.referrals.map(referral => {
			return <ReferralItem 
				key = {referral._id}
				referral = {referral}
				onDetail = {this.props.onDetail}
			/>
		});
		return (<ul>{referrals}</ul>);
	}
}

export default ReferralList;