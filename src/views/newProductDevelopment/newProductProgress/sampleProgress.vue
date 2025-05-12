<template>
  <vab-dialog 
    v-model="dflag" 
    :before-close="handlerCloseDialog" 
    class="moldDialog"
    title="样品进度"
    top="10vh"
    width="80%"
  >
    <el-divider style="margin-top: 0; margin-bottom: 20px"/>
    <div id="table-height-container">
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
        v-loading="listLoading" 
        border :cell-style="cellStyle" 
        :data="sampleList"
        :header-cell-style="cellStyle" 
        stripe
        @cell-click="sampleTableInputChange"
      >
        <el-table-column label="图片" min-width="100">
          <template #default="{ row }">
            <el-image fit="fill" :src="row.componentImg" style="width: 75px; height: 75px" />
          </template>
        </el-table-column>
        <el-table-column label="产品" min-width="160" prop="productName" >
          <template #default="{ row }">
            {{ row.productName  }} <br />
            {{ row.mainSearchTerms }}
          </template>
        </el-table-column>
        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(sampleList, '零件名', 'componentName')" />
        <el-table-column label="下单日期" width="120">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="签收日期" min-width="120">
          <template #default="{ row }">
            {{ row.receiptDate ? row.receiptDate.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="物流追踪" min-width="100"/>
        <el-table-column label="供应商" prop="supplier" :width="flexColumnWidth(sampleList, '供应商', 'supplier')" />
        <el-table-column label="1688订单号" prop="orderNo1688" :width="flexColumnWidth(sampleList, '1688订单号', 'orderNo1688')" />
        <el-table-column label="物流单号（非1688订单）" min-width="200" prop="logisticsNo" />
        <el-table-column label="金额￥" min-width="100" prop="price" />
        <el-table-column label="大货可退￥" min-width="120" prop="bulkGoodsReturnable" />
        <el-table-column label="备注" min-width="130" prop="remark"/>
        <el-table-column fixed="right" label="操作" width="160">
          <template #default="{ row }">
            <el-dropdown >
              <el-button text type="primary" @click="handleSampleReceipt(row)">
              手动签收
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu >
                  <el-dropdown-item @click="handleSampleReceipt(row)">
                    <el-link type="primary" :underline="false" >手动签收</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="orderNo1688Update(row)">
                    <el-link type="primary" :underline="false">1688订单号修改</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="logisticsNoUpdate(row)">
                    <el-link type="primary" :underline="false" >物流订单修改</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
  </vab-dialog>

  <vab-dialog 
    :before-close="orderDialogClose"
    :model-value="orderVisible"
    :title="dialogFlag === true ?'物流单号修改':'1688订单号修改'"
    width="400"
  >
    <el-form 
      ref="formRef"
      label-width="auto"
      :model="orderForm" 
      style="margin: 0"
    >
      <el-form-item v-if="!dialogFlag" label="1688订单号" prop="orderNo1688">
        <el-input v-model="orderForm.orderNo"/>
      </el-form-item>
      <el-form-item v-if="dialogFlag" label="物流单号" prop="logisticsNo">
        <el-input v-model="orderForm.logisticsNo"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="orderDialogClose">取消</el-button>
      <el-button type="primary" @click="submitForm">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { FormInstance, TableInstance } from 'element-plus'
import type { CSSProperties } from 'vue'
import { ProgressSampleReceipt, ProgressSampleUpdate, getProgressSampleList } from '/@/api/devlocal/progress'
import type { IProgressSampleUpdate, ISampleList } from '/@/type/progress/progressType'
import { getSpecificChildren } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
    name: 'SampleProgressTable'
})
let props = defineProps<{
    sampleProgressVisible: boolean
}>();
const dflag = ref<boolean>(false)
watchEffect(()=>{
    dflag.value = props.sampleProgressVisible
    if(dflag.value === true) {
        fetchData()
    }
  }
)
// 总记录数
const total = ref<number>(0)
// 分页查询表单
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
})
// 表格加载loading状态
const listLoading = ref<boolean>(true)
// 样品进度数据
const sampleList = ref<ISampleList[]>([])
const tableRef = ref<TableInstance>()
const orderVisible = ref<boolean>(false)
const dialogFlag = ref<boolean>(false)
 // 订单号
 const orderForm = reactive({
    sampleId:'',
    orderNo:'',
    logisticsNo:'',
})
const emit = defineEmits(['update:sampleProgressVisible', 'update:priviewListValue'])

