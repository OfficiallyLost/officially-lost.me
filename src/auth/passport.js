const { Strategy } = require('passport-local');
const bcrypt = require('bcrypt');

async function init(passport, getEmail, getID) {
	const authUser = async (email, password, done) => {
		const user = getEmail(email);
		if (user == null) {
			return done(null, false, { message: 'Hmm, we could not find that email in our database..' });
		}
		try {
			if (await bcrypt.compare(password, user.pasword)) {
				done(null, user);
			} else {
				return done(null, false, { message: 'That password is incorrect.' });
			}
		} catch (e) {
			console.log(e);
			done(e);
		}
	};
	passport.use(
		new Strategy({
			usernameField: 'email'
		}),
		auth
	);
	passport.use(new Strategy({ usernameField: 'email' }, authUser));
	passport.deserializeUser((id, done) => {
		done(null, getID);
	});
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
}

module.exports = init;
