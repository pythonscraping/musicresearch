var express = require('express');
var app = express();
var passport = require('passport');
require('./config/passport')(passport); 
FacebookStrategy = require('passport-facebook').Strategy;
var async = require('async')
var useragent = require('useragent');

var PD = require("probability-distributions");

function ensureAuthenticated(req, res, next) {

 if(!useragent.is(req.headers['user-agent']).safari) {

      if (req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/signup');
 }

 else {
    res.render("safari");
 }

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
var Administration = require('./models/administration.js');
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
    saveUninitialized: false,
    cookie : {
    maxAge: 360000000// see below
    }


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



app.get("/finalcode", ensureAuthenticated, function(req,res){



     
      User.findOne({
        _id: req.user._id
    }, function(err, doc) {

        if(doc.whereami=="finalcode"){

    res.render("finalcode", {
        userid: req.user._id,
    });
        }

        else {
            res.send("404");
        }

    });
});




app.post("/finalquestions", ensureAuthenticated, function(req,res){



    User.findOne({
        _id: req.user._id
    }, function(err, doc) {

        console.log("You are he re");
        console.log(doc.whereami);

        doc.finalsurvey = req.body;
        doc.whereami = "finalcode";

        doc.save(function(err,doc) {
            console.log(err);
            console.log("is the error");
            res.redirect("/");
        });


    });
   





});


app.get("/finalquestions", ensureAuthenticated, function(req,res){
    var finalquestions = new Array();
    finalquestions.push({
        question: "How do you like our website?",
        answers: ["Very Satisfied","Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]
    })
    finalquestions.push({
        question: "How do you like the songs we recommended to you? ?",
        answers: ["Very Satisfied","Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]
    })

    finalquestions.push({
        question: "How many songs on the website you have heard before?",
        answers: ["1","2", "3", "4", "More than 4"]
    })

    finalquestions.push({
        question: "How often do you listen to any type of music during a day?",
        answers: ["All day long","Multiple times a day", "Once a day", "Never"]
    })

    
    finalquestions.push({
        question: "We will now present you with a list of ways to listen to the music. Please assign a percentage to each source that reflects the amount of time you listen to music through that source, with a total of 100%.",
        answers: ["On-demand streaming services, i.e. Spotify, Apple Music","Websites, i.e. YouTube", "Paid download, i.e. iTunes","Physical copies of music, i.e. CD"],
        type: "percentage"
    })


    finalquestions.push({
        question: "What is your age ? ",
        answers: ["18-24","25-30", "31-35", "36-45","46-55","56-65","65 and above"]
    })


    finalquestions.push({
        question: "What is your gender  ? ",
        answers: ["male","female"]
    })



    finalquestions.push({
        question: "What is the highest education level you’ve achieved?)",
        answers: ["High school","College","Bachelor Degree","Postgraduate","Others"]
    })

    finalquestions.push({
        question: "What best describes your current career situation?",
        answers: ["Student","Self-employed","Full-time employed","Part-time employed","Unemployed"]
    })

    finalquestions.push({
        question: "Please let us know where you are from?)",
        answers: ["U.S.A","Canada","Central/South America","Europe","Asia/Oceania","Australia/New Zealand","Africa","Others"]
    })



    finalquestions.push({
        question: "Do you have any suggestions for our website",
        type:"optional"
    })








    res.render("finalquestions", {finalquestions :finalquestions})
});



app.get('/', ensureAuthenticated, function(req, res) {

        User.findById(req.user._id, function(err, docs) {
            
            var locationToGo = '/' + docs.whereami;

            if(docs.whereami.indexOf("round") >= 0) {
            res.redirect("/round");
            }
            else {
                res.redirect(locationToGo);
            }
            
        });
    
});

app.get('/home', ensureAuthenticated, function(req, res) {



    Administration.findOne({},function(err,doc){
        if(doc){
            res.render("welcome", {info:doc});
        }
        else {
            res.render("welcome");
        }
    });
         
    
   
});





app.get('/explanation*', ensureAuthenticated, function(req, res) {
         res.render("explanation");
    
   
});


function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}

app.post('/proceed2', function(req, res) {
    console.log("user abandoning");

    User.findOne({
        _id: req.user._id
    }, function(err, doc) {
        var listofrounds = ["round1","round2","round3","round4"];
        shuffle(listofrounds);
        for (var i = 0; i < listofrounds.length; i++) {
            if ((i % 2)==0) {
                listofrounds.splice(i,0,"explanation"+i);
            }
        }
        doc.roundorder = listofrounds;
        doc.whereami = doc.roundorder[1];
        doc.save();
        if(doc.whereami.indexOf("round") >= 0) {
            res.redirect("/round");
        }
        else {
            res.redirect("/");
        }

    });
    
});







app.post('/nextstep2', ensureAuthenticated, function(req, res) {
    console.log("user going to the next round");

    User.findOne({
        _id: req.user._id
    }).exec(function(err, doc) {


        now = doc.whereami;
        console.log(now);

    console.log(req.body);
    doc.favoriteround = req.body;
    doc.whereami = "finalquestions";




        doc.save(function(err,doc){

            if(doc.whereami.indexOf("round") >= 0) {
                res.redirect("/round");
            }
            else {
                res.redirect("/");
            }
        });
        

    });
    
});

app.get('/nextstep', ensureAuthenticated, function(req, res) {
    console.log("user going to the next round");

    User.findOne({
        _id: req.user._id
    }, function(err, doc) {


        now = doc.whereami;

        if (doc.roundorder.indexOf(doc.whereami) < doc.roundorder.length-1) {
            console.log(now);
                if (now == "explanation"){
                    doc.whereami = doc.roundorder[0];
                }

                else {
                    doc.whereami =  doc.roundorder[doc.roundorder.indexOf(doc.whereami)+1];
                }
        }

        else {
            if(doc.whereami == "playlist"){
                doc.whereami = "finalquestions";
            }
            else {
                doc.whereami = "playlist";
            }
            

        }
        
        



        doc.save();
        if(doc.whereami.indexOf("round") >= 0) {
            res.redirect("/round");
        }
        else {
            res.redirect("/");
        }
        

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



app.post('/abandon', ensureAuthenticated, function(req, res) {
    console.log("user abandoning");
    User.findOneAndRemove({
        _id: req.user._id
    }, function(err, doc) {
        req.logout();
        res.render("abandon");

    });
    
});


app.get('/abandon', ensureAuthenticated, function(req, res) {
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
    //console.log(req.body);

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
    lotofrounds.max = req.body.max;

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
            //console.log(index);
            element.ratings =  ((Math.random() * 5)).toFixed(1);;
            element.popularity = Math.floor((Math.random() * 10) + 1);
            //element.numberOfLikes = Math.floor((Math.random() * 100010) + 1);
            element.numberOfLikes = Math.floor(uniformvalues[index]);

            var possibleTrends = ["up", "down", "equal"];
            element.trend = possibleTrends[Math.floor((Math.random() * 3) + 0)]
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

                    lotofrounds.save(function(err,doc){
                        res.redirect("/admin/rounds/view");
                        console.log('iterating done');
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
                    //console.log(listofids);
                }

                Song.find({_id : listofids}, function(err,songs){
                    //console.log(songs);

                res.render('playlist', {
                    playlist: songs,
                    playlistExt: docs.playlistExt
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


app.post('/songrated2', function(req, res) {
    if (req.isAuthenticated()) {
        var obj = {};
        console.log('body: ' + JSON.stringify(req.body));
        console.log(" " + req.body.id + " " + req.body.rating);

        console.log(req.user._id);

        User.update({
            "_id": req.user._id
        }, {
            $pull: {
                'useratings2': {
                    id: req.body.id
                }
            }
        }, function() {
            User.update({
                "_id": req.user._id,
                "useratings2.id": {
                    $ne: req.body.id
                }
            }, {
                $addToSet: {
                    'useratings2': {
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








app.post('/proceed', ensureAuthenticated, function(req, res) {
    console.log("user abandoning");



    var firstsurveyInfo = req.body;

    User.findOne({
        _id: req.user._id
    }, function(err, doc) {
       

        Rounds.findOne({}).sort({users: 1}).lean().exec( function(err, chosenROUNDS){

            // var chosenROUNDS=rounds[0];
             var listofrounds = ["round1","round2","round3","round4","round5"];

             for (var i = 0; i < listofrounds.length; i++) {
                 newListOfSongs = chosenROUNDS[listofrounds[i]].listofsongs;

                 uniformvalues = PD.rnorm(4,50,5).concat(PD.rnorm(4,50,10)).concat(PD.rnorm(4,100,10))

                newListOfSongs.forEach(function(element,index) {
                    console.log(index);
                    element.ratings =  ((Math.random() * 5)).toFixed(1);;
                    element.popularity = Math.floor((Math.random() * 10) + 1);
                    //element.numberOfLikes = Math.floor((Math.random() * 100010) + 1);
                    element.numberOfLikes = Math.floor(uniformvalues[index]);

                    var possibleTrends = ["up", "down", "equal"];
                    element.trend = possibleTrends[Math.floor((Math.random() * 3) + 0)]
                    element.trendValue = Math.floor((Math.random() * 5) + 1);;

                });

                function shuffle(a) {
                    for (let i = a.length; i; i--) {
                        let j = Math.floor(Math.random() * i);
                        [a[i - 1], a[j]] = [a[j], a[i - 1]];
                    }
                    return a;
                }

                shuffle(newListOfSongs);

             }

             doc.rounds = chosenROUNDS;
             doc.firstsurvey = firstsurveyInfo;

             doc.save(function(err,newuser){


                var listofrounds = ["round1","round2","round3","round4"];
                shuffle(listofrounds);
                /*
                for (var i = 0; i < listofrounds.length; i++) {
                    if ((i % 2)==0) {
                        listofrounds.splice(i,0,"explanation"+i);
                    }
                }*/
                newuser.roundorder = listofrounds;
                newuser.whereami = newuser.roundorder[0];
                newuser.save();
                if(newuser.whereami.indexOf("round") >= 0) {
                    res.redirect("/round");
                }
                else {
                    res.redirect("/");
                }

             });



        });

    });
    
});



app.post('/favorites', function(req, res) {
    User.findById(req.user._id, function(err, userinfo) {
        var info = req.body.favorites;
        var specialinfo = req.body.special;
        console.log(info);
        console.log(userinfo.whereami);
        console.log(userinfo.roundorder.indexOf(userinfo.whereami));
        userinfo.playlistExt.push({
            roundnumber: userinfo.roundorder.indexOf(userinfo.whereami),
            realround:userinfo.whereami,
            favorites: info,
            special : specialinfo,
            date:  Date.now()
        });
        userinfo.save(function(err,doc){

            var a = {redirect: "/nextstep"};
            res.send(a);
        });
    });

});





app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
    }));

 app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
    }));



app.get('/signup', function(req, res) {

    if(!useragent.is(req.headers['user-agent']).safari) {
        if(Object.keys(req.query).length === 0){
            Rounds.find({},function(err,rounds){


                 async.forEachOf (rounds, function (round, iii, next){ 
                    User.count({"rounds._id" : round._id},function(err,count) {
                        round.users = count;
                        round.save(function(err,doc){

                         console.log(count);
                         next(); 
                        });
                    });
                   
       
        }, function(err) {
                 res.render("signup");
                 console.log(rounds);
            });

           });
        













        }
        else {
            res.render("signup", {back: req.query});
        }
    }

    else {
        res.render("safari");
    }
});

app.get('/login', function(req, res) {

        res.render("login");
    
});




app.get('/admin/tweak', ensureAuthenticated, function(req, res) {
    
    Administration.findOne({},function(err,doc){
        if(doc){
            res.render("tweak", {info:doc});
        }
        else {
            res.render("tweak");
        }
    });
    
});


app.post('/admin/tweak', ensureAuthenticated, function(req, res) {
    

    Administration.remove({}, function(){

        var info = req.body;
        console.log(req.body);

        newAdmin = new Administration();
        newAdmin.playlistMin = info.playlistMin;
        newAdmin.songplayedMin = info.songplayedMin;
        newAdmin.durationMin = info.durationMin;
        newAdmin.instructions = info.instructions;

        newAdmin.save(function(err,doc){
            if(doc){
                res.render("tweak", {info:doc});
            }
            else {
                res.render("tweak");
            }
        });
    });
    
});


app.get('/admin/tweak/view', ensureAuthenticated, function(req, res) {
    
    Administration.findOne({},function(err,doc){
        res.send(doc);
    });
    
});