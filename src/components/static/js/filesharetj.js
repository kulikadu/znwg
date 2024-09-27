
var productbasedefine_array;
var monitorrealstatmonth_array;
var year_source =[];
function QueryData(){
	$.ajax({
		type : "POST",
		async : false,
		url : "/szyb_monitor-web/productbasedefinesearch",
		success : function(data) {
			productbasedefine_array = $.parseJSON(data);
		}
	});
	$.ajax({
		type : "POST",
		async : false,
		url : "/szyb_monitor-web/monitorrealstatsearchmonth",
		success : function(data) {
			monitorrealstatmonth_array = $.parseJSON(data);
		}
	});
}

function RefreshUI(){
	$("#tabindex").empty();
	$("#tabcontent").empty();
	var sourcelist =[];
	for(var m=0;m<year_source.length;m++){
		$("#tabindex").append("<li role=\"presentation\"><a href=\"#s"+year_source[m].year+"\" aria-controls=\"s"+year_source[m].year+"\" role=\"tab\" data-toggle=\"tab\">"+year_source[m].year+"年</a></li>");
		var chart_source="";
		for(var n=0;n<year_source[m].source.length;n++)
		{
			chart_source += "<div id=\"chart_source_"+year_source[m].year+"_"+year_source[m].source[n]+"\" style=\"height: 380px;width:100%;padding-top:10px\"></div>";			
			var existed = false;
			for(var i=0;i<sourcelist.length;i++){
				if(year_source[m].source[n]==sourcelist[i]){existed=true;break;}
			}
			if(!existed) sourcelist.push(year_source[m].source[n]);				
		}
		$("#tabcontent").append("<div role=\"tabpanel\" class=\"tab-pane\" style=\"width:100%;\" id=\"s"+year_source[m].year+"\">"
                 +chart_source  +"</div>");		
	}
	$("#tabindex").append("<li role=\"presentation\"><a href=\"#s\" aria-controls=\"s\" role=\"tab\" data-toggle=\"tab\">整体情况</a></li>");
	chart_source="";
	for(var i=0;i<sourcelist.length;i++){
		chart_source += "<div id=\"chart_source_"+sourcelist[i]+"\" style=\"height: 480px;width:100%;padding-top:10px\"></div>";	
	}
	$("#tabcontent").append("<div role=\"tabpanel\" class=\"tab-pane\" style=\"width:100%;\" id=\"s\">"
            +chart_source  +"</div>");	
	$("#tabindex li").first().addClass('active');
	$("#tabcontent div").first().addClass('active');
}

function GetDTimeList(year,source){
	var DTimeA = [];
	for(var i=0;i<monitorrealstatmonth_array.length;i++){
		var DTime = monitorrealstatmonth_array[i].DTime;
		var _year = DTime.substring(0,4);
		if(year==_year&&source==monitorrealstatmonth_array[i].source){
			var existed = false;
			for(var j=0;j<DTimeA.length;j++)
			{
				if(DTimeA[j]==DTime) {existed=true;break;}
			}
			if(!existed)
				DTimeA.push(DTime);
		}
	}
	return DTimeA;
}
function GetCodeList(dtime,source){
	var codelist = [];
	for(var i=0;i<monitorrealstatmonth_array.length;i++){
		var DTime = monitorrealstatmonth_array[i].DTime;
		var code = monitorrealstatmonth_array[i].code;
		var _source = monitorrealstatmonth_array[i].source;
//		if(code=="NAFP_ECMF_C3E"){
//			var ttt=0;
//		}
		if(dtime==DTime&&source==_source){
			var existed = false;
			for(var j=0;j<codelist.length;j++){
				if(code==codelist[j]){existed=true;break;}
			}
			if(!existed) codelist.push(code);
		}
	}
	return codelist;
}

