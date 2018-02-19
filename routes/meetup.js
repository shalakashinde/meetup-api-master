var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = require('../config/db');

//Get All meetup
router.get('/', function (req, res, next) {
    db.meetup.find(function (err, meetups) {
        if (err) {
            res.send(err);
        }
        res.json(meetups);
    })
});

//Get meetup by Id
router.get('/:id', function (req, res, next) {
    db.meetup.findOne({ _id: mongojs.ObjectId(req.params.id) }, function (err, meetup) {
        if (err) {
            res.send(err);
        }
        res.json(meetup);
    })
});

//Save task 
router.post('/', function (req, res, next) {
    var meetup = req.body;
    if (!meetup.title || !(meetup.status + '')) {
        res.status(400);
        res.json({ "error": "Invalid data" });
    } else {
        db.meetup.save(meetup, function (err, meetup) {
            if (err) {
                res.send(err);
            }
            res.json(meetup);
        })
    }
});

//delete task 
router.delete('/:id', function (req, res, next) {
    db.meetup.remove({ _id: mongojs.ObjectId(req.params.id) }, function (err, meetup) {
        if (err) {
            res.send(err);
        }
        res.json(meetup);
    })
});

//update task 
router.put('/', function (req, res, next) {
    var meetup = req.body;
    var updMeetup = {};

    if (meetup.title) {
        updMeetup.title = meetup.title;
    }
    if (meetup.status) {
        updMeetup.status = meetup.status;
    }

    if (!updMeetup) {
        res.status(400);
        res.json({ "error": "Invalid data" });
    } else {
        db.meetup.update({ _id: mongojs.ObjectId(meetup.id) }, updMeetup, {}, function (err, meetup) {
            if (err) {
                res.send(err);
            }
            res.json(meetup);
        })
    }

});

module.exports = router;
