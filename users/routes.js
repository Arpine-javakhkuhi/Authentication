const express = require('express');
const passport = require('passport');
const router = express.Router();
const randomQuotes = require('random-quotes');
const users = require('./allUsers').users;

const validation = (req, res, next) => {
    const name = req.body.name;
    const isNameExist = users.find(el => el.name === name);
    const isValidName = /^[a-zA-Z]{2,}$/.test(name);
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
    res.render('login', {
        title: 'Login',
    });
});

router.post('/login', (req, res, next) => {
    req.session.users = users;
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log('ERROR: ', err);
            res.render('error', {
                message: 'Authentication failed.'
            });
            return ;
        }
        if (!user) {
            res.render('login', {
                title: 'There is no such user. Please, check name and password.'
            });
            return;
        }
        req.logIn(user, (err) => {
          if (err) {
              console.log('Error: ', err);
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

router.post('/register', validation, (req, res) => {
    const id = `${Date.now()}_${Math.random()}`;
    const newUser = {
        name: req.body.name,
        password: req.body.password,
        id: id
    };
    req.session.user = {
        name: req.body.name,
    }
    req.session.users = users.slice(0);
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