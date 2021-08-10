fetch = require('node-fetch');
const requestBody = {
			query: `
				query {
					events{
						_id
						title
						description
						date
						price
						creator {
							_id
							email
						}
					}
				}
			`
		};

		fetch('http://localhost:8000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				'Origin': 'http://localhost:3000'
			}
		}).then(res => {
			if (res.status !== 200 && res.status !== 201) {
				throw new Error('Failed!');
			}
			return res.json();
		}).then(resData => {
			const events = resData.data.events;
			console.log(events);
			if (this.isActive){
				this.setState({ events: events, isLoading: false });
			}
		}).catch(err => {
			console.log(err);
			if (this.isActive){
				this.setState({ isLoading: false });
			}
		});

