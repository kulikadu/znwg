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
import { getColorByType } from './getColorByType'
import * as turf from '@turf/turf'
import { transform } from 'ol/proj'
import { getSquarePixelSideLength } from '@/assets/Map/map'

// import axios from 'axios'

//抽稀后的格点数据
let geojsonData_Polygon: any = {
  type: 'FeatureCollection',
  features: []
}
let geojsonData_Point: any = {
  type: 'FeatureCollection',
  features: []
}
//全数据量的格点数据
let geojsonData_Point_full: any = {
  type: 'FeatureCollection',
  features: []
}

/**
 *
 * @param data 源数据;
 * @param gap 抽稀系数
 * @param id 要素编号
 * @returns 返回2个图层：格点填色图层、等直面图层
 */
export const getBusinessLayer = (data: any, gap: number, id: string) => {
  const sysStore = useSysStore()
  geojsonData_Polygon.features = []
  geojsonData_Point.features = []
  geojsonData_Point_full.features = []

  let latGap = data.lat
  let lonGap = data.lon

  //以格点值为中心构建网格,原始点要偏移
  let startlat = data.startlat - latGap / 2
  let endlat = data.endlat + latGap / 2
  let startlon = data.startlon - lonGap / 2
  let endlon = data.endlon + lonGap / 2

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
      let pid = (i * numX + j) * gap
      let color = getColor(id, values1[pid])

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
    }
  }
  // sysStore.setBusinessPolygon(geojsonData_Polygon)

  //格点不做偏移
  startlat = data.startlat
  endlat = data.endlat
  startlon = data.startlon
  endlon = data.endlon

  //抽稀后格点
  for (let i = 0; i < newNumY; i++) {
    for (let j = 0; j < newNumX; j++) {
      let pid = j == 0 && i == 0 ? 0 : i * numX + j - 1
      let color = getColor(id, values1[pid])

      let minLat, minLon
      minLat = startlat + latGap * i * gap
      minLon = startlon + lonGap * j * gap

      //创建格点(抽稀后)
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

  //全数据量
  for (let i = 0; i < numY; i++) {
    for (let j = 0; j < numX; j++) {
      let pid = j == 0 && i == 0 ? 0 : i * numX + j - 1
      let color = getColor(id, values1[pid])

      let minLat, minLon
      minLat = startlat + latGap * i
      minLon = startlon + lonGap * j

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

  //只有降雨有极值
  if (id == '1') {
    let geo = JSON.parse(data.geoJson)
    //找极值:
    let maxValues: number[] = [],
      maxValueFeatures: any = [],
      values: number[] = [],
      maxGridValue: number = 0
    if (id === '1' && geo && geo.features) {
      for (const feature of geo.features) {
        const maxValue = feature.properties?.maxValue
        if (typeof maxValue === 'number') {
          maxValues.push(maxValue)
        }
      }

      let max = Math.max(...maxValues)

      geo.features.map((value: any) => {
        if (value.properties.maxValue == max) {
          maxValueFeatures.push(value)
        }
      })
      let fea = {
        type: 'FeatureCollection',
        features: maxValueFeatures
      }
      // 将FeatureCollection中的每个Feature的几何对象转换坐标系
      fea.features.forEach(function (feature: any) {
        let geometry = feature.geometry
        if (geometry) {
          var coordinates = geometry.coordinates
          var transformedCoordinates = coordinates[0].map(function (coords: any) {
            return coords.map((coord: any) => {
              return transform(coord, 'EPSG:4326', 'EPSG:3857')
            })
          })
          geometry.coordinates[0] = transformedCoordinates
        }
      })

      let ptsWithin = turf.pointsWithinPolygon(geojsonData_Point_full, fea)
      console.log('所有最大值的feature:', maxValueFeatures)
      if (ptsWithin.features.length > 0) {
        ptsWithin.features.map((item) => {
          values.push(item?.properties?.value1)
        })
        //最大的格点值
        maxGridValue = Math.max(...values)
        sysStore.setMaxGridValue(maxGridValue)
        console.log({ maxGridValue })

        //最大格点值的坐标
        geojsonData_Point_full.features.forEach((feature: any) => {
          if (feature.properties.value1 == maxGridValue) {
            sysStore.setExtremumCoordinate(feature.geometry.coordinates)
          }
        })
      }
    }
  }

  // let fill = new Fill()
  let lll: number
  let businessLayer
  const getText = (feature: any) => {
    let text
    if (id == '1') {
      text = [
        `${feature.get('value1')}`,
        `12px Calibri,sans-serif`,
        '\n',
        '',
        `${feature.get('value2')}`,
        '10px Calibri,sans-serif'
      ]
    } else {
      text = [`${feature.get('value1')}`, `12px Calibri,sans-serif`]
    }
    return text
  }
  //格点图层
  if (id != '7') {
    businessLayer = new VectorLayer({
      title: 'grid_VectorLayer',
      opacity: 0.8,
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geojsonData_Polygon)
      }),
      style: (feature, resolution) => {
        // lll = getSquarePixelSideLength(sysStore.map, feature)
        let text = new Text({
          text: getText(feature),
          overflow: true,
          fill: new Fill({ color: 'black' }),
          stroke: new Stroke({
            color: '#fff',
            width: 3
          })
        })
        return new Style({
          fill: new Fill({ color: feature.get('color') }),
          stroke: new Stroke({ color: 'black', width: 1 }),
          text: text
        })
      }
    })

    // sysStore.map?.addLayer(businessLayer)
  }

  //风向图
  if (id == '7') {
    businessLayer = new VectorLayer({
      title: 'grid_VectorLayer',
      opacity: 0.8,
      zIndex: 99,
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geojsonData_Point)
      }),
      style: (feature, resolution) => {
        const iconSize = (12.5 / resolution) * 440
        let rotation = feature.get('value1')
        // console.log({ resolution }, { iconSize })
        return new Style({
          image: new Icon({
            src: 'src/assets/images/wind/11-12.svg',
            width: iconSize / 2.5,
            height: iconSize,
            // opacity: 0.3,
            rotation: rotation
          })
        })
      }
    })

    // sysStore.map?.addLayer(businessLayer)
  }

  let bus3Full = new VectorLayer({
    title: 'grid_VectorLayer3',
    opacity: 0.8,
    zIndex: 99,
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geojsonData_Point_full)
    }),
    style: (feature, resolution) => {
      const iconSize = (12.5 / resolution) * 440
      let rotation = feature.get('value1')
      return new Style({
        image: new Icon({
          src: 'src/assets/images/wind/11-12.svg',
          width: iconSize / 2.5,
          height: iconSize,
          opacity: 0.3,
          rotation: rotation
        }),
        text: new Text({
          text: feature.get('value1'),
          overflow: true,
          fill: new Fill({ color: 'black' }),
          stroke: new Stroke({
            color: '#fff',
            width: 3
          })
        })
      })
    }
  })
  // sysStore.map?.addLayer(bus3Full)

  //等直面图层,相态和风向没有
  let businessLayer2
  if (['2', '7'].includes(id)) {
    businessLayer2 = null
  } else {
    let geo2 = JSON.parse(data.geoJson)
    businessLayer2 = new VectorLayer({
      title: 'isosurfaces_VectorLayer',
      opacity: 0.8,
      zIndex: 100,
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geo2, {
          dataProjection: 'EPSG:4326', // GeoJSON 数据的原始投影
          featureProjection: 'EPSG:3857' // 要转换到的目标投影
        })
      }),
      style: (feature) => {
        let fill = new Fill()
        fill.setColor(getColor(id, feature.get('minValue')))
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
const getColor = (id: string, value: number) => {
  if (value == undefined) return 'rgb(255,255,255)'

  let valueGap = getColorByType(id).value
  let color = getColorByType(id).color

  for (let i = 0; i < valueGap.length; i++) {
    if (value < valueGap[i]) {
      return color[i]
    }
    if (value > valueGap[i] && i == valueGap.length - 1) {
      return color[i]
    }
  }
}
