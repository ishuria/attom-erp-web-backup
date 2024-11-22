<template>
    <!-- 零件清单 -->
    <div style="width: 100%; flex-grow: 2">
        <vab-query-form style="margin-top: 0;">
            <vab-query-form-left-panel>
                <el-button type="primary" @click="addComponentHandler">新增零件</el-button>
                <el-button type="primary" @click="addSampleHandler">拿样</el-button>
                <el-button type="primary" @click="sampleTrackHandler">样品追踪</el-button>
                <el-button type="primary" @click="handleGetLog">开发日志</el-button>
                <el-button type="primary" @click="handleAddConsumable">添加耗材</el-button>
                <el-button type="primary" @click="handleAddComponent">添加零件</el-button>
            </vab-query-form-left-panel>
        </vab-query-form>

        <el-table ref="progressComponentTable" :data="progressProductList" border :row-class-name="stripedRowClass"
            @cell-click="componentTableInputChange" :span-method="objectSpanMethod" :cell-style="cellStyle"
            :header-cell-style="{ 'text-align': 'center' }" class="noneHoveTable" >

            <el-table-column align="center" fixed="left" label="零件操作" width="120px">
                <template v-slot="scope">
                    <el-dropdown>
                        <el-button text type="primary" @click="uploadProdcutProgressImage(scope.row, scope.$index)">
                            上传图片
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <el-link type="primary" :underline="false"
                                    @click="uploadProdcutProgressImage(scope.row, scope.$index)">上传图片</el-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-link type="primary" :underline="false"
                                        @click="addSuppliserInfo(scope.row)">新增供应商</el-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-link type="primary" :underline="false"
                                        @click="copyComponentInfo(scope.row)">复制</el-link>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>


            <el-table-column label="图片" prop="componentImg" min-width="80" align="center">
                <template v-slot="scope">
                    <div>
                        <el-image v-if="scope.row.componentImg" style="width: 55px;"
                            :src="scope.row.componentImg" fit="contain" data-img="img" />
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="零件名" prop="componentName" min-width="200">
                <template #default="{ row }">
                    <div class="none">
                        <el-input type="textarea" 
                            autofocus
                            v-model="row.componentName"
                            :autosize="{ minRows: 2, maxRows: 7 }" 
                            @blur="componentClickCancle($event, row)"
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>{{ row.componentName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="已有零件id" prop="existingPartId"  min-width="80">
                <template #header>
                    已有零<br>件id
                </template>
                <template #default="{ row }"  >
                    <div>{{ row.existingPartId }}</div>
                </template>
            </el-table-column>

            <el-table-column label="零件数量" prop="componentQuantity" min-width="60">
                <template #header>
                    零件<br>数量
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input 
                            type="text" 
                            v-model="row.componentQuantity"
                            @blur="componentClickCancle($event, row)"
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>{{ row.componentQuantity }}</span>
                </template>
            </el-table-column>

            <el-table-column label="零件单位" prop="componentUnit" min-width="60">
                <template #header>
                    零件<br>单位
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input 
                            type="text" 
                            v-model="row.componentUnit"
                            @blur="componentClickCancle($event, row)" 
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>{{ row.componentUnit }}</span>
                </template>
            </el-table-column>

            <el-table-column label="出厂单价" prop="unitPrice" min-width="70">
                <template #header>
                    出厂<br>单价
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input 
                            type="text" 
                            v-model="row.unitPrice" 
                            @blur="componentClickCancle($event, row)" 
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>{{ row.unitPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column label="出厂总价" prop="totalPrice" min-width="70">
                <template #header>
                    出厂<br>总价
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input 
                            type="text" 
                            v-model="row.totalPrice" 
                            @blur="componentClickCancle($event, row,)" 
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>{{ row.totalPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column label="运费含税" min-width="60" prop="freight">
                <template #header>
                    运费<br>含税
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input 
                            type="text" 
                            v-model="row.freight" 
                            @blur="componentClickCancle($event, row)" 
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>{{ row.freight }}</span>
                </template>
            </el-table-column>

            <el-table-column label="总未税价" prop="preTaxPrice" min-width="70">
                <template #header>
                    总未<br>税价
                </template>
                <template #default="{ row }">
                    <span>{{ row.preTaxPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column label="总含税价" prop="taxIncludedPrice" min-width="70">
                <template #header>
                    总含<br>税价
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input 
                            type="text" 
                            v-model="row.taxIncludedPrice"
                            @blur="componentClickCancle($event, row)" 
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>{{ row.taxIncludedPrice }}</span>
                </template>
            </el-table-column>

            <el-table-column label="货币" width="110px" prop="currency">
                <template #default="{ row }">
                    <el-select v-model="row.currency" placeholder="请选择货币" @change="handlerCurrencyChange(row)"
                        style="min-width: 100%;">
                        <el-option 
                            v-for="dict in currencyList" 
                            :key="dict.value" 
                            :value="dict.value"
                            :label="dict.label" />
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column label="计入产品成本" prop="includedInCost">
                <template #header>
                    计入产<br>品成本
                </template>
                <template #default="{ row }">
                    <el-checkbox 
                        v-model="row.includedInCost" 
                        :true-value="0" 
                        :false-value="1" 
                        size="large"
                        @change="includedInCostChange(row)" 
                        class="custom-checkbox"
                    />
                </template>
            </el-table-column>

            <el-table-column label="供应商" prop="supplier" min-width="140">
                <template #default="{ row }">
                    <div class="none">
                        <el-input 
                            type="text" 
                            autofocus 
                            v-model="row.supplier"
                            @blur="componentClickCancle($event, row)" 
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>
                        <el-text truncated>
                            {{ row.supplier }}
                        </el-text>
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="开票" width="140" prop="invoicing">
                <template #default="{ row }">
                    <el-select v-model="row.invoicing" placeholder="请选择开票类型" @change="handlerInvoicingChange(row)"
                        style="min-width: 100%;">
                        <el-option v-for="dict in invoicingList" :key="dict.value" :value="dict.value"
                            :label="dict.label"></el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column label="实际税点" prop="actualTaxRate" min-width="60">
                <template #header>
                    实际<br>税点
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input 
                            type="text" 
                            v-model="row.actualTaxRate" 
                            @blur="componentClickCancle($event, row)" 
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>{{ row.actualTaxRate }}</span>
                </template>
            </el-table-column>

            <el-table-column label="开票税点" prop="invoicingTaxRate" min-width="60">
                <template #header>
                    开票<br>税点
                </template>
                <template #default="{ row }">
                    <div class="none">
                        <el-input 
                            type="text" 
                            v-model="row.invoicingTaxRate"
                            @blur="componentClickCancle($event, row)" 
                            @keydown.enter="effectiveCountInputeHandle($event,row)"
                        />
                    </div>
                    <span>{{ row.invoicingTaxRate }}</span>
                </template>
            </el-table-column>

            <el-table-column label="采购链接" prop="purchaseLink" min-width="140">
              <template #default="{ row }">
                <div class="none">
                  <el-input 
                    v-model="row.purchaseLink"
                    @blur="componentClickCancle($event, row)"
                    @keydown.enter="effectiveCountInputeHandle($event,row)"
                  />
                </div>  
                <el-tooltip effect="dark" content="" placement="top">
                  <template #content>
                    <div class="custom-tooltip" >{{ row.purchaseLink }}</div>
                  </template>
                  <el-text truncated>{{ row.purchaseLink }}</el-text>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column label="备注" prop="remarks" >
              <template #default="{ row }">
                <div class="none">
                  <el-input 
                    v-model="row.remarks" 
                    @blur="componentClickCancle($event, row)"
                    @keydown.enter="effectiveCountInputeHandle($event,row)"
                  />
                </div>
                <el-tooltip effect="dark" content="" placement="top">
                  <template #content>
                    <div class="custom-tooltip" >{{ row.remarks }}</div>
                  </template>
                  <el-text truncated>{{ row.remarks }}</el-text>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column align="center" fixed="right" label="供应商操作" width="120px">
                <template v-slot="scope">
                    <el-button text type="primary" @click="deleteSupplserOrComponent(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <vab-upload 
            :upload-visible="uploadPicVisible"
            title="上传图片" 
            :is-multiple="false" 
            :fileListFlag="false"
            :dataId="dataId" 
            @update:uploadVisible="updateUploadPicVisible" 
            :upload-file="uploadImageFile" 
        />

        <!-- 样品追踪dialog -->
        <vab-sample-tranck 
            :progress-id="props.progressId" 
            :close-dialog-handler="() => sampleVisible = false"
            :visible="sampleVisible" 
            @update:priviewListValue="settingPriviewList" />

        <!-- 拿样 -->
        <vab-sample 
            :progress-id="props.progressId" 
            :close-dialog="() => sampleFormVisible = false"
            :visible="sampleFormVisible" 
            :refreshComponent="fetchDataComponent"
        />

        <!-- 开发日志显示 -->
        <wangEditor 
            :wangEditorVisible="wangEditorVisible" 
            :title="wangEditorTitle" 
            :content="progressLog"
            :classify='classify' 
            @clickBoolean="clickLogBool" 
            @clickChild="clickLog" 
        />
        <!-- 添加零件 -->
        <VabCreateComponent 
          :createComponentVisible="createComponentVisible"
          @update:createComponentVisible="handleCloseCreateComponent"
          @update:tableValue="handleSubmitComponent"
        />
        <!-- 添加耗材 -->
        <VabCreateConsumable 
          :createConsumableVisible="createConsumableVisible"
          @update:createConsumableVisible="handleCloseCreateConsumable"
          @update:tableValue="handleSubmitConsumable"
        />
    </div>

</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { getRootElement, getSpecificChildren, getDataAttribute, focusAndSelectInput } from '/@/utils/nodeUtils'
import { currencyList, invoicingList } from '../indexCommon'
import { IProgressProdcutComponent, ISuppliersAddReq } from '/@/type/progress/sampleAndComponentType'
import type { TableColumnCtx, TableRefs, UploadRequestOptions } from 'element-plus'
import { convertString } from '/@/utils/stringUtils'
import {
    getComponentList, addComponent,
    addSuppliers, deleteSuppliers,
    copyComponent, componentUploadImage,
    updateComponenet,
    updateProgressLog,
    getProgressCalculation,
    submitProgressComponent,
    submitProgressConsumable
} from '/@/api/devlocal/progressSample'
import { getProgressLog,  } from '/@/api/devlocal/progress'
import wangEditor from '../newProductProgress/wangEditor.vue'
import { ISubmitPurchaseComponent, ISubmitPurchaseConsumable } from '/@/type/purchase/po'
import { isEqual } from 'lodash'


// 图片上传显示控制
const uploadPicVisible = ref<boolean>(false)
// 图片唯一id
const dataId = ref<string>("")
let imageUploadCellIdx = 0
const progressId = ref<string>('')
const wangEditorVisible = ref<boolean>(false)
const progressLog = ref<string>('')
const wangEditorTitle = ref<string>('')
const classify = ref<string>('')
const route = useRoute()
defineComponent({
    name: 'VabComponentList',
})
const secondColumnCellStyle = (row: any, column: any, rowIndex: number, columnIndex: number) => {
  return { padding: '5px 5px' }; // 设置你需要的 padding
};
const props = defineProps<{
    progressId: string
    trialCalculationData: (() => Promise<void>) | undefined
}>();

const formattedPrice = (price: string) => {
    return parseFloat(price).toFixed(2)
}

watchEffect(() => {
    progressId.value = props.progressId
})

const emit = defineEmits<{
    (e: 'update:imagePreviewVisibale', value: boolean): void
    (e: 'update:priviewListValue', value: string): void
}>()

interface SpanMethodProps {
    row: IProgressProdcutComponent
    column: TableColumnCtx<IProgressProdcutComponent>
    rowIndex: number
    columnIndex: number
}
const createComponentVisible = ref<boolean>(false) //添加零件显示与否
const createConsumableVisible = ref<boolean>(false) //添加耗材显示与否
// 关闭添加零件对话框
const handleCloseCreateComponent = (value: boolean) => {
  createComponentVisible.value = value
}
// 关闭添加耗材对话框
const handleCloseCreateConsumable = (value: boolean) => {
  createConsumableVisible.value = value
}
// 提交添加零件传递的值
const handleSubmitComponent = async (value: any) => {
 
  let list: ISubmitPurchaseComponent[] = []
  value.map((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id), 
        sku: item.sku,                   
        suppliserId: Number(item.suppliserId),   
        count: Number(item.count)                 
      })
    }
 })
 try {
   const { data } = await submitProgressComponent({
    progressId: Number(route.query.progressId),
     list
   })
   if (data === true) {
     $baseMessage('添加零件提交成功', 'success', 'hey')
     fetchDataComponent()
   }
 } catch (error) {
   console.error(error)
 }
}
// 提交添加耗材传递的值
const handleSubmitConsumable = async (value: any) => {
  let list: ISubmitPurchaseConsumable[] = []
  value.map((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id),         
        suppliserId: Number(item.suppliserId),   
        count: Number(item.count)                 
      })
    }
 })
 try {
   const { data } = await submitProgressConsumable({
    progressId: Number(route.query.progressId),
    list
   })
   if (data === true) {
     $baseMessage('添加耗材提交成功', 'success', 'hey')
     fetchDataComponent()
   }
 } catch (error) {
   console.error(error)
 }
}
// 展示添加零件对话框
const handleAddComponent = () => {
  createComponentVisible.value = true
}
// 展示添加耗材对话框
const handleAddConsumable = () => {
  createConsumableVisible.value = true
}
let previous: any = null; 
let currentGroupIndex = 0; // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row;
  const currentId = row.componentId;
  // 检查当前行是否与上一行不同
  if (currentId !== previous) {
    previous = currentId; 
    currentGroupIndex++; 
  }

  // 根据当前组索引设置条纹样式
  return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : '';
};

