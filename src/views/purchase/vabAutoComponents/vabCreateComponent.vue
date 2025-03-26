<template>
  <vab-dialog 
    v-model="dflag" 
    title="添加零件" 
    top="5%"
    width="60%"
    @close="handlerCloseDialog"
  >
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table 
      ref="tableRef" 
      border :cell-class-name="getCellStyle" 
      :cell-style="cellStyle"
      :data="list"
      :header-cell-style="{ 'text-align': 'center' }"
      max-height="550px"
      stripe
    >
      <el-table-column  class="image-wall" label="图片" width="75">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.imageUrl" style="display: block; width: 75px; height: 75px" @click="showPreviewImage(row.imageUrl)">
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="零件ID" prop="id" width="100"/>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"/>
      <el-table-column label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')"/>
      <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(list, '零件名', 'componentName')"/>
      <el-table-column label="添加数量" min-width="100" prop="count">
        <template #default="{ row }">
            <el-input v-model="row.count" clearable />
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="70" prop="unit"/>
      <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>

    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  
    <template #footer>
      <el-button type="danger" @click="handlerCloseDialog">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose"/>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { getAddComponentList } from '/@/api/devlocal/purchasePo'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabCreateComponent'
})
let props = defineProps<{
  createComponentVisible: boolean
}>();
const dflag = ref<boolean>(false)
watchEffect(()=>{
  dflag.value = props.createComponentVisible
  if(dflag.value === true) {
    fetchData()
  }
}
)
const getCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
/**
 * 分页
 */
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: ''
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const list = ref<any>([])

const tableRef = ref<TableInstance>()

const emit = defineEmits(['update:createComponentVisible', 'update:tableValue'])

const handlerCloseDialog = () => {
  dflag.value = false
  emit('update:createComponentVisible', dflag.value);
}
const validateComponent = (item: any) => {
  if (item.count) {
    return true;
  } 
  return false; 
};
const handleConfirm = () => {
  const countAllValid = list.value.some((item: any) => validateComponent(item));
  if (countAllValid) {
    emit('update:tableValue', list.value)
    dflag.value = false
    emit('update:createComponentVisible', dflag.value);
  } else {
    $baseMessage('至少填写一个零件的添加数量', 'warning');
  }
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex === 0 || data.columnIndex === 1 || data.columnIndex === 6) {        
    return {
      textAlign:'center'
    } 
  }
}

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}

const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
/**
* 获取样品进度数据
*/
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getAddComponentList(queryForm)
  if (data) {
    total.value = data.total
    list.value = data.list
    listLoading.value = false
  }
}
onActivated(() => {
  tableRef.value?.doLayout()
})
</script>

<style lang="scss" scoped>
.moldDialog  { 
  .el-dialog__body{
    padding-top: 0px;
  }
}
#table-height-container {
  display: flex;
  flex-direction: column;
  height: calc(80vh - 192px);
  max-height: calc(80vh - 192px);
  
  .el-table {
      flex: 1; // 使表格占据剩余空间
      overflow: auto; // 确保表格内容可以滚动
  }
}
// // 设置行高
// :deep(.el-table .el-table__body .cell) {
//   max-height: 69.8px !important;
// }
.custom-checkbox {
transform: scale(1.2); 
transform-origin: center;
}
.none {
  display: none;
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
