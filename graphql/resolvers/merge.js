const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const Patient = require('../../models/patient');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
	return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
	return User.find({ _id: { $in: userIds } });
});

const patientLoader = new DataLoader((patientId) => {
	return Patient.find({ _id: patientId });
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
		const res= {
			...patient._doc,
			dateOfBirth: dateToString(patient.dateOfBirth),
			referrer: features.user.bind(this, patient.referrer),
			referee: features.user.bind(this, patient.referee),
		};
		return res;
	},

	transformReferral: (referral) => {
		const res ={
			...referral._doc,
			createdAt: dateToString(referral.createdAt),
			updatedAt: dateToString(referral.updatedAt),
			consulationDate: dateToString(referral.consulationDate),
			treatmentDate: dateToString(referral.treatmentDate),
			patient: features.patient.bind(this, referral.patient),
			referrer: features.user.bind(this, referral.referrer),
			referee: features.user.bind(this, referral.referee),
		};
		return res;
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

	patient: async patientId => {
		const patient = await patientLoader.load(patientId.toString());
		return features.transformPatient(patient);
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
