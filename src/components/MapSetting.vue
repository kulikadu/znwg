<template>
  <div class="main">
    <div class="title">
      <!-- <img src="@/assets/icons/图层管理icon.png" alt="" /> -->
      <span>图层管理</span>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="地图">
        <div class="content">
          <div class="content-title">
            <span>基础地图</span>
          </div>
          <div class="content-region">
            <div class="content-item">
              <el-checkbox label="县名" />
              <div>
                <span>字体：</span>
                <el-select
                  v-model="fontvalue"
                  filterable
                  placeholder="微软雅黑"
                  size="small"
                  style="width: 60px"
                  @focus="handleFocus"
                >
                  <el-option
                    v-for="(item, index) in fontOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>字号：</span>
                <el-select
                  v-model="fontSizeValue"
                  filterable
                  placeholder="3"
                  size="small"
                  style="width: 40px"
                >
                  <el-option
                    v-for="(item, index) in fontSizeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>颜色：</span>
                <el-color-picker
                  v-model="color"
                  show-alpha
                  :predefine="predefineColors"
                  @change="handleColorChange"
                />
              </div>
            </div>

            <div class="content-item">
              <el-checkbox label="市名" />
              <div>
                <span>字体：</span>
                <el-select
                  v-model="fontvalue"
                  filterable
                  placeholder="微软雅黑"
                  size="small"
                  style="width: 60px"
                  @focus="handleFocus"
                >
                  <el-option
                    v-for="(item, index) in fontOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>字号：</span>
                <el-select
                  v-model="fontSizeValue"
                  filterable
                  placeholder="3"
                  size="small"
                  style="width: 40px"
                >
                  <el-option
                    v-for="(item, index) in fontSizeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>颜色：</span>
                <el-color-picker
                  v-model="color"
                  show-alpha
                  :predefine="predefineColors"
                  @change="handleColorChange"
                />
              </div>
            </div>

            <div class="content-item">
              <el-checkbox label="乡名" />
              <div>
                <span>字体：</span>
                <el-select
                  v-model="fontvalue"
                  filterable
                  placeholder="微软雅黑"
                  size="small"
                  style="width: 60px"
                  @focus="handleFocus"
                >
                  <el-option
                    v-for="(item, index) in fontOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>字号：</span>
                <el-select
                  v-model="fontSizeValue"
                  filterable
                  placeholder="3"
                  size="small"
                  style="width: 40px"
                >
                  <el-option
                    v-for="(item, index) in fontSizeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>颜色：</span>
                <el-color-picker
                  v-model="color"
                  show-alpha
                  :predefine="predefineColors"
                  @change="handleColorChange"
                />
              </div>
            </div>

            <div class="content-item">
              <span>地图背景色：</span>
              <el-color-picker
                v-model="color"
                show-alpha
                :predefine="predefineColors"
                @change="handleColorChange"
              />
            </div>
          </div>

          <div class="content-title">
            <span>站点格点</span>
          </div>
          <div class="content-region2">
            <div class="content-item">
              <span>国家站点:</span>

              <div>
                <span>字号：</span>
                <el-select
                  v-model="fontSizeValue"
                  filterable
                  placeholder="3"
                  size="small"
                  style="width: 40px"
                >
                  <el-option
                    v-for="(item, index) in fontSizeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>符号颜色：</span>
                <el-color-picker
                  v-model="color"
                  show-alpha
                  :predefine="predefineColors"
                  @change="handleColorChange"
                />
              </div>
            </div>

            <div class="content-item">
              <span>骨干站点:</span>

              <div>
                <span>字号：</span>
                <el-select
                  v-model="fontSizeValue"
                  filterable
                  placeholder="3"
                  size="small"
                  style="width: 40px"
                >
                  <el-option
                    v-for="(item, index) in fontSizeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>符号颜色：</span>
                <el-color-picker
                  v-model="color"
                  show-alpha
                  :predefine="predefineColors"
                  @change="handleColorChange"
                />
              </div>
            </div>

            <div class="content-item">
              <span>乡镇站点：</span>

              <div>
                <span>符号大小：</span>
                <el-select
                  v-model="fontSizeValue"
                  filterable
                  placeholder="3"
                  size="small"
                  style="width: 40px"
                >
                  <el-option
                    v-for="(item, index) in fontSizeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>符号颜色：</span>
                <el-color-picker
                  v-model="color"
                  show-alpha
                  :predefine="predefineColors"
                  @change="handleColorChange"
                />
              </div>
            </div>

            <div class="content-item">
              <span>站点名称：</span>
              <div>
                <span>字体：</span>
                <el-select
                  v-model="fontvalue"
                  filterable
                  placeholder="微软雅黑"
                  size="small"
                  style="width: 60px"
                  @focus="handleFocus"
                >
                  <el-option
                    v-for="(item, index) in fontOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>字号：</span>
                <el-select
                  v-model="fontSizeValue"
                  filterable
                  placeholder="3"
                  size="small"
                  style="width: 40px"
                >
                  <el-option
                    v-for="(item, index) in fontSizeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>颜色：</span>
                <el-color-picker
                  v-model="color"
                  show-alpha
                  :predefine="predefineColors"
                  @change="handleColorChange"
                />
              </div>
            </div>

            <div class="content-item">
              <span>格点：</span>
              <div>
                <span>字体：</span>
                <el-select
                  v-model="fontvalue"
                  filterable
                  placeholder="微软雅黑"
                  size="small"
                  style="width: 60px"
                  @focus="handleFocus"
                >
                  <el-option
                    v-for="(item, index) in fontOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>字号：</span>
                <el-select
                  v-model="fontSizeValue"
                  filterable
                  placeholder="3"
                  size="small"
                  style="width: 40px"
                >
                  <el-option
                    v-for="(item, index) in fontSizeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <div>
                <span>颜色：</span>
                <el-color-picker
                  v-model="color"
                  show-alpha
                  :predefine="predefineColors"
                  @change="handleColorChange"
                />
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="色斑图">
        <div class="content">
          <color-manage />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-button class="btn-save" @click="handleConfirm">保存地图配置</el-button>
  </div>
