<template>
    <!-- 零件清单 -->
    <div style="width: 100%; height: 600px;">
        <vab-query-form>
            <vab-query-form-left-panel>
                <el-button type="primary" @click="addComponentHandler">新增零件</el-button>
                <el-button type="primary">拿样</el-button>
                <el-button type="primary">样品追踪</el-button>
                <el-button type="primary">开发日志</el-button>
                <el-button type="primary">添加耗材</el-button>
                <el-button type="primary">添加零件</el-button>
            </vab-query-form-left-panel>
        </vab-query-form>

        <el-table 
            ref="progressComponentTable"
            :data="progressProductList" 
            border stripe 
            @cell-click="progressProductChangeInput"
            :span-method="objectSpanMethod"
            height="400"
            :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
        >

            <el-table-column align="center" fixed="left" label="操作" width="120px">
                <template v-slot="scope">
                    <el-dropdown>
                        <el-button text type="primary">
                            上传图片
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <el-link type="primary" :underline="false" @click="addSuppliserInfo(scope.row)">新增供应商</el-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-link type="primary" :underline="false" @click="copyComponentInfo(scope.row)">复制</el-link>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>


            <el-table-column  label="图片">
                <template v-slot="scope">
                    <div>
                        <el-image v-if="scope.row.componentImg" style="width: 50px; height: 50px" :src="scope.row.componentImg" fit="fill" data-img="img" />
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="零件名">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="textarea" autofocus v-model="row.componentName" :autosize="{ minRows: 3, maxRows: 9 }"
                            @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.componentName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="已有零件id">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.skuComponentId" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.skuComponentId }}</span>
                </template>
            </el-table-column>

            <el-table-column label="零件数量">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.componentQuantity" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.componentQuantity }}</span>
                </template>
            </el-table-column>

            <el-table-column label="零件单位">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.componentUnit" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.componentUnit }}</span>
                </template>
            </el-table-column>

            <el-table-column label="出厂单价">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.unitPrice" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.unitPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column label="出厂总价">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.totalPrice" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.totalPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column label="运费（含税）" min-width="85">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.freight" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.freight }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="总价未税价">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.preTaxPrice" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.preTaxPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="总含税价">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.taxIncludedPrice" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.taxIncludedPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column label="货币" min-width="110">
                <template #default="{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币" @change="handlerCurrencyChange(row)">
                        <el-option v-for="dict in currencyList" :key="dict.value"
                            :value="dict.value" :label="dict.label"></el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column  label="计入产品成本">
            </el-table-column>

            <el-table-column  label="供应商">
            </el-table-column>

            <el-table-column label="开票" min-width="110">
                <template #default="{ row }">
                    <el-select v-model="row.invoicing" placeholder="请选择开票类型" @change="handlerInvoicingChange(row)">
                        <el-option v-for="dict in invoicingList" :key="dict.value"
                            :value="dict.value" :label="dict.label"></el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column  label="实际税点">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.actualTaxRate" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.actualTaxRate }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="开票税点">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.invoicingTaxRate" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.invoicingTaxRate }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="采购链接">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.purchaseLink" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.purchaseLink }}</span>
                </template>
            </el-table-column>

            <el-table-column  label="备注">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="text" v-model="row.remarks" @blur="clickCancle($event, row)" />
                    </div>
                    <span>{{ row.remarks }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" fixed="right" label="操作" width="120px">
                <template v-slot="scope">
                    <el-button text type="primary" @click="deleteSupplserOrComponent(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 拿样清单成本试算 -->
        <el-row style="padding-top:20px;">
            <el-col :span="1" class="sample">
                <div><strong>拿样清单成本试算</strong></div>
            </el-col>
            <el-col :span="23">
                <el-table 
                :data="sampleList" 
                border stripe
                height="120"
                :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }"
            >

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
                        <span>{{siteReflectCurrencyAndExchangeRate.get(row.currencyType)}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="汇率">
                    <template #default="{ row }">
                        <span>{{row.foreignExchange}}</span>
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

                <el-table-column prop="price" label="实际产品总成本">
                    <template #default="{ row }">
                        <div class="none">
                            <el-input type="text" v-model="row.totalCost" @blur="clickCancle($event, row)" />
                        </div>
                        <span>{{ row.totalCost }}</span>
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


                <el-table-column align="center" fixed="right" label="操作" width="120px">
                    <template v-slot="scope">
                        <el-button text type="primary">
                            逆算
                        </el-button>
                        <el-button text type="primary">
                            保存
                        </el-button>
                    </template>
                </el-table-column>
                </el-table>
            </el-col>
        </el-row>
       
    </div>
</template>

<script lang="ts" setup>
import {  ArrowDown } from '@element-plus/icons-vue'
import {getRootElement} from '/@/utils/nodeUtils'
import {firstLegChannelColumns,estimatedCostAccountingSiteColumns,
     siteReflectCurrencyAndExchangeRate,currencyList,invoicingList } from '../indexCommon'
import { IProgressEstimatedCostAccounting,IProgressProdcutComponent,IProgressSample, ISuppliersAddReq } from '/@/type/progress/sampleAndComponentType'
import type { TableColumnCtx, TableRefs } from 'element-plus'
import {getExchangeRate} from '/@/api/devlocal/evaluation'
import {convertString} from '/@/utils/stringUtils'
import {getComponentList,addComponent,addSuppliers,deleteSuppliers,copyComponent} from '/@/api/devlocal/progressSample'


defineOptions({
    name: 'VabComponentList',
})

const props = defineProps<{
    progressId:string
}>();


interface SpanMethodProps {
  row: IProgressProdcutComponent
  column: TableColumnCtx<IProgressProdcutComponent>
  rowIndex: number
  columnIndex: number
}

// 拿样清单列表
const sampleList = ref<IProgressSample[]>([])

// 零件清单列表
const progressProductList = ref<IProgressProdcutComponent[]>([])

const progressComponentTable = ref<TableRefs>()

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


// 零件清单修改开票
const handlerInvoicingChange = async (row:IProgressEstimatedCostAccounting) =>{

}

// 零件清单修改货币
const handlerCurrencyChange = async (row:IProgressEstimatedCostAccounting) =>{

}

// 零件清单单击表格修改
const progressProductChangeInput = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
    
}

