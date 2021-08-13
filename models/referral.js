const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const referralSchema = new Schema({
	patient: {
		type: Schema.Types.ObjectId,
		ref: 'Patient'
	},
	referrer: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	referee: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	toothNumber: {
		type: Number,
		required: true
	},
	consultationDate: {
		type: Date
	},
	treatmentDate: {
		type: Date
	},
	finalReportSent: {
		type: Boolean,
		required: true,
	},
},{ timestamps: true }
);

module.exports = mongoose.model('Referral', referralSchema);