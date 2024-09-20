<template>
    <el-dialog 
        v-model="dflag" 
        :close-on-click-modal="false" 
        title="打包注意事项" 
        width="70%"
        class="moldDialog"
        :before-close="handlerCloseDialog"
    >
        <el-divider style="margin-top: 0; margin-bottom: 20px"/>
        <div id="table-height-container">
            <vab-query-form>
                <vab-query-form-left-panel>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </vab-query-form-left-panel>
            </vab-query-form>

        <el-table 
            ref="tableRef" 
            stripe border 
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            @cell-click="changeInput"
        >
            <el-table-column label="修改日期" width="140" prop="date" align="center">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.date" @keyup.enter="clickQualityInspectionCancle($event, row)" @blur="clickQualityInspectionCancle($event, row)" />
                    </div>
                    <span>{{ row.date }}</span>
                </template>
            </el-table-column>
            <el-table-column label="需质检" width="90" prop="check" align="center">
                <template #default="{ row }">
                    <el-checkbox v-model="row.check" @change="" class="custom-checkbox"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="检查类型" min-width="127" align="center">
                <template #default="{ row }">
                        <el-select v-model="row.checkType" placeholder="请选择检查类型" style="min-width: 100%;" @change="handleCheckType(row)">
                            <el-option
                                v-for="item in checkTypeList"
                                :label="item.label"
                                :value="item.value"
                                :key="item.value"
                            ></el-option>
                        </el-select>
                </template>
            </el-table-column>
            <el-table-column label="打包注意事项" min-width="200" prop="packingPrecautions">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.packingPrecautions" @keyup.enter="clickQualityInspectionCancle($event, row)" @blur="clickQualityInspectionCancle($event, row)" />
                    </div>
                    <span>{{ row.packingPrecautions }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="120">
                <template #default="{ row }">
                    <el-link type="danger" :underline="false" @click="handleDelQualityInspection(row)">删除</el-link>
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
</template>

<script lang="ts" setup>
import { getProgressSampleList, ProgressSampleReceipt, ProgressSampleUpdate } from '~/src/api/devlocal/progress';
import { IProgressSampleUpdate, ISampleList } from '~/src/type/progress/progressType';
import type { TableInstance, FormInstance } from 'element-plus'
import { convertString } from '~/src/utils/stringUtils';
import { getRootElement, getSpecificChildren } from '~/src/utils/nodeUtils';
import { checkTypeList } from '../../newProductDevelopment/indexCommon'
defineOptions({
    name: 'vabPackingPrecautions'
})
let props = defineProps<{
    packingPrecautionsVisible: boolean
}>();
const dflag = ref<boolean>(false)
watchEffect(()=>{
    dflag.value = props.packingPrecautionsVisible
    if(dflag.value === true) {
        // fetchData()
    }
  }
)
const tableData = ref([
    {
        date: '2024-09-01',
        check: true,
        checkType: 0,
        packingPrecautions: '注意防潮',
    },
    {
        date: '2024-09-02',
        check: false,
        checkType: 1,
        packingPrecautions: '易碎品请小心轻放',
    },
    {
        date: '2024-09-03',
        check: true,
        checkType: 2,
        packingPrecautions: '请保持通风',
    },
])
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
const emit = defineEmits(['update:packingPrecautionsVisible', 'update:tableValue'])

const handlerCloseDialog = () => {
    dflag.value = false
    emit('update:packingPrecautionsVisible', dflag.value);
    emit('update:tableValue', tableData.value)
}
const handleCheckType = (row: any) => {
    row.check = true
}

const handleAdd = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // 获取 'YYYY-MM-DD' 格式
    tableData.value.push({
        date: formattedDate,
        check: true,
        checkType: 0,
        packingPrecautions: '',
    })
}
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
    if (!cell.children[0].children[0]
        || !cell.children[0].children[1]
        || !cell.children[0].children[0].classList
        || !cell.children[0].children[1].classList) {
        return
    }

    
            cell.children[0].children[0].classList.remove('none')
            cell.children[0].children[1].classList.add('none')
    


    // 自动聚焦
    const inputElement = getSpecificChildren(cell, "input")[0];
    if (inputElement) {
        inputElement.focus()
        inputElement.select()
    } else {
        const textareaElement = getSpecificChildren(cell, "textarea")[0];
        if (textareaElement){
            textareaElement.focus()
            textareaElement.select()
        }
    }
}
// 质检table blur事件
const clickQualityInspectionCancle = async (event:any,value:any) =>{
    const t1 = getRootElement(event["srcElement"],".cell").children[0]
    if (t1){
      t1.classList.add("none")
    }
  
    const t2 = getRootElement(event["srcElement"],".cell").children[1]
    if (t2){
      t2.classList.remove("none")
    }
    
    if (event.type === 'blur') {
        // 执行失去焦点处理逻辑
        // await reviewStepNo4UpdateQualityInspection(value)
        // fetchQualityInspectionData()
        value.check = true
    }
}
// 删除
const handleDelQualityInspection = async (row: any) => {
    try {
        $baseConfirm('确定要删除本条质检信息吗', "系统提示", async () => {
            // try {
            //     const {data, msg} = await reviewStepNo4DelQualityInspection({ qualityInspectionId: row.qualityInspectionId! })
            // if (msg === "调用成功！") {
            //     const index = qualityInspectionList.value.findIndex((item: IreviewStepNo4ListQualityInspection) => item.qualityInspectionId === row.qualityInspectionId);
            //     if (index !== -1) {
            //         qualityInspectionList.value.splice(index, 1);
            //     }
            //     $baseMessage("质检信息删除成功！","success","hey")
            // } else {
            //     $baseMessage("质检信息删除失败，请重试。", "error", "hey");
            // }
            // } catch (delError) {
            //     console.error(delError);
            //     $baseMessage("变体删除操作失败，请重试。", "error", "hey");
            // }
        });
    } catch(e){
        console.log(e as Error)
   }
}


/**
 * 获取样品进度数据
 */
// const fetchData = async () => {
//   listLoading.value = true
//   // console.log(queryForm)
//   const { data } = await getProgressSampleList(queryForm)
//   sampleList.value = data.list
//   total.value = data.total
//   listLoading.value = false
// }
/**
 * 分页页数改变
 */
 const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
//   fetchData()
}
/**
 * 分页大小的改变
 */
 const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
//   fetchData()
}

onActivated(() => {
  tableRef.value?.doLayout()
})

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
</style>
