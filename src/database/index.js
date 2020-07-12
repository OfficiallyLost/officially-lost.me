const mongoose = require('mongoose');
module.exports = mongoose.connect(`mongodb://localhost/lost-site`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
