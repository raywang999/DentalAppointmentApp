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
		const patientInput = args.patientInput;
		const patient = new Patient({
			firstName: patientInput.firstName,
			lastName: patientInput.lastName,
			dateOfBirth: new Date(patientInput.dateOfBirth),
			gender: patientInput.gender,
			email: patientInput.email,
			phoneNumber: patientInput.phoneNumber,
			referrer: req.userId,
			referee: null
		});
		try {
			await patient.save();
			return transformPatient(patient);
		} catch (err) {
			throw err;
		}
	}
};