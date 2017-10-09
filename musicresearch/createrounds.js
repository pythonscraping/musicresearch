var express = require('express');


var rounds = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test');

var User = require('./models/user.js');
var Song = require('./models/music.js')
var Scenario = require('./models/scenario.js');
var Round = require('./models/round.js');
var Rounds = require('./models/rounds.js');


rounds.get("/", function(req, res) {

	if (req.isAuthenticated()) {
		
		Song.find({}).lean().exec( function(err, doc) {
        if (err)
            console.log('error occured in the database');

        a = doc;

        a.forEach(function(element) {
            element.popularity = Math.floor((Math.random() * 10) + 1);
            element.numberOfLikes = Math.floor((Math.random() * 100010) + 1);
            var possibleTrends = ["up", "down"];
            element.trend = possibleTrends[Math.floor((Math.random() * 2) + 0)]
            element.trendValue = Math.floor((Math.random() * 5) + 1);;
            console.log(element.popularity);
        });

        console.log(a);
        
        Scenario.findOne({}).exec( function(err, scenario) {
        	var tryround = new Round();
        	tryround.listofsongs = a;
        	tryround.scenario = scenario;
        	tryround.save();

        	lotofrounds = new Rounds();
        	lotofrounds.round1 = tryround;
            lotofrounds.round1 = tryround;
            lotofrounds.round1 = tryround;
            lotofrounds.round1 = tryround;
        	lotofrounds.save(function(err,lotofrounds){
        		User.update({ _id : req.user._id},{ rounds : lotofrounds} ,function(err, test) {
        	 	res.send(test);

        	 });
        	});

        	//res.send(lotofrounds);

        	 

        });


       });




	}
	else {
		res.send("Please login first");
	}
	
});

module.exports = rounds;