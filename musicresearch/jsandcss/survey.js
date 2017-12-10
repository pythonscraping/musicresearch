
$('.test').click(function(event){
  event.preventDefault();
  


  if ( ! $("input.verify").is(':checked') ){
  	$(".second").css( "display", "none" );
  	$(".instructions").css( "display", "block" );
  }
  else {

  	$("input.verify:not(:checked)").parent().parent().css( "background-color", "inherit" );
  	$("input.verify:checked").parent().parent().css( "background-color", "red" );
  	$(".filleverything").css( "display", "block" );
  	

  }

 });


$( "input.verify:checked" ).first().parent().parent().addClass("active");




$('input:not(.test):not(.a)').click(function(event){

  $(this).parent().parent().css("opacity","0.5");

$( "input.verify:checked" ).first().parent().parent().addClass("active");

if ( ! $("input.verify").is(':checked') ){
  $(".test").fadeIn().css("visibility","visible");
}


   });



$('.gotonext').click(function(event){ 

  $('.hidden2').css("visibility","visible");

});

$('.ungotonext').click(function(event){ 

  $('.hidden2').css("visibility","hidden");

});