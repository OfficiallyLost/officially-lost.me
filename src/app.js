const express = require('express');
const app = express();
const path = require('path');
const db = require('./database/index');
const url = require('./database/models/url');
const user = require('./database/models/user');
const bodyParser = require('body-parser');
const short = require('shortid');
const crypt = require('crypto-js');
const argon2 = require('argon2');
let message;
db.then(() => console.log('Successfully connected the database')).catch((e) => console.log(e));
process.on('unhandledRejection', () => {});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }))

app.get('/login', (req, res) => {
	res.render('login', { message: 'Log into your Lost account :D' });
});

app.get('/create', (req, res) => {
	res.render('create', { message: 'Create your Lost account today!' });
});

app.get('/url', async (req, res) => {
	res.render('url');
});

app.post('/create', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log(username);
	const theu = await user.findOne({ username });
	if (theu === null) {
		const enpass = await argon2.hash(password);
		console.log(enpass);
		const nu = await user.create({
			id: Date.now().toString(),
			username,
			password: enpass
		});
		console.log(nu);
		res.redirect('ty');
	} else {
		res.render('create', { message: 'Uh oh, that username already exists...' });
	}
});

app.get('/users/:user', async (req, res) => {
	res.render('dashboard', {
		user: await user.findOne({ id: req.params.user })
	});
});

app.post('/login', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const findU = await user.findOne({ username });

	if (findU === null) {
		res.render('login', { message: 'That username does not exist' });
	} else {
		try {
			if (await argon2.verify(findU.password, password)) {
				res.redirect(`/users/${findU.id}`);
			} else {
				res.render('login', { message: 'That is an incorrect password.' });
			}
		} catch (e) {
			res.render('login', { message: 'Something went wrong... Please try again.' });
			console.log(e);
		}
	}
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
