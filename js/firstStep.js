	var jsonFirstGraph = '';
	var jsonSecondGraph = '';
	
	function insertNewValue(graph,value){
	
		newObject = [graph.data.length, parseInt(value)];
		
		graph.data[graph.data.length] = newObject;
	}

	$('#formButton').on('click', function(){
		
		if(jsonFirstGraph == null){
		
			jsonFirstGraph = {
				'options':{},
				'data': []
			};
			
		}else{
			jsonFirstGraph = JSON.parse(jsonFirstGraph);
		}
		
		if(jsonSecondGraph == null){
		
			jsonSecondGraph = {
				'options':{
          bars: {
            show: true,
            horizontal: false,
            shadowSize: 0,
            barWidth: 1
          },
          mouse: {
            track: true,
            relative: true
          },
          yaxis: {
            autoscaleMargin: 1
          },
        },
				'data': []
			};
			
		}else{
			jsonSecondGraph = JSON.parse(jsonSecondGraph);
		}
			
		insertNewValue(jsonFirstGraph, $('#fieldForm').val());
		$.cookie('firstStepFirstGraph', JSON.stringify(jsonFirstGraph));
		
		jsonFirstGraph = JSON.stringify(jsonFirstGraph);
		showGraph(jsonFirstGraph,"firstGraph");
		
		insertNewValue(jsonSecondGraph, $('#fieldForm').val());
		$.cookie('firstStepSecondGraph', JSON.stringify(jsonSecondGraph));
		
		jsonSecondGraph = JSON.stringify(jsonSecondGraph);
		showGraph(jsonSecondGraph,"secondGraph");
			
	});

	function showGraph(json, id){
	
		id = document.getElementById(id);
	
		data = JSON.parse(json).data;
		options = JSON.parse(json).options;
	
		graph = Flotr.draw(id, [data], options);
	}

	(function(){
		
		jsonFirstGraph = $.cookie('firstStepFirstGraph');
		jsonSecondGraph = $.cookie('firstStepSecondGraph');
		
		if(jsonFirstGraph != null)
			showGraph(jsonFirstGraph,"firstGraph");
		
		if(jsonSecondGraph != null)
			showGraph(jsonSecondGraph,"secondGraph");
		
	})();
