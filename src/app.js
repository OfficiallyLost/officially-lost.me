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

app.get('/:user/chat', async (req, res) => {
	res.render('chat', { user: await user.findOne({ id: req.params.user }) });
});

io.on('connection', (socket) => {
	console.log('a user has connected');
	socket.on('sendMessage', (message) => {
		console.log(message);
		socket.broadcast.emit('message', { message, username: users[socket.io] });
	});
	const users = {};
	socket.on('newUser', (user) => {
		users[socket.id] = user;
		socket.broadcast.emit('userConnected', user);
	});
	socket.on('disconnect', (user) => {
		users[socket.id] = user;
		socket.broadcast.emit('userDisconnected', user);
	});
});

app.get('/users/:user', async (req, res) => {
	res.render('dashboard', {
		user: await user.findOne({ id: req.params.user })
	});
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
	console.log(req.isUnauthenticated());
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

app.post('/login', async (req, res) => {
	console.log(await user.find());
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
	console.log(req.isUnauthenticated());
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
		res.redirect(check.full);
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
