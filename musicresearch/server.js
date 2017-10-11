var express = require('express');
var app = express();
var passport = require('passport');
FacebookStrategy = require('passport-facebook').Strategy;
var async = require('async')

var PD = require("probability-distributions");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/auth/facebook');
}


function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}



var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test');

var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request');



           

const fileUpload = require('express-fileupload');
app.use(fileUpload());



var User = require('./models/user.js');
var Scenario = require('./models/scenario.js');
var Song = require('./models/music.js')

var Round = require('./models/round.js');
var Rounds = require('./models/rounds.js');

const roundcontroller = require('./controllers/roundcontroller')
 







module.exports = User;

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));



app.use(require('express-session')({
    secret: 'sdgdrgasrgvranb25webfbvwcf',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(__dirname + '/music'));
app.use(express.static(__dirname + '/jsandcss'));

// VIEW ENGINE
app.set('view engine', 'jade');

var ObjectId = require('mongoose').Types.ObjectId;


passport.use(new FacebookStrategy({
    clientID: "107832313168956",
    clientSecret: "2964b2662352879e5debeef86698fbff",
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', "age_range", "birthday", "context",
        "education", "gender", "relationship_status", "accounts", "posts"
    ]
}, function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(profile._json);
    var me = new User({
        email: profile.emails[0].value,
        name: profile.displayName,
        isAdmin: false
    });

    /* save if new */
    User.findOne({
        email: me.email
    }, function(err, found) {
        if (!found) {
            me.save(function(err, me) {
                if (err) return done(err);
                done(null, me);
            });
        } else {
            //console.log(u);
            done(null, found);
        }
    });
}));















app.get('/', ensureAuthenticated, function(req, res) {

        User.findById(req.user._id, function(err, docs) {
            
            var locationToGo = '/' + docs.whereami;
            res.redirect(locationToGo);
        });
    
});

app.get('/home', ensureAuthenticated, function(req, res) {
         res.render("welcome");
    
   
});





app.get('/explanation', ensureAuthenticated, function(req, res) {
         res.render("explanation");
    
   
});


function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}

app.post('/proceed', function(req, res) {
    console.log("user abandoning");

    User.findOne({
        _id: req.user._id
    }, function(err, doc) {
        var listofrounds = ["round1","round2","round3","round4","round5"];
        doc.roundorder = shuffle(listofrounds);
        doc.whereami = "explanation";
        doc.save();
        res.redirect("/");

    });
    
});


app.post('/nextstep', function(req, res) {
    console.log("user going to the next round");

    User.findOne({
        _id: req.user._id
    }, function(err, doc) {

        now = doc.whereami;

        if (doc.roundorder.indexOf(doc.whereami) < doc.roundorder.length-1) {
            console.log(now);
            switch(now) {

                
                case "explanation":
                    doc.whereami = doc.roundorder[0];
                    break;
                case "round1":
                    doc.whereami =  doc.roundorder[doc.roundorder.indexOf(doc.whereami)+1];
                    break;
                case "round2":
                    doc.whereami =  doc.roundorder[doc.roundorder.indexOf(doc.whereami)+1]
                    break;
                case "round3":
                    doc.whereami =  doc.roundorder[doc.roundorder.indexOf(doc.whereami)+1]
                    break;
                case "round4":
                    doc.whereami =  doc.roundorder[doc.roundorder.indexOf(doc.whereami)+1]
                    break;
                case "round5":
                    doc.whereami =  doc.roundorder[doc.roundorder.indexOf(doc.whereami)+1]
                    break;
                case "playlist":
                    doc.whereami = "abandon";
                    break;
                default:
                    doc.whereami = "home";
            } 
        }

        else {
            if(doc.whereami == "playlist"){
                doc.whereami = "abandon";
            }
            else {
                doc.whereami = "playlist";
            }
            

        }
        
        



        doc.save();
        res.redirect("/");

    });
    
});

app.get('/round*', ensureAuthenticated, roundcontroller.main);






passport.serializeUser(function(user, done) {
    //console.log(user);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// FACEBOOK AUTHENTICATION
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ["email", "user_posts", "user_likes"]
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
}));



app.post('/abandon', function(req, res) {
    console.log("user abandoning");
    User.findOneAndRemove({
        _id: req.user._id
    }, function(err, doc) {
        req.logout();
        res.send("Abandonned successfully");

    });
    
});


