<template>
  <div ref="mapCon" id="mapCon"></div>
  <!-- <el-button class="btn-mapping" @click="mapping">成图</el-button>
  <el-button class="btn-screenshot" @click="screenshot">截屏</el-button> -->
  <!-- <el-button class="btn-modi" @click="modi">订正</el-button> -->

  <div class="info" id="info" v-show="isshowInfo">
    <div class="info-item">
      <span>PID：</span>
      <span>{{ pid }}</span>
    </div>
    <div class="info-item">
      <span>值：</span>
      <span>{{ infoValue }}</span>
    </div>
  </div>

  <section id="changeNum" class="changeNum" v-show="isshowNum">
    <div>
      <el-radio-group @change="radioChange">
        <el-radio :value="1">赋值</el-radio>
        <el-radio :value="2">加值</el-radio>
        <el-radio :value="3">减值</el-radio>
        <el-radio :value="4">最大值</el-radio>
        <el-radio :value="5">最小值</el-radio>
      </el-radio-group>
    </div>
    <div style="display: flex; flex-wrap: nowrap; justify-content: space-around">
      <el-input-number v-model="num" :precision="1" :step="0.1" :max="10000" size="small" />
      <el-button @click="changeValue">确定</el-button>
    </div>
  </section>

  <section id="changeNum2" class="changeNum" v-show="isshowNum">
    <div>
      <el-radio-group @change="radioChange" v-model="radio">
        <el-radio value="赋值">赋值</el-radio>
        <el-radio value="加值">加值</el-radio>
        <el-radio value="减值">减值</el-radio>
        <el-radio value="最大值">最大值</el-radio>
        <el-radio value="最小值">最小值</el-radio>
      </el-radio-group>
    </div>
    <div style="display: flex; flex-wrap: nowrap; justify-content: space-around">
      <el-input-number v-model="num" :precision="1" :step="0.1" :max="10000" size="small" />
      <el-button @click="changeValue2">确定</el-button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
import Graticule from 'ol/layer/Graticule'
import * as olExtent from 'ol/extent'
import { Draw, Extent } from 'ol/interaction'
import * as Format from 'ol/format'
import { and as andFilter, equalTo as equalToFilter, like as likeFilter } from 'ol/format/filter.js'
import Intersects from 'ol/format/filter/Intersects.js'
import { within } from 'ol/format/filter'
import TileLayer from 'ol/layer/Tile'
import { transform } from 'ol/proj'
import Layer from 'ol/layer/Layer.js'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import { containsExtent } from 'ol/extent'
import GeoJSON from 'ol/format/GeoJSON'
import { Image as ImageLayer } from 'ol/layer'
import { OSM, TileWMS, ImageWMS } from 'ol/source'
import { Fill, Stroke, Style, Text, Circle as CircleStyle } from 'ol/style'
import Feature from 'ol/Feature'
import { Circle, LineString, Point, Polygon } from 'ol/geom'
import { fromExtent } from 'ol/geom/Polygon'
import * as turf from '@turf/turf'
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js'
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js'
import WebGLTile from 'ol/layer/WebGLTile.js'
import html2canvas from 'html2canvas'
import fs from 'file-saver'
import { getView, getTileWms, getGridValueByClick } from '@/assets/Map/map'
import { useSysStore } from '@/stores/sys'
import { getBusinessLayer } from '@/assets/getBusinessLayer'
import { fetchGet, fetchPost, getUpdateUrl } from '@/api'

// import { fromLonLat } from 'ol/proj'
import { Select } from 'ol/interaction'
import { MousePosition, OverviewMap, ScaleLine } from 'ol/control'
import { singleClick } from 'ol/events/condition'

const sysStore = useSysStore()
let pid = ref(null)
let infoValue = ref(-1)
let num = ref(-1)
let radioValue = ref()
let isshowInfo = true
let isshowNum = true
const mapCon = ref()

let PID

