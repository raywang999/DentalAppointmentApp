const helper = require('./helper');
const env = require('./env');

const testPatient = {
	firstName: "Chubby",
	lastName: "Blob",
	dateOfBirth: new Date(-550, 10, 3).toISOString(),
	gender: "Yes",
	toothNumber: 36,
	email: "N/a",
	phoneNumber: null,
};

const generateRandomPatient = () => {
	return {
		firstName: helper.generateRandomString(10),
		lastName: helper.generateRandomString(10),
		dateOfBirth: helper.randomDate(new Date(1970, 0, 1), new Date(2007, 10, 3)).toISOString(),
		gender: helper.generateRandomString(3),
		toothNumber: Math.floor(Math.random() * 100),
		email: `${helper.generateRandomString(5)}@test.com`,
		phoneNumber: helper.generateRandomString(12),
	};
};

const generateRandomPatients = async (count) => {
	try {
		var result = [];
		for (var i = 0; i < count; i++) {
			result.push(await createPatient(generateRandomPatient()));
		}
		return result;
	} catch (err) {
		throw err;
	}
};

const customStringify = (patient) => {
	res = "";
	for (const [key, value] of Object.entries(patient)) {
		res += `${key}: ${isNaN(value) ? `"${value}"` : value} `;
	}
	return res;
};

const createPatient = async (patient) => {
	try {
		const queryBody =
			`mutation {
			createPatient (patientInput: {${customStringify(patient)}}) {
				_id
				firstName
				lastName
				dateOfBirth
				gender
				toothNumber
				email
				phoneNumber
			}
		}`;
		//console.log(queryBody);
		return await helper.queryAPI(queryBody);
	} catch (err) {
		throw (err);
	}
};

const fetchPatients = helper.fetchPatients;

const patients = async (numPatients) => {
	try {
		console.log(await createPatient(testPatient));
		if (!numPatients) numPatients = 5;
		console.log(await generateRandomPatients(numPatients));
		console.log(await fetchPatients());
		await helper.login(env.user2);
		console.log(await generateRandomPatients(2));
		console.log(await fetchPatients());
		await helper.login(env.user1);
		console.log(await fetchPatients());
	} catch (err) { throw err; }
};

module.exports = patients;