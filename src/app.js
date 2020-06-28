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

db.then(() => console.log('Successfully connected the database')).catch((e) => console.log(e));
process.on('unhandledRejection', () => {});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
init(passportlocal, (username, email) => {
	return users.find((e) => e.email === email);
});
app.use(
	session({
		secret: 'idk',
		resave: false,
		saveUninitialized: false
	})
);

app.get('/url', allowed, async (req, res) => {
	res.render('url');
	// const newURL = await url.create({
	// 	short: 'hi',
	// 	full: req.url
	// });
	// res.status(200).send(newURL);
});

app.post('/url', async (req, res) => {
	const newURL = await url.create({
		short: short.generate(req.body.full),
		full: req.body.full
	});
	res.status(200).send(newURL);
});

app.get('/file/:url', async (req, res) => {
	console.log(req.params);
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

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/create', (req, res) => {
	res.render('create');
});

app.post('/create', async (req, res) => {
	try {
		const password = await bcrypt.hash(req.body.password, 15);
		console.log(req.body);
		const pers = await user.create({
			id: Date.now().toString(),
			name: req.body.username,
			email: req.body.email,
			password: password
		});
		console.log(pers);
		res.redirect('/thank-u');
	} catch (e) {
		console.log(e);
	}
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
);

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

function allowed() {}
