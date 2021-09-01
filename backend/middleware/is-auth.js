const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');
	req.isAuth = false;
	if (!authHeader) {
		return next();
	}
	const token = authHeader.split(' ')[1]; //Bearer Token
	if (!token || token === ''){
		return next();
	}
	try{
		decodedToken = jwt.verify(token, 'somesupersecretkey');
	} catch (err){
		return next();
	}
	if (!decodedToken) {
		return next();
	}
	req.isAuth = true;
	req.userId = decodedToken.userId;
	return next();
};