const express = require('express');
const path = require('path');
const usersRouter = require('./users/routes');
const session = require('express-session');
const passport = require('passport');
const users = require('./users/allUsers').users;

const app = express();
require('./config/passport')(passport);

app.use(session({
    name: 'session',
    secret: 'devsecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'pug');
app.use('/users', usersRouter);

app.get('/', (req, res) => {
    if (!req.isAuthenticated) {
        res.render('index', {
            user: null,
            users: []
        });
        return;
    }
    res.render('index', {
        user: req.session.user,
        users
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(5050, () => {
    console.log('Listening on port 5050');
});