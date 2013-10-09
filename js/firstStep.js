	function showGraph(json_file, container_id, param){
	
	    $.get('json_files/' + json_file,
	    function(data){
	        
	        date = data.date;
	        data = data[param];
	        toDraw = [];
	        for(i = 0; i< date.length;i++){
	            toDraw[i] = [i,data[i]];
	        }
	    
	        id = document.getElementById(container_id);
	        
	        options = {xaxis: {
            noTicks: 3,
            tickFormatter: function(x) {
                x = parseInt(x);
                return date[x];
            }
        }};
	
		    //data = JSON.parse(json).data;
//		    options = JSON.parse(json).options;
	
		    graph = Flotr.draw(id, [toDraw], options);
	    },
	    'json');
	}

	(function(){
    showGraph('json_file1.json',"firstGraph","opened");
		
		showGraph('json_file2.json',"secondGraph", "changed");
		
	})();