const handlerCloseDialog = () => {
    dflag.value = false
    emit('update:sampleProgressVisible', dflag.value);
}
// const formattedProgressLog = (str: string) => {
//   return str
//     .replaceAll(/([\u4e00-\u9fa5]) ([A-Za-z])/g, '$1<br>$2')
//     .replaceAll(/([A-Za-z]) ([\u4e00-\u9fa5])/g, '$1<br>$2');
// };
const orderDialogClose = () =>{
    orderVisible.value = false
    orderForm.sampleId = ''
    orderForm.logisticsNo = ''
    orderForm.orderNo = ''
}
const formRef = ref<FormInstance>()
// 手动签收
const handleSampleReceipt = async (row: any) => {
    $baseConfirm('确定要手动签收此条样品记录吗',"系统提示", async ()=>{

        const {data} = await ProgressSampleReceipt({sampleId:row.sampleId})
        row.receiptDate = data.receiptDate
        
        if (data != null || data != undefined){
            $baseMessage(`样品${row.componentName}手动签收成功！`,"success","hey")
        }
    })
}


// 拿样table单击事件
const sampleTableInputChange = (row: any, column: any, cell: HTMLTableCellElement) =>{
    if (getSpecificChildren(cell, ".el-image")[0]){
        emit("update:priviewListValue", row.componentImg)
    }
}
// 1688单号修改
const orderNo1688Update = (row: any) =>{
    orderForm.sampleId = ''
    orderVisible.value = true
    dialogFlag.value = false
    orderForm.sampleId = convertString((row.sampleId))
}

// 物流单号修改
const logisticsNoUpdate = (row: any) =>{
    orderForm.sampleId = ''
    orderVisible.value = true
    dialogFlag.value = true
    orderForm.sampleId = convertString(row.sampleId)
}

// 修改提交
const submitForm = async () => {
  let orderParam: IProgressSampleUpdate = {
    sampleId: parseInt(orderForm.sampleId)
  }


  if (dialogFlag.value === false) {
    if (orderForm.orderNo === ''){
        $baseMessage("1688订单号不能为空！","error","hey")
        return
    }
    orderParam.order1688No = orderForm.orderNo
  }else {
    if (orderForm.logisticsNo === ''){
        $baseMessage("物流单号不能为空！","error","hey")
        return
    }
    orderParam.logisticsNo = orderForm.logisticsNo

  }

  $baseConfirm(`确定要修改${dialogFlag.value === true ?'物流单号':'1688订单号'}`,"系统提示", async ()=>{
    const {data} = await ProgressSampleUpdate({...orderParam})
    if(data === true){
        if (orderForm.orderNo !== ''){
            $baseMessage("1688订单号修改成功！","success","hey")
            const index = sampleList.value.findIndex((item:any) => item.sampleId === parseInt(orderForm.sampleId));
            if (index !== -1) {
                sampleList.value[index].orderNo1688 = orderForm.orderNo;
            }
            orderDialogClose()
            return
        }

        if (orderForm.logisticsNo !== ''){
            $baseMessage("物流单号修改成功！","success","hey")
            const index = sampleList.value.findIndex((item:any) => item.sampleId === parseInt(orderForm.sampleId));
            if (index !== -1) {
                sampleList.value[index].logisticsNo = orderForm.logisticsNo;
            }
            orderDialogClose()
            return
        }

    }
  })

}

/**
 * 获取样品进度数据
 */
const fetchData = async () => {
  listLoading.value = true
  // console.log(queryForm)
  const { data } = await getProgressSampleList(queryForm)
  sampleList.value = data.list
  total.value = data.total
  listLoading.value = false
}
/**
 * 分页页数改变
 */
 const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
/**
 * 分页大小的改变
 */
 const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
/**
 * 获取样品进度列表数据
 */
 const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
onActivated(() => {
  tableRef.value?.doLayout()
})
// onBeforeMount(() => {
//   fetchData()
// })
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['金额￥', '大货可退￥'].includes(label)) {
    return {
      textAlign: 'right'
    }
  } else if (label === '操作') {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
</script>

<style lang="scss" scoped>
#table-height-container {
    display: flex;
    flex-direction: column;
    height: calc(80vh - 120px);
    max-height: calc(80vh - 120px);
    padding-bottom: 20px;
    .el-table {
        flex: 1; // 使表格占据剩余空间
        overflow: auto; // 确保表格内容可以滚动
    }
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 69.8px !important;
}

</style>
