const mongoose = require('mongoose');
module.exports = mongoose.connect(`mongodb://localhost/site`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
