const helper = require('./helper');
const env = require('./env');

const createReferral = async (patientId, refereeId) => {
	try {
		const requestBody = `
			mutation {
				createReferral(patientId: "${patientId}" refereeId: "${refereeId}") {
					_id
					referrer {
						_id
						email
					}
					referee {
						_id
						email
					}
					createdAt
					updatedAt
					consultationDate
					treatmentDate
					finalReportSent
				}
			}
		`;
		console.log(requestBody);
		return await helper.queryAPI(requestBody);
	} catch (err) {
		throw err;
	}
};

const referrals = async () => {
	try {
		console.log(await helper.login(env.user1));
		const patients = (await helper.fetchPatients()).data.patients;
		const ref = (await createReferral(patients[0]._id, env.user2._id)).data.createReferral;
		console.log(ref.patient);
		console.log(ref.referrer);
		console.log(ref.referee);
	} catch (err) {
		throw err;
	}
};

module.exports = referrals;