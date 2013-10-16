$(document).ready(function(){
 
  $(".gridster ul").gridster({
    widget_margins: [10, 10],
    widget_base_dimensions: [140, 140]
  });

  $('#addChartButton').on('click', function(){
    
    var gridster = $(".gridster ul").gridster().data('gridster');
    next = gridster.serialize().length + 1;
    alert((next%2 == 1) ? 1 : 3);
    alert(~~(next/2) + 1);
    gridster.add_widget('<li class="new"></li>', 2, 1, (next%2 == 1) ? 1 : 3, ~~(next/2) + 1);
    
  });

});
