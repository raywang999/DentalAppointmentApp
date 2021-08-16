const DataLoader = require('dataloader');

const User = require('../../models/user');
const Patient = require('../../models/patient');
const { dateToString } = require('../../helpers/date');

const userLoader = new DataLoader((userIds) => {
	return User.find({ _id: { $in: userIds } });
});

const patientLoader = new DataLoader((patientId) => {
	return Patient.find({ _id: patientId });
});

const features = {
	transformPatient: (patient) => {
		return {
			...patient._doc,
			dateOfBirth: dateToString(patient.dateOfBirth),
			referrer: features.user.bind(this, patient.referrer),
			referee: features.user.bind(this, patient.referee),
		};
	},

	transformReferral: (referral) => {
		return {
			...referral._doc,
			createdAt: dateToString(referral.createdAt),
			updatedAt: dateToString(referral.updatedAt),
			consulationDate: dateToString(referral.consulationDate),
			treatmentDate: dateToString(referral.treatmentDate),
			patient: features.patient.bind(this, referral.patient),
			referrer: features.user.bind(this, referral.referrer),
			referee: features.user.bind(this, referral.referee),
		};
	},

	user: async userId => {
		if (!userId) return null;
		const user = await userLoader.load(userId.toString());
		return {
			...user._doc, password: null,
		};
	},

	patient: async patientId => {
		const patient = await patientLoader.load(patientId.toString());
		return features.transformPatient(patient);
	},
};

module.exports = {
	...exports,
	...features,
}
