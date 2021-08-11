const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Patient {
	_id: ID!
	firstName: String!
	lastName: String!
	dateOfBirth: String!
	gender: String! 
	toothNumber: Int!
	phoneNumber: String
	email: String
	referrer: User
	referee: User
}

type Referral{
	_id: ID!
	patient: Patient!
	referrer: User!
	referee: User!
	createdAt: String!
	updatedAt: String!
	transferReceived: Boolean!
	consultationDate: String!
	treatmentDate: String!
	finalReportSent: Boolean!
}

type User {
	_id: ID!
	email: String!
	password: String
	referrals: [Referral!]!
	patients: [Patient!]!
}

type authData {
	userId: ID!
	token: String!
	tokenExpiration: Int!
}

input PatientInput {
	firstName: String!
	lastName: String!
	dateOfBirth: String!
	gender: String! 
	toothNumber: Int!
	email: String
	phoneNumber: String
}

input UserInput {
	email: String!
	password: String!
}

type RootQuery {
	patients: [Patient!]!
	referrals: [Referral!]!
	login(email: String!, password: String!): authData!
}

type RootMutation {
	createPatient(patientInput: PatientInput!): Patient
	createUser(userInput: UserInput): User
	referPatient(eventId: ID!): Referral!
	cancelReferral(referralId: ID!): Referral!
}

schema {
	query: RootQuery
	mutation: RootMutation
}`);