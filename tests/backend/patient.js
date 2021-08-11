const helper = require('./helper');

const testPatient = {
	firstName: "Chubby",
	lastName: "Blob",
	dateOfBirth: new Date('October 3, 420').toISOString(),
	gender: "Yes",
	toothNumber: 36,
	email: "N/a",
	phoneNumber: null,
};

const wrap = (str) => {
	if (isNaN(str)) {
		return `"${str}"`;
	}
	return str;
}

const customStringify = (patient) => {
	res = "";
	for (const [key, value] of Object.entries(patient)){
		res += `${key}: ${wrap(value)} `;
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
			}
		}`;
		const queryRes = await helper.queryAPI(queryBody);
		console.log(queryRes);
	} catch (err){
		throw (err);
	}
}

const patients = async () => {
	try {
		await createPatient(testPatient);
	} catch (err) {throw err;}
};

module.exports = patients;