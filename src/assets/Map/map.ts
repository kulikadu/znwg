/*
 * @Author: wangyilin
 * @Date: 2024-09-05 08:49:05
 * @LastEditors: wangyilin
 * @LastEditTime: 2024-09-14 11:42:55
 *
 */

import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
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
import { useSysStore } from '@/stores/sys'
import { getBusinessLayer } from '@/assets/getBusinessLayer'
import { fetchGet } from '@/api'

const beijing = fromLonLat([116.28, 39.54])
const hunan = fromLonLat([112.07180996128585, 27.270889346140297])

/**
 * description: 初始的地图视图
 * @returns {View}
 */
export const getView = () => {
  return new View({
    center: hunan,
    minZoom: 2,
    zoom: 7.3,
    maxZoom: 18
  })
}

export const getTileWms = () => {
  let sysStore = useSysStore()
  const wms = `http://${sysStore.geoserverHost}/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=chine%E5%9B%BE%E5%B1%82&bbox=73.498962%2C3.832541%2C135.087387%2C53.558498&width=768&height=620&srs=EPSG%3A4326&format=image%2Fpng`
  return new TileWMS({
    url: wms,
    params: {
      // LAYERS: 'china:china图层', // 指定WMS层名
      // TILED: true // 请求分块的图片
      // STYLE: ''
    },
    serverType: 'geoserver' // WMS服务器类型，可选
  })
}

/**
 * description: 市县的订正
 * @param coordinate 点击的坐标点
 * @param name 要查询的图层名称
 */
export const getGridValueByClick = async (coordinate: Array<number>, name: string) => {
  let sysStore = useSysStore()
  let map = sysStore.map,
    pids = sysStore.pids,
    selectedFeatures = sysStore.selectedFeatures

  let geoPoint = new Point(coordinate)
  let url = getTileWms().getFeatureInfoUrl(
    geoPoint.getCoordinates(),
    map?.getView().getResolution()!,
    map?.getView().getProjection(),
    {
      // INFO_FORMAT: 'text/html',
      INFO_FORMAT: 'application/json',
      QUERY_LAYERS: `china:${name}`
    }
  )
  if (url) {
    let json = await fetchGet(url)
    const features = new GeoJSON().readFeatures(json)
    let businessFullPoint = sysStore.businessFullPoint
    if (businessFullPoint == null) {
      alert('请先选择数据源！')
      return 0
    } else {
      selectedFeatures.getSource().clear()
      selectedFeatures.getSource().addFeature(features[0])
      let text = new Text({
        text: features[0].get('name'),
        fill: new Fill({ color: 'black' }),
        stroke: new Stroke({ color: 'white', width: 1 }),
        overflow: true
      })
      selectedFeatures.getStyle().setText(text)
      pids = []

      var ptsWithin = turf.pointsWithinPolygon(businessFullPoint, json)
      ptsWithin.features.map((item) => pids.push(item?.properties?.pid))
      console.log(pids)
      return 1
    }
  }
}

// 获取正方形feature的像素边长
export const getSquarePixelSideLength = (map: Map, squareFeature: Feature) => {
  let resolution = map.getView().getResolution()!
  let extent = squareFeature.getGeometry()?.getExtent()
  if (extent !== undefined) {
    let widthInPixels = (extent[2] - extent[0]) / resolution
    let heightInPixels = (extent[3] - extent[1]) / resolution

    // 正方形的像素边长应该是宽度和高度的最小值，因为分辨率是恒定的
    let pixelSideLength: number = Math.min(widthInPixels, heightInPixels)

    return pixelSideLength
  }
}
