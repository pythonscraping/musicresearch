
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

