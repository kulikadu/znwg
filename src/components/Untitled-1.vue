<template>
  <div ref="mapCon" id="mapCon"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Draw, MouseWheelZoom } from 'ol/interaction'
import TileLayer from 'ol/layer/Tile'
import Layer from 'ol/layer/Layer.js'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON'
import { Image as ImageLayer } from 'ol/layer'
import { OSM, TileWMS, ImageWMS } from 'ol/source'
import { Fill, Stroke, Style, Text, Circle as CircleStyle } from 'ol/style'
import Feature from 'ol/Feature'
import { Circle, LineString, Point, Polygon } from 'ol/geom'
import * as turf from '@turf/turf'
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js'
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js'
import WebGLTile from 'ol/layer/WebGLTile.js'
import FileSaver from 'file-saver'
import { extentFromProjection } from 'ol/tilegrid'
import { transformExtent } from 'ol/proj.js'

const mapCon = ref(0)

const beijing = fromLonLat([116.28, 39.54])
let map,
    olPolygon = [],
    fc = []

let geojsonData_Polygon = {
    type: 'FeatureCollection',
    features: []
}
let geojsonData_Point = {
    type: 'FeatureCollection',
    features: []
}
onMounted(() => {
    map = new Map({
        layers: [],
        target: mapCon.value,
        view: new View({
            center: beijing,
            minZoom: 4,
            zoom: 2
        })
    })

    // WMS服务的URL
    const wmsUrl =
        'http://localhost:8080/geoserver/ZN/wfs?service=WFS&version=1.1.0&request=GetMap&layers=ZN%3Achina&bbox=73.502355%2C3.39716187%2C135.09567%2C53.563269&width=768&height=625&srs=EPSG%3A4326&styles=&format=image%2Fpng'
    // const wmsUrl = 'http://localhost:8080/geoserver/testArea/wms?service=WMS&version=1.1.0&request=GetMap&layers=testArea%3Achina&bbox=73.502355%2C3.39716187%2C135.09567%2C53.563269&width=768&height=625&srs=EPSG%3A4326&format=image%2Fpng'

    // 创建WMS图层
    const wmsLayer = new TileLayer({
        className: 'wms-vector',
        title: 'china',
        preload: Infinity,
        source: new TileWMS({
            url: wmsUrl,
            params: {
                LAYERS: 'ZN:china', // 指定WMS层名
                TILED: true, // 请求分块的图片
                STYLE: ''
            },
            serverType: 'geoserver' // WMS服务器类型，可选
        })
    })

    // 将 Vector 图层添加到地图中
    map.addLayer(wmsLayer)

    // fetch('src/assets/rain.json')
    fetch('src/assets/降水_5.json')
        // fetch('http://10.111.102.30:8082/znwg-api/test/gridrains?i=5')
        .then((res) => res.json())
        .then((data) => {
            // data = data.data
            let gap = 5
            showGrid(data, gap)
        })

    //鼠标滚轮滑动的时候
    map.on('moveend', (evt) => {
        let currentZoom = map.getView().getZoom()
        console.log(currentZoom)
        // if (9 > currentZoom > 8) {
        //     reShowData(3)
        // } else if (currentZoom > 9) {
        //     reShowData(1)
        // }
    })

    let draw = new Draw({
        source: new VectorSource(),
        type: 'Polygon',
        freehand: true
    })
    // map.addInteraction(draw)

    const selectedFeatures = new VectorLayer({
        title: 'renderFeatures',
        source: new VectorSource(),
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 0, 0.5)' // 点击后地块的颜色
            }),
            stroke: new Stroke({
                color: '#333',
                width: 1
            })
        })
    })
    map.addLayer(selectedFeatures)

    draw.on('drawend', function (event) {
        let feature = event.feature
        let pids = []
        selectedFeatures.getSource().clear()
        selectedFeatures.getSource().addFeature(feature)

        const openlayersFeature = feature

        // 创建GeoJSON格式器
        const geojsonFormat = new GeoJSON()

        // 将OpenLayers的Feature转换为GeoJSON的Feature
        const geojsonFeature = geojsonFormat.writeFeatureObject(openlayersFeature)
        var ptsWithin = turf.pointsWithinPolygon(geojsonData_Point, geojsonFeature)
        ptsWithin.features.map((item) => pids.push(item.properties.pid))
        console.log(pids)
        map.removeInteraction(draw)
    })

    let lever = 12
    map.on('moveend', () => {
        //let extentPolygon
        let currentZoom = map.getView().getZoom()
        let currentLever = dosthByZoom(currentZoom)
        if (currentLever == 1) {
            if (lever == currentLever) return
            lever = currentLever
            let layers = map.getLayers().getArray()
            layers.map((item) => {
                if (item.get('title') === 'extentPolygonLayer') {
                    map.removeLayer(item)
                }
            })
            layers.map((item) => {
                if (item.get('title') === 'grid_VectorLayer') {
                    map.removeLayer(item)
                }
            })
            layers.map((item) => {
                if (item.get('title') === 'newGridLayer') {
                    map.removeLayer(item)
                }
            })

            // 获取当前视口的边界
            let extent = map.getView().calculateExtent(map.getSize())
            // 在这里编写加载数据的逻辑，例如使用 extent 变量
            // extent = transformExtent(extent, 'EPSG:3857', 'EPSG:4326')
            console.log('视口边界变化，加载相关数据:', extent)
            createExtentPolygon(map, extent[0], extent[2], extent[1], extent[3])
            let turfPolygon = turf.polygon([
                [
                    [extent[0], extent[3]],
                    [extent[0], extent[1]],
                    [extent[2], extent[1]],
                    [extent[2], extent[3]],
                    [extent[0], extent[3]]
                ]
            ])
            let turfFeature = turf.feature(turfPolygon)
            var geometry = {
                type: 'Polygon',
                coordinates: [
                    [
                        [extent[0], extent[3]],
                        [extent[0], extent[1]],
                        [extent[2], extent[1]],
                        [extent[2], extent[3]],
                        [extent[0], extent[3]]
                    ]
                ]
            }

            var feature = turf.feature(geometry)
            var ptsWithin = turf.pointsWithinPolygon(geojsonData_Point, feature)
            let pids = []
            ptsWithin.features.map((item) => pids.push(item.properties.pid))
            console.log(pids)
            // fc.push(turfPolygon)

            let newPIds = []
            let newFeatures = {
                type: 'FeatureCollection',
                features: []
            }
            // for (let i = 0; i < fc.length; i++) {
            //     // let newP = turf.intersect(fc[i], turfPolygon)
            //     let newP = turf.intersect(turf.featureCollection([fc[i], turfPolygon]))
            //     if (newP != null && newP != turfPolygon) {
            //         console.log(i)
            //         // console.log(newP.geometry.coordinates)

            //         newPIds.push(i)
            //         newFeatures.features.push(fc[i])
            //     }
            // }
            // const newGridLayer = new VectorLayer({
            //     title: 'newGridLayer',
            //     opacity: 0.8,
            //     source: new VectorSource({
            //         features: new GeoJSON().readFeatures(newFeatures)
            //         // features: new GeoJSON().readFeatures(geojsonData_Point)
            //     }),

            //     style: (feature) => {
            //         return new Style({
            //             fill: new Fill({ color: feature.get('color') }),
            //             stroke: new Stroke({ color: feature.get('color'), width: 1 }),
            //             text: new Text({
            //                 text: feature.get('value'),
            //                 font: '12px Calibri,sans-serif',
            //                 fill: new Fill({ color: '#000' }),
            //                 stroke: new Stroke({
            //                     color: '#fff',
            //                     width: 3
            //                 })
            //             })
            //         })
            //     }
            // })
            // map.addLayer(newGridLayer)
            // for (let i = 0;i<geojsonData_Polygon.getFeatures().length;i++) {
            //     if (newPIds.indexOf(i) == -1) {
            //         geojsonData_Polygon.removeFeature(geojsonData_Polygon.getFeatures()[i])
            //     }
            // }

            // for (let i = 0; i < olPolygon.length; i++) {
            //     const polygon = olPolygon[i]
            // const newP = turf.intersect(extentPolygon, polygon)

            //     map.addLayer(intersectPolygonLayer)
            // }
            // var intersection = turf.intersect(turf.featureCollection(fc))

            // const intersection = intersect(polygon1, polygon2);

            // const extentPolygon = olPolygon.intersect(extentPolygon)
        }
    })
})

