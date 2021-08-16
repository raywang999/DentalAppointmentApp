import React from 'react';
import PatientList from '../PatientList/PatientList';

class PatientSearch extends React.Component {
	state = {
		value: '',
	}
	constructor(props) {
		super(props);
		this.state.value = '';
	}

	handleChange(event) {
		const value=event.target.value;
		this.setState({value: value});
	}

	filterPatients() {
		console.log("Patient Search Props",this.props.patients);
		const res =this.props.patients.filter(patient => {
			var res = false;
			Object.values(patient).forEach(value => {
				if (value && value.toLowerCase().search(this.state.value.toLowerCase()) !== -1){
					res=true;
				}
			});
			return res;
		});
		return res;
	}

	render() {
		return (<React.Fragment>
			<input 
				id="input"
				type="text"
				placeholder="Search Patient"
				onChange={this.handleChange.bind(this)}
				value={this.state.value}
			>
			</input>
			<PatientList 
				patients={this.filterPatients()}
				onDetail={this.props.onDetail}
				buttonText={this.props.buttonText}
			/>
		</React.Fragment>);
	}
}

export default PatientSearch;