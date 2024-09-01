<template>
  <div class="box">
    <div class="title">
      <span>{{ title }}</span>
      <img src="../assets/images/close.png" alt="" @click="close()" />
    </div>
    <div class="content">
      <div v-for="(item, index) in sourceList" :key="index" class="content-item">
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="foot">
      <div class="check">
        <CheckBox />
        <span>应用于所有要素</span>
      </div>
      <div class="btn">
        <el-button @click="save">保存</el-button>
        <el-button @click="close()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckBox from '@/components/checkbox.vue'

import { useSysStore } from '@/stores/sys'

const sysStore = useSysStore()

const props = defineProps({
  myProp: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close-me'])

let title = ref()
title.value = '选择数据源'
let sourceList = ref()
sourceList.value = [
  {
    name: '中央台'
  },
  {
    name: 'EC'
  },
  {
    name: '省台客观DL22'
  },
  {
    name: 'CMA-MESO'
  },
  {
    name: '华东'
  },
  {
    name: '华南'
  },
  {
    name: '省台客观DL23'
  },
  {
    name: '编辑后数据'
  },
  {
    name: '上次预报'
  }
]

let isShow = ref()
isShow.value = sysStore.showSourceSelect

const save = () => {
  emit('close-me')
}
const close = () => {
  emit('close-me')
}
</script>

<style lang="less" scoped>
@titleH: 35px;
@contentH: 280px;

.box {
  width: 356px;
  height: 373px;
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
    height: 280px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &::after {
      content: '';
      width: 100%;
      height: 1px;
      background: #d7d7d7;
      display: block;
      top: 4px;
      position: relative;
    }
    .content-item {
      height: 30px;
      line-height: 30px;
      &:hover {
        background: #ecf5ff;
        cursor: pointer;
      }
      span {
        margin-left: 10px;
      }
    }
  }
  .foot {
    width: 100%;
    height: calc(100% - @titleH - @contentH);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .check {
      display: flex;
      align-items: center;
      margin-left: 10px;
      font-size: 0.8rem;
      span {
        margin-left: 5px;
      }
    }
    .btn {
      margin-right: 10px;
    }
    button {
      width: 83px;
    }
  }
}
</style>
