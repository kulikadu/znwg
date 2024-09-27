
function loadwfs(url,layerName,Authorization_s,mapd){
    const xhr = new XMLHttpRequest();
    xhr.open("POST",url+"?service=WFS&version=2.0.0&request=getfeature&typeName="+layerName+"&outputFormat=application/json",true);
    xhr.setRequestHeader('Authorization',Authorization_s);
    xhr.setRequestHeader('Access-Control-Allow-Origin','*');
      xhr.send();
      xhr.onreadystatechange = function(){
           if(xhr.readyState ===4){
                if(xhr.status===200){
                      var responseData = xhr.responseText;
                      document.getElementById(mapd).innerHTML=JSON.stringify(responseData);
                } else if(xhr.status ===404){
                      console.log('Resource not found');
                }
           }
      }
}

function loadwms(projection_str,url,layerName,format,Authorization_s,bounds,mapd){
       var untiled = new ol.layer.Image({
            source: new ol.source.ImageWMS({
            url: url,
            params: {
                  'FORMAT': format,
                  "LAYERS": layerName,
             },
             imageLoadFunction:function(tile,src){
                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.open('GET',src);
                    xhr.setRequestHeader('Authorization',Authorization_s);
                    xhr.onload = function(){
                            const url = URL.createObjectURL(xhr.response);
                            const img = tile.getImage();
                            img.addEventListener('load',function(){
                                    URL.revokeObjectURL(url);
                            });
                            img.src = url;
                    };
                    xhr.send();
             }
          })
      });
      var tiled = new ol.layer.Tile({
             source: new ol.source.TileWMS({
                  url: url,
                  params: {
                     "LAYERS": layerName,
                  },
                  serverType:'geoserver',
                  projection:projection_str,
                  tileLoadFunction:function(tile,src){
                       const xhr = new XMLHttpRequest();
                       xhr.responseType = 'blob';
                       xhr.open('GET',src);
                       xhr.setRequestHeader('Authorization',Authorization_s);
                       xhr.onload = function(){
                            const url = URL.createObjectURL(xhr.response);
                            const img = tile.getImage();
                            img.addEventListener('load',function(){
                                    URL.revokeObjectURL(url);
                            });
                            img.src = url;
                       };
                       xhr.send();
                   }
             }),
      });
      var map = new ol.Map({
             controls: ol.control.defaults({
                  attributionOptions:{
                       collapsible:false
                  }
              }),
             target: mapd,
             layers: [untiled,tiled],
             view: new ol.View({
                 projection:projection_str,
             })
     });
     map.getView().fit(bounds,map.getSize())
}

