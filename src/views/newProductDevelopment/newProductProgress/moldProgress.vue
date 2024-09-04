<template>
    <el-dialog 
        v-model="dflag" 
        :close-on-click-modal="false" 
        title="开模进度" 
        width="80%"
        class="moldDialog"
        style="margin: 10vh auto; height: 80vh; display: flex; flex-direction: column;"
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
                :data="moldList" 
                :header-cell-style="{ 'text-align': 'center' }"
            >
                <el-table-column align="center" label="提交的信息">
                    <el-table-column align="center" label="提交日期" min-width="100">
                        <template #default="{ row }">
                            {{ row.createTime.split(' ')[0] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="产品" min-width="160" prop="productName" >
                        <template #default="{ row }">
                            <span v-html="formattedProgressLog(row.productName)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="零件名" min-width="180" prop="componentName" >
                        <template #default="{ row }">
                            {{ row.componentName  }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="供应商">
                        <template #default="{ row }">
                            {{ row.supplierName }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="模具费（未税）" min-width="90">
                        <template #header>
                            模具费<br>（未税）
                        </template>
                        <template #default="{ row }">
                            {{ row.excludingTax }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="模具费（普票税点）" min-width="110">
                        <template #header>
                            模具费<br>（普票税点）
                        </template>
                        <template #default="{ row }">
                            {{ row.standardInvoice }}%
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="模具费（专票税点）" min-width="110">
                        <template #header>
                            模具费<br>（专票税点）
                        </template>
                        <template #default="{ row }">
                            {{ row.specialInvoice }}%
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="预估总采购货值（未税）" min-width="130">
                        <template #header>
                            预估总采购货值<br>（未税）
                        </template>
                        <template #default="{ row }">
                            {{ row.purchaseTotal }}
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column align="center" label="审核结果">
                    <el-table-column align="center" label="状态" min-width="100">
                        <template #default="{ row }">
                            <span :class="generateStatus(row.status).color">
                                {{ generateStatus(row.status).text }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="开模费处理方式" min-width="100">
                        <template #header>
                            开模费<br>处理方式
                        </template>
                        <template #default="{ row }">
                            {{ generateDealMethod(row.dealMethod) }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="开票类型" min-width="100">
                        <template #default="{ row }">
                            {{ generateInvoiceType(row.invoiceType) }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="付款金额" min-width="100">
                        <template #default="{ row }">
                            {{ row.payPrice }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="审核人" min-width="100">
                        <template #default="{ row }">
                            {{ row.audit }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" label="操作" width="180">
                        <template #default="{ row }">
                            <el-button text type="primary" :disabled="row.status !== 1">付款申请</el-button>
                            <el-button text type="primary" @click="handleAudit(row)" :disabled="row.status === 1 || row.status === 2">审批</el-button>
                        </template>
                    </el-table-column>
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
        v-model="auditVisible"
        :close-on-click-modal="false" 
        title="审批" 
        width="30%"
        class="moldDialog"
    >
        <el-divider style="margin-top: 0;"/>
        <el-form ref="formRef" class="demo-form" label-position="right" label-width="110px" :model="form" style="max-width: 300px; margin: 0 auto;">
            <el-form-item label="开模费处理方式" prop="dealMethod">
                <el-select v-model="form.dealMethod" placeholder="" clearable>
                    <el-option v-for="option in dealMethodOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开票类型" prop="type">
                <el-select v-model="form.type" placeholder="" clearable>
                    <el-option v-for="option in invoiceTypeOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
       <template #footer>
            <span>
                <el-button @click="handleFailed">不通过</el-button>
                <el-button type="primary" @click="handleSuccess">通过</el-button>
            </span>
       </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { getProgressMoldList, getProgressSampleList, updateProgressMold } from '~/src/api/devlocal/progress';
import { IProgressMoldList, ISampleList, ISampleListQueryReq } from '~/src/type/progress/progressType';
import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'
import type { TableInstance, FormInstance } from 'element-plus'

defineOptions({
    name: 'moldProgressTable'
})
let props = defineProps<{
    moldProgressVisible: boolean
}>();
const dflag = ref<boolean>(false)
watchEffect(()=>{
    dflag.value = props.moldProgressVisible
  }
)
// 总记录数
const total = ref<number>(0)
// 分页查询表单
const queryForm = reactive<ISampleListQueryReq>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
})
// 表格加载loading状态
const listLoading = ref<boolean>(true)
// 样品进度数据
const moldList = ref<IProgressMoldList[]>([])
const tableRef = ref<TableInstance>()
// 审批框显示状态
const auditVisible = ref<boolean>(false)
// 审批申请表单
let form = ref<any>({
  moldId: null,
  dealMethod: null,
  type: null,
})
const dealMethodOptions = [
  { label: '不含在PO', value: 0 },
  { label: '含在PO', value: 1 },
  { label: '含在其他PO', value: 2 },
];
const invoiceTypeOptions = [
  { label: '专票', value: 0 },
  { label: '普票', value: 1 },
  { label: '不开票', value: 2 },
];
const emit = defineEmits(['update:moldProgressVisible'])
const formRef = ref<FormInstance>()
const resetForm = () => {
  formRef.value?.resetFields()
}
const handlerCloseDialog = () => {
    dflag.value = false
    emit('update:moldProgressVisible', dflag.value);
}
const formattedProgressLog = (str: string) => {
  return str
    .replace(/([\u4e00-\u9fa5]) ([a-zA-Z])/g, '$1<br>$2')
    .replace(/([a-zA-Z]) ([\u4e00-\u9fa5])/g, '$1<br>$2');
};
const generateStatus = (value: number) => {
  switch (value) {
    case 0:
      return { text: "审批中", color: "status-pending" };
    case 1:
      return { text: "待提交付款申请", color: "status-in" };
    case 2:
      return { text: "已付款", color: "status-paid" };
    default:
      return { text: "未知", color: "status-pending" };
  }
}
const generateDealMethod = (value: number) => {
    if (value === 0) {
        return "不含在PO"
    } else if (value === 1) {
        return "含在PO"
    } else if (value === 2) {
        return "含在其他PO"
    }
}
const generateInvoiceType = (value: number) => {
    if (value === 0) {
        return "专票"
    } else if (value === 1) {
        return "普票"
    } else if (value === 2) {
        return "不开票"
    }
}
// 点击审批
const handleAudit = (row: any) => {
    auditVisible.value = true
    form.value.moldId = row.moldId
    form.value.dealMethod = row.dealMethod
    form.value.invoiceType = row.invoiceType
}
// 审批不通过
const handleFailed = () => {
    auditVisible.value = false
    resetForm()
}
// 审批通过
const handleSuccess = async () => {
    auditVisible.value = false
    const { data } = await updateProgressMold(form.value)
    resetForm()
    
}

/**
 * 获取开模进度数据
 */
const fetchData = async () => {
  listLoading.value = true
//   console.log(queryForm)
  const { data } = await getProgressMoldList(queryForm)
  moldList.value = data.list
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
onBeforeMount(() => {
  fetchData()
})

</script>

<style lang="scss" scoped>
#table-height-container {
    display: flex;
    flex-direction: column;
    max-height: calc(80vh - 100px);
    height: calc(80vh - 100px);

    .el-table {
        flex: 1; // 使表格占据剩余空间
        overflow: auto; // 确保表格内容可以滚动
    }
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 50px !important;
}
.status-pending {
  color: rgb(192, 192, 192, 1);
}
.status-in {
  color: orange;
}
.status-paid {
  color: black;
}

</style>
