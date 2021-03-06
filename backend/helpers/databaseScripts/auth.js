const helper = require('./helper');
const env = require('./env');

env.user1 = {
	email: "user1@test.com",
	password: "test",
};

env.user2 = {
	email: "user2@test.com",
	password: "test",
};

env.qian = {
	email: "qian@gmail.com",
	password: "test",
};

const authenticate = async () => {
	var resData = await helper.createUser(env.user1);
	console.log(resData);
	env.user1._id = resData.data.createUser._id;
	try {
		await helper.createUser(env.user1); //should fail
	} catch (err){
		console.log(err);
	}
	resData = await helper.createUser(env.user2);
	console.log(resData);
	console.log(await helper.createUser(env.qian));
	env.user2._id = resData.data.createUser._id;
	console.log(await helper.login(env.user1));
	return {
		createdUsers: [env.qian, env.user1, env.user2],
	};
};

module.exports = authenticate;
