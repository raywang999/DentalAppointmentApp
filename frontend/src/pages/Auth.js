import React, { Component } from 'react';

import './Auth.css';
import authContext from '../context/auth-context';
import helpers from '../helpers/helpers';

class AuthPage extends Component {
	static contextType = authContext;

	constructor(props) {
		super(props);
		this.emailEl = React.createRef();
		this.passwordEl = React.createRef();
	}

	submitHandler = async (event) => {
		event.preventDefault();
		const email = this.emailEl.current.value;
		const password = this.passwordEl.current.value;

		if (email.trim().length === 0 || password.trim().length === 0) {
			return;
		}

		var queryBody = `
			query Login($email: String!, $password: String!) {
				login(email: $email, password: $password){
					userId
					token
					tokenExpiration
				}
			}
		`;

		if (this.context.token) {
			queryBody = `
				mutation UpdateUser($email: String!, $password: String!) {
					updateUser(userInput: {email: $email, password: $password}){
						_id
						email
						password
					}
				}
			`;
		}

		let requestBody = {
			query: queryBody,
			variables: {
				email: email,
				password: password
			}
		};

		try {
			const resData = await helpers.queryAPI(requestBody, this.context);
			if (resData.data.login && resData.data.login.token) {
				this.context.login(
					resData.data.login.token,
					resData.data.login.userId,
					resData.data.login.tokenExpiration,
					email,
				);
			}
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		return (<React.Fragment>
			<h1>{this.context.token ? "Update Information" : "Login"}</h1>
			<form className="auth-form" onSubmit={this.submitHandler}>
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
				</div>
			</form>;
		</React.Fragment>);
	}
}

export default AuthPage;