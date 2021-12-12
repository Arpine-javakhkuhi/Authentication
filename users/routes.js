const express = require('express');
const passport = require('passport');
const router = express.Router();
const randomQuotes = require('random-quotes');
const users = require('./allUsers').users;
const bcrypt = require('bcrypt');

const validation = (req, res, next) => {
    const name = req.body.name;
    const isNameExist = users.find(el => el.name === name);
    const isValidName = /^\S[a-zA-Z\s]+\S$/.test(name);
    if (isNameExist || !isValidName) {
        res.render('register', {
            title: "The name already exists or isn't valid!",
            notRegistered: true,
        });
        return;
    }
    return next();
};

router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.render('login', {
                error: info.message
            });
            return;
        }
        req.logIn(user, (err) => {
            if (err) {
                res.render('login', {
                    error: 'Authentication failed.'
                });
                return;
            }
            req.session.user = user;
            return res.redirect('/users/' + user.id);
        });
    })(req, res, next);
});

router.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
        return;
    }

    res.render('register', {
        title: 'Sign up',
        notRegistered: true,
    });
});

router.post('/register', validation, async (req, res) => {
    const id = `${Date.now()}_${Math.random()}`;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
        name: req.body.name,
        password: hashedPassword,
        id
    };
    req.session.user = {
        name: req.body.name,
        id
    }
    users.push(newUser);
    res.redirect('/');
});

router.get('/:id', (req, res) => {
    const user = users.find(elem => elem.id === req.params.id);
    const userQuote = randomQuotes.default().body;
    res.render('user', {
        user: user,
        randomQuote: userQuote,
    });
});


module.exports = router;