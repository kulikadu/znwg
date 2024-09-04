import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { fromLonLat } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, Style, Text, Circle as CircleStyle, Icon } from 'ol/style'
import { useSysStore } from '@/stores/sys'
import type { Color } from 'ol/color'
import { Layer } from 'ol/layer'
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer'
import { asColorLike } from 'ol/colorlike'
// import axios from 'axios'

let geojsonData_Polygon: any = {
  type: 'FeatureCollection',
  features: []
}
let geojsonData_Point: any = {
  type: 'FeatureCollection',
  features: []
}
let geojsonData_Point_full: any = {
  type: 'FeatureCollection',
  features: []
}

export const getBusinessLayer = (data: any, gap: number, id: string) => {
  const sysStore = useSysStore()
  geojsonData_Polygon.features = []
  geojsonData_Point.features = []

  let latGap = data.lat
  let lonGap = data.lon

  let startlat = data.startlat
  let endlat = data.endlat + latGap
  let startlon = data.startlon
  let endlon = data.endlon + lonGap
  let values1 = data.value1 //格点值
  let values2 = data.value2 //相态
  let numX = (endlon - startlon) / lonGap
  let numY = (endlat - startlat) / latGap

  numX = Math.round(numX)
  numY = Math.round(numY)

  //创建网格
  // let gap = 5
  let newNumX = Math.round(numX / gap)
  let newNumY = Math.round(numY / gap)
  for (let i = 0; i < newNumY; i++) {
    for (let j = 0; j < newNumX; j++) {
      // let pid = j == 0 && i == 0 ? 0 : (i * numX + j) * gap - 1
      let pid = (i * numX + j) * gap
      let color = getColor(values1[pid])

      let minLat, maxLat, minLon, maxLon
      minLat = startlat + latGap * i * gap
      maxLat = minLat + latGap * gap
      minLon = startlon + lonGap * j * gap
      maxLon = minLon + lonGap * gap

      // fc.push(
      //     turf.polygon(
      //         [
      //             [
      //                 [minLon, minLat],
      //                 [maxLon, minLat],
      //                 [maxLon, maxLat],
      //                 [minLon, maxLat],
      //                 [minLon, minLat]
      //             ]
      //         ],
      //         {
      //             color: color,
      //             value: `${values[pid]}`,
      //             pid: pid
      //         }
      //     )
      // )
      //创建网格
      geojsonData_Polygon.features.push({
        type: 'Feature',
        properties: {
          color: color,
          value1: `${values1[pid]}`,
          value2: `${['1', '7'].includes(id) ? values2[pid] : null}`,
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
          value1: `${values1[pid]}`,
          value2: `${['1', '7'].includes(id) ? values2[pid] : null}`,
          pid: pid
        },
        geometry: {
          type: 'Point',
          coordinates: fromLonLat([minLon, minLat])
        }
      })
    }
  }
  // sysStore.setBusinessPolygon(geojsonData_Polygon)
  for (let i = 0; i < numY; i++) {
    for (let j = 0; j < numX; j++) {
      let pid = j == 0 && i == 0 ? 0 : i * numX + j - 1
      let color = getColor(values1[pid])

      let minLat, maxLat, minLon, maxLon
      minLat = startlat + latGap * i
      maxLat = minLat + latGap
      minLon = startlon + lonGap * j
      maxLon = minLon + lonGap

      //创建格点(总数据)
      geojsonData_Point_full.features.push({
        type: 'Feature',
        properties: {
          color: color,
          value1: `${values1[pid]}`,
          value2: `${['1', '7'].includes(id) ? values2[pid] : null}`,
          pid: pid
        },
        geometry: {
          type: 'Point',
          coordinates: fromLonLat([minLon, minLat])
        }
      })
    }
  }
  sysStore.setBusinessFullPoint(geojsonData_Point_full)
  const repeatCanvas = document.createElement('canvas')
  const repeatCtx = repeatCanvas.getContext('2d')!
  let img = new Image()
  img.src = 'src/assets/images/雨夹雪.png'

  repeatCtx.createPattern(img, 'repeat')

  // var fill = new Fill()

  //格点图层
  let businessLayer = new VectorLayer({
    title: 'grid_VectorLayer',
    opacity: 0.8,
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geojsonData_Polygon)
    }),
    style: (feature, resolution) => {
      let fill = new Fill()
      fill.setColor(
        feature.get('value1') > 0.1 ? repeatCtx.createPattern(img, 'repeat') : feature.get('color')
      )
      let ll = asColorLike({
        src: 'src/assets/images/雨夹雪.png'
      })

      return new Style({
        fill: new Fill({ color: feature.get('color') }),
        // fill: fill,
        stroke: new Stroke({ color: feature.get('color'), width: 0 }),
        text: new Text({
          text: [
            `${feature.get('value1')}`,
            '12px Calibri,sans-serif'
            // '\n',
            // '',
            // `${feature.get('value2')}`,
            // '10px Calibri,sans-serif'
          ],
          // text: feature.get('value1'),
          // font: '12px Calibri,sans-serif',
          overflow: true,
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({
            color: '#fff',
            width: 3
          })
        })
      })
    }
  })

  // var cnv = document.createElement('canvas')
  // var ctx = cnv.getContext('2d')
  // var img2 = new Image()
  // img2.src = 'src/assets/images/雨夹雪.png'
  // img2.onload = function () {
  //   var pattern = ctx?.createPattern(img2, 'repeat')
  //   businessLayer.setStyle(
  //     new Style({
  //       stroke: new Stroke({
  //         color: 'red',
  //         lineDash: [5],
  //         width: 2
  //       }),
  //       fill: new Fill({
  //         color: pattern
  //       })
  //     })
  //   )
  // }

  //等直面图层,相态和风向没有
  let businessLayer2
  if (['2', '7'].includes(id)) {
    businessLayer2 = null
  } else {
    let geo = JSON.parse(data.geoJson)

    businessLayer2 = new VectorLayer({
      title: 'isosurfaces_VectorLayer',
      opacity: 0.8,
      zIndex: 100,
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geo, {
          dataProjection: 'EPSG:4326', // GeoJSON 数据的原始投影
          featureProjection: 'EPSG:3857' // 要转换到的目标投影
        })
      }),
      style: (feature) => {
        let fill = new Fill()
        fill.setColor(getColor(feature.get('minValue')))
        // fill.setColor('rgb(0,255,255)')
        return new Style({
          fill: fill
        })
      }
    })
  }

  const style = {
    'fill-color': ['*', ['get', 'color'], [255, 255, 255, 0.6]]
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
    })
  })

  sysStore.setBusinessLayer2(businessLayer2)
  sysStore.setBusinessLayer(businessLayer)
  return [businessLayer, businessLayer2]
  // sysStore.setBusinessLayer(webglLayer)
  // return [webglLayer, businessLayer2]
}

//根据value获取颜色
const getColor = (value: number) => {
  if (value == undefined) return 'rgb(255,255,255)'

  let valueGap = [0.1, 10, 25, 50, 100, 250, 10000]
  let color = [
    'rgb(255,255,255)',
    'rgb(166,242,143)',
    'rgb(61,186,61)',
    'rgb(97,184,255)',
    'rgb(0,0,255)',
    'rgb(250,0,250)',
    'rgb(128,0,64)'
  ]
  for (let i = 0; i < valueGap.length; i++) {
    if (value < valueGap[i]) {
      return color[i]
    }
  }
}
