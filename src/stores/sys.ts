import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Map } from 'ol'
import { Draw } from 'ol/interaction'

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
  geoPolygonLayer: any
  map: Map | null
  draw: Draw | null
}

export const useSysStore = defineStore({
  id: 'sys',
  state: (): SysStore => ({
    showSourceSelect: false,
    geoPolygonLayer: null,
    map: null,
    draw: null
  }),
  actions: {
    setShowSourceSelect(value: Boolean) {
      this.showSourceSelect = value
    },
    setGeoPolygonLayer(value: any) {
      this.geoPolygonLayer = value
    },
    setMap(value: Map) {
      this.map = value
    },
    setDraw(value: Draw) {
      this.draw = value
    }
  }
})
