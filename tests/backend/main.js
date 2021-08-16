const main = require('../../frontend/src/pages/backend/main');
const reset = require('./resetDatabase');

const runTests = async () => {
	try{
		await reset();
		await main();
	} catch (err){
		throw(err);
	}
};

runTests().then().catch((err) => {console.log(err);});