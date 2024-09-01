<template>
  <div class="main">
    <div class="content">
      <OlMap class="map" />
      <ToolBar class="toolbar" />
    </div>
    <div class="title">
      <img src="../assets/images/title.png" alt="" />
      <div class="title_menu">
        <span>格点订正</span>
      </div>
      <div class="title_end"></div>
    </div>
    <div class="content-left">
      <FeaturesPage />
      <SourcePage />
    </div>
  </div>

  <LayerManage class="layerManage" />
  <div
    style="
      position: absolute;
      bottom: 5px;
      left: 287px;
      border-radius: 10px;
      width: 1414px;
      height: 78px;
      overflow: hidden;
      box-shadow: 1px 1px 34px 1px rgba(0, 0, 0, 0.3);
    "
  >
    <img src="@/assets/images/timeline.png" alt="" />
  </div>
</template>

<script setup lang="ts">
import ToolBar from '../components/toolbar.vue'
import OlMap from '../components/olMap.vue'
import LayerManage from '../components/layerManage.vue'
import FeaturesPage from '@/components/featuresPage.vue'
import SourcePage from '@/components/sourcePage.vue'

onMounted(() => {
  // boxName.value = '要素'
})
</script>

<style lang="less" scoped>
@import '@/assets/style/main.less';

.layerManage {
  position: absolute;
  left: 15%;
  bottom: 15%;
}
.main {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  .title {
    position: absolute;
    width: 100%;
    height: @titleHeight;
    background-color: rgb(47, 155, 248);
    display: flex;
    img {
      width: @titleImgWidth;
    }
    .title_menu {
      margin-left: 50px;
      margin-right: 50px;
      width: calc(100% - @titleImgWidth - @sideWidth);
      display: flex;
      justify-content: left;
      align-items: center;
      color: #ffff;
      span:hover {
        cursor: pointer;
      }
    }
    .title_end {
      width: @sideWidth;
    }
  }
  .content-left {
    position: relative;
    top: @titleHeight;
    width: @sideWidth;
    height: calc(100% - @titleHeight);
    // border: red solid 1px;
    box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3); /* 外部阴影 */
  }
  .content {
    position: absolute;
    top: @titleHeight;
    left: @sideWidth;
    width: calc(100% - @sideWidth);
    height: calc(100% - @titleHeight);
    .toolbar {
      position: absolute;
      top: 60px;
      left: 5px;
    }
    .map {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
