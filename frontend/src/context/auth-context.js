import React from 'react';

export default React.createContext({
	token: null,
	userId: null,
	email: null,
	login: ( token, userId, tokenExpiration, email) => {},
	logout: () => {}
});