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
    
    gridster.add_widget('<li class="new"><div id="graph' + next + '" style="width:100%; height:100%"></div></li>', 2, 1, (next%widthWidgets)*2 + 1, ~~(next/widthWidgets) + 1);
    
    drawGraph(next);
    
  });
});

function drawGraph(index){
  
   json_file = "json_files/json_file" + index + ".json";
  
  $.get(json_file,
    function(data){
      data = data.changers;

      toDraw = [];

      for(i = 0; i< data.length;i++){
	      toDraw[i] = [i,data[i]];
      }
      
      options = {};
      container = document.getElementById('graph' + index);
      
      Flotr.draw(container,[toDraw],options); 
    }
  );
}