const dosthByZoom = (zoom) => {
    if (5 < zoom && zoom < 7) {
        return 1
    }
    return 0
}

const createExtentPolygon = (map, minLongitude, maxLongitude, minLatitude, maxLatitude) => {
    // 创建一个多边形的坐标数组a
    let geometry = new Polygon([
        [
            fromLonLat([minLongitude, maxLatitude]),
            fromLonLat([minLongitude, minLatitude]),
            fromLonLat([maxLongitude, minLatitude]),
            fromLonLat([maxLongitude, maxLatitude]),
            fromLonLat([minLongitude, maxLatitude])
        ]
    ])

    let feature = new Feature(geometry)

    // 创建一个样式
    const style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.1)'
        }),
        stroke: new Stroke({
            color: '#ffcc33',
            width: 2
            ￥你个弟弟人：111
        })
    })
    // 创建多边形图层
    const extentPolygonLayer = new VectorLayer({
        title: 'extentPolygonLayer',
        source: new VectorSource({
            features: [feature]
        }),
        style: style
    })
    let layers = map.getLayers().getArray()
    layers.map((item) => {
        if (item.get('title') === 'extentPolygonLayer') {
            map.removeLayer(item)
        }
    })
    map.addLayer(extentPolygonLayer)
    return extentPolygonLayer
}