// 零件清单列表
const progressProductList = ref<IProgressProdcutComponent[]>([])
// 零件table ref
const progressComponentTable = ref<TableRefs>()
// 样品追踪flag
const sampleVisible = ref<boolean>(false)
// 拿样flag
const sampleFormVisible = ref<boolean>(false)


// 零件清单修改开票
const handlerInvoicingChange = async (row: IProgressProdcutComponent) => {
    await updateComponenet(row)
    fetchDataComponent()
    props.trialCalculationData?.()
}

// 零件清单修改货币
const handlerCurrencyChange = async (row: IProgressProdcutComponent) => {
    await updateComponenet(row)
    props.trialCalculationData?.()
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
   
    if  (data.columnIndex === 3 || data.columnIndex === 9){        
    
        return {
                    // backgroundColor: '#f5f5f5',
                    color: '#bbb',
                    cursor: 'not-allowed',
                    textAlign:'center'
                } 
    }else if(data.columnIndex === 1) {
        return { padding: '0px' }
    }else {
        return {
            textAlign:'center'
        }
    }
}

// 新增零件
const addComponentHandler = async () => {
    const newComponent: IProgressProdcutComponent = {
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
    const { data } = await addComponent({ progressId: newComponent.progressId })
    newComponent.componentId = data.componentId
    newComponent.supplierId = data.supplierId

    progressProductList.value.push(newComponent)

    fetchDataComponent()
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

// 零件清单上传图片
const uploadProdcutProgressImage = async (row: IProgressProdcutComponent, idx: number) => {
    uploadPicVisible.value = true
    dataId.value = row.componentId + ""
    imageUploadCellIdx = idx

}

const updateUploadPicVisible = (newV: boolean) => {
    uploadPicVisible.value = newV
}


// 上传文件
const uploadImageFile = async (options: UploadRequestOptions) => {
    const formdata = new FormData()
    formdata.append('file', options.file)
    formdata.append('componentId', dataId.value)

    try {
        const { data } = await componentUploadImage(formdata);
        if (data) {
            $baseMessage("零件图片上传成功！", "success", "hey")
            progressProductList.value[imageUploadCellIdx].componentImg! = data
            uploadPicVisible.value = false
        }
    } catch (err) {
        const error = err as Error;
        console.error(error)
        $baseMessage("零件图片上传失败！", "error", "hey")
    }

}


// 添加供应商
const addSuppliserInfo = async (row: IProgressProdcutComponent) => {
    const newComponentAndSuppliserInfo: IProgressProdcutComponent = {
        // 进度id
        progressId: props.progressId,
        // 零件id
        componentId: row.componentId,
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
    // console.log(row)
    const params: ISuppliersAddReq = {
        componentId: convertString(row.componentId!)
    }

    const { data } = await addSuppliers(params)
    newComponentAndSuppliserInfo.supplierId = data

    // 将供应商信息数据push到数组
    progressProductList.value.push(newComponentAndSuppliserInfo)

    // 必须进行排序，且只有相邻才能跨行
    progressProductList.value.sort((a: IProgressProdcutComponent, b: IProgressProdcutComponent) => a.componentId! - b.componentId!)
    fetchDataComponent()
}

// 删除供应商，当零件只有一个供应商时，删除供应商连同零件一起删除
const deleteSupplserOrComponent = async (row: IProgressProdcutComponent) => {
    try {
        const deleteVNode = h('div', {}, [
            h('p', {}, '确认要删除供应商嘛？'),
            h('p', {
                style: {
                    color: 'red'
                }
            }, '注意：如果当零件只有一个供应商时，删除供应商连同零件一起删除！')
        ]);
        $baseConfirm(deleteVNode, "系统提示", async () => {
            const { data } = await deleteSuppliers({ suppliserId: row.supplierId! })
            if (data === true) {
                const index = progressProductList.value.findIndex((item: IProgressProdcutComponent) => item.supplierId === row.supplierId);
                if (index !== -1) {
                    progressProductList.value.splice(index, 1);
                    props.trialCalculationData?.()
                }
                $baseMessage("供应商删除成功！", "success", "hey")
            }
        })
    } catch (e) {
        console.log(e as Error)
    }
}

// 零件复制
const copyComponentInfo = async (row: IProgressProdcutComponent) => {
    // 获取该零件下的所有供应商id
    const suppliserIds: number[] = []
    progressProductList.value.forEach((item: IProgressProdcutComponent) => {
        if (item.componentId === row.componentId) {
            suppliserIds.push(item.supplierId!)
        }
    })

    const { data } = await copyComponent({ componentId: row.componentId!, supplierIds: suppliserIds.join(",") })
    if (data === true) {
        $baseMessage("零件供应商信息复制成功！", "success", "hey")
        fetchDataComponent()
    }
}
let clickColumn: any
let rowCopy: any
// 零件清单table单击修改
const componentTableInputChange = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {

  // 不能被修改cell的下标
  if (column.no === 3) return
  clickColumn = column
  rowCopy = JSON.parse(JSON.stringify(row))

  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el, 'img') && getSpecificChildren(cell, "img")[0]) {
      emit("update:priviewListValue", row.componentImg)
      emit("update:imagePreviewVisibale", true)
  }

  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }
}

