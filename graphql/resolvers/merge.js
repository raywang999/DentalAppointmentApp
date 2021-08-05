const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const transformBooking = booking => {
	return {
		...booking._doc, 
		user: user.bind(this, booking._doc.user),
		event: singleEvent.bind(this, booking._doc.event),
		createdAt: dateToString(booking.createdAt), 
		updatedAt: dateToString(booking.updatedAt)
	}
}

const transformEvent = event => {
	return {
		...event._doc, 
		date: dateToString(event.date),
		creator: user.bind(this, event.creator)
	};
};

const user = async userId => {
	const user = await User.findById(userId);
	try {
		return {
			...user._doc, password: null,
			createdEvents: events.bind(this, user._doc.createdEvents)
		};
	} catch(err) {
		throw err;
	}
};

const events = async eventIds => {
	try {
		const events = await Event.find({_id: {$in: eventIds}});
		return events.map(event => {
			return transformEvent(event);
		});
	} catch(err){
		throw err;
	}
};

const singleEvent = async eventId => {
	try {
		const event = await Event.findById({_id: eventId});
		return {
			...event._doc,
			date: dateToString(event.date),
			creator: user.bind(this, event.creator)
		};
	} catch (err){
		throw err;
	}
};

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
