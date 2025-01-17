<template>
  <!-- 成本核算 -->
  <div style="width: 100%; padding-top:15px; flex-grow: 2" >
  
    <el-divider style="margin: 10px 0"/>
      
    <vab-query-form >
      <vab-query-form-left-panel>
        <el-button type="primary" @click="addRowCostAccounting">新增成本核算</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <VueDraggable
      v-model="estimatedCostList"
      :animation="150"
      ghostClass="ghost"
      target="tbody"
      @end="onEnd"
      :disabled="isDraggingDisabled"
    >
      <el-table 
        ref="costAccountingTable"
        :data="estimatedCostList"
        @cell-click="costAccountingChangeInput"
        border stripe
        class="noneHoveTable"
        :header-cell-style="{ 'text-align': 'center' }" :cell-style="cellStyle" :cell-class-name="clearPadding"
      >
        <el-table-column prop="createTime" label="日期" min-width="110">
          <template #default="{ row }">
            <span>{{ row.createTime ? formatDate(new Date(row.createTime)) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="站点" min-width="165">
          <template #default="{ row }">
            <el-select v-model="row.site" placeholder="请选择站点" @change="handlerSiteChange(row)" @focus="handleFocus(row)" style="min-width: 100%;">
              <el-option v-for="dict in props.siteList" :key="dict.id" :value="dict.id" :label="dict.label"></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="外汇币种" prop="currencyType" min-width="100"></el-table-column>
        <el-table-column label="汇率" prop="foreignExchange"></el-table-column>
        <el-table-column label="图片" width="60">
          <template #default="{ row }">
            <el-image style="width: 60px; height: 60px; display: block;" :src="row.imgUrl" @click="showImagePreview(row.imgUrl)" >
              <template #error><el-icon></el-icon></template>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="产品描述" min-width="250" prop="desc">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.desc) }}</div>
              </template>
              <el-text truncated>{{ removeHtmlTags(row.desc) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="价格信息" min-width="250" prop="priceInfo">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.priceInfo) }}</div>
              </template>
              <el-text truncated>{{ removeHtmlTags(row.priceInfo) }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="产品价格￥" min-width="120">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.price" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.price != null ? '￥' + row.price : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="长(cm)" min-width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.length" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.length != null ? row.length + 'cm' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column  label="宽(cm)" min-width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.width" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.width != null ? row.width + 'cm' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column  label="高(cm)" min-width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.height" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.height != null ? row.height + 'cm' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column  label="重量(g)">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.weight" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.weight != null ? row.weight + 'g' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="lastMile" label="尾程" >
          <template #default="{ row }">
            {{ row.lastMile != null ? row.symbol + row.lastMile : '' }}
          </template>
        </el-table-column>

        <el-table-column prop="firstMile" label="头程￥">
          <template #default="{ row }">
            {{ row.firstMile != null ? '￥' + row.firstMile : '' }}
          </template>
        </el-table-column>

        <el-table-column label="打包￥">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.packaging" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.packaging != null ? '￥' + row.packaging : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头程渠道" min-width="140">
          <template #default="{ row }">
            <el-select 
              v-model="row.firstMileChannel" 
              placeholder="请选择头程渠道"
              @change="handlerEstimatendChange(row)"
              style="min-width: 100%;"
            >
              <el-option v-for="dict in props.channelList" :key="dict.id" :value="dict.id" :label="dict.label" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="售价">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.sellingPrice" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.sellingPrice != null ? row.symbol + row.sellingPrice : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="grossMarginRate" label="毛利率" >
          <template #default="{ row }">
            <el-text v-if="row.grossMarginRate >= 30" type="success">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 25 && row.grossMarginRate < 30" type="primary">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 20 && row.grossMarginRate < 25" type="warning">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate < 20" type="danger">{{ row.grossMarginRate != null ? row.grossMarginRate + '%' : '' }}</el-text>
          </template>
        </el-table-column>

        <el-table-column label="ROI" prop="roi" min-width="90">
          <template #default="{ row }">
            {{ row.roi != null ? row.roi + '%' : '' }}
          </template>
        </el-table-column>

        <el-table-column label="重量系数" min-width="100">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.weightCoefficient" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.weightCoefficient }}</span>
          </template>
        </el-table-column>

        <el-table-column label="体积系数" min-width="100">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.volumeCoefficient" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.volumeCoefficient }}</span>
          </template>
        </el-table-column>

        <el-table-column label="关税%">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.tariff" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.tariff ? row.tariff + '%' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="platformCommission" label="平台佣金" min-width="100">
          <template #default="{ row }">
            {{ row.platformCommission != null ? row.symbol + row.platformCommission.toFixed(2) : '' }}
          </template>
        </el-table-column>

        <el-table-column prop="storageFee" label="仓储费2个月" min-width="140">
          <template #default="{ row }">
            {{ row.storageFee != null ? row.symbol + row.storageFee.toFixed(2) : '' }}
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="120px">
          <template #default="{ row, $index }">
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
                  <el-dropdown-item @click="costAccountImageUpload(row, $index)">
                    <el-link type="primary" :underline="false" >上传图片</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="costAccountCopy(row)">
                    <el-link type="primary" :underline="false" >复制</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="costAccountDelete(row)">
                    <el-link type="primary" :underline="false" >删除</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </VueDraggable>

    <vab-upload 
      :upload-visible="costAccoutingVisible" 
      title="上传图片" 
      :is-multiple="false"
      :fileListFlag = "false"
      :dataId = "dataId"
      @update:uploadVisible = "costAccountingUpdateUploadPicVisible"
      :upload-file="costAccountingUploadImageFile"
    />
    <!-- 产品描述显示 -->
    <wangEditor 
      :wangEditorVisible="wangEditorLogVisible" 
      :title="wangEditorTitle" 
      :content="progressLogCopy"
      :classify='classify' 
      @clickBoolean="clickLogBool" 
      @clickChild="clickLog" 
    />
    <!-- 价格信息显示 -->
    <wangEditor 
      :wangEditorVisible="wangEditorRemarkVisible" 
      :title="wangEditorTitle" 
      :content="remarkCopy"
      :classify='classify' 
      @clickBoolean="clickRemarkBool" 
      @clickChild="clickRemark" 
    />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { TableRefs, UploadRequestOptions } from 'element-plus'
import { isEqual } from 'lodash'
import debounce from 'lodash/debounce'
import { type SortableEvent, VueDraggable } from 'vue-draggable-plus'

import wangEditor from '../newProductProgress/wangEditor.vue'

import {
  addCostAccounting,
  costAccountingCopy,
  costAccountingDelete,
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
import { IProgressEstimatedCostAccounting } from '/@/type/progress/sampleAndComponentType'
import { formatDate } from '/@/utils/dateUtils'
import { focusAndSelectInput, getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'
import { removeHtmlTags } from '/@/utils/tableColum'
import { CSSProperties } from 'vue'

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
// 图片上传显示控制vesiblae
const costAccoutingVisible = ref<boolean>(false)
// 图片唯一id
const dataId = ref<string>("")
const costAccountingTable = ref<TableRefs>()
let imageUploadCellIdx = 0
const _site = ref<number>(0)
const handleFocus = (row: any) => {
  _site.value = row.site
}
const isValueAllInput = (row: IProgressEstimatedCostAccounting) => {
  if (row.site == null) { 
    $baseMessage('站点不能为空，请选择后再进行逆算', 'warning')
    return false
  } else if (!row.desc?.trim()) { 
    $baseMessage('产品描述不能为空，请填写后再进行逆算', 'warning')
    return false
  } else if (!row.priceInfo?.trim()) {
    $baseMessage('价格信息不能为空，请填写后再进行逆算', 'warning')
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
  } else if (row.sellingPrice == null) {
    $baseMessage('产品的售价不能为空，请填写后再进行逆算', 'warning')
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
const effectiveCountInputHandle = (event: Event,row:any) => {
  const targetElement = event.target as HTMLInputElement
  targetElement.blur()
  isDraggingDisabled.value = false
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 0 || index === 2 || index === 3 || index === 12 || index === 17 || index === 23 || index === 24) {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign:'center'
    }
  } else if (index === 5 || index === 6) {
    return {
      textAlign: 'left'
    }
  } else {
    return {
      textAlign:'center'
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
let copyRow: any
// 成本核算单击表格修改
const costAccountingChangeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
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
    const { data } = await costAccountingUpdate({ ...row, tariff: `${parseFloat(row.tariff!) / 100}`, grossMarginRate: `${parseFloat(row.grossMarginRate!) / 100}`, roi: `${parseFloat(row.roi!) / 100}` })
    fetchDataCostAccounting()
  } catch (error) {
    row.site = _site.value
  }
}


// 内容拖拽排序
const onEnd = debounce(async (e: SortableEvent ) => {
  try {
    const idList = estimatedCostList.value.map((item: IProgressEstimatedCostAccounting) => {
      return item.id
    })
    await costAccountingUpdateRowSort(idList)
  } catch(e){
    console.error(e as Error)
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

// 图片上传按钮
const costAccountImageUpload =  async (row:IProgressEstimatedCostAccounting,idx:number) =>{
  costAccoutingVisible.value = true
  dataId.value = row.id + ""
  imageUploadCellIdx = idx
}

// 上传文件
const costAccountingUploadImageFile = async (options: UploadRequestOptions) => {
  const formdata = new FormData()
  formdata.append('file', options.file)
  formdata.append('accountingId', dataId.value)

  try{
    const {data} = await costAccountingUploadImage(formdata);
    if (data) {
      $baseMessage("零件图片上传成功！","success","hey")
      estimatedCostList.value[imageUploadCellIdx].imgUrl! = data
      costAccoutingVisible.value = false
    }
  } catch(err){
    const error = err as Error;
    console.error(error)
    $baseMessage("零件图片上传失败！","error","hey")
  }
}

// 头程渠道修改
const handlerEstimatendChange = async (row: IProgressEstimatedCostAccounting) =>{
  await costAccountingUpdate({ ...row, tariff: `${parseFloat(row.tariff!) / 100}`, grossMarginRate: `${parseFloat(row.grossMarginRate!) / 100}`, roi: `${parseFloat(row.roi!)/ 100}` })
  fetchDataCostAccounting()
}


const costAccountingUpdateUploadPicVisible = (newV:boolean) =>{
  costAccoutingVisible.value = newV
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
  formdata.append('progressId', props.progressId+"")
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
  const {data} = await costAccountingCopy({accountingId: row.id + "", progressId: props.progressId})
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

onMounted(async ()=>{
  fetchDataCostAccounting()
})

</script>

<style lang="scss" scoped>
.none {
  display: none;
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
        padding-left: 0;
        padding-right: 0;
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
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>