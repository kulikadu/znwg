var productbasedefine_array;
var clock = null;
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
Date.prototype.FormatUTC = function(fmt) {
	var o = {
		"M+" : this.getUTCMonth() + 1, // 月份
		"d+" : this.getUTCDate(), // 日
		"h+" : this.getUTCHours(), // 小时
		"m+" : this.getUTCMinutes(), // 分
		"s+" : this.getUTCSeconds(), // 秒
		"q+" : Math.floor((this.getUTCMonth() + 3) / 3), // 季度
		"S" : this.getUTCMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getUTCFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
var dataX=[];
var dataY=[0,50,80,90,100];
var all_data=[];//完整率
var all_data1=[];//缺收率
var title;
var legend;
function QueryDataSeries(Code,Source){	
	var now = new Date();
	var pre_tm = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);
	var Name="";
	if (productbasedefine_array != null) {
		for (var j = 0; j < productbasedefine_array.length; j++) {
			if(productbasedefine_array[j].code==Code)
				Name = productbasedefine_array[j].name;
		}
	}
	$.ajax({
		type:"POST",
		async:false,
		url:"/szyb_monitor-web/monitorrealstatsearch",
		data:"stype=1&startDTime="+pre_tm.FormatUTC("yyyyMMdd hh:mm:ss")+"&endDTime="+now.FormatUTC("yyyyMMdd hh:mm:ss")+"&code="+Code+"&source="+Source,
		success:function(data){
			var dataArray=$.parseJSON(data);
			title= (Name==""?Code:Name)+ "("+ pre_tm.FormatUTC("yyyy-MM-dd hh:mm:ss")+"到"+now.FormatUTC("yyyy-MM-dd hh:mm:ss") + "时) \n"+Source +"共享服务查询情况(百分率)";
			legend=[];legend.push('接收完整率');legend.push('完整接收文件数');legend.push('缺失文件数')
			dataX=[];
			dataY=[0,50,80,90,100];
			all_data=[];//完整率
			all_data1=[];//完整接收数
			var all_data2=[];//缺失文件数
			for(var i=dataArray.length-1;i>=0;i--){
				var num = dataArray[i].collectPercentage * 100;
				var lostnum = (dataArray[i].collectTotalNum-dataArray[i].collectNum);
				if(num <100){
                	all_data.push(num);
            	}
            	else{
            		all_data.push(100);
            	}
            	all_data1.push(dataArray[i].collectNum);
            	all_data2.push(lostnum);
				dataX.push(dataArray[i].DTime);                	
			}
			zoom = 48 / dataArray.length * 100;
			var bar=[];
			bar.push('line');bar.push('bar');bar.push('bar');
			DrawChartS(title,legend,dataX,dataY,all_data,all_data1,all_data2,bar,zoom);
			$('#chartModel').modal('show');
		}
	});
}
function QueryData(Time,Code,Source){
	$.ajax({
		type : "POST",
		async : false,
		url : "/szyb_monitor-web/monitorrealstatsearch",
	//	data:"startDTime=" + startDTime + "&endDTime=" + endDTime + "&code=" +Code+"&source="+Source,
		data:"stype=0&time="+Time+"&code="+Code+"&source="+Source,
		success : function(data) {
			var dataArray = $.parseJSON(data);
			$("#resultTB tr").remove();
			dataX=[];
			dataY=[0,50,80,90,100];
			all_data=[];//完整率
			all_data1=[];//缺收率
			
			for(var i=0;i<dataArray.length;i++){
            	var tbBody = "";
            	var Name ="";
            	var row={};
				if (productbasedefine_array != null) {
					for (var j = 0; j < productbasedefine_array.length; j++) {
						if(productbasedefine_array[j].code==dataArray[i].code)
							Name = productbasedefine_array[j].name;
					}
				}
				var num = dataArray[i].collectPercentage * 100;
				var encodedtime = encodeURI(encodeURI(dataArray[i].DTime));
				var source = encodeURI(encodeURI(dataArray[i].source));
	//			var detail = "<a data-toggle='modal' data-target='#detailModel' href='/szyb_monitor-web/monitordetaildefine?id="+dataArray[i].ID+"&code="+dataArray[i].code+"&dtime="+encodedtime+"&source="+source+"'>监控详情</a>";
				var storedetail = "<a data-toggle='modal' data-target='#detailModel' href='/szyb_monitor-web/storefile?id="+dataArray[i].ID+"&code="+dataArray[i].code+"&dtime="+encodedtime+"&source="+source+"'>文件详情</a>";
	//			var detail = "<a data-toggle='modal' data-target='#detailModel' href='/szyb_monitor-web/monitordetaildefine'>详情</a>"
				
				var lostnum = (dataArray[i].collectTotalNum-dataArray[i].collectNum);
            	tbBody = "<tr><td>"+Name+"</td><td><a href='javascript:void(0);' onclick=\"QueryDataSeries('"+dataArray[i].code+"','"+Source+"')\">"+dataArray[i].code+"</a></td><td>"+dataArray[i].DTime+"</td><td>"+dataArray[i].source+"</td><td>"
            	        +dataArray[i].collectTotalNum+"</td><td>"+dataArray[i].collectNum+"</td><td>"+(lostnum>0?'<font color=red>'+lostnum+'</font>':0)+"</td><td>"+(num.toFixed(2)>100?'<font color=red>'+100.00+'</font>':num.toFixed(2))+"</td><td>"
            	        +dataArray[i].collectTime+"</td><td>"+dataArray[i].startDTime+"</td><td>"+dataArray[i].endDTime+"</td><td>"+storedetail+"</td></tr>";
            	$("#resultTB").prepend(tbBody);

            	if(num <100){
                	all_data.push(num);
                	all_data1.push(100-num);
            	}
            	else{
            		all_data.push(100);
            		all_data1.push(0);
            	}
                if(Name!="")
                {
                	dataX.push(Name+"@"+dataArray[i].DTime);
                }
                else{
                	dataX.push(dataArray[i].code+"@"+dataArray[i].DTime);                	
                }
			}

		//	title = Source +"("+ startDTime + " --->" + endDTime + "时) \n共享服务查询情况(百分率)";
			title = Source +"("+ Time + "时) \n共享服务查询情况(百分率)";
			legend = []; legend.push('接收完整率');legend.push("缺收率");
			DrawChart(title,legend,dataX,dataY,all_data,all_data1,'bar');
		}});
}

function QueryProductBaseDefineData(){
	$.ajax({
		type : "POST",
		async : false,
		url : "/szyb_monitor-web/productbasedefinesearch",
		success : function(data) {
			productbasedefine_array = $.parseJSON(data);
		}
	});
}

function getStyle(obj,styleName){
	if(obj.currentStyle){
		return obj.currentStyle[styleName];
	}else{
		return getComputedStyle(obj,null)[styleName];
	}
}

function DrawChartS(title,legend,dataX,dataY,all_data,all_data1,all_data2,chart_type,zoom){
	var Chart = document.getElementById('monitor_chart');
	var _width = $("#chartModel").width()*0.99;
	var myChart = echarts.init(Chart);
	myChart.resize({width:_width});
	myChart.clear();
	var option={
		backgroundColor: 'lightblue',
	    color: ['#3398DB','blue','red'],
		title:{
			text:title,
			x:'center'
		},
		legend:{
			data:legend,
			left:10
		},
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
		xAxis:{
			type:'category',
			data:dataX,
            axisTick: {
                alignWithLabel: true,
            },    
            axisLabel:{
            	interval:0,
            	rotate:90,
				formatter: function(params) {
					var startpos = params.indexOf("@");
					return params.substring(startpos+1);
				}
			}
		},
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    dataZoom:[{
	    	type:'inside',
	    	start:0,
	    	end:zoom
	    }],
		yAxis:[{
			name:'接收率',
			type:'value'
		},{
			name:'文件数',
			type:'value'
		}],
		series:[{
			name:legend[0],
			type:chart_type[0],
			data:all_data,
			itemStyle:{
				normal:{
					label:{
						show:true,
//						color:'white',
						rotate: 90,
					    align: 'left',
					    verticalAlign: 'middle',
					    position: 'insideBottom',
						formatter: function(params) {
								return params.value.toFixed(0);
						}
					}
				}
			}
		},{
			name:legend[1],
			type:chart_type[1],
			data:all_data1,
			yAxisIndex:1,
			itemStyle:{
				normal:{
					label:{
						show:true,
						rotate: 90,
					    align: 'left',
					    verticalAlign: 'middle',
					    position: 'insideBottom',					}
				}
			}
		},{
			name:legend[2],
			type:chart_type[2],
			data:all_data2,
			yAxisIndex:1,
			itemStyle:{
				normal:{
					label:{
						show:true,
						rotate: 90,
					    align: 'left',
					    verticalAlign: 'middle',
					    position: 'insideBottom',
					}
				}
			}
		}]
	};
	myChart.setOption(option);	
}

function DrawChart(title,legend,dataX,dataY,all_data,all_data1,chart_type){
	
	var Chart = document.getElementById('monitor_chart');
	var _width = $("#chartModel").width()*0.99;
	var myChart = echarts.init(Chart);
	myChart.resize({width:_width});
	myChart.clear();
//	alert(title+legend+dataX+dataY+all_data+all_data1);

	var option={
		backgroundColor: 'lightblue',
	    color: ['#3398DB','red'],
		title:{
			text:title,
			x:'center'
		},
		legend:{
			data:legend,
			left:10
		},
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
//	    dataZoom:[{
//	    	type:'inside',
//	    	xAxisIndex: 0,
//	    	start:0,
//	    	end:10
//	    }],
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
		xAxis:{
			type:'category',
			data:dataX,
            axisTick: {
                alignWithLabel: true,
            },
            axisLabel:{
            	interval:0,
            	rotate:90,
				formatter: function(params) {
					var startpos = params.indexOf("@");
					return params.substring(startpos+1);
				}
			}
		},
		yAxis:{
//			data:dataY,
//			type:'category',
//            axisTick: {
//                alignWithLabel: true,
//            }
		},
		series:[{
			name:legend[0],
			type:chart_type,
			stack:'接收率',
			data:all_data,
			itemStyle:{
				normal:{
					label:{
						show:true,
						color:'white',
						rotate: 90,
					    align: 'left',
					    verticalAlign: 'middle',
					    position: 'insideBottom',
		//			    distance: 10,
		//			    textBorderColor: '#fff',
						formatter: function(params) {
							var startpos = params.name.indexOf("@");
							if (params.value <= 100&&params.value >=50) {
							return params.value.toFixed(0) +" "+ params.name.substring(0,startpos);
							} else if(params.value>0){
								return params.value.toFixed(0);
							}
							else {
							return '';
							}
						},
					}
				}
			}
		},{
			name:legend[1],
			type:chart_type,
			stack:'接收率',
			data:all_data1,
			itemStyle:{
				normal:{
					label:{
						show:true,
						color:'white',
						rotate: 270,
					    align: 'left',
					    verticalAlign: 'middle',
					    position: 'insideTop',
				//	    distance: 10,
				//        textBorderColor: '#fff',
						formatter: function(params) {
    						var startpos = params.name.indexOf("@");
							if (params.value <= 100&&params.value>50) {
							return params.value.toFixed(0)+" "+params.name.substring(0,startpos);
							} else if(params.value>0){
								return params.value.toFixed(0);
							}else
							{
							return '';
							}
						},
					}
				}
			}
		}]
	};
	myChart.setOption(option);	
}
function chartmodelshow(){
	var h=window.innerHeight||document.body.clientHeight||document.documentElement.clientHeight;
//	$(this).find('.modal-dialog').css('width','100%');
//	$(this).find('.modal-dialog').css('padding-right','0px');
//	$(this).css('padding-right','0px');
//	$(this).css('margin-left',-($(this).width()/2));
	$(this).find('.modal-dialog').css('top',h-$(this).find('.modal-dialog').height());
//	DrawChart(title,legend,dataX,dataY,all_data,all_data1,'bar');
	$('#pic_button').attr('disabled','true');
}
function RefreshData(){
	
	var source = GetQueryString("source");
	if (source != null) {
		source = decodeURI(source);
	}
	var now = new Date();
	var pre_tm = new Date(now.getTime() - 1000 * 60 * 60 * 24);
//	var title = source+"(" + pre_tm.Format("yyyy-MM-dd hh:mm:ss")
//			+ " --->" + now.Format("yyyy-MM-dd hh:mm:ss") + "时) 共享服务查询情况";
	var title = source+"("+ now.FormatUTC("yyyy-MM-dd hh:mm:ss") + "时) 共享服务查询情况";
	document.getElementById("title").innerHTML = title;
	QueryProductBaseDefineData();
//		QueryData(pre_tm.Format("yyyyMMdd hh:mm:ss"),now.Format("yyyyMMdd hh:mm:ss"),null,source);
	QueryData(now.FormatUTC("yyyy-MM-dd hh:mm:ss"),null,source);	
}

function setClock(){
	if(clock==null){
		clock = setInterval(RefreshData,1000*60);
//		alert($('#clockrefresh').text());
		$('#clockrefresh').text('停止自动刷新');
	}
	else{
		clearInterval(clock);
		clock=null;
//		alert($('#clockrefresh').text());
		$('#clockrefresh').text('启动自动刷新');
	}
}

$(document).ready(
		function() {
			var source = GetQueryString("source");
			if (source != null) {
				source = decodeURI(source);
			}
			var now = new Date();
			var pre_tm = new Date(now.getTime() - 1000 * 60 * 60 * 24);
//			var title = source+"(" + pre_tm.Format("yyyy-MM-dd hh:mm:ss")
//					+ " --->" + now.Format("yyyy-MM-dd hh:mm:ss") + "时) 共享服务查询情况";
			var title = source+"("+ now.FormatUTC("yyyy-MM-dd hh:mm:ss") + "时) 共享服务查询情况";
			document.getElementById("title").innerHTML = title;
			QueryProductBaseDefineData();
	//		QueryData(pre_tm.Format("yyyyMMdd hh:mm:ss"),now.Format("yyyyMMdd hh:mm:ss"),null,source);
			QueryData(now.FormatUTC("yyyy-MM-dd hh:mm:ss"),null,source);
			$('#result').css('width','100%');
			$('#result').css('background-color','white');
			$('#chartModel').on('show.bs.modal', chartmodelshow);
			$('#chartModel').on('hidden.bs.modal',function(){
				$('#pic_button').removeAttr('disabled');
			});
			$('#detailModel').on('hidden.bs.modal',function(){
				$(this).removeData("bs.modal");
			});
			$('#chartModel').modal('show');
		})
