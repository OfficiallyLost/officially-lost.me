const mongoose = require('mongoose');
module.exports = mongoose.connect(require('../config').url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
