const mongoose = require('mongoose');
const id = require('shortid');

const url = new mongoose.Schema({
	short: { type: String, required: true },
	full: { type: String, required: true }
});

module.exports = mongoose.model('url', url);