// 修改站点
const handlerSiteChange = async (row:IProgressEstimatedCostAccounting) =>{
    row.currencyType = siteReflectCurrencyAndExchangeRate.get(row.site)!
    const { data } = await getExchangeRate({currency:row.currencyType})
    row.foreignExchange = data
    row.site = row.site  
    // 调用修改接口
}

// 新增零件
const addComponentHandler = async () =>{
    const newComponent:IProgressProdcutComponent  = {
         // 进度id
        progressId: props.progressId,
        // 零件图片
        componentImg: "",
        // 零件名
        componentName: "",
        // 已有零件id
        skuComponentId: null,
        // 零件数量
        componentQuantity: null,
        // 零件单位
        componentUnit: "",
        // 供应商id
        supplierId: null,
        // 出厂单价
        unitPrice: null,
        // 出厂总价
        totalPrice: null,
        // 运费（含税）
        freight: null,
        // 总价未税价
        preTaxPrice: null,
        // 总含税价
        taxIncludedPrice: null,
        // 货币 0人民币 1USD 2EUR
        currency: "0",
        // 0计入成本  1不计入成本
        includedInCost: "1",
        // 供应商
        supplier: "",
        // 0专票 1普票 2无法开票
        invoicing: "0",
        // 实际税点
        actualTaxRate: null,
        // 开票税点
        invoicingTaxRate: null,
        // 采购链接
        purchaseLink: "",
        // 备注
        remarks: ""
    }
    
    // 新增新零件
    const {data} = await addComponent({progressId:newComponent.progressId})
    newComponent.componentId = data.componentId
    newComponent.supplierId = data.supplierId

    progressProductList.value.push(newComponent)
    
    // 自动滚动到最新的添加行
    nextTick(() => {
        if (progressComponentTable.value) {
            const $bodyWrapper = progressComponentTable.value.$el.querySelector(".el-table__body");
            if ($bodyWrapper) {
                progressComponentTable.value.setScrollTop($bodyWrapper.scrollHeight);
            }
        }
    })
}

