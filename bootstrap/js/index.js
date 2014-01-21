function getActiveTabNumber(){
	var tabs = $('.nav.nav-tabs li');
	for(i = 0; i < tabs.length; i++){
		if($(tabs[i]).hasClass('active'))
			return i + 1;
	}
}

$(document).on('click','.tabLink',function(e){
	activeTab = getActiveTabNumber();
	$('.MetricsEvol').removeClass('MetricsEvol').addClass('MetricsEvolHidden');
	$('#gridster' + activeTab + ' .MetricsEvolHidden').removeClass('MetricsEvolHidden').addClass('MetricsEvol');
})

$(document).ready(function(){

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
			    htmlContent : $($w).html() 
		    };
		}
	});

	// $('#addChartLink').on('click', function(){

	// 	if($('#left_column').hasClass('hide')){
	// 		$('#left_column').removeClass('hide');
	// 		$('#right_column').addClass('span10');
	// 	}else{
	// 		$('#left_column').addClass('hide');
	// 		$('#right_column').removeClass('span10');
	// 	}
		
	// });

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

		gridster = $("#gridster" + activeTab).gridster().data('gridster');
		next = gridster.serialize().length;
		// gridster.add_widget('<div class="MetricsEvol" style="width:80%; height:80%" data-data-source="scm" data-metrics="scm_commits" data-min="false"></div>', 1, 1, (next%widthWidgets) + 1, ~~(next/widthWidgets) + 1);
		title = divDataSource + '-' + divDataMetrics;
		gridster.add_widget('<li class="new externalGraph"><div class="widgetTitle">' + title + '</div><div id="tab' + activeTab + '_' + next + '" class="' + divClass +' innerGraph" style="width:100%; height:80%" data-data-source="' + divDataSource + '" data-metrics="' + divDataMetrics + '" data-min="true"></div></li>', 2, 1);

		resizedw();

	});

	function resizedw(){
	    Report.convertGlobal();
	    Report.convertStudies();
	}
});