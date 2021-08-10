const helper = require('./helper');
const env = require('./env');

env.clientEmail = "test@test.com";
env.clientPassword = "llysc90-";

authenticate = async () => {
	console.log(await helper.queryAPI(`
		mutation {
			createUser (userInput: {email: "${env.clientEmail}", password: "${env.clientPassword}"}) {
				email
			}
		}
	`));
	console.log(await helper.queryAPI(`
		mutation {
			createUser (userInput: {email: "${env.clientEmail}", password: "${env.clientPassword}"}) {
				email
			}
		}
	`));
	const loginRes = await helper.queryAPI(`
	query{
		login (email: "${env.clientEmail}", password: "${env.clientPassword}"){
			token
		}
	}
	`);
	console.log(loginRes);
	env.token = loginRes.data.login.token;
};

module.exports = authenticate;
