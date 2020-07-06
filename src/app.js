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
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

db.then(() => console.log('Successfully connected the database')).catch((e) => console.log(e));
process.on('unhandledRejection', () => {});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
	session({
		secret: 'bye',
		cookie: {
			maxAge: 60000 * 60 * 24 * 5
		},
		saveUninitialized: false,
		resave: false,
		name: 'OfficiallyLost'
	})
);

app.post('/login', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const findU = await user.findOne({ username });

	if (findU === null) {
		res.render('login', { message: 'That username does not exist' });
	} else {
		try {
			if (await argon2.verify(findU.password, password)) {
				console.log('yes, do');
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

io.on('connection', (socket) => {
	console.log('a user has connected');
	socket.on('sendMessage', (message) => {
		console.log(users[socket.id]);
		socket.broadcast.emit('message', { message, user: users[socket.id] });
	});
	const users = {};
	socket.on('newUser', (user) => {
		users[socket.id] = user;
		console.log(users);
		socket.broadcast.emit('userConnected', user);
	});
	socket.on('disconnect', () => {
		socket.broadcast.emit('userDisconnected', users[socket.id]);
		delete users[socket.id];
	});
});

app.get('/:user/chat', async (req, res) => {
	const person = await user.findOne({ id: req.params.user });
	if (person === null) {
		console.log('user null');
		res.render('404', { joke: 'That user ID does not exist.' });
	} else {
		console.log('user not null');
		res.render('chat', { user: person });
	}
	console.log('bob');
});

app.get('/users/:user', async (req, res) => {
	const person = await user.findOne({ id: req.params.user });
	if (person === null) {
		res.render('404', { joke: 'That user ID does not exist.' });
	} else {
		res.render('dashboard', { user: person });
	}
});

app.get('/login', (req, res) => {
	console.log(`user: ${req.ip}\nurl: ${req.hostname}${req.path}`);
	res.render('login', { message: 'Log into your lost account' });
});

app.get('/create', (req, res) => {
	console.log(`user: ${req.ip}\nurl: ${req.hostname}${req.path}`);
	res.render('create', { message: 'Create your account today!' });
});

app.get('/url', async (req, res) => {
	console.log(`user: ${req.ip}\nurl: ${req.hostname}${req.path}`);
	res.render('url');
});

app.post('/create', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const passwordV = req.body.passwordVer;
	const person = await user.findOne({ username });
	if (person === null) {
		console.log(password === passwordV);
		if (passwordV === password) {
			const nu = await user.create({
				id: Date.now().toString(),
				password: await argon2.hash(password),
				username
			});
			console.log(nu);
			res.redirect('ty');
		} else {
			res.render('create', { message: 'Those passwords do not match!' });
		}
	} else {
		res.render('create', { message: 'Uh oh, that username already exists...' });
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
	console.log(`user: ${req.ip}\nurl: ${req.hostname}${req.path}`);
	const check = await url.findOne({ short: req.params.url });
	if (check === null) {
		res.render('404', { joke: "Thats not a correct URL! You've hit the 404 page nerd!" });
	} else {
		res.redirect(check.full, 200);
	}
});

app.get('/', (req, res) => {
	res.render('home');
	console.log(`user: ${req.ip}\nurl: ${req.hostname}${req.path}`);
});

app.get('/github', (req, res) => {
	console.log(`user: ${req.ip}\nurl: ${req.hostname}${req.path}`);
	res.redirect('https://github.com/OfficiallyLost/');
});

app.get('/discord', (req, res) => {
	res.redirect('https://discord.gg/FWTRPS9');
	console.log(`user: ${req.ip}\nurl: ${req.hostname}${req.path}`);
});

app.get('*', (req, res) => {
	console.log(`user: ${req.ip}\nurl: ${req.hostname}${req.path}`);
	res.render('404', {
		joke: "Are you Lost? I can't find this page, it doesn't exist!"
	});
});

http.listen(8000, () => {
	console.log('Listening on port ' + 8000);
});

function allowed(req, res, next) {}
