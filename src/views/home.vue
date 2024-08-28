<template>
  <div class="main">
    <div class="title">
      <img src="../assets/images/title.png" alt="" />
      <div class="title_menu">
        <span>格点订正</span>
      </div>
      <div class="title_end"></div>
    </div>
    <div class="content-left">
      <div class="content-left-feature">
        <BoxTitle>
          <template v-slot> <span>要素</span></template>
        </BoxTitle>
        <div class="content-left-feature-item">
          <div v-for="(item, index) in features" :key="index" class="items">
            <div class="item">
              <div>
                <span>{{ item.name }}</span>
              </div>
              <span>(无数据)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="content-left-dataSource">
        <BoxTitle>
          <template v-slot>
            <span>数据源选择</span>
          </template>
        </BoxTitle>
        <div class="content-left-dataSource-item">
          <div class="items">
            <div>
              <span>其他源</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <OlMap class="map" />
      <ToolBar class="toolbar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BoxTitle from '../components/boxTitle.vue'
import ToolBar from '../components/toolbar.vue'
import OlMap from '../components/olMap.vue'

// const boxName = ref('')
let features = ref()
features.value = [
  {
    name: '降水',
    value: '1'
  },
  {
    name: '相太',
    value: '2'
  },
  {
    name: '气温',
    value: '3'
  },
  {
    name: '最高气温',
    value: '4'
  },
  {
    name: '最低气温',
    value: '5'
  },
  {
    name: '风速',
    value: '6'
  },
  {
    name: '风向',
    value: '7'
  },
  {
    name: '云量',
    value: '8'
  },
  {
    name: '相对湿度',
    value: '9'
  },
  {
    name: '能见度',
    value: '10'
  }
]

onMounted(() => {
  // boxName.value = '要素'
})
</script>

<style lang="less" scoped>
@titleImgWidth: 367px;
@titleHeight: 56px;
@sideWidth: 242px;

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
    .content-left-feature {
      width: 100%;
      height: 350px;
      // border: 0.5px solid gray;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      .content-left-feature-item {
        width: 220px;
        height: 290px;
        border: 1px solid gray;
        .items {
          top: 10px;
          position: relative;

          .item {
            left: 10px;
            right: 10px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 0.8rem;
            div {
              width: 100px;
              height: 25px;
              border: 1px solid #d7d7d7;
              margin-bottom: 2px;
              border-radius: 10px;
              display: flex;
              justify-content: center;
              align-items: center;

              &:hover {
                cursor: pointer;
                background-color: #2f9bf8;
                font-size: 0.9rem;
              }
              &:active {
                background-color: #2f9bf8;
                font-size: 0.9rem;
              }
              span {
                color: #333333;
              }
            }
            span {
              color: #b3bcca;
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

    .content-left-dataSource {
      width: 100%;
      height: 100px;
      // border: 0.5px solid gray;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      .content-left-dataSource-item {
        width: 220px;
        .items {
          font-size: 0.8rem;
          div {
            width: 100px;
            height: 25px;
            border: 1px solid #d7d7d7;
            margin-bottom: 2px;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              color: #333333;
            }
          }
          div:hover {
            cursor: pointer;
            background-color: #2f9bf8;
            font-size: 0.9rem;
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
  }
  .content {
    position: absolute;
    top: @titleHeight;
    left: @sideWidth;
    width: calc(100% - @sideWidth);
    height: calc(100% - @titleHeight);
    border: #2f9bf8 solid 1px;
    .toolbar {
      position: absolute;
      top: 10px;
      left: 20px;
    }
    .map {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
