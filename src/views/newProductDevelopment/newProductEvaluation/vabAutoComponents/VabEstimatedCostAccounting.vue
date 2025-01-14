<template>
  <vab-dialog 
    v-model="dflag" 
    :before-close = "handlerCloseDialog"
    title="产品成本核算与推进" 
    width="100%"
    top="10vh"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handlerAddRowCost">新增</el-button>
        <el-button type="primary" @click="handlerProductProgress">新品推进(发布到新品进度管理)</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <VueDraggable
      v-model="dList"
      :animation="150"
      ghostClass="ghost"
      target="tbody"
      @end="onEnd"
    >
      <el-table 
        :data="dList" 
        border stripe 
        @cell-click="changeInput"
        :cell-style="cellStyle" :header-cell-style="{ 'text-align': 'center' }"
        :cell-class-name="getCellStyle"
        @selection-change="handleSelectionChange"
        max-height="65vh"
      >
        <el-table-column type="selection" width="38" />
        <el-table-column prop="createTime" label="日期" min-width="110" />
        <el-table-column prop="site" label="站点" min-width="140">
          <template #default="{ row }">
            <el-select v-model="row.site" placeholder="请选择站点" @change="handlerSiteChange(row)" style="min-width: 100%">
              <el-option v-for="dict in props.siteList" :key="dict.id" :value="dict.id" :label="dict.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="外汇币种" prop="currencyType" min-width="60">
          <template #header>
            外汇<br />币种
          </template>
        </el-table-column>
        <el-table-column label="汇率" prop="foreignExchange"></el-table-column>   
        <el-table-column prop="imgUrl" label="图片" width="75px">
          <template #default="{ row, $index }">
            <div @click="getCellRowData($index)">
              <el-image style="width: 75px; height: 75px; display: block;" :src="row.imgUrl" fit="fill" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品描述" prop="desc" min-width="200">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.desc }}</div>
              </template>
              <el-text truncated>{{ row.desc }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="priceInfo" label="价格信息" min-width="200">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.priceInfo }}</div>
              </template>
              <el-text truncated>{{ row.priceInfo }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="url1688" label="1688链接" min-width="200">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.url1688 }}</div>
              </template>
              <el-text truncated>{{ row.url1688 }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="price" label="产品价格￥">
          <template #header>
            产品<br />价格￥
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.price" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.price ? '￥' + row.price : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="length" label="长(cm)">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.length" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.length != null ? row.length + 'cm' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="width" label="宽(cm)">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.width" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.width != null ? row.width + 'cm' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="height" label="高(cm)">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.height" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.height != null ? row.height + 'cm' : '' }}</span>
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
            {{ row.lastMile ? row.symbol + row.lastMile : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="firstMile" label="头程￥">
          <template #default="{ row }">
            {{ row.firstMile ? '￥' + row.firstMile : '' }}
          </template>
        </el-table-column>

        <el-table-column prop="packaging" label="打包￥">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.packaging" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.packaging ? '￥' + row.packaging : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstMileChannel" label="头程渠道" min-width="130">
          <template #default="{ row }">
            <el-select 
              v-model="row.firstMileChannel" 
              placeholder="请选择"
              @change="handlerEstimatedChange(row)"
              style="min-width: 100%"
            >
              <el-option v-for="dict in props.channelList" :key="dict.id" :value="dict.id" :label="dict.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="sellingPrice" label="售价">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.sellingPrice" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.sellingPrice ? row.symbol + row.sellingPrice : '' }}</span>
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
        <el-table-column prop="roi" label="ROI" min-width="60"></el-table-column>

        <el-table-column prop="weightCoefficient" label="重量系数" min-width="60">
          <template #header>
            重量<br />系数
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.weightCoefficient" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.weightCoefficient }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="volumeCoefficient" label="体积系数" min-width="60">
          <template #header>
            体积<br />系数
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.volumeCoefficient" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.volumeCoefficient }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="tariff" label="关税%" min-width="80">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.tariff" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event,row)" />
            </div>
            <span>{{ row.tariff != null ? row.tariff + '%' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platformCommission" label="平台佣金">
          <template #default="{ row }">
            <span>{{ row.platformCommission ? row.symbol + row.platformCommission : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storageFee" label="仓储费2个月" min-width="80">
          <template #header>
            仓储费<br />2个月
          </template>
          <template #default="{ row }">
            <span>{{ row.storageFee ? row.symbol + row.storageFee : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :fixed="fixed" label="操作" width="120px">
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
                  <el-dropdown-item @click="handlerPicUpload(scope.row,scope.$index)">
                    <el-link type="primary" :underline="false" >上传图片</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handlerCopyData(scope.row)">
                    <el-link type="primary" :underline="false" >复制</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handlerDelete(scope.row)">
                    <el-link type="primary" :underline="false" >删除</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </VueDraggable>
    <template #footer></template>
  </vab-dialog>

  <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible" hide-on-click-modal/>

  <vab-upload 
    :upload-visible="uploadPicVisible" 
    title="上传图片" 
    :is-multiple="false"
    :fileListFlag = "false"
    :dataId = "dataId"
    @update:uploadVisible = "updateUploadPicVisible"
    :upload-file="uploadFile"
  />
  <!-- 产品描述 -->
  <vab-dialog
    title="产品描述"
    width="25%"
    v-model="productDescriptionVisible"
  >
    <el-input type="textarea" v-model="productDescription" :rows="20" />
    <template #footer>
      <el-button @click="productDescriptionVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmUpdate1Dialog">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 价格信息 -->
  <vab-dialog
    title="价格信息"
    width="25%"
    v-model="priceInformationVisible"
  >
    <el-input type="textarea" v-model="priceInformation" :rows="20" />
    <template #footer>
      <el-button @click="priceInformationVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmUpdate2Dialog">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 1688链接 -->
  <vab-dialog
    title="1688链接"
    width="25%"
    v-model="link1688Visible"
  >
    <el-input type="textarea" v-model="link1688" :rows="20" />
    <template #footer>
      <el-button @click="link1688Visible = false">取消</el-button>
      <el-button type="primary" @click="confirmUpdate3Dialog">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import {
  addEstimatedCostAccounting,
  addEstimatedCostAccountingProductRelease,
  copyEstimatedCostAccounting,
  deleteEstimatedCostAccounting,
  getExchangeRate,
  updateEstimatedCostAccounting,
  updateEstimatedCostAccountingFirstMileChannel,
  updateEstimatedCostAccountingSort
} from '/@/api/devlocal/evaluation'
import { formatDate } from '/@/utils/dateUtils'

import {
  type SortableEvent,
  VueDraggable
} from 'vue-draggable-plus'

import {
  siteReflectCurrencyAndExchangeRate
} from '../../indexCommon'

import { IEstimatedCostAccounting } from '/@/type/evaluation/evaluationType'

import { ElLink, ElMessageBox, UploadRequestOptions } from 'element-plus'
import { isEqual } from 'lodash'
import debounce from 'lodash/debounce'
import { uploadFileBoBakend } from '/@/api/devlocal/evaluation'
import { focusAndSelectInput, getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'
import { CSSProperties } from 'vue'


defineOptions({
  name: 'VabEstimatedCostAccounting',
})

let props = defineProps<{
  flag: boolean
  evaluationId:string
  list: IEstimatedCostAccounting[]
  channelList: { id: number, label: string }[]
  siteList: { id: number, label: string }[]
  callParentMethod: (id:number) => void
}>();

// 产品描述可见
const productDescriptionVisible = ref<boolean>(false)
const productDescription = ref<string>('')
// 价格信息可见
const priceInformationVisible = ref<boolean>(false)
const priceInformation = ref<string>('')
// 1688链接可见
const link1688Visible = ref<boolean>(false)
const link1688 = ref<string>('')

const dList = ref<IEstimatedCostAccounting[]>([])
const dflag = ref<boolean>(false)
watchEffect(()=>{
    dList.value = props.list
    dflag.value = props.flag
})


const emit = defineEmits<{ (e: 'update:visibleValue', value: boolean): void }>()
// Table cell 下标
let imageUploadCellIdx = 0
const imagePreviewVisible = ref<boolean>(false)
const uploadPicVisible = ref<boolean>(false)
const dataId = ref<string>("")
const fixed = ref<string>('right')
const estimatedCostAccountingList = ref<IEstimatedCostAccounting[]>([])
const imagePreviewList = ref<string[]>([])
const selectRows = ref<IEstimatedCostAccounting[]>([])
const router = useRouter()
let {list,evaluationId} = toRefs(props)

// 鼠标enter事件
const effectiveCountInputHandle = (event: Event, row:any) => {
  const targetElement = event.target as HTMLInputElement
  targetElement.blur()
}

// 新增行
const handlerAddRowCost = async () => {

  let newData: IEstimatedCostAccounting = {
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
      firstMileChannel: 1,
      sellingPrice: '',
      weightCoefficient: '',
      volumeCoefficient: '',
      tariff: '',
      lastMile: '',
      firstMile: '',
      grossMarginRate: '',
      roi: '',
      platformCommission: '',
      storageFee: ''
  }
 
  const formdata = new FormData()
  formdata.append('evaluationId', evaluationId.value+"")
  formdata.append('sort', convertString(dList.value.length + 1))
  
  const {data} = await addEstimatedCostAccounting(formdata)
  if (data){
    
      // 获取汇率
      const {data} = await getExchangeRate({currency: siteReflectCurrencyAndExchangeRate.get(newData.site)!})
      newData.foreignExchange = data

      $baseMessage("产品成本核算添加成功！","success","hey")
      estimatedCostAccountingList.value.push(newData)
      props.callParentMethod(parseInt(evaluationId.value))
  }
}

let _row: any
let clickRow: any
// 修改输入
const changeInput = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  clickRow = row
  if (column.property === 'desc') {
    productDescription.value = row.desc
    productDescriptionVisible.value = true
  }
  if (column.property === 'priceInfo') {
    priceInformation.value = row.priceInfo
    priceInformationVisible.value = true
  }
  if (column.property === 'url1688') {
    link1688.value = row.url1688
    link1688Visible.value = true
  }
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
      imagePreviewVisible.value = true;
  }

  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  _row = JSON.parse(JSON.stringify(row));

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }

}

// 产品描述的确认修改
const confirmUpdate1Dialog = async () => {
  await updateEstimatedCostAccounting({ ...clickRow, desc: productDescription.value, tariff: clickRow.tariff / 100, grossMarginRate: clickRow.grossMarginRate / 100 })
  clickRow.desc = productDescription.value
  productDescriptionVisible.value = false
}
// 价格信息的确认修改
const confirmUpdate2Dialog = async () => {
  await updateEstimatedCostAccounting({ ...clickRow, priceInfo: priceInformation.value, tariff: clickRow.tariff / 100, grossMarginRate: clickRow.grossMarginRate / 100 })
  clickRow.priceInfo = priceInformation.value
  priceInformationVisible.value = false
}
// 1688链接的确认修改
const confirmUpdate3Dialog = async () => {
  await updateEstimatedCostAccounting({ ...clickRow, url1688: link1688.value, tariff: clickRow.tariff / 100, grossMarginRate: clickRow.grossMarginRate / 100 })
  clickRow.url1688 = link1688.value
  link1688Visible.value = false
}
// 相当于输入input blur事件
const clickCancel = async (event:any, value:any) =>{

  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    // 更新 t1 和 t2 的 class
    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(_row, value)) {
    return
  }
  if (value.tariff < 0) {
    $baseMessage('关税不能为复数！', 'error')
    value.tariff = 0
    return
  }
  const { firstMileChannel, ...filterValue } = value
  await updateEstimatedCostAccounting({ ...filterValue, tariff: value.tariff / 100, grossMarginRate: value.grossMarginRate / 100 })
  props.callParentMethod(parseInt(evaluationId.value))
}

const getCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 5) {
    return 'clear-padding'
  }
  return ''
}
// 获取点击行的table cell下标
const getCellRowData = (idx:number) =>{
    imagePreviewList.value = []
    imageUploadCellIdx = idx
    imagePreviewList.value.push(list.value[imageUploadCellIdx].imgUrl)   
}


// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}

// 通过事件,修改父元素的值
const handlerCloseDialog = () =>{
    dflag.value = false
}

// 复制
const handlerCopyData = async (row:any) => {
   const {data} = await copyEstimatedCostAccounting({id:row.id+ ""})
   if (data == true){
    $baseMessage("此条产品成本核算信息复制成功!","success","hey")
    props.callParentMethod(parseInt(evaluationId.value))
   }
}

// 删除
const handlerDelete = async (row:any)=>{
 $baseConfirm('您确定要删除产品成本信息吗', null, async () => {
    const {data} = await deleteEstimatedCostAccounting({id:row.id})
    if (data == true){
        $baseMessage("此条产品成本信息删除成功!","success","hey")
        props.callParentMethod(parseInt(evaluationId.value))
    }
  })
}

// 头程渠道修改
const handlerEstimatedChange = async (row: IEstimatedCostAccounting) =>{
  await updateEstimatedCostAccountingFirstMileChannel({
    id: Number(row.id),
    channelId: row.firstMileChannel
  })
}

// 修改站点
const handlerSiteChange = async (row: IEstimatedCostAccounting) =>{
  // row.currencyType = siteReflectCurrencyAndExchangeRate.get(row.site)!
  // const {data} = await getExchangeRate({currency:row.currencyType})
  // row.foreignExchange = data
  // row.site = row.site  
  await updateEstimatedCostAccounting({ ...row, tariff: Number(row.tariff) / 100, grossMarginRate: Number(row.grossMarginRate) / 100 })
  props.callParentMethod(parseInt(evaluationId.value))
}

// 上传图片
const handlerPicUpload = async (row:any,idx:number) => {
    uploadPicVisible.value = true
    dataId.value = row.id + ""
    imageUploadCellIdx = idx

}

// 添加到新品进度管理
const handlerProductProgress = async() =>{
    const idsArr:string[] = selectRows.value.map( (item:IEstimatedCostAccounting) =>{
        return item.id
    })
    const ids:string = idsArr.map(String).join(',')
    try {
       const {data} = await addEstimatedCostAccountingProductRelease({ids,evaluationId:props.evaluationId})
       if (data == true){
            ElMessageBox({
                title: '发布成功',
                confirmButtonText:"关闭",
                showClose:false,
                showCancelButton:false,
                type:"success",
                dangerouslyUseHTMLString: true,
                message: ()=>
                    h('div',{style:"cursor: pointer; color: #409eff;",onClick:handleClick},{default:()=>"点击此链接跳转到新品进度管理"}),
                
            })
       }
    }catch(e){
        console.error(e as Error);
    }
}

// 处理MessageBox的页面跳转
const handleClick = () =>{
    ElMessageBox.close()
    router.push({
        path: '/newProductDevelopment/newProductProgress',
    })
}

// 移动之后触发修改排序接口
const onEnd = debounce(async (e: SortableEvent ) => {
    try {
        const idList = dList.value.map((item:IEstimatedCostAccounting) =>{
            return item.id
        })

        await updateEstimatedCostAccountingSort(idList)

    }catch(e){
        console.error(e as Error)
    }
},500)


// 上传文件
const uploadFile = async (options: UploadRequestOptions) => {

  const formdata = new FormData()
  formdata.append('file', options.file)
  formdata.append('id', dataId.value)

  try{
    const {data} = await uploadFileBoBakend(formdata);
    if (data){
        $baseMessage("产品成本核算图片上传成功！","success","hey")
        imagePreviewList.value = []
        list.value[imageUploadCellIdx].imgUrl = data
        imagePreviewList.value.push(data)   
        uploadPicVisible.value = false
    }
  }catch(err){
    const error = err as Error;
    console.error(error)
    $baseMessage("产品成本核算图片上传失败！","error","hey")
    uploadPicVisible.value = false
  }

}

// table checkbox事件
const handleSelectionChange = (val: IEstimatedCostAccounting[]) => {
    selectRows.value = val
}

// 通过事件获取子组件数据
const updateUploadPicVisible = (newV:boolean) =>{
    uploadPicVisible.value = newV
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 6 || index === 7 || index === 8) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
</script>

<style lang="scss" scoped>
.none {
  display: none;
}

.block {
  display: block;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
:deep(.el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-left: 0;
  padding-right: 0;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 75px;
}
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>