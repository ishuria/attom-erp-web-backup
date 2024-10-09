<template>
  <el-dialog 
    v-model="dflag" 
    :close-on-click-modal="false" 
    title="自动签收设定" 
    width="35%"
    class="moldDialog"
    :before-close="handlerCloseDialog"
  >
    <el-divider style="margin-top: 0; margin-bottom: 20px"/>
    <div id="table-height-container">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary">新增</el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
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
        <el-table-column label="零件" min-width="200" prop="component">

        </el-table-column>
        <el-table-column label="操作" prop="packagePrecautions" min-width="100">
          <template #default="{ row }">
            <el-button text type="danger">删除</el-button>
          </template>
        </el-table-column>
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

    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { delProductQualityInspection } from '/@/api/devlocal/productInformation'

defineOptions({
  name: 'vabAutomaticSignature'
})
let props = defineProps<{
  automaticSignatureVisible: boolean
}>();
const dflag = ref<boolean>(false)
watchEffect(()=>{
  dflag.value = props.automaticSignatureVisible
  if(dflag.value === true) {
      // fetchData()
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
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}

const list = ref<any>([])

const tableRef = ref<TableInstance>()

const route: any = useRoute()
const emit = defineEmits(['update:automaticSignatureVisible', 'update:tableValue'])

const handlerCloseDialog = () => {
  dflag.value = false
  emit('update:automaticSignatureVisible', dflag.value);
  emit('update:tableValue', list.value)
}


const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
 if  (data.columnIndex === 1){        
     return {
          textAlign:'center'
      } 
 }
}



const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 

}

// 删除
const handleDelQualityInspection = async (row: any, index: number) => {
  try {
      $baseConfirm('确定要删除本条信息吗? ', "系统提示", async () => {
          try {
              const { data } = await delProductQualityInspection({ id: row.id! })
              if (data) {
                  list.value.splice(index, 1);
                  // fetchData()
                  $baseMessage("删除成功！","success","hey")
              } else {
                  $baseMessage("删除失败，请重试。", "error", "hey");
              }
          } catch (delError) {
              console.error(delError);
              $baseMessage("删除操作失败，请重试。", "error", "hey");
          }
      });
  } catch(e){
      console.log(e as Error)
 }
}


// /**
// * 获取样品进度数据
// */
// const fetchData = async () => {
// listLoading.value = true
// const { data } = await getProductQualityInspection({
//   skuId: parseInt(route.query.skuId)
// })
// list.value = data
// listLoading.value = false
// list.value.sort((a: any, b: any) => new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime());
// }

// onActivated(() => {
// tableRef.value?.doLayout()
// })

</script>

<style lang="scss" scoped>
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
.none {
  display: none;
}

</style>
