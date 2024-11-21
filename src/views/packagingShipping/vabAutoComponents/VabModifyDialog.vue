<template>
  <!-- 修改 -->
  <vab-dialog
    title="修改"
    width="35%"
    v-model="dflag"
    top="7vh"
    @close="handleCloseDialog"
  >
    <el-form ref="modifyFormRef" :model="modifyForm" label-position="right" label-width="auto" style="margin-left: 3px; margin-right: 3px">
      <el-form-item label="数量(箱)" prop="" >
        <el-input clearable />
      </el-form-item>
      <el-form-item label="毛重(kg)" prop="grossWeight" >
        <el-input v-model="modifyForm.grossWeight" clearable />
      </el-form-item>
      <el-form-item label="长(cm)" prop="length" >
        <el-input v-model="modifyForm.length" clearable />
      </el-form-item>
      <el-form-item label="宽(cm)" prop="width" >
        <el-input v-model="modifyForm.width" clearable />
      </el-form-item>
      <el-form-item label="高(cm)" prop="height" >
        <el-input v-model="modifyForm.height" clearable />
      </el-form-item>
      <el-form-item label="站点" prop="siteId" >
        <el-select v-model="modifyForm.siteId" placeholder="请选择站点">
          <el-option 
            v-for="item in props._siteList"
            :label="item.label"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="addNewVisible = true" style="margin-top: 10px; margin-bottom: 10px">新增</el-button>
    <el-table border stripe :header-cell-style="{ textAlign: 'center' }" :data="skuDetailList" max-height="35vh">
      <el-table-column label="SKU" prop="sku" min-width="100"></el-table-column>
      <el-table-column label="FNSKU" prop="fnSkuOrUpc" min-width="140"></el-table-column>
      <el-table-column label="说明" prop="productName" min-width="160"></el-table-column>
      <el-table-column label="数量" prop="count" min-width="50" align="center"></el-table-column>
      <el-table-column label="操作" width="140" align="center" fixed="right">
        <template #default="{ row, $index }">
          <el-link type="danger" :underline="false" @click="handleDelEncasementDetail(row, $index)">删除</el-link>
          <el-link type="primary" :underline="false" @click="showInspection(row)">清点质检</el-link>
        </template>
      </el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <template #footer>
      <el-button @click="handleCloseDialog">取消</el-button>
      <el-button type="primary" @click="confirmUpdateEncasement">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 新增新的明细 -->
  <vab-dialog
    title="新增"
    width="660px"
    v-model="addNewVisible"
    @close="closeAddNewDetail"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="addNewFormRef" :rules="addNewFormRules" label-position="top" :model="addNewForm">
          <el-form-item label="FNSKU" prop="fnSkuOrUpc"><el-input v-model="addNewForm.fnSkuOrUpc" disabled /></el-form-item>
          <el-form-item label="SKU" prop="sku"><el-input v-model="addNewForm.sku" disabled /></el-form-item>
          <el-form-item label="产品名称" prop="productName"><el-input v-model="addNewForm.productName" disabled /></el-form-item>
          <el-form-item label="数量" prop="count"><el-input v-model="addNewForm.count" clearable /></el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-image src="https://picsum.photos/200/200" style="width: 300px; height: 300px; cursor: pointer;" @click="imagePreviewShow('https://picsum.photos/200/200')">
          <template #error>
            <el-icon></el-icon>
          </template>
        </el-image>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="closeAddNewDetail">取消</el-button>
      <el-button type="primary" @click="confirmAddNewDetail">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 清点质检 -->
  <vab-dialog
    title="清点质检"
    width="45%"
    v-model="inspectionVisible"
    top="10vh"
  >
    <el-table 
      :data="inspectionList" 
      border stripe  
      class="noneHoveTable" 
      :header-cell-style="{ textAlign: 'center' }"
      max-height="60vh" 
      :cell-class-name="cellClassName"
    >
      <el-table-column label="PO" prop="po" min-width="100" align="center"></el-table-column>
      <el-table-column label="产品图片" prop="skuImageUrl" width="70" align="center">
        <template #default="{ row }">
          <el-image :src="row.skuImageUrl" style="width: 70px; height: 70px; display: block" @click="imagePreviewShow(row.skuImageUrl)">
            <template #error>
              <el-icon></el-icon>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="到货状态" prop="taskStatus" min-width="100" align="center"></el-table-column>
      <el-table-column label="任务数" prop="packageTaskCount" min-width="90" align="center"></el-table-column>
      <el-table-column label="站点" prop="siteName" min-width="130" align="center"></el-table-column>
      <el-table-column label="已装箱数" prop="boxNumber" min-width="100" align="center"></el-table-column>
      <el-table-column label="清点质检" prop="qualityCheckStatus" min-width="100" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.qualityCheckStatus" :active-value="1" :inactive-value="0" @change="handleShowPackingCount(row)" style="--el-switch-on-color: #13ce66;"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="实际完成数" prop="actualCompleted" min-width="110" align="center"></el-table-column>
    </el-table>
  </vab-dialog>
  <!-- 点击清点质检 - 打包总数 -->
  <vab-dialog
    title="打包总数"
    width="22%"
    v-model="packingCountVisible"
    class="packingTotal"
    :before-close="closePackingCount"
  >
    <el-form ref="packingCountFormRef" :model="packingCountForm" label-position="left" label-width="auto" style="margin-left: 20px; margin-right: 0px">
      <el-form-item label="任务数量" prop="packageTaskCount">
        <div style="width: 85%;">
          <el-input v-model="packingCountForm.packageTaskCount" disabled  ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="好" prop="goodCount">
        <div style="width: 85%; margin-right: 10px;">
          <el-input v-model.trim="packingCountForm.goodCount" clearable/>
        </div>
        <div style="width: 10%; display: flex; align-items: center">
          <el-icon :size="23" class="add-icon" style="margin: 0 auto; cursor: pointer;" @click="handleShowAdd"><CirclePlus /></el-icon>
        </div>
      </el-form-item>
      <el-form-item label="留样" prop="keepSampleCount">
        <div style="width: 85%;">
          <el-input v-model.trim="packingCountForm.keepSampleCount" clearable/>
        </div>
      </el-form-item>
      <el-form-item label="坏" prop="badCount">
        <div style="width: 85%;">
          <el-input v-model.trim="packingCountForm.badCount" clearable/>
        </div>
        <!-- <el-button type="primary" @click="handleShowDetails">明细</el-button> -->
      </el-form-item>
      <el-form-item label="缺">
        <div style="width: 85%;">
          <el-input v-model="lackCount" disabled />
        </div>
      </el-form-item>
      <el-form-item label="多">
        <div style="width: 85%;">
          <el-input v-model="manyCount" disabled />
        </div>
      </el-form-item>
      <el-form-item label="打包总数">
        <div style="width: 85%;">
          <el-input v-model="packingTotal" disabled />
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <div style="width: 85%;">
          <el-input type="textarea" v-model="packingCountForm.remark" :rows="2" style="margin-bottom: 18px" resize="none"/>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="margin-right: 10px">
        <el-button type="danger" @click="closePackingCount">取消</el-button>
        <el-button type="success" @click="confirmQualityCheck">确认</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 增加 -->
  <vab-dialog
    title="增加"
    v-model="addVisible"
    @close="handleCloseAdd"
    width="17%"
  >
    <el-form ref="addFormRef" :model="addForm" label-width="auto" label-position="left" style="margin-left: 20px; margin-right: 20px">
      <el-form-item label="好" prop="good">
        <el-input v-model.trim="addForm.good" clearable />
      </el-form-item>
      <el-form-item label="留样" prop="sample">
        <el-input v-model.trim="addForm.sample" clearable />
      </el-form-item>
      <el-form-item label="坏" prop="bad">
        <el-input v-model.trim="addForm.bad" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCloseAdd">取消</el-button>
      <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
