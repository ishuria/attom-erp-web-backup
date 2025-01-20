<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-space>
          <span>站点</span>
          <el-select v-model="site" placeholder="请选择站点" @change="handleChangeSite">
            <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id"/>
          </el-select>
          <el-button type="primary" @click="handleUpdate">批量修改</el-button>
        </el-space>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table ref="tableRef" v-loading="listLoading" border class="noneHoveTable" :data="list" stripe @cell-click="tableInputChange" @selection-change="setSelectRows">
      <el-table-column fixed type="selection" width="38"/>
      <el-table-column align="center" label="图片" prop="skuUrl" width="100" >
        <template #default="{ row }">
          <el-image data-img="img" fit="fill" :src="row.skuUrl" style="width: 75px; height: 75px" >
            <template #error>
              <el-icon/>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SKU" min-width="200" prop="sku" />
      <el-table-column align="center" label="产品分类" min-width="200" prop="type1" />
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
    <vab-dialog 
      v-model="updateVisible" 
      :before-close="handlerCloseDialog" 
      class="moldDialog" 
      :close-on-click-modal="false"
      title="批量修改"
      width="500"
    >
      <el-divider style="margin-top: 0;"/>
      <el-form ref="formRef" class="demo-form" label-position="right" label-width="auto" :model="form" :rules="formRules" style="max-width: 340px; margin: 0 auto;">
        <el-form-item label="产品分类" prop="kindId">
          <el-select v-model="form.kindId" placeholder="请选择产品类别">
            <el-option 
              v-for="item in merchandiseTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="维持库存天数" prop="stockPileNumberDays">
          <el-input v-model.number="form.stockPileNumberDays" clearable />
        </el-form-item>
        <el-form-item label="最小维持库存数量" prop="minStockPilNumber">
          <el-input v-model.number="form.minStockPilNumber" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateVisible = false">退出</el-button>
        <el-button type="primary" @click="handleSubmit">完成</el-button>
      </template>
    </vab-dialog>
    <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose"/>
  </div>
</template>
  
<script lang="ts" setup>
import type { FormInstance, FormRules, TableInstance } from 'element-plus';

import { getSeasonalCoefficientSite, getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { getProductReplenList, updateProductReplenParams } from '/@/api/devlocal/productInformation'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'

defineOptions({
    name: 'ReplenishmentSetting',
})

const siteList = ref<{id: number, label: string}[]>([])
const queryForm = reactive<any>({
  keyWord: '',
  site: 0,
  pageNo: 1,
  pageSize: 20,
})

const tableRef = ref<TableInstance>()
const site = ref<number>(0)
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const updateVisible = ref<boolean>(false)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const formRef = ref<FormInstance>()
// 批量修改数据表单
const form = reactive<any>({
  ids: '',
  kindId: null,
  stockPileNumberDays: null,
  minStockPilNumber: null,
})
const formRules = reactive<FormRules>({
  kindId: [{ required: true, message: '请选择产品类别', trigger: 'change' }],
  stockPileNumberDays: [{ required: true, message: '请填写维持库存天数', trigger: 'blur' }],
  minStockPilNumber: [{ required: true, message: '请填写最小维持库存数量', trigger: 'blur' }],
})
const selectRows = ref<any>([])
const setSelectRows = (value: string) => {
  selectRows.value = value
}
const handlerCloseDialog = () => {
  updateVisible.value = false
}
const merchandiseTypeList = ref<{id: number, label: string}[]>([])
const handleUpdate = async () => {
  if(selectRows.value.length > 0) {
    updateVisible.value = true
    formRef.value?.resetFields()
    const { data } = await getSeasonalCoefficientSite({ site: site.value })
    merchandiseTypeList.value = data
  } else {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  }

}
const ids = ref<any>([]) // 产品补货计ids使用
const handleSubmit = async () => {
  formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      selectRows.value.forEach((item: any) => {
        ids.value.push(item.id)
      })
      form.ids = `${ids.value}`
      const { data } = await updateProductReplenParams({
        ...form
      })
      if (data) {
        updateVisible.value = false
        fetchData()
        $baseMessage('批量修改成功', 'success', 'hey')
      }
    }
  })
  
}
// table单击修改
const tableInputChange = async(row: any, column: any, cell: HTMLTableCellElement) =>{
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src)
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
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
}
onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchSiteList()
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