</template>

<script setup lang="ts">
import ColorManage from './ColorManage.vue'

let fontvalue = ref('')
let fontSizeValue = ref('')
// let fontOptions = reactive([])
let fontOptions: any[] = []
let fontOptions2 = [
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
let fontSizeOptions = [
  {
    value: '3',
    label: '3'
  },
  {
    value: '4',
    label: '4'
  },
  {
    value: '5',
    label: '5'
  },
  {
    value: '6',
    label: '6'
  },
  {
    value: '7',
    label: '7'
  },
  {
    value: '8',
    label: '8'
  },
  {
    value: '9',
    label: '9'
  },
  {
    value: '10',
    label: '10'
  }
]
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
const getSystemFonts = async () => {
  try {
    const availableFonts = await window.queryLocalFonts()
    // return availableFonts.map((font: any) => font.family)
    return await availableFonts.map((font: any) => {
      fontOptions.push({ value: font.family, label: font.fullName })
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
const handleFocus = async () => {
  if (fontOptions.length === 0) await getSystemFonts()
}
const handleColorChange = (color: any) => {
  console.log(color)
}
</script>

<style scoped lang="less">
.main {
  width: 400px;
  height: 510px;
  border: 1px red solid;
  .btn-save {
    margin-left: 70%;
    width: 100px;
    height: 30px;
    margin-top: 2px;
  }
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
    height: 410px;
    width: 100%;
    .content-title {
      font-size: 14px;
      margin-left: 20px;
      margin-top: 10px;
    }
    .content-region {
      height: 160px;
      border: 1px #dcdfe6 solid;
    }
    .content-region2 {
      height: 200px;
      border: 1px #dcdfe6 solid;
    }
    .content-item {
      display: flex;
      margin-right: 30px;
      color: #606266;
      font-size: 14px;
      justify-content: space-evenly;
      align-items: center;
      height: 40px;

      :deep(.el-color-picker, .el-color-picker__panel) {
        --el-color-picker-alpha-bg-b: auto;
        --el-color-picker-alpha-bg-a: auto;
      }
    }
  }
}
:deep(.el-tabs) {
  --el-tabs-header-height: 20px;
}
:deep(.el-tabs__content) {
  padding: 0;
}
</style>