function DrawCharts(){
	for(var m=0;m<year_source.length;m++){
		var year = year_source[m].year;
		for(var n=0;n<year_source[m].source.length;n++){
			var source = year_source[m].source[n];
			var DTimeA = GetDTimeList(year,source);
			var series_data=[];
			for(var i=0;i<DTimeA.length;i++){
				var codelist = GetCodeList(DTimeA[i],source);
				var code_name = [];
				for(var index=0;index<codelist.length;index++){
					var Name="";
					if (productbasedefine_array != null) {
						for (var j = 0; j < productbasedefine_array.length; j++) {
							if(productbasedefine_array[j].code==codelist[index])
								Name = productbasedefine_array[j].name;
						}
					}
					if(Name!="") code_name.push(Name);
					else
						code_name.push(codelist[index]);
					
				}
				var object = new Object();
				object.title = new Object();
				object.title.text = DTimeA[i]+source+"收集统计情况";
				object.title.x = 'center';
				object.xAxis = new Object();
				object.xAxis.data = code_name;
				object.series = [];
				var collectnum = new Object();
				collectnum.data = [];
				collectnum.yAxisIndex=1;
				var collecttotalnum = new Object();
				collecttotalnum.data = [];
				collecttotalnum.yAxisIndex=1;
				var collectprecent = new Object();
				collectprecent.data=[];
				collectprecent.yAxisIndex=0;
				for(var k=0;k<codelist.length;k++){
					collectnum.data.push(0);				
					collecttotalnum.data.push(0);
					collectprecent.data.push(0);
				}				
				for(var j=0;j<monitorrealstatmonth_array.length;j++){
					var DTime = monitorrealstatmonth_array[j].DTime;
					var code = monitorrealstatmonth_array[j].code;
					if(DTime==DTimeA[i]&&source==monitorrealstatmonth_array[j].source){
						for(var l=0;l<codelist.length;l++){
							if(code==codelist[l]){
								collectnum.data[l] = monitorrealstatmonth_array[j].collectNum;
								collecttotalnum.data[l] = monitorrealstatmonth_array[j].collectTotalNum;
								var percent = (monitorrealstatmonth_array[j].collectNum /  monitorrealstatmonth_array[j].collectTotalNum)*100;
								collectprecent.data[l]= (percent>100)?100:percent;
							}
						}						
					}
				}
				object.series.push(collectprecent);
				object.series.push(collectnum);
				object.series.push(collecttotalnum);
				series_data.push(object);
			}
			
			
			var Chart = document.getElementById('chart_source_'+year+"_"+source);
			var _width = $("#s"+year).width()*0.99;
			var myChart = echarts.init(Chart);
			myChart.resize({width:_width});
			myChart.clear();
			var option={
					baseOption:{
						backgroundColor:{
							type: 'linear',
						    x: 0,
						    y: 0,
						    x2: 0,
						    y2: 1,
						    colorStops: [{
						        offset: 0, color: 'white' // 0% 处的颜色
						    }, {
						        offset: 1, color: 'lightgray' // 100% 处的颜色
						    }],
						    globalCoord: false // 缺省为 false
						},
					    color: ['#3398DB','blue','red'],
						timeline:{
							axisType: 'category',
							playInterval:1000,
							data:DTimeA
						},
					    tooltip : {
					        trigger: 'axis',
					        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					        }
					    },
			            legend:{
			            	x:'right',
			            	data:['收集率','实收总数','应收总数'],
			            	selected:{
			            		'应收总数':false,
			            		'实收总数':false
			            	}
			            },
			            calculable : true,
			            grid: {
			                top: 80,
			                bottom: 160,
			                tooltip: {
			                    trigger: 'axis',
			                    axisPointer: {
			                        type: 'shadow',
			                        label: {show: true}
			                    }
			                }
			            },
			            xAxis : {
			            	type : 'category',
			            	axisLabel : {'interval' : 0},
			            	data:code_name,
					        splitLine : {show : false},
					        axisTick: {
					        	alignWithLabel: true
					        }, 
				            axisLabel:{
				            	interval:0,
				            	rotate:90,
				            	fontSize:10,
								formatter: function(params) {
									var reallength=0;
									var insertindex=-1;
									for(var i=0;i<params.length;i++){
										var charcode = params.charCodeAt(i);
										if(charcode>=0&&charcode<=128) reallength+=1;
										else reallength+=2;
										if(reallength>=15&&insertindex==-1){insertindex=i};
									}
									if(reallength>15){
										params = params.substring(0,insertindex)+"\n"+params.substring(insertindex);
									}
									return params;
								}
				            }
			            },
			            yAxis : [{
			    			name:'接收率',
			    			type:'value'
			    		},{
			    			name:'文件数',
			    			type:'value'
			    		}],
					    series : [{name : '收集率',type : 'bar'},{name : '实收总数',type : 'bar'}, {name : '应收总数',type : 'bar'}]
			        },
			        options:series_data
				};
				myChart.setOption(option);	
		}
	}
}

