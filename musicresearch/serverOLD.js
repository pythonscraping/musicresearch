var express = require('express');
var app = express();
var passport = require('passport');
FacebookStrategy = require('passport-facebook').Strategy;



function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}



var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request'); 

const fileUpload = require('express-fileupload');
app.use(fileUpload());



var Songliked = mongoose.Schema({
    id : String, 
    isLiked : Boolean
});


var Songrated = mongoose.Schema({
    id : String, 
    rating : Number
});
// USER SCHEMA THAT IS SAVED IN THE MONGO DATABE
var userSchema = mongoose.Schema({
    id:String,
    email:String,
    name:String,
    isAdmin:Boolean,
    songsLiked : [Songliked],
    useratings : [Songrated],
    scenario: String
});


var musicSchema = mongoose.Schema({
    title:String,
    artist:String,
    path:String
});

var scenarioSchema  = mongoose.Schema({
    name:String,
    displayPopularity: { type: String, default: "off"},
    displayLikes: { type: String, default: "off"},
    displayRatings: { type: String, default: "off"},
    canSortPopularity: { type: String, default: "off"},
    canSortLikes: { type: String, default: "off"},
    displayTrend:  { type: String, default: "off"},
    sortedPopularity:  { type: String, default: "off"},
    sortedLikes: { type: String, default: "off"}

});

var User = mongoose.model('User', userSchema);
var Song = mongoose.model('Song', musicSchema);
var Scenario = mongoose.model('Scenario', scenarioSchema);
module.exports = User;

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



