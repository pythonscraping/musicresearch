var express = require('express');


var admin = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test');

var User = require('./models/user.js');




// ADMIN PAGE TO VIEW USERS INFORMATION
admin.get('/', function(req, res) {
	//console.log(req);
    if (req.isAuthenticated()) {
        if (! req.user.isAdmin) {
            User.find(function(err, docs) {
                res.render('admin', {
                    data: docs
                });
            });
        } else {
            res.send('Not admin');
        }
    } else {
        res.send('Not authenticated');
    }

});



// CREATE A NEW SCENARIO
admin.get('/scenario', function(req, res) {
    if (req.isAuthenticated()) {
        if ( ! req.user.isAdmin) {
            User.find(function(err, docs) {
                res.render('scenario', {
                    TrueFalseFields: ['displayPopularity', 'displayLikes', 'displayLikesNumber', 'displayRatings', 'canSortPopularity', 'canSortLikes', 'displayTrend', 'sortedPopularity', 'sortedLikes', 'displayRatingsTotal']
                });
            });
        } else {
            res.send('Not admin');
        }
    } else {
        res.send('Not authenticated');
    }

});


module.exports = admin;