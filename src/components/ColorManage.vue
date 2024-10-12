<template>
  <div class="colorManage">
    <div class="content">
      <div class="content-item">
        <div>
          <span>要素：</span>
        </div>
        <ElSelect v-model="value" placeholder="请选择" style="width: 240px">
          <ElOption
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </ElOption>
        </ElSelect>
      </div>

      <div class="content-item">
        <div>
          <span>图例标题：</span>
        </div>
        <el-input v-model="input" style="width: 240px" placeholder="图例标题" />
      </div>
    </div>
    <span>分段集合</span>
    <div class="content-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="250"
        highlight-current-row:true
        @cell-dblclick="editRow"
        :cell-style="cellStyle"
      >
        <el-table-column label="风格" width="40" />
        <el-table-column prop="value" label="断值" width="70" />
        <el-table-column prop="des" label="断值说明" width="120" />
        <el-table-column prop="lable" label="分段标题" width="80" />
        <el-table-column fixed="right" label="操作" min-width="40">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="mt-4" style="width: 100%" @click="onAddItem"> 新增 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElSelect } from 'element-plus'
import { fetchGet } from '@/api'

let allOptions = ref()
let options = ref()
let tableData = ref([{}])
let colors = ref([])
onMounted(async () => {
  allOptions.value = await fetchGet('src/assets/colorManage.json')
  let data = allOptions.value.data
  options.value = data.map((item: any) => {
    return {
      value: item.name,
      label: item.type,
      color: item.color
    }
  })
})
let value = ref('')
let input = ref('')

const editRow = (row: any) => {
  console.log(row)
}
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

const onAddItem = () => {
  tableData.value.push({
    style: 'Tom',
    value: 'California',
    lable: 'Los Angeles',
    des: 'No. 189, Grove St, Los Angeles'
  })
}

const cellStyle = (row: any, column: any, rowIndex: number, columnIndex: number) => {
  if (colors.value.length == 0) {
    return {
      backgroundColor: 'rgb(255, 255, 255)'
    }
  } else {
    if (row.columnIndex == 0) {
      return {
        backgroundColor: colors.value[row.rowIndex]
      }
    }
  }
}
watch(value, (newValue) => {
  input.value = newValue
  options.value.map((item: any) => {
    if (item.value == newValue) {
      colors.value = item.color.colors
      for (let i = 0; i < item.color.colors.length; i++) {
        if (i == item.color.colors.length - 1) {
          tableData.value.push({
            style: item.color.colors[i],
            value: 10000,
            lable: item.color.lables[i],
            des: `${item.color.values[i - 1]}<=X<10000`
          })
        } else if (i == 0) {
          tableData.value[0] = {
            style: item.color.colors[i],
            value: item.color.values[i],
            lable: item.color.lables[i],
            des: `X<${item.color.values[i]}`
          }
        } else {
          {
            tableData.value.push({
              style: item.color.colors[i],
              value: item.color.values[i],
              lable: item.color.lables[i],
              des: `${item.color.values[i]}<=X<${item.color.values[i]}`
            })
          }
        }
      }
    }
  })
})
</script>

<style scoped lang="less">
.colorManage {
  width: 100%;
  height: 410px;
  .content {
    width: 100%;
    height: 80px;
    border: 1px gray solid;
    .content-item {
      display: flex;
      align-items: center;
      margin-right: 20px;
      height: 40px;
      justify-content: space-evenly;
      span {
        font-size: 14px;
        width: 80px;
      }
    }
  }

  span {
    font-size: 14px;
    margin-top: 10px;
    display: inline-block;
  }
  .content-table {
    width: 100%;
    height: 308px;
  }
}
</style>
