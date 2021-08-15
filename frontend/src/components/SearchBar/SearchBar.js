import React from 'react';

class SearchBar extends React.Component {
	state = {
		
	}
	constructor(props){
		super(props);
		this.state.currentInputValue='';
		this.state.onUpdate=props.onUpdate;
	}
	
	render() {
		return (
			<input
				type="text"
				id={this.props.id}
				placeholder={this.props.placeholder}
				onChange={}
			/>
		);
	}
}

export default SearchBar;