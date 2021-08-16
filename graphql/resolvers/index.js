const authResolver = require('./auth');
const referralsResolver = require('./referrals');
const patientResolver = require('./patient');

const rootResolver = {
	...authResolver, 
	...patientResolver,
	...referralsResolver,
};

module.exports = rootResolver;