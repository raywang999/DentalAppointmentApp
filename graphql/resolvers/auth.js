const User = require('../../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
	createUser: async (args) => {
		let existingUser = await User.findOne({email: args.userInput.email});
		try{
			if (existingUser){
				throw new Error('User already exists.');
			}
			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
			const user = new User({
				email: args.userInput.email,
				password: hashedPassword
			});
			const result = await user.save();
			return {...result._doc, password: null};
		} catch(err) {
			throw err;
		}
	}
};