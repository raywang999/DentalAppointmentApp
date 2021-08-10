const reset = require('./resetDatabase');
const authenticate = require('./auth');
const patient = require('./patient');

const env = require('./env');

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
];

main = async () => {
	await reset();
	console.log('Running tests...');
	for (const test of tests){
		console.log(`---Testing '${test.name}'---`);
		try {
			await test.exec();
		} catch (err){
			throw err;
		}
	};
};

main().catch(err => {
	console.log(`!--Failed '${test.name}'--!`);
	console.log(err);
});
