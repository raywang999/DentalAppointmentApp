import React from 'react';

const helpers = {
	queryAPI: async (requestBody, context) => {
		try {
			const res = await fetch('http://localhost:8000/graphql', {
				method: 'POST',
				body: JSON.stringify(requestBody),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + context.token
				}
			});
			if (res.status !== 200 && res.status !== 201) {
				throw new Error('Failed!');
			}
			return res.json();
		} catch (err) {
			throw err;
		}
	},
};

export default helpers;