let map, tileWms
let pids = []
const key = '9d871cee845e322ca402f38ade03b7b2'
const radio = ref('赋值')
const radioChange = (val) => {
  radioValue.value = val
}
let info, changeNum, changeNum2
let currentFeature, selectedFeatures
onMounted(() => {
  info = document.getElementById('info')
  changeNum = document.getElementsByClassName('changeNum')[0]
  changeNum2 = document.getElementById('changeNum2')
  initMap()

  // map.on('pointermove', showInfo);
  // map.on('click', showBox);

  // 创建一个样式
  // const style = new Style({
  //   fill: new Fill({
  //     color: 'rgba(255, 0, 0, 1)'
  //   }),
  //   stroke: new Stroke({
  //     color: '#ffcc33',
  //     width: 20
  //   })
  // })
  // // 绘制红色范围
  // const sourceExtent = new VectorSource()
  // const layerExtent = new VectorLayer({
  //   source: sourceExtent,
  //   style: style
  // })
  // map.addLayer(layerExtent)
  // 视图改变时，再次绘制范围

  // map.on('moveend', (e) => {
  //   // let extent = map.getView().calculateExtent(map.getSize())
  //   // // 在这里编写加载数据的逻辑，例如使用 extent 变量
  //   // // extent = transformExtent(extent, 'EPSG:3857', 'EPSG:4326')
  //   // console.log('视口边界变化，加载相关数据:', extent)
  //   // createExtentPolygon(map, extent[0], extent[2], extent[1], extent[3])
  //   // createExtentSource(sourceExtent, layerExtent)
  //   let layers = map.getLayers().getArray()

  //   let businessSource, layer
  //   layers.map((item) => {
  //     if (item.get('title') === 'grid_VectorLayer') {
  //       businessSource = item.getSource()
  //       layer = item
  //     }
  //   })

  //   // let style = businessLayer.getStyle()
  //   if (layer) {
  //     let businessLayer = new VectorLayer({
  //       // source: businessLayer.getSource(),
  //       source: businessSource,
  //       style: (feature) => {
  //         const calculateExtent = map.getView().calculateExtent()
  //         const extent = feature.getGeometry().getExtent()
  //         // const isTrue = isInExtent(calculateExtent, extent)
  //         // const isWithinExtent = containsExtent(calculateExtent, extent)
  //         const isWithinExtent = olExtent.intersects(calculateExtent, extent)
  //         return isWithinExtent
  //           ? new Style({
  //               fill: new Fill({ color: feature.get('color') }),
  //               stroke: new Stroke({ color: feature.get('color'), width: 0 }),
  //               text: new Text({
  //                 text: [
  //                   `${feature.get('value1')}`,
  //                   '10px Calibri,sans-serif',
  //                   '\n',
  //                   '',
  //                   `${feature.get('value2')}`,
  //                   '10px Calibri,sans-serif'
  //                 ],
  //                 overflow: true,
  //                 // font: '12px Calibri,sans-serif',
  //                 fill: new Fill({ color: '#000' }),
  //                 stroke: new Stroke({
  //                   color: '#fff',
  //                   width: 3
  //                 })
  //               })
  //             })
  //           : null
  //       }
  //     })
  //     sysStore.setBusinessLayer(businessLayer)
  //     // map.addLayer(businessLayer)
  //   }
  // })
})

// 范围
// const createExtentSource = (sourceExtent, layerExtent) => {
//   const [x1, y1, x2, y2] = map.getView().calculateExtent(map.getSize())
//   // 创建一个多边形的坐标数组
//   let geometry = new Polygon([
//     [
//       fromLonLat([x1, y2]),
//       fromLonLat([x1, y1]),
//       fromLonLat([x2, y1]),
//       fromLonLat([x2, y2]),
//       fromLonLat([x1, y2])
//     ]
//   ])

//   let feature = new Feature(geometry)

//   sourceExtent.addFeature(feature)
//   layerExtent.getSource().refresh()
// }

