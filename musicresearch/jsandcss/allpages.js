function noBack(){window.history.forward()}
noBack();
window.onload=noBack;
window.onpageshow=function(evt){if(evt.persisted)noBack()}
window.onunload=function(){void(0)}




var CURRENTLYPLAYED = document.getElementsByTagName("audio")[0].id;



var play = function(id) {



   



  if (id) {

    oldid = CURRENTLYPLAYED;
    var old = document.getElementById(CURRENTLYPLAYED);
    old.pause();
    old.currentTime = 0;
    CURRENTLYPLAYED = id;
  }


  var v = document.getElementById(id);
  v.play();



}


$(document).on("click", '.scores >span',function() {
  var scoreselected = $( this ).attr("id").split("star")[1].trim();
  $( this ).parent("div").removeClass().addClass("score"+scoreselected).addClass("scores");
  var idselected = $( this ).attr("value");
  console.log(scoreselected, idselected);

  var data = {};
          data.id = idselected;
          data.rating = scoreselected;
          
          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
                contentType: 'application/json',
                        url: '/songrated2',            
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));
                        }});
});
