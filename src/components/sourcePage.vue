<template>
  <div class="content-left-dataSource">
    <BoxTitle>
      <template v-slot:title><span>数据源选择</span></template>
    </BoxTitle>

    <div class="content-left-dataSource-item">
      <div class="items">
        <div @click="changeDataSource">
          <span>其他源</span>
        </div>
      </div>
    </div>
  </div>
  <SourceSelect class="sourceSelect" v-show="isShow" @close-me="handleClose" />
</template>

<script setup lang="ts">
import SourceSelect from './sourceSelect.vue'
import { useSysStore } from '@/stores/sys'

const sysStore = useSysStore()
let isShow = ref()
isShow.value = false

const changeDataSource = () => {
  isShow.value = true
  sysStore.setShowSourceSelect(isShow.value)
  console.log(isShow.value)
}

const handleClose = () => {
  isShow.value = false
}
</script>

<style scoped lang="less">
.sourceSelect {
  position: absolute;
  left: 45vw;
  top: 25vh;
}
.content-left-dataSource {
  width: 100%;
  height: 100px;
  // border: 0.5px solid gray;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  .content-left-dataSource-item {
    // width: 220px;
    .items {
      // font-size: 0.8rem;
      div {
        width: 220px;
        font-size: 0.8rem;
        width: 100px;
        height: 25px;
        border: 1px solid #d7d7d7;
        margin-bottom: 2px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333333;

        &:hover {
          cursor: pointer;
          background-color: #2f9bf8;
          font-size: 0.9rem;
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
</style>
