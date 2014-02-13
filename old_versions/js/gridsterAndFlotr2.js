var fileStructure = {};
var widthWidgets = 0;
var graphInfo = {};

function getFileStructure(){
	$.ajax({
		type: 'GET',
		url: 'jsonFiles/jsonFilesStructure.json',
		datatype: 'json',
		success: function(resp){
			fileStructure = resp;
		}
	});

}

function initElements(){

	$( "#popupBasic" ).popup();

	$( "#sharePopup" ).popup();
  
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
		},
		serialize_params: function($w, wgd){ 

		    return { 
	           id: $($w).attr('id'), 
	           col: wgd.col, 
	           row: wgd.row, 
	           size_x: wgd.size_x, 
	           size_y: wgd.size_y, 
	           htmlContent : $($w).html() 
		    };
		}
	});

	getFileStructure();
}

function showDirectoryPanelUpdated(jsonDirectory, path){

	var directoryList = "";
	var directoryKeys = [];
	var directoryValues = [];

	$.each(jsonDirectory.directories, function(key, value){
		directoryList += '<li><a href="#" id="' + key + '">' + key + '</a></li>';
		directoryKeys[directoryKeys.length] = key;
		directoryValues[directoryValues.length] = value;
	});

	$('#panelDirectoryList').html(directoryList);
    $('#panelDirectoryList').listview("refresh");


    for(i=0; i<directoryKeys.length; i++){
    	directoryClickEvent(directoryKeys[i], directoryValues[i], path + "/" + directoryKeys[i])
    }

    var fileList = "";
	var fileValues = [];

	$.each(jsonDirectory.files, function(key, value){
		fileList += '<li><a href="#" id="' + value + '">' + value + '</a></li>';
		fileValues[fileValues.length] = value;
	});

	$('#panelFileList').html(fileList);
    $('#panelFileList').listview("refresh");

    for(i=0; i<fileValues.length; i++){
    	fileClickEvent(fileValues[i], path + "/" + fileValues[i] + ".json")
    }

	$('#addPanel').panel('open');
}

function directoryClickEvent(key, value, path){
	$('#' + key).on('click', function(){
		$('#addPanel').panel('close');
		showDirectoryPanelUpdated(value, path);
	});
}

function fileClickEvent(value, jsonFilePath){
	$('#' + value).on('click', function(){
		$('#addPanel').panel('close');
		showFilePanelUpdated(value, jsonFilePath);
	});
}

function showFilePanelUpdated(jsonFile, path){
	
	$.ajax({
		type: 'GET',
		url: path, 
		datatype: 'json',
		success: function(resp){

			notValidOptions = ['id', 'week', 'date','unixtime'];
    		options = [];

    		panelListOptions = "";

    		$.each(resp, function(key, value){
    			if($.inArray(key, notValidOptions) == -1){
    				options[options.length] = key;
    				panelListOptions += '<li><a href="#" id="' + jsonFile + '_' +  key + '">' + key + '</a></li>';
				}    				
    		});

    		$('#panelListCommit').html(panelListOptions);
	        $('#panelListCommit').listview("refresh");
	        
	        for(i=0;i<options.length;i++){
	          addOptionClickEvent(resp, options[i], jsonFile, path);
	        }
	        
	        $('#addPanelCommit').panel('open');
		}
	});

}

function addWidgetToGridster(id, file, option, title, activeTab, resp){
	
	gridster = $("#gridster" + activeTab).gridster().data('gridster');
    next = gridster.serialize().length;

    if(id=="")
    	id = 'graph_' + activeTab + '_' + next;

    gridster.add_widget('<li class="new externalGraph"><div class="widgetTitle">' + title + '</div><div id="' + id + 
    	'" class="innerGraph"></div></li>', 1, 1, (next%widthWidgets) + 1, ~~(next/widthWidgets) + 1);

    graphJson = {};
    graphJson.id = id;
    graphJson.file = file;
    graphJson.option = option;
    graphJson.title = title;

    graphInfo[id] = graphJson;

    drawGraph(id, resp, option);
}

