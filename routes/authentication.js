var express = require('express');
var router = express.Router();
var User = require('../model/user');
var config = require('../config/config');
var jwt = require('jwt-simple');

// create a new user account (POST http://localhost:8080/auth/signup)
router.post('/signup', function (req, res) {
    debugger;
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, msg: 'Please pass email and password.' });
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'emailId already exists.' });
            }
            res.json({ success: true, msg: 'Successful created new user.' });
        });
    }
});

// route to authenticate a user (POST http://localhost:8080/auth/authenticate)
router.post('/authenticate', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });
});

module.exports = router;