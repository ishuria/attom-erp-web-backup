<template>
  <div class="comprehensive-table-container auto-height-container">
      <vab-query-form>
        <vab-query-form-top-panel>
          <h2>耗材信息</h2>
        </vab-query-form-top-panel>
          <vab-query-form-left-panel>
              <el-button type="primary" @click="handleAddConsumable">创建耗材</el-button>
              <el-button type="primary" @click="handleConsumableType">耗材种类</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                  @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
      </vab-query-form>
          <el-table 
              ref="tableRef" 
              stripe border 
              :data="list" 
              :header-cell-style="{ 'text-align': 'center' }"
              @cell-click="changeInput"
           
              :cell-style="cellStyle"
              class="noneHoveTable"
          >
              <el-table-column align="center" label="图片" class="image-wall" min-width="100">
                  <template #default="{ row, $index }">
                      <el-upload 
                          list-type="picture-card" 
                          :file-list="row.imageList" 
                          :class="{ hide: row.hide }"
                          :http-request="(File) => uploadImage(File, row)"
                      >
                          <el-icon ><Plus /></el-icon>
                          <template #file="{ file }">
                              <div>
                                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                  <span class="el-upload-list__item-actions">
                                      <span
                                          class="el-upload-list__item-preview"
                                          @click="handlePictureCardPreview(file, row)"
                                      >
                                          <el-icon><zoom-in /></el-icon>
                                      </span>
                                      <span
                                          class="el-upload-list__item-delete"
                                          @click="handleRemove(file, row)"
                                      >
                                          <el-icon><Delete /></el-icon>
                                      </span>
                                  </span>
                              </div>
                          </template>
                      </el-upload>
                  </template>
              </el-table-column>
              <el-table-column label="零件ID" align="center" min-width="70" prop="existingPartsListId" width="100">
                  <template #default="{ row }">
                      <span >{{ row.existingPartsListId }}</span>
                  </template>
              </el-table-column>   
              <el-table-column label="耗材名" prop="componentName" width="120">
                  <template #default="{ row }">
                      <span >{{ row.componentName }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="按单采购" prop="status" align="center" min-width="90">
                <template #default = "{ row }">
                    <el-checkbox v-model="row.status" :true-value="1" :false-value="0" class="custom-checkbox"  @change="handleConsumablesUpdate(row)"/>
                </template>
              </el-table-column>
              <el-table-column label="单位"  min-width="70" prop="unit" align="center">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.unit" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.unit }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="出厂单价" prop="unitPrice" min-width="70" align="center">
                  <template #header>
                      出厂<br>单价
                  </template>
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.unitPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.unitPrice }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="未税价" prop="preTaxPrice" align="center" min-width="80">
                  <template #default="{ row }">
                      <span >{{ row.preTaxPrice }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="含税价" prop="taxIncludedPrice" align="center" min-width="80">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.taxIncludedPrice" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>{{ row.taxIncludedPrice }}</span>
                  </template>
              </el-table-column>    
              <el-table-column label="货币" width="110px" prop="currency">
                  <template #default="{ row }">
                      <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="handleConsumablesUpdate(row)">
                          <el-option v-for="dict in currencyNumList" :key="dict.value"
                              :value="dict.value" :label="dict.label"></el-option>
                      </el-select>
                  </template>
              </el-table-column>
              <el-table-column label="起订量" prop="minimumOrderQuantity" align="center" min-width="100">
                  <template #default="{ row }">
                      <div class="none">
                              <el-input type="text" v-model="row.minimumOrderQuantity" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                          </div>
                      <span>{{ row.minimumOrderQuantity }}</span>
                  </template>
              </el-table-column> 
              <el-table-column label="整箱数" prop="numberFullCartons" align="center" min-width="100">
                  <template #default="{ row }">
                      <div class="none">
                              <el-input type="text" v-model="row.numberFullCartons" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                          </div>
                      <span>{{ row.numberFullCartons }}</span>
                  </template>
              </el-table-column> 
              <el-table-column align="center" label="默认供应商" min-width="200" prop="suppliserId">
                  <template #default="{row}">
                      <el-select placeholder="请选择默认供应商" v-model="row.suppliserId" style="min-width: 100%;"  @change="handleConsumablesUpdate(row)">
                        <el-option 
                                v-for="item in row.suppliserList"
                                :label="item.label"
                                :value="item.id"
                                :key="item.id"
                            />
                      </el-select>
                  </template>
              </el-table-column>
              <el-table-column label="开票" prop="oem" align="center" width="130">
                    <template #default = "{ row }">
                        <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleConsumablesUpdate(row)">
                            <el-option v-for="dict in invoicingNumList" :key="dict.value"
                                :value="dict.value" :label="dict.label"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
              <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60" align="center">
                  <template #header>
                      实际<br>税点
                  </template>
                  <template #default="{ row }">
                      <span >{{ row.actualTaxRate }}</span>
                  </template>
              </el-table-column>

              <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60" align="center">
                  <template #header>
                      开票<br>税点
                  </template>
                  <template #default="{ row }">
                      <span >{{ row.invoicingTaxRate }}</span>
                  </template>
              </el-table-column>

              <el-table-column align="center" label="默认采购方" min-width="160" prop="purchaseId">
                <template #default="{row}">
               
                    <el-select v-model="row.purchaseId" placeholder="请选择默认采购方" style="min-width: 100%;" @change="handleConsumablesUpdate(row)">
                          <el-option 
                              v-for="item in purchaseOption"
                              :label="item.label"
                              :value="item.id"
                              :key="item.id"
                          />
                      </el-select>
                 
                </template>
              </el-table-column>
              <el-table-column  label="采购链接" prop="purchaseLink" min-width="140">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.purchaseLink" @keyup.enter="clickCancle($event, row)" @blur="clickCancle($event, row)" />
                      </div>
                      <span>
                          <el-text truncated>
                              {{ row.purchaseLink }}
                          </el-text>
                      </span>
                  </template>
              </el-table-column>
              <el-table-column label="零件采购注意事项" prop="purchaseMatters" min-width="200">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.purchaseMatters"  />
                      </div>
                      <span>{{ removeHtmlTags(row.purchaseMatters) }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="合同条款" prop="contractTerms" min-width="200">
                  <template #default="{ row }">
                      <div class="none">
                          <el-input type="text" v-model="row.contractTerms"  />
                      </div>
                      <span>{{ removeHtmlTags(row.contractTerms) }}</span>
                  </template>
              </el-table-column>
              <el-table-column align="center" fixed="right" label="操作" width="150">
                  <template #default="{ row }">
                    <el-dropdown>
                      <el-button text type="primary" @click="handleSupplier(row)">
                        供应商
                        <el-icon class="el-icon--right">
                          <arrow-down />
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false" @click="handleSupplier(row)">供应商</el-link>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <el-link type="primary" :underline="false" @click="handleAddOtherSku(row)">添加到SKU</el-link>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
              </el-table-column>
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
      </el-table>
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <wangEditor
          :title="wangEditorTitle"
          :wangEditorVisible="wangEditorAttentionVisible"
          :content="attentionCopy"
          @clickChild="clickAttentionConfirm"
          @clickBoolean="clickAttentionCancel"
          :classify="classify"
      >
      </wangEditor>
      <wangEditor
          :title="wangEditorTitle"
          :wangEditorVisible="wangEditorContractVisible"
          :content="contractCopy"
          @clickChild="clickContractConfirm"
          @clickBoolean="clickContractCancel"
          :classify="classify"
      >
      </wangEditor>
    <el-dialog 
        v-model="consumableVisible" 
        :close-on-click-modal="false" 
        title="耗材种类" 
        width="33%"
        class="moldDialog"
        :before-close="handlerCloseDialog"
    >
        <el-divider style="margin-top: 0; margin-bottom: 20px"/>
        <div id="table-height-container">
            <el-row :gutter="20" style="margin-bottom: 20px">
                <el-col :span="20">
                    <el-input v-model="consumableTypeForm.consumableType" @keyup.enter.native="handleAddConsumableType" clearable placeholder="请输入新增耗材种类" />      
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="handleAddConsumableType">新增</el-button>
                </el-col>          
            </el-row>
        
            <el-table 
                ref="tableRef" 
                stripe border   
                :header-cell-style="{ 'text-align': 'center' }"
                :data="consumableTypeData"
            >
                <el-table-column label="耗材种类" prop="consumablesName">
                    
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="120">
                    <template #default="{ row, $index }">
                        <el-link type="danger" :underline="false" @click="handleDelConsumableType(row, $index)">删除</el-link>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty class="vab-data-empty" description="暂无数据" />
                </template>
            </el-table>
  
            <!-- <vab-pagination
                :current-page="consumableTypeQueryForm.pageNo"
                :page-size="consumableTypeQueryForm.pageSize"
                :total="consumableTypeTotal"
                @current-change="handleConsumableTypeSizeChange"
                @size-change="handleConsumableTypeCurrentChange"
            /> -->
        </div>
    </el-dialog>
    <el-dialog 
            v-model="addConsumableVisible" 
            :close-on-click-modal="false" 
            title="创建耗材" 
            width="500"
            class="moldDialog"
            :before-close="handlerAddCloseDialog"
        >
            <el-divider style="margin-top: 0;"/>
            <el-form ref="formRef" class="demo-form" label-position="right" label-width="120" :model="form" style="margin: 0 auto;" :rules="rules" >
              <el-form-item label="零件名" prop="componentName">
                    <el-input v-model="form.componentName" clearable />
                </el-form-item>  
              <el-form-item label="零件单位" prop="unit">
                  <el-input v-model="form.unit" clearable placeholder="套, 个, 只, 片等" />
              </el-form-item>
              <el-form-item label="供应商名称" prop="suppliser">
                  <el-select
                        v-model="form.suppliser"
                        filterable
                        remote
                        allow-create
                        default-first-option
                        placeholder="点击输入和搜索"
                        :remote-method="remoteMethod"
                        :loading="loading"
                        @change="handleTaxDisabled"
                        clearable
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
              </el-form-item>
              <el-form-item label="开票" prop="invoicing">
                    <el-select v-model="form.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleInvoicingTaxChange">
                        <el-option v-for="dict in invoicingNumList" :key="dict.value"
                            :value="dict.value" :label="dict.label" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实际税点" prop="actualTaxRate">
                    <el-input v-model="form.actualTaxRate" clearable :disabled="taxDisabled" placeholder="税点如果是13个点则输入0.13"/>
                </el-form-item>
                <el-form-item label="开票税点" prop="invoicingTaxRate">
                    <el-input v-model="form.invoicingTaxRate" clearable :disabled="taxDisabled"placeholder="税点如果是13个点则输入0.13"/>
                </el-form-item>
              <el-form-item label="按单采购" prop="status">
                <el-switch v-model="form.status" style="--el-switch-on-color: #13ce66;" :active-value="1" :inactive-value="0"/>
              </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="addConsumableVisible = false">退出</el-button>
                    <el-button type="primary" @click="handleSubmit">确认</el-button>
                </span>
            </template>
        </el-dialog>
           <!-- 添加到其它SKU -->
           <el-dialog 
            v-model="addOtherSkuVisible" 
            :close-on-click-modal="false" 
            title="零件复制到其他SKU" 
            width="800"
            class="moldDialog"
            :before-close="handlerOtherSkuCloseDialog"
        >
            <el-divider style="margin-top: 0;"/>
            <div class="transfer-container">
                <el-transfer 
                    v-model="transferValue" 
                    :data="transferData" 
                   
                    filterable 
                    :titles="['源列', '目的列']"
                />
            </div>
            <template #footer>
                <span>
                    <el-button @click="addOtherSkuVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmitOtherSku">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <el-image-viewer @close="imagePreviewClose" :url-list="imagePriviewList" v-if="imagePreviewVisible"/>
  </div>

</template>

<script lang="ts" setup>
defineOptions({
  name: 'consumable',
})
import { ArrowDown, Delete, Plus, Search, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance, UploadFile } from 'element-plus'
import wangEditor from '../../newProductDevelopment/newProductProgress/wangEditor.vue'
import { addConsumablesOtherSku, addConsumablesType, createConsumables, delComponentImage, delConsumablesType, getProductAllSupplier, getProductComponentPurchase, getProductConsumables, getProductConsumablesType, getProductSkuList, getProductSupplier, saveProductContractTerms, saveProductPurchaseMatters, updateConsumablesSupplier, uploadComponentImage } from '/@/api/devlocal/productInformation'
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'

const addOtherSkuVisible = ref<boolean>(false)
const handlerOtherSkuCloseDialog = () => {
    addOtherSkuVisible.value = false
}
const consumableTypeForm = reactive({
    consumableType: ''
})
const handleAddConsumableType = async () => {
  const { data } = await addConsumablesType({
    consumablesType: consumableTypeForm.consumableType
  })
  if(data) {
    consumableTypeData.value.push({ consumablesName: consumableTypeForm.consumableType, id: data})
    await getProductConsumablesType()
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
   
   if  (data.columnIndex === 1 || data.columnIndex === 2 || data.columnIndex === 6 || data.columnIndex === 13 || data.columnIndex === 14){        
   
       return {
            color: '#bbb',
            cursor: 'not-allowed',
            textAlign:'center'
        } 
   }
}
const loading = ref(false) //供应商搜索loading
const options = ref<any[]>([]) //供应商搜索选项
const supplierList = ref<any[]>([]) //供应商搜索列表
const taxDisabled = ref<boolean>(false)
const remoteMethod = async (query: string) => {
  if (query) {
    // 先获取供应商信息
    const { data } = await getProductAllSupplier({
        suppliserName: query
    })
    // console.log(data);
    supplierList.value = data.map((item: any) => {
        return { value: `${item}`, label: `${item}` }
    })
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = supplierList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}
const handleTaxDisabled = async (value: string) => {
   if(value) {
        const { data } = await getProductSupplier({ suppliserName: value })
        
        if(data!==null) {
            const {actualPTaxRate, actualZTaxRate, invoicingPTaxRate, invoicingZTaxRate, suppliserId } = data
            taxDisabled.value = true
            if(form.invoicing === 0) {
                form.actualTaxRate = actualZTaxRate
                form.invoicingTaxRate = invoicingZTaxRate
            } else if(form.invoicing === 1) {
                form.actualTaxRate = actualPTaxRate
                form.invoicingTaxRate = invoicingPTaxRate
            } else {
                form.actualTaxRate = 0
                form.invoicingTaxRate = 0
            }
        } else {
            taxDisabled.value = false
        }
   }
}
const handleInvoicingTaxChange = async (value: number) => {
   
   if(form.supplier) {
       handleTaxDisabled(form.supplier)
   }
}
interface Option2 {
  key: number
  label: string
  initial: number
}

let states = ref<string[]>([])
let initials = ref<number[]>([])
const transferData = ref<Option2[]>([]) // 初始化为空数组
const transferValue = ref([])

// 生成数据
const generateData2 = () => {
  const data: Option2[] = []
  states.value.forEach((sku, index) => {
    data.push({
      label: sku,
      key: initials.value[index],
      initial: initials.value[index],
    })
  })
  return data
}
let _compoenntId = ref<number>()
// 添加其他 SKU 的逻辑
const handleAddOtherSku = async (row: any) => {
  // console.log(row);
  
  states.value = []
  initials.value = []
  transferData.value = []
  transferValue.value = []
  const { data } = await getProductSkuList({existingPartsListId: row.existingPartsListId})
  data.forEach((item: any) => {
    states.value.push(item.sku)
    initials.value.push(item.skuId)
  })
  transferData.value = generateData2()
  _compoenntId.value = row.existingPartsListId
  
  addOtherSkuVisible.value = true
}
const handleSubmitOtherSku = async () => {
    addOtherSkuVisible.value = false
    $baseConfirm('添加后不可逆，无法批量删除，是否继续？', '系统提示', async () => {
        const { data } = await addConsumablesOtherSku({
            skuIds: `${transferValue.value}`,
            componentId: _compoenntId.value!
        })
        if(data === true) {
            $baseMessage('添加到其他SKU成功', 'success', 'hey')
        }
    });
}

const router = useRouter()
const listLoading = ref<boolean>(true)
const addConsumableVisible = ref<boolean>(false)
const handlerAddCloseDialog = () => {
  addConsumableVisible.value = false
}
const formRef = ref<FormInstance>()
const form = reactive<any>({
    componentName: '',
    unit: '',
    suppliser: '',
    invoicing: 0,
    actualTaxRate: '',
    invoicingTaxRate: '',
    status: 0,
})
const handleAddConsumable = () => {
  addConsumableVisible.value = true
  formRef.value?.resetFields()
}
const invoicingNumList = [
  {
    value: 0,
    label: '专票',
  },
  {
    value: 1,
    label: '普票',
  },
  {
    value: 2,
    label: '无法开票',
  },
]
const rules = reactive({
    componentName: [
        { required: true, message: '请填写零件名', trigger: 'blur' },
    ],
    unit: [
        { required: true, message: '请填写零件单位', trigger: 'blur' },
    ],
    suppliser: [
        { required: true, message: '请填写供应商名称', trigger: 'blur' },
    ],
    invoicing: [
        { required: true, message: '请选择开票类型', trigger: 'change' },
    ],
    actualTaxRate: [
        { required: true, message: '请填写实际税点', trigger: 'blur' },
    ],
    invoicingTaxRate: [
        { required: true, message: '请填写开票税点', trigger: 'blur' },
    ],
});
const handleSubmit = async () => {
    formRef.value?.validate(async (valid: any) => {
        if (valid) {
          
          try {
            const newConsumable = {
              componentName: form.componentName,
              unit: form.unit,
              suppliser: form.suppliser,
              invoicing: form.invoicing,
              actualTaxRate: form.actualTaxRate,
              invoicingTaxRate: form.invoicingTaxRate,
              status: form.status,
            }
            const { data } = await createConsumables(newConsumable)
            if (data) {
                list.value.push(newConsumable)
                fetchData()
                addConsumableVisible.value = false
                $baseMessage('创建耗材提交成功', 'success', 'hey')
            }
          } catch (error) {
            console.error(error)
          }
        }
    
    })
}

interface consumableType {
  consumablesName: string
  id: number
}
const consumableTypeData = ref<consumableType[]>([])
const currencyNumList = [
  {
    value: 0,
    label: 'RMB',
  },
  {
    value: 1,
    label: 'USD',
  },
  {
    value: 2,
    label: 'EUR',
  },
]

const list = ref<any>([])
const consumableVisible = ref<boolean>(false)
const handlerCloseDialog = () => {
    consumableVisible.value = false
}
const handleConsumableType = async () => {
    consumableVisible.value = true
    const { data } = await getProductConsumablesType() //获取耗材种类
    consumableTypeForm.consumableType = ''
    consumableTypeData.value = data
}
const handleDelConsumableType = async (row: any, index: number) => {
  $baseConfirm('确定要删除耗材种类吗', '系统提示', async () => {
    const { data } = await delConsumablesType({
      id: row.id
    })
    if (data === true) {
      consumableTypeData.value.splice(index, 1)
      $baseMessage('删除耗材种类成功', 'success', 'hey')
    }
  })
  
}
const route: any = useRoute()
// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 分类
const classify = ref<string>('')
// 点击零件采购注意事项弹出富文本框是否显示
const wangEditorAttentionVisible = ref<boolean>(false)
// 点击合同条款弹出富文本框是否显示
const wangEditorContractVisible = ref<boolean>(false)
const attentionCopy = ref<string>('')
const contractCopy = ref<string>('')
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})

const total = ref<number>(0)

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSupplier = (row: any) => {
    router.push({
        path: '/productInfomation/skuSupplier',
        query: {
          title: "SKU供应商",
          componentId: row.existingPartsListId,
          componentName: row.componentName,
          from: "consumable",
          timestamp: Date.now(),
        },
    })
}
/**
* 当点击确认时，子组件传递给父组件的新的val
*/
const clickAttentionConfirm = async (val: any) => {
  const { data } = await saveProductPurchaseMatters({ id: clickRow.value.id, purchaseMatters: val})
  if (data === true) {
      attentionCopy.value = val
      clickRow.value.purchaseMatters = val
  }
}
const clickContractConfirm = async (val: any) => {
  const { data } = await saveProductContractTerms({ id: clickRow.value.id, contractTerms: val})
  if (data === true) {
      contractCopy.value = val
      clickRow.value.contractTerms = val
  }
}
/**
* 当点击取消，确认时，子组件传递给父组件 false
*/
const clickAttentionCancel = (val: any) => {
  wangEditorAttentionVisible.value = val
}
const clickContractCancel = (val: any) => {
  wangEditorContractVisible.value = val
}
// 去掉 HTML 标签并显示纯文本的方法
const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};


const handleConsumablesUpdate = async (row: any) => {
  await updateConsumablesSupplier({
        id: row.id,
        componentId:row.existingPartsListId,
        componentUnit:row.unit,
        defaultSuppliserId: row.suppliserId,
        unitPrice: row.unitPrice,
        taxIncludedPrice: row.taxIncludedPrice,
        currency: row.currency,
        minimumOrderQuantity: row.minimumOrderQuantity,
        numberFullCartons: row.numberFullCartons,
        invoicing: row.invoicing,
        purchaseId: row.purchaseId,
        purchaseLink: row.purchaseLink,
        purchaseMatters: row.purchaseMatters,
        contractTerms: row.contractTerms,
        status:row.status
      })
      fetchData()
}

/**
* 上传图片
*/
async function uploadImage(params: any, row: any) {
    try {
        
        const uploadForm = new FormData(); // 每次上传前重置 FormData
        uploadForm.append('file', params.file);
        uploadForm.append('id', row.id);

        const { data } = await uploadComponentImage(uploadForm)
        row.hide = true
        if (data) {
          
          row.imageList = [{ url: data }]
          $baseMessage('图片上传成功', 'success', 'hey')
        }
    } catch (error) {
        console.error(error)
    }
}

// 预览图片列表
const imagePriviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
/**
* 图片预览事件
*/
const handlePictureCardPreview = (file: UploadFile, row: any) => {
  imagePreviewVisible.value = true
  imagePriviewList.value = []
  imagePriviewList.value.push(file.url!)
}
/**
* 图片删除功能
*/
const handleRemove = async (file: UploadFile, row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{

        const { data } = await delComponentImage({
            id: row.id
        })
        if (data == true) {
            row.imageList = []
            row.hide = false
            $baseMessage("图片删除成功!","success","hey")
        }
    })
    
  } catch (error) {
    console.error(error)
  }
}

