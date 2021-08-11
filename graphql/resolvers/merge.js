const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
	return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
	console.log(userIds);
	return User.find({ _id: { $in: userIds } });
});
const features = {
	transformBooking: booking => {
		return {
			...booking._doc,
			user: user.bind(this, booking._doc.user),
			event: singleEvent.bind(this, booking._doc.event),
			createdAt: dateToString(booking.createdAt),
			updatedAt: dateToString(booking.updatedAt)
		}
	},

	transformEvent: event => {
		return {
			...event._doc,
			date: dateToString(event.date),
			creator: user.bind(this, event.creator)
		};
	},

	transformPatient: (patient) => {
		console.log(patient);
		return {
			...patient._doc,
			date: dateToString(patient.dateOfBirth),
			referrer: features.user.bind(this, patient.referrer),
			referee: features.user.bind(this, patient.referee),
		};
	},

	user: async userId => {
		if (!userId) return null;
		const user = await userLoader.load(userId.toString());
		try {
			return {
				...user._doc, password: null,
				//createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
			};
		} catch (err) {
			throw err;
		}
	},

	events: async eventIds => {
		try {
			const events = await Event.find({ _id: { $in: eventIds } });
			return events.map(event => {
				return transformEvent(event);
			});
		} catch (err) {
			throw err;
		}
	},

	singleEvent: async eventId => {
		try {
			const event = await eventLoader.load(eventId.toString());
			return event;
		} catch (err) {
			throw err;
		}
	}
};

module.exports = {
	...exports,
	...features,
}
