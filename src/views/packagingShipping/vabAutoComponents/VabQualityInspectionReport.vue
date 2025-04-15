<template>
  <!-- 质检报告 -->
  <vab-dialog v-model="visible" class="custom-dialog" title="质检报告" top="5vh" width="50%" @close="closeQualityInspection">
    <el-divider style="margin-top: 0">基础信息</el-divider>
    <el-form
      ref="qualityInspectionFormRef"
      :inline="true"
      :model="qualityInspectionForm"
      require-asterisk-position="right"
      :rules="qualityInspectionFormRules"
      style="margin-right: 0px; margin-left: 0px"
    >
      <el-row style="width: 100%">
        <el-col :span="8">
          <el-form-item label="日期" style="min-width: 100%">
            <el-input disabled />
          </el-form-item>
          
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品经理" style="min-width: 100%">
            <el-input disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="PO" style="min-width: 100%">
            <el-input disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="8">
          <el-form-item label="SKU" prop="sku" style="min-width: 100%">
            <el-input v-model="qualityInspectionForm.sku" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="产品名称" prop="productName" style="min-width: 100%">
            <el-input v-model="qualityInspectionForm.productName" disabled  />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider style="margin-top: 0">信息完善</el-divider>
      <el-row style="width: 100%">
        <el-col :span="16">
          <el-form-item inline label="包装尺寸" prop="packingSize">
            <el-row style="display: flex; gap: 1%; align-items: center; width: 100%">
              <el-input v-model.trim="qualityInspectionForm.packageLength" clearable placeholder="长(cm)" style="flex: 1; margin-right: 0" />
              <span style="display: inline-block; font-size: 1.5em; text-align: center">×</span>
              <el-input v-model.trim="qualityInspectionForm.packageWidth" clearable placeholder="宽(cm)" style="flex: 1; margin-right: 0" />
              <span style="display: inline-block; font-size: 1.5em; text-align: center">×</span>
              <el-input v-model.trim="qualityInspectionForm.packageHeight" clearable placeholder="高(cm)" style="flex: 1; margin-right: 0" />
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="包装重量" prop="packageWeight">
            <el-input v-model.trim="qualityInspectionForm.packageWeight" clearable placeholder="克(g)" style="margin-right: 12px" />
            <!-- <el-button type="success">更新SKU尺寸重量</el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="材质构成（用于报关，需要精确填写）" prop="materialComposition" />
    </el-form>
    <el-table border :header-cell-style="{ textAlign: 'center' }" stripe >
      <el-table-column label="零件名" />
      <el-table-column label="材质1名称" />
      <el-table-column label="材质1重量(g)" />
      <el-table-column label="材质2名称" />
      <el-table-column label="材质2重量(g)" />
      <el-table-column label="材质3名称" />
      <el-table-column label="材质3重量(g)" />
      <el-table-column label="材质4名称" />
      <el-table-column label="材质4重量(g)" />
      <el-table-column label="上传零件图片" />
    </el-table>
        
        
    <el-divider >质检结果</el-divider>
      <el-table
        border
        :cell-style="qualityInspectionCellStyle"
        class="quality-inspection"
        :data="qualityInspectionForm.inspectionList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
        @cell-click="changeQualityInspectionInput"
      >
        <el-table-column label="质检项目" min-width="330" prop="qualityInspection" />
        <el-table-column label="检查类型" min-width="100" prop="type" />
        <el-table-column label="通过" min-width="50" prop="pass">
          <template #default="{ row }">
            <el-checkbox v-model="row.pass" :false-value="0" :true-value="1"  />
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="150" prop="remark">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.remark"
                @blur="clickQualityInspectionCancel($event, row)"
                @keyup.enter="clickQualityInspectionCancel($event, row)"
              />
            </div>
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-form label-position="left" label-width="auto" :model="inspectionResultsForm" require-asterisk-position="right" :rules="inspectionResultsFormRules" style="margin: 20px 0 0 0">
        <el-form-item label="基础图片" prop="baseImage" style="margin-bottom: 50px">
          <div class="image-cell" style="margin-right: 15px">
            <!-- 有图片时显示 -->
            <div v-if="inspectionResultsForm.finishedImage" class="image-preview">
              <img alt="" :src="inspectionResultsForm.finishedImage" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(inspectionResultsForm.finishedImage)"><zoom-in /></el-icon>
                <el-icon @click="handleFinishedImageRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog">
              <el-icon><plus /></el-icon>
            </div>
            <div style=" line-height: 1.2;text-align: center">
              <div style="font-size: 14px;">产品零件图</div>
              <div style=" margin-top: 2px;font-size: 12px; color: #999">展示所有零件及对应数量</div>
            </div>
          </div>
          <div class="image-cell" style="margin-right: 15px">
            <!-- 有图片时显示 -->
            <div v-if="inspectionResultsForm.finishedImage" class="image-preview">
              <img alt="" :src="inspectionResultsForm.finishedImage" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(inspectionResultsForm.finishedImage)"><zoom-in /></el-icon>
                <el-icon @click="handleFinishedImageRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog">
              <el-icon><plus /></el-icon>
            </div>
            <div style=" line-height: 1.2;text-align: center">
              <div>产品包装图</div>
              <div style=" margin-top: 2px;font-size: 12px; color: #999">展示包装完后的外包装</div>
            </div>
          </div>
          <div class="image-cell" style="margin-right: 15px">
            <!-- 有图片时显示 -->
            <div v-if="inspectionResultsForm.finishedImage" class="image-preview">
              <img alt="" :src="inspectionResultsForm.finishedImage" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(inspectionResultsForm.finishedImage)"><zoom-in /></el-icon>
                <el-icon @click="handleFinishedImageRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog">
              <el-icon><plus /></el-icon>
            </div>
            <div style=" line-height: 1.2;text-align: center">
              <div>包装测量图(长)</div>
              <div style=" margin-top: 2px;font-size: 12px; color: #999">展示实际测量尺的刻度</div>
            </div>
          </div>
          <div class="image-cell" style="margin-right: 15px">
            <!-- 有图片时显示 -->
            <div v-if="inspectionResultsForm.finishedImage" class="image-preview">
              <img alt="" :src="inspectionResultsForm.finishedImage" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(inspectionResultsForm.finishedImage)"><zoom-in /></el-icon>
                <el-icon @click="handleFinishedImageRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog">
              <el-icon><plus /></el-icon>
            </div>
            <div style=" line-height: 1.2;text-align: center">
              <div>包装测量图(宽)</div>
              <div style=" margin-top: 2px;font-size: 12px; color: #999">展示实际测量尺的刻度</div>
            </div>
          </div>
          <div class="image-cell" style="margin-right: 15px">
            <!-- 有图片时显示 -->
            <div v-if="inspectionResultsForm.finishedImage" class="image-preview">
              <img alt="" :src="inspectionResultsForm.finishedImage" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(inspectionResultsForm.finishedImage)"><zoom-in /></el-icon>
                <el-icon @click="handleFinishedImageRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog">
              <el-icon><plus /></el-icon>
            </div>
            <div style=" line-height: 1.2;text-align: center">
              <div>包装测量图(高)</div>
              <div style=" margin-top: 2px;font-size: 12px; color: #999">展示实际测量尺的刻度</div>
            </div>
          </div>
          <div class="image-cell" style="margin-right: 15px">
            <!-- 有图片时显示 -->
            <div v-if="inspectionResultsForm.finishedImage" class="image-preview">
              <img alt="" :src="inspectionResultsForm.finishedImage" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(inspectionResultsForm.finishedImage)"><zoom-in /></el-icon>
                <el-icon @click="handleFinishedImageRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog">
              <el-icon><plus /></el-icon>
            </div>
            <div style=" line-height: 1.2;text-align: center">
              <div>包装测量图(重量)</div>
              <div style=" margin-top: 2px;font-size: 12px; color: #999">展示出称的读数</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="零件细节" prop="partDetails" >
          <div class="image-cell">
            <!-- 有图片时显示 -->
            <div v-if="inspectionResultsForm.partDetails" class="image-preview">
              <img alt="" :src="inspectionResultsForm.partDetails" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(inspectionResultsForm.partDetails)"><zoom-in /></el-icon>
                <el-icon @click="handlePartDetailsRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog">
              <el-icon><plus /></el-icon>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="成品组装图" prop="finishedImage" >
          <div class="image-cell">
            <!-- 有图片时显示 -->
            <div v-if="inspectionResultsForm.finishedImage" class="image-preview">
              <img alt="" :src="inspectionResultsForm.finishedImage" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(inspectionResultsForm.finishedImage)"><zoom-in /></el-icon>
                <el-icon @click="handleFinishedImageRemove"><delete /></el-icon>
              </div>
            </div>
            <!-- 无图片时显示 -->
            <div v-else class="upload-placeholder" @click="showUploadDialog">
              <el-icon><plus /></el-icon>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="inspectionResultsForm.remark" placeholder="请输入备注" resize="none" :rows="2" type="textarea" />
        </el-form-item>
        <el-form-item label="打包数" prop="packingQuantity" >
          <el-input v-model.trim="inspectionResultsForm.packingQuantity" clearable placeholder="产品经理打包套数" style="min-width: 100%" />
        </el-form-item>
        <el-form-item label="结论" prop="conclusion" >
          <el-radio-group v-model="inspectionResultsForm.conclusion" >
            <el-radio value="1" >通过</el-radio>
            <el-radio value="2" >不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原因" prop="reason"  >
          <el-input v-model="inspectionResultsForm.reason"  clearable placeholder="质检不通过的原因" style="min-width: 100%" />
        </el-form-item>
        <el-form-item label="处理方式" prop="method" >
          <el-input v-model="inspectionResultsForm.method" clearable placeholder="整批售后、打包全检、部分售后等" style="min-width: 100%" />
        </el-form-item>
      </el-form>
    
      
      <template #footer>
        <!-- <div class="left-buttons">
          <div style="flex: 3">
            <el-button type="success" @click="downloadInspection">下载</el-button>
            <el-button type="warning" @click="saveInspection">保存</el-button>
          </div>
          <div style="flex: 2">
            <el-button type="danger" @click="closeQualityInspection">取消</el-button>
            <el-button type="success" @click="handleSubmitInspection">提交</el-button>
          </div>
        </div> -->
        <el-button type="warning" >退出</el-button>
        <el-button type="success" >下载</el-button>
        <el-button type="success">提交</el-button>
      </template>
    </vab-dialog>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @update:image-upload-visible="closeImageUpload" />
