const helper = require('./helper');
const env = require('./env');

function f(a, b) {
	console.log(a,b);
}

const feature = async () => {
	f({b:1});
	f(1,2);
};

feature();
module.exports = feature;