<template>
    <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>产品补货计算参数</h2>
        </vab-query-form-top-panel>
        <vab-query-form-left-panel :span="24">
            <el-space>
                <span>站点</span>
                <el-select v-model="site" placeholder="请选择站点" >
                    <el-option v-for="dict in estimatedCostAccountingSiteColumns" :key="dict.value"
                        :value="dict.value" :label="dict.label"></el-option>
                </el-select>
                <el-button type="primary" @click="handleUpdate">批量修改</el-button>
            </el-space>
        </vab-query-form-left-panel>
      </vab-query-form>
  
      <el-table ref="tableRef" border stripe :data="fakeData" @cell-click="tableInputChange" @selection-change="setSelectRows">
        <el-table-column type="selection" width="38" fixed/>
        <el-table-column align="center" label="图片" width="100" prop="imageUrl" >
            <template #default="{ row }">
                <el-image style="width: 75px; height: 75px" :src="row.imageUrl" fit="fill" data-img="img" />
            </template>
        </el-table-column>
        <el-table-column align="center" label="SKU" min-width="200" prop="sku" />
        <el-table-column align="center" label="产品分类1" min-width="200" prop="category1" />
        <el-table-column align="center" label="产品分类2" prop="category2" min-width="140"></el-table-column>
        <el-table-column align="center" label="维持库存天数" min-width="230" prop="stockDays" />
        <el-table-column align="center" label="最小维持库存数量" min-width="160" prop="minStockQuantity" />
        <el-table-column align="center" label="交期安全天数" min-width="160" prop="safetyDays" />
        <el-table-column align="center" label="平均交期(近10次)" min-width="160" prop="averageDeliveryTime" />
        <el-table-column align="center" label="交期平均波动" min-width="160" prop="deliveryVariation" />
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
    <!-- 批量修改 -->
    <el-dialog 
      v-model="updateVisible" 
      :close-on-click-modal="false" 
      title="批量修改" 
      width="500"
      class="moldDialog"
      :before-close="handlerCloseDialog"
    >
      <el-divider style="margin-top: 0;"/>
      <el-form ref="formRef" class="demo-form" label-position="right" label-width="auto" :model="form" style="max-width: 340px; margin: 0 auto;">
        <el-form-item label="产品分类1" prop="category1">
          <el-input v-model="form.category1" clearable />
        </el-form-item>
        <el-form-item label="产品分类2" prop="category2">
          <el-input v-model="form.category2" clearable  />
        </el-form-item>
        <el-form-item label="维持库存天数" prop="stockDays">
          <el-input v-model="form.stockDays" clearable />
        </el-form-item>
        <el-form-item label="最小维持库存数量" prop="minStockQuantity">
          <el-input v-model="form.minStockQuantity" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="updateVisible = false">退出</el-button>
          <el-button type="primary" @click="handleSubmit">完成</el-button>
        </span>
      </template>
    </el-dialog>
      <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
      <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
    </div>
</template>
  
<script lang="ts" setup>
import type { TableInstance } from 'element-plus'
import { doDelete } from '/@/api/table'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'
import { estimatedCostAccountingSiteColumns } from '../../newProductDevelopment/indexCommon'

defineOptions({
    name: 'replenishmentSetting',
})
  
const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const site = ref<string>('0')
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const updateVisible = ref<boolean>(false)
// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
// 批量修改数据表单
let form = ref<any>({
  category1: '',
  category2: '',
  stockDays: null,
  minStockQuantity: null,
})
const selectRows = ref<any>([])
const setSelectRows = (value: string) => {
  selectRows.value = value
}
const handlerCloseDialog = () => {
  updateVisible.value = false
}
const handleUpdate = () => {
  if(selectRows.value.length !== 0) {
    updateVisible.value = true
    form.value = {}
  } else {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  }

}
const handleSubmit = () => {
  updateVisible.value = false
  selectRows.value.forEach((item: any) => {
    item.category1 = form.value.category1
    item.category2 = form.value.category2
    item.stockDays = form.value.stockDays
    item.minStockQuantity = form.value.minStockQuantity
  })
}
// table单击修改
const tableInputChange = async(row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    // 处理图片放大预览
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
        imagePreviewVisible.value = true
        imagePriviewList.value = []
        imagePriviewList.value.push(row.imageUrl)
    }
}
const fakeData = ref([
  {
    imageUrl: "https://via.placeholder.com/75?text=Image+1",
    sku: "SKU-1",
    category1: "电子产品",
    category2: "进口",
    stockDays: 15,
    minStockQuantity: 20,
    safetyDays: 5,
    averageDeliveryTime: 10,
    deliveryVariation: 3,
  },
  {
    imageUrl: "https://via.placeholder.com/75?text=Image+2",
    sku: "SKU-2",
    category1: "家居用品",
    category2: "出口",
    stockDays: 25,
    minStockQuantity: 30,
    safetyDays: 7,
    averageDeliveryTime: 12,
    deliveryVariation: 4,
  },
  {
    imageUrl: "https://via.placeholder.com/75?text=Image+3",
    sku: "SKU-3",
    category1: "服装",
    category2: "国内",
    stockDays: 10,
    minStockQuantity: 15,
    safetyDays: 3,
    averageDeliveryTime: 8,
    deliveryVariation: 2,
  },
]);







// const fetchData = async () => {
//     listLoading.value = true
//     // const { data } = await getList(queryForm)
//     // list.value = data.list
//     // total.value = data.total
//     listLoading.value = false
// }

const customsModeOption = [
    { label: '买单', value: 0 },
    { label: '退税(按整批)', value: 1 },
    { label: '退税(可分批)', value: 2 },
]

const statusFilter = (status: string | number) => {
const statusMap: any = {
    正常: 'success',
    停用: 'danger',
}
return statusMap[status]
}
  

  


// const handleDelete = (row: any) => {
// if (row.id) {
//     $baseConfirm('您确定要删除当前项吗', null, async () => {
//     const { msg }: any = await doDelete({ ids: row.id })
//     $baseMessage(msg, 'success', 'hey')
//     await fetchData()
//     })
// } else {
//     if (selectRows.value.length > 0) {
//     const ids = selectRows.value.map((item: { id: any }) => item.id).join(',')
//     $baseConfirm('您确定要删除选中项吗', null, async () => {
//         const { msg }: any = await doDelete({ ids })
//         $baseMessage(msg, 'success', 'hey')
//         await fetchData()
//     })
//     } else {
//     $baseMessage('您未选中任何行', 'warning', 'hey')
//     }
// }
// }

// const handleDetailStayTable = async () => {
// if (selectRows.value.length > 0)
//     for (let i = 0; i < selectRows.value.length; i++) {
//     const matched = handleMatched(allRoutes.value, '/vab/table/defaultTableDetail')
//     const tab = handleTabs({
//         ...matched.at(-1),
//         query: selectRows.value[i],
//     })
//     if (tab) {
//         await addVisitedRoute(tab)
//         await changeTabsMeta({
//         title: '详情页',
//         meta: {
//             title: `${tab.query.title} 详情页`,
//         },
//         })
//     }
//     }
// else $baseMessage('请至少选择一行进行详情页跳转', 'warning', 'hey')
// }

onActivated(() => {
    tableRef.value?.doLayout()
})

// onBeforeMount(() => {
//     fetchData()
// })
</script>
  
<style lang="scss" scoped>
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}
</style>