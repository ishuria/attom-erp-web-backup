<template>
  <el-dialog 
    v-model="dflag" 
    :close-on-click-modal="false" 
    title="添加零件" 
    width="70%"
    class="moldDialog"
    :before-close="handlerCloseDialog"
  >
    <el-divider style="margin-top: 0; margin-bottom: 20px"/>
    <div id="table-height-container">
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
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
      >
        <el-table-column  label="图片" class="image-wall" width="100">
          <template #default="{ row, $index }">
            <el-image class="image" :src="row.imageUrl" alt="" data-img="img"/>
          </template>
        </el-table-column>
        <el-table-column label="零件ID" width="100" prop="createTime"></el-table-column>
        <el-table-column label="SKU" width="200" prop="sku"></el-table-column>
        <el-table-column label="供应商" min-width="200" prop="suppliser"></el-table-column>
        <el-table-column label="零件名" min-width="200" prop="componentName"></el-table-column>
        <el-table-column label="添加数量" min-width="100" prop="packagePrecautions">
          <template #default="{ row }">
              <el-input />
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
    </div>
    <template #footer>
      <el-button type="danger" @click="handlerCloseDialog">取消</el-button>
      <el-button type="primary">确认</el-button>
    </template>
  </el-dialog>
  <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible"/>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { getAddComponentList } from '/@/api/devlocal/purchasePo'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'

defineOptions({
  name: 'vabCreateComponent'
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
const emit = defineEmits(['update:createComponentVisible', 'update:tableValue'])

const handlerCloseDialog = () => {
  dflag.value = false
  emit('update:createComponentVisible', dflag.value);
  emit('update:tableValue', list.value)
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
.image {
  width: 75px;
  height: 75px;
}

</style>
