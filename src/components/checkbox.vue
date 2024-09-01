<template>
  <div>
    <div :class="check ? 'showCheckImg' : 'check-img'" @click="calcExtremum"></div>
  </div>
</template>

<script setup lang="ts">
let check = ref()
check.value = false
const emit = defineEmits(['getCheckStatus'])
const calcExtremum = () => {
  check.value = !check.value
  emit('getCheckStatus', check.value)
}
</script>

<style lang="less" scoped>
@imgSize: 16px;

.check-img {
  width: @imgSize;
  height: @imgSize;
  background-image: url('src/assets/images/check.jpg');

  &:hover {
    cursor: pointer;
    background-image: url('src/assets/images/check_mouseover.svg');
  }
}

.showCheckImg {
  width: @imgSize;
  height: @imgSize;
  background-image: url('src/assets/images/check.png');
  &:hover {
    cursor: pointer;
  }
}
</style>
