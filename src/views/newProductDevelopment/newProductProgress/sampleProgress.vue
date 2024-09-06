<template>
   
    <el-dialog 
        v-model="dflag" 
        :close-on-click-modal="false" 
        title="样品进度" 
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
                v-loading="listLoading" 
                border stripe 
                :data="sampleList" 
                :header-cell-style="{ 'text-align': 'center' }"
                @cell-click="sampleTableInputChage"
            >
                <el-table-column align="center" label="图片" min-width="100">
                    <template #default="{ row }">
                        <el-image style="width: 75px; height: 75px" :src="row.componentImg" fit="fill" />
                    </template>
                </el-table-column>
                <el-table-column label="产品" min-width="160" prop="productName" >
                    <template #default="{ row }">
                        <span v-html="formattedProgressLog(row.productName)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="零件名"  min-width="160" prop="componentName" >
                    <template #default="{ row }">
                        {{ row.componentName  }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下单日期" min-width="100">
                    <template #default="{ row }">
                        {{ row.createTime.split(' ')[0] }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="签收日期" min-width="100">
                    <template #default="{ row }">
                        {{ row.receiptDate ? row.receiptDate.split(' ')[0] : '' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="物流追踪" min-width="100"/>
                <el-table-column align="center" label="供应商">
                    <template #default="{ row }">
                        {{ row.supplier }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="1688订单号" min-width="160">
                    <template #default="{ row }">
                        {{ row.orderNo1688 }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="物流单号（非1688订单）" min-width="200" >
                    <template #default="{ row }">
                        {{ row.logisticsNo }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="金额￥" min-width="100" >
                    <template #default="{ row }">
                        {{ row.price }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="大货可退￥" min-width="100" >
                    <template #default="{ row }">
                        {{ row.bulkGoodsReturnable }}
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="160">
                    <template #default="{ row }">
                        <el-dropdown >
                            <el-button text type="primary" @click="handleSampleReceipt(row)">
                            手动签收
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="">
                                        <el-link type="primary" :underline="false" @click="orderNo1688Update(row)">1688订单号修改</el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="">
                                        <el-link type="primary" :underline="false" @click="logisticsNoUpdate(row)">物流订单修改</el-link>
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
    </el-dialog>

    <el-dialog 
        :model-value="orderVisible"
        width="400"
        :title="dialogFlag === true ?'物流单号修改':'1688订单号修改'"
        :close-on-click-modal="false"
        :before-close="orderDialogClose"
    >
        <el-form 
            ref="formRef"
            :model="orderForm"
            label-width="auto" 
            style="max-width: 400px"
        >
            <el-form-item label="1688订单号" prop="orderNo1688" v-if="!dialogFlag">
                <el-input v-model="orderForm.orderNo"/>
            </el-form-item>

            
            <el-form-item label="物流单号" prop="logisticsNo" v-if="dialogFlag">
                <el-input v-model="orderForm.logisticsNo"/>
            </el-form-item>

        </el-form>

        <template #footer>
            <span>
                <el-button @click="orderDialogClose">取消</el-button>
                <el-button type="primary" @click="submitForm(formRef)">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { getProgressSampleList, ProgressSampleReceipt, ProgressSampleUpdate } from '~/src/api/devlocal/progress';
import { IProgressSampleUpdate, ISampleList } from '~/src/type/progress/progressType';
import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'
import type { TableInstance, FormInstance } from 'element-plus'
import { convertString } from '~/src/utils/stringUtils';
import { getSpecificChildren } from '~/src/utils/nodeUtils';

defineOptions({
    name: 'sampleProgressTable'
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
const formattedProgressLog = (str: string) => {
  return str
    .replace(/([\u4e00-\u9fa5]) ([a-zA-Z])/g, '$1<br>$2')
    .replace(/([a-zA-Z]) ([\u4e00-\u9fa5])/g, '$1<br>$2');
};
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
const sampleTableInputChage = (row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
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
const submitForm = async (formEl: FormInstance | undefined) => {
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

</script>

<style lang="scss" scoped>
#table-height-container {
    display: flex;
    flex-direction: column;
    max-height: calc(80vh - 120px);
    height: calc(80vh - 120px);
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