</template>

<script lang="ts" setup>
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { isEqual } from 'lodash'
import { updatePackageInspectionDetail } from '~/src/api/devlocal/packagingShipping'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'VabQualityInspectionReport',
})

const props = defineProps<{
  modelValue: boolean,
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const imagePreviewVisible = ref(false)
const imagePreviewList = ref<string[]>([])
const imageUploadVisible = ref(false)
const qualityInspectionForm = reactive<any>({})
const qualityInspectionFormRef = ref<FormInstance>()

const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const closeQualityInspection = () => {
  visible.value = false
}
const inspectionResultsForm = reactive({
  remark: '',
  packingQuantity: '',
  conclusion: '',
  reason: '',
  method: '',
  finishedImage: '',
  partDetails: '',
  baseImage: ''
})
const inspectionResultsFormRules = reactive({
  packingQuantity: [{ required: true, message: '请输入产品经理打包套数', trigger: 'blur' }],
  conclusion: [{ required: true, message: '请选择结论', trigger: 'change' }],
  reason: [{ required: true, message: '请输入原因', trigger: 'blur' }],
  method: [{ required: true, message: '请输入处理方式', trigger: 'blur' }],
  finishedImage: [{ required: true, message: '请上传成品组装图', trigger: 'change' }],
  partDetails: [{ required: true, message: '请上传零件细节图', trigger: 'change' }],
  baseImage: [{ required: true, message: '请上传基础图片', trigger: 'change' }],
})
const qualityInspectionFormRules = reactive({
  packingSize: [{ required: true, message: '请输入包装尺寸', trigger: 'blur' }],
  packageWeight: [{ required: true, message: '请输入包装重量', trigger: 'blur' }],
  materialComposition: [{ required: true, message: '', trigger: 'blur' }],
})
const handleFinishedImageRemove = () => {
  inspectionResultsForm.finishedImage = ''
}
const handlePartDetailsRemove = () => {
  inspectionResultsForm.partDetails = ''
}
// 打开上传图片弹窗
const showUploadDialog = (row: any) => {
  imageUploadVisible.value = true
  
}
// 关闭上传弹窗
const closeImageUpload = () => {
  imageUploadVisible.value = false
}
// 质检报告提交
// const handleSubmitInspection = async () => {
//   const { data } = await submitPackageInspection({
//     id: qualityInspectionForm.id,
//     packageLength: qualityInspectionForm.packageLength,
//     packageWidth: qualityInspectionForm.packageWidth,
//     packageHeight: qualityInspectionForm.packageHeight,
//     packageCount: qualityInspectionForm.packageCount,
//     packageWeight: qualityInspectionForm.packageWeight,
//     remark: qualityInspectionForm.remark,
//   })
//   if (data) {
//     $baseMessage('质检报告提交成功', 'success')
//     closeQualityInspection()
//   }
// }

// 质检报告下载
// const downloadInspection = async () => {
//   await downloadFile('/package/inspection/download', {
//     poId: copyRow.value.poId,
//   })
// }
// 质检报告详情修改
// const handleUpdatePackageInspectionDetail = async (row: any) => {
//   await updatePackageInspectionDetail({
//     id: row.id,
//     pass: row.pass,
//     remark: row.remark,
//   })
// }
let _row: any
// 质检报告cellStyle
const qualityInspectionCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 2) {
    return {
      textAlign: 'center' as const,
    }
  }
}
// 质检报告修改
const changeQualityInspectionInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  _row = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
// 质检报告修改输入失焦事件
const clickQualityInspectionCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1 && t1.classList[0] !== 'el-select') {
      t1.classList.add('none')
    }
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(_row, value)) {
    return
  }

  if (event.type === 'blur') {
    try {
      await updatePackageInspectionDetail({
        id: value.id,
        pass: value.pass,
        remark: value.remark,
      })
    } catch {
      Object.assign(value, _row)
    }
  }
}
</script>

<style lang="scss" scoped>
// 图片样式
.image-cell {
  width: 110px;
  height: 110px;
  
  // 有图片时的样式
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;
    
    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: fill;
    }
    
    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s ease;
      
      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;
        
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    
    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45);  // 悬停时的背景色
      opacity: 1;  // 悬停时完全显示
    }
  }
  // 没图片时的样式
  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    
    &:hover {
      border-color: var(--el-color-primary);
      .el-icon {
        color: var(--el-color-primary);
      }
    }
    
    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
}
</style>