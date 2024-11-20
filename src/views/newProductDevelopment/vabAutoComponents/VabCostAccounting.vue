<template>
  <!-- 成本核算 -->
  <div style="width: 100%; padding-top:15px; flex-grow: 2" >
      
    <el-divider style="margin:10px 0"/>
      
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
        :cell-style="cellStyle"
        border stripe
        @cell-click="costAccountingChangeInput"
        :header-cell-style="{ 'text-align': 'center' }"
        class="noneHoveTable"
      >

        <el-table-column prop="createTime" label="日期" min-width="110">
            <template #default="{row}">
                <span>{{ formatDate(new Date(row.createTime)) }}</span>
            </template>
        </el-table-column>

        <el-table-column label="站点" min-width="135">
            <template #default="{ row }">
                <el-select v-model="row.site" placeholder="请选择站点" @change="handlerSiteChange(row)" style="min-width: 100%;">
                    <el-option v-for="dict in estimatedCostAccountingSiteColumns" :key="dict.value"
                        :value="dict.value" :label="dict.label"></el-option>
                </el-select>
            </template>
        </el-table-column>

        <el-table-column label="外汇币种" min-width="100">
            <template #default="{ row }">
                <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span>
            </template>
        </el-table-column>

        <el-table-column label="汇率">
            <template #default="{ row }">
                <span>{{row.foreignExchange}}</span>
            </template>
        </el-table-column>

        <el-table-column  label="图片">
            <template v-slot="scope">
                <div>
                    <el-image v-if="scope.row.imgUrl" style="width: 50px; height: 50px" :src="scope.row.imgUrl" fit="fill" data-img="img" />
                </div>
            </template>
        </el-table-column>

        <el-table-column label="产品描述" min-width="250" prop="desc">
          <template #default="{ row }">
            <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div style="white-space: pre-wrap;">{{ removeHtmlTags(row.desc) }}</div>
              </template>
              <span>{{ removeHtmlTags(row.desc) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="价格信息" min-width="250" prop="priceInfo">
          <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div style="white-space: pre-wrap;">{{ removeHtmlTags(row.priceInfo) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.priceInfo) }}</span>
              </el-tooltip>
            </template>
        </el-table-column>

        <!-- <el-table-column label="1688链接" min-width="140">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.url1688" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.url1688 }}</span>
            </template>
        </el-table-column> -->

        <el-table-column label="产品价格￥" min-width="120">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.price" 
                        @blur="clickCancle($event, row)"
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.price }}</span>
            </template>
        </el-table-column>

        <el-table-column label="长" min-width="70">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.length" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.length }}</span>
            </template>
        </el-table-column>

        <el-table-column  label="宽" min-width="70">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.width" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.width }}</span>
            </template>
        </el-table-column>

        <el-table-column  label="高" min-width="70">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.height" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.height }}</span>
            </template>
        </el-table-column>

        <el-table-column  label="重量">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.weight" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.weight }}</span>
            </template>
        </el-table-column>

        <el-table-column prop="lastMile" label="尾程" />

        <el-table-column prop="firstMile" label="头程">
        </el-table-column>

        <el-table-column  label="打包">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.packaging" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.packaging }}</span>
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
                    <el-option 
                        v-for="dict in firstLegChannelColumns" 
                        :key="dict.value" 
                        :value="dict.value"
                        :label="dict.label"
                    >
                    </el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column  label="售价">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.sellingPrice" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.sellingPrice }}</span>
            </template>
        </el-table-column>

        <el-table-column prop="grossMarginRate" label="毛利率" />
        

        <el-table-column prop="roi" label="ROI" />

        <el-table-column label="重量系数" min-width="100">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.weightCoefficient" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.weightCoefficient }}</span>
            </template>
        </el-table-column>

        <el-table-column label="体积系数" min-width="100">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.volumeCoefficient" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.volumeCoefficient }}</span>
            </template>
        </el-table-column>

        <el-table-column label="关税%">
            <template #default="{ row }">
                <div class="none">
                    <el-input 
                        type="text" 
                        v-model="row.tariff" 
                        @blur="clickCancle($event, row)" 
                        @keydown.enter="effectiveCountInputeHandle($event,row)"
                    />
                </div>
                <span>{{ row.tariff ? row.tariff : '' }}{{ row.tariff ? '%' : '' }}</span>
            </template>
        </el-table-column>

        <el-table-column prop="platformCommission" label="平台佣金" min-width="100">
        </el-table-column>

        <el-table-column prop="storageFee" label="仓储费2个月$" min-width="140">
        </el-table-column>


        <el-table-column align="center" fixed="right" label="操作" width="120px">
            <template v-slot="scope">
                <el-dropdown>
                    <el-button text type="primary">
                        逆算
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <el-link type="primary" :underline="false">逆算</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-link type="primary" :underline="false" @click="costAccountImageUpload(scope.row,scope.$index)">上传图片</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-link type="primary" :underline="false" @click="costAccountCopy(scope.row)">复制</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-link type="primary" :underline="false" @click="costAccountDelete(scope.row)">删除</el-link>
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
import {
  estimatedCostAccountingSiteColumns,
  firstLegChannelColumns,
  siteReflectCurrencyAndExchangeRate,
} from '../indexCommon'
import wangEditor from '../newProductProgress/wangEditor.vue'
import { getExchangeRate } from '/@/api/devlocal/evaluation'
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
  updateProgressPriceInfo,
  updateProgressProductdesc
} from '/@/api/devlocal/progressSample'
import { IProgressEstimatedCostAccounting } from '/@/type/progress/sampleAndComponentType'
import { formatDate } from '/@/utils/dateUtils'
import { focusAndSelectInput, getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'
import { removeHtmlTags } from '/@/utils/tableColum'

const isDraggingDisabled = ref<boolean>(false)

const props = defineProps<{
    progressId:string
}>();

defineComponent({
    name:"VabCostAccounting"
})


const emit = defineEmits<{ 
    (e: 'update:imagePreviewVisibale', value: boolean): void
    (e: 'update:priviewListValue', value: string): void
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
//   // console.log('点击log执行了');
  await updateProgressProductdesc({
    accountingId: parseInt(clickRow.value.id),
    productDesc: clickRow.value.desc!
  }) //发送更新数据请求
}
const clickRemark = async (val: any) => {
    clickRow.value.priceInfo = val
  remarkCopy.value = val

  await updateProgressPriceInfo({
    accountingId: parseInt(clickRow.value.id),
    priceInfo: clickRow.value.priceInfo!
  }) //发送更新数据请求
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


// 输入input blur事件
const clickCancle = async (event:any, value:IProgressEstimatedCostAccounting) => {

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
  await costAccountingUpdate({...value, tariff: ""+parseFloat(value.tariff!) / 100})
}

// 鼠标enter事件
const effectiveCountInputeHandle = (event: Event,row:any) => {
    const targetElement = event.target as HTMLInputElement
    targetElement.blur()
    isDraggingDisabled.value = false
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
    if  (data.columnIndex === 0 || data.columnIndex === 2 
        || data.columnIndex === 3 
        || data.columnIndex === 12
        || data.columnIndex === 17 
        || data.columnIndex === 23 || data.columnIndex === 24

    ){
        return {
            color: '#bbb',
            cursor: 'not-allowed',
            textAlign:'center'
        }
    }else {
        return {
            textAlign:'center'
        }
    }
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
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
      emit("update:priviewListValue",row.imgUrl)
      emit("update:imagePreviewVisibale",true)
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
const handlerSiteChange = async (row:IProgressEstimatedCostAccounting) =>{
    row.currencyType = siteReflectCurrencyAndExchangeRate.get(row.site!)!
    const {data} = await getExchangeRate({currency:row.currencyType})
    row.foreignExchange = data
    row.site = row.site
    await costAccountingUpdate({...row})
}


// 内容拖拽排序
const onEnd = debounce(async (e: SortableEvent ) => {
    try {
        const idList = estimatedCostList.value.map((item:IProgressEstimatedCostAccounting) =>{
            return item.id
        })

        await costAccountingUpdateRowSort(idList)
    }catch(e){
        console.error(e as Error)
    }
},1000)


// 获取成本核算数据列表
const fetchDataCostAccounting = async ()=>{
    try {
        // 成本核算列表
        const {data} = await getCostAccountingList({progressId:props.progressId})
        estimatedCostList.value = data
        estimatedCostList.value.forEach((item: any) => {
            if(item.tariff) {
                item.tariff = (item.tariff * 100).toFixed(0)
            }
        })
    }catch(e){
        console.error(e as Error)
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
    if (data){
        $baseMessage("零件图片上传成功！","success","hey")
        estimatedCostList.value[imageUploadCellIdx].imgUrl! = data
        costAccoutingVisible.value = false
    }
    }catch(err){
        const error = err as Error;
        console.error(error)
        $baseMessage("零件图片上传失败！","error","hey")
    }
}

// 头程渠道修改
const handlerEstimatendChange = async (row:IProgressEstimatedCostAccounting) =>{
  await costAccountingUpdate({...row})
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
      site: '0',
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
    const {data} = await getExchangeRate({currency: siteReflectCurrencyAndExchangeRate.get(newData.site!)})
    newData.foreignExchange = data

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
    const {data} = await costAccountingCopy({accountingId:row.id+ "",progressId:props.progressId})
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
    const {data} = await costAccountingDelete({accountingId:row.id!})
    if (data == true){
        const index = estimatedCostList.value.findIndex((item:IProgressEstimatedCostAccounting) => item.id === row.id);
        if (index !== -1) {
            estimatedCostList.value.splice(index, 1);
        }
        $baseMessage("此条产品成本信息删除成功!","success","hey")
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
:deep(.el-table .el-table__body .cell) {
  max-height: 50px;
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