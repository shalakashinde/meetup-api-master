var JwtStrategy = require('passport-jwt').Strategy;
var jwt = require('jwt-simple');

// load up the user model
var User = require('../model/user');
var config = require('../config/config'); // get db config file

//find a user with jwt.id
module.exports = function (passport) {
    var opts = {};
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({ id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};


module.exports.isAuthenticated = (req, res, next) => {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            email: decoded.email
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                return next();
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No token provided.' });
    }
};

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};