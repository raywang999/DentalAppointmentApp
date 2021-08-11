const fetch = require('node-fetch');
const env = require('./env');

const features = {
	createUser: async (user) => {
		return await features.queryAPI(`
		mutation {
			createUser (userInput: {email: "${user.email}", password: "${user.password}"}) {
				email
			}
		}`);
	},

	login: async (user) => {
		const loginRes = await features.queryAPI(`
		query {
			login (email: "${user.email}", password: "${user.password}") {
				token
			}
		}`);
		env.token = loginRes.data.login.token;
		return loginRes;
	},

	generateRandomString: (length) => {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() *
				charactersLength));
		}
		return result;
	},

	randomDate: (start, end) => {
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	},

	queryAPI: async (queryString, variables) => {
		const requestBody = {
			query: queryString
		};

		//console.log(JSON.stringify(requestBody));

		try {
			const res = await fetch('http://192.168.56.1:8000/graphql', {
				method: 'POST',
				body: JSON.stringify(requestBody),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + env.token,
					'Origin': 'http://localhost:3000'
				}
			});
			if (res.status !== 200 && res.status !== 201) {
				console.log(res);
				throw new Error('queryAPI Failed!');
			}
			return await res.json();
		} catch (err) {
			throw err;
		};
	},
};

module.exports = {
	...features
};