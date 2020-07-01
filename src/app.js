const express = require('express');
const app = express();
const path = require('path');
const db = require('./database/index');
const url = require('./database/models/url');
const user = require('./database/models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportlocal = require('passport-local');
const flash = require('express-flash');
const session = require('express-session');
const init = require('./auth/passport');
const short = require('shortid');
// const io = require('socket.io')(7000);
db.then(() => console.log('Successfully connected the database')).catch((e) => console.log(e));
process.on('unhandledRejection', () => {});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/url', async (req, res) => {
	res.render('url');
});

app.post('/url', async (req, res) => {
	const newURL = await url.create({
		short: short.generate(req.body.full),
		full: req.body.full
	});
	res.status(200).send(newURL);
});

app.get('/file/:url', async (req, res) => {
	const check = await url.findOne({ short: req.params.url });
	if (check === null) {
		res.render('404', { joke: "Thats not a correct URL! You've hit the 404 page nerd!" });
	} else {
		res.redirect(check.full);
	}
});

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

app.get('*', (req, res) => {
	console.log('someone hit the 404');
	res.render('404', {
		joke: "Are you Lost? I can't find this page, it doesn't exist!"
	});
});

app.listen(8000, () => {
	console.log('Listening on port ' + 8000);
});

function allowed() {}