// 判断点标记是否在范围内
function isInExtent(Extent, Point) {
  return (
    Extent[0] <= Point[0] && Point[0] <= Extent[2] && Extent[1] <= Point[1] && Point[1] <= Extent[3]
  )
}
//初始化地图
const initMap = () => {
  //天地图矢量图层
  const tdtVectorLayer = new TileLayer({
    className: 'tdt-vector',
    preload: Infinity,
    source: new XYZ({
      url: `http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${key}`
    })
  })

  //天地图矢量注记图层
  const tdtVectorLabelLayer = new TileLayer({
    className: 'tdt-vector-label',
    source: new XYZ({
      url: `http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${key}`
    })
  })

  //经纬度网
  const graticule = new Graticule({
    // the style to use for the lines, optional.
    strokeStyle: new Stroke({
      color: 'rgba(255,120,0,0)',
      width: 2,
      lineDash: [0.5, 4]
    }),
    showLabels: true,
    wrapX: true,
    lonLabelPosition: 0.1,
    latLabelPosition: 0.1
    // intervals: [180, 10]
  })
  map = new Map({
    layers: [],
    target: mapCon.value,
    view: getView()
  })
  map.addLayer(graticule)
  // map.addLayer(tdtVectorLayer)
  // map.addLayer(tdtVectorLabelLayer)
  sysStore.setMap(map)
  // WMS服务的URL

  // 创建WMS图层
  tileWms = getTileWms()
  // let wmsLayer = new TileLayer({
  //   className: 'wms-vector',
  //   title: 'china',
  //   preload: Infinity,
  //   source: tileWms
  // })
  let wmsLayer = new TileLayer({
    className: 'wms-vector',
    title: 'china',
    preload: Infinity,
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/ZN/wms?service=WMS&version=1.1.0&request=GetMap&layers=ZN%3Achina&bbox=73.502355%2C3.39716187%2C135.09567%2C53.563269&width=768&height=625&srs=EPSG%3A4326&styles=&format=image%2Fpng'
    })
  })
  let wmsLayer2 = new TileLayer({
    className: 'wms-vector',
    title: 'hunan',
    preload: Infinity,
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/ZN/wms?service=WMS&version=1.1.0&request=GetMap&layers=ZN%3Ahunan&bbox=108.78612710158455%2C24.63925367381802%2C114.25650291427814%2C30.128722293199303&width=765&height=768&srs=EPSG%3A4326&styles=&format=image%2Fpng'
    })
  })
  map.addLayer(wmsLayer)
  map.addLayer(wmsLayer2)

  //创建覆盖层

  selectedFeatures = new VectorLayer({
    title: 'renderFeatures',
    source: new VectorSource(),
    opacity: 1,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.5)' // 点击后地块的颜色
      }),
      stroke: new Stroke({
        color: '#333',
        width: 1
      })
    }),
    zIndex: 10
  })
  map.addLayer(selectedFeatures)
  sysStore.setSelectedFeatures(selectedFeatures)
  // 监听点击事件(市、县格点订正)
  // map.on('singleclick', async (event) => {
  //   let status = await getGridValueByClick(event.coordinate, 'hunan_city')
  //   status == 1 ? showBox2(event.coordinate) : null
  // })
}
// const getGridValueByClick = (event, name) => {
//   let geoPoint = new Point(event.coordinate)
//   let url = tileWms.getFeatureInfoUrl(
//     geoPoint.getCoordinates(),
//     map.getView().getResolution(),
//     map.getView().getProjection(),
//     {
//       // INFO_FORMAT: 'text/html',
//       INFO_FORMAT: 'application/json',
//       QUERY_LAYERS: `china:hunan_${name}`
//     }
//   )
//   if (url) {
//     fetch(url)
//       .then((response) => response.json())
//       // .then((response) => response.text())
//       .then((json) => {
//         const features = new GeoJSON().readFeatures(json)

//         selectedFeatures.getSource().clear()
//         selectedFeatures.getSource().addFeature(features[0])
//         let text = new Text({
//           text: features[0].get('name'),
//           fill: new Fill({ color: 'black' }),
//           stroke: new Stroke({ color: 'white', width: 1 })
//         })
//         selectedFeatures.getStyle().setText(text)

//         let businessFullPoint = sysStore.businessFullPoint
//         if (businessFullPoint == null) {
//           alert('请先选择数据源！')
//         } else {
//           pids = []
//           var ptsWithin = turf.pointsWithinPolygon(businessFullPoint, json)
//           ptsWithin.features.map((item) => pids.push(item.properties.pid))
//           console.log(pids)
//           showBox2(event)
//         }
//       })
//   }
// }

