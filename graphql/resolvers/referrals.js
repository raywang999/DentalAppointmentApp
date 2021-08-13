const Referral = require('../../models/referral');
const Patient = require('../../models/patient');
const User = require('../../models/user');
const { transformReferral } = require('./merge');

module.exports = {
	referrals: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		const userId = req.userId;
		try {
			const referrals = await Referral.find({ $or: [{ referrer: userId }, { referee: userId }] });
			return referrals.map(referral => {
				return transformReferral(referral);
			});
		} catch (err) {
			throw err;
		}
	},
	createReferral: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		const referral = new Referral({
			patient: args.patientId,
			referrer: req.userId,
			referee: args.refereeId,
			toothNumber: +args.toothNumber,
			consultationDate: null,
			treatmentDate: null,
			finalReportSent: false,
		});
		try {
			await referral.save();
			let createdReferral = transformReferral(referral);
			const patient = await Patient.findById(args.patientId);
			patient.referee = args.refereeId;
			await patient.save();
			return createdReferral;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
};