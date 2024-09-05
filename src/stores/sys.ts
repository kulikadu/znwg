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
}

export const useSysStore = defineStore({
  id: 'sys',
  state: (): SysStore => ({
    showSourceSelect: false,
    businessLayer: null,
    businessLayer2: null,
    businessPolygon: null,
    businessFullPoint: null,
    map: null,
    draw: null,
    showIsosurfaces: false,
    showGrid: true,
    currentFeature: ''
  }),
  actions: {
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
    }
  }
})
