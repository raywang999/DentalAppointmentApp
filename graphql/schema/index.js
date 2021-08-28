const { gql } = require('apollo-server-core');

module.exports = gql(`
type Patient {
	_id: ID!
	firstName: String!
	lastName: String!
	dateOfBirth: String!
	gender: String! 
	phoneNumber: String
	email: String
	referrer: User
	referee: User
}

type Referral{
	_id: ID!
	patient: Patient!
	toothNumber: Int!
	comments: String
	referrer: User!
	referee: User!
	createdAt: String!
	updatedAt: String!
	consultationDate: String
	treatmentDate: String
	finalReportSent: Boolean!
}

type User {
	_id: ID!
	email: String!
	password: String
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
	email: String
	phoneNumber: String
}

input UserInput {
	email: String!
	password: String!
}

type Query {
	patients: [Patient!]!
	referrals: [Referral!]!
	users: [User!]!
	login(email: String!, password: String!): authData!
}

type Mutation {
	createUser(userInput: UserInput): User
	createPatient(patientInput: PatientInput!): Patient
	createReferral(patientId: ID!, refereeId: ID!, toothNumber: Int!, comments: String): Referral!
	cancelReferral(referralId: ID!): Referral!
}
`);