const reShowData = (gap) => {
    let layers = map.getLayers().getArray()
    layers.map((item) => {
        if (item.get('title') === 'grid_VectorLayer') {
            map.removeLayer(item)
        }
    })
    fetch('src/assets/降水_5.json')
        // fetch('http://10.111.102.30:8082/znwg-api/test/gridrains?i=5')
        .then((res) => res.json())
        .then((data) => {
            // data = data.data
            showGrid(data, gap)
        })
}
const getColor = (value) => {
    let valueGap = [0.1, 10, 25, 50, 100, 250, 10000]
    let color = ['rgb(255,255,255)', 'rgb(166,242,143)', 'rgb(61,186,61)', 'rgb(97,184,255)', 'rgb(0,0,255)', 'rgb(250,0,250)', 'rgb(128,0,64)']
    for (let i = 0; i < valueGap.length; i++) {
        if (value < valueGap[i]) {
            return color[i]
        }
    }
}

const showGrid = (data, gap) => {
    const layers = map.getLayers().getArray()
    //避免图层重复添加，先移除
    if (layers.length > 0) {
        layers.forEach((item) => {
            if (item.values_.title == 'grid_WebGLLayer') {
                map.removeLayer(item)
                // map.removeLayer(webglLayer);
                // WebGLLayer.dispose();
            }
        })
    }

    let latGap = data.lat
    let lonGap = data.lon
    // let startlat = data.startlat - latGap / 2
    // let endlat = data.endlat + latGap / 2
    // let startlon = data.startlon - lonGap / 2
    // let endlon = data.endlon + lonGap / 2
    let startlat = data.startlat
    let endlat = data.endlat + latGap
    let startlon = data.startlon
    let endlon = data.endlon + lonGap
    let values = data.value
    let numX = (endlon - startlon) / lonGap
    let numY = (endlat - startlat) / latGap
    // numX = Math.ceil(numX) - 1
    // numY = Math.floor(numY) - 1
    numX = Math.round(numX)
    numY = Math.round(numY)

    //创建网格
    // let gap = 5
    let newNumX = Math.round(numX / gap)
    let newNumY = Math.round(numY / gap)
    for (let i = 0; i < newNumY + 1; i++) {
        for (let j = 0; j < newNumX + 1; j++) {
            let pid = j == 0 && i == 0 ? 0 : (i * numX + j) * gap - 1
            let color = getColor(values[pid])

            let minLat, maxLat, minLon, maxLon
            minLat = startlat + latGap * i * gap
            maxLat = minLat + latGap * gap
            minLon = startlon + lonGap * j * gap
            maxLon = minLon + lonGap * gap

            fc.push(
                turf.polygon(
                    [
                        [
                            [minLon, minLat],
                            [maxLon, minLat],
                            [maxLon, maxLat],
                            [minLon, maxLat],
                            [minLon, minLat]
                        ]
                    ],
                    {
                        color: color,
                        value: `${values[pid]}`,
                        pid: pid
                    }
                )
            )
            //创建网格
            geojsonData_Polygon.features.push({
                type: 'Feature',
                properties: {
                    color: color,
                    value: `${values[pid]}`,
                    pid: pid
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            fromLonLat([minLon, minLat]),
                            fromLonLat([maxLon, minLat]),
                            fromLonLat([maxLon, maxLat]),
                            fromLonLat([minLon, maxLat]),
                            fromLonLat([minLon, minLat])
                        ]
                    ]
                }
            })

            //创建格点
            geojsonData_Point.features.push({
                type: 'Feature',
                properties: {
                    color: color,
                    value: `${values[pid]}`,
                    pid: pid
                },
                geometry: {
                    type: 'Point',
                    coordinates: fromLonLat([startlon + lonGap * j * gap, startlat + latGap * i * gap])
                }
            })
        }
    }
    // 解析GeoJSON数据为OpenLayers Polygon
    const format = new GeoJSON()
    const polygon = format.readFeatures(geojsonData_Polygon)

    // 获取Polygon的几何对象
    for (let i = 0; i < polygon.length; i++) {
        olPolygon.push(polygon[i].getGeometry())
    }

    const polygonLayer = new VectorLayer({
        title: 'grid_VectorLayer',
        opacity: 0.8,
        source: new VectorSource({
            features: new GeoJSON().readFeatures(geojsonData_Polygon)
            // features: new GeoJSON().readFeatures(geojsonData_Point)
        }),

        style: (feature) => {
            return new Style({
                fill: new Fill({ color: feature.get('color') }),
                stroke: new Stroke({ color: feature.get('color'), width: 1 }),
                text: new Text({
                    text: feature.get('value'),
                    font: '12px Calibri,sans-serif',
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            })
        }
    })

    const pointLayer = new VectorLayer({
        title: 'point_VectorLayer',
        source: new VectorSource({
            features: new GeoJSON().readFeatures(geojsonData_Point)
            // features: feature
        }),
        style: (feature) => {
            return new Style({
                image: new CircleStyle({
                    radius: 3,
                    fill: new Fill({ color: feature.get('color') })
                })
                // text: new Text({
                //   text: feature.get('pid'),
                //   font: '12px Calibri,sans-serif',
                //   fill: new Fill({ color: '#000' }),
                //   stroke: new Stroke({
                //     color: '#fff', width: 3
                //   })
                // }),
            })
        }
    })
    map.addLayer(polygonLayer)
    // map.addLayer(pointLayer)

    //  创建并加载WebGLLayer
    const style = {
        'fill-color': ['*', ['get', 'color'], [255, 255, 255, 0.6]],
        'text-font': ['*', ['get', 'pid'], ['12px Calibri,sans-serif']],
        'text-text': ['*', ['get', 'pid'], ['22']]
    }
    class WebGLLayer extends Layer {
        createRenderer() {
            return new WebGLVectorLayerRenderer(this, { style })
        }
    }
    const webglLayer = new WebGLLayer({
        title: 'grid_WebGLLayer',
        source: new VectorSource({
            features: new GeoJSON().readFeatures(geojsonData_Polygon)
            // features: new GeoJSON().readFeatures(geojsonData_Point)
        })
    })
    // 将 Vector 图层添加到地图中
    // map.addLayer(webglLayer)

    // 创建并加载WebGLPointsLayer
    const webglLayer_point = new WebGLPointsLayer({
        title: 'gridPoint_WebGLLayer',
        source: new VectorSource({
            features: new GeoJSON().readFeatures(geojsonData_Point)
        }),
        style: {
            'icon-src': 'src/assets/images/4.png',
            'icon-width': 2,
            'icon-height': 2,
            // 'icon-color': 'lightyellow',
            'icon-rotate-with-view': false,
            'icon-displacement': [0, 9]
        }
    })
    // map.addLayer(webglLayer_point)
}
</script>

<style lang="less" scoped>
#mapCon {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
