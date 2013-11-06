$(document).ready(function(){

  $( "#popupBasic" ).popup();
  
  $('#tabs').tabs();

  width = $('#gridster1').width();
  
  if(width > 1000)
    widthWidgets = 3;
  else if (width > 666) 
    widthWidgets = 2;
  else
    widthWidgets = 1;
 
  $("#gridster1").gridster({
    widget_margins: [10, 10],
    widget_base_dimensions: [(width-widthWidgets*10)/widthWidgets, (width-widthWidgets*10)/(2*widthWidgets)],
    draggable: {
      handle: '.widgetTitle'
    }
  });

  $('#addChartList').on('click', function(){
  
    var active = $('#tabs').tabs("option","active") + 1;
    
    var gridster = $("#gridster" + active).gridster().data('gridster');
    next = gridster.serialize().length;
    
    gridster.add_widget('<li class="new externalGraph"><div class="widgetTitle">a</div><div id="graph_' + active + '_' + next + '" class="innerGraph"></div></li>', 1, 1, (next%widthWidgets) + 1, ~~(next/widthWidgets) + 1);
    
    drawGraph(active, next);
    
    $('#addPanel').panel("close");
    
  });
  
  $('#addTabButton').on('click', function(){
    var num_tabs = $("#tabList li").length + 1;
    $("#tabList").append("<li><a href='#tab" + num_tabs + "'>#" + num_tabs + "</a></li>");
    
    $("#tabs").append("<div id='tab"+num_tabs+"'><div class='gridster'><ul id='gridster" + num_tabs + "'></ul></div></div>");
    $("#tabs").tabs("refresh");

  });
  
  $('#addChartButton').on('click',function(){
  
    $.ajax({
      type:'GET',
      url:'http://localhost:8000/json_files',
      datatype:'html',
      success:function(resp){
      
        directories = [];

        lis = resp.split('<ul>\n')[1].split('\n</ul>')[0].split('\n');
      
        panelList = ""
      
        $.each(lis,function(index,item){
          file = item.split('href=\"')[1].split('\">')[0];
          if(file.indexOf('/') != -1){
            directories[directories.length] = file;
            panelList += '<li><a href="#" id="' + file + '"> ' + file + '</a></li>'
          }
        });
        
        $('#panelList').html(panelList);
        $('#panelList').listview("refresh");
        
        $('#addPanel').panel('open');
      }
    });
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

function drawGraph(active, index){

  $('#graph_' + active + '_' + index).on('click',function(){
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
  
  drawGraphInContainer('graph_' + active + '_' + index, index,{})
}
