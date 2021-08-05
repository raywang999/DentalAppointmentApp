
const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

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
		events.map(event => {
			return {
				...event._doc, 
				creator: user.bind(this, event._doc.creator)
			};
		});
		return events;
	} catch(err){
		throw err;
	}
};

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map(event => {
				return {
					...event._doc, 
					date: new Date(event._doc.date).toISOString(),
					creator: user.bind(this, event._doc.creator)
				};
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
			let createdEvent = {
				...result._doc, 
				date: new Date(event._doc.date).toISOString(),
				creator: user.bind(this, result._doc.creator)
			};
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
	},
	createUser: async (args) => {
		let existingUser = await User.findOne({email: args.userInput.email});
		try{
			if (existingUser){
				throw new Error('User already exists.');
			}
			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
			const user = new User({
				email: args.userInput.email,
				password: hashedPassword
			});
			const result = await user.save();
			return {...result._doc, password: null};
		} catch(err) {
			throw err;
		}
	}
};