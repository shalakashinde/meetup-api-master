var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/meetup');

module.exports = db;
