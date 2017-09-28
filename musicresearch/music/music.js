var CURRENTLYPLAYED = document.getElementsByTagName("audio")[0].id;



function updateProgress() {
   var progress = document.getElementById("progress");
   var value = 0;
   var v = document.getElementById(CURRENTLYPLAYED);
   if (v.currentTime < 1 ) {
    value = 0.1;
    progress.style.width = value  + "%";
   }

   else if ((v.duration - v.currentTime ) < 3) {
    value = (100 / v.duration) * v.currentTime;
    progress.style.width = value - (v.duration - v.currentTime )   + "%";
   }

   else if  (v.currentTime >0) {
      value = (100 / v.duration) * v.currentTime;
       progress.style.width = value -2.5  + "%";
   }
  
   var displayedTime = document.getElementById("currentTime");
   var minutes = Math.floor(v.currentTime/60) +"";
   var seconds = Math.floor(v.currentTime % 60) + "";
   if (seconds.length > 1) {
      displayedTime.innerHTML = minutes + " : " + seconds ;
   }
   else { 
      displayedTime.innerHTML = minutes + " : 0" + seconds ;

  }

}






var play = function(id) {
  if (id) {
    oldid = CURRENTLYPLAYED;
    $("#"+oldid).parent().parent("tr").removeClass("playing");
    var old = document.getElementById(CURRENTLYPLAYED);
    old.pause();
    old.currentTime = 0;
    CURRENTLYPLAYED = id;
  }

  var d = document.getElementsByClassName(CURRENTLYPLAYED);
  d.className += " playing";

  var v = document.getElementById(CURRENTLYPLAYED);
  v.play();
  v.addEventListener("timeupdate", updateProgress, false);


  var displayedTitle = document.getElementById("displayedTitle");
  displayedTitle.innerHTML = v.getAttribute("name");


  $(".playpause.play").css("display", "none");
  $(".playpause.pause").css("display", "initial");


  $("#"+CURRENTLYPLAYED).parent().parent("tr").addClass("playing");
  //$("#"+CURRENTLYPLAYED).remove();
}

var pause = function() {
  var v = document.getElementById(CURRENTLYPLAYED);
  v.pause();
  v.addEventListener("timeupdate", updateProgress, false);
  $(".playpause.play").css("display", "initial");
  $(".playpause.pause").css("display", "none");

}



var unpause = function() {
  $("#"+CURRENTLYPLAYED).parent().parent("tr").addClass("playing");
  var v = document.getElementById(CURRENTLYPLAYED);
  v.play();
  v.addEventListener("timeupdate", updateProgress, false);
  var displayedTitle = document.getElementById("displayedTitle");
  displayedTitle.innerHTML = v.getAttribute("name");
  $(".playpause.play").css("display", "none");
  $(".playpause.pause").css("display", "initial");
}



var abandon = function(){
  $.ajax({
            type: 'POST',
                contentType: 'application/json',
                        url: '/abandon',            
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));
                        }});

}

document.getElementById('progressBar').addEventListener('click', function (e) {
    var x = e.pageX - this.offsetLeft , // or e.offsetX (less support, though)
        y = e.pageY - this.offsetTop,  // or e.offsetY
        clickedValue = x * this.max / this.offsetWidth;
    var v = document.getElementById(CURRENTLYPLAYED);
    if (x < 13) {
      v.currentTime = 0.1;
    }
    else {
      v.currentTime = x/350 * v.duration;
    }
    console.log(x, y, window.innerWidth);
});




$(document).on("click",'.like',function() {
  var whatwasclicked = $( this ).attr("value");
  console.log(whatwasclicked);
  var what = $( this );
  var data = {};
          data.id = whatwasclicked;
          data.isLiked = true;
          
          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
                contentType: 'application/json',
                        url: '/songliked',            
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));

                            what.removeClass("like").addClass("unlike");
                        }});
});


$(document).on("click", '.unlike',function() {
  var whatwasclicked = $( this ).attr("value");
  var what = $( this );
  console.log(whatwasclicked);

  var data = {};
          data.id = whatwasclicked;
          data.isLiked = false;
          
          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
                contentType: 'application/json',
                        url: '/songliked',            
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));
                            what.removeClass("unlike").addClass("like");
                        }});
});


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
                        url: '/songrated',            
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));
                        }});
});




var SORTINGORDERPOP = true;



// UNSTABLE AT THE MOMENT
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[5];
      y = rows[i + 1].getElementsByTagName("TD")[5];
      //console.log(x,y);
      //check if the two rows should switch place:
      if (SORTINGORDERPOP) {
        if (parseInt(x.getAttribute("popularity")) > parseInt(y.getAttribute("popularity"))) {
        //if so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
        }
      }

      else {
        if (parseInt(x.getAttribute("popularity")) < parseInt(y.getAttribute("popularity"))) {
        //if so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
        }
      }
      
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }


  if (SORTINGORDERPOP)
    {
      $(".popdown").css("display", "none");
      $(".popup").css("display", "initial");
    }
  else 
  {
      $(".popup").css("display", "none");
      $(".popdown").css("display", "initial");

  }
  SORTINGORDERPOP = !SORTINGORDERPOP;
}





var SORTINGORDERLIKES = true;
function sortTableByLikes() {
  console.log("something happening");
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[4];
      y = rows[i + 1].getElementsByTagName("TD")[4];
      console.log(x,y);
      //check if the two rows should switch place:
      if (SORTINGORDERLIKES) {
        if (parseInt(x.getAttribute("numberoflikes")) > parseInt(y.getAttribute("numberoflikes"))) {
        //if so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
        }
      }

      else {
        if (parseInt(x.getAttribute("numberoflikes")) < parseInt(y.getAttribute("numberoflikes"))) {
        //if so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
        }
      }
      
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }

  if (SORTINGORDERLIKES)
    {
      $(".likedown").css("display", "none");
      $(".likeup").css("display", "initial");
    }
  else 
  {
      $(".likeup").css("display", "none");
      $(".likedown").css("display", "initial");

  }

  SORTINGORDERLIKES = !SORTINGORDERLIKES;
}


