const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
	createUser: async (args) => {
		let existingUser = await User.findOne({ email: args.userInput.email });
		try {
			if (existingUser) {
				throw new Error('User already exists.');
			}
			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
			const user = new User({
				email: args.userInput.email,
				password: hashedPassword
			});
			const result = await user.save();
			return { ...result._doc, password: null };
		} catch (err) {
			throw err;
		}
	},
	updateUser: async (args, req) => {
		try {
			if (!req.isAuth) {
				throw new Error('Unauthenticated!');
			}
			const userId = req.userId;
			const user = await (User.findOne({_id: userId}));
			if (!user) {
				throw new Error('User does not exist!');
			}
			user.email = args.userInput.email;
			user.password = args.userInput.password;
			const result = await user.save();
			return {
				...result._doc,
				password: null,
			}
		} catch (err) {
			throw err;
		}
	},
	login: async ({ email, password }) => {
		const user = await User.findOne({ email: email });
		if (!user) {
			throw new Error(`User doesn't exist.`);
		}
		const isEqual = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			throw new Error(`Password is incorrect.`);
		}
		const token = jwt.sign({
			userId: user.id, email: user.email
		},
			'somesupersecretkey',
			{ expiresIn: '1h' }
		);
		return { userId: user.id, token: token, tokenExpiration: 1 };
	},
	user: async () => {
		const user = await User.findOne();
		return {
			...user._doc,
			password: null
		};
	}
};