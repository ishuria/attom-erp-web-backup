<template>

    <!-- 成本核算 -->
    <div style="width: 100%; padding-top:25px;height: 330px;">
        <div class="el-page-header__content"><strong>成本核算</strong></div>
        <el-divider style="margin:10px 0"/>
        
        <vab-query-form>
            <vab-query-form-left-panel>
                <el-button type="primary">新增</el-button>
            </vab-query-form-left-panel>
        </vab-query-form>

        <VueDraggable
            v-model="estimatedCostList"
            :animation="150"
            ghostClass="ghost"
            target="tbody"
            @end="onEnd"
        >
            <el-table 
                :data="estimatedCostList" 
                border stripe
                height="330"
                @cell-click="costAccountingChangeInput"
                :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
            >

                <el-table-column prop="createTime" label="日期" min-width="110">
                    <template #default="{row}">
                        <span>{{ formatDate(new Date(row.createTime)) }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="站点" min-width="120">
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

                <el-table-column  label="图片">
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

                <el-table-column label="价格信息">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.priceInfo" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.priceInfo }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="1688链接">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.url1688" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.url1688 }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="产品价格￥">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.price" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.price }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="长">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.length" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.length }}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="宽">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.width" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.width }}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="高">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.height" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.height }}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="重量">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.weight" @blur="clickCancle($event, row)" />
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
                            <el-input type="text" v-model="row.packaging" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.packaging }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="头程渠道" min-width="120">
                    <template #default="{ row }">
                        <el-select 
                            v-model="row.firstMileChannel" 
                            placeholder="请选择头程渠道"
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
                            <el-input type="text" v-model="row.sellingPrice" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.sellingPrice }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="grossMarginRate" label="毛利率" />
                

                <el-table-column prop="roi" label="ROI" />

                <el-table-column label="重量系数">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.weightCoefficient" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.weightCoefficient }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="体积系数">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.volumeCoefficient" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.volumeCoefficient }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="关税%">
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
                                        <el-link type="primary" :underline="false">上传图片</el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false">复制</el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-link type="primary" :underline="false">删除</el-link>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </VueDraggable>

    </div>
</template>

<script lang="ts" setup>
import {  ArrowDown } from '@element-plus/icons-vue'
import {getRootElement,getSpecificChildren,getDataAttribute} from '/@/utils/nodeUtils'
import { IProgressEstimatedCostAccounting } from '/@/type/progress/sampleAndComponentType'
import debounce from 'lodash/debounce'
import {formatDate} from '/@/utils/dateUtils'
import {type SortableEvent, VueDraggable} from 'vue-draggable-plus'
import {getExchangeRate} from '/@/api/devlocal/evaluation'
import {getCostAccountingList} from '/@/api/devlocal/progressSample'
import {
  estimatedCostAccountingSiteColumns,
  firstLegChannelColumns,
  siteReflectCurrencyAndExchangeRate,
} from '../indexCommon'


const props = defineProps<{
    progressId:string
}>();

defineComponent({
    name:"VabCostAccounting"
})

// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 成本核算列表
const estimatedCostList = ref<IProgressEstimatedCostAccounting[]>([])

// 上传图片下标
let imageUploadCellIdx = 0

// 输入input blur事件
const clickCancle = async (event:any,value:any) =>{

    const t1 = getRootElement(event["srcElement"],".cell").children[0]
    if (t1){
        t1.classList.add("none")
    }

    const t2 = getRootElement(event["srcElement"],".cell").children[1]
    if (t2){
        t2.classList.remove("none")
    }
}

// 获取点击行的table cell下标
const getCellRowData = (idx:number) =>{
    imagePriviewList.value = []
    imageUploadCellIdx = idx
    imagePriviewList.value.push(estimatedCostList.value[imageUploadCellIdx].imgUrl)   
}


// 成本核算单击表格修改
const costAccountingChangeInput = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
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

// 进度成本核算修改站点
const handlerSiteChange = async (row:IProgressEstimatedCostAccounting) =>{
    row.currencyType = siteReflectCurrencyAndExchangeRate.get(row.site)!
    const {data} = await getExchangeRate({currency:row.currencyType})
    row.foreignExchange = data
    row.site = row.site  
    
}


// 内容拖拽排序
const onEnd = debounce(async (e: SortableEvent ) => {
    
},1000)

// 获取成本核算数据列表
const fetchDataCostAccounting = async ()=>{
    try {
        // 成本核算列表
        const {data} = await getCostAccountingList({progressId:props.progressId})
        estimatedCostList.value = data
    }catch(e){
        console.error(e as Error)
    }
}

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
</style>