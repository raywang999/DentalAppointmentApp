const reset = require('./resetDatabase');
const authenticate = require('./auth');
const patient = require('./patient');
const env = require('./env');
const referrals = require('./referrals');

env.clientEmail = "test@test.com";
env.clientPassword = "llysc90-";

class Test {
	constructor(name, exec) {
		this.name = name;
		this.exec = exec;
	}
}

const tests = [
	new Test('Authentication', authenticate),
	new Test('Patients', patient),
	new Test('Referrals', referrals),
];

const main = async () => {
	try {
		await reset();
		console.log('Running tests...');
		var testResults = [];
		for (const test of tests){
			if (!test) continue;
			console.log(`---Testing '${test.name}'---`);
			testResults.push(await test.exec());
		};
		return testResults;
	} catch (err) {
		throw err;
	}
};

main().then((results) => {
	console.log("Success!");
	results.forEach((result) => {
		console.log(result);
	});
}).catch(err => {
	console.log(`!--Failed--!`);
	console.log(err);
});
