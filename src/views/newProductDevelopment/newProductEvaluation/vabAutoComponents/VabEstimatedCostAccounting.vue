<template>
    
    <el-dialog 
    v-model="dflag" 
    :close-on-click-modal="false"
    :before-close = "handlerCloseDialog"
    title="产品成本核算与推进" 
    width="100%">

        <vab-query-form>
            <vab-query-form-left-panel>
                <el-button type="primary" @click="handlerAddRowCost">新增</el-button>
                <el-button type="primary" @click="handlerProductProgress">新品推进(发布到新品进度管理)</el-button>
            </vab-query-form-left-panel>
        </vab-query-form>

        <VueDraggable
            v-model="dlist"
            :animation="150"
            ghostClass="ghost"
            target="tbody"
            @end="onEnd"
        >
            <el-table 
                :data="dlist" 
                border stripe 
                @cell-click="changeInput"
                :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="38" />

                <el-table-column prop="createTime" label="日期" min-width="110" />

                <el-table-column prop="site" label="站点" min-width="120">
                    <template #default="{ row }">
                        <el-select v-model="row.site" placeholder="请选择站点" @change="handlerSiteChange(row)">
                            <el-option v-for="dict in estimatedCostAccountingSiteColumns" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column label="外汇币种">
                    <template #default="{ row }">
                        <span>{{siteReflectCurrencyAndExchangeRate.get(row.site)}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="汇率">
                    <template #default="{ row }">
                        <span>{{row.foreignExchange}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="imgUrl" label="图片">
                    <template v-slot="scope">
                        <div @click="getCellRowData(scope.$index)">
                            <el-image v-if="scope.row.imgUrl" style="width: 50px; height: 50px" :src="scope.row.imgUrl" fit="fill" data-img="img" />
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="产品描述">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="textarea" autofocus v-model="row.desc" :autosize="{ minRows: 3, maxRows: 9 }"
                                @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.desc }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="priceInfo" label="价格信息">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.priceInfo" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.priceInfo }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="url1688" label="1688链接">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.url1688" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.url1688 }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="price" label="产品价格￥">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.price" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.price }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="length" label="长">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.length" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.length }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="width" label="宽">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.width" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.width }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="height" label="高">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.height" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.height }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="weight" label="重量">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.weight" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.weight }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="lastMile" label="尾程">
                </el-table-column>

                <el-table-column prop="lastfirstMileMile" label="头程">
                </el-table-column>

                <el-table-column prop="packaging" label="打包">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.packaging" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.packaging }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="firstMileChannel" label="头程渠道" min-width="120">
                    <template #default="{ row }">
                        <el-select 
                            v-model="row.firstMileChannel" 
                            placeholder="请选择头程渠道"
                            @change="handlerEstimatendChange(row)"
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
                            <el-input type="text" v-model="row.sellingPrice" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.sellingPrice }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="grossMarginRate" label="毛利率">
                </el-table-column>

                <el-table-column prop="roi" label="ROI">
                </el-table-column>

                <el-table-column prop="weightCoefficient" label="重量系数">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.weightCoefficient" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.weightCoefficient }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="volumeCoefficient" label="体积系数">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.volumeCoefficient" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.volumeCoefficient }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="tariff" label="关税%">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.tariff" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.tariff }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="platformCommission" label="平台佣金">
                </el-table-column>

                <el-table-column prop="storageFee" label="仓储费2个月$">
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
        <template #footer>
            <div class="dialog-footer">
            </div>
        </template>
    </el-dialog>

    <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>

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
import {  ArrowDown } from '@element-plus/icons-vue'
import { formatDate } from '/@/utils/dateUtils'
import {
  addEstimatedCostAccounting,
  updateEstimatedCostAccounting,
  deleteEstimatedCostAccounting,
  copyEstimatedCostAccounting,
  getExchangeRate,
  addEstimatedCostAccountingProductRelease,
  updateEstimatedCostAccountingSort
} from '/@/api/devlocal/evaluation'

import {
  type SortableEvent,
  VueDraggable
} from 'vue-draggable-plus'

import {
  estimatedCostAccountingSiteColumns,
  firstLegChannelColumns,
  siteReflectCurrencyAndExchangeRate,
  
} from '../../indexCommon'

import {IEstimatedCostAccounting} from '/@/type/evaluation/evaluationType'

import {getRootElement,getSpecificChildren,getDataAttribute} from '/@/utils/nodeUtils'
import { ElLink, ElMessageBox, UploadProps, UploadRequestOptions } from 'element-plus';
import {convertString} from '/@/utils/stringUtils'
import debounce from 'lodash/debounce'
import { uploadFileBoBakend } from '/@/api/devlocal/evaluation'


defineOptions({
    name: 'VabEstimatedCostAccounting',
})

let props = defineProps<{
    flag: boolean
    evaluationId:string
    list: IEstimatedCostAccounting[]
    callParentMethod: (id:number) => void
}>();

const dlist = ref<IEstimatedCostAccounting[]>([])
const dflag = ref<boolean>(false)
watchEffect(()=>{
    dlist.value = props.list
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
const imagePriviewList = ref<string[]>([])
const selectRows = ref<IEstimatedCostAccounting[]>([])
const router = useRouter()
let {list,evaluationId} = toRefs(props)


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
  formdata.append('sort', convertString(dlist.value.length + 1))
  
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

// 修改输入
const changeInput = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el,'img') && getSpecificChildren(cell,"img")[0]){
      imagePreviewVisible.value = true;
  }

  if (!cell.children[0].children[0] 
    || !cell.children[0].children[1]
    || !cell.children[0].children[0].classList
    || !cell.children[0].children[1].classList
  ){
    return
  }

  cell.children[0].children[0].classList.remove('none')
  cell.children[0].children[1].classList.add('none')

  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
      inputElement.focus()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
    }
  }
  
}

// 相当于输入input blur事件
const clickCancle = async (event:any,value:any) =>{

  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }

  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  await updateEstimatedCostAccounting({...value})

}


// 获取点击行的table cell下标
const getCellRowData = (idx:number) =>{
    imagePriviewList.value = []
    imageUploadCellIdx = idx
    imagePriviewList.value.push(list.value[imageUploadCellIdx].imgUrl)   
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
        const idList = dlist.value.map((item:IEstimatedCostAccounting) =>{
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
        imagePriviewList.value = []
        list.value[imageUploadCellIdx].imgUrl = data
        imagePriviewList.value.push(data)   
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
</style>