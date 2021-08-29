const { MongoClient } = require('mongodb');

const env = require('./env');
const uri =
	`mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASSWORD
	}@cluster0.xvemn.mongodb.net/${env.MONGO_DB
	}?retryWrites=true&w=majority`;

const reset = async () => {
	const client = new MongoClient(uri);
	await client.connect();
	await client.db(env.MONGO_DB).dropDatabase();
	client.close();
	console.log("Database Cleared!");
}

reset();

module.exports = reset
