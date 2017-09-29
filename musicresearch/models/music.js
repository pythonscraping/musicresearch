var mongoose = require('mongoose');

var musicSchema = mongoose.Schema({
    title: String,
    artist: {
        type: String,
        default: "No artist name provided"
    },
    path: String
});


module.exports = mongoose.model('Song', musicSchema);
