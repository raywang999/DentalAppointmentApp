import React from 'react';
import helpers from '../../../helpers/helpers';
import PatientList from '../PatientList/PatientList';

class PatientSearch extends React.Component {
	state = {
		value: '',
		patients: [],
		filteredPatients: [],
	}
	constructor(props) {
		super(props);
		this.state.value = '';
		this.state.patients = props.patients;
		this.state.filteredPatients = this.filterPatients();
	}

	handleChange(event) {
		const value=event.target.value;
		this.setState({value: value, filteredPatients: this.filterPatients()});
	}

	filterPatients() {
		const res =this.state.patients.filter(patient => {
			var res = false;
			Object.values(patient).forEach(value => {
				if (value && value.toLowerCase().search(this.state.value.toLowerCase()) !== -1){
					res=true;
				}
			});
			return res;
		});
		console.log(res);
		return res;
	}

	handleOnDetail(){
		console.log("?");
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
				patients={this.state.filteredPatients}
				onDetail={this.handleOnDetail}
			/>
		</React.Fragment>);
	}
}

export default PatientSearch;