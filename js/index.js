var graphInfo = {};

function getFileStructure(){
	$.ajax({
		type: 'GET',
		url: 'data/json/metrics.json',
		dataType: 'json',
		async:false,
		success: function(resp){

			var menuCode = "";
			var collapseI = 1;
			console.log(resp);
			$.each(resp, function(key, value){
				console.log(key);
				console.log(value);
				menuCode += '<div class="accordion-group"><div class="accordion-heading"><a class="accordion-toggle" data-toggle="collapse" data-parent="#sideAccordionMenu" href="#collapse' + collapseI + '">' + key + ' </a></div>';
				menuCode += '<div id="collapse' + collapseI + '" class="accordion-body collapse"><div class="accordion-inner">';
				menuCode += '<div class="acoordion" id="sideAccordionMenu' + collapseI + '">';
				var collapseJ = 1;
				$.each(resp[key], function(key2, value2){
					menuCode += '<div class="accordion-group"><div class="accordion-heading"><a class="accordion-toggle" data-toggle="collapse" data-parent="#sideAccordionMenu' + collapseI + '" href="#collapse' + collapseI + '_' + collapseJ + '">' + key2 + '</a></div>';
					menuCode += '<div id="collapse' + collapseI + '_' + collapseJ + '" class="accordion-body collapse"><div class="accordion-inner"><ul class="nav nav-list">'; 
					$.each(value2, function(index, item){
						var options = "";
						$.each(item, function(key3, value3){
							options += key3 + '="' + value3 + '" ';
						})
						menuCode += '<li><a href="#" class="addChartLink" ' + options + '>' + item['data-name'] + '</a></li>'
						//menuCode += '<li><a href="#" class="addChartLink" data-class="' + key + '" data-source="' + key2 + '" data-metrics="' + item + '">' + item + '</a></li>';
					});
					menuCode += '</ul></div></div></div>'
					collapseJ++;
				});
				menuCode += '</div></div></div></div>'
				collapseI++;
			});
			$('#sideAccordionMenu').html(menuCode);
		}
	});
}

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
	$('.Top').removeClass('Top').addClass('TopHidden');
	$('#gridster' + activeTab + ' .MetricsEvolHidden').removeClass('MetricsEvolHidden').addClass('MetricsEvol');
	$('#gridster' + activeTab + ' .TopHidden').removeClass('TopHidden').addClass('Top');
});

$(document).on('dblclick','.tabLink', function(e){

	$('#changeTabNameModal').modal('show');
	$('#newTabName').val($(e.currentTarget).html());
	$('#myModalLabel2').html($(e.currentTarget).html());
	$('#spanTabName').html($(e.currentTarget).html());
	$('#hiddenIdTabName').val(e.currentTarget.hash);
});

$(document).on('click', '#acceptTabName', function(e){
	var tab = $('#hiddenIdTabName').val();
	var name = $('#newTabName').val();
	if(name != ''){
		$('.tabLink[href="' + tab + '"]').html(name);
		console.log(name);
	}
});

$(document).ready(function(){

	Loader.data_ready(function(){
		initFunctions();

		$('.nav-tabs li').tooltip({
			title:'Double click to change tab name',
			placement: 'bottom'
		});
	});
});

