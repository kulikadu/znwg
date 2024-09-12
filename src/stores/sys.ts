/*
 * @Author: wangyilin
 * @Date: 2024-09-05 08:49:05
 * @LastEditors: wangyilin
 * @LastEditTime: 2024-09-12 16:05:33
 *
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Map } from 'ol'
import { Draw } from 'ol/interaction'
import BaseTileLayer from 'ol/layer/BaseTile'
import BaseLayer from 'ol/layer/Base'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export interface SysStore {
  // host: String
  geoserverHost: String
  showSourceSelect: Boolean | null
  businessLayer: BaseLayer | null
  businessLayer2: any
  businessPolygon: any
  businessFullPoint: any
  map: Map | null
  draw: Draw | null
  showIsosurfaces: Boolean | null
  showGrid: Boolean | null
  currentFeature: String | Number
  pids: Array<String>
  selectedFeatures: any
  showBox2: Function | null
  maxGridValue: Number
  extremumCoordinate: [Number, Number]
}

export const useSysStore = defineStore({
  id: 'sys',
  state: (): SysStore => ({
    // host: '10.111.101.246:3001',
    // geoserverHost: '10.111.101.246:8080', //geoserver地址和端口
    geoserverHost: 'localhost:8080', //geoserver地址和端口
    showSourceSelect: false,
    businessLayer: null,
    businessLayer2: null,
    businessPolygon: null,
    businessFullPoint: null,
    map: null,
    draw: null,
    showIsosurfaces: false,
    showGrid: true,
    currentFeature: '',
    pids: [],
    selectedFeatures: null,
    showBox2: null,
    maxGridValue: 0,
    extremumCoordinate: [0, 0]
  }),
  actions: {
    // setHost(value: String) {
    //   this.host = value
    // },
    setGeoserverHost(value: String) {
      this.geoserverHost = value
    },
    setShowSourceSelect(value: Boolean) {
      this.showSourceSelect = value
    },
    setBusinessLayer(value: any) {
      this.businessLayer = value
    },
    setBusinessLayer2(value: any) {
      this.businessLayer2 = value
    },
    setBusinessPolygon(value: any) {
      this.businessPolygon = value
    },
    setBusinessFullPoint(value: any) {
      this.businessFullPoint = value
    },
    setMap(value: Map) {
      this.map = value
    },
    setDraw(value: Draw) {
      this.draw = value
    },
    setShowIsosurfaces(value: Boolean) {
      this.showIsosurfaces = value
    },
    setShowGrid(value: Boolean) {
      this.showGrid = value
    },
    setCurrentFeature(value: String | Number) {
      this.currentFeature = value
    },
    setPids(value: Array<String>) {
      this.pids = value
    },
    setSelectedFeatures(value: any) {
      this.selectedFeatures = value
    },
    setShowBox2(value: Function) {
      this.showBox2 = value
    },
    setMaxGridValue(value: Number) {
      this.maxGridValue = value
    },
    setExtremumCoordinate(value: [Number, Number]) {
      this.extremumCoordinate = value
    }
  }
})
