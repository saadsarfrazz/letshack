

var BASIC_URL = "http://localhost:5000/washing/";
var BASIC_URL2 = "http://localhost:5000/washing/discount";
var MAIL_URL = "http://localhost:5000/washing/mail";
//to extract the default values of demand until this hour
var URL_Todays_Data =  "http://localhost:5000/washing/current";
var chart;
//mockup data
window.onload = function () {

chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	theme: "light2",
	title:{
		text: "Prediction of today's Demand"
	},
	axisX:{
		// valueFormatString: "hh",
		// crosshair: {
		// 	enabled: true,
		// 	snapToDataPoint: true
		// }
		viewportMaximum: 23,
		title: "Hour"
	},
	axisY: {
		title: "Demand",
		crosshair: {
			enabled: true
		}
	},
	toolTip:{
		shared:true
	},  
	legend:{
		cursor:"pointer",
		verticalAlign: "bottom",
		horizontalAlign: "left",
		dockInsidePlotArea: true,
		itemclick: toogleDataSeries
	},
	data: [{
		type: "line",
		showInLegend: true,
		name: "Demand",
		markerType: "square",
		// xValueFormatString: "HH",
		color: "#F08080",
		dataPoints: [
			// { x: 00, y: 00 },
			// { x: 03, y: 23 },
			// { x: 04, y: 34},
			// { x: 11, y: 38 }
		]
	},
	{
		type: "line",
		showInLegend: true,
		name: "Predicted",
		lineDashType: "dash",
		dataPoints: [

		]
	
	}]
});
chart.render();
var chart2 = new CanvasJS.Chart("chartContainer2", {
	animationEnabled: true,
	theme: "light2",
	title:{
		text: "Site Traffic"
	},
	axisX:{
		valueFormatString: "DD MMM",
		crosshair: {
			enabled: true,
			snapToDataPoint: true
		}
	},
	axisY: {
		title: "Cost",
		crosshair: {
			enabled: true
		}
	},
	toolTip:{
		shared:true
	},  
	legend:{
		cursor:"pointer",
		verticalAlign: "bottom",
		horizontalAlign: "left",
		dockInsidePlotArea: true,
		itemclick: toogleDataSeries
	},
	data: [{
		type: "line",
		showInLegend: true,
		name: "Total Visit",
		markerType: "square",
		xValueFormatString: "DD MMM, YYYY",
		color: "#F08080",
		dataPoints: [
			{ x: new Date(2017, 0, 3), y: 650 },
			{ x: new Date(2017, 0, 4), y: 700 },
			{ x: new Date(2017, 0, 5), y: 710 },
			{ x: new Date(2017, 0, 6), y: 658 },
			{ x: new Date(2017, 0, 7), y: 734 },
			{ x: new Date(2017, 0, 8), y: 963 },
			{ x: new Date(2017, 0, 9), y: 847 },
			{ x: new Date(2017, 0, 10), y: 853 },
			{ x: new Date(2017, 0, 11), y: 869 },
			{ x: new Date(2017, 0, 12), y: 943 },
			{ x: new Date(2017, 0, 13), y: 970 },
			{ x: new Date(2017, 0, 14), y: 869 },
			{ x: new Date(2017, 0, 15), y: 890 },
			{ x: new Date(2017, 0, 16), y: 930 }
		]
	},
	{
		type: "line",
		showInLegend: true,
		name: "Unique Visit",
		lineDashType: "dash",
		dataPoints: [
			{ x: new Date(2017, 0, 3), y: 510 },
			{ x: new Date(2017, 0, 4), y: 560 },
			{ x: new Date(2017, 0, 5), y: 540 },
			{ x: new Date(2017, 0, 6), y: 558 },
			{ x: new Date(2017, 0, 7), y: 544 },
			{ x: new Date(2017, 0, 8), y: 693 },
			{ x: new Date(2017, 0, 9), y: 657 },
			{ x: new Date(2017, 0, 10), y: 663 },
			{ x: new Date(2017, 0, 11), y: 639 },
			{ x: new Date(2017, 0, 12), y: 673 },
			{ x: new Date(2017, 0, 13), y: 660 },
			{ x: new Date(2017, 0, 14), y: 562 },
			{ x: new Date(2017, 0, 15), y: 643 },
			{ x: new Date(2017, 0, 16), y: 570 }
		]
	}]
});
chart2.render();