function initFunctions(){

	// function getFileStructure(){
	// 	$.ajax({
	// 		type: 'GET',
	// 		url: 'data/json/metrics.json',
	// 		dataType: 'json',
	// 		async:false,
	// 		success: function(resp){
	// 			console.log('blablabla');
	// 		}
	// 	});
	// }

	function resizedw(){
	    Report.convertGlobal();
	    Report.convertStudiesGlobal();
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

		gridster.add_widget('<li id="' + id + '" class="new externalGraph"><div class="widgetTitle"><h5>' + title + '<button type="button" class="close closeWidget">&times;</button></h5></div><div id="graph' + id + '" class="innerGraph ' + optionClass + '" style="width:100%; height:80%" ' + optionsString + '></div></li>', size_x, size_y, col, row);

		$('#' + id + ' .closeWidget').on('click', function(e){
			gridster.remove_widget($('#' + id));
			delete graphInfo[id];
		});

		$('.widgetTitle').tooltip({
			title:'Tss, drag me',
			placement: 'bottom'
		});
	}

	function visualizeSharedDashboard(hashParam){

		$.ajax({
			url: 'phpServerSide/GetTabsFromHash.php',
			data:{
				hash: hashParam
			},
			type: 'GET',
			dataType: 'json',
			success: function(resp){

				console.log(resp);

				currentTab = 1;
				gridster = getSpecificGridster(currentTab);

				$.each(resp.graphInfo.names, function(i, item){
					if( i != 0){
						$('#addTabLink').click();
					};
					$('.tabLink')[i].innerHTML = item;
				});

				$.each(resp.graphInfo.graphInfo, function(key, value){
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
				});

				console.log(resp.graphInfo.names);

				// $.each($('.tabLink'), function(i, item){
				// 	item.innerHTML = resp.graphInfo.names[i];
				// });
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

		var tabNames = [];
		$.each($('.tabLink'), function(i,item){
			tabNames.push(item.innerHTML);
		});
		console.log(tabNames);

		var shareObject = {
			graphInfo : graphInfo,
			names : tabNames
		};

		$.ajax({
			url : 'phpServerSide/GetHashFromTabs.php',
			type : 'POST',
			data : {
				graphInfo : shareObject
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

	getFileStructure();

	width = $('#gridster1').width();

	if(width > 1000)
		widthWidgets = 3;
	else if (width > 666) 
		widthWidgets = 2;
	else
		widthWidgets = 1;

	grid_size = (width-widthWidgets*10)/(2*widthWidgets) - 30;
	grid_margin = 10;

	$("#gridster1").gridster({
		widget_margins: [grid_margin,grid_margin],
		widget_base_dimensions: [grid_size, grid_size],
		draggable: {
		    handle: '.widgetTitle h5'
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

		$('.nav-tabs li').tooltip({
			title:'Double click to change tab name',
			placement: 'bottom'
		});
	});

	$('.addChartLink').on('click', function(e){
		console.log(e.currentTarget.attributes);
		var options = [];
		for(var i=0; i<e.currentTarget.attributes.length;i++){
			console.log(e.currentTarget.attributes[i]);
			if(e.currentTarget.attributes[i].name.indexOf('data-') == 0){
				var key = e.currentTarget.attributes[i].name.substring(5);
				if(key != 'name'){	
					options.push({
						key: key,
						value: $(e.currentTarget).attr(e.currentTarget.attributes[i].name)
					});
				}
			}
		}

		console.log(options);
		//var attributes = e.currentTarget.attributes;
		var divClass = $(e.currentTarget).attr('data-class');
		var divName = $(e.currentTarget).attr('data-name');
		//var divDataSource = $(e.currentTarget).attr('data-source');
		//var divDataMetrics = $(e.currentTarget).attr('data-metrics');
		var activeTab = getActiveTabNumber();
		//console.log(activeTab);

		gridster = getSpecificGridster(activeTab);
		next = gridster.serialize().length;
		// gridster.add_widget('<div class="MetricsEvol" style="width:80%; height:80%" data-data-source="scm" data-metrics="scm_commits" data-min="false"></div>', 1, 1, (next%widthWidgets) + 1, ~~(next/widthWidgets) + 1);
		title = divClass + '-' + divName;
		id = "tab" + activeTab + "_" + next;
		// options = [];
		// options.push({
		// 	key:'class',
		// 	value:divClass
		// });
		// options.push({
		// 	key:'data-data-source',
		// 	value:divDataSource
		// });
		// options.push({
		// 	key:'data-metrics',
		// 	value:divDataMetrics
		// });
		
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