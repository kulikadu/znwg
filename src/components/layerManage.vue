<template>
  <div class="box" v-show="isShow">
    <div class="title">
      <span>{{ title }}</span>
      <img src="../assets/images/close.png" alt="" @click="isShow = false" />
    </div>
    <div class="content">
      <div class="content-name">
        <span>图形属性</span>
      </div>
      <div class="check">
        <div class="check-item">
          <CheckBox @getCheckStatus="handleClick" />
          <span>格点</span>
        </div>
        <div class="check-item mr-3">
          <CheckBox @getCheckStatus="handleClick2" />
          <span>填色</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckBox from '@/components/checkbox.vue'
import { useSysStore } from '@/stores/sys'

let sysStore = useSysStore()

let title = ref()
title.value = '图层/视图管理'
let isShow = ref()
isShow.value = true

const handleClick = (value: boolean) => {
  sysStore.setShowGrid(value)
  let businessLayer = sysStore.businessLayer
  let businessLayer2 = sysStore.businessLayer2
  let map = sysStore.map
  if (businessLayer) {
    if (value) {
      map?.removeLayer(businessLayer)
      map?.removeLayer(businessLayer2)
      map?.addLayer(businessLayer)
    } else {
      map?.removeLayer(businessLayer)
    }
  } else {
    alert('请先选择要素')
  }
}
const handleClick2 = (value: boolean) => {
  sysStore.setShowIsosurfaces(value)
  let businessLayer = sysStore.businessLayer
  let businessLayer2 = sysStore.businessLayer2
  let map = sysStore.map
  if (businessLayer2) {
    if (sysStore.showIsosurfaces) {
      map?.removeLayer(businessLayer)
      map?.removeLayer(businessLayer2)
      map?.addLayer(businessLayer2)
      // var extent = layer.getSource().getExtent()
      // map?.getView().fit(extent, { size: map.getSize() })
    } else {
      map?.removeLayer(businessLayer2)
    }
  } else {
    alert('请先选择要素')
  }
}
</script>

<style lang="less" scoped>
@titleH: 35px;

.box {
  width: 200px;
  height: 100px;
  border: 1px solid #d7d7d7;
  background-color: #ffffff;
  .title {
    width: 100%;
    height: @titleH;
    color: #fffaff;
    background: #2f9bf8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      margin-left: 10px;
    }
    img {
      position: relative;
      right: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .content {
    width: 100%;
    height: calc(100% - @titleH);
    .content-name {
      font-size: 0.8rem;
      width: 100%;
      height: 30px;
      top: 10px;
      position: relative;
      left: 10px;
    }
    .check {
      display: flex;
      align-items: center;
      margin-left: 10px;
      font-size: 0.8rem;

      display: flex;
      justify-content: space-between;
      align-items: center;
      .check-item {
        display: flex;
      }
      span {
        margin-left: 5px;
      }
    }
  }
}
</style>