function addOptionClickEvent(resp, option, file, path){
	//alert(resp[option]);

	$('#' + file + '_' + option).on('click', function(){

	    active = $('#tabs').tabs("option","active") + 1;

	    addWidgetToGridster("", path, option, file + '-' + option, active, resp);
    
    	$('#addPanelCommit').panel("close");

	});
}

function getWidgetFromJSON(widget, gridsterIndex){

	url = widget.file;

	$.ajax({
		type:'GET',
		url: url,
		datatype: 'json',
		async: false,
		success: function(resp){

			console.log(widget.id);

			addWidgetToGridster(widget.id, widget.file, widget.option, widget.title, gridsterIndex, resp);

		}
	});

}

function drawGraph(id, resp, option){

	date = resp.date;
	data = resp[option];

	toDraw = [];

    for(i = 0; i< data.length;i++){
	    toDraw[i] = [i,data[i]];
    }
	
	options = {
        HtmlText : false,
        xaxis : {
        	tickFormatter: function(x){
        		x = parseInt(x);
        		return date[x];
        	}
        },
        yaxis : {
        	max : Math.max.apply(Math, data) + 1
        },
        mouse:{
          track: true,
          relative: true,
          position: 'nw',
          trackFormatter: function(obj){return 'x = ' + date[parseInt(obj.x)] + ', y = ' + obj.y;},
          sensibility : 200
        }
  	};

  	container = document.getElementById(id);
      
  	Flotr.draw(container,[toDraw],options);

}

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

function addTab(tabIndex, tabName){

	$("#tabList").append("<li><a href='#tab" + tabIndex + "' id='tabLink" + tabIndex + 
		"' contenteditable='true' spellcheck='false' title='Click to edit tab title'>" + tabName + "</a></li>");

	$("#tabs").append("<div id='tab"+ tabIndex +"'><div class='gridster'><ul id='gridster" + tabIndex + "'></ul></div></div>");
	$("#tabs").tabs("refresh");

	$('#tabLink' + tabIndex).on('blur', function(){
		if($('#tabLink' + tabIndex).html() == '')
			$('#tabLink' + tabIndex).html('#' + tabIndex);
	});
}

function visualizeSharedDashboard(hashParam){

	$.ajax({
		url: 'phpServerSide/GetTabsFromHash.php',
		data:{
			hash: hashParam
		},
		type: 'GET',
		datatype: 'json',
		success: function(resp){
			tabs = JSON.parse(resp).tabInfo;
			widgets = JSON.parse(resp).graphInfo;
			$.each(tabs, function(i,item){

				if(i != 0){

					index = i + 1;

					addTab(index,item.name);
				}

				$('#tabLink' + (i+1)).click();

				if(item.widgets != undefined){
					$.each(item.widgets, function(j, item2){
						
						widget = widgets[item2.id];

						getWidgetFromJSON(widget, i+1)
					});
				}

			});
		}
	});


}

