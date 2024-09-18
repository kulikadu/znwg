<template>
  <div class="toolbar">
    <div class="toolbar-title">
      <span>工具</span>
    </div>
    <span
      v-for="(item, index) in iconList"
      :key="index"
      class="toolbar-item"
      @click="handleClick(item.iconName, index)"
      :class="{ active: activeIndex === index }"
    >
      <div>
        <img :src="getImg(item.iconName)" />
      </div>
    </span>
    <div class="toolbar-check">
      <!-- <CheckBox /> -->
      <el-checkbox size="large" v-model="checked" @change="changeEvent" :disabled="isDisabled" />
      <span :class="{ disabled: isDisabled }">计算极值</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckBox from '@/components/checkbox.vue'
import { getView, getGridValueByClick } from '@/assets/Map/map'
import { Map } from 'ol'
import { Draw } from 'ol/interaction'

import Feature from 'ol/Feature'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Point } from 'ol/geom'
import { Fill, Stroke, Style, Text, Circle as CircleStyle } from 'ol/style'
import { useSysStore } from '@/stores/sys'

const sysStore = useSysStore()

const activeIndex = ref(-1)
const isDisabled = ref(false)
const checked = ref(false)
let map: Map | null
onMounted(() => {})
let iconList = ref()
const getImg = (name: string) => {
  let url = import.meta.env.BASE_URL + `src/assets/images/${name}.svg`
  return url
}
iconList.value = [
  {
    iconName: 'full',
    toolTip: '全幅',
    active: false
  },
  {
    iconName: 'pan',
    toolTip: '移动',
    active: false
  },
  {
    iconName: 'ploygon',
    toolTip: '多边形',
    active: false
  },
  {
    iconName: 'city',
    toolTip: '市',
    active: false
  },
  {
    iconName: 'county',
    toolTip: '县',
    active: false
  },
  {
    iconName: 'u22',
    toolTip: '左',
    active: false
  },
  {
    iconName: 'u25',
    toolTip: '右',
    active: false
  }
]

//工具条的点击事件
const handleClick = (name: string, index: number) => {
  activeIndex.value = index
  switch (name) {
    case 'full':
      setFullMap()
      break
    case 'pan':
      setPan()
      break
    case 'ploygon':
      drawPolygon()
      break
    case 'city':
      selectCity()
      break
    case 'county':
      selectCountry()
      break
    // case 'u22':
    //   setPan()
    //   break
    // case 'u25':
    //   setPan()
    //   break
  }
}

//极值点显示切换
const changeEvent = (val: boolean) => {
  let maxGridValue = sysStore.maxGridValue,
    extremumCoordinate = sysStore.extremumCoordinate
  map = sysStore.map as Map

  let layers = map.getLayers().getArray()
  for (let layer of layers) {
    if (layer.get('title') === 'extremumLayer') {
      map.removeLayer(layer)
      return
    }
  }

  if (val) {
    map.addLayer(
      new VectorLayer({
        title: 'extremumLayer',
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point(extremumCoordinate as [number, number])
            })
          ]
        }),
        style: new Style({
          text: new Text({
            text: Math.round(maxGridValue as number).toString(), // 文本内容
            font: '36px sans-serif', // 字体样式
            fill: new Fill({
              color: 'red' // 文本颜色
            }),
            stroke: new Stroke({
              color: '#fff', // 文本轮廓颜色
              width: 3 // 文本轮廓宽度
            })
          })
        })
      })
    )
  }
}

//地图的点击事件
let queryName = ''
const clickHandler = async (event: any) => {
  let status = await getGridValueByClick(event.coordinate, queryName)

  let showBox2 = sysStore.showBox2!
  status == 1 ? showBox2(event) : null
}
// 绘制多边形
const drawPolygon = () => {
  if (sysStore.map) {
    map = sysStore.map as Map
  } else {
    console.log('地图不存在')
  }
  setPan()
  let draw = sysStore.draw as Draw
  map?.addInteraction(draw)
}
const setFullMap = () => {
  if (sysStore.map) {
    map = sysStore.map as Map
  } else {
    console.log('地图不存在')
  }
  let view = getView()
  map?.setView(view)
}

//漫游
const setPan = () => {
  if (sysStore.map) {
    map = sysStore.map as Map
  } else {
    console.log('地图不存在')
  }
  let draw = sysStore.draw
  if (draw != null) {
    map?.removeInteraction(draw)
  }
  map?.un('singleclick', clickHandler)
}

//市选择
const selectCity = () => {
  if (sysStore.map) {
    map = sysStore.map as Map
  } else {
    console.log('地图不存在')
  }

  setPan()
  queryName = 'hunan_city'
  map?.on('singleclick', clickHandler)
}

//县选择
const selectCountry = () => {
  if (sysStore.map) {
    map = sysStore.map as Map
  } else {
    console.log('地图不存在')
  }

  setPan()
  queryName = 'hunan_country'
  map?.on('singleclick', clickHandler)
}
//根据点击查询wms范围来筛选格点

watch(
  () => sysStore.currentFeature,
  (newValue, oldValue) => {
    if (newValue == 1 || newValue == '1') {
      isDisabled.value = false
    } else {
      isDisabled.value = true
      changeEvent(false)
      checked.value = false
    }
  }
)
</script>

<style lang="less" scoped>
.toolbar {
  width: 36px;
  height: calc(350 - 36);
  background-color: #ffffff;
  border: 1px solid #d7d7d7;
  .toolbar-title {
    width: 36px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 0.9rem;

    &::after {
      content: '';
      width: 100%;
      height: 1px;
      background-color: #d7d7d7;
    }
  }
  .toolbar-item {
    width: 36px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: #abb9ce;
      cursor: pointer;
    }
  }
  .toolbar-check {
    display: none;
    width: 36px;
    height: 68px;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    margin-top: 7px;
    :deep(.el-checkbox__inner:after) {
      height: 9px;
      left: 6px;
      top: 2px;
      width: 3px;
    }

    :deep(.el-checkbox.el-checkbox--large) {
      height: 20px;
    }
    :deep(.el-checkbox.el-checkbox--large .el-checkbox__inner) {
      height: 18px;
      width: 18px;
    }
    &::before {
      content: '';
      width: 100%;
      height: 1px;
      background-color: #d7d7d7;
      position: absolute;
      top: -3px;
    }
  }
  .toolbar-check > span {
    text-align: center;
    margin-top: 5px;
  }
}
img {
  width: 18px;
  height: 18px;
}
.active {
  background-color: #abb9ce;
}
.disabled {
  color: rgb(220, 223, 230);
}
</style>
