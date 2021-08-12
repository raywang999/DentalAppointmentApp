import React from 'react';

class PatientItem extends React.Component {
	render(){
		const props=this.props;
		return (<li 
			key = {props.key}
			className="patient__list-item"
		>
			<h1>{props.firstName} {props.lastName}</h1>
		</li>);
	}
}

export default PatientItem;