app.use(require('express-session')({ secret: 'sdgdrgasrgvranb25webfbvwcf', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(__dirname + '/music'));

// VIEW ENGINE
app.set('view engine', 'jade');

var ObjectId = require('mongoose').Types.ObjectId; 






passport.use(new FacebookStrategy({
    clientID: "107832313168956",
    clientSecret: "2964b2662352879e5debeef86698fbff",
    callbackURL: "http://localhost:8000/auth/facebook/callback",
    profileFields:['id','displayName','emails',"age_range","birthday","context",
    "education","gender","relationship_status","accounts", "posts"]
    }, function(accessToken, refreshToken, profile, done) {
        console.log(accessToken);
        console.log(profile._json);
        var me = new User({
            email:profile.emails[0].value,
            name:profile.displayName,
            isAdmin: false
        });

        /* save if new */
        User.findOne({email:me.email}, function(err, u) {
            if(!u) {
                me.save(function(err, me) {
                    if(err) return done(err);
                    done(null,me);
                });
            } else {
                //console.log(u);
                done(null, u);
            }
        });
  }
));







var findSongInformation = function(err,userinfo,req,res){
        if (err)
          console.log('error occured in the database');
        console.log(userinfo);
        var listoflikes = userinfo.songsLiked;
        var useratings = userinfo.useratings;
        var arrayoflikes = [];
        for (var i=0 ; i < listoflikes.length ; i++ ) {
          if (listoflikes[i].isLiked) {
            arrayoflikes.push(listoflikes[i].id);
          }
          
        }
        //console.log(arrayoflikes);

        Song.find({},function(err,listofsongs){
        if (err)
        console.log('error occured in the database');

     listofsongs.forEach(function(element) {
        element.popularity = Math.floor((Math.random() * 10) + 1);
        element.numberOfLikes = Math.floor((Math.random() * 100010) + 1);
        var possibleTrends = ["up","down"];
        element.trend=possibleTrends[Math.floor((Math.random() * 2) + 0)]
        element.trendValue=Math.floor((Math.random() * 5) + 1);;
        //console.log(element.popularity);
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


      res.render('index', 
      { 
        title: 'Hey', 
        message: 'Hello there!',
        listofsongs :listofsongs,
        displayPopularity: userinfo.displayPopularity,
        displayLikes : userinfo.displayLikes,
        displayRatings : userinfo.displayRatings,
        displayTrend : userinfo.displayTrend,
        canSortPopularity : userinfo.canSortPopularity,
        canSortLikes: userinfo.canSortLikes,
        arrayoflikess : arrayoflikes,
        useratings : useratings
      });

    });

}



app.get('/', function(req, res){
  if(req.isAuthenticated()){
      // Find user information
      User.findById(req.user._id,function(err,docs){
        Scenario.findOne({_id : docs.scenario},"-_id -name -__v",function(err,scenario){
         console.log("WPOUH:" ,scenario);
         console.log("WPOUHWPOUHWPOUH:",docs);
          var merging = Object.assign(docs.toJSON(),scenario.toJSON());
          console.log("Merging: " ,merging);
          findSongInformation(err,merging,req,res);
        })
      
        
     });
  }
  else {
    res.redirect('/auth/facebook');
  }  
});






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
app.get('/auth/facebook', passport.authenticate('facebook', {scope:["email","user_posts","user_likes" ]}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', 
{ successRedirect: '/', failureRedirect: '/login' }));



// ADMIN PAGE TO VIEW USERS INFORMATION
app.get('/admin', function(req , res){
    if(req.isAuthenticated()){
        if (req.user.isAdmin) {
            User.find(function(err,docs){
            res.render('admin',{data:docs});     
            });
        }
        else {
            res.send('Not admin');
        }
    }

    else {
        res.send('Not authenticated');
    }
  
}); 





app.post('/upload', function(req, res) {
  

  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.sampleFile;
 
 console.log(sampleFile.name+ " WOOOH");
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

app.get('/upload', function(req , res){
    if(req.isAuthenticated()){
        if (req.user.isAdmin) {
            User.find(function(err,docs){
            res.render('upload');     
            });
        }
        else {
            res.send('Not admin');
        }
    }

    else {
        res.send('Not authenticated');
    }
  
}); 


app.get('/admin/scenario', function(req , res){
    if(req.isAuthenticated()){
        if (req.user.isAdmin) {
            User.find(function(err,docs){
              res.render('scenario' , { 
              TrueFalseFields: ['displayPopularity','displayLikes','displayRatings','canSortPopularity','canSortLikes','displayTrend','sortedPopularity','sortedLikes']
              });     
            });
        }
        else {
            res.send('Not admin');
        }
    }

    else {
        res.send('Not authenticated');
    }
  
}); 



app.get('/admin/scenario/visualize', function(req , res){
    if(req.isAuthenticated()){
        if (req.user.isAdmin) {
            Scenario.find(function(err,docs){
              res.render('scenarioVisu' , { 
              scenarios: docs
              }); 
                //console.log(docs);
            });
        }
        else {
            res.send('Not admin');
        }
    }

    else {
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



app.post('/admin/scenario/delete', function(req, res){
  if(req.isAuthenticated()){
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));


  Scenario.remove({ _id: req.body.id }
    , function(err) {
    if (!err) {
            res.redirect('/admin/scenario/visualize');
    }
    else {
            res.send('Problem');
    }
});
 }
});

app.get('/dbresults', function(req , res){
    var a = Song.find({},function(err,docs){
        if (err)
            console.log('error occured in the database');
            console.log(docs);
    });     
  
}); 


app.post('/songliked', function(req, res){
  if(req.isAuthenticated()){
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));
  //console.log(" " + req.body.id + " " + req.body.isLiked);

  console.log(req.user._id);
       
User.update(
  { "_id" : req.user._id },
  { $pull: { 'songsLiked': { id: req.body.id} } }, function() {
       User.update({ "_id" : req.user._id , "songsLiked.id" : {$ne: req.body.id}}, 
  {
    $addToSet: {
        'songsLiked': {
            "id": req.body.id,
            "isLiked": req.body.isLiked
        }
    }
}, function() {
        res.send(req.body);
        });
  }
);
 }
});


app.post('/songrated', function(req, res){
  if(req.isAuthenticated()){
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));
  console.log(" " + req.body.id + " " + req.body.rating);

  console.log(req.user._id);
       
User.update(
  { "_id" : req.user._id },
  { $pull: { 'useratings': { id: req.body.id} } }, function() {
       User.update({ "_id" : req.user._id , "useratings.id" : {$ne: req.body.id}}, 
  {
    $addToSet: {
        'useratings': {
            "id": req.body.id,
            "rating": req.body.rating
        }
    }
}, function() {
        res.send(req.body);
        });
  }
);
 }
});


// UNSECURE
app.get('/userinfo/:id', function(req , res){


  var userid = req.params.id;

  Scenario.find({},function(err,scenarios){
    res.render('editUser', {
      userid : userid,
      scenarios : scenarios
    });
  });
  



});

app.post('/changeScenario', function(req , res){

  console.log('body: ' + JSON.stringify(req.body));


  User.findOne({ _id: req.body.userid }, function (err, doc){
    doc.scenario = req.body.scenario;
    doc.save();
    res.redirect('back');

  });
});








app.listen(8000);