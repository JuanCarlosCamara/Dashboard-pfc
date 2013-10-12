	function showGraph(json_file, container_id, param){
	
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
	
		    //data = JSON.parse(json).data;
//		    options = JSON.parse(json).options;
	
		    graph = Flotr.draw(id, [toDraw], options);
	    },
	    'json');
	}

	(function(){
	
	  file = 'json_files/scm-companies-commits-summary.json';
	
    showGraph(file,"firstGraph","HP");
		
		showGraph(file,"secondGraph", "IBM");
		
	})();
