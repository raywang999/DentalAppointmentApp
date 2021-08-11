const helper = require('./helper');
const env = require('./env');

env.user1 = {
	email: "user1@test.com",
	password: "llysc90-",
};

env.user2 = {
	email: "user2@test.com",
	password: "llysc90-",
}

authenticate = async () => {
	console.log(await helper.createUser(env.user1));
	console.log(await helper.createUser(env.user1));
	console.log(await helper.createUser(env.user2));
	console.log(await helper.login(env.user1));
};

module.exports = authenticate;
