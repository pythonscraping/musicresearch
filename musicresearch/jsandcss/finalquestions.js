
$('.finalquestions').on("submit",function(event){
  

     canproceed = true;
     $("input[type=number].verify").each(function() {
            if(this.value.length < 1) {
                //alert(this.value + " is a valid number");
                canproceed = false;
                $(this).css( "background-color", "#ff6666" );
            }
            else {
              $(this).css( "background-color", "inherit" );
            }
          });


     $("input[type=text].verify").each(function() {
            if(this.value.length < 1) {
                //alert(this.value + " is a valid number");
                canproceed = false;
                $(this).css( "background-color", "#ff6666" );
            }
            else {
              $(this).css( "background-color", "inherit" );
            }
          });

          $("option.unchecked").each(function() {
            console.log("ehey")
              $(this).parent().css( "background-color", "white" );

              });

          $("option.unchecked:selected").each(function() {
            console.log("ehey")
              canproceed=false;
              $(this).parent().css( "background-color", "#ff6666" );

              });



      console.log(canproceed);

  if ( ! $("input.verify").is(':checked') && canproceed){
  	$(".second").css( "display", "none" );
  	$(".instructions").css( "display", "block" );

  }
  else {
    
  event.preventDefault();

  	$("input.verify:not(:checked)").parent().css( "background-color", "inherit" );
  	$("input.verify:checked").parent().css( "background-color", "#ff6666" );


  	$(".filleverything").css( "display", "block" );
  	

  }

 });