let draw = new Draw({
  source: new VectorSource(),
  type: 'Polygon',
  freehand: true
})
sysStore.setDraw(draw)
// map.addInteraction(draw)

draw.on('drawend', function (event) {
  let businessFullPoint = sysStore.businessFullPoint
  if (businessFullPoint == null) return alert('请先选择要素！')
  const olFeature = event.feature
  pids = []
  selectedFeatures.getSource().clear()
  selectedFeatures.getSource().addFeature(olFeature)
  currentFeature = olFeature

  // 将OpenLayers的Feature转换为GeoJSON的Feature
  const geojsonFeature = new GeoJSON().writeFeatureObject(olFeature)
  var ptsWithin = turf.pointsWithinPolygon(businessFullPoint, geojsonFeature)
  ptsWithin.features.map((item) => pids.push(item.properties.pid))
  console.log(pids)
  map.removeInteraction(draw)
  showBox2(event)
})

// 获取与绘制图形相交的市、县数据
const getDataByIntersects = (olFeature) => {
  const featureRequest = new Format.WFS().writeGetFeature({
    srcName: 'EPSG:4326',
    featureNS: 'http://localhost:8080/geoserver/china/wfs',
    featurePrefix: 'china', // 工作区名称
    featureTypes: ['china:hunan_city', 'china:hunan_country'],
    outputFormat: 'application/json',
    // filter: equalToFilter('name', '永州市')
    // filter: bboxFilter(evt.coordinate, 0.01, 'EPSG:3857')
    filter: new Intersects('the_geom', olFeature.getGeometry(), 'EPSG:3857')
  })

  // then post the request and add the received features to a layer
  fetch('http://localhost:8080/geoserver/china/wfs', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest)
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (json) {
      const features = new GeoJSON().readFeatures(json, {
        dataProjection: 'EPSG:4326', // GeoJSON 数据的原始投影
        featureProjection: 'EPSG:3857' // 要转换到的目标投影
      })
      let vectorSource = new VectorSource()
      vectorSource.addFeatures(features)
      let layer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          return new Style({
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.7)'
            }),
            stroke: new Stroke({
              color: '#333',
              width: 1
            }),
            text: new Text({
              text: feature.get('name'),
              fill: new Fill({ color: 'black' }),
              stroke: new Stroke({ color: 'white', width: 2 })
            })
          })
        }
      })
      map.getView().fit(vectorSource.getExtent())
      map.addLayer(layer)
    })
}
const showInfo = (event) => {
  const features = map.getFeaturesAtPixel(event.pixel)
  if (features.length == 0) {
    isshowInfo = false
    isshowNum = false
    info.style.opacity = 0
    changeNum.style.opacity = 0
    return
  }
  const properties = features[0].getProperties()
  isshowInfo = true
  info.style.opacity = 1
  info.style.left = event.pixel[0] + 20 + 'px'
  info.style.top = event.pixel[1] + 25 + 'px'
  pid.value = properties.pid
  infoValue.value = properties.value
}
const showBox = (event) => {
  const features = map.getFeaturesAtPixel(event.pixel)
  if (features.length == 0) {
    isshowInfo = false
    isshowNum = false
    info.style.opacity = 0
    changeNum.style.opacity = 0
    return
  }
  const properties = features[0].getProperties()
  isshowNum = true
  changeNum.style.opacity = 1
  changeNum.style.left = event.pixel[0] - 100 + 'px'
  changeNum.style.top = event.pixel[1] - 100 + 'px'
  num.value = properties.value
  PID = pid.value
}
const showBox2 = (event) => {
  changeNum2.style.opacity = 1
  if (event.target.downPx_) {
    changeNum2.style.left = event.target.downPx_[0] - 100 + 'px'
    changeNum2.style.top = event.target.downPx_[1] - 100 + 'px'
  } else {
    changeNum2.style.left = event.pixel_[0] - 100 + 'px'
    changeNum2.style.top = event.pixel_[1] - 100 + 'px'
  }
}
sysStore.setShowBox2(showBox2)