/**
* 当点击时切换输入框，修改输入
*/
const clickRow = ref<any>()
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
      return
  }

  if (column.property == 'purchaseMatters') {
      // 查询零件采购注意事项
      clickRow.value = row
      // const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.reviewComponentId })
      attentionCopy.value = row.purchaseMatters
      // row.purchaseMatters = data
      wangEditorTitle.value = '零件采购注意事项'
      classify.value = 'purchaseMatters'
      wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
  } else if (column.property == 'contractTerms'){
          clickRow.value = row
          // const { data } = await reviewStepNo3ContractTerms({ reviewComponentId: row.reviewComponentId })
          contractCopy.value = row.contractTerms
          // row.contractTerms = data
          wangEditorTitle.value = '合同条款'
          classify.value = 'contractTerms'
          wangEditorContractVisible.value = !wangEditorContractVisible.value
  } else {
          cell.children[0].children[0].classList.remove('none')
          cell.children[0].children[1].classList.add('none')
  }

  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
      inputElement.focus()
      inputElement.select()
  } else {
      const textareaElement = getSpecificChildren(cell, "textarea")[0];
      if (textareaElement){
          textareaElement.focus()
          textareaElement.select()
      }
  }
}

// table blur事件
const clickCancle = async (event:any,value:any) =>{
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }

  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  
  if (event.type === 'blur') {
  
      // 执行失去焦点处理逻辑
      handleConsumablesUpdate(value)
  }
}

