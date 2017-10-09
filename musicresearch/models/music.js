var mongoose = require('mongoose');
var random = require('mongoose-random');


var musicSchema = mongoose.Schema({
    title: String,
    artist: {
        type: String,
        default: "No artist name provided"
    },
    path: String
});


musicSchema.plugin(random, { path: 'r' });

module.exports = mongoose.model('Song', musicSchema);
