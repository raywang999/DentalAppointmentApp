const Referral = require('../../models/referral');
const Patient = require('../../models/patient');
const { transformReferral } = require('./merge');

module.exports = {
	Query: {
		referrals: async (_, __, context) => {
			if (!context.isAuth) {
				throw new Error('Unauthenticated!');
			}
			const userId = context.userId;
			try {
				const referrals = await Referral.find({ $or: [{ referrer: userId }, { referee: userId }] });
				return referrals.map(referral => {
					return transformReferral(referral);
				});
			} catch (err) {
				throw err;
			}
		}
	},
	Mutation: {
		createReferral: async (_, args, context) => {
			if (!context.isAuth) {
				throw new Error('Unauthenticated!');
			}
			const referral = new Referral({
				patient: args.patientId,
				referrer: context.userId,
				referee: args.refereeId,
				comments: args.comments,
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
	}
};