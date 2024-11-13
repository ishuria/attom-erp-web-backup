<template>
  <vab-dialog
    title="匹配"
    width="70%"
    v-model="dflag"
    class="dialog"
    top="10vh"
    @close="handleCloseCheck"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">已发未报</el-button>
        <el-button type="primary">清空全部</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" @input="queryData" @keydown.enter.native="queryData"  placeholder="请输入搜索关键词" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" native-type="submit" :loading="listLoading" @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      class="noneHoveTable"
      :cell-style="match1Style"
      :data="fakeData"
    >
      <el-table-column label="SKU">
        <el-table-column label="SKU" prop="sku" min-width="200"></el-table-column>
        <el-table-column label="装箱总数" prop="" min-width="100"></el-table-column>
        <el-table-column label="站点" prop="" min-width="110"></el-table-column>
        <el-table-column label="匹配的PO" prop="" min-width="110"></el-table-column>
        <el-table-column label="SKU实际数量" prop="" min-width="130"></el-table-column>
      </el-table-column>
      <el-table-column label="零件">
        <el-table-column label="零件名" prop="" min-width="200"></el-table-column>
        <el-table-column label="实际数量" prop="" min-width="100"></el-table-column>
        <el-table-column label="退税报关数量" prop="" min-width="130"></el-table-column>
        <el-table-column label="PO总数" prop="" min-width="90"></el-table-column>
        <el-table-column label="采购方" prop="" min-width="90"></el-table-column>
        <el-table-column label="不报关" prop="" min-width="80">
          <template #default="{ row }">
            <el-checkbox :true-value="1" :false-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="有已发未报" prop="" min-width="110"></el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleShowMatch2(row)">匹配</el-link>
          <el-link type="primary" :underline="false">清空</el-link>
          <el-link type="danger" :underline="false">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <template #footer>
      <div style="text-align: center;">
        <el-button type="danger" @click="handleCloseCheck">取消</el-button>
        <el-button type="success">确定</el-button>
      </div>
    </template>
  </vab-dialog>
  <vab-dialog
    title="匹配"
    class="dialog"
    top="10vh"
    width="90%"
    v-model="match2Visible"
  >

    <div style="margin-bottom: 15px">
      <el-button type="primary" style="margin-right: 10px">清空全部</el-button>
      <el-text>
        SKU：<span :style="{ color: 'var(--el-color-primary)' }">Tomorotec-0017-bIkTri-RevB</span> 
        品名：<span :style="{ color: 'var(--el-color-primary)' }">三角沥水架-包胶款-黑色</span> 
        剩余未匹配数量：<span :style="{ color: 'var(--el-color-danger)' }">100</span>
      </el-text>
    </div>

    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      class="noneHoveTable"
      :cell-style="match2Style"
    >
      <el-table-column label="SKU">
        <el-table-column label="匹配的PO" prop="po" min-width="100"></el-table-column>
        <el-table-column label="站点" prop="" min-width="115"></el-table-column>
        <el-table-column label="打包完成数(好)" prop="" min-width="140"></el-table-column>
        <el-table-column label="打包任务数" prop="" min-width="110"></el-table-column>
        <el-table-column label="打包任务状态" prop="" min-width="130"></el-table-column>
        <el-table-column label="SKU实际数量" prop="" min-width="130">
          <template #default="{ row }">
            <el-input clearable />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="零件">
        <el-table-column label="零件名" prop="" min-width="200"></el-table-column>
        <el-table-column label="实际数量" prop="" min-width="100">
          <template #default="{ row }">
            <el-input clearable />
          </template>
        </el-table-column>
        <el-table-column label="退税报关数量" prop="" min-width="130">
          <template #default="{ row }">
            <el-input clearable />
          </template>
        </el-table-column>
        <el-table-column label="剩余可报" prop="" min-width="100"></el-table-column>
        <el-table-column label="PO总数" prop="" min-width="90"></el-table-column>
        <el-table-column label="采购方" prop="" min-width="90"></el-table-column>
        <el-table-column label="不报关" prop="" min-width="80">
          <template #default="{ row }">
            <el-checkbox :true-value="1" :false-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="已发未报" prop="" min-width="100"></el-table-column>
        <el-table-column label="已报未发" prop="" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">填入全部</el-link>
          <el-link type="primary" :underline="false">清空</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center; margin-top: 20px">
      <el-text>
        剩余SKU：<span :style="{ color: 'var(--el-color-danger)'}">18个</span>
      </el-text>
    </div>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="warning">上一个</el-button>
        <el-button type="success">关闭</el-button>
        <el-button type="warning">下一个</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'

const dflag = ref<boolean>(false)
const match2Visible = ref<boolean>(false)
let props = defineProps<{
  matchVisible: boolean
}>()
watchEffect(() => {
  dflag.value = props.matchVisible
})
const emit = defineEmits<{
  updateMatchVisible: [value: boolean]
}>()
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<any>([])
const handleShowMatch2 = (row: any) => {
  match2Visible.value = true
}
// 关闭匹配
const handleCloseCheck = () => {
  emit('updateMatchVisible', false)
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  // fetchData()
}
// 匹配1col合并方法
const objectSpanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex === 0 && columnIndex === 12) {
    // 获取当前row的零件id
    const id = row.id;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
}
let previous: any = null; 
let currentGroupIndex = 0; // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row;
  const currentId = row.id;
  // 检查当前行是否与上一行不同
  if (currentId !== previous) {
    previous = currentId; 
    currentGroupIndex++; 
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : '';
};
let previous2: any = null; 
let currentGroupIndex2 = 0; // 当前组索引

const stripedRowClass2 = (_row: any) => {
  const { row } = _row;
  const currentId = row.id;
  // 检查当前行是否与上一行不同
  if (currentId !== previous2) {
    previous2 = currentId; 
    currentGroupIndex2++; 
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex2 % 2 === 0 ? 'el-table__row--striped' : '';
};

const match1Style = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex !== 0 && data.columnIndex !== 5) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
const match2Style = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex !== 6) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
const fakeData = [
  {
    sku: 'Tomorotec-0017-b 三角沥水架-包胶款-黑色'
  }
]
</script>

<style lang="scss" scoped>


</style>