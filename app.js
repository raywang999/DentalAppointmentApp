const makeDir = require('make-dir');
const express = require('express');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { graphqlUploadExpress } = require('graphql-upload');
const mongoose = require('mongoose');

const UPLOAD_DIRECTORY_URL = require('./config/UPLOAD_DIRECTORY_URL.js');
const apolloTypeDefs = require('./graphql/schema/index');
const apolloResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');
//const schema = require('./schema/index.mjs');

/**
 * Starts the API server.
 */
// Ensure the upload directory exists.
async function startServer() {
	await makeDir(UPLOAD_DIRECTORY_URL);

	const app = new express();
	app.use(graphqlUploadExpress({
		maxFileSize: 10000000, // 10 MB
		maxFiles: 20,
	}));
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
		//res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
		if (req.method === 'OPTIONS') {
			return res.sendStatus(200);
		}
		next();
	});
	app.use(isAuth);
	const httpServer = new http.createServer(app);

	const apolloServer = new ApolloServer({
		typeDefs: apolloTypeDefs,
		resolvers: apolloResolvers,
		context: ({req}) => {
			return {
				isAuth: req.isAuth,
				userId: req.userId,
			};
		},
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({
		app,
		path: '/'
	});

	await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve));
	console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/${apolloServer.graphqlPath}`);

	mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
		}@cluster0.xvemn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
	).then(() => { app.listen(8000); }).catch(err => {
		console.log(err);
	});
}

startServer();