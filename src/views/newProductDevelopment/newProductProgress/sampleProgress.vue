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
            >
                <el-table-column align="center" label="图片" width="75">
                    <template #default="{ row }">
                        <el-popover placement="top-start" trigger="hover">
                            <el-image :src="row.compoenntImg" />
                            <template #reference>
                                <el-image :src="row.compoenntImg" />
                            </template>
                        </el-popover>
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
                            <el-button text type="primary" @click="handleSampleReceipt(row.sampleId)">
                            手动签收
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="">
                                        <el-link type="primary" :underline="false" @click="handleSampleUpdate(row)">1688修改</el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="">
                                        <el-link type="primary" :underline="false" @click="handleSampleUpdate(row)">物流</el-link>
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
</template>

<script lang="ts" setup>
import { getProgressSampleList, ProgressSampleReceipt, ProgressSampleUpdate } from '~/src/api/devlocal/progress';
import { ISampleList } from '~/src/type/progress/progressType';
import { Search, ArrowDown, Delete, Plus, ZoomIn  } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'

defineOptions({
    name: 'sampleProgressTable'
})
let props = defineProps<{
    sampleProgressVisible: boolean
}>();
const dflag = ref<boolean>(false)
watchEffect(()=>{
    dflag.value = props.sampleProgressVisible
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
const emit = defineEmits(['update:sampleProgressVisible'])
const handlerCloseDialog = () => {
    dflag.value = false
    emit('update:sampleProgressVisible', dflag.value);
}
const formattedProgressLog = (str: string) => {
  return str
    .replace(/([\u4e00-\u9fa5]) ([a-zA-Z])/g, '$1<br>$2')
    .replace(/([a-zA-Z]) ([\u4e00-\u9fa5])/g, '$1<br>$2');
};
// const isFullscreen = ref<boolean>(false)
// const clickFullScreen = () => {
//   isFullscreen.value = !isFullscreen.value
//   isFullscreen.value ? enter() : exit()
// }
// const { exit, enter, isFullscreen: _isFullscreen } = useFullscreen()
// watch(
//   _isFullscreen,
//   () => {
//     if (_isFullscreen.value) isFullscreen.value = true
//     else isFullscreen.value = false
//   },
//   { immediate: true }
// )

const handleSampleReceipt = async (sampleId: number) => {
    const { data } = await ProgressSampleReceipt({ sampleId })
}
const handleSampleUpdate = async (row: any) => {
    const { data } = await ProgressSampleUpdate({
        sampleId: row.sampleId,
        order1688No: row.orderNo1688,
        logisticsNo: row.logisticsNo
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
onBeforeMount(() => {
  fetchData()
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
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 69.8px !important;
}

</style>