//点击网格订正
const changeValue = (value) => {
  let updatetype = type[radioValue.value]
  let val = num.value
  changeNum.style.displaye = 'none'
  fetch(
    `http://10.111.102.30:8082/znwg-api/test/gridupdate?pid=${PID}&updatetype=${updatetype}&val=${val}`
  )
    .then((res) => res.json())
    .then((data) => {
      showGrid(data.data, 5)
    })
}

//订正
const changeValue2 = async (value) => {
  changeNum2.style.opacity = 0
  // let updatetype = type[radioValue.value]
  let val = num.value
  changeNum.style.displaye = 'none'

  const params = {
    pid: pids,
    updatetype: radioValue.value,
    val: val
  }
  const bodyData = JSON.stringify(params)

  let data = await fetchPost(getUpdateUrl, bodyData)
  let layers = map.getLayers().getArray()
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].get('title') == 'renderFeatures') {
      map.removeLayer(layers[i])
    }
  }
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].get('title') == 'grid_VectorLayer') {
      map.removeLayer(layers[i])
    }
  }
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].get('title') == 'isosurfaces_VectorLayer') {
      map.removeLayer(layers[i])
    }
  }

  //data：原始数据;gap：抽稀系数;value：要素编号
  let businessLayers = getBusinessLayer(data.data, 5, sysStore.currentFeature)
  map.addLayer(businessLayers[0])
}

//成图
const mapping = () => {
  // if (pointData.length > 0) {
  let olfeature = currentFeature
  let coordinates = olfeature.getGeometry().getCoordinates()
  let turfpolygon = turf.polygon(coordinates)

  let smoothedPolygon = turf.polygonSmooth(turfpolygon, { iterations: 3 })
  // feature = smoothedPolygon.features[0];
  let olPolygon = new Polygon([smoothedPolygon.features[0].geometry.coordinates[0]])
  olfeature = new Feature(olPolygon)

  olfeature
    .setStyle(
      new Style({
        fill: new Fill({
          // color: 'rgba(255, 255, 0, 0.5)' // 点击后地块的颜色
          color: getColor(num.value)
        }),
        stroke: new Stroke({
          color: getColor(num.value),
          width: 1
        })
      })
    )

    // 清除之前选中的要素样式
    .getSource()
    .clear()
  // 将当前点击的要素样式设置为选中状态
  selectedFeatselectedFeaturesures.getSource().addFeature(olfeature)
  // }
}
const screenshot = () => {
  html2canvas(document.querySelector('#mapCon')).then((canvas) => {
    canvas.toBlob((blob) => {
      fs.saveAs(blob, '地图截图.png')
    })
  })
}
</script>

<style lang="less" scoped>
#mapCon {
  width: 100%;
  height: 100%;
  // width: 100wh;
  // height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #f9f8f6;
}
.btn-mapping {
  position: absolute;
  top: 40px;
  left: 70px;
  ::hover {
    cursor: pointer;
  }
}
.btn-screenshot {
  position: absolute;
  top: 40px;
  left: 140px;
  ::hover {
    cursor: pointer;
  }
}
.btn-modi {
  position: absolute;
  top: 40px;
  left: 220px;
  ::hover {
    cursor: pointer;
  }
}
#info {
  z-index: 1;
  opacity: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0;
  width: 100px;
  height: 50px;
  background: rgba(0, 60, 136, 0.7);
  color: white;
  border: 0;
  transition: opacity 100ms ease-in;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .info-item {
    display: flex;
    //横向排列
    justify-content: flex-start;
    align-items: center;
    width: 90px;
  }
}

.changeNum {
  z-index: 1;
  opacity: 0;
  width: 320px;
  height: 70px;
  position: absolute;
  bottom: 60px;
  left: 0;
  background-color: rgb(204, 236, 236);
  :deep(.el-radio-group) {
    align-items: center;
    display: inline-flex;
    /* flex-wrap: wrap; */
    font-size: 0;
  }

  :deep(.el-radio) {
    margin-right: 5px;
  }
  // ::v-deep .el-radio-group {
  //   align-items: center;
  //   display: inline-flex;
  //   /* flex-wrap: wrap; */
  //   font-size: 0;
  // }

  // ::v-deep .el-radio {
  //   margin-right: 5px;
  // }
}
</style>
