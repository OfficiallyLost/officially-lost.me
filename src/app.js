const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
	res.render('home', {
		joke: 'How did you find this page again? Im lost and trying to find my way out of it!'
	});
});

app.listen(8000, () => {
	console.log('Listening on port 8000');
});

app.get('*', (req, res) => {
	res.render('404', {
		joke: "Are you Lost? I can't find this page, it doesn't exist!"
	});
});
