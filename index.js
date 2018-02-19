var express = require('express'); //require.js
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var configProperty = require('./config/config');
var strategy = require('./config/strategy');



/* var index = require('./routes/index');
var tasks = require('./routes/task'); */

var meetup = require('./routes/meetup');
var authApi = require('./routes/authentication');

var port = process.env.PORT || 3000;

var app = express();


/**
 * Connect to MongoDB.
 */
mongoose.connect(configProperty.mongolabUrl);

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//set static folder
app.use(express.static(path.join(__dirname, 'client')));

//bodyparse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use the passport package in our application
app.use(passport.initialize());

// pass passport for configuration

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/meetup', strategy.isAuthenticated, meetup);
app.use('/auth', authApi);

//define routes
/* app.use('/', express.static(__dirname + '/client/dist'));
app.use('/tasks', tasks); */

app.listen(port, function () {
    console.log('Server started on port: ' + port);
});
