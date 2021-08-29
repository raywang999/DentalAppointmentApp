import React, { Component } from 'react';

import './Auth.css';
import authContext from '../context/auth-context';
import helpers from '../helpers/helpers';
import { useState, useContext, useEffect } from 'react';

export default (props) => {
	const [isLogin, setIsLogin] = useState(true);
	const emailEl = React.createRef();
	const passwordEl = React.createRef();
	const context = useContext(authContext);

	const switchModeHandler = () => {
		setIsLogin(!isLogin);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		const email = emailEl.current.value;
		const password = passwordEl.current.value;

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

		if (!isLogin) {
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
			const resData = await helpers.queryAPI(requestBody, context);
			if (!isLogin) {
				setIsLogin(true);
				return await submitHandler(event);
			}
			if (resData.data.login.token) {
				context.login(
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

	return (<form className="auth-form" onSubmit={submitHandler}>
		<div className="form-control">
			<label htmlFor="email">E-mail</label>
			<input type="email" id="email" ref={emailEl} />
		</div>
		<div className="form-control">
			<label htmlFor="password">Password</label>
			<input type="password" id="password" ref={passwordEl} />
		</div>
		<div className="form-actions">
			<button type="submit">Submit</button>
			<button type="button" onClick={switchModeHandler}>Switch to {isLogin ? 'Signup' : 'Login'}</button>
		</div>
	</form>);
}