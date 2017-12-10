
var bcrypt   = require('bcrypt-nodejs');
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


var Roundplaylist = mongoose.Schema({
    roundnumber: Number,
    realround: String,
    favorites: [String],
    special : mongoose.Schema.Types.Mixed,
    date : Date
});


var userSchema = mongoose.Schema({
     local            : {
        email        : String,
        password     : String,
    },
    id: String,
    email: String,
    name: String,
    isAdmin: Boolean,
    songsLiked: [Songliked],
    useratings: [Songrated],
    useratings2: [Songrated],
    playlist: [Songsaved],
    scenario: String,
    whereami: {
        type: String,
        default: "home"
    },
    roundorder : [String],
    rounds: Rounds.schema,
    ip : String,
    playlistExt : [Roundplaylist],
    firstsurvey: mongoose.Schema.Types.Mixed,
    finalsurvey: mongoose.Schema.Types.Mixed,
    favoriteround: mongoose.Schema.Types.Mixed


});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);      



