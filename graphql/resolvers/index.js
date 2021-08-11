const authResolver = require('./auth');
const eventsResolver = require('./events');
const patientResolver = require('./patient');
const bookingResolver = require('./bookings');

const rootResolver = {
	...authResolver, 
	...eventsResolver,
	...patientResolver,
	...bookingResolver
};

module.exports = rootResolver;