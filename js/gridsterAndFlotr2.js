$(document).ready(function(){

  $( "#popupBasic" ).popup();

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
    
    drawGraph(next);
    
  });
});

function drawGraphInContainer(container,index,moreOptions){

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
          sensibility : 200
        }
      };
      
      options = Flotr._.extend(Flotr._.clone(options), moreOptions);
      
      container = document.getElementById(container);
      
      Flotr.draw(container,[toDraw],options); 
    }
  );
}

function drawGraph(index){

  $('#graph' + index).on('click',function(){
    $( "#popupBasic" ).popup( "open" );
    drawGraphInContainer('popupContainer',index,{selection : {
      mode: 'x',
      fps: 30
    }});
    
    Flotr.EventAdapter.observe(document.getElementById('popupContainer'), 'flotr:select', function(area) {

      // Draw graph with new area
      graph = drawGraphInContainer('popupContainer',index,{
        selection:{
          mode: 'x',
          fps:30
        },
        xaxis: {
            min: area.x1,
            max: area.x2
        },
        yaxis: {
            min: area.y1,
            max: area.y2
        }
      });
    });

    // When graph is clicked, draw the graph with default area.
    Flotr.EventAdapter.observe(document.getElementById('popupContainer'), 'flotr:click', function() {
        drawGraphInContainer('popupContainer',index,{selection : {
        mode: 'x',
        fps: 30
      }});
    });
  
  });
  
  drawGraphInContainer('graph' + index, index,{})
}
