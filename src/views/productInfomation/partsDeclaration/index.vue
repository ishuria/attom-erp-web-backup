<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button :loading="status1Loading" type="primary" @click="handleStatus1Change">
          {{ queryForm.status1 === 0 ? '展示停产' : '隐藏停产' }}
        </el-button>
        <el-button :loading="status2Loading" type="primary" @click="handleStatus2Change">
          {{ queryForm.status2 === 0 ? '展示不报关' : '隐藏不报关' }}
        </el-button>
        <el-button
          v-permissions="{ permission: [SkuPermission.CUSTOM_DECLARE_RATIO_QUERY] }"
          type="primary"
          @click="showPriceCoefficientSetting"
        >
          价格系数设定
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              class="search-input"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      @cell-click="changeInput"
      @row-click="handleRowClick"
    >
      <el-table-column fixed="left" label="图片" prop="componentImgUrl" width="75">
        <template #default="{ row }">
          <el-image
            fit="fill"
            :src="row.componentImgUrl"
            style="display: block; width: 75px; height: 75px"
            @click="showImagePreview(row.componentImgUrl)"
          >
            <template #error>
              <div class="image-slot">
                <el-icon />
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="零件名" prop="componentName" :width="flexColumnWidth(list, '零件名', 'componentName')" />
      <el-table-column fixed="left" label="已有零件id" prop="componentId" :width="flexColumnWidth(list, '已有零件id', 'componentId')" />
      <el-table-column fixed="left" label="供应商" prop="suppliser" :width="flexColumnWidth(list, '供应商', 'suppliser')" />
      <el-table-column label="属于SKU" prop="sku" :width="calculateBrColumnWidth(list, (row: any) => row.sku, 80, 27)">
        <template #default="{ row }">
          <div v-html="row.sku"></div>
        </template>
      </el-table-column>

      <el-table-column label="UPC" prop="upc" :width="calculateBrColumnWidth(list, (row: any) => row.upc, 40)">
        <template #default="{ row }">
          <div v-html="row.upc"></div>
        </template>
      </el-table-column>
      <el-table-column
        label="北美FNSKU"
        prop="northAmericaFnSku"
        :width="calculateBrColumnWidth(list, (row: any) => row.northAmericaFnSku, 90)"
      >
        <template #default="{ row }">
          <div v-html="row.northAmericaFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="欧洲FNSKU" prop="europeFnSku" :width="calculateBrColumnWidth(list, (row: any) => row.europeFnSku, 90)">
        <template #default="{ row }">
          <div v-html="row.europeFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="不报关" min-width="80" prop="customsDeclarationStatus">
        <template #default="{ row }">
          <el-checkbox
            v-model="row.customsDeclarationStatus"
            class="custom-checkbox"
            :false-value="0"
            :true-value="1"
            @change="handleChangeCustomsStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="货源地" min-width="120" prop="placeOrigin">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.placeOrigin" @blur="clickCancel2($event, row)" @keypress.enter="clickCancel2($event, row)" />
          </div>
          <span>{{ row.placeOrigin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中国报关品名" min-width="140" prop="customsDeclarationNameZh">
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model.trim="row.customsDeclarationNameZh"
              @blur="clickCancel2($event, row)"
              @keypress.enter="clickCancel2($event, row)"
            />
          </div>
          <span>{{ row.customsDeclarationNameZh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="每零件单位有多少个开票单位" min-width="140" prop="count">
        <template #header>
          每零件单位有
          <br />
          多少个开票单位
        </template>
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.count"
              min="0"
              placeholder="请输入正数"
              step="0.01"
              type="number"
              @blur="clickCancel2($event, row)"
              @keypress.enter="clickCancel2($event, row)"
            />
          </div>
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票单位" min-width="90" prop="unit">
        <template #header>
          开票
          <br />
          单位
        </template>
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.unit"
              placeholder="请输入文字，不能为纯数字"
              @blur="clickCancel2($event, row)"
              @keypress.enter="clickCancel2($event, row)"
            />
          </div>
          <span>{{ row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报关重量使用开票重量" min-width="140" prop="bgWeightStatus">
        <template #header>
          报关重量使用
          <br />
          开票重量
        </template>
        <template #default="{ row }">
          <el-select style="min-width: 100%" @change="handleCustomsChange(row)">
            <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="开票型号" min-width="100" prop="type">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.type" @blur="clickCancel2($event, row)" @keypress.enter="clickCancel2($event, row)" />
          </div>
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="法定第1单位" min-width="90" prop="statutoryUnit">
        <template #header>
          法定第
          <br />
          1单位
        </template>
        <!-- <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.statutoryUnit" @blur="clickCancel2($event, row)" @keypress.enter="clickCancel2($event, row)" />
          </div>
          <span>{{ row.statutoryUnit }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="每零件单位有多少个法定第1单位" min-width="160" prop="statutoryCount">
        <template #header>
          每零件单位有多少
          <br />
          个法定第1单位
        </template>
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.statutoryCount" @blur="clickCancel2($event, row)" @keypress.enter="clickCancel2($event, row)" />
          </div>
          <span>{{ row.statutoryCount }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="" min-width="100" prop="coveredWeightStatus" >
        <template #header>
          报关覆盖<br>实际净重
        </template>
        <template #default="{ row }">
          <el-checkbox v-model="row.coveredWeightStatus" class="custom-checkbox" :false-value="0" :true-value="1" @change="handleWeightStatusChange(row)"/>
        </template>
      </el-table-column> -->
      <el-table-column label="品牌" prop="brank" :width="flexColumnWidth(list, '品牌', 'brank', 30)">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.brank" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.brank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="HS" min-width="180" prop="hsId">
        <template #default="{ row }">
          <div class="hs-select-container">
            <el-select v-model="row.hsId" filterable placeholder="请选择HS" @change="handleCustomsChange(row)">
              <el-option v-for="item in hsOption" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
            <el-button
              v-if="row.hsId"
              circle
              class="copy-btn"
              :icon="CopyDocument"
              size="small"
              type="primary"
              @click="handleClip(getHsName(row.hsId))"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="出口退税税率" min-width="90" prop="taxRate">
        <template #header>
          出口退
          <br />
          税税率
        </template>
        <template #default="{ row }">
          {{ row.taxRate != null ? row.taxRate + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="申报要素" min-width="200" prop="declarationElements">
        <template #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.declarationElements }}</div>
            </template>
            <div class="multi-line-ellipsis">{{ row.declarationElements }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="申报要素缩写" min-width="230" prop="declarationElementsAbbreviation">
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.declarationElementsAbbreviation"
              type="textarea"
              @blur="clickCancel($event, row)"
              @keypress.enter="clickCancel($event, row)"
            />
          </div>
          <span>{{ row.declarationElementsAbbreviation }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="云舟采购合同品名" min-width="180" prop="contractName">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.contractName" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.contractName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="云舟采购价格系数" min-width="100" prop="ratio">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.ratio" clearable @blur="clickRatioCancel($event, row)" @keyup.enter="clickRatioCancel($event, row)" />
          </div>
          <span>{{ row.ratio }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <vab-dialog v-model="priceCoefficientSettingVisible" title="价格系数设定" width="47em" @close="closePriceCoefficientSetting">
      <el-form :model="priceCoefficientSettingForm">
        <el-form-item>
          <el-text>
            云舟采购单价 = PO含税单价￥ × Random（
            <el-input
              v-model="priceCoefficientSettingForm.minProcurementCoefficient"
              clearable
              placeholder="随机最小价格系数"
              style="width: 10em"
            />
            &nbsp;
            <el-input
              v-model="priceCoefficientSettingForm.maxProcurementCoefficient"
              clearable
              placeholder="随机最大价格系数"
              style="width: 10em"
            />
            ）
          </el-text>
        </el-form-item>
        <el-form-item>
          <el-text>
            云舟销售单价 = ( PO未税单价￥ ×
            <el-input v-model="priceCoefficientSettingForm.salesCoefficient1" clearable placeholder="价格系数" style="width: 6em" />
            + 预估运费 ×
            <el-input v-model="priceCoefficientSettingForm.salesCoefficient2" clearable placeholder="价格系数" style="width: 6em" />
            ) / 当前汇率
          </el-text>
        </el-form-item>
        <el-form-item>
          <el-text>
            SKU清关单价 = PO未税单价￥ / 当前汇率 ×
            <el-input
              v-model="priceCoefficientSettingForm.customClearanceCoefficient"
              clearable
              placeholder="价格系数"
              style="width: 6em"
            />
          </el-text>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="danger" @click="closePriceCoefficientSetting">取消</el-button>
          <el-button :loading="confirmLoading" type="success" @click="confirmPriceCoefficientSetting">确定</el-button>
        </div>
      </template>
    </vab-dialog>
    <vab-remark-dialog v-model="remarkVisible" :remark="remark" title="修改申报要素" @update:remark="handleUpdateRemark" />
  </div>
</template>

<script lang="ts" setup>
import { CopyDocument, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import {
  getCustomsClearanceRatio,
  getHsSelectList,
  getProductCustomsList,
  updateCustomsClearanceRatio,
  updateProductAlreadyComponent,
  updateProductCustomsClearance,
  updateProductCustomsClearanceSuppliserInfo,
} from '/@/api/devlocal/productInformation'
import SkuPermission from '/@/permissions/sku'
import { handleClip } from '/@/utils/clipboard'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'PartsDeclaration',
})

const router = useRouter()
const route = useRoute()
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
const hsOption = ref<{ id: number; label: string }[]>([]) //搜索选项

const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  status1: 0, //隐藏停产0，展示停产1
  status2: 1, //隐藏不报关0，展示不报关1
  pageNo: 1,
  pageSize: 20,
})
const option = [
  {
    label: '否',
    value: 0,
  },
  {
    label: '是',
    value: 1,
  },
]
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
const confirmLoading = ref<boolean>(false)
// 确认价格系数
const confirmPriceCoefficientSetting = async () => {
  confirmLoading.value = true
  try {
    const { data } = await updateCustomsClearanceRatio({
      minProcurementCoefficient: priceCoefficientSettingForm.minProcurementCoefficient,
      maxProcurementCoefficient: priceCoefficientSettingForm.maxProcurementCoefficient,
      salesCoefficient1: priceCoefficientSettingForm.salesCoefficient1,
      salesCoefficient2: priceCoefficientSettingForm.salesCoefficient2,
      customClearanceCoefficient: priceCoefficientSettingForm.customClearanceCoefficient,
    })
    if (data) {
      $baseMessage('价格系数修改成功', 'success')
      closePriceCoefficientSetting()
    }
  } catch (error) {
    console.error('更新价格系数失败:', error)
  } finally {
    confirmLoading.value = false
  }
}
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
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
const status1Loading = ref<boolean>(false)
const status2Loading = ref<boolean>(false)
const handleStatus1Change = async () => {
  status1Loading.value = true
  queryForm.status1 === 0 ? (queryForm.status1 = 1) : (queryForm.status1 = 0)
  await fetchData()
  status1Loading.value = false
}
const handleStatus2Change = async () => {
  status2Loading.value = true
  queryForm.status2 === 0 ? (queryForm.status2 = 1) : (queryForm.status2 = 0)
  await fetchData()
  status2Loading.value = false
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label

  if (['零件名', '供应商', '属于SKU', 'UPC', '北美FNSKU', '欧洲FNSKU'].includes(label)) {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign: 'left',
    }
  } else if (label === '申报要素' || label === '申报要素缩写') {
    return {
      textAlign: 'left',
      cursor: 'pointer',
    }
  } else if (label === '出口退税税率' || label === '法定第1单位') {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign: 'center',
    }
  } else {
    return {
      textAlign: 'center',
      cursor: 'pointer',
    }
  }
}
const cellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
let copyRow: any
let _row: any
// table单击修改
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.label === '申报要素') {
    _row = row
    remarkVisible.value = true
    remark.value = row.declarationElements
    return
  }
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
// 零件供应商几列的blur事件
const clickCancel2 = async (event: Event, value: any) => {
  const rootElement = getRootElement(event.target, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 添加类型校验
    let hasValidationError = false

    // 校验 count 字段 - 必须为数字
    if (value.count !== undefined && value.count !== null && value.count !== '') {
      if (isNaN(Number(value.count)) || Number(value.count) <= 0) {
        $baseMessage('每零件单位数量必须为正数', 'error')
        hasValidationError = true
      }
    }

    // 校验 unit 字段 - 必须为文字（不能为空，不能为纯数字）
    if (value.unit !== undefined && value.unit !== null) {
      if (/^\d+$/.test(value.unit.trim())) {
        $baseMessage('开票单位不能为纯数字', 'error')
        hasValidationError = true
      }
    }

    // 如果有校验错误，恢复原值并返回
    if (hasValidationError) {
      Object.assign(value, copyRow)
      return
    }

    // 执行失去焦点处理逻辑
    try {
      await updateProductCustomsClearanceSuppliserInfo({
        id: value.cId,
        customsDeclarationStatus: value.customsDeclarationStatus,
        placeOrigin: value.placeOrigin,
        customsDeclarationNameZh: value.customsDeclarationNameZh,
        count: value.count,
        unit: value.unit,
        type: value.type,
        statutoryUnit: value.statutoryUnit,
        statutoryCount: value.statutoryCount,
        hsId: value.hsId,
        bgWeightStatus: value.bgWeightStatus,
      })
      // await fetchData()
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
const handleUpdateRemark = async (value: string) => {
  _row.declarationElementsAbbreviation = processDeclarationElements(value)
  // 执行失去焦点处理逻辑
  await updateProductCustomsClearance({
    id: _row.pId,
    declarationElements: value,
    declarationElementsAbbreviation: _row.declarationElementsAbbreviation,
  })
  // fetchData()
  _row.declarationElements = value
  remarkVisible.value = false
}
// 处理申报要素缩写
const processDeclarationElements = (declarationElements: string): string => {
  if (!declarationElements) {
    return ''
  }
  function extractText(element: string, startDelimiter: string, endDelimiter: string): string[] | null {
    const startIndex = element.indexOf(startDelimiter)
    if (startIndex === -1) {
      return null
    }
    const parts: string[] = element.split(startDelimiter)
    let extractedValues: string[] = []
    for (let i = 1; i < parts.length; i++) {
      const text = parts[i].split(endDelimiter)[0]
      extractedValues.push(text)
    }
    return extractedValues
  }

  const textReplacements: { [key: string]: string } = {
    无: '0',
    境内品牌: '1',
    境外贴牌: '3',
  }

  let extractedTexts: string[] | null = extractText(declarationElements, '【', '】')
  if (!extractedTexts) {
    extractedTexts = extractText(declarationElements, '[', ']')
  }

  if (!extractedTexts) {
    return ''
  }

  const builder = extractedTexts
    .map((text: string, index: number) => {
      const replacement = textReplacements[text]
      return replacement !== undefined && (index === 0 || !extractedTexts.slice(0, index).join('|').includes('|')) ? replacement : text
    })
    .join('|')

  return builder
}
// 后面几列table blur事件
const clickCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }

  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      await updateProductCustomsClearance({
        id: value.pId,
        brank: value.brank,
        declarationElements: value.declarationElements,
        declarationElementsAbbreviation: value.declarationElementsAbbreviation,
      })
      // await fetchData()
    } catch {
      Object.assign(value, copyRow)
    }
  }
}

// 云州采购价格系数
const clickRatioCancel = async (event: any, value: any) => {
  // 获取根元素，避免重复调用 getRootElement
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    // 更新 t1 和 t2 的 class
    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }

  // 只有在数据变化时才处理更新
  if (isEqual(value, copyRow)) {
    return // 数据没有变化，不执行更新
  }

  if (event.type === 'blur') {
    // 执行失去焦点时的处理逻辑
    try {
      await updateProductAlreadyComponent({
        id: value.componentId,
        ratio: value.ratio,
      })
    } catch {
      Object.assign(value, copyRow) // 恢复原始数据
    }
  }
}
const handleChangeCustomsStatus = async (row: any) => {
  await updateProductCustomsClearanceSuppliserInfo({
    id: row.cId,
    customsDeclarationStatus: row.customsDeclarationStatus,
    placeOrigin: row.placeOrigin,
    customsDeclarationNameZh: row.customsDeclarationNameZh,
    count: row.count,
    unit: row.unit,
    type: row.type,
    statutoryUnit: row.statutoryUnit,
    statutoryCount: row.statutoryCount,
    hsId: row.hsId,
    bgWeightStatus: row.bgWeightStatus,
  })
}
// 修改HS
const handleCustomsChange = async (row: any) => {
  const { data } = await updateProductCustomsClearance({
    id: row.pId,
    hsId: row.hsId,
    brank: row.brank,
    declarationElements: row.declarationElements,
    declarationElementsAbbreviation: row.declarationElementsAbbreviation,
  })
  if (data) {
    fetchData()
  }
}

// col合并方法
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  // 设置需要合并的列
  if (
    columnIndex !== 0 &&
    columnIndex !== 3 &&
    columnIndex !== 7 &&
    columnIndex !== 8 &&
    columnIndex !== 9 &&
    columnIndex !== 10 &&
    columnIndex !== 11 &&
    columnIndex !== 12 &&
    columnIndex !== 13 &&
    columnIndex !== 16
  ) {
    // 获取当前row的零件id
    const pId = row.pId
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].pId === pId) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].pId !== pId) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductCustomsList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
  list.value.forEach((item: any) => {
    item.sku = item.sku.replaceAll(',', '<br />')
    item.northAmericaFnSku = item.northAmericaFnSku.replaceAll(',', '<br />')
    item.upc = item.upc.replaceAll(',', '<br />')
    item.europeFnSku = item.europeFnSku.replaceAll(',', '<br />')
  })
  // list.value.sort((a: any, b: any) => {
  //   return b.pId - a.pId
  // })
}
let previous: any = null
let currentGroupIndex = 0 // 当前组索引

// const stripedRowClass = (_row: any) => {
//   const { row } = _row
//   const currentId = row.pId
//   // 检查当前行是否与上一行不同
//   if (currentId !== previous) {
//     previous = currentId
//     currentGroupIndex++
//   }
//   // 根据当前组索引设置条纹样式
//   return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : ''
// }
const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.pId
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.pId === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}
// 获取hs下拉列表
const fetchHsSelectList = async () => {
  const { data } = await getHsSelectList()
  hsOption.value = data
}
onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) queryForm.pageNo = Number(pageNo)
  if (pageSize) queryForm.pageSize = Number(pageSize)
  fetchHsSelectList()
  fetchData()
})

// 获取 HS 名称
const getHsName = (id: number | string) => {
  const found = hsOption.value.find((x) => Number(x.id) === Number(id))
  return found?.label || ''
}
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
// /* 取消没有条纹的行的悬停背景色 */
// :deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
//   background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
// }

// /* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
// :deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
//   background-color: #fafafa !important; /* 保持原有条纹颜色 */
// }
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
.el-table :deep(.select-row > td) {
  background-color: #7bddde !important;
}

.hs-select-container {
  display: flex;
  align-items: center;
  gap: 6px;
}

.copy-btn {
  margin-left: 4px;
}
// 搜索框宽度设置
.search-input {
  width: 300px !important;
}
</style>
