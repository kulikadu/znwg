<template>
  <div class="content-left-feature">
    <BoxTitle>
      <template v-slot:title> <span>要素</span></template>
    </BoxTitle>

    <div class="content-left-feature-item">
      <div v-for="(item, index) in features" :key="index" class="items">
        <div class="item">
          <div @click="handleClick(item.value)">
            <span>{{ item.name }}</span>
          </div>
          <span>(无数据)</span>
        </div>
      </div>
    </div>
  </div>
  <Legend :class="{ legend: true }" :legendData="legendData"></Legend>
</template>

<script setup lang="ts">
import BoxTitle from './boxTitle.vue'
import { useSysStore } from '@/stores/sys'
import { getBusinessLayer } from '@/assets/getBusinessLayer'
import { getSourceUrl, getSourceTimeUrl } from '@/api'
import type BaseLayer from 'ol/layer/Base'
import { getColorByType } from '@/assets/getColorByType'

const sysStore = useSysStore()

let features = ref()
features.value = [
  {
    name: '降水',
    value: '1'
  },
  {
    name: '相态',
    value: '2'
  },
  {
    name: '气温',
    value: '3'
  },
  {
    name: '最高气温',
    value: '4'
  },
  {
    name: '最低气温',
    value: '5'
  },
  {
    name: '风速',
    value: '6'
  },
  {
    name: '风向',
    value: '7'
  },
  {
    name: '云量',
    value: '8'
  },
  {
    name: '相对湿度',
    value: '9'
  },
  {
    name: '能见度',
    value: '10'
  }
]
let index = 0

let legendData = ref()
let isshowLegend = ref(true)
const handleClick = (value: string) => {
  if (value != null) {
    console.log(value)
    let time = ['4', '5'].includes(value) ? 24 : 6
    // let url = `src/assets/5/${value}_hunan_5.json`
    let url = `${getSourceUrl}?elementId=${value}&time=${time}&type=5`
    isshowLegend.value = false
    legendData.value = getColorByType(value)
    sysStore.setCurrentFeature(value)
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data = data.data
        let map = sysStore.map
        //businessLayer:格点值；businessLayer2：等值面
        let businessLayer = sysStore.businessLayer
        let businessLayer2 = sysStore.businessLayer2
        map?.removeLayer(businessLayer as BaseLayer)
        map?.removeLayer(businessLayer2)
        // let layers = getBusinessLayer(data, 6 - index)
        let layers = getBusinessLayer(data, 5, value)
        index++
        //layers[0]：格点值；layers[1]：等值面
        if (sysStore.showGrid) {
          map?.addLayer(layers[0] as BaseLayer)
        } else if (sysStore.showIsosurfaces) {
          map?.addLayer(layers[1] as BaseLayer)
        } else {
          map?.addLayer(layers[0] as BaseLayer)
          sysStore.setShowGrid(true)
        }
      })
  }
}
</script>

<style scoped lang="less">
@import '@/assets/style/main.less';

.content-left-feature {
  width: 100%;
  height: 350px;
  // border: 0.5px solid gray;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  .content-left-feature-item {
    width: 220px;
    height: 290px;
    border: 1px solid #d7d7d7;
    .items {
      top: 10px;
      position: relative;

      .item {
        left: 10px;
        right: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 0.8rem;
        div {
          width: 100px;
          height: 25px;
          border: 1px solid #d7d7d7;
          margin-bottom: 2px;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;

          &:hover {
            cursor: pointer;
            background-color: #2f9bf8;
            font-size: 0.9rem;
          }
          &:active {
            background-color: #2f9bf8;
            font-size: 0.9rem;
          }
          span {
            color: #333333;
          }
        }
        span {
          color: #b3bcca;
        }
      }
    }
  }
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background-color: #d7d7d7;
  }
}
.legend {
  position: fixed;
  bottom: 200px;
  right: 100px;
}
</style>
