const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');

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

		type RootQuery {
			events: [Event!]!
		}

		type RootMutation {
			createEvent(EventInput: EventInput): Event 
		}

		schema {
			query: RootQuery
			mutation: RootMutation
		}
	`),
	rootValue: {
		events: () => {
			return Event.find().catch(err => {throw err;});
			Event.find().then(events => {
				return events.map(event => {
					return { ...event._doc, _id: event._doc._id.toString() };
				})
			}).catch(err => {
				throw err;
			});
		},
		createEvent: (args) => {
			args=args.EventInput;
			const event = new Event({
				title: args.title,
				description: args.description,
				price: +args.price, //ensure args.price is a Float
				date: new Date(args.date)
			});
			return event.save().then(result => {
				console.log(result);
				return {...result._doc};
			}).catch(err => {
				console.log(err);
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
