var mongoose = require('mongoose');

var scenarioSchema = mongoose.Schema({
    name: String,
    displayPopularity: {
        type: String,
        default: "off"
    },
    displayLikes: {
        type: String,
        default: "off"
    },
    displayLikesNumber: {
        type: String,
        default: "off"
    },
    displayRatings: {
        type: String,
        default: "off"
    },
    displayRatingsTotal: {
        type: String,
        default: "off"
    },
    canSortPopularity: {
        type: String,
        default: "off"
    },
    canSortLikes: {
        type: String,
        default: "off"
    },
    displayTrend: {
        type: String,
        default: "off"
    },
    sortedPopularity: {
        type: String,
        default: "off"
    },
    sortedLikes: {
        type: String,
        default: "off"
    }

});


module.exports = mongoose.model('Scenario', scenarioSchema);      
