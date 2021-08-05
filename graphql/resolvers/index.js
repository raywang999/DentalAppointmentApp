const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./bookings');

const rootResolver = {
	...authResolver, 
	...eventsResolver,
	...bookingResolver
};

module.exports = rootResolver;