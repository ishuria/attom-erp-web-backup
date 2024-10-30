<template>
  <vab-dialog 
    v-model="dflag" 
    title="添加耗材" 
    width="55%"
    top="5%"
    @close="handlerCloseDialog"
  >
 
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                @click="queryData"></el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>

      <el-table 
        ref="tableRef" 
        stripe border 
        :data="list"
        :header-cell-style="{ 'text-align': 'center' }"
        @cell-click="changeInput"
        :cell-style="cellStyle"
        :cell-class-name="getCellStyle"
        max-height="550px"
      >
        <el-table-column  label="图片" class="image-wall" width="82">
          <template #default="{ row, $index }">
            <el-image :src="row.imageUrl" fit="contain" data-img="img" style="width: 100%; height: 100%"/>
          </template>
        </el-table-column>
        <el-table-column label="零件ID" width="100" prop="id"></el-table-column>
        <el-table-column label="供应商" min-width="200" prop="suppliser"></el-table-column>
        <el-table-column label="耗材名" min-width="200" prop="componentName"></el-table-column>
        <el-table-column label="添加数量" min-width="100" prop="count">
            <template #default="{ row }">
                <el-input v-model="row.count" clearable />
            </template>
        </el-table-column>
        <el-table-column label="单位" min-width="70" prop="unit"></el-table-column>
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
  <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible" hide-on-click-modal/>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { getAddConsumableList } from '~/src/api/devlocal/purchasePo'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'

defineOptions({
  name: 'vabCreateConsumable'
})
let props = defineProps<{
  createConsumableVisible: boolean
}>();
const dflag = ref<boolean>(false)
watchEffect(()=>{
  dflag.value = props.createConsumableVisible
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

const route: any = useRoute()
const emit = defineEmits(['update:createConsumableVisible', 'update:tableValue'])

const handlerCloseDialog = () => {
  dflag.value = false
  emit('update:createConsumableVisible', dflag.value);
}
const validateConsumable = (item: any) => {
  if (item.count) {
    return true;
  } 
  return false;
};
const handleConfirm = () => {
  const countAllValid = list.value.some((item: any) => validateConsumable(item));
  if (countAllValid) {
    emit('update:tableValue', list.value)
    dflag.value = false
    emit('update:createConsumableVisible', dflag.value);
  } else {
    $baseMessage('至少填写一个耗材的添加数量', 'warning');
  }
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if  (data.columnIndex === 0 || data.columnIndex === 1 || data.columnIndex === 5){        
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
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el, 'img') && getSpecificChildren(cell, "img")[0]) {
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }
}


/**
* 获取添加耗材数据
*/
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getAddConsumableList(queryForm)
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
  max-height: calc(80vh - 192px);
  height: calc(80vh - 192px);

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
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-left: 0;
  padding-right: 0;
}
</style>
