const mongoose = require('mongoose');
const user = mongoose.Schema({
	id: Number,
	username: String,
	password: String,
	sessionID: String
});

module.exports = mongoose.model('user', user);
