<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleStatus1Change">{{ queryForm.status === 0 ? '展示停产' : '隐藏停产' }}</el-button>
        <el-button type="primary" @click="showPriceCoefficientSetting" >价格系数设定</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
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
      border :cell-class-name="cellClassName" 
      :cell-style="cellStyle" 
      class="noneHoveTable" 
      :data="list" 
      :header-cell-style="headerCellStyle" 
      stripe
      @cell-click="changeInput"
    >
      <el-table-column fixed="left" label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image fit="fill" :src="row.skuImgUrl" style="width: 75px; height: 75px; display: block;" @click="showImagePreview(row.skuImgUrl)">
            <template #error>
              <div class="image-slot">
                <el-icon/>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="SKU品名" prop="sku" :width="flexColumnWidth(list, 'SKU品名', 'sku')"/>
      <el-table-column label="UPC" min-width="70" prop="upc" >
        <template #default="{ row }">
          <div v-html="row.upc"></div>
        </template>
      </el-table-column>
      <el-table-column label="北美FNSKU" prop="northAmericaFnSku" :width="calculateBrColumnWidth(list, (row: any)=>row.northAmericaFnSku, 90)" >
        <template #default="{ row }">
          <div v-html="row.northAmericaFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="欧洲FNSKU" prop="europeFnSku" :width="calculateBrColumnWidth(list, (row: any)=>row.europeFnSku, 90)" >
        <template #default="{ row }">
          <div v-html="row.europeFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="品牌" prop="brank" :width="flexColumnWidth(list, '品牌', 'brank')">
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.brank" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.brank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="HTS美国" prop="htsUs" :width="flexColumnWidth(list, 'HTS美国', 'htsUs')" />
      <el-table-column label="HTS欧洲" prop="htsEurope" :width="flexColumnWidth(list, 'HTS欧洲', 'htsEurope')" />
      <el-table-column label="制造商英文名称" min-width="140" prop="manufacturerEn" >
        <template #default="{ row }">
          <div class="none">
            <el-input 
              v-model="row.manufacturerEn" 
              @blur="clickCancel($event, row)"
              @keydown.enter="clickCancel($event,row)"
            />
          </div>
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip" >{{ row.manufacturerEn }}</div>
            </template>
            <el-text truncated>{{ row.manufacturerEn }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="制造商英文地址" min-width="140" prop="manufacturerAddressEn" >
        <template #default="{ row }">
          <div class="none">
            <el-input 
              v-model="row.manufacturerAddressEn" 
              @blur="clickCancel($event, row)"
              @keydown.enter="clickCancel($event,row)"
            />
          </div>
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip" >{{ row.manufacturerAddressEn }}</div>
            </template>
            <el-text truncated>{{ row.manufacturerAddressEn }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="英文清关品名" prop="clearanceNameEn" :width="flexColumnWidth(list, '英文清关品名', 'clearanceNameEn')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.clearanceNameEn" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.clearanceNameEn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中文清关品名" prop="clearanceNameZh" :width="flexColumnWidth(list, '中文清关品名', 'clearanceNameZh')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.clearanceNameZh" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.clearanceNameZh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材质比例(英文)" prop="materialEn" :width="flexColumnWidth(list, '材质比例(英文)', 'materialEn')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.materialEn" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.materialEn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材质比例(中文)" prop="materialZh" :width="flexColumnWidth(list, '材质比例(中文)', 'materialZh')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.materialZh" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.materialZh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途(中文)" prop="usageZh" :width="flexColumnWidth(list, '用途(中文)', 'usageZh')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.usageZh" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.usageZh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途(英文)" prop="usageEn" :width="flexColumnWidth(list, '用途(英文)', 'usageEn')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.usageEn" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.usageEn }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose"/>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- <default-table-edit ref="editRef" @fetch-data="fetchData" /> -->
    <!-- 价格系数设定 -->
    <vab-dialog
      v-model="priceCoefficientSettingVisible"
      title="价格系数设定"
      width="47em"
      @close="closePriceCoefficientSetting"
    >
    <el-form :model="priceCoefficientSettingForm" >
      <el-form-item>
        <el-text>
          云舟采购单价 = PO含税单价￥ × Random（
          <el-input v-model="priceCoefficientSettingForm.minProcurementCoefficient" clearable placeholder="随机最小价格系数" style="width: 10em;"/> &nbsp;
          <el-input v-model="priceCoefficientSettingForm.maxProcurementCoefficient" clearable placeholder="随机最大价格系数" style="width: 10em;"/>
          ）
        </el-text>
      </el-form-item>
      <el-form-item>
        <el-text>
          云舟销售单价 = ( PO未税单价￥ ×
          <el-input v-model="priceCoefficientSettingForm.salesCoefficient1" clearable placeholder="价格系数" style="width: 6em;"/>
          + 预估运费 ×
          <el-input v-model="priceCoefficientSettingForm.salesCoefficient2" clearable placeholder="价格系数" style="width: 6em;"/> ) / 当前汇率
        </el-text>
      </el-form-item>
      <el-form-item>
        <el-text>
          SKU清关单价 = PO未税单价￥ / 当前汇率 ×
          <el-input v-model="priceCoefficientSettingForm.customClearanceCoefficient" clearable placeholder="价格系数" style="width: 6em;"/>
        </el-text>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="danger" @click="closePriceCoefficientSetting">取消</el-button>
        <el-button type="success" @click="confirmPriceCoefficientSetting">确定</el-button>
      </div>
    </template>
    </vab-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { isEqual } from 'lodash'
import type { CSSProperties } from 'vue'
import { getCustomsClearanceRatio, getCustomsClearanceSkuList, updateCustomsClearanceRatio, updateCustomsClearanceSku } from '/@/api/devlocal/productInformation'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'SkuDeclaration',
})
  
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  status: 1, //隐藏停产0，展示停产1
  pageNo: 1,
  pageSize: 20,
})
// 价格系数设定
const priceCoefficientSettingVisible = ref<boolean>(false)
const priceCoefficientSettingForm = reactive<any>({})
// 打开价格系数设定
const showPriceCoefficientSetting = async () => {
  priceCoefficientSettingVisible.value = true
  const { data } = await getCustomsClearanceRatio()
  Object.assign(priceCoefficientSettingForm, data)
}
// 关闭价格系数设定
const closePriceCoefficientSetting = () => {
  priceCoefficientSettingVisible.value = false
}
// 确认价格系数
const confirmPriceCoefficientSetting = async () => {
  const { data } = await updateCustomsClearanceRatio({
    minProcurementCoefficient: priceCoefficientSettingForm.minProcurementCoefficient,
    maxProcurementCoefficient: priceCoefficientSettingForm.maxProcurementCoefficient,
    salesCoefficient1: priceCoefficientSettingForm.salesCoefficient1,
    salesCoefficient2: priceCoefficientSettingForm.salesCoefficient2,
    customClearanceCoefficient: priceCoefficientSettingForm.customClearanceCoefficient
  })
  if (data) {
    $baseMessage('价格系数修改成功', 'success')
    closePriceCoefficientSetting()
  }
}

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const showImagePreview = (url: string) => {
  imagePreviewList.value = []
  imagePreviewVisible.value = true
  imagePreviewList.value.push(url)
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleStatus1Change = async () => {
  queryForm.status === 0 ? queryForm.status = 1 : queryForm.status = 0
  fetchData()
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 3 || data.columnIndex === 4 || data.columnIndex === 6 || data.columnIndex === 7) {
    return {
      color: '#bbb',
      cursor: 'not-allowed',
      textAlign:'left'
    }
  } else if (data.columnIndex === 10 || data.columnIndex === 11) {
    return {
      textAlign: 'left'
    }
  } else {
    return {
      textAlign:'center'
    }
  }
}
const headerCellStyle = (): CSSProperties => {
  return {
    textAlign: 'center'
  }
}
let copyRow: any
// table单击修改
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => { 
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
// 零件table blur事件
const clickCancel = async (event: any, value: any) => {
  
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
    await updateCustomsClearanceSku({
      id: value.id,
      brank: value.brank,
      manufacturerEn: value.manufacturerEn,
      manufacturerAddressEn: value.manufacturerAddressEn,
      clearanceNameEn: value.clearanceNameEn,
      clearanceNameZh: value.clearanceNameZh,
      materialEn: value.materialEn,
      materialZh: value.materialZh,
      usageEn: value.usageEn,
      usageZh: value.usageZh
    })
  }
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCustomsClearanceSkuList(queryForm)
  list.value = data!.list
  total.value = data!.total!
  listLoading.value = false
  list.value.forEach((item: any) => {
    item.sku = item.sku.replaceAll(',', '<br />')
    item.northAmericaFnSku = item.northAmericaFnSku.replaceAll(',', '<br />')
    item.upc = item.upc.replaceAll(',', '<br />')
    item.europeFnSku = item.europeFnSku.replaceAll(',', '<br />')
  })
}
const cellClassName = (data: {row: any, column: any, rowIndex: number, columnIndex: number}) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
})
</script>
  
<style lang="scss" scoped>
.none {
  display: none;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}

.custom-checkbox {
  transform: scale(1.4); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-left: 0;
  padding-right: 0;
}
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>
  