<template>
  <div class="wind">
    <div class="radio">
      <div class="radio-title">
        <span>风速</span>
      </div>
      <div>
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
  </div>
</template>

<script setup lang="ts">
let radioValue = ref()
const radio = ref('赋值')
const radioChange = (val: string | number | boolean | undefined) => {
  radioValue.value = val
}
</script>

<style scoped lang="less">
.wind {
  width: 344px;
  height: 523px;
  border: 1px red solid;

  .radio {
    width: 100%;
    height: 64px;

    .radio-title {
      width: 100%;
      height: 30px;
      font-size: 12px;
    }

    .radio-item {
      margin-right: 20px;
      width: 40px;
    }

    ElRadioGroup {
      border: 1px gray solid;
    }

    :deep(.el-radio-group) {
      align-items: center;
      display: inline-flex;
      /* flex-wrap: wrap; */
      font-size: 0;
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
}
</style>