</template>

<script lang="ts" setup>
import { CirclePlus } from '@element-plus/icons-vue'
import { FormInstance, FormRules } from 'element-plus'
import { addQualityCheck, getQualityCheck } from '~/src/api/devlocal/packagingShipping'
import { addDetailEncasement, delEncasementInspection, getEncasementInspection, getEncasementUpdate, updateEncasement } from '/@/api/devlocal/encasement'
import { IGetQualityCheck } from '/@/type/packagingShipping/packagingType'
import { IAddDetailEncasementReq, IGetEncasementInspection, ISiteOption, ISkuDetailList } from '/@/type/packagingShipping/shippedType'

const dflag = ref<boolean>(false)
// 新增可见
const addNewVisible = ref<boolean>(false)
const addVisible = ref<boolean>(false)
const skuDetailList = ref<ISkuDetailList[]>([])
const inspectionList = ref<IGetEncasementInspection[]>([])
const list = ref<any>()
// 图片预览
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewList.value = []
  imagePreviewVisible.value = true
  imagePreviewList.value.push(url)
}
let props = defineProps<{
  modifyVisible: boolean
  encasementId: number
  _siteList: ISiteOption[]
}>()
const fetchData = async () => {
  const { data } = await getEncasementUpdate({
    encasementId: props.encasementId
  })
  if (data) {
    Object.assign(modifyForm, data)
    skuDetailList.value = data.list
    fetchSkuData()
  }
}
const fetchSkuData = () => {
  list.value = skuDetailList.value.slice(
    (queryForm.pageNo - 1) * queryForm.pageSize,
    queryForm.pageNo * queryForm.pageSize
  );
  total.value = skuDetailList.value.length
}
watchEffect(() => {
  dflag.value = props.modifyVisible
  if (dflag.value) {
    fetchData()
  }
})
// 修改表单
const modifyForm = reactive<any>({})
const modifyFormRef = ref<FormInstance>()
const modifyFormRules = reactive<any>({

})
// 新增新的明细
const addNewForm = reactive<any>({})
const addNewFormRef = ref<FormInstance>()
const addNewFormRules = reactive<FormRules<IAddDetailEncasementReq>>({
  count: [{ required: true, message: '请输入数量', trigger: 'blur' }]
})
interface IAddForm {
  good: number | null
  sample: number | null
  bad: number | null
}
// 增加form
const addForm = reactive<IAddForm>({
  good: null,
  sample: null,
  bad: null
})
// 增加form-ref
const addFormRef = ref<FormInstance>()
// 清点质检可见
const inspectionVisible = ref<boolean>(false)
const packingCountVisible = ref<boolean>(false)
// 展示清点质检
const showInspection = async (row: ISkuDetailList) => {
  inspectionVisible.value = true
  const { data } = await getEncasementInspection({
    id: row.id!,
    sku: row.sku!
  })
  inspectionList.value = data
  
}
// 清点质检的确认
const confirmQualityCheck = async () => {
  const { data } = await addQualityCheck({
    taskId: copyRow.value.taskId,
    goodCount: packingCountForm.goodCount!,
    manyCount: manyCount.value,
    keepSampleCount: packingCountForm.keepSampleCount,
    lackCount: lackCount.value,
    badCount: packingCountForm.badCount,
    remark: packingCountForm.remark,
    status: copyRow.value.qualityCheckStatus
  })
  if (data) {
    $baseMessage('添加质检信息成功', 'success')
    packingCountVisible.value = false
  }
}
const copyRow = ref<any>()
// 展示清点质检
const handleShowPackingCount = async (row: any) => {
  // 点击了清单质检
  if (row.qualityCheckStatus === 1) {
    packingCountVisible.value = true
    copyRow.value = row
    const { data } = await getQualityCheck({
      id: row.taskId
    })
    Object.assign(packingCountForm, data)
    if (!data!.id) {
      packingCountForm.packageTaskCount = row.packageTaskCount
    }
    lackCount.value = data?.lackCount!
    manyCount.value = data?.manyCount
  } else {
    await addQualityCheck({
      taskId: row.taskId,
      status: row.qualityCheckStatus
    })
  }
}
const emit = defineEmits(['update:modifyVisible'])
const handleCloseDialog = () => {
  dflag.value = false
  emit('update:modifyVisible', dflag.value);
}
// 装箱修改确认
const confirmUpdateEncasement = async () => {
  const { data } = await updateEncasement({
    id: props.encasementId,
    grossWeight: modifyForm.grossWeight,
    length: modifyForm.length,
    width: modifyForm.width,
    height: modifyForm.height,
    site: modifyForm.siteId
  })
  if (data) {
    $baseMessage('修改成功', 'success')
    handleCloseDialog()
  }
}
// 删除装箱明细
const handleDelEncasementDetail = async (row: any, index: number) => {
  $baseConfirm('确定要删除装箱明细吗？', null, async () => {
    const { data } = await delEncasementInspection({
      encasementDetailId: row.id
    })
    if (data) {
      $baseMessage('删除成功', 'success')
      skuDetailList.value.splice(index, 1)
    }
  })
}

