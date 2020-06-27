const express = require('express');
const app = express();
const path = require('path');
const db = require('./database/index');
const Urls = require('./database/models/url');
const id = require('shortid');
db.then(() => console.log('Successfully connected the database')).catch((e) => console.log(e));
process.on('unhandledRejection', () => {});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

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
