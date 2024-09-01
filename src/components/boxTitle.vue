<template>
  <div class="boxTitle">
    <div class="title-line"></div>
    <div class="title-text">
      <slot name="title"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.boxTitle {
  width: 242px;
  height: 32px;
  display: flex;
  align-items: center;
  .title-line {
    width: 6px;
    height: 16px;
    background-color: rgb(47, 155, 248);
    border-radius: 2px;
  }
  .title-text {
    margin-left: 6px;
  }
}
</style>
