const Patient = require('../../models/patient');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
	patients: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		console.log(req);
		const userId = req.userId;
		try {
			const patients = await Patient.find({ $or: [{referrer: userId},{referee: userId}] });
			return patients.map(patient => {
				return transformPatient(patient);
			});
		} catch(err) {
			throw err;
		}
	},
	createEvent: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		args=args.eventInput;
		const event = new Event({
			title: args.title,
			description: args.description,
			price: +args.price, //ensure args.price is a Float
			date: new Date(args.date),
			creator: req.userId
		});
		try {
			const result = await event.save();
			let createdEvent = transformEvent(event);
			const creator = await User.findById(req.userId);
			if (!creator) {
				throw new Error(`User doesn't exist.`);
			}
			creator.createdEvents.push(event);
			await creator.save();
			return createdEvent;
		} catch(err) {
			console.log(err);
			throw err;
		}
	}
};