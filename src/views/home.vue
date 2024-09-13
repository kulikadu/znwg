<template>
  <div class="main">
    <div class="content">
      <!-- <Two v-show="isShowTwo" />
      <Three v-show="isShowThree" />
      <Four v-show="isShowFour" />
      <Five v-show="isShowFive" />
      <Six v-show="isShowSix" /> -->
      <OlMap class="map" v-show="false" />
      <ToolBar class="toolbar" />
    </div>
    <div class="title">
      <!-- <img src="../assets/images/title-icon.png" alt="" /> -->
      <span>智能预报服务系统</span>
      <div class="title_menu">
        <span>格点订正</span>
      </div>
      <div class="title_end">
        <img style="width: 100%; height: 100%" src="@/assets/images/账户.png" alt="" />
      </div>
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
  <div class="splitView">
    <ElButton @click="take2View">二屏</ElButton>
    <ElButton @click="take3View">三屏</ElButton>
    <ElButton @click="take4View">四屏</ElButton>
    <ElButton @click="take5View">五屏</ElButton>
    <ElButton @click="take6View">六屏</ElButton>
  </div>
</template>

<script setup lang="ts">
import ToolBar from '../components/toolbar.vue'
import OlMap from '../components/olMap.vue'
import LayerManage from '../components/layerManage.vue'
import FeaturesPage from '@/components/featuresPage.vue'
import SourcePage from '@/components/sourcePage.vue'
import Two from '@/components/splitview/two.vue'
import Three from '@/components/splitview/three.vue'
import Four from '@/components/splitview/four.vue'
import Five from '@/components/splitview/five.vue'
import Six from '@/components/splitview/six.vue'
import { ElButton } from 'element-plus'

const isShowTwo = ref(false)
const isShowThree = ref(false)
const isShowFour = ref(false)
const isShowFive = ref(false)
const isShowSix = ref(false)

onMounted(() => {
  // boxName.value = '要素'
})

const initShow = () => {
  isShowTwo.value = false
  isShowThree.value = false
  isShowFour.value = false
  isShowFive.value = false
  isShowSix.value = false
}
const take2View = () => {
  initShow()
  isShowTwo.value = !isShowTwo.value
}
const take3View = () => {
  initShow()
  isShowThree.value = !isShowThree.value
}
const take4View = () => {
  initShow()
  isShowFour.value = !isShowFour.value
}
const take5View = () => {
  initShow()
  isShowFive.value = !isShowFive.value
}
const take6View = () => {
  initShow()
  isShowSix.value = !isShowSix.value
}
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
    justify-content: space-evenly;
    align-items: center;
    img {
      // width: @titleImgWidth;
      width: 36px;
      height: 36px;
    }
    span {
      font-family: 'PingFang SC ', 'PingFang SC', sans-serif;
      font-weight: 650;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      width: @sideWidth;
      text-align: center;
    }
    .title_menu {
      margin-left: 50px;
      margin-right: 50px;
      width: calc(100% - @titleImgWidth - @sideWidth);
      display: flex;
      justify-content: left;
      align-items: center;
      color: #ffff;
      span {
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 17px;
        margin-right: 40px;
      }
      span:hover {
        cursor: pointer;
        color: rgba(119, 233, 255, 1);
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
.splitView {
  position: absolute;
  width: 242px;
  height: 170px;
  bottom: 240px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-end;
}
</style>
