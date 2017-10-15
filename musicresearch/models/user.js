
// Schema for a User.

var mongoose = require('mongoose');

var Rounds = require('../models/rounds.js');

var Songliked = mongoose.Schema({
    id: String,
    isLiked: Boolean
});


var Songrated = mongoose.Schema({
    id: String,
    rating: Number
});

var Songsaved = mongoose.Schema({
    id: String,
    date: { type: Date, default: Date.now }
});


var userSchema = mongoose.Schema({
    id: String,
    email: String,
    name: String,
    isAdmin: Boolean,
    songsLiked: [Songliked],
    useratings: [Songrated],
    playlist: [Songsaved],
    scenario: String,
    whereami: {
        type: String,
        default: "home"
    },
    roundorder : [String],
    rounds: Rounds.schema
});


module.exports = mongoose.model('User', userSchema);      



