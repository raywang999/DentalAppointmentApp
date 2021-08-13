const helper = require('./helper');
const env = require('./env');

const createReferral = async (patientId, refereeId, toothNumber) => {
	try {
		const requestBody = `
			mutation {
				createReferral(patientId: "${patientId}" refereeId: "${refereeId}" toothNumber: ${toothNumber}) {
					_id
					patient {
						_id
						firstName
						lastName
						dateOfBirth
						gender
						phoneNumber
						email
						referrer {
							_id
							email
							password
						}
						referee {
							_id
							email
							password
						}
					}
					referrer {
						_id
						email
					}
					referee {
						_id
						email
					}
					toothNumber
					createdAt
					updatedAt
					consultationDate
					treatmentDate
					finalReportSent
				}
			}
		`;
		return await helper.queryAPI(requestBody);
	} catch (err) {
		throw err;
	}
};

const fetchReferrals = async () => {
	const requestBody = `query {
		referrals {
			_id
			patient {
				firstName
				dateOfBirth
			}
		}
	}`;
	try {
		return await helper.queryAPI(requestBody);
	} catch (err) {
		throw err;
	}
};

const referrals = async () => {
	try {
		console.log(await helper.login(env.user1));
		const patients = (await helper.fetchPatients()).data.patients;
		const ref = (await createReferral(patients[0]._id, env.user2._id, Math.floor(Math.random() * 100))).data.createReferral;
		console.log(ref);
		console.log(await fetchReferrals());
	} catch (err) {
		throw err;
	}
};

module.exports = referrals;