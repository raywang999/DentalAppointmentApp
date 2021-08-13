import React from 'react';

//import main from './tests/main';
import test from './backend/test';

class TestsPage extends React.Component {
	main() {
		test();
	} 
	render() {
		return (<React.Fragment>
			<button onClick={this.main}>Run Tests</button>
		</React.Fragment>);
	}
};

export default TestsPage;