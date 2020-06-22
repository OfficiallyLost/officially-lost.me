const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
	res.render('home');
	console.log('someone accessed the home page');
});
app.get('/github', (req, res) => {
	res.redirect('https://github.com/OfficiallyLost/');
	console.log('someone accessed the github');
});

app.get('/discord', (req, res) => {
	res.redirect('https://discord.gg/FWTRPS9');
	console.log('someone accessed discord');
});

app.listen(8000, () => {
	console.log('Listening on port 8000');
});

app.get('*', (req, res) => {
	console.log('someone hit the 404');
	res.render('404', {
		joke: "Are you Lost? I can't find this page, it doesn't exist!"
	});
});
