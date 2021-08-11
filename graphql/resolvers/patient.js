const Patient = require('../../models/patient');
const User = require('../../models/user');
//const wut = require('./merge');
const { transformPatient } = require('./merge');

module.exports = {
	patients: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		console.log(req);
		const userId = req.userId;
		try {
			const patients = await Patient.find({ $or: [{ referrer: userId }, { referee: userId }] });
			return patients.map(patient => {
				return transformPatient(patient);
			});
		} catch (err) {
			throw err;
		}
	},
	createPatient: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		args = args.patientInput;
		console.log(new Date(args.dateOfBirth));
		const patient = new Patient({
			firstName: args.firstName,
			lastName: args.lastName,
			dateOfBirth: new Date(args.dateOfBirth),
			gender: args.gender,
			toothNumber: +args.toothNumber,
			email: args.email,
			phoneNumber: args.phoneNumber,
			referrer: req.userId,
			referee: null
		});
		try {
			await patient.save();
			let createdPatient = transformPatient(patient);
			console.log(createdPatient);
			return createdPatient;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
};