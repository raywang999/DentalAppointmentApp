const authResolver = require('./auth');
const referralsResolver = require('./referrals');
const patientResolver = require('./patient');

module.exports = {
	Query: {
		...authResolver.Query, 
		...patientResolver.Query,
		...referralsResolver.Query,
	},
	Mutation: {
		...authResolver.Mutation,
		...patientResolver.Mutation,
		...referralsResolver.Mutation,
	},
};