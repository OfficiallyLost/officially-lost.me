const mongoose = require('mongoose');

const url = new mongoose.Schema({
	short: { type: String, required: true },
	full: { type: String, required: true }
});

module.exports = mongoose.model('url', url);