$(document).ready(function(){

	initElements();

	$('#tabLink1').on('blur', function(){
		if($('#tabLink1').html() == '')
			$('#tabLink1').html('#1');
	});

	$('#addChartButton').on('click', function(){
		showDirectoryPanelUpdated(fileStructure,'jsonFiles');
	});

	$('#addTabButton').on('click', function(){
		
		index = $("#tabList li").length + 1;

		addTab(index, '#' + index);

	});

	$('#shareButton').on('click', function(){
		var num_tabs = $("#tabList li").length;
		var jsons = {};
		for(i = 1; i<=num_tabs;i++){
			jsonTab = {};
			jsonTab["name"] = $('#tabLink' + i).html();
			jsonTab["widgets"] = [];

			gridster = $("#gridster" + i).gridster().data('gridster');
			widgets =  gridster.serialize();

			for(j = 0; j < widgets.length; j++){
				widgetJson = {};
				widgetJson.id = $(widgets[j]["htmlContent"])[1].id;
				widgetJson.pos = j;
				jsonTab["widgets"][jsonTab["widgets"].length] = widgetJson;
			}
			
			jsons[i-1] = jsonTab;
		}

		$.ajax({
			url : 'phpServerSide/GetHashFromTabs.php',
			type : 'POST',
			data : {
				graphInfo : graphInfo,
				tabInfo : jsons
			},
			datatype : 'json',
			success : function(resp){
				$('#sharePopupText').html(location.protocol + '//' + location.host + location.pathname + "?hash=" + resp);
				$('#sharePopup').popup("open");
			}
		});
	});

	hashParam = get('hash');

	if(hashParam != undefined){
		visualizeSharedDashboard(hashParam);
	}
});
  
  /*$('#addChartButton').on('click',function(){
  
    $.ajax({
      type:'GET',
      url:'json_files',
      datatype:'html',
      success:function(resp){
      
        directories = [];

        lis = resp.split('<ul>\n')[1].split('\n</ul>')[0].split('\n');
      
        panelList = ""
      
        $.each(lis,function(index,item){
          file = item.split('href=\"')[1].split('\">')[0];
          if(file.indexOf('/') != -1){
            directories[directories.length] = file.split('/')[0];
            panelList += '<li><a href="#" id="' + file.split('/')[0] + '">' + file.split('/')[0] + '</a></li>';
          }
        });
        
        $('#panelList').html(panelList);
        $('#panelList').listview("refresh");
        
        for(i=0;i<directories.length;i++){
          addDirectoryClickEvent(directories[i]);
        }
        
        $('#addPanel').panel('open');
      }
    });
  });*/

 //  function addDirectoryClickEvent(directory){
  
	//   $('#' + directory).on('click', function(){
	  
	//     $('#addPanel').panel('close');
	  
	//     $.ajax({
	//       type: 'GET',
	//       url: 'json_files/' + directory,
	//       datatype: 'html',
	//       success: function(resp){
	        
	//         files = [];
	        
	//         lis = resp.split('<ul>\n')[1].split('\n</ul>')[0].split('\n');
	        
	//         panelListDirectory = "";
	      
	//         $.each(lis,function(index,item){
	//           file = item.split('href=\"')[1].split('\">')[0];
	//           files[files.length] = file.split('\.json')[0];
	//           panelListDirectory += '<li><a href="#" id="' + file.split('\.json')[0] + '">' + file.split('\.json')[0] + '</a></li>';
	//         });
	        
	//         $('#panelListDirectory').html(panelListDirectory);
	//         $('#panelListDirectory').listview("refresh");
	        
	//         for(i=0;i<files.length;i++){
	//           addFileClickEvent(files[i], directory);
	//         }
	        
	//         $('#addPanelDirectory').panel('open');
	//       }
	//     });
	//   });
	// }

	// function addFileClickEvent(file, directory){

	//   $('#' + file).on('click', function(){
	    
	//     $('#addPanelDirectory').panel('close');

	//     $.ajax({
	//     	type: 'GET',
	//     	url: 'json_files/' + directory + '/' + file + '.json',
	//     	datatype: 'json',
	//     	success:function(resp){

	//     		notValidOptions = ['id', 'week', 'date','unixtime'];
	//     		options = [];

	//     		panelListOptions = "";

	//     		$.each(resp, function(key, value){
	//     			if($.inArray(key, notValidOptions) == -1){
	//     				options[options.length] = key;
	//     				panelListOptions += '<li><a href="#" id="' + file + '_' +  key + '">' + key + '</a></li>';
	// 				}    				
	//     		});

	//     		$('#panelListCommit').html(panelListOptions);
	// 	        $('#panelListCommit').listview("refresh");
		        
	// 	        for(i=0;i<options.length;i++){
	// 	          addOptionClickEvent(resp, options[i], file);
	// 	        }
		        
	// 	        $('#addPanelCommit').panel('open');
	//     	}
	//     });
	//   });
	// }

	/*function drawGraphInContainer(container,index,moreOptions){

	  json_file = "json_files/json_file" + index + ".json";

	  $.get(json_file,
	    function(data){
	    
	      date = data.date;
	      data = data.commits;
	      
	      toDraw = [];
	      
	      options = Flotr._.extend(Flotr._.clone(options), moreOptions);
	      
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
	}*/
  



