<template>
  <!-- 拿样清单成本试算 -->
  <el-row style="padding-top:25px; flex-grow: 1;">
    <!-- <el-col :span="1" class="sample">
        <div><strong>拿样清单成本试算</strong></div>
    </el-col> -->
    <el-col :span="24">
      <el-table 
        :data="sampleList"
        @cell-click="sampelTrialTableInputChage"
        border stripe
        :cell-style="cellStyle" :header-cell-style="{ 'text-align': 'center' }"
        ref="trialTableRef"
        :span-method="objectSpanMethod"
      >
      <el-table-column prop="firstColumn" min-width="100">
        <span style="font-weight: 600; font-size: var(--el-font-size-base); color: var(--el-table-header-text-color);">拿样清单<br>成本试算</span>
      </el-table-column>
      <el-table-column prop="site" label="站点" min-width="135">
        <template #default="{ row }">
          <el-select v-model="row.site" placeholder="请选择站点" @change="handlerSiteChange(row)" style="min-width: 100%;">
            <el-option v-for="dict in props.siteList" :key="dict.id" :value="dict.id" :label="dict.label"></el-option>
          </el-select>
        </template>
      </el-table-column>


      <el-table-column label="外汇币种" prop="currencyType" min-width="100"></el-table-column>

      <el-table-column label="汇率" prop="foreignExchange"></el-table-column>

      <el-table-column label="产品描述" min-width="200" prop="desc">
        <template #default="{ row, $index }">
          <el-tooltip content=" " effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ removeHtmlTags(row.desc) }}</div>
            </template>
            <el-text truncated @click="handleDescClick($index)">{{ removeHtmlTags(row.desc) }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>


      <el-table-column prop="length" label="长(cm)" min-width="80">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.length" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
          </div>
          <span>{{ row.length != null ? row.length + 'cm' : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="width" label="宽(cm)" min-width="80">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.width" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
          </div>
          <span>{{ row.width != null ? row.width + 'cm' : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="height" label="高(cm)" min-width="80">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.height" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
          </div>
          <span>{{ row.height != null ? row.height + 'cm' : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="price" label="实际总成本￥" min-width="130">
        <template #default="{ row }">
          {{ row.price != null ? '￥' + row.price : '' }}
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量(g)">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.weight" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
          </div>
          <span>{{ row.weight != null ? row.weight + 'g' : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="lastMile" label="尾程">
        <template #default="{ row }">
          {{ row.lastMile != null ? row.symbol + row.lastMile : '' }}
        </template>
      </el-table-column>

      <el-table-column prop="firstMile" label="头程￥">
        <template #default="{ row }">
          {{ row.firstMile != null ? '￥' + row.firstMile : '' }}
        </template>
      </el-table-column>

      <el-table-column prop="packaging" label="打包￥">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.packaging" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
          </div>
          <span>{{ row.packaging != null ? '￥' + row.packaging : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="firstMileChannel" label="头程渠道" min-width="140">
        <template #default="{ row }">
          <el-select v-model="row.firstMileChannel" @change="handleUpdateChannel(row)" placeholder="请选择头程渠道" style="min-width: 100%">
            <el-option v-for="dict in props.channelList" :key="dict.id" :value="dict.id" :label="dict.label" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="sellingPrice" label="售价">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.sellingPrice" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
          </div>
          <span>{{ row.sellingPrice != null ? row.symbol + row.sellingPrice : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="grossMarginRate" label="毛利率">
        <template #default="{ row }">
          <el-text v-if="row.grossMarginRate >= 30" type="success">{{ row.grossMarginRate + '%' }}</el-text>
          <el-text v-if="row.grossMarginRate >= 25 && row.grossMarginRate < 30" type="primary">{{ row.grossMarginRate + '%' }}</el-text>
          <el-text v-if="row.grossMarginRate >= 20 && row.grossMarginRate < 25" type="warning">{{ row.grossMarginRate + '%' }}</el-text>
          <el-text v-if="row.grossMarginRate < 20" type="danger">{{ row.grossMarginRate != null ? row.grossMarginRate + '%' : '' }}</el-text>
        </template>
      </el-table-column>

      <el-table-column prop="roi" label="ROI"></el-table-column>

      <el-table-column prop="weightCoefficient" label="重量系数" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.weightCoefficient" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
          </div>
          <span>{{ row.weightCoefficient }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="volumeCoefficient" label="体积系数" min-width="100">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.volumeCoefficient" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
          </div>
          <span>{{ row.volumeCoefficient }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="tariff" label="关税%">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.tariff" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
          </div>
          <span>{{ row.tariff ? row.tariff + '%' : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="platformCommission" label="平台佣金" min-width="100">
        <template #default="{ row }">
          {{ row.platformCommission != null ? row.symbol + row.platformCommission : '' }}
        </template>
      </el-table-column>

      <el-table-column prop="storageFee" label="仓储费2个月" min-width="140">
        <template #default="{ row }">
          {{ row.storageFee != null ? row.symbol + row.storageFee : '' }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" min-width="130">
        <template #default="{ row }">
          <el-space :size="20">
            <el-link type="primary" :underline="false" >逆算</el-link>
            <el-link type="success" :underline="false"  @click="saveTrialCalculationHandler(row)">保存</el-link>
          </el-space>
        </template>
      </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <!-- 产品描述显示 -->
  <wangEditor 
    :wangEditorVisible="wangEditorLogVisible" 
    :title="wangEditorTitle" 
    :content="progressLogCopy"
    :classify='classify' 
    @clickBoolean="clickLogBool" 
    @clickChild="clickLog" 
  />
</template>

<script lang="ts" setup>
import { TableInstance } from 'element-plus'
import { isEqual } from 'lodash'
import wangEditor from '../newProductProgress/wangEditor.vue'
import { addTrialCalculation, getTrialCalculation, getTrialCalculationProductDesc, saveTrialCalculation, updateTrialCalculation, updateTrialcalculationProductdesc } from '/@/api/devlocal/progressSample'
import { IProgressEstimatedCostAccounting, IProgressSample } from '/@/type/progress/sampleAndComponentType'
import { formatDate } from '/@/utils/dateUtils'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'
import { removeHtmlTags } from '/@/utils/tableColum'
import { CSSProperties } from 'vue'

const trialTableRef = ref<TableInstance>()

const props = defineProps<{
  progressId: string
  siteList: { id: number, label: string }[]
  channelList: { id: number, label: string }[]
  costScroll: (() => void) | undefined
  costAccountingData: IProgressEstimatedCostAccounting[] | undefined
  costAccountingFetch: (() => Promise<void>) | undefined
}>();

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)

const progressLogCopy = ref<string | undefined>('')

const classify = ref<string>('')
const _index = ref<number>(0)
const handleDescClick = (index: number) => {
  _index.value = index
}
/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  sampleList.value[_index.value].desc = val
  progressLogCopy.value = val
  await updateTrialcalculationProductdesc({
    id: parseInt(sampleList.value[_index.value].id!),
    productDesc: sampleList.value[_index.value].desc!
  }) 
}

/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = ( val: any) => {
  wangEditorLogVisible.value = val
}

defineComponent({
  name: "VabTrialCalculation"
})

// 列表col合并方法
const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: any) => {
  
  // 表头合并
  if (column.property === 'firstColumn') {
    if (rowIndex === 0) {
      return { rowspan: 2, colspan: 1 }; // 合并表头与第一行数据
    } else if (rowIndex === 1) {
      return { rowspan: 0, colspan: 0 }; // 隐藏第二行的单元格
    }
  }
  return { rowspan: 1, colspan: 1 }; // 其他列正常显示
}

// 拿样清单列表
const sampleList = ref<IProgressSample[]>([])

// 拿样清单成本试算-修改站点
const handlerSiteChange = async (row:IProgressEstimatedCostAccounting) =>{
    // row.currencyType = siteReflectCurrencyAndExchangeRate.get(row.site!)
    // 调用修改接口
}
const handleUpdateChannel = async (row: any) => {
  await updateTrialCalculation({ ...row, tariff: "" + parseInt(row.tariff!) / 100, grossMarginRate: "" + parseInt(row.grossMarginRate) / 100 })
  fetchData()
}
// 鼠标enter事件
const effectiveCountInputHandle = (event: Event,row:any) => {
  const targetElement = event.target as HTMLInputElement
  targetElement.blur()
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 2 || index === 3 || index === 8 || index === 22 || index === 10 || index === 11 || index === 15 || index === 16 || index === 20 || index === 21 ) {
    return {
      // backgroundColor: '#fafafa',
      color: '#999',
      cursor: 'not-allowed',
      textAlign:'center'
    }
  } else if (index === 4) {
    return {
      textAlign: 'left'
    }
  } else {
    return {
      textAlign:'center'
    }
  }
}

// 保存拿样清单成本试算
const saveTrialCalculationHandler = async (row:IProgressSample) => {
  const { data } = await saveTrialCalculation({ progressId:parseInt(props.progressId), id: row.id! })
  if (data === true){
    $baseMessage("拿样清单成本试算添加到成本核算成功！", "success", "hey")
      // 获取最新添加的元素
      const newInfo: IProgressSample = await getTrialCalculationHandler()
      let newValue: IProgressEstimatedCostAccounting = {
        createTime:formatDate(),
        id:newInfo.id!,
        site:Number(newInfo.site),
        currencyType:newInfo.currencyType,
        foreignExchange:newInfo.foreignExchange,
        desc:newInfo.desc,
        length:newInfo.length,
        width:newInfo.width,
        height:newInfo.height,
        weight:newInfo.weight,
        lastMile:newInfo.lastMile,
        firstMile:newInfo.firstMile,
        packaging:newInfo.packaging,
        firstMileChannel:newInfo.firstMileChannel,
        sellingPrice:newInfo.sellingPrice,
        grossMarginRate:newInfo.grossMarginRate,
        roi:newInfo.roi,
        weightCoefficient:newInfo.weightCoefficient,
        volumeCoefficient:newInfo.volumeCoefficient,
        tariff:newInfo.tariff,
        platformCommission:newInfo.platformCommission,
        storageFee:newInfo.storageFee
    }
    
    if (newInfo.totalCost){
      newValue.price = convertString(newInfo.totalCost!)
    }

    props.costAccountingData?.push(newValue)

    // 重新加载成本核算
    props.costAccountingFetch?.()
    // 自动滚动到新增加行位置    
    props.costScroll?.()        
  }
}

// 添加拿样清单成本试算
const addTrialCalculationHandler = async (): Promise<number> => {
  const { data } = await addTrialCalculation({ progressId:props.progressId })
  return data
}


// 获取拿样清单成本试算
const getTrialCalculationHandler = async (): Promise<IProgressSample> => {
  const { data } = await getTrialCalculation({ progressId:props.progressId })
  return data
}

let copyRow: any
// 拿样清单成本试算修改
const sampelTrialTableInputChage = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (column.property === 'desc') {
    const { data } = await getTrialCalculationProductDesc({ id: row.id })
    row.desc = data
    progressLogCopy.value = data
    wangEditorTitle.value = '编辑产品描述'
    classify.value = 'desc'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  }
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
  

// 输入input blur事件
const clickCancel = async (event:any,value:IProgressSample) =>{  
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
    
  await updateTrialCalculation({ ...value, tariff: "" + parseInt(value.tariff!) / 100, grossMarginRate: "" + parseInt(value.grossMarginRate!) / 100 })
}

const fetchData = async () => {
  sampleList.value = []

  let first: IProgressSample = {
    site:"0",
    currencyType:"0",
    foreignExchange:'',
    desc:'',
    length:'',
    width:'',
    height:'',
    totalCost: null,
    weight:'',
    lastMile:'',
    firstMile:'',
    packaging:'',
    firstMileChannel:'0',
    sellingPrice:'',
    roi:'',
    weightCoefficient:'',
    volumeCoefficient:'',
    tariff:'',
    platformCommission:'',
    storageFee:'',
  }

    // const currencyType = siteReflectCurrencyAndExchangeRate.get(first.site!)
    // const {data} = await getExchangeRate({currency:currencyType})
    // first.foreignExchange = data

  const dbInfo: IProgressSample = await getTrialCalculationHandler()
  if (!dbInfo){
    // 创建拿样清单成本试算
    const id = await addTrialCalculationHandler()
    // -1 代表对应的拿样清单成本试算已经存在
    if (id !== -1){
      first.id = convertString(id)
    }
    sampleList.value.push(first)
  } else{
    first.id = dbInfo.id!
    sampleList.value.push(dbInfo)
  }
}
defineExpose({
  fetchData
})
onMounted(async ()=>{
  fetchData()
})

</script>

<style lang="scss" scoped>
.none {
  display: none;
}

.block {
  display: block;
}

.sample {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-left: 1px solid rgb(235, 238, 245);
    border-bottom: 1px solid rgb(235, 238, 245);
    font-weight: bold;
}
// /* 调整表头和数据行的边框样式 */
// :deep(.el-table .el-table__header tr:first-child th) {
//   border-bottom: none; /* 去掉表头的下边框 */
// }

// :deep(.el-table .el-table__body tr:first-child td) {
//   border-top: none; /* 去掉第一行的上边框 */
// }
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>