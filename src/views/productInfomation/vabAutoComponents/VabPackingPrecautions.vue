<template>
    <vab-dialog 
        v-model="dflag" 
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
            :data="list"
            :header-cell-style="{ 'text-align': 'center' }"
            @cell-click="changeInput"
            v-loading="listLoading"
            :cell-style="cellStyle"
        >
            <el-table-column label="修改日期" width="140" prop="createTime" align="center">
                <template #default="{ row }">
                    <span>{{ row.createTime.split(' ')[0] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="需质检" width="90" prop="status" align="center">
                <template #default="{ row }">
                    <el-checkbox v-model="row.status" :true-value="1" :false-value="0" class="custom-checkbox" @change="handleStatusChange(row)"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="检查类型" min-width="40" align="center">
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
            <el-table-column label="打包注意事项" min-width="200" prop="packagePrecautions">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.packagePrecautions" @keyup.enter="clickQualityInspectionCancle($event, row)" @blur="clickQualityInspectionCancle($event, row)" />
                    </div>
                    <span>{{ row.packagePrecautions }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="120">
                <template #default="{ row, $index }">
                    <el-link type="danger" :underline="false" @click="handleDelQualityInspection(row, $index)">删除</el-link>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" />
            </template>
        </el-table>
  
            <!-- <vab-pagination
                :current-page="queryForm.pageNo"
                :page-size="queryForm.pageSize"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            /> -->
        </div>
    </vab-dialog>
</template>

<script lang="ts" setup>
import type { TableInstance } from 'element-plus'
import { focusAndSelectInput, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils';
import { checkTypeList } from '../../newProductDevelopment/indexCommon'
import { addProductQualityInspection, delProductQualityInspection, getProductQualityInspection, updateProductQualityInspection } from '/@/api/devlocal/productInformation';
import { isEqual } from 'lodash'
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
        fetchData()
    }
  }
)
const list = ref<any>([])
// 表格加载loading状态
const listLoading = ref<boolean>(true)
const tableRef = ref<TableInstance>()

const route: any = useRoute()
const emit = defineEmits(['update:packingPrecautionsVisible', 'update:tableValue'])

const handlerCloseDialog = () => {
    dflag.value = false
    emit('update:packingPrecautionsVisible', dflag.value);
    emit('update:tableValue', list.value)
}
const handleCheckType = async (row: any) => {
    await updateProductQualityInspection(row)
    fetchData()
    row.status = 1
}
const handleStatusChange = async (row: any) => {
    await updateProductQualityInspection(row)
    fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
   
   if  (data.columnIndex === 0){        
   
       return {
            color: '#bbb',
            cursor: 'not-allowed',
            textAlign:'center'
        } 
   }
}
const handleAdd = async () => {
    try {
        const newQualityInspection = {
            skuId: parseInt(route.query.skuId),
            status: 1,
            checkType: 0,
            packagePrecautions: '',
        }
        const { data } = await addProductQualityInspection(newQualityInspection)
        if (data) {
            const { data: tableData } = await getProductQualityInspection({
                skuId: parseInt(route.query.skuId)
            })
            list.value = tableData
            list.value.sort((a: any, b: any) => new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime());
            $baseMessage('新增质检清单成功', 'success', 'hey')
        }
    } catch (error) {
        console.error(error)
    }
}
let copyRow: any
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  copyRow = JSON.parse(JSON.stringify(row));

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }
}
// 质检table blur事件
const clickQualityInspectionCancle = async (event:any,value:any) =>{
  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(copyRow, value)) {
    return
  }
    
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    await updateProductQualityInspection(value)
    fetchData()
    value.status = 1
  }
}
// 删除
const handleDelQualityInspection = async (row: any, index: number) => {
    try {
        $baseConfirm('确定要删除本条信息吗? ', "系统提示", async () => {
            try {
                const { data } = await delProductQualityInspection({ id: row.id! })
                if (data) {
                    list.value.splice(index, 1);
                    fetchData()
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


/**
 * 获取样品进度数据
 */
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductQualityInspection({
    skuId: parseInt(route.query.skuId)
  })
  list.value = data
  listLoading.value = false
  list.value.sort((a: any, b: any) => new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime());
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
