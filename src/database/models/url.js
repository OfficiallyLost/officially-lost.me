const mongoose = require('mongoose');
const id = require('shortid');

const url = new mongoose.Schema({
	url: {
		short: { type: String, default: id.generate, required: true },
		full: { type: String, required: true }
	}
});

module.exports = mongoose.model('url', url);
