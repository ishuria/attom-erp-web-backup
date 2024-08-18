<template>
    <el-dialog 
    v-model="flag" 
    :close-on-click-modal="false"
    :before-close = "handlerCloseDialog"
    title="产品成本核算与推进" 
    width="100%">

        <vab-query-form>
            <vab-query-form-left-panel>
                <el-button type="primary" @click="handlerAddRowCost">新增</el-button>
                <el-button type="primary">新品推进(发布到新品进度管理)</el-button>
            </vab-query-form-left-panel>
        </vab-query-form>

        <el-table 
            :data="list" 
            border stripe 
            @cell-click="changeInput"
            :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
        >
            <el-table-column type="selection" width="38" />

            <el-table-column prop="createTime" label="日期" min-width="110" />

            <el-table-column prop="site" label="站点" min-width="120">
                <template #default="{ row }">
                    <el-select v-model="row.site" placeholder="请选择站点" @change="handlerEstimatendChange(row)">
                        <el-option v-for="dict in estimatedCostAccountingSiteColumns" :key="dict.value"
                            :value="dict.value" :label="dict.label"></el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column prop="imgUrl" label="图片" @click="getCellRowData">
                <template v-slot="scope">
                    <!-- <div @click="getCellRowData(scope.$index)" style="width: 100%;height: 100%;" data-img="f">
                        <el-upload action="#" :show-file-list="false" :http-request="uploadFile"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl" width="40px" />
                            <el-icon style="width: 40px;" v-else>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </div> -->
                    <div @click="getCellRowData(scope.$index)">
                        <el-image style="width: 50px; height: 50px" :src="scope.row.imgUrl" fit="fill" data-img="img" />
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
                <template #default="{ row }">
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
                                    <el-link type="primary" :underline="false">上传图片</el-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-link type="primary" :underline="false" @click="copyData(row)">复制</el-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-link type="primary" :underline="false" @click="handlerDelete(row)">删除</el-link>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <template #footer>
            <div class="dialog-footer">
            </div>
        </template>
    </el-dialog>

    <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
</template>

<script lang="ts" setup>

import { defineProps, defineEmits } from 'vue';

import {  ArrowDown } from '@element-plus/icons-vue'
import { formatDate } from '/@/utils/dateUtils'
import {
  addEstimatedCostAccounting,
  updateEstimatedCostAccounting,
  deleteEstimatedCostAccounting,
  copyEstimatedCostAccounting,
} from '/@/api/devlocal/evaluation'

import {
  estimatedCostAccountingSiteColumns,
  firstLegChannelColumns,
  EstimatedCostAccounting
} from '../indexColumns'

import {getRootElement,
    getSpecificChildren,
    getDataAttribute
} from '/@/utils/nodeUtils'

defineOptions({
    name: 'VabEstimatedCostAccounting',
})

let props = defineProps<{
    flag: boolean
    evaluationId:string
    list: EstimatedCostAccounting[]
    callParentMethod: (id:number) => void
}>();


const emit = defineEmits<{ (e: 'update:visibleValue', value: boolean): void }>()
let imageUploadCellIdx = 0
const imagePreviewVisible = ref<boolean>(false)
const fixed = ref<string>('right')
const estimatedCostAccountingList = ref<any[]>([])
const imagePriviewList = ref<any[]>([])

let {flag,list,evaluationId} = toRefs(props)

// 新增行
const handlerAddRowCost = async () => {

  let newData: any = {
    id:'',
    evaluationId: '',
    createTime: formatDate(new Date()),
    site: '0',
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
  }
 
  const formdata = new FormData()
  formdata.append('evaluationId', evaluationId.value+"")
  
  const {data} = await addEstimatedCostAccounting(formdata)
  if (data){
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

// 图片上传前的check
// const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
//   if (rawFile.type !== 'image/jpeg') {
//     $baseMessage('图片类型只能是image/jpeg!','error','hey')
//     return false
//   } else if (rawFile.size / 1024 / 1024 > 2) {
//     $baseMessage('图片超过了2MB!','error','hey')
//     return false
//   }
//   return true
// }

// 文件上传
// const uploadFile = async (options: UploadRequestOptions) => {
//   const id = list.value[imageUploadCellIdx].id
//   const formdata = new FormData()
//   formdata.append('file', options.file)
//   formdata.append('type', "1")
//   formdata.append('id', id+"")

//   const {data} = await uploadFileBoBakend(formdata);
//   list.value[imageUploadCellIdx].imgUrl = data
//   imagePriviewList.value.push(data)
// }

// 获取点击行的table cell下标
const getCellRowData = (idx:number) =>{
    imagePriviewList.value = []
    imageUploadCellIdx = idx
    imagePriviewList.value.push(list.value[imageUploadCellIdx].imgUrl)   
}

// table单元格双击
// const handlerCellDbClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) =>{
//   // 双击特定只有table中img的才能生效
//   if (getDataAttribute(cell.children[0].children[0],'img') && getSpecificChildren(cell,"img")[0]){
//       imagePreviewVisible.value = true;
//   }
// }

// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}

// 调用子组件的事件,修改父元素的值
const handlerCloseDialog = () =>{
    flag.value = false
    emit('update:visibleValue', false);
}

// 复制
const copyData = async (row:any) => {
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

// 修改
const handlerEstimatendChange = async (row:any) =>{
  await updateEstimatedCostAccounting({...row})
}
</script>

<style lang="scss" scoped>
.none {
  display: none;
}

.block {
  display: block;
}
</style>