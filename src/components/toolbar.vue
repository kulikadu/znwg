<template>
  <div class="toolbar">
    <div class="toolbar-title">
      <span>工具</span>
    </div>
    <span v-for="(item, index) in iconList" :key="index">
      <div class="toolbar-item">
        <img src="@/assets/images/full.svg" />
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
let iconList = ref([{}])

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
</script>

<style lang="less" scoped>
.toolbar {
  width: 36px;
  height: 350px;
  border: 1px solid gray;
  .toolbar-title {
    width: 36px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    // &::after {
    //   content: '';
    //   display: block;
    //   width: 100%;
    //   height: 2px;
    //   background-color: gray;
    // }
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
}
img {
  width: 18px;
  height: 18px;
}
</style>