const purchaseOption = ref<any>()
const queryData = async () => {
  queryForm.pageNo = 1
  fetchData()
  // if(queryForm.keyWord === '') {
  //   fetchData()
  // } else {
  //   listLoading.value = true
  //   let queryList: any = []
  //   queryList = list.value.filter((item: any) => item.componentName.includes(queryForm.keyWord, 0))
  //   list.value = queryList
  //   total.value = list.value.length
  //   listLoading.value = false
  // }
}
const formattedPrice = (price: string) => {
    return parseFloat(price).toFixed(2)
}
const fetchData = async () => {
    listLoading.value = true
    const { data } = await getProductConsumables(queryForm)
    list.value = data.list
    total.value = data.total
    list.value.forEach(async (item: any) => {
      item.unitPrice = formattedPrice(item.unitPrice)
        // 获取供应商列表
      // if (!item.supplierList) {
      //   const { data: suppliser } = await getProductComponentSuppliser({
      //       componentId: item.existingPartsListId
      //   })
      //     item.suppliserList = suppliser
      //     if(!item.componentImage) {
      //         item.hide = false
      //         item.imageList = []
      //     } else if (item.componentImage){
      //         item.hide = true
      //         item.imageList = [{ url: item.componentImage }]
      //     }
      // }
   
      
          if(!item.componentImage) {
              item.hide = false
              item.imageList = []
          } else if (item.componentImage){
              item.hide = true
              item.imageList = [{ url: item.componentImage }]
          }
        
  })

    listLoading.value = false
}
// const fetchSupplierList = async () => {

// }
const fetchPurchase = async () => { //获取默认采购方
    const { data: purchase } = await getProductComponentPurchase()
    purchaseOption.value = purchase
}
onBeforeMount(async ()=>{
  fetchPurchase()
  fetchData()
})
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
}
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  margin: 0 8px 0 0;
  transition: none;
}
:deep(.el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}

.transfer-container {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中，如果需要 */
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

