var mongoose = require('mongoose');






var administration = mongoose.Schema({
    playlistMin: Number,
    songplayedMin: Number,
    durationMin: Number,
    instructions: String
});


module.exports = mongoose.model('Administration', administration);
