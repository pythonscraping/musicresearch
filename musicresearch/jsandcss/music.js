function explode(){
  $(".loader").fadeOut();
}

setTimeout(explode, 10000);



var CURRENTLYPLAYED = document.getElementsByTagName("audio")[0].id;


var MINIMUMSONGPLAYED = parseInt(document.getElementById("songplayedMin").value);
var MINIMUMTIMEPLAYED = parseInt(document.getElementById("durationMin").value)*1000;
var MINIMUMPLAYLIST   = parseInt(document.getElementById("playlistMin").value);
//alert(MINIMUMTIMEPLAYED);

canplay = true;
function noBack(){window.history.forward()}
noBack();
window.onload=noBack;
window.onpageshow=function(evt){if(evt.persisted)noBack()}
window.onunload=function(){void(0)}



/*

setInterval(function(){
  if(parseInt(localStorage.getItem("nogoback"))==1) {
    localStorage.setItem("nogoback", 0);
    location.reload(); 
  }

  }
, 500);

if(parseInt(localStorage.getItem("nogoback"))!=1) {
    window.onbeforeunload = function() { 
    localStorage.setItem("nogoback", 1);}


  }
*/


 localStorage.setItem("songscount", 0);


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


var candoubleclick = function() {
  $(document).on("dblclick", "tr",function() {
  var songToPlay = $( this ).attr("value");
  play(songToPlay);
  });

}



candoubleclick();



var check = function() {

  var favorites_ = [];
        $('#columns > .column').each(function(){ 
        favorites_.push($(this).attr("id"));

        
      });



console.log(favorites_.length,MINIMUMPLAYLIST);
//console.log(parseInt(localStorage.getItem("songscount")));
//console.log(favorites_.length);
      if (parseInt(localStorage.getItem("songscount")) > MINIMUMSONGPLAYED - 1 && favorites_.length >= MINIMUMPLAYLIST){
        $(".nextstep").css("display", "none");
        $("#sorted").css("display", "initial");
      }

      else {
        $(".nextstep").css("display", "initial");
        $("#sorted").css("display", "none");
      }
}


var play = function(id) {



   


  if(canplay){



  $(document).off("dblclick", "tr");


  localStorage.setItem("songscount",  parseInt(localStorage.getItem("songscount")) + 1);

  
  $(".hideplayer").css("visibility", "hidden");
  $(".mainplayer").css("display", "initial");
  canplay = false;
  setTimeout(function(){ 
      $(".mainplayer").css("display", "none");
      $(".hideplayer").css("visibility", "initial");


      check();
      canplay=true;

      candoubleclick();

  }, MINIMUMTIMEPLAYED);

  if (id) {

    oldid = CURRENTLYPLAYED;
    $("tr[value='"+oldid+"']").removeClass("playing");
    //$("#"+oldid).parent().parent("tr").removeClass("playing");
    var old = document.getElementById(CURRENTLYPLAYED);
    old.pause();
    old.currentTime = 0;
    CURRENTLYPLAYED = id;
  }

  $("tr[value='"+CURRENTLYPLAYED+"']").addClass("playing");

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

else {
  alert("please wait");
}
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



$(document).on("click",'.playlist',function() {



  check();


  var whatwasclicked = $( this ).attr("value");
  var artist = $( this ).attr("artist");
  var title = $( this ).attr("title");
  var htmlstring = 
  '<div id="'+whatwasclicked+'". class="column container2">'  
  + "<li>" + artist + " - "  +title + "</li> " 
  + '</div>';

  $( "#columns" ).append(htmlstring);


    check();
  $('.playbutton2').click(function(event){
  
  console.log("hey");

  var whatwasclicked = $( this ).attr("songid");
  console.log(whatwasclicked);
  play2(whatwasclicked);
    check();
});



  console.log(whatwasclicked);
  var what = $( this );
  var data = {};
          data.id = whatwasclicked;
          what.attr('class', 'removeplaylist');
          what.html("✓");
          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
                contentType: 'application/json',
                        url: '/playlist',            
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));
                            //what.attr('class', 'removeplaylist');
                            //what.html("✓");
                           // what.removeClass("like").addClass("unlike");
                        }});
});

