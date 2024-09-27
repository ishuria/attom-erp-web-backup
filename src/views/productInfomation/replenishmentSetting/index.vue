<template>
    <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>产品补货计算参数</h2>
        </vab-query-form-top-panel>
        <vab-query-form-left-panel :span="24">
            <el-space>
                <span>站点</span>
                <el-select v-model="site" placeholder="请选择站点" @change="handleChangeSite">
                    <el-option v-for="dict in replenishmentSiteColumns" :key="dict.value"
                        :value="dict.value" :label="dict.label"></el-option>
                </el-select>
                <el-button type="primary" @click="handleUpdate">批量修改</el-button>
            </el-space>
        </vab-query-form-left-panel>
      </vab-query-form>
  
      <el-table ref="tableRef" border stripe :data="list" @cell-click="tableInputChange" @selection-change="setSelectRows" v-loading="listLoading" class="noneHoveTable">
        <el-table-column type="selection" width="38" fixed/>
        <el-table-column align="center" label="图片" width="100" prop="skuUrl" >
            <template #default="{ row }">
                <el-image style="width: 75px; height: 75px" :src="row.skuUrl" fit="fill" data-img="img" />
            </template>
        </el-table-column>
        <el-table-column align="center" label="SKU" min-width="200" prop="sku" />
        <el-table-column align="center" label="产品分类1" min-width="200" prop="type1" />
        <el-table-column align="center" label="产品分类2" prop="type2" min-width="140"></el-table-column>
        <el-table-column align="center" label="维持库存天数" min-width="230" prop="stockPileNumberDays" />
        <el-table-column align="center" label="最小维持库存数量" min-width="160" prop="minStockPilNumber" />
        <el-table-column align="center" label="交期安全天数" min-width="160" prop="safetyLeadTime" />
        <el-table-column align="center" label="平均交期(近10次)" min-width="160" prop="avgLead" />
        <el-table-column align="center" label="交期平均波动" min-width="160" prop="avgLeadFluctuation" />
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
        <el-form-item label="产品分类1" prop="type1">
          <el-input v-model="form.type1" clearable />
        </el-form-item>
        <el-form-item label="产品分类2" prop="type2">
          <el-input v-model="form.type2" clearable  />
        </el-form-item>
        <el-form-item label="维持库存天数" prop="stockPileNumberDays">
          <el-input v-model="form.stockPileNumberDays" clearable />
        </el-form-item>
        <el-form-item label="最小维持库存数量" prop="minStockPilNumber">
          <el-input v-model="form.minStockPilNumber" clearable />
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
import type { FormInstance, TableInstance } from 'element-plus'
import { doDelete } from '/@/api/table'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleMatched, handleTabs } from '/@/utils/routes'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'
import { estimatedCostAccountingSiteColumns } from '../../newProductDevelopment/indexCommon'
import { getProductReplenList, updateProductReplenParams } from '/@/api/devlocal/productInformation'

defineOptions({
    name: 'replenishmentSetting',
})
const replenishmentSiteColumns = [
  {
    value: 0,
    label: '亚马逊US',
  },
  {
    value: 1,
    label: '亚马逊DE',
  },
  {
    value: 2,
    label: '亚马逊UK',
  },
  {
    value: 3,
    label: '亚马逊CA',
  },
  {
    value: 4,
    label: '亚马逊MX',
  },
  {
    value: 5,
    label: '沃尔玛US',
  },
]
const queryForm = reactive<any>({
  keyWord: '',
  site: 0,
  pageNo: 1,
  pageSize: 20,
})
const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const site = ref<number>(0)
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
const formRef = ref<FormInstance>()
// 批量修改数据表单
let form = reactive<any>({
  ids: '',
  type1: '',
  type2: '',
  stockPileNumberDays: null,
  minStockPilNumber: null,
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
    formRef.value?.resetFields()
  } else {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  }

}
const ids = ref<any>([]) // 产品补货计ids使用
const handleSubmit = async () => {
  updateVisible.value = false
  selectRows.value.forEach((item: any) => {
    ids.value.push(item.id)
  })
  form.ids = `${ids.value}`
  const { data } = await updateProductReplenParams({
    ...form
  })
  if(data === true) {
    fetchData()
    $baseMessage('批量修改成功', 'success', 'hey')
  }
}
// table单击修改
const tableInputChange = async(row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
    // 处理图片放大预览
    let el = getSpecificChildren(cell, "img")[0];
    if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
        imagePreviewVisible.value = true
        imagePriviewList.value = []
        imagePriviewList.value.push(el.src)
    }
}
const handleChangeSite = (value: any) => {
  queryForm.site = value
  fetchData()
}
const fetchData = async () => {
    listLoading.value = true
    const { data } = await getProductReplenList(queryForm)
    list.value = data.list
    total.value = data.total
    listLoading.value = false
}

onActivated(() => {
    tableRef.value?.doLayout()
})

onBeforeMount(() => {
    fetchData()
})
</script>
  
<style lang="scss" scoped>
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
</style>