// 零件清单table blur事件
const componentClickCancle = async (event: any, value: IProgressProdcutComponent) => {

  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(rowCopy, value)) {
    return
  }

  const query: IProgressProdcutComponent = {
      progressId: value.progressId,
      supplierId: value.supplierId,
      componentId: value.componentId,
      [clickColumn.property]: value[clickColumn.property],
  }

  await updateComponenet(value)
  fetchDataComponent()
  props.trialCalculationData?.()
}

// 计入成本change
const includedInCostChange = async (row: IProgressProdcutComponent) => {
    await updateComponenet(row)
    props.trialCalculationData?.()
}


// 鼠标enter事件
const effectiveCountInputeHandle = (event: Event,row:any) => {
    const targetElement = event.target as HTMLInputElement
    targetElement.blur()
}

// 样品追踪
const sampleTrackHandler = async () => {
    sampleVisible.value = true
}

// 添加样品Handler处理
const addSampleHandler = async () => {
    sampleFormVisible.value = true
}

// 样品table
const settingPriviewList = (imageUr: string) => {
    emit("update:priviewListValue", imageUr)
    emit("update:imagePreviewVisibale", true)
}


// 获取零件清单数据
const fetchDataComponent = async () => {
    try {
        // 零件列表
        const { data } = await getComponentList({ progressId: progressId.value! })
        progressProductList.value = data

        progressProductList.value.forEach((item: any) => {
            item.unitPrice = formattedPrice(item.unitPrice)
            item.totalPrice = formattedPrice(item.totalPrice)
        })
        progressProductList.value.sort((a: IProgressProdcutComponent, b: IProgressProdcutComponent) => a.componentId! - b.componentId!)
        previous = null
        currentGroupIndex = 0
    } catch (e) {
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
    if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
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

const handleGetLog = async () => {
    const { data } = await getProgressLog({ progressId: parseInt(props.progressId) })
    wangEditorVisible.value = true
    progressLog.value = data
    wangEditorTitle.value = '查看开发日志'
    classify.value = 'progressLog'
}
const clickLogBool = (val: any) => {
    wangEditorVisible.value = val
}
/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
    // console.log('新的val', val);
    progressLog.value = val
    await updateProgressLog({ progressId: parseInt(props.progressId), progressLog: progressLog.value }) //发送更新数据请求
}
onMounted(async () => {
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
.deleteConfirmFont {
    color: red;
    font-weight: bolder;
}

// 设置行高
:deep(.noneHoveTable .el-table .el-table__body .cell) {
    max-height: 50px;
}

:deep(.left-panel) {
    margin-bottom: 0 !important;
}

.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}

/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>