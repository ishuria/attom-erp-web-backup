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
          <el-image fit="fill" :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px;" @click="showImagePreview(row.skuImgUrl)">
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
      <el-table-column label="日本FNSKU" prop="jpFnSku" :width="calculateBrColumnWidth(list, (row: any)=>row.jpFnSku, 90)" >
        <template #default="{ row }">
          <div v-html="row.jpFnSku"></div>
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
      <el-table-column label="HTS美国" prop="htsUs" width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.us"
            filterable
            placeholder="请选择HTS美国"
            @change="handleChangeHtsUsa(row)"
          >
            <el-option
              v-for="item in usaList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="HTS英国" prop="htsEurope" width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.uk"
            filterable
            placeholder="请选择HTS英国"
            @change="handleChangeHtsUk(row)"
          >
            <el-option
              v-for="item in ukHtsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="HTS德国" prop="htsEurope" width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.de"
            filterable
            placeholder="请选择HTS德国"
            @change="handleChangeHtsDe(row)"
          >
            <el-option
              v-for="item in deHtsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="HTS加拿大" prop="htsEurope" width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.ca"
            filterable
            placeholder="请选择HTS加拿大"
            @change="handleChangeHtsCa(row)"
          >
            <el-option
              v-for="item in caHtsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="HTS日本" prop="htsEurope" width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.jp"
            filterable
            placeholder="请选择HTS日本"
            @change="handleChangeHtsJp(row)"
          >
            <el-option
              v-for="item in jpHtsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>

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
            <el-text style="vertical-align: middle;" truncated>{{ row.manufacturerEn }}</el-text>
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
            <el-text style="vertical-align: middle;" truncated>{{ row.manufacturerAddressEn }}</el-text>
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
import { getCustomsClearanceRatio, getCustomsClearanceSkuList, getHtsUkList, getHtsSelectList, updateCustomsClearanceRatio, updateCustomsClearanceSku, updateCustomsClearanceSkuHts } from '/@/api/devlocal/productInformation'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'SkuDeclaration',
})

const router = useRouter()
const route = useRoute()
const ukHtsList = ref<{ id: number, label: string }[]>([])
const deHtsList = ref<{ id: number, label: string }[]>([])
const caHtsList = ref<{ id: number, label: string }[]>([])
const jpHtsList = ref<{ id: number, label: string }[]>([])
const usaList = ref<{ id: number, label: string }[]>([])
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

const handleChangeHtsUsa = async (row: any) => {
  await updateCustomsClearanceSkuHts({
    id: row.id,
    htsId: row.htsUs,
    type: 0
  })
}
const handleChangeHtsUk = async (row: any) => {
  await updateCustomsClearanceSkuHts({
    id: row.id,
    htsId: row.htsEurope,
    type: 1
  })
}

const handleChangeHtsDe = async (row: any) => {

}

const handleChangeHtsCa = async (row: any) => {

}

const handleChangeHtsJp = async (row: any) => {

}


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
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
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
    try {
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
    } catch {
      Object.assign(value, copyRow)
    }
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
// 获取HTS欧洲列表
const fetchHtsUkList = async () => {
  const { data } = await getHtsSelectList({country:"英国"})
  ukHtsList.value = data
}
// 获取HTS美国列表
const fetchHtsUsaList = async () => {
  const { data } = await getHtsSelectList({country:"美国"})
  usaList.value = data
}
const fetchHtsDeList = async () => {
  const { data } = await getHtsSelectList({country:"德国"})
  deHtsList.value = data
}
const fetchHtsCaList = async () => {
  const { data } = await getHtsSelectList({country:"加拿大"})
  caHtsList.value = data
}
const fetchHtsJpList = async () => {
  const { data } = await getHtsSelectList({country:"日本"})
  jpHtsList.value = data
}
onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) queryForm.pageNo = Number(pageNo)
  if (pageSize) queryForm.pageSize = Number(pageSize)
  fetchHtsUkList()
  fetchHtsUsaList()
  fetchHtsDeList()
  fetchHtsCaList()
  fetchHtsJpList()
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
  padding-right: 0;
  padding-left: 0;
}
.custom-tooltip {
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}
</style>
