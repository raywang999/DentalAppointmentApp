const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	dateOfBirth: {
		type: Date,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	email: String,
	phoneNumber: String,
	referrer: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	referee: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
});

module.exports = mongoose.model('Patient', patientSchema);
