const { MongoClient } = require('mongodb');

const uri =
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
	}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DB
	}?retryWrites=true&w=majority`;

const reset = async () => {
	const client = new MongoClient(uri);
	await client.connect();
	await client.db(process.env.MONGO_DB).dropDatabase();
	client.close();
	console.log("Database Cleared!");
}

module.exports = reset;