app.get('/abandon', function(req, res) {
    console.log("user abandoning");
    User.findOneAndRemove({
        _id: req.user._id
    }, function(err, doc) {
        req.logout();
        res.send("Abandonned successfully");

    });
    
});





app.post('/upload', function(req, res) {


    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
    let sampleFile = req.files.sampleFile;

    console.log(sampleFile.name + " WOOOH");
    // Use the mv() method to place the file somewhere on your server 
    sampleFile.mv('music/' + sampleFile.name, function(err) {
        if (err)
            return res.status(500).send(err);

        var song = new Song({
            title: req.body.title,
            path: "./" + sampleFile.name
        });

        song.save(function(err, me) {
            //if(err) return done(err);
            //done(null,me);
        });


        res.send('File uploaded!');
    });
});

app.get('/upload', function(req, res) {
    if (req.isAuthenticated()) {
        if ( ! req.user.isAdmin) {
            User.find(function(err, docs) {
                res.render('upload');
            });
        } else {
            res.send('Not admin');
        }
    } else {
        res.send('Not authenticated');
    }

});






app.get('/admin/scenario/visualize', function(req, res) {
    if (req.isAuthenticated()) {
        if (!req.user.isAdmin) {
            Scenario.find(function(err, docs) {
                res.render('scenarioVisu', {
                    scenarios: docs
                });
                //console.log(docs);
            });
        } else {
            res.send('Not admin');
        }
    } else {
        res.send('Not authenticated');
    }

});

app.post('/admin/scenario', function(req, res) {
    console.log(req.body);

    var scenario = new Scenario(req.body);

    scenario.save(function(err, me) {
        //if(err) return done(err);
        //done(null,me);
        res.redirect('back');
    });
});



app.get('/admin/rounds/creation', ensureAuthenticated, function(req, res) {
    

    Scenario.find(function(err, docs) {
                res.render('scenariocreate', {
                    scenarios: docs
                })});
});

app.post('/admin/rounds/creation', function(req, res) {
    rounds = req.body.rounds;
    lotofrounds = new Rounds();
    name = req.body.name;

    Song.find().lean().exec(function(err,allsongs){
    allsongsCopy = shuffle(allsongs);
    
    async.forEachOf (rounds, function (scenario, iii, next){ 
        
        Scenario.findOne({_id: scenario}, function(err, scenarioresult) {
        doc = allsongsCopy.slice(0+(12*iii),12+(12*iii));
        console.log(iii + "hey");
        if (err)
            console.log('error occured in the database');

        a = doc;
        uniformvalues = PD.rnorm(4,50,5).concat(PD.rnorm(4,50,10)).concat(PD.rnorm(4,100,10))
        a.forEach(function(element,index) {
            console.log(index);
            element.ratings =  Math.floor((Math.random() * 5) + 1);;
            element.popularity = Math.floor((Math.random() * 10) + 1);
            //element.numberOfLikes = Math.floor((Math.random() * 100010) + 1);
            element.numberOfLikes = Math.floor(uniformvalues[index]);

            var possibleTrends = ["up", "down"];
            element.trend = possibleTrends[Math.floor((Math.random() * 2) + 0)]
            element.trendValue = Math.floor((Math.random() * 5) + 1);;

            var tryround = new Round();
            tryround.listofsongs = a;
            tryround.scenario = scenarioresult;
            lotofrounds.name = name;
            lotofrounds['round'+(iii+1).toString()] = tryround;
        });


        console.log("something happened")
        next(); 


    });
    }, function(err) {
      /*  User.update({ _id : req.user._id},{ rounds : lotofrounds} ,function(err, test) {
                res.send(test);

             });*/
             Rounds.remove({}, function() {

                    lotofrounds.save(function(err,doc){
                        res.redirect("/admin/rounds/view");
                        console.log('iterating done');
                    });
             });

      
    });


});//song.find()
});





app.get('/admin/rounds/view', ensureAuthenticated, function(req, res) {
    

    Rounds.find(function(err, docs) {
                res.render('roundsview', {
                    rounds: docs
                })});
});



app.get('/playlist', ensureAuthenticated, function(req, res) {
    
User.findById(req.user._id, function(err, docs) {

                var listofids = [];
                for (var i = docs.playlist.length - 1; i >= 0; i--) {
                    listofids.push(docs.playlist[i].id);
                    console.log(listofids);
                }

                Song.find({_id : listofids}, function(err,songs){
                    console.log(songs);

                res.render('playlist', {
                    playlist: songs
                });
                })

            });
});


