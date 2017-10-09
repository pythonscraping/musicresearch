

var findSongInformation = function(err, userinfo, req, res) {
    if (err)
        console.log('error occured in the database');
    console.log(userinfo);
    var listoflikes = userinfo.songsLiked;
    var useratings = userinfo.useratings;
    var playlist = userinfo.playlist;
    var arrayoflikes = [];
    for (var i = 0; i < listoflikes.length; i++) {
        if (listoflikes[i].isLiked) {
            arrayoflikes.push(listoflikes[i].id);
        }

    }
    //console.log(arrayoflikes);

    Song.find({}).limit(15).exec(function(err, listofsongs) {
        if (err)
            console.log('error occured in the database');

        

        listofsongs.forEach(function(element) {
            element.popularity = Math.floor((Math.random() * 10) + 1);
            element.numberOfLikes = Math.floor((Math.random() * 100010) + 1);
            var possibleTrends = ["up", "down"];
            element.trend = possibleTrends[Math.floor((Math.random() * 2) + 0)]
            element.trendValue = Math.floor((Math.random() * 5) + 1);;
            console.log(element);
        });



        //sortedPopularity and sortedLikes should be EITHER OR
        sortedPopularity = userinfo.sortedPopularity;
        if (sortedPopularity == "on") {
            listofsongs.sort(function(a, b) {
                return b.popularity - a.popularity;
            })
        }

        sortedLikes = userinfo.sortedLikes;
        if (sortedLikes == "on") {
            listofsongs.sort(function(a, b) {
                return b.numberOfLikes - a.numberOfLikes;
            })
        }

        console.log(listofsongs);

        res.render('index', {
            title: 'Hey',
            message: 'Hello there!',
            listofsongs: listofsongs,
            displayPopularity: userinfo.displayPopularity,
            displayLikes: userinfo.displayLikes,
            displayRatings: userinfo.displayRatings,
            displayTrend: userinfo.displayTrend,
            canSortPopularity: userinfo.canSortPopularity,
            canSortLikes: userinfo.canSortLikes,
            arrayoflikess: arrayoflikes,
            playlist: playlist,
            useratings: useratings
        });

    });

}


var User = require('../models/user.js');
var Scenario = require('../models/scenario.js');
var Song = require('../models/music.js')
var Round = require('../models/round.js');
var Rounds = require('../models/rounds.js');



exports.main2 = (req,res) => {
	      User.findById(req.user._id, function(err, docs) {

            if (docs.scenario) {
                Scenario.findOne({
                _id: docs.scenario
                }, "-_id -name -__v", function(err, scenario) {
                    //console.log("WPOUH:", scenario);
                    //console.log("WPOUHWPOUHWPOUH:", docs);
                    var merging = Object.assign(docs.toJSON(), scenario.toJSON());
                    //console.log("Merging: ", merging);
                    findSongInformation(err, merging, req, res);
                });
            }

            else {
                Scenario.findOne({}, "-_id -name -__v", 
                    function(err, scenario) {
                    //console.log("WPOUH:", scenario);
                    //console.log("WPOUHWPOUHWPOUH:", docs);
                    var merging = Object.assign(docs.toJSON(), scenario.toJSON());
                    //console.log("Merging: ", merging);
                    findSongInformation(err, merging, req, res);
                });

            }
            


        });
}


exports.main = (req,res) => {



          User.findById(req.user._id, function(err, docs) {

           
             
            whereami = docs.whereami;
            if (true) {
            



            var listoflikes = docs.songsLiked;
            var useratings = docs.useratings;
            var playlist = docs.playlist;


            var arrayoflikes = [];
            for (var i = 0; i < listoflikes.length; i++) {
                if (listoflikes[i].isLiked) {
                    arrayoflikes.push(listoflikes[i].id);
                }

            }




            Rounds.findOne({}, function(err, rounds){

            listofsongs = rounds[whereami].listofsongs;
            userinfo = rounds[whereami].scenario;


            sortedPopularity = userinfo.sortedPopularity;
            if (sortedPopularity == "on") {
                listofsongs.sort(function(a, b) {
                    return b.popularity - a.popularity;
                })
            }

            sortedLikes = userinfo.sortedLikes;
            if (sortedLikes == "on") {
                listofsongs.sort(function(a, b) {
                    return b.numberOfLikes - a.numberOfLikes;
                })
            }


            res.render('index', {
            title: 'Hey',
            message: 'Hello there!',
            listofsongs: listofsongs,
            displayPopularity: userinfo.displayPopularity,
            displayLikes: userinfo.displayLikes,
            displayRatings: userinfo.displayRatings,
            displayTrend: userinfo.displayTrend,
            canSortPopularity: userinfo.canSortPopularity,
            canSortLikes: userinfo.canSortLikes,
            arrayoflikess: arrayoflikes,
            playlist: playlist,
            useratings: useratings,
            displayLikesNumber : userinfo.displayLikesNumber

            });

            
        });


        }

        else {
            res.redirect("/admin/scenario/creation");
        }
        });
}


exports.main3 = (req,res) => {
          res.send("ho");
}