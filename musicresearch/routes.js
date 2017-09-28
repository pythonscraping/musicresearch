module.exports=function(app) {

// FACEBOOK AUTHENTICATION
app.get('/auth/facebook', passport.authenticate('facebook', {scope:"email"}));
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
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv('music/filename.mp3', function(err) {
    if (err)
      return res.status(500).send(err);
 
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


}
