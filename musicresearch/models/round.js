var mongoose = require('mongoose');

var Song = require('../models/music.js')
var Scenario = require('../models/scenario.js');




var ExtendedmusicSchema = mongoose.Schema({
    title: String,
    artist: {
        type: String,
        default: "No artist name provided"
    },
    path: String,
    popularity : Number,
    numberOfLikes  : Number,
    trend : String,
    trendValue : Number,
    ratings: Number
});

var round = mongoose.Schema({
    listofsongs: [ExtendedmusicSchema],
    scenario : Scenario.schema
});


module.exports = mongoose.model('Round', round);
