const mongoose = require('mongoose');
const user = mongoose.Schema({
	id: Number,
	username: String,
	password: String
});

module.exports = mongoose.model('user', user);
