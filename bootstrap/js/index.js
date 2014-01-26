var graphInfo = {};

function getActiveTabNumber(){
	var tabs = $('.nav.nav-tabs li');
	for(i = 0; i < tabs.length; i++){
		if($(tabs[i]).hasClass('active'))
			return i + 1;
	}
}

function getSpecificGridster(tab){
	return gridster = $("#gridster" + tab).gridster().data('gridster');
}

$(document).on('click','.tabLink',function(e){
	activeTab = getActiveTabNumber();
	$('.MetricsEvol').removeClass('MetricsEvol').addClass('MetricsEvolHidden');
	$('#gridster' + activeTab + ' .MetricsEvolHidden').removeClass('MetricsEvolHidden').addClass('MetricsEvol');
})

$(document).ready(function(){

	Loader.data_ready(function(){
		initFunctions();
	});
});

function initFunctions(){

	function resizedw(){
	    Report.convertGlobal();
	    Report.convertStudies();
	}

	function get(name){
	    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
	        return decodeURIComponent(name[1]);
	}

	function addWidgetToGridster(gridster, id, title, options, size_x, size_y, col, row){

		var optionsString = "";
		var optionClass = "";

		for(var i=0; i < options.length; i++){
			if(options[i].key != "class"){
				optionsString += options[i].key + '="' + options[i].value + '" ';
			}else{
				optionClass = options[i].value;
			}
		}

		gridster.add_widget('<li id="' + id + '" class="new externalGraph"><div class="widgetTitle">' + title + '</div><div id="graph' + id + '" class="innerGraph ' + optionClass + '" style="width:100%; height:80%" ' + optionsString + ' data-min="true"></div></li>', size_x, size_y, col, row);

		
	}

	function visualizeSharedDashboard(hashParam){

		$.ajax({
			url: '../phpServerSide/GetTabsFromHash.php',
			data:{
				hash: hashParam
			},
			type: 'GET',
			dataType: 'json',
			success: function(resp){

				currentTab = 1;
				gridster = getSpecificGridster(currentTab);

				$.each(resp.graphInfo, function(key, value){
					console.log(key.split('tab')[1].split('_')[0]);
					console.log(currentTab);
					
					if(key.split('tab')[1].split('_')[0] != currentTab){
						currentTab = key.split('tab')[1].split('_')[0];

						if(currentTab > $('.nav.nav-tabs li').length){
							$('#addTabLink').click();
						}
						
						$('.tabLink')[currentTab-1].click();
						gridster = getSpecificGridster(currentTab);
					}

					addWidgetToGridster(gridster, value.id, value.title, value.options, value.size_x, value.size_y, value.col, value.row);
					var graphJson = {};
					graphJson.title = value.title;
					graphJson.id = value.id;
					graphJson.options = value.options;
					graphJson.col = 0;
					graphJson.row = 0;
					graphJson.size_x = 0;
					graphJson.size_y = 0;

					graphInfo[value.id] = graphJson;

					resizedw();
				})
			}
		});

	}

	$('#shareDashboardLink').on('click', function(e){

		var numTabs = $('.nav-tabs li').length;
		for(var i=1; i<=numTabs; i++){
			gridster = getSpecificGridster(i);
			serialize_gridster = gridster.serialize();
			$.each(serialize_gridster, function(index, item){
				graphInfo[item.id].col = item.col;
				graphInfo[item.id].row = item.row;
				graphInfo[item.id].size_x = item.size_x;
				graphInfo[item.id].size_y = item.size_y;
			});
		}

		$.ajax({
			url : '../phpServerSide/GetHashFromTabs.php',
			type : 'POST',
			data : {
				graphInfo : graphInfo
			},
			datatype : 'json',
			success : function(resp){
				//$('#sharePopupText').html(location.protocol + '//' + location.host + location.pathname + "?hash=" + resp);
				//$('#sharePopup').popup("open");
				console.log(location.protocol + '//' + location.host + location.pathname + "?hash=" + resp);
				$('#shareText').html(location.protocol + '//' + location.host + location.pathname + "?hash=" + resp);
				$('#sharingModal').modal('toggle');
			}
		});
	});

	width = $('#gridster1').width();
	console.log(width);

	if(width > 1000)
		widthWidgets = 3;
	else if (width > 666) 
		widthWidgets = 2;
	else
		widthWidgets = 1;

	console.log('width = ' + (width-widthWidgets*10)/widthWidgets);
	console.log('height = ' + (width-widthWidgets*10)/(2*widthWidgets));

	grid_size = (width-widthWidgets*10)/(2*widthWidgets) - 30;
	grid_margin = 10;

	$("#gridster1").gridster({
		widget_margins: [grid_margin,grid_margin],
		widget_base_dimensions: [grid_size, grid_size],
		draggable: {
		    handle: '.widgetTitle'
		},
		resize: {
			enabled: true,
			resize: function(e,ui,$widget){
				resizedw();
			},
			stop: function(e,ui, $widget){
				setTimeout(resizedw, 300);
				//resizedw();
			}
		},
		serialize_params: function($w, wgd){ 

		    return { 
			    id: $($w).attr('id'), 
			    col: wgd.col, 
			    row: wgd.row, 
			    size_x: wgd.size_x, 
			    size_y: wgd.size_y, 
		    };
		}
	});

	$('#newDashboardLink').on('click', function(){
		window.location.href = location.protocol + '//' + location.host + location.pathname;
	});

	$('#addTabLink').on('click', function(){
		var numTabs = $('.nav-tabs li').length;
		$('.nav-tabs').append('<li><a href="#tab' + (numTabs + 1) + '" class="tabLink" data-toggle="tab">Section '+ (numTabs + 1) +'</a></li>');
		$('.tab-content').append('<div class="tab-pane fade" id="tab' + (numTabs + 1) + '"><div class="gridster"><ul id="gridster' + (numTabs + 1) + '"></ul></div></div>');
	});

	$('.addChartLink').on('click', function(e){
		console.log(e.currentTarget.attributes);
		var attributes = e.currentTarget.attributes;
		var divClass = $(e.currentTarget).attr('data-class');
		var divDataSource = $(e.currentTarget).attr('data-source');
		var divDataMetrics = $(e.currentTarget).attr('data-metrics');
		var activeTab = getActiveTabNumber();
		console.log(activeTab);

		gridster = getSpecificGridster(activeTab);
		next = gridster.serialize().length;
		// gridster.add_widget('<div class="MetricsEvol" style="width:80%; height:80%" data-data-source="scm" data-metrics="scm_commits" data-min="false"></div>', 1, 1, (next%widthWidgets) + 1, ~~(next/widthWidgets) + 1);
		title = divDataSource + '-' + divDataMetrics;
		id = "tab" + activeTab + "_" + next;
		options = [];
		options.push({
			key:'class',
			value:divClass
		});
		options.push({
			key:'data-data-source',
			value:divDataSource
		});
		options.push({
			key:'data-metrics',
			value:divDataMetrics
		});
		
		addWidgetToGridster(gridster, id, title, options, 2, 1, undefined, undefined);

		var graphJson = {};
		graphJson.title = title;
		graphJson.id = id;
		graphJson.options = options;
		graphJson.col = 0;
		graphJson.row = 0;
		graphJson.size_x = 0;
		graphJson.size_y = 0;

		graphInfo[id] = graphJson;

		resizedw();

	});

	hashParam = get('hash');

	if(hashParam != undefined){
		visualizeSharedDashboard(hashParam);
	}
};