$(document).on("click",'.removeplaylist',function() {
  var whatwasclicked = $( this ).attr("value");
  console.log(whatwasclicked);


  $( "#"+whatwasclicked + ".column" ).remove();

  check();
  var what = $( this );
  var data = {};
          data.id = whatwasclicked;
           what.attr('class', 'playlist');
                            what.html("+");
          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
                contentType: 'application/json',
                        url: '/removeplaylist',            
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));

                            //what.attr('class', 'playlist');
                            //what.html("+");
                              check();
                           // what.removeClass("like").addClass("unlike");
                        }});
});

$(document).on("click",'.like',function() {



  var whatwasclicked = $( this ).attr("value");


  console.log(whatwasclicked);
  var what = $( this );
  var data = {};
          data.id = whatwasclicked;
          data.isLiked = true;
          what.removeClass("like").addClass("unlike");
          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
                contentType: 'application/json',
                        url: '/songliked',            
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));

                            //what.removeClass("like").addClass("unlike");
                        }});
});


$(document).on("click", '.unlike',function() {
  var whatwasclicked = $( this ).attr("value");
  var what = $( this );
  console.log(whatwasclicked);

  var data = {};
          data.id = whatwasclicked;
          data.isLiked = false;
          what.removeClass("unlike").addClass("like");
          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
                contentType: 'application/json',
                        url: '/songliked',            
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));
                            //what.removeClass("unlike").addClass("like");
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
function sortTable(columnName,attribute,fst,snd) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/

  columntoSort = -1;
  example = table.getElementsByTagName("TR")[0].getElementsByTagName("TH");
  for (i = 0; i < example.length; i++) {
    console.log(example[i].textContent);
    if(example[i].textContent.indexOf(columnName) > 0) {
      columntoSort = i;
      console.log(columntoSort);
    }
  }
  
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
      x = rows[i].getElementsByTagName("TD")[columntoSort];
      y = rows[i + 1].getElementsByTagName("TD")[columntoSort];
      //console.log(x,y);
      //check if the two rows should switch place:
      if (SORTINGORDERPOP) {
        if (parseInt(x.getAttribute(attribute)) > parseInt(y.getAttribute(attribute))) {
        //if so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
        }
      }

      else {
        if (parseInt(x.getAttribute(attribute)) < parseInt(y.getAttribute(attribute))) {
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
      $(fst).css("display", "none");
      $(snd).css("display", "initial");
    }
  else 
  {
      $(snd).css("display", "none");
      $(fst).css("display", "initial");

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


function sortTable2(table_id, sortColumn){
    var tableData = document.getElementById(table_id).getElementsByTagName('tbody').item(0);
    var rowData = tableData.getElementsByTagName('tr');            
    for(var i = 0; i < rowData.length - 1; i++){
        for(var j = 0; j < rowData.length - (i + 1); j++){
            if(Number(rowData.item(j).getElementsByTagName('td').item(sortColumn).innerHTML.replace(/[^0-9\.]+/g, "")) < Number(rowData.item(j+1).getElementsByTagName('td').item(sortColumn).innerHTML.replace(/[^0-9\.]+/g, ""))){
                tableData.insertBefore(rowData.item(j+1),rowData.item(j));
            }
        }
    }
}





$(document).on("mouseover",'.removeplaylist',function(){

console.log("test");
  if($( this ).hasClass("removeplaylist")) {
    $( this ).html( "-" ); }

}
); 


$(document).on("mouseleave",'.removeplaylist',function(){

 if($( this ).hasClass("removeplaylist")) {
       $( this ).html("✓");
    }

}
); 


   

  $('#sorted').click(function(){
    console.log("hey");

    if (confirm('Are you sure you want to submit your playlist which is ordered by your preferences ?')) {
    var favorites = [];
    $('#columns > .column').each(function(){ 
    favorites.push($(this).attr("id"));

        
    });
      $('#sorted').css('display', 'none');
      $('.nextstep').css('display', 'none');

    $.post( "favorites", { favorites: favorites} , function(response){
                          console.log("something received");
                          window.location.href = response.redirect;
                      });

  }
  else {

  }
  });




$('.nextstep').click(function(event){
  
   $('.bottom-right').css('display', 'initial').fadeOut(8000);

});






var play2 = function(id) {

pause();

  var v = document.getElementById(id);
  v.play();


  var displayedTitle = document.getElementById("displayedTitle2");
  displayedTitle.innerHTML = v.getAttribute("name");



}






$('.instructions').click(function(event){
  event.preventDefault();

  $('.modal2').css('display', 'block');

  $('.modal2').click(function(){
  
     $(this).css('display', 'none');
  });


});


check();