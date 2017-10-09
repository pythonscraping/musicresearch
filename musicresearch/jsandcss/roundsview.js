$(document).on("click", 'button',function() {
  var idselected = $( this ).attr("value").trim();

  console.log(idselected);

  var data = {};
          data.id = idselected;
          
          $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
                contentType: 'application/json',
                        url: '/admin/rounds/delete',            
                        success: function(data) {
                            console.log('success');
                            //onsole.log(JSON.stringify(data));
                            location.reload();

                        }});
});
