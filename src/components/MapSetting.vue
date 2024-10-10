<template>
  <div class="main">
    <div class="title">
      <!-- <img src="@/assets/icons/图层管理icon.png" alt="" /> -->
      <span>图层管理</span>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="地图">
        <div class="content">
          <div>
            <div>
              <el-checkbox label="县名" />
              <div>
                <span>字体:</span>
                <el-select
                  v-model="value"
                  filterable
                  placeholder="微软雅黑"
                  size="small"
                  style="width: 80px"
                  @focus="handleFocus"
                >
                  <el-option
                    v-for="(item, index) in fontOptions2"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="色斑图">
        <div class="content">
          <div>2</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
let value = ref('')
let fontOptions2 = ref([])
let fontOptions = [
  {
    value: 'Microsoft YaHei',
    label: '微软雅黑'
  },
  {
    value: 'Arial',
    label: 'Arial'
  },
  {
    value: 'Times New Roman',
    label: 'Times New Roman'
  },
  {
    value: 'Verdana',
    label: 'Verdana'
  },
  {
    value: 'Courier New',
    label: 'Courier New'
  },
  {
    value: 'Tahoma',
    label: 'Tahoma'
  },
  {
    value: 'Georgia',
    label: 'Georgia'
  },
  {
    value: 'Impact',
    label: 'Impact'
  }
]
const getSystemFonts = async () => {
  try {
    const availableFonts = await window.queryLocalFonts()
    // return availableFonts.map((font: any) => font.family)
    return availableFonts.map((font: any) => {
      fontOptions2.value.push({ value: font.family, label: font.fullName })
    })
  } catch (err: any) {
    console.error(err.name, err.message)
    return []
  }
}

// 异步加载字体选项
// ;(async () => {
//   fontOptions.value = await getSystemFonts()
// })()
const handleFocus = () => {
  if (fontOptions2.value.length === 0) getSystemFonts()
}
</script>

<style scoped lang="less">
.main {
  width: 400px;
  height: 500px;
  border: 1px red solid;
  .title {
    height: 32px;
    background-color: white;
    line-height: 32px;
    display: flex;

    span {
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .content {
    height: 400px;
    width: 100%;
  }
}
:deep(.el-tabs) {
  --el-tabs-header-height: 20px;
}
:deep(.el-tabs__content) {
  padding: 0;
}
</style>
