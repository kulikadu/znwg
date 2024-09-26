<template>
  <div class="windPage">
    <div class="radio">
      <div class="radio-title">
        <span>风速</span>

      </div>
      <div class="radio-group">
        <ElRadioGroup @change="radioChange" v-model="radio">
          <ElRadio value="风级">风级</ElRadio>
          <ElRadio value="赋值">赋值</ElRadio>
          <ElRadio value="加值">加值</ElRadio>
          <ElRadio value="减值">减值</ElRadio>
          <ElRadio value="最大值">最大值</ElRadio>
          <ElRadio value="最小值">最小值</ElRadio>
        </ElRadioGroup>
      </div>
    </div>

    <div class="wind" v-show="radio == '风级'">
      <div class="windPole-content">
        <div class="windPole-box" v-for="(item, index) in windPolePic" :key="index" @click="handleClick(item.name, index)"
          :class="{ active: activeIndex === index }">
          <div>
            <img :src="getImg(item.name)" />
          </div>
        </div>
      </div>
    </div>

    <div class="modify" v-show="radio == '赋值' || radio == '加值' || radio == '减值' || radio == '最大值' || radio == '最小值'">
      <div class="modify-content">
        <span>风速输入值：</span>
        <ElInput v-model="windValue" style="width: 80px;height: 25px;margin-right: 6px;" placeholder="0"></ElInput>


        <span>m/s</span>
      </div>
    </div>

    <span class=" windDirection-Tile">风向</span>
    <div class="wind">
      <div class="windDirection-content">
        <div class="windDirection-box" v-for="(item, index) in windDirectionPic" :key="index" @click="handleClick2(item.name, index)"
          :class="{ active: activeIndex2 === index }">
          <div>
            <img :src="getImg(item.name)" />
          </div>
        </div>
      </div>
    </div>
    <ElButton style="position: relative;width: 80px;left: 70%;top: 8px;" @click="modify">确认</ElButton>
  </div>
</template>

<script setup lang="ts">
import { ElSelect } from 'element-plus';

let windValue = ref(0)
let radioValue = ref()
const radio = ref('风级')
let cunrrentWindPole: string
let cunrrentWindDirection: string
const radioChange = (val: string | number | boolean | undefined) => {
  radioValue.value = val
}
const getImg = (name: string) => {
  let url = import.meta.env.BASE_URL + `src/assets/images/wind/UI/${name}.png`
  return url
}

const handleClick = (name: string, index: number) => {
  cunrrentWindPole = name
  activeIndex.value = index
}
const handleClick2 = (name: string, index: number) => {
  if (name == '无') return
  cunrrentWindDirection = name
  activeIndex2.value = index
}
const modify = () => {
  console.log(cunrrentWindPole, cunrrentWindDirection)
}
const activeIndex = ref(-1)
const activeIndex2 = ref(-1)

const value = ref('')
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
let windPolePic = ref()
windPolePic.value = [{
  name: '1',
  active: false
}, {
  name: '2',
  active: false
}, {
  name: '3',
  active: false
}, {
  name: '4',
  active: false
}, {
  name: '5',
  active: false
}, {
  name: '6',
  active: false
}, {
  name: '7',
  active: false
}, {
  name: '8',
  active: false
}, {
  name: '9',
  active: false
}, {
  name: '10',
  active: false
}]
let windDirectionPic = ref()
windDirectionPic.value = [{
  name: '西北风',
  active: false
}, {
  name: '北风',
  active: false
}, {
  name: '东北风',
  active: false
}, {
  name: '西风',
  active: false
}, {
  name: '无',
  active: false
}, {
  name: '东风',
  active: false
}, {
  name: '西南风',
  active: false
}, {
  name: '南风',
  active: false
}, {
  name: '东南风',
  active: false
}]
</script>

<style scoped lang="less">
.active {
  border: 5px rgb(0, 255, 0) solid;
}

.windPage {
  width: 344px;
  height: 523px;
  border: 1px red solid;
  background: #f0f0f0;

  .radio {
    width: 100%;
    height: 64px;
    background: white;

    .radio-title {
      width: 100%;
      height: 30px;
      font-size: 12px;
      top: 5px;
      left: 5px;
      position: relative;
    }

    .radio-group {
      border: 1px rgb(209, 210, 222) solid;
    }

    :deep(.el-radio-group) {
      align-items: center;
      display: inline-flex;
      /* flex-wrap: wrap; */
      font-size: 0;
      left: 5px;
      position: relative;
    }

    :deep(.el-radio) {
      margin-right: 5px;
      width: 50px;
    }

    :deep(.el-radio__label) {
      font-size: 12px;
      padding-left: 2px;
    }

  }

  .windDirection-Tile {
    font-size: 12px;
    position: relative;
    left: 5px;
  }

  .wind {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px gray solid;

    .windPole-content {
      height: 162px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      width: 80%;
      align-content: center;

      .windPole-box {
        width: 41px;
        height: 55px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 36px;
          height: 50px;
        }

        &:hover {
          cursor: pointer;
          translate: 0px -5px;
          transition: all 0.3s;
        }
      }
    }

    .windDirection-content {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
      gap: 18px;
      width: 80%;
      height: 220px;
      align-items: center;
      align-content: center;

      .windDirection-box {
        width: 58px;
        height: 58px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;

        img {
          width: 53px;
          height: 53px;
        }

        &:hover {
          cursor: pointer;
          translate: 0px -5px;
          transition: all 0.3s;
        }
      }
    }
  }

  .modify {
    height: 162px;
    border: 1px gray solid;
    display: flex;

    .modify-content {
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: space-around;
      width: 100%;
      height: 40px;

      span {
        font-size: 12px
      }
    }
  }
}
</style>
