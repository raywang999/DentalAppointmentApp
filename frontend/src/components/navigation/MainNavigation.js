import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const MainNavigation = props => (
	<AuthContext.Consumer>
		{(context) => {
			return (
				<header className="main-navigation">
					<div className="main-navigation__logo">
						<h1></h1>
					</div>
					<nav className="main-navigation__items">
						<ul>
							<li>
								<NavLink to="/auth">{context.token ? "Profile" : "Authenticate"}</NavLink>
							</li>
							<li>
								<NavLink to="/patients">Patients</NavLink>
							</li>
							<li>
								<NavLink to="/referrals">Referrals</NavLink>
							</li>
							{context.token && (
								<React.Fragment>
									<li>
										<button onClick={context.logout}>Logout</button>
									</li>
								</React.Fragment>
							)}
						</ul>
					</nav>
				</header>
			)
		}}
	</AuthContext.Consumer>
);

export default MainNavigation;