function DrawChartsT(){
	var sourcelist=[];
	for(var m=0;m<year_source.length;m++){
		for(var n=0;n<year_source[m].source.length;n++){
			var existed = false;
			for(var i=0;i<sourcelist.length;i++){
				if(year_source[m].source[n]==sourcelist[i]){existed=true;break;}
			}
			if(!existed) sourcelist.push(year_source[m].source[n]);		
		}		
	}
	for (var i = 0; i < sourcelist.length; i++) {
		var DTimeA = [];
		for (var j = 0; j < monitorrealstatmonth_array.length; j++) {
			var DTime = monitorrealstatmonth_array[j].DTime;
			if (sourcelist[i] == monitorrealstatmonth_array[j].source) {
				var existed = false;
				for (var temp = 0; temp < DTimeA.length; temp++) {
					if (DTimeA[temp] == DTime) {
						existed = true;
						break;
					}
				}
				if (!existed)
					DTimeA.push(DTime);
			}
		}
		
		var codelist = [];
		var code_name = [];
		for(var j=0;j<monitorrealstatmonth_array.length;j++){
			var code = monitorrealstatmonth_array[j].code;
			var _source = monitorrealstatmonth_array[j].source;
			var code_cts ="";
			if(sourcelist[i]==_source){
				var existed = false;
				for(var temp=0;temp<codelist.length;temp++){
					if(code==codelist[temp]){existed=true;break;}
				}
				if(!existed){
					var Name="";
					var code_existed=false;
					if (productbasedefine_array != null) {
						for (var n = 0; n < productbasedefine_array.length; n++) {
							if(productbasedefine_array[n].code==code){
								Name = productbasedefine_array[n].name;
								code_cts = productbasedefine_array[n].code_Cts;
								code_existed=true;
								continue;
							}
						}
					}
					if(code_existed){
						if(_source=="MCP"&&code_cts=="") continue;
						codelist.push(code);
						if(Name!="") code_name.push(Name);
						else
							code_name.push(code);
					}
				}
			}
		}
		var seriesData=[];
		for(var j=0;j<codelist.length;j++){
			var object = new Object();
			object.name = code_name[j];
			object.type = 'line';
			object.data = [];
			for(var temp=0;temp<DTimeA.length;temp++){
				var percent ='-' ;
				for(var ttemp=0;ttemp<monitorrealstatmonth_array.length;ttemp++){
					var code = monitorrealstatmonth_array[ttemp].code;
					var _source = monitorrealstatmonth_array[ttemp].source;
					var dtime = monitorrealstatmonth_array[ttemp].DTime;
					if(code==codelist[j]&&_source==sourcelist[i]&&dtime==DTimeA[temp]){
						var collectnum = monitorrealstatmonth_array[ttemp].collectNum;
						var collecttotalnum = monitorrealstatmonth_array[ttemp].collectTotalNum;
						if(collecttotalnum>0){
							percent = (collectnum / collecttotalnum)*100;
//						percent = (monitorrealstatmonth_array[j].collectNum /  monitorrealstatmonth_array[j].collectTotalNum)*100;
						percent= (percent>100)?100:percent;
						}
						continue;
					}
				}
				object.data.push(percent);
			}
			seriesData.push(object);
		}
		
		var Chart = document.getElementById('chart_source_'+sourcelist[i]);
		var _width = $("#s").width()*0.99;
		var myChart = echarts.init(Chart);
		myChart.resize({width:_width});
		myChart.clear();
		var option={
				backgroundColor:{
					type: 'linear',
				    x: 0,
				    y: 0,
				    x2: 0,
				    y2: 1,
				    colorStops: [{
				        offset: 0, color: 'white' // 0% 处的颜色
				    }, {
				        offset: 1, color: 'lightgray' // 100% 处的颜色
				    }],
				    globalCoord: false // 缺省为 false
				},
				title:{
					text:sourcelist[i]+"各类数值预报产品收集逐月情况",
					x:'center'
				},
				legend:{
					data:code_name,
	            	x:'center',
	            	y:'bottom'
				},
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: 100,
				    containLabel: true
			    },
				xAxis:{
					type:'category',
					data:DTimeA,
		            axisTick: {
		                alignWithLabel: true,
		            },
		            axisLabel:{
		            	interval:0,
		            	rotate:90
					}
				},
				yAxis:{
	    			name:'接收率',
	    			type:'value'
				},
				series:seriesData
		};
		myChart.setOption(option);	
	}
}

$(document).ready(function(){
	QueryData();
	if(monitorrealstatmonth_array!=null){
		for(var i=0;i<monitorrealstatmonth_array.length;i++)
		{
			var DTime = monitorrealstatmonth_array[i].DTime;
			var year = DTime.substring(0,4);
			var existed=false;
			for(var j=0;j<year_source.length;j++){
				if(year_source[j].year==year){
					existed=true;
					break;
				}
			}
			if(!existed){
				var year_s = new Object();
				year_s.year=year;
				year_s.source=[];
				year_source.push(year_s);
			}
			var source = monitorrealstatmonth_array[i].source;
			for (var tt = 0; tt < year_source.length; tt++) {
				if (year_source[tt].year == year) {
					existed = false;
					for (var j = 0; j < year_source[tt].source.length; j++) {
						if (year_source[tt].source[j] == source) {
							existed = true;
							break;
							}
						}
					if (!existed)
						year_source[tt].source.push(source);
					}
				}
		}
	}
	RefreshUI();
	DrawCharts();
	DrawChartsT();
});