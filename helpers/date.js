exports.dateToString = date => {
	if (!date) return null;
	return new Date(date).toISOString();
};