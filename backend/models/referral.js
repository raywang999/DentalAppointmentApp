const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FileSchema = new Schema({
	filename: {
		type: String,
		required: true,
	},
	encoding: {
		type: String,
		required: true,
	},
	mimetype: {
		type: String,
		required: true,
	},
});

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
	comments: {
		type: String,
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
	attachments: {
		type: [{
			type: FileSchema,
			required: true,
		}],
		required: true,
	},
}, { timestamps: true }
);

module.exports = mongoose.model('Referral', referralSchema);