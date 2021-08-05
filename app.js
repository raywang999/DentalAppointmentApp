const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
	schema: buildSchema(`
		type Event {
			_id: ID!
			title: String!
			description: String!
			price: Float!
			date: String!
		}

		input EventInput {
			title: String!
			description: String!
			price: Float!
			date: String!
		}

		type User {
			_id: ID!
			email: String!
			password: String
		}

		input UserInput {
			email: String!
			password: String!
		}

		type RootQuery {
			events: [Event!]!
		}

		type RootMutation {
			createEvent(eventInput: EventInput): Event 
			createUser(userInput: UserInput): User
		}

		schema {
			query: RootQuery
			mutation: RootMutation
		}
	`),
	rootValue: {
		events: () => {
			//return Event.find().catch(err => {throw err;});
			Event.find().then(events => {
				console.log(events._doc);
				return events.map(event => {
					return { ...event._doc, _id: event._doc._id.toString() };
				})
			}).catch(err => {
				throw err;
			});
		},
		createEvent: (args) => {
			args=args.eventInput;
			const event = new Event({
				title: args.title,
				description: args.description,
				price: +args.price, //ensure args.price is a Float
				date: new Date(args.date),
				creator: '610b3764518a0c088a45fd03'
			});
			let createdEvent;
			return event.save().then(result => {
				createdEvent = {...result._doc};
				return User.findById('610b3764518a0c088a45fd03');
			}).then(user => {
				if (!user) {
					throw new Error('User doesn\'t exist.');
				}
				user.createdEvents.push(event);
				return user.save();
			}).then(result => {
				return createdEvent;
			}).catch(err => {
				console.log(err);
				throw err;
			});
		},
		createUser: (args) => {
			return User.findOne({email: args.userInput.email}).then(user => {
				if (user){
					throw new Error('User already exists.');
				}
				return bcrypt.hash(args.userInput.password, 12);
			}).then(hashedPassword => {
				const user = new User({
					email: args.userInput.email,
					password: hashedPassword
				});
				return user.save();
			}).then(result => {
				console.log(result._doc);
				return {...result._doc, password: null};
			}).catch(err => {
				throw err;
			});
		}
	},
	graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
	}@cluster0.xvemn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {app.listen(3000);}).catch(err => {
	console.log(err);
});
