const LocalStrategy = require('passport-local').Strategy;
const users = require('../users/allUsers').users;

module.exports = (passport, req) => {
    passport.use(
        new LocalStrategy({ usernameField: 'name' }, (name, password, done) => {
            const user = users.find(elem => elem.name === name);
            if (!user) {
                return done(null, null, { message: 'Incorrect name.' })
            }
            if (user.password === password) {
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