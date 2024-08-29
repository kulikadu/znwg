import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
}

export const useSysStore = defineStore({
  id: 'sys',
  state: (): SysStore => ({
    showSourceSelect: false
  }),
  actions: {
    setShowSourceSelect(value: Boolean) {
      this.showSourceSelect = value
    }
  }
})
