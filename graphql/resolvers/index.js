const authResolver = require('./auth');
const eventsResolver = require('./events');
const referralsResolver = require('./referrals');
const patientResolver = require('./patient');
const bookingResolver = require('./bookings');

const rootResolver = {
	...authResolver, 
	...patientResolver,
	...referralsResolver,
	...eventsResolver,
	...bookingResolver,
};

module.exports = rootResolver;