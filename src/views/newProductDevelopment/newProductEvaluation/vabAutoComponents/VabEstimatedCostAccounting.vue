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
        :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
        :cell-class-name="getCellStyle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="38" />
        <el-table-column prop="createTime" label="日期" min-width="110" />
        <el-table-column prop="site" label="站点" min-width="140">
          <template #default="{ row }">
            <el-select v-model="row.site" placeholder="请选择站点" @change="handlerSiteChange(row)" style="min-width: 100%">
              <el-option v-for="dict in estimatedCostAccountingSiteColumns" :key="dict.value" :value="dict.value" :label="dict.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="外汇币种" min-width="60">
          <template #header>
            外汇<br />币种
          </template>
          <template #default="{ row }">
            <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span>
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
        <el-table-column label="产品描述" show-overflow-tooltip min-width="140">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                type="textarea" 
                autofocus v-model="row.desc"
             
                @blur="clickCancle($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceInfo" label="价格信息" show-overflow-tooltip min-width="140">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                type="textarea" 
                v-model="row.priceInfo"
                @blur="clickCancle($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.priceInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="url1688" label="1688链接" show-overflow-tooltip min-width="140">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                type="textarea"
                v-model="row.url1688" 
                @blur="clickCancle($event, row)" 
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.url1688 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="price" label="产品价格￥">
          <template #header>
            产品<br />价格￥
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.price" 
                @blur="clickCancle($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="length" label="长">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.length" 
                @blur="clickCancle($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.length }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="width" label="宽">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.width" 
                @blur="clickCancle($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.width }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="height" label="高">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.height" 
                @blur="clickCancle($event, row)" 
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.height }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="weight" label="重量">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.weight" 
                @blur="clickCancle($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.weight }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastMile" label="尾程"></el-table-column>
        <el-table-column prop="lastfirstMileMile" label="头程"></el-table-column>

        <el-table-column prop="packaging" label="打包">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.packaging" 
                @blur="clickCancle($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.packaging }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstMileChannel" label="头程渠道" min-width="130">
          <template #default="{ row }">
            <el-select 
              v-model="row.firstMileChannel" 
              placeholder="请选择"
              @change="handlerEstimatendChange(row)"
              style="min-width: 100%"
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
        <el-table-column prop="sellingPrice" label="售价">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.sellingPrice" 
                @blur="clickCancle($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.sellingPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="grossMarginRate" label="毛利率"></el-table-column>
        <el-table-column prop="roi" label="ROI"></el-table-column>

        <el-table-column prop="weightCoefficient" label="重量系数">
          <template #header>
            重量<br />系数
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.weightCoefficient" 
                @blur="clickCancle($event, row)"
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.weightCoefficient }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="volumeCoefficient" label="体积系数">
          <template #header>
            体积<br />系数
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.volumeCoefficient" 
                @blur="clickCancle($event, row)" 
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.volumeCoefficient }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="tariff" label="关税%">
          <template #default="{ row }">
            <div class="none">
              <el-input 
                v-model="row.tariff" 
                @blur="clickCancle($event, row)" 
                @keydown.enter="effectiveCountInputeHandle($event,row)"
              />
            </div>
            <span>{{ row.tariff ? row.tariff+'%' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platformCommission" label="平台佣金"></el-table-column>
        <el-table-column prop="storageFee" label="仓储费2个月$">
          <template #header>
            仓储费<br />2个月$
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
                  <el-dropdown-item>
                    <el-link type="primary" :underline="false" @click="handlerPicUpload(scope.row,scope.$index)">上传图片</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-link type="primary" :underline="false" @click="handlerCopyData(scope.row)">复制</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-link type="primary" :underline="false" @click="handlerDelete(scope.row)">删除</el-link>
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
  updateEstimatedCostAccountingSort
} from '/@/api/devlocal/evaluation'
import { formatDate } from '/@/utils/dateUtils'

import {
  type SortableEvent,
  VueDraggable
} from 'vue-draggable-plus'

import {
  estimatedCostAccountingSiteColumns,
  firstLegChannelColumns,
  siteReflectCurrencyAndExchangeRate,
} from '../../indexCommon'

import { IEstimatedCostAccounting } from '/@/type/evaluation/evaluationType'

import { ElLink, ElMessageBox, UploadRequestOptions } from 'element-plus'
import debounce from 'lodash/debounce'
import { uploadFileBoBakend } from '/@/api/devlocal/evaluation'
import { focusAndSelectInput, getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'
import { isEqual } from 'lodash'


defineOptions({
    name: 'VabEstimatedCostAccounting',
})

let props = defineProps<{
    flag: boolean
    evaluationId:string
    list: IEstimatedCostAccounting[]
    callParentMethod: (id:number) => void
}>();

const dList = ref<IEstimatedCostAccounting[]>([])
const dflag = ref<boolean>(false)
watchEffect(()=>{
    dList.value = props.list
    dflag.value = props.flag
})

onBeforeMount(() => {
    dList.value.forEach((item: any) => {
        if(item.tariff) {
            item.tariff = (item.tariff * 100).toFixed(0)
        }
    })
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
const effectiveCountInputeHandle = (event: Event,row:any) => {
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
      firstMileChannel: '0',
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
// 修改输入
const changeInput = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
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

// 相当于输入input blur事件
const clickCancle = async (event:any,value:any) =>{

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
  await updateEstimatedCostAccounting({...value, tariff: value.tariff / 100})
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
const handlerEstimatendChange = async (row:IEstimatedCostAccounting) =>{
  await updateEstimatedCostAccounting({...row})
}

// 修改站点
const handlerSiteChange = async (row:IEstimatedCostAccounting) =>{
    row.currencyType = siteReflectCurrencyAndExchangeRate.get(row.site)!
    const {data} = await getExchangeRate({currency:row.currencyType})
    row.foreignExchange = data
    row.site = row.site  
    await updateEstimatedCostAccounting({...row})
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
</style>