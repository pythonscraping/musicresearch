
$('.test').click(function(event){
  event.preventDefault();
  


  if ( ! $("input.verify").is(':checked') ){
  	alert("click");
  }
  else {

  	$("input.verify:not(:checked)").parent().css( "background-color", "inherit" );
  	$("input.verify:checked").parent().css( "background-color", "red" );

  }

 });

