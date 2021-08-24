const helper = require('./helper');
const env = require('./env');

const createReferral = async (patientId, refereeId, toothNumber, comments) => {
	try {
		const requestBody = `
			mutation {
				createReferral(patientId: "${patientId}" refereeId: "${refereeId}" toothNumber: ${toothNumber} comments:"${comments}") {
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
					comments
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
		const ref = (await createReferral(patients[0]._id, env.user2._id, Math.floor(Math.random() * 100), "My tooth hasa  cavity")).data.createReferral;
		console.log(ref);
		for (var i=0; i<100; i++){
			await createReferral(patients[helper.randomInt(patients.length)]._id, env.user2._id, helper.randomInt(50), helper.generateRandomString(100,"a"));
		}
		console.log(await fetchReferrals());
	} catch (err) {
		throw err;
	}
};

module.exports = referrals;