// 打包总数form
const packingCountForm = reactive<IGetQualityCheck>({})
// 缺的数量
const lackCount = computed<number>({
  get() {
    let good = Number(packingCountForm.goodCount);
    let bad = Number(packingCountForm.badCount);
    let taskCount = Number(packingCountForm.packageTaskCount);
    return taskCount - good - bad;
  },
  set(value) {

  }
});
// 多的数量
const manyCount = computed({
  get() {
    let good = Number(packingCountForm.goodCount)
    let taskCount = Number(packingCountForm.packageTaskCount)
    if (good > taskCount) {
      return good - taskCount
    }
  },
  set(value) {

  }
})
// 打包总数数量
const packingTotal = computed({  
  get() {
    let good = Number(packingCountForm.goodCount)
    let bad = Number(packingCountForm.badCount)
    return good + bad
  },
  set(value) {

  }
})
// 关闭增加
const handleCloseAdd = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
// 增加确认
const handleConfirmAdd = () => {
  let good = Number(addForm.good)
  let sample = Number(addForm.sample)
  let bad = Number(addForm.bad)
  let pGood = Number(packingCountForm.goodCount)
  packingCountForm.goodCount = pGood + good
  let pSample = Number(packingCountForm.keepSampleCount)
  packingCountForm.keepSampleCount = pSample + sample
  let pBad = Number(packingCountForm.badCount)
  packingCountForm.badCount = pBad + bad
  handleCloseAdd()
}
// 清点质检的取消
const closePackingCount = () => {
  packingCountVisible.value = false
  copyRow.value.qualityCheckStatus = 0
}
const handleShowAdd = () => {
  addVisible.value = true
}
// 关闭新增新的明细
const closeAddNewDetail = () => {
  addNewFormRef.value?.resetFields()
  addNewVisible.value = false
}
// 确认新增新的明细
const confirmAddNewDetail = async () => {
  const { data } = await addDetailEncasement({
    id: props.encasementId,
    fnSkuOrUpc: addNewForm.fnSkuOrUpc,
    sku: addNewForm.sku,
    productName: addNewForm.productName,
    count: addNewForm.count
  })
  if (data) {
    $baseMessage('新增成功', 'success')
    fetchData()
    closeAddNewDetail()
  }
}
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchSkuData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchSkuData()
}

const cellClassName = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
</script>

<style lang="scss" scoped>
.add-icon:hover {
  color: var(--el-color-primary); 
}
.noneHoveTable :deep(.clear-padding) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.noneHoveTable :deep(.clear-padding .cell) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>