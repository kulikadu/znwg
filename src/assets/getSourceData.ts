import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { fromLonLat } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, Style, Text, Circle as CircleStyle } from 'ol/style'
import { useSysStore } from '@/stores/sys'

const sysStore = useSysStore()

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
let pids = []
export const getSourceData = (url: string) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data = data.data
      showGrid(data, 2)
    })
}

const showGrid = (data: any, gap: number) => {
  geojsonData_Polygon.features = []
  geojsonData_Point.features = []

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
  let values = data.value1
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
  for (let i = 0; i < newNumY; i++) {
    for (let j = 0; j < newNumX; j++) {
      let pid = j == 0 && i == 0 ? 0 : (i * numX + j) * gap - 1
      let color = getColor(values[pid])

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
          coordinates: fromLonLat([minLon, minLat])
        }
      })
    }
  }

  for (let i = 0; i < numY; i++) {
    for (let j = 0; j < numX; j++) {
      let pid = j == 0 && i == 0 ? 0 : i * numX + j - 1
      let color = getColor(values[pid])

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
          value: `${values[pid]}`,
          pid: pid
        },
        geometry: {
          type: 'Point',
          coordinates: fromLonLat([minLon, minLat])
        }
      })
    }
  }

  const repeatCanvas = document.createElement('canvas')
  const repeatCtx = repeatCanvas.getContext('2d')!
  let img = new Image()
  img.src = 'src/assets/images/雨夹雪.png'

  repeatCtx.createPattern(img, 'repeat')

  var fill = new Fill()
  let polygonLayer = new VectorLayer({
    title: 'grid_VectorLayer',
    opacity: 0.8,
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geojsonData_Polygon)
      // features: new GeoJSON().readFeatures(geojsonData_Point)
    }),
    style: (feature) => {
      // let fill = new Fill()
      // fill.setColor(feature.get('value') > 0.1 ? repeatCtx.createPattern(img, 'repeat') : feature.get('color'))
      return new Style({
        fill: new Fill({ color: feature.get('color') }),
        // fill: fill,
        stroke: new Stroke({ color: feature.get('color'), width: 0 }),
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
  sysStore.setGeoPolygonLayer(polygonLayer)
}

const getColor = (value: number) => {
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
