<template>
  <!-- 成本核算 -->
  <div style="flex-grow: 2; width: 100%; padding-top:15px;" >
  
    <el-divider style="margin: 10px 0"/>
    <!-- <div style=" margin-top: 20px; margin-bottom: 20px;font-size: large; font-weight: bold;">利润核算</div> -->
    <h3>利润核算</h3>
    <vab-query-form >
      <vab-query-form-left-panel>
        <el-button type="primary" @click="addRowCostAccounting">新增成本核算</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <vue-draggable
      v-model="estimatedCostList"
      :animation="150"
      :disabled="isDraggingDisabled"
      ghost-class="ghost"
      target="tbody"
      @end="onEnd"
    >
      <el-table 
        ref="costAccountingTable"
        border
        :cell-class-name="clearPadding"
        :cell-style="cellStyle" class="noneHoveTable"
        :data="estimatedCostList"
        :header-cell-style="{ textAlign: 'center' }" stripe @cell-click="costAccountingChangeInput"
      >
        <el-table-column label="日期" prop="createTime" width="125">
          <template #default="{ row }">
            <span>{{ row.createTime ? formatDate(new Date(row.createTime)) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="站点" width="180">
          <template #default="{ row }">
            <el-select v-model="row.site" placeholder="请选择站点" style="min-width: 100%;" @change="handlerSiteChange(row)" @focus="handleFocus(row)">
              <el-option v-for="dict in props.siteList" :key="dict.id" :label="dict.label" :value="dict.id"/>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="外汇币种" prop="currencyType" width="95"/>
        <el-table-column label="汇率" prop="foreignExchange" width="80"/>
        <el-table-column label="图片" width="76">
          <template #default="{ row }">
            <div class="image-cell">
              <!-- 有图片时显示 -->
              <div v-if="row.imgUrl" class="image-preview">
                <img alt="" :src="row.imgUrl" />
                <div class="image-actions">
                  <el-icon @click="showImagePreview(row.imgUrl)"><zoom-in /></el-icon>
                  <el-icon @click="removeImage(row)"><delete /></el-icon>
                </div>
              </div>
              <!-- 无图片时显示 -->
              <div v-else class="upload-placeholder" @click="showUploadDialog(row)">
                <el-icon><plus /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="产品描述" prop="desc" width="200">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.desc) }}</div>
              </template>
              <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.desc) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="价格信息" prop="priceInfo" width="160">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.priceInfo) }}</div>
              </template>
              <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.priceInfo) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="产品价格￥" width="185">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.price" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '产品价格m', 'price', 0), 'text-align': 'right' }">
              {{ row.price != null ? '￥' + row.price : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="长(cm)" width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.length" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '长(cm', 'length', 0), 'text-align': 'right' }">
              {{ row.length != null ? row.length : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column  label="宽(cm)" width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.width" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '宽(cm', 'width', 0), 'text-align': 'right' }">
              {{ row.width != null ? row.width : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column  label="高(cm)" width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.height" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '高(cm', 'height', 0), 'text-align': 'right' }">
              {{ row.height != null ? row.height : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="重量(g)" width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.weight" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '重量(g', 'weight', 0), 'text-align': 'right' }">
              {{ row.weight != null ? row.weight : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="尾程" prop="lastMile" width="80">
          <template #default="{ row }">
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '尾程', 'lastMile', 0), 'text-align': 'right' }">
              {{ row.lastMile != null ? row.symbol + row.lastMile : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="头程￥" prop="firstMile" width="80">
          <template #default="{ row }">
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '头程', 'firstMile', 0), 'text-align': 'right' }">
              {{ row.firstMile != null ? '￥' + row.firstMile : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="打包￥" width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.packaging" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '打包', 'packaging', 0), 'text-align': 'right' }">
              {{ row.packaging != null ? '￥' + row.packaging : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="头程渠道" width="160">
          <template #default="{ row }">
            <el-select 
              v-model="row.firstMileChannel" 
              filterable
              placeholder="请选择头程渠道"
              style="min-width: 100%;"
              @change="handlerEstimatendChange(row)"
            >
              <el-option v-for="dict in props.channelList" :key="dict.id" :label="dict.label" :value="dict.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="售价" width="100">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.sellingPrice" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '$售价', 'sellingPrice', 0), 'text-align': 'right' }">
              {{ row.sellingPrice != null ? row.symbol + row.sellingPrice : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="毛利率" prop="grossMarginRate" width="100">
          <template #default="{ row }">
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '毛利m', 'grossMarginRate', 0), 'text-align': 'right' }">
              <el-text v-if="row.grossMarginRate >= 30" type="success">{{ row.grossMarginRate + '%' }}</el-text>
              <el-text v-if="row.grossMarginRate >= 25 && row.grossMarginRate < 30" type="primary">{{ row.grossMarginRate + '%' }}</el-text>
              <el-text v-if="row.grossMarginRate >= 20 && row.grossMarginRate < 25" type="warning">{{ row.grossMarginRate + '%' }}</el-text>
              <el-text v-if="row.grossMarginRate < 20" type="danger">{{ row.grossMarginRate != null ? row.grossMarginRate + '%' : '' }}</el-text>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="ROI" prop="roi" width="80">
          <template #default="{ row }">
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, 'ROI%', 'roi', 0), 'text-align': 'right' }">
              {{ row.roi != null && row.roi != '' ? row.roi + '%' : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="重量系数" width="100">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.weightCoefficient" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '重量系6', 'weightCoefficient', 0), 'text-align': 'right' }">
              {{ row.weightCoefficient }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="体积系数" width="100">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.volumeCoefficient" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '体积系6', 'volumeCoefficient', 0), 'text-align': 'right' }">
              {{ row.volumeCoefficient }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="关税%" width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.tariff" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '关税%', 'tariff', 0), 'text-align': 'right' }">
              {{ row.tariff ? row.tariff + '%' : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="关税" width="80">
          <template #default="{ row }">
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '关税', 'tariffPrice', 0), 'text-align': 'right' }">
              {{ row.tariffPrice ? '￥' + row.tariffPrice : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="平台佣金" prop="platformCommission" width="100">
          <template #default="{ row }">
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '平台佣6', 'other', 0), 'text-align': 'right' }">
              {{ row.platformCommission != null ? row.symbol + row.platformCommission.toFixed(2) : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="仓储费2个月" min-width="140" prop="storageFee">
          <template #default="{ row }">
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(estimatedCostList, '仓储费个月', 'other', 0), 'text-align': 'right' }">
              {{ row.storageFee != null ? row.symbol + row.storageFee.toFixed(2) : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="120">
          <template #default="{ row }">
            <el-dropdown>
              <el-button text type="primary" @click="handleReverseCalculate(row)">
                逆算
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleReverseCalculate(row)"> 
                    <el-link type="primary" :underline="false">逆算</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="costAccountCopy(row)">
                    <el-link type="primary" :underline="false" >复制</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="costAccountDelete(row)">
                    <el-link type="danger" :underline="false" >删除</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </vue-draggable>

    <!-- 产品描述显示 -->
    <wang-editor 
      :classify='classify' 
      :content="progressLogCopy" 
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorLogVisible" 
      @click-boolean="clickLogBool" 
      @click-child="clickLog" 
    />
    <!-- 价格信息显示 -->
    <wang-editor 
      :classify='classify' 
      :content="remarkCopy" 
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorRemarkVisible" 
      @click-boolean="clickRemarkBool" 
      @click-child="clickRemark" 
    />
    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { TableRefs } from 'element-plus'
import { debounce, isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import wangEditor from '../newProductProgress/wangEditor.vue'
import {
  addCostAccounting,
  costAccountingCopy,
  costAccountingDelete,
  costAccountingDeleteImage,
  costAccountingUpdate,
  costAccountingUpdateRowSort,
  costAccountingUploadImage,
  getCostAccountingList,
  getProgressPriceInfo,
  getProgressProductDesc,
  reverseCalculateProgress,
  updateProgressPriceInfo,
  updateProgressProductdesc
} from '/@/api/devlocal/progressSample'
import type { IProgressEstimatedCostAccounting } from '/@/type/progress/sampleAndComponentType'
import { formatDate } from '/@/utils/dateUtils'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'

const isDraggingDisabled = ref<boolean>(false)

const props = defineProps<{
  progressId: string
  siteList: { id: number, label: string }[]
  channelList: { id: number, label: string }[]
}>();

defineComponent({
  name:"VabCostAccounting"
})

const emit = defineEmits<{ 
  (e: 'update:imagePreviewVisible', value: boolean): void
  (e: 'update:previewListValue', value: string): void
}>()

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
// 点击备注弹出富文本框是否显示
const wangEditorRemarkVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const remarkCopy = ref<string | undefined>('')
const classify = ref<string>('')
const clickRow = ref<any>()
let copyRow: any
const imageUploadVisible = ref<boolean>(false)
// 打开上传图片弹窗
const showUploadDialog = (row: any) => {
  imageUploadVisible.value = true
  copyRow = row
}
/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {  
  clickRow.value.desc = val
  progressLogCopy.value = val
  await updateProgressProductdesc({
    accountingId: parseInt(clickRow.value.id),
    productDesc: clickRow.value.desc!
  }) 
}
const clickRemark = async (val: any) => {
  clickRow.value.priceInfo = val
  remarkCopy.value = val
  await updateProgressPriceInfo({
    accountingId: parseInt(clickRow.value.id),
    priceInfo: clickRow.value.priceInfo!
  }) 
}

/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = ( val: any) => {
  wangEditorLogVisible.value = val
}
const clickRemarkBool = ( val: any) => {
  wangEditorRemarkVisible.value = val
}
// 成本核算列表
const estimatedCostList = ref<IProgressEstimatedCostAccounting[]>([])
const costAccountingTable = ref<TableRefs>()
const _site = ref<number>(0)
const handleFocus = (row: any) => {
  _site.value = row.site
}
const isValueAllInput = (row: IProgressEstimatedCostAccounting) => {
  if (row.site == null) { 
    $baseMessage('站点不能为空，请选择后再进行逆算', 'warning')
    return false
  } else if (row.price == null) {
    $baseMessage('产品价格不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.length == null) {
    $baseMessage('产品的长度(cm)不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.width == null) {
    $baseMessage('产品的宽度(cm)不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.height == null) {
    $baseMessage('产品的高度(cm)不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.weight == null) {
    $baseMessage('产品的重量(g)不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.packaging == null) {
    $baseMessage('产品的打包价格不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.firstMileChannel == null) {
    $baseMessage('产品的头程渠道不能为空，请选择后再进行逆算', 'warning')
    return false
  } else if (row.weightCoefficient == null) {
    $baseMessage('产品的重量系数不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.volumeCoefficient == null) {
    $baseMessage('产品的体积系数不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (row.tariff == null) {
    $baseMessage('产品的关税不能为空，请填写后再进行逆算', 'warning')
    return false
  }
  return true
}
const handleReverseCalculate = async (row: IProgressEstimatedCostAccounting) => {
  const isInputAll = isValueAllInput(row)
  if (isInputAll) {
    const { data } = await reverseCalculateProgress({ id: Number(row.id) })
    if (data) {
      $baseMessage('逆算成功!', 'success')
      fetchDataCostAccounting()
    }
  }
}
// 输入input blur事件
const clickCancel = async (event:any, value: IProgressEstimatedCostAccounting) => {

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
  isDraggingDisabled.value = false
  await costAccountingUpdate({ ...value, tariff: `${parseFloat(value.tariff!) / 100}`, grossMarginRate: `${parseFloat(value.grossMarginRate!) / 100}`, roi: `${Number(value.roi) / 100}` })
  fetchDataCostAccounting()
}

// 鼠标enter事件
const effectiveCountInputHandle = (event: Event) => {
  const targetElement = event.target as HTMLInputElement
  targetElement.blur()
  isDraggingDisabled.value = false
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['日期', '外汇币种', '汇率', '尾程', '头程￥', 'ROI', '平台佣金', '毛利率', '仓储费2个月'].includes(label)) {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign:'center'
    }
  } else if (['产品描述', '价格信息'].includes(label)) {
    return {
      textAlign: 'left',
      cursor: 'pointer'
    }
  } else {
    return {
      textAlign: 'center',
      cursor: 'pointer'
    }
  }
}

const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): string => {
  if (data.columnIndex === 4) {
    return 'clear-padding'
  }
  return ''
}
const showImagePreview = (url: string) => {
  emit("update:previewListValue", url)
  emit("update:imagePreviewVisible", true)
}
// 成本核算单击表格修改
const costAccountingChangeInput = async (row: any, column: any, cell: HTMLTableCellElement) => { 
  if (column.property === 'desc') {
    const { data } = await getProgressProductDesc({ accountingId: row.id })
    progressLogCopy.value = data
    row.desc = data
    wangEditorTitle.value = '编辑产品描述'
    classify.value = 'desc'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  } else if (column.property === 'priceInfo'){
    const { data } = await getProgressPriceInfo({ accountingId: row.id })
    remarkCopy.value = data
    row.priceInfo = data
    wangEditorTitle.value = '编辑价格信息'
    classify.value = 'priceInfo'
    wangEditorRemarkVisible.value = !wangEditorRemarkVisible.value
  } 

  clickRow.value = row
  
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

// 进度成本核算修改站点
const handlerSiteChange = async (row: IProgressEstimatedCostAccounting) => {
  try {
    await costAccountingUpdate({ ...row, tariff: `${parseFloat(row.tariff!) / 100}`, grossMarginRate: `${parseFloat(row.grossMarginRate!) / 100}`, roi: `${parseFloat(row.roi!) / 100}` })
    fetchDataCostAccounting()
  } catch {
    row.site = _site.value
  }
}


// 内容拖拽排序
const onEnd = debounce(async () => {
  try {
    const idList = estimatedCostList.value.map((item: IProgressEstimatedCostAccounting) => {
      return item.id
    })
    await costAccountingUpdateRowSort(idList)
  } catch(error){
    console.error(error as Error)
  }
}, 1000)


// 获取成本核算数据列表
const fetchDataCostAccounting = async ()=>{
  try {
    // 成本核算列表
    const {data} = await getCostAccountingList({ progressId: props.progressId })
    estimatedCostList.value = data
  } catch(error) {
    console.error(error)
  }
}
const uploadImage = async (file: File) => {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file)
    uploadImgForm.append('accountingId', copyRow.id)

    const { data } = await costAccountingUploadImage(uploadImgForm)
    if (data) {
      copyRow.imgUrl = data
      $baseMessage('零件图片上传成功！', 'success')
      imageUploadVisible.value = false
    } else {
      $baseMessage('零件图片上传失败！', 'error')
    }
  } catch (error) {
    console.error(error)
  }
}
const removeImage = (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
      const { data } = await costAccountingDeleteImage({
        id: row.id
      })
      if (data) {
        row.imgUrl = ''
        $baseMessage("图片删除成功!","success","hey")
      }
    })
  } catch (error) {
    console.error(error)
  }
}

// 头程渠道修改
const handlerEstimatendChange = async (row: IProgressEstimatedCostAccounting) =>{
  await costAccountingUpdate({ ...row, tariff: `${parseFloat(row.tariff!) / 100}`, grossMarginRate: `${parseFloat(row.grossMarginRate!) / 100}`, roi: `${parseFloat(row.roi!)/ 100}` })
  fetchDataCostAccounting()
}

// 新增
const addRowCostAccounting = async () =>{
  let newData: IProgressEstimatedCostAccounting = {
    id: '',
    evaluationId: '',
    createTime: formatDate(new Date()),
    site: 0,
    currencyType: '',
    foreignExchange: '',
    imgUrl: '',
    desc: '',
    priceInfo: '',
    url1688: '',
    price: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    packaging: '',
    firstMileChannel: '0',
    sellingPrice: '',
    weightCoefficient: '1.06',
    volumeCoefficient: '1.26',
    tariff: '15',
    lastMile: '',
    firstMile: '',
    grossMarginRate: '',
    roi: '',
    platformCommission: '',
    storageFee: ''
  }
 
  const formdata = new FormData()
  formdata.append('progressId', `${props.progressId}`)
  formdata.append('sort', convertString(estimatedCostList.value.length + 1))
  
  // 成本核算进度id
  const {data} = await addCostAccounting(formdata)
  newData.id = convertString(data!)

  if (data){
    // 获取汇率
    // const {data} = await getExchangeRate({currency: siteReflectCurrencyAndExchangeRate.get(newData.site!)})
    // newData.foreignExchange = data

    $baseMessage("产品成本核算添加成功！","success","hey")
    estimatedCostList.value.push(newData)
    fetchDataCostAccounting()
    // 自动滚动到最新的添加行
    nextTick(() => {
      autoScrollButtom()
    })
  }
}

// 复制
const costAccountCopy = async(row:IProgressEstimatedCostAccounting) =>{
  const {data} = await costAccountingCopy({accountingId: `${row.id  }`, progressId: props.progressId})
  if (data == true){
    $baseMessage("此条产品成本核算信息复制成功!","success","hey")
    fetchDataCostAccounting()
    autoScrollButtom()
  }
}

// 自动滚动
const autoScrollButtom = () => {
  nextTick(()=>{
    if (costAccountingTable.value) {
      const $bodyWrapper = costAccountingTable.value.$el.querySelector(".el-table__body");
      if ($bodyWrapper) {
        costAccountingTable.value.setScrollTop($bodyWrapper.scrollHeight);
      }
    }
  })
}

// 删除
const costAccountDelete = async(row:IProgressEstimatedCostAccounting) =>{
  $baseConfirm('您确定要删除产品成本信息吗', null, async () => {
    const {data} = await costAccountingDelete({ accountingId:row.id! })
    if (data == true){
      const index = estimatedCostList.value.findIndex((item:IProgressEstimatedCostAccounting) => item.id === row.id);
      if (index !== -1) {
        estimatedCostList.value.splice(index, 1);
      }
      $baseMessage("此条产品成本信息删除成功!", "success", "hey")
    }
  })
}

// 监听数据变化
watch(estimatedCostList, () => {
  autoScrollButtom();
}, { deep: true });

// 暴露给父组件
defineExpose({
  autoScrollButtom,
  estimatedCostList,
  fetchDataCostAccounting
})

onMounted(()=>{
  fetchDataCostAccounting()
})

</script>

<style lang="scss" scoped>
.none {
  display: none !important;
}

.block {
  display: block;
}

:deep(.left-panel) {
    margin-bottom: 0 !important;
}
// 设置行高
// :deep(.el-table .el-table__body .cell) {
//   max-height: 50px;
// }
.noneHoveTable {
  :deep() {
    .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell {
      background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
    }
    .el-table__body tr.el-table__row--striped > td.el-table__cell {
      background-color: #fafafa !important; /* 保持原有条纹颜色 */
    }
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;
      .cell {
        padding-right: 0;
        padding-left: 0;
      }
    }
  }
}
// /* 取消没有条纹的行的悬停背景色 */
// :deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
//   background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
// }

// /* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
// :deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
//   background-color: #fafafa !important; /* 保持原有条纹颜色 */
// }
.custom-tooltip {
  max-width: 400px; 
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
}
// 图片样式
.image-cell {
  width: 100%;
  height: 75px;
  
  // 有图片时的样式
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;
    
    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: fill;
    }
    
    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s ease;
      
      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;
        
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    
    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45);  // 悬停时的背景色
      opacity: 1;  // 悬停时完全显示
    }
  }
  // 没图片时的样式
  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    
    &:hover {
      border-color: var(--el-color-primary);
      .el-icon {
        color: var(--el-color-primary);
      }
    }
    
    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
}
</style>