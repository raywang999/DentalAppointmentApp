const fetch = require('node-fetch');
const env = require('./env');

const features = {
	createUser: async (user) => {
		return await features.queryAPI(`
		mutation {
			createUser (userInput: {email: "${user.email}", password: "${user.password}"}) {
				_id
				email
				password
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

	generateRandomString: (length, characters) => {
		var result = '';
		if (!characters)
			characters = '1234567890';
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

	randomInt: (end) => {
		return Math.floor(Math.random()*end);
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
			const resJson = await res.json();
			if (res.status !== 200 && res.status !== 201 || resJson.errors) {
				console.log(resJson);
				throw new Error('queryAPI Failed!');
			}
			return resJson;
		} catch (err) {
			throw err;
		};
	},
	fetchPatients: async () => {
		const queryBody = `
		query {
			patients {
				_id
				firstName
				dateOfBirth
			}
		}`;
		try {
			const res = await features.queryAPI(queryBody);
			return res;
		} catch (err) {
			throw err;
		}
	},
};

module.exports = {
	...features
};