<template>
  <div class="main">
    <div class="content">
      <!-- <Two v-show="isShowTwo" />
      <Three v-show="isShowThree" />
      <Four v-show="isShowFour" />
      <Five v-show="isShowFive" />
      <Six v-show="isShowSix" /> -->
      <OlMap class="map" v-show="false" />
      <ToolBar class="toolbar"></ToolBar>
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

  <!-- <LayerManage class="layerManage" />
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
  </div> -->
  <div class="splitView">
    <ElButton @click="take2View">二屏</ElButton>
    <ElButton @click="take3View">三屏</ElButton>
    <ElButton @click="take4View">四屏</ElButton>
    <ElButton @click="take5View">五屏</ElButton>
    <ElButton @click="take6View">六屏</ElButton>
  </div>
  <div class="mapping">
    <ElButton @click="mapping">成图</ElButton>
    <ElButton @click="screenshot">出图</ElButton>
    <a id="image-download" download="map.png"></a>
  </div>
  <div id="test" class="test" v-show="showTest">
    <div class="overPan"></div>
    <div class="hole"></div>
    <div id="mapping-title" class="mapping-title">XXXXXXXXXXXXXX</div>
  </div>
  <canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;"></canvas>
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
import { Fill, Stroke, Style, Text, Circle as CircleStyle } from 'ol/style'
import { useSysStore } from '@/stores/sys'
import { Map } from 'ol'
import Graticule from 'ol/layer/Graticule'
import html2canvas from 'html2canvas'
import fs from 'file-saver'
import domtoimage from 'dom-to-image'

const sysStore = useSysStore()

const isShowTwo = ref(false)
const isShowThree = ref(false)
const isShowFour = ref(false)
const isShowFive = ref(false)
const isShowSix = ref(false)
const showTest = ref(false)
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

const mapping = () => {
  showTest.value = true
  let map = sysStore.map as Map
  map.getLayers().forEach((layer) => {
    if (layer?.get('title') === 'china') map.removeLayer(layer)
  })

  //经纬度网
  const graticule = new Graticule({
    // the style to use for the lines, optional.
    strokeStyle: new Stroke({
      color: 'rgba(255,120,0,7)',
      width: 2,
      lineDash: [0.5, 4]
    }),
    targetSize: 100,
    showLabels: true,
    wrapX: true,
    intervals: [1, 2],
    lonLabelPosition: 0.09,
    latLabelPosition: 0.1,
    lonLabelStyle: new Text({
      font: '28px Calibri,sans-serif',
      textBaseline: 'middle',
      fill: new Fill({
        color: 'rgba(0,0,0,1)'
      }),
      stroke: new Stroke({
        color: 'rgba(255,255,255,1)',
        width: 3
      })
    }),
    latLabelStyle: new Text({
      font: '28px Calibri,sans-serif',
      textBaseline: 'middle',
      fill: new Fill({
        color: 'rgba(0,0,0,1)'
      }),
      stroke: new Stroke({
        color: 'rgba(255,255,255,1)',
        width: 3
      })
    })
  })
  map.addLayer(graticule)
}

const screenshot = () => {
  // html2canvas(document.querySelector('#mapCon'), { useCORS: true }).then((canvas) => {
  //   canvas.toBlob((blob) => {
  //     fs.saveAs(blob, '地图截图.png')
  //   })
  // })

  // let map = sysStore.map as Map

  const areas = [document.querySelector('#mapCon'), document.querySelector('#mapping-title')]; // 选择多个区域
  const canvases: any = [];

  areas.forEach(area => {
    html2canvas(area, {
      useCORS: true,
      scale: 2 // 提高清晰度
    }).then(canvas => {
      canvases.push(canvas);
      if (canvases.length === areas.length) {
        // 合并所有canvas
        const finalCanvas = document.createElement('canvas');
        const context = finalCanvas.getContext('2d');
        finalCanvas.width = canvases[0].width; // 假设所有canvas宽度相同
        finalCanvas.height = canvases.reduce((sum: number, c: any) => sum + c.height, 0); // 计算总高度

        let offsetY = 0;
        canvases.forEach((c: any) => {
          context?.drawImage(c, 0, offsetY);
          offsetY += c.height; // 更新Y轴偏移量
        });

        // 将合并后的canvas转换为图片
        const imgData = finalCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'screenshot.png';
        link.click();
      }
    });
  });
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
    box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
    /* 外部阴影 */
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

.mapping {
  position: absolute;
  width: 242px;
  height: 30px;
  bottom: 100px;
}

@--left: 10%;
@--right: 10%;
@--top: 10%;
@--bottom: 10%;

.test {
  // position: absolute;
  // width: 1678px;
  // height: 873px;
  // top: 56px;
  // left: 242px;
  // border: 1px red solid;
  // background-color: rgb(249, 248, 246);
  // pointer-events: none;
}

.overPan {
  position: absolute;
  width: 1678px;
  height: 873px;
  top: 56px;
  left: 242px;
  border: 1px red solid;
  background-color: #f9f8f6;
  clip-path: polygon(0 0,
      130px 70px,
      1400px 70px,
      1400px 810px,
      130px 810px,
      130px 70px,
      0 0,
      0 100%,
      100% 100%,
      100% 0,
      0 0);
}

.hole {
  position: absolute;
  width: 1200px;
  height: 710px;
  border: 3px black solid;
  top: 123px;
  left: 445px;
  pointer-events: none;
}

.mapping-title {
  color: black;
  position: absolute;
  top: 70px;
  left: 450px;
  font-size: 28px;
}
</style>
