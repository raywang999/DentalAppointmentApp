const Patient = require('../../models/patient');
const { transformPatient } = require('./merge');

module.exports = {
	patients: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		const userId = req.userId;
		try {
			const patients = await Patient.find({ $or: [{ referrer: userId }, { referee: userId }] });
			const res= patients.map(patient => {
				return transformPatient(patient);
			});
			return res;
		} catch (err) {
			throw err;
		}
	},
	createPatient: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		args = args.patientInput;
		const patient = new Patient({
			firstName: args.firstName,
			lastName: args.lastName,
			dateOfBirth: new Date(args.dateOfBirth),
			gender: args.gender,
			email: args.email,
			phoneNumber: args.phoneNumber,
			referrer: req.userId,
			referee: null
		});
		try {
			await patient.save();
			let createdPatient = transformPatient(patient);
			return createdPatient;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
};