app.post('/admin/rounds/delete', function(req, res) {
    if (req.isAuthenticated()) {
        var obj = {};
        console.log('body: ' + JSON.stringify(req.body));


        Round.remove({
            _id: req.body.id
        }, function(err) {
            if (!err) {
                res.redirect('/admin/scenario/visualize');
            } else {
                res.send('Problem');
            }
        });
    }
});


app.post('/admin/scenario/delete', function(req, res) {
    if (req.isAuthenticated()) {
        var obj = {};
        console.log('body: ' + JSON.stringify(req.body));


        Scenario.remove({
            _id: req.body.id
        }, function(err) {
            if (!err) {
                res.redirect('/admin/scenario/visualize');
            } else {
                res.send('Problem');
            }
        });
    }
});

app.get('/dbresults', function(req, res) {
    var a = Song.find({}, function(err, docs) {
        if (err)
            console.log('error occured in the database');
        res.send(docs);
    });

});




app.post('/playlist', function(req, res) {
    if (req.isAuthenticated()) {
        var obj = {};
        console.log('song to add to playlist: ' + JSON.stringify(req.body));

         User.update({
            "_id": req.user._id
        }, {
            $pull: {
                'playlist': {
                    id: req.body.id
                }
            }
        }, function() {
            User.update({
                "_id": req.user._id,
                "playlist.id": {
                    $ne: req.body.id
                }
            }, {
                $addToSet: {
                    'playlist': {
                        "id": req.body.id,
                    }
                }
            }, function() {
                res.send(req.body);
            });
        });
    }

});


app.post('/removeplaylist', function(req, res) {
    if (req.isAuthenticated()) {
        var obj = {};
        console.log('song to remove from playlist: ' + JSON.stringify(req.body));

         User.update({
            "_id": req.user._id
        },
        {$pull: {'playlist': {"id" : req.body.id} }}, function() {
                res.send(req.body);
            }

        );
    }

});

app.post('/songliked', function(req, res) {
    if (req.isAuthenticated()) {
        var obj = {};
        console.log('body: ' + JSON.stringify(req.body));
        //console.log(" " + req.body.id + " " + req.body.isLiked);

        console.log(req.user._id);

        User.update({
            "_id": req.user._id
        }, {
            $pull: {
                'songsLiked': {
                    id: req.body.id
                }
            }
        }, function() {
            User.update({
                "_id": req.user._id,
                "songsLiked.id": {
                    $ne: req.body.id
                }
            }, {
                $addToSet: {
                    'songsLiked': {
                        "id": req.body.id,
                        "isLiked": req.body.isLiked
                    }
                }
            }, function() {
                res.send(req.body);
            });
        });
    }
});


app.post('/songrated', function(req, res) {
    if (req.isAuthenticated()) {
        var obj = {};
        console.log('body: ' + JSON.stringify(req.body));
        console.log(" " + req.body.id + " " + req.body.rating);

        console.log(req.user._id);

        User.update({
            "_id": req.user._id
        }, {
            $pull: {
                'useratings': {
                    id: req.body.id
                }
            }
        }, function() {
            User.update({
                "_id": req.user._id,
                "useratings.id": {
                    $ne: req.body.id
                }
            }, {
                $addToSet: {
                    'useratings': {
                        "id": req.body.id,
                        "rating": req.body.rating
                    }
                }
            }, function() {
                res.send(req.body);
            });
        });
    }
});


// UNSECURE
app.get('/userinfo/:id', function(req, res) {


    var userid = req.params.id;

    Scenario.find({}, function(err, scenarios) {
        res.render('editUser', {
            userid: userid,
            scenarios: scenarios
        });
    });




});

app.post('/changeScenario', function(req, res) {

    console.log('body: ' + JSON.stringify(req.body));


    User.findOne({
        _id: req.body.userid
    }, function(err, doc) {
        doc.scenario = req.body.scenario;
        doc.save();
        res.redirect('back');

    });
});





var administration = require("./admin.js"); 
app.use("/admin", administration);   






var createrounds = require("./createrounds.js")

app.use("/rounds", createrounds);   

app.listen(1234);