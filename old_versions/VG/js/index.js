var Index = {};

(function() {

	Index.displayViz = function(){
		alert('Hola');
		var div = $('#dashboard_viz');
		div.empty();
		var ds_div = null;
		var start = null;
		var end = null;
		var year = undefined;
		var release = undefined;
		var config_metric = {
			show_desc: false, 
			show_title: true, 
            show_legend: true, 
            help: false
        };

        var metric_div = "dashboard_test";
        var new_div = "<div class='dashboard_graph' id='";
        new_div += metric_div+"'></div>";
        div.append(new_div);
        ds = Report.getDataSources()[0];
        ds.displayMetricMyCompanies(['HP'], 'its_closers', metric_div, config_metric, start, end);
	}

})();

Loader.data_ready(function() {
    Index.displayViz();
});