function toogleDataSeries(e){
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else{
		e.dataSeries.visible = true;
	}
	chart.render();
}

} //on load ends here

$(function() {
//load current prediction data from server and draw upto current hour
getInitialData();

$('#submitformBtn2').click( function (){
   $.ajax({
       url: BASIC_URL2,
       data: $('#form1').serialize(),
       method: "GET",
       success: function(result){

       	var product = result[0]
       	var gender = result[1]
       	var extra_discount = result[2]

       	$('#product1').addClass("greyed")
       	$('#product2').addClass("greyed")
       	$('#product3').addClass("greyed")
       	$('#product4').addClass("greyed")

       	$('#product'+product).removeClass("greyed")
       	$('#extra_discount').text("You get extra discount: " + result[2] + "%")

       }, 
       error: function(xhr, textStatus, errorThrown){ 
           //alert("Unable to fetch Server data"+ textStatus); 
		   //alert("xhr"+ xhr);
		   console.log(xhr)
       }
   });

});

$('#submitformBtn1').click( function (){
   $.ajax({
       url: BASIC_URL,
       data: $('#form2').serialize(),
       method: "GET",
       success: function(result){
		   
		   //get time sent
		   var hour = $('#hourofday').val();
		   var newPoint = {x : hour, y : Math.round(result[0])};

		   $('#demand_number').text("Demand at that point: " + newPoint.y)

		   if(newPoint.y < 5) {
		   		$('#email').removeClass("hidden")
		   } else {
		   		$('#email').addClass("hidden")
		   }
		   
		   //push data to chart
		   updateDataByNewEntry(newPoint);

		   //update graph by re-rendring it
		   chart.render();

       }, 
       error: function(xhr, textStatus, errorThrown){
       	// TODO
           //alert("Unable to fetch Server data"+ textStatus); 
		   //alert("xhr"+ xhr);             	 	
       }
   });

});


$('#sendEmail').click( function (){
   $.ajax({
       url: MAIL_URL,
       data: {"recipient": $('#recipient').val()},
       method: "GET",
       success: function(result){
		   
       		alert("Mail send");
       		$('#email').addClass("hidden")

       }, 
       error: function(xhr, textStatus, errorThrown){
       	// TODO
           //alert("Unable to fetch Server data"+ textStatus); 
		   //alert("xhr"+ xhr);             	 	
       }
   });

});

function updateDataByNewEntry(newValue){

	var index = -1;
	for(var i=0; i < chart.data[0].dataPoints.length; i++) {
		if(chart.data[0].dataPoints[i].x == newValue.x) {
			chart.data[0].dataPoints[i].y = newValue.y
			//break;
			return;
		}
	}

	if(index == -1) {
		chart.data[0].dataPoints.push(newValue);	
	} else {
		//chart.data[0].dataPoints[index] = newValue;
	}

	//console.log(newValue.y)
}

function getInitialData(){
	$.ajax({
		url: URL_Todays_Data,
		method: "GET",
		success: function(result){
			console.log(result);
			var size = result.length;
			console.log("Size is" + size);

			for(var i = 0; i<size;i++){
				var point = {x: i, y:  Math.round( result[i][1] )};
				console.log("value was " + point.y);
				updateDataByNewEntry(point);
			}

			chart.render();
			
			//push data to chart
			// updateDataByNewEntry(newPoint);
			//update graph by re-rendring it
			// chart.render();
		}, 
		error: function(xhr, textStatus, errorThrown){ 
			alert("Unable to fetch Server data"+ textStatus); 
			alert("xhr"+ xhr);             	 	
		}
	});


}




});