<template>
  <div class="toolbar">
    <div class="toolbar-title">
      <span>工具</span>
    </div>
    <span v-for="(item, index) in iconList" :key="index" class="toolbar-item">
      <div @click="handleClick(item.iconName)">
        <img :src="getImg(item.iconName)" />
      </div>
    </span>
    <div class="toolbar-check">
      <CheckBox />
      <span>计算极值</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckBox from '@/components/checkbox.vue'
import { getView } from '@/assets/Map/map'
import { Map } from 'ol'
import { useSysStore } from '@/stores/sys'

const sysStore = useSysStore()
let map: Map | null
onMounted(() => {})
let iconList = ref()
let check = ref()
check.value = false
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
const calcExtremum = () => {
  check.value = !check.value
  console.log(check.value)
}
const handleClick = (name: string) => {
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
    // case 'city':
    //   setPan()
    //   break
    // case 'county':
    //   setFullMap()
    //   break
    // case 'u22':
    //   setPan()
    //   break
    // case 'u25':
    //   setPan()
    //   break
  }
}
const drawPolygon = () => {
  if (sysStore.map) {
    map = sysStore.map as Map
  } else {
    console.log('地图不存在')
  }
  let draw = sysStore.draw
  if (draw != null) {
    map?.addInteraction(draw)
  }
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
}
</script>

<style lang="less" scoped>
.toolbar {
  width: 36px;
  height: 350px;
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
    width: 36px;
    height: 68px;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    margin-top: 7px;
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
</style>
