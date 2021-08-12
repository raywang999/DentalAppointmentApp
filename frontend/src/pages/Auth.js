import React, { Component } from 'react';

import './Auth.css';
import authContext from '../context/auth-context';
import helpers from '../helpers/helpers';

class AuthPage extends Component {
	state = {
		isLogin: true
	}

	static contextType = authContext;

	constructor(props) {
		super(props);
		this.emailEl = React.createRef();
		this.passwordEl = React.createRef();
	}

	switchModeHandler = () => {
		this.setState(prevState => {
			return { isLogin: !prevState.isLogin };
		});
	};

	submitHandler = async (event) => {
		event.preventDefault();
		const email = this.emailEl.current.value;
		const password = this.passwordEl.current.value;

		if (email.trim().length === 0 || password.trim().length === 0) {
			return;
		}

		let requestBody = {
			query: `
				query Login($email: String!, $password: String!) {
					login(email: $email, password: $password){
						userId
						token
						tokenExpiration
					}
				}
			`,
			variables: {
				email: email,
				password: password
			}
		};

		if (!this.state.isLogin) {
			requestBody = {
				query: `
				mutation CreateUser($email: String!, $password: String!) {
					createUser(userInput: {email: $email, password: $password}) {
						_id
						email
					}
				}`,
				variables: {
					email: email,
					password: password
				}
			};
		}

		try {
			console.log(requestBody);
			const resData = await helpers.queryAPI(requestBody, this.context);
			if (!this.state.isLogin){
				this.setState({isLogin: true});
				return await this.submitHandler(event);
			}
			if (resData.data.login.token) {
				this.context.login(
					resData.data.login.token,
					resData.data.login.userId,
					resData.data.login.tokenExpiration
				);
			}
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		return <form class="auth-form" onSubmit={this.submitHandler}>
			<div className="form-control">
				<label htmlFor="email">E-mail</label>
				<input type="email" id="email" ref={this.emailEl} />
			</div>
			<div className="form-control">
				<label htmlFor="password">Password</label>
				<input type="password" id="password" ref={this.passwordEl} />
			</div>
			<div className="form-actions">
				<button type="submit">Submit</button>
				<button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
			</div>
		</form>;
	}
}

export default AuthPage;