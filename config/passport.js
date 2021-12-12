const LocalStrategy = require('passport-local').Strategy;
const users = require('../users/allUsers').users;
const bcrypt = require('bcrypt');

module.exports = (passport, req) => {
    passport.use(
        new LocalStrategy({ usernameField: 'name' }, async (name, password, done) => {
            const user = users.find(elem => elem.name === name);
            if (!user) {
                return done(null, null, { message: 'Incorrect name.' })
            }
            if (await bcrypt.compare( password, user.password)) {
                return done(null, user);
            }
            done(null, null, { message: 'Incorrect password.' });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        const user = users.find(user => user.id === id);
        done(null, user);
    });
}