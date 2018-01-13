

var BASIC_URL = "http://localhost:5000/washing/";
// var BASIC_URL = "http://localhost:5000/washing/?artikel_id=1&activity_merged=1&hourofday=12&month=11&dayofweek=4";
//to extract the default values of demand until this hour
var DefaultURL =  "http://localhost:5000/washing/?artikel_id=&activity_merged=&month=&dayofweek=";
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

//$('#submitform1Btn','click',fetchPridictionData1);
$('#submitformBtn').click( function (){
    console.log("form submited");
   console.log($('#form1').serialize());
   $.ajax({
       url: BASIC_URL,
       data: $('#form1').serialize(),
       method: "GET",
       success: function(result){
           console.log("result obtained is" + result);
		   //get time sent
		   var hour = $('#hourofday').val();
		   var newPoint = {x : hour, y : Math.round(result)};
		   console.log(newPoint.x);
		   console.log(newPoint.y);
		   //push data to chart
		   updateDataByNewEntry(newPoint);
		   //update graph by re-rendring it
		   chart.render();
       }, 
       error: function(xhr, textStatus, errorThrown){ 
           alert("Unable to fetch Server data"+ textStatus); 
		   alert("xhr"+ xhr);             	 	
       }
   });

});

function updateDataByNewEntry(newValue){
	console.log("value to be added " + newValue)
	chart.data[0].dataPoints.push(newValue);
	console.log(chart.data[0].dataPoints);
	
}

function getInitialData(){
	//get time
	var time = new Date();
	var hour = time.getHours();
	console.log(hour);

	for(var i=0 ;i <=1; i++){

		$.ajax({
			url: DefaultURL,
			data: {hourofday : hour, },
			method: "GET",
			success: function(result){
				console.log("result obtained for hour '"+ hour+"' is " + result);
				//get time sent
				var hour = $('#hourofday').val();
				var newPoint = {x : hour, y : Math.round(result)};
				//push data to chart
				updateDataByNewEntry(newPoint);
				//update graph by re-rendring it
				chart.render();
			}, 
			error: function(xhr, textStatus, errorThrown){ 
				alert("Unable to fetch Server data"+ textStatus); 
				alert("xhr"+ xhr);             	 	
			}
		});

	}

	//get recoud per hour until the current time

	//update the chart
}




});