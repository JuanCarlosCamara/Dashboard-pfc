	function showGraph(json_file, container_id, param, moreOptions){
	
	    $.get(json_file,
	    function(data){
	        
	        date = data.date;
	        data = data[param];
	        toDraw = [];
	        for(i = 0; i< date.length;i++){
	            toDraw[i] = [i,data[i]];
	        }
	    
	        id = document.getElementById(container_id);
	        
	        options = {
	          HtmlText : false,
	          lines:{show : true},
	          title : param,
	          xaxis: {
              noTicks: 3,
              tickFormatter: function(x) {
                  x = parseInt(x);
                  return date[x];
              },
              title : "Date"
            },
            yaxis:{
              title: "Commits" 
            },
            mouse:{
              track: true,
              relative: true,
              position: 'nw',
              trackFormatter: function(obj){return 'x = ' + date[parseInt(obj.x)] + ', y = ' + obj.y;},
              sensibility : 2
            }
          };
	
	        options = Flotr._.extend(Flotr._.clone(options), moreOptions);
		    
		        // Draw graph with default options, overwriting with passed options

          function drawGraph(opts) {

              // Clone the options, so the 'options' variable always keeps intact.
              var o = Flotr._.extend(Flotr._.clone(options), opts || {});

              // Return a new graph.
              return Flotr.draw(
              id, [toDraw], o);
          }

          // Actually draw the graph.
          graph = drawGraph();

          // Hook into the 'flotr:select' event.
          Flotr.EventAdapter.observe(id, 'flotr:select', function(area) {

              // Draw graph with new area
              graph = drawGraph({
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
          Flotr.EventAdapter.observe(id, 'flotr:click', function() {
              drawGraph();
          });
		      
	      },
	      'json');
	}

	(function(){
	
	  file = 'json_files/scm-companies-commits-summary.json';
	
    showGraph(file,"firstGraph","HP",{});
		
		showGraph(file,"secondGraph", "IBM", {selection : {
      mode: 'x',
      fps: 30
    },lines : {fill : true}});
    
    $(".gridster ul").gridster({
      widget_margins: [10, 10],
      widget_base_dimensions: [140, 140]
    });
		
	})();