// 添加供应商
const addSuppliserInfo = async (row:IProgressProdcutComponent) =>{
    const newComponentAndSuppliserInfo:IProgressProdcutComponent = {
         // 进度id
        progressId: props.progressId,
        // 零件id
        componentId:row.componentId,
        // 零件图片
        componentImg: "",
        // 零件名
        componentName: "",
        // 已有零件id
        skuComponentId: null,
        // 零件数量
        componentQuantity: null,
        // 零件单位
        componentUnit: "",
        // 供应商id
        supplierId: null,
        // 出厂单价
        unitPrice: null,
        // 出厂总价
        totalPrice: null,
        // 运费（含税）
        freight: null,
        // 总价未税价
        preTaxPrice: null,
        // 总含税价
        taxIncludedPrice: null,
        // 货币 0人民币 1USD 2EUR
        currency: "0",
        // 0计入成本  1不计入成本
        includedInCost: "1",
        // 供应商
        supplier: "",
        // 0专票 1普票 2无法开票
        invoicing: "0",
        // 实际税点
        actualTaxRate: null,
        // 开票税点
        invoicingTaxRate: null,
        // 采购链接
        purchaseLink: "",
        // 备注
        remarks: ""
    }
    console.log(row)
    const params:ISuppliersAddReq = {
        componentId: convertString(row.componentId!)
    }

   const {data} =  await addSuppliers(params)
   newComponentAndSuppliserInfo.supplierId = data

   // 将供应商信息数据push到数组
   progressProductList.value.push(newComponentAndSuppliserInfo)

   // 必须进行排序，且只有相邻才能跨行
   progressProductList.value.sort((a:IProgressProdcutComponent,b:IProgressProdcutComponent) => a.componentId! - b.componentId!)

}

// 删除供应商，当零件只有一个供应商时，删除供应商连同零件一起删除
const deleteSupplserOrComponent = async (row:IProgressProdcutComponent) =>{
   try {
    const deleteVNode = h('div', { }, [
        h('p', {}, '确认要删除供应商嘛？'),
        h('p', {
                style: {
                color: 'red'
            }
        }, '注意：如果当零件只有一个供应商时，删除供应商连同零件一起删除！')
    ]);
    $baseConfirm(deleteVNode,"系统提示", async ()=>{
       const {data} = await deleteSuppliers({suppliserId:row.supplierId!})
       if (data === true){
        const index = progressProductList.value.findIndex((item:IProgressProdcutComponent) => item.supplierId === row.supplierId);
        if (index !== -1) {
            progressProductList.value.splice(index, 1);
        }
        $baseMessage("供应商删除成功！","success","hey")
       }
    })
   } catch(e){
     console.log(e as Error)
   }
}

// 零件复制
const copyComponentInfo = async (row:IProgressProdcutComponent)=>{
    console.log(row)
    // 获取该零件下的所有供应商id
    const suppliserIds:number[] = [] 
    progressProductList.value.forEach((item:IProgressProdcutComponent) => {
        if (item.componentId === row.componentId){
            suppliserIds.push(item.supplierId!)
        }
    })

    const {data} = await copyComponent({componentId:row.componentId!,supplierIds:suppliserIds.join(",")})
    if (data === true){
        $baseMessage("零件供应商信息复制成功！","success","hey")
        fetchDataComponent()
    }
    
}


// 获取零件清单数据
const fetchDataComponent = async () =>{
    try {
        // 零件列表
        const {data} = await getComponentList({progressId:props.progressId})
        progressProductList.value = data
        progressProductList.value.sort((a:IProgressProdcutComponent,b:IProgressProdcutComponent) => a.componentId! - b.componentId!)
    }catch(e){
        console.error(e as Error)
    }
}


// 零件清单列表col合并方法
const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
    // 设置需要合并的列
    if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
      // 获取当前row的零件id
      const componentId = row.componentId;
      // 默认不跨行
      let rowspan = 1;
      // 遍历后端返回的数据
      for (let i = rowIndex + 1; i < progressProductList.value.length; i++) {
        // 如果零件id一样需要合并
        if (progressProductList.value[i].componentId === componentId) {
          rowspan++;
        } else {
          break;
        }
      }

      // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
      if (rowIndex === 0 || progressProductList.value[rowIndex - 1].componentId !== componentId) {
        return { rowspan, colspan: 1 };
      } else {
        return { rowspan: 0, colspan: 0 };
      }
   }
}

onMounted(async ()=>{
    fetchDataComponent()
})

</script>

<style lang="scss" scoped>
.none {
  display: none;
}

.block {
  display: block;
}

/** 删除configrm框样式 */
.deleteConfirmFont{
  color: red;
  font-weight: bolder;
}

.sample {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-top: 1px solid rgb(235, 238, 245);
    border-left: 1px solid rgb(235, 238, 245);
    border-bottom: 1px solid rgb(235, 238, 245);
    font-weight: bold;
}
</style>