const authResolver = require('./auth');
const referralsResolver = require('./referrals');
const patientResolver = require('./patient');
const graphQLUpload = require('graphql-upload');
const { storeUpload, storeMultipleUploads }= require('../../helpers/storeUpload');

module.exports = {
	Upload: graphQLUpload,
	Query: {
		...authResolver.Query,
		...patientResolver.Query,
		...referralsResolver.Query,
	},
	Mutation: {
		...authResolver.Mutation,
		...patientResolver.Mutation,
		...referralsResolver.Mutation,
		singleUpload: async (_, args) => {
			return await storeUpload(args.file);
		},
		multipleUpload: async (_, args) => {
			return await storeMultipleUploads(args.files);
		},
	},
};