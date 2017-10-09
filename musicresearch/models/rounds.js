
var mongoose = require('mongoose');

var Round = require('../models/round.js')

var rounds = mongoose.Schema({
	name: String,
    round1 : Round.schema,
    round2 : Round.schema,
    round3 : Round.schema,
    round4 : Round.schema,
    round5 : Round.schema
});


module.exports = mongoose.model('Rounds', rounds);