function loadwmts(projection_str,url,layer_name,format,Authorization_s,bounds,mapd){
    const projection = ol.proj.get(projection_str);
    const projectionExtent = projection.getExtent();
    const size = ol.extent.getWidth(projectionExtent)/256;
    const resolutions = new Array(19);
    const matrixIds = new Array(19);
    for(let z=0;z<19;++z){
         resolutions[z] = size / Math.pow(2,z+1);
         matrixIds[z] = projection_str+":"+z;
    }
    var wmtsSource = new ol.source.WMTS({
              url: url,
              layer:layer_name,
              matrixSet:projection_str,
              format:format,
              projection:projection,
              tileGrid:new ol.tilegrid.WMTS({
                    origin:ol.extent.getTopLeft(projectionExtent),
                    resolutions:resolutions,
                    matrixIds:matrixIds,
              }),
           //   style:'xiangzhen_cs_k',
              style:'',
              wrapX:true,
              tileLoadFunction:function(tile,src){
                      const xhr = new XMLHttpRequest();
                      xhr.responseType = 'blob';
                      xhr.open('GET',src);
                      xhr.setRequestHeader('Authorization', Authorization_s);
                      xhr.onload = function(){
                           const url = URL.createObjectURL(xhr.response);
                           const img = tile.getImage();
                           img.addEventListener('load',function(){
                                 URL.revokeObjectURL(url);
                           });
                           img.src = url;
                      };
                      xhr.send();
              }
        });
    // const customStyle = {
    //     fill:new ol.style.Fill({
    //         color:'rgba(0,0,255,0.5'
    //     }),
    //     stork:new ol.style.Stroke({
    //         color:'red',
    //     })
    // };
    // var newParams = {style:''};
    // wmtsSource.updateParams(newParams);
    // wmtsSource.setRenderer(function (extent,resolution){
    //     return [
    //         new ol.layer.Tile({
    //             source:wmtsSource,
    //             style:customStyle
    //         })
    //     ]
    // })
   // var style = wmtsSource.getStyle();
   // style.set('fillColor','rgba(0,0,255,0.5');
  //  style.set('strokeColor','red');
  //  wmtsSource.setStyle('');
    var wmtsService = new ol.layer.Tile({
            source:wmtsSource
        });
   /*var layer_Debug = new ol.layer.Tile({
                      source:new ol.source.TileDebug({
                                projection:projection,
                                tileGrid:wmtsSource.getTileGrid(),
                       })
      });*/
     var map = new ol.Map({
                   target:mapd,
           //        layers:[wmtsService,layer_Debug],
                   layers:[wmtsService],
                   view: new ol.View({
                          projection:projection_str,
                     }),
       });
   //   map.getView().fit([12109970.552191619,2831510.7514101723,12718940.036641845,3520154.580045574], map.getSize());
      map.getView().fit(bounds, map.getSize());
}

function loadothe(ip,port,baseurl,Authorization_s,mapd,layerName){
    if(layerName==='othe:starimage'){
        loadXYZ(ip+":"+port+"/"+baseurl,Authorization_s,mapd)
    }
}

function loadXYZ(url,Authorization_s,mapd){
    const mapSource = new ol.source.XYZ({
      //  url: "http://192.168.173.105:30010/hn3d/map/{z}/{x}/{y}.png",
     //   url:"http://10.110.173.206:10040/hn3d/map/{z}/{x}/{y}.png",
        url: url,
        wrapX: false,
        tileLoadFunction: function (tile, src) {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', src);
            xhr.setRequestHeader('Authorization', Authorization_s);
            xhr.onload = function () {
                 const url = URL.createObjectURL(xhr.response);
                 const img = tile.getImage();
                 img.addEventListener('load',function(){
                     URL.revokeObjectURL(url);
                 });
                 img.src = url;
            };
            xhr.send();
        }
    });
    const mapLayers = new ol.layer.Tile({source: mapSource});
    const map = new ol.Map({
        layers: [mapLayers],
        view: new ol.View({
            center: ol.proj.transform(
                [111.8957, 27.8613],
                "EPSG:4326",
                "EPSG:3857"
            ),
            zoom: 8,
        }),
        target: mapd,
    });
}

function loadanalysisf(ip,port,Authorization_s,mapd,funcname){
    var fu = eval(funcname);
    new fu(ip,port,Authorization_s,mapd);
}

function getxianbypt(ip,port,Authorization_s,mapd){
    const projection = ol.proj.get("EPSG:4326");
    const projectionExtent = projection.getExtent();
    const size = ol.extent.getWidth(projectionExtent)/256;
    const resolutions = new Array(19);
    const matrixIds = new Array(19);
    for(let z=0;z<19;++z){
         resolutions[z] = size / Math.pow(2,z+1);
         matrixIds[z] = "EPSG:4326"+":"+z;
    }
    const wmtsSource = new ol.source.WMTS({
        url: ip + ":" + port + "/" + "geoserver/basemap/gwc/service/wmts",
        layer: "basemap:xian",
        matrixSet: "EPSG:4326",
        format: "image/jpeg",
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds,
        }),
        style: '',
        wrapX: true,
        tileLoadFunction: function (tile, src) {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', src);
            xhr.setRequestHeader('Authorization', Authorization_s);
            xhr.onload = function () {
                const url = URL.createObjectURL(xhr.response);
                const img = tile.getImage();
                img.addEventListener('load', function () {
                    URL.revokeObjectURL(url);
                });
                img.src = url;
            };
            xhr.send();
        }
    });
    const wmtsService = new ol.layer.Tile({
        source: wmtsSource
    });
    var vectorSource = new ol.source.Vector();
    const featureLayer = new ol.layer.Vector({
        source: vectorSource,
    });
    setFeature([[100,25],[["","","",null]]]);
    const map = new ol.Map({
        target: mapd,
        layers: [wmtsService, featureLayer],
        view: new ol.View({
            projection: "EPSG:4326",
        }),
    });
    map.getView().fit([108.78571637271052,24.63934396381616,114.25618232715077,30.12909470046884], map.getSize());
    function setFeature(tl){
        const features = [];
        vectorSource.clear();
        var feature = new ol.Feature({
            geometry:new ol.geom.Point(tl[0]),
            name:'test',
        });
        let showtext = tl[0][0].toFixed(2) + " " + tl[0][1].toFixed(2) + " ";
        for(let m=0;m<tl[1].length;m++){
            showtext += tl[1][m][0]+" "+tl[1][m][1]+" "+tl[1][m][2]+"\n";
        }
        feature.setStyle(
            new ol.style.Style({
                text:new ol.style.Text({
                    textAlign:"center",
                    textBaseline:"middle",
                    text:showtext,
                    fill:new ol.style.Fill({
                        color:"red",
                    }),
                }),
            })
        );
        for(let m=0;m<tl[1].length;m++){
            geometry = tl[1][m][3];
          //  console.log(geometry);
            if(geometry!=null){
                for(let i=0; i<geometry.length; i++){
                    var polygonfeature = new ol.Feature({
                        geometry:new ol.geom.Polygon(geometry[i]),
                        name:'pl',
                    });
                    polygonfeature.setStyle(
                        new ol.style.Style({
                           fill:new ol.style.Fill({
                               color:"yellow",
                               opacity:0.5,
                           }),
                        })
                    );
                    features.push(polygonfeature);
                };
            }
        }
        features.push(feature);
        vectorSource.addFeatures(features);
    };
    map.on('click',function (event){
     //  console.log(event.coordinate[0].toString(),event.coordinate[1].toString());
       const xhr = new XMLHttpRequest();
       var coordd = ol.proj.transform(event.coordinate,"EPSG:4326","EPSG:3857");
       xhr.open('GET',ip+":"+port+"/"+'geoserver/basemapanalysis/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=basemapanalysis%3Axian_st_contain&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:4326&viewparams=x1:'+coordd[0].toString()+';x2:'+coordd[1].toString());
       xhr.setRequestHeader('Authorization', Authorization_s);
       xhr.send();
       xhr.onreadystatechange = function() {
           if (xhr.readyState === 4) {
               if (xhr.status === 200) {
                   let responseData = xhr.responseText;
                   console.log(JSON.stringify(responseData));
                   responseData = JSON.parse(responseData);
                   var tl = [event.coordinate,[]];
                   for(let m=0;m<responseData["totalFeatures"];m++){
                       const sname = responseData["features"][m]["properties"]["sname"];
                       const cname = responseData["features"][m]["properties"]["cname"];
                       const xname = responseData["features"][m]["properties"]["xname"];
                       const geometries = [];
                       for(let i=0;i<responseData["features"][m]["geometry"]["geometries"].length;i++){
                           geometries.push(responseData["features"][m]["geometry"]["geometries"][i]["coordinates"]);
                       }
                       tl[1].push([sname,cname,xname,geometries]);
                   }
                   setFeature(tl);
               } else if (xhr.status === 404) {
                   console.log('Resource not found');
               }
           }
       }
        //   setFeature(event.coordinate)
    });
}

function getxiangzhenbypt(ip,port,Authorization_s,mapd){
    const projection = ol.proj.get("EPSG:4326");
    const projectionExtent = projection.getExtent();
    const size = ol.extent.getWidth(projectionExtent)/256;
    const resolutions = new Array(19);
    const matrixIds = new Array(19);
    for(let z=0;z<19;++z){
         resolutions[z] = size / Math.pow(2,z+1);
         matrixIds[z] = "EPSG:4326"+":"+z;
    }
    const wmtsSource = new ol.source.WMTS({
        url: ip + ":" + port + "/" + "geoserver/basemap/gwc/service/wmts",
        layer: "basemap:xiangzhen",
        matrixSet: "EPSG:4326",
        format: "image/jpeg",
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds,
        }),
        style: '',
        wrapX: true,
        tileLoadFunction: function (tile, src) {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', src);
            xhr.setRequestHeader('Authorization', Authorization_s);
            xhr.onload = function () {
                const url = URL.createObjectURL(xhr.response);
                const img = tile.getImage();
                img.addEventListener('load', function () {
                    URL.revokeObjectURL(url);
                });
                img.src = url;
            };
            xhr.send();
        }
    });
    const wmtsService = new ol.layer.Tile({
        source: wmtsSource
    });
    var vectorSource = new ol.source.Vector();
    const featureLayer = new ol.layer.Vector({
        source: vectorSource,
    });
    setFeature([[100,25],["","","",""]]);
    const map = new ol.Map({
        target: mapd,
        layers: [wmtsService, featureLayer],
        view: new ol.View({
            projection: "EPSG:4326",
        }),
    });
    map.getView().fit([108.78571637271052,24.63934396381616,114.25618232715077,30.12909470046884], map.getSize());
    function setFeature(tl){
        var features = [];
        vectorSource.clear();
        var feature = new ol.Feature({
                geometry:new ol.geom.Point(tl[0]),
                name:'test',
        });
        let showtext = tl[0][0].toFixed(2) + " " + tl[0][1].toFixed(2) + " ";
        for(let m=0;m<tl[1].length;m++){
            showtext += tl[1][m][0] + " " + tl[1][m][1] + " " + tl[1][m][2] + " " + tl[1][m][3]+" ("+tl[1][m][4] + ")\n";
        }
        feature.setStyle(
            new ol.style.Style({
                text:new ol.style.Text({
                    textAlign:"center",
                    textBaseline:"middle",
                    text:showtext,
                    fill:new ol.style.Fill({
                        color:"red",
                    }),
                }),
            })
        );
        features.push(feature);
        vectorSource.addFeatures(features);
    };
    map.on('click',function (event){
       const xhr = new XMLHttpRequest();
       var coordd = ol.proj.transform(event.coordinate,"EPSG:4326","EPSG:3857");
       xhr.open('GET',ip+":"+port+"/"+'geoserver/basemapanalysis/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=basemapanalysis%3Axiangzhen_st_contain&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:4326&viewparams=x1:'+coordd[0].toString()+';x2:'+coordd[1].toString());
       xhr.setRequestHeader('Authorization', Authorization_s);
       xhr.send();
       xhr.onreadystatechange = function() {
           if (xhr.readyState === 4) {
               if (xhr.status === 200) {
                   let responseData = xhr.responseText;
                   console.log(JSON.stringify(responseData));
                   responseData = JSON.parse(responseData);
                   var tl = [event.coordinate,[]];
                   for(let m=0;m<responseData["totalFeatures"];m++){
                       const sname = responseData["features"][m]["properties"]["sname"];
                       const cname = responseData["features"][m]["properties"]["cname"];
                       const xname = responseData["features"][m]["properties"]["xname"];
                       const vname = responseData["features"][m]["properties"]["vname"];
                       const name = responseData["features"][m]["properties"]["name"];
                       tl[1].push([sname,cname,xname,vname,name]);
                   }
                   setFeature(tl);
               } else if (xhr.status === 404) {
                   console.log('Resource not found');
               }
           }
       }
    });
}