const fetch = require('node-fetch');
const env = require('./env');

const features = {
	queryAPI : async (queryString) => {
		const requestBody = {
			query: queryString
		};

		try {
			const res = await fetch('http://192.168.56.1:8000/graphql', {
				method: 'POST',
				body: JSON.stringify(requestBody),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + env.token,
				}
			});
			if (res.status !== 200 && res.status !== 201) {
				console.log(res);
				throw new Error('queryAPI Failed!');
			}
			return await res.json();
		} catch(err){
			return err;
		};
	},
};

module.exports = {
	...features
};