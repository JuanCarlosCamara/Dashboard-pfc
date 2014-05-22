$(document).ready(function(){
	

	$(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [140, 140]
    });

	$('#addChartButton').on('click', function(e){
		alert('a');
	});
    


    $('li').css('background-color', '#abcdef');
});