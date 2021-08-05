const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map(event => {
				return transformEvent(event);
			});
		} catch(err) {
			throw err;
		}
	},
	createEvent: async (args) => {
		args=args.eventInput;
		const event = new Event({
			title: args.title,
			description: args.description,
			price: +args.price, //ensure args.price is a Float
			date: new Date(args.date),
			creator: '610b4fa8b03b840f7e9384e1'
		});
		try {
			const result = await event.save();
			let createdEvent = transformEvent(event);
			const creator = await User.findById(result._doc.creator);
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