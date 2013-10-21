$(document).ready(function(){

  width = $(document).width();
 
  $(".gridster ul").gridster({
    widget_margins: [10, 10],
    widget_base_dimensions: [140, 140]
  });
  
  widthWidgets = ~~(width / (140*2));

  $('#addChartButton').on('click', function(){
    
    var gridster = $(".gridster ul").gridster().data('gridster');
    next = gridster.serialize().length;
    
    gridster.add_widget('<li class="new externalGraph"><div id="graph' + next + '" class="innerGraph"></div></li>', 2, 1, (next%widthWidgets)*2 + 1, ~~(next/widthWidgets) + 1);
    
    $('#graph' + next).on('click',function(){
        alert(next);
    });
    
    drawGraph(next);
    
  });
});

function drawGraph(index){
  
  json_file = "json_files/json_file" + index + ".json";
  
  $.get(json_file,
    function(data){
    
      date = data.date;
      data = data.commits;
      
      toDraw = [];

      for(i = 0; i< data.length;i++){
	      toDraw[i] = [i,data[i]];
      }
      
      options = {
        title:json_file,
        HtmlText : false,
        mouse:{
              track: true,
              relative: true,
              position: 'nw',
              trackFormatter: function(obj){return 'x = ' + date[parseInt(obj.x)] + ', y = ' + obj.y;},
              sensibility : 2
            }
      };
      container = document.getElementById('graph' + index);
      
      Flotr.draw(container,[toDraw],options); 
    }
  );
}
