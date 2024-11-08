<template>
  <!-- 修改 -->
  <vab-dialog
    title="修改"
    width="35%"
    v-model="dflag"
    top="7vh"
  >
    <el-form ref="modifyFormRef" :model="modifyForm" label-position="right" label-width="auto" style="margin-left: 3px; margin-right: 3px">
      <el-form-item label="数量(箱)" prop="" >
        <el-input clearable />
      </el-form-item>
      <el-form-item label="毛重(kg)" prop="" >
        <el-input clearable />
      </el-form-item>
      <el-form-item label="长(cm)" prop="" >
        <el-input clearable />
      </el-form-item>
      <el-form-item label="宽(cm)" prop="" >
        <el-input clearable />
      </el-form-item>
      <el-form-item label="高(cm)" prop="" >
        <el-input clearable />
      </el-form-item>
      <el-form-item label="站点" prop="" >
        <el-select placeholder="请选择站点">
          <el-option 
            v-for="item in siteList"
            :label="item.label"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="addNewVisible = true" style="margin-top: 10px; margin-bottom: 10px">新增</el-button>
    <el-table border stripe :header-cell-style="{ textAlign: 'center' }" :data="fakeData" max-height="35vh">
      <el-table-column label="SKU" prop="sku" min-width="220"></el-table-column>
      <el-table-column label="FNSKU" prop="" min-width="100"></el-table-column>
      <el-table-column label="说明" prop="" min-width="100"></el-table-column>
      <el-table-column label="数量" prop="" min-width="70" align="center"></el-table-column>
      <el-table-column label="操作" width="140" align="center" fixed="right">
        <template #default="{ row }">
          <el-link type="danger" :underline="false">删除</el-link>
          <el-link type="primary" :underline="false" @click="showInspection">清点质检</el-link>
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
      <el-button type="primary">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 新增 -->
  <vab-dialog
    title="新增"
    width="660px"
    v-model="addNewVisible"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form label-position="top" :model="addNewForm">
          <el-form-item label="FNSKU"><el-input disabled /></el-form-item>
          <el-form-item label="SKU"><el-input disabled /></el-form-item>
          <el-form-item label="产品名称"><el-input disabled /></el-form-item>
          <el-form-item label="数量"><el-input v-model="addNewForm.count" clearable /></el-form-item>
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
      <el-button>取消</el-button>
      <el-button type="primary">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 清点质检 -->
  <vab-dialog
    title="清点质检"
    width="40%"
    v-model="inspectionVisible"
    top="10vh"
  >
    <el-table 
      :data="fakeData" 
      border stripe  
      class="noneHoveTable" 
      :header-cell-style="{ textAlign: 'center' }"
      max-height="60vh" 
      :cell-class-name="cellClassName"
    >
      <el-table-column label="PO" prop="po" min-width="100" align="center"></el-table-column>
      <el-table-column label="产品图片" prop="" width="70" align="center">
        <template #default="{ row }">
          <el-image :src="row.url" style="width: 70px; height: 70px; display: block" @click="imagePreviewShow(row.url)">
            <template #error>
              <el-icon></el-icon>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="到货状态" prop="" min-width="100" align="center"></el-table-column>
      <el-table-column label="任务数" prop="" min-width="90" align="center"></el-table-column>
      <el-table-column label="站点" prop="" min-width="100" align="center"></el-table-column>
      <el-table-column label="已装箱数" prop="" min-width="100" align="center"></el-table-column>
      <el-table-column label="清点质检" prop="qualityCheckStatus" min-width="100" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.qualityCheckStatus" :active-value="1" :inactive-value="0" @change="handleShowPackingCount(row)" style="--el-switch-on-color: #13ce66;"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="实际完成数" prop="" min-width="110"></el-table-column>
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
        <el-button type="success" @click="">确认</el-button>
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
import { FormInstance } from 'element-plus'
import { ISiteOption } from '/@/type/packagingShipping/shippedType'
import { IGetQualityCheck } from '/@/type/packagingShipping/packagingType'
import { CirclePlus } from '@element-plus/icons-vue'

const dflag = ref<boolean>(false)
// 新增可见
const addNewVisible = ref<boolean>(false)
const addVisible = ref<boolean>(false)
const siteList = ref<ISiteOption[]>([])
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
}>()
watchEffect(() => {
  dflag.value = props.modifyVisible
  if (dflag.value) {
   
  }
})
// 修改表单
const modifyForm = reactive<any>({})
const modifyFormRef = ref<FormInstance>()
const modifyFormRules = reactive<any>({

})
const addNewForm = reactive<any>({

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
const showInspection = () => {
  inspectionVisible.value = true
}
// 展示清点质检
const handleShowPackingCount = (row: any) => {
  // 点击了清单质检
  if (row.qualityCheckStatus === 1) {
    packingCountVisible.value = true
    // copyRow.value = row
    // const { data } = await getQualityCheck({
    //   id: row.id
    // })
    // Object.assign(packingCountForm, data)
    // if (!data!.id) {
    //   packingCountForm.packageTaskCount = row.packageTaskCount
    // }
    // if (!data?.packageTaskCount) {
    //   packingCountForm.packageTaskCount = 0
    // }
    // lackCount.value = data?.lackCount!
    // manyCount.value = data?.manyCount
    
  } else {
    // await addQualityCheck({
    //   taskId: row.id,
    //   status: row.qualityCheckStatus
    // })
  }
}
const emit = defineEmits(['update:modifyVisible'])
const handleCloseDialog = () => {
  dflag.value = false
  emit('update:modifyVisible', dflag.value);
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
  // copyRow.value.qualityCheckStatus = 0
}
const handleShowAdd = () => {
  addVisible.value = true
}
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const handleCurrentChange = (value: number) => {

}
const handleSizeChange = (value: number) => {

}
const fakeData = [
  {
    po: 'PO123'
  }
]
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