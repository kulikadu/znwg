<template>
  <div>
    <div class="content">
      <div class="map">
        <div ref="mapCon" id="mapCon"></div>
      </div>
      <div class="map">
        <div ref="mapCon2" id="mapCon2"></div>
      </div>
      <div class="map">
        <div ref="mapCon3" id="mapCon3"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Map, View } from 'ol'
import { Control, defaults as defaultControls } from 'ol/control.js'
import TileLayer from 'ol/layer/Tile'
import { getView, getTileWms, getGridValueByClick } from '@/assets/Map/map'
let map, map2, map3, tileWms
const mapCon = ref()
const mapCon2 = ref()
const mapCon3 = ref()
onMounted(() => {
  let view = getView()
  // 创建WMS图层
  tileWms = getTileWms()
  let target = mapCon.value
  let target2 = mapCon2.value
  let target3 = mapCon3.value
  map = new Map({
    layers: [
      new TileLayer({
        preload: Infinity,
        source: tileWms
      })
    ],
    target: target,
    view: view,
    controls: defaultControls({
      zoom: false
    })
  })

  map2 = new Map({
    layers: [
      new TileLayer({
        preload: Infinity,
        source: tileWms
      })
    ],
    target: target2,
    view: view,
    controls: defaultControls({
      zoom: false
    })
  })

  map3 = new Map({
    layers: [
      new TileLayer({
        preload: Infinity,
        source: tileWms
      })
    ],
    target: target3,
    view: view,
    controls: defaultControls({
      zoom: false
    })
  })
})
</script>

<style scoped lang="less">
.content {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  .map {
    position: relative;
    width: 50%;
    height: 100%;
    div {
      margin: 5px;
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      border: 2px solid #fff;
      box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
    }
  }
}
</style>
