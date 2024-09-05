<template>
  <div class="legend">
    <div class="legend-box">
      <div class="legend-item" v-for="(item, index) in props.legendData.value">
        <div class="legend-item-color" :style="backgroundColor(index)"></div>
        <span>{{ props.legendData.des[index] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
let props = defineProps({
  legendData: {
    type: Object,
    default: { value: [], des: '', color: [] }
  }
})

let backgroundColor = (index: number) => {
  return `background-color: ${props.legendData.color[index]}`
}
</script>

<style lang="less" scoped>
.legend {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  .legend-item {
    display: flex;
    align-items: baseline;
    width: 100%;
    .legend-item-color {
      width: 60px;
      height: 20px;
      margin-right: 10px;
      margin-bottom: 8px;
    }
  }
}
</style>
