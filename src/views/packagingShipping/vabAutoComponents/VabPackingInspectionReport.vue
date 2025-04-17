<template>
 <!-- 打包质检报告 -->
 <vab-dialog v-model="visible" title="打包质检报告" top="10vh" width="40%" @close="closeQualityInspection">
    <el-form
      ref="qualityInspectionFormRef"
      label-position="left"
      label-width="auto"
      :model="qualityInspectionForm"
      require-asterisk-position="right"
      :rules="qualityInspectionFormRules"
      style="margin-right: 30px; margin-left: 30px"
    >
      <el-form-item label="SKU" prop="sku">
        <el-input v-model="qualityInspectionForm.sku" disabled style="margin-right: 0" />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="qualityInspectionForm.productName" disabled style="margin-right: 0" />
      </el-form-item>
      <el-form-item label="任务id" prop="sku">
        <el-input v-model="qualityInspectionForm.packageTaskId" disabled style="margin-right: 0" />
      </el-form-item>
      <el-form-item label="PO" prop="productName">
        <el-input v-model="qualityInspectionForm.po" disabled style="margin-right: 0" />
      </el-form-item>
      <el-divider >质检结果</el-divider>
      <el-table
        border
        :cell-class-name="clearPadding"
        :cell-style="qualityInspectionCellStyle"
        class="quality-inspection"
        :data="inspectionList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
        @cell-click="changeQualityInspectionInput"
      >
        <el-table-column label="质检项目" min-width="330" prop="qualityInspection" />
        <el-table-column label="检查类型" min-width="100" prop="type" />
        <el-table-column label="通过" min-width="70" prop="pass">
          <template #default="{ row }">
            <el-checkbox v-model="row.pass" :false-value="0" :true-value="1" @change="handleUpdatePackageInspectionDetail(row)" />
          </template>
        </el-table-column>
        <el-table-column label="需质检" width="90">
          <template #default="{ row }">
            <el-checkbox v-model="row.needInspection" :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column label="需拍照" width="90">
          <template #default="{ row }">
            <el-checkbox v-model="row.needPhoto" :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column label="上传图片" width="76">
          <template #header>
            上传<br />图片
          </template>
          <template #default="{ row }">
            <div class="image-cell">
              <!-- 有图片时显示 -->
              <div v-if="row.image" class="image-preview">
                <img alt="" :src="row.image" />
                <div class="image-actions">
                  <el-icon @click="showPreviewImage(row.image)"><zoom-in /></el-icon>
                  <el-icon @click="handleRemoveImage"><delete /></el-icon>
                </div>
              </div>
              <!-- 无图片时显示 -->
              <div v-else class="upload-placeholder" @click="showUploadDialog">
                <el-icon><plus /></el-icon>
              </div>
            </div>
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
      <!-- <el-form-item label="产品经理打包数量" prop="packageCount" style="margin-top: 20px">
        <el-input v-model.trim="qualityInspectionForm.packageCount" clearable style="margin-right: 0" />
      </el-form-item>
      <el-form-item label="其他反馈" prop="remark">
        <el-input v-model="qualityInspectionForm.remark" placeholder="请输入其他反馈" resize="none" :rows="2" type="textarea" />
      </el-form-item> -->
      <el-form-item label="结论" prop="conclusion" style="margin-top: 10px">
        <el-radio-group v-model="qualityInspectionForm.status">
          <el-radio label="0">通过</el-radio>
          <el-radio label="1">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="margin-right: 30px">
        <el-button type="warning" @click="closeQualityInspection">退出</el-button>
        <el-button type="success" @click="handleSubmitInspection">提交</el-button>
      </div>
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  <!-- 上传图片 -->
  <vab-image-upload v-model="imageUploadVisible" @image-upload="" />
</template>

<script lang="ts" setup>
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { isEqual } from 'lodash'
import { downloadFile } from '/@/api/devlocal/download'
import { getPackageInspection } from '/@/api/devlocal/packagingShipping'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import type { CSSProperties } from 'vue'
import type { IInspectionList } from '/@/type/packagingShipping/packagingType'

defineOptions({
  name: "VabPackingInspectionReport",
})

const props = defineProps<{
  modelValue: boolean,
  taskId: number,
  sku: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
watch(() => props.modelValue, (value) => {
  if (value) {
    fetchData()
  }
})
const qualityInspectionFormRef = ref<FormInstance>()
const qualityInspectionFormRules = reactive({
  conclusion: [
    { required: true, message: '请选择结论', trigger: 'change' },
  ],
})
const inspectionList = ref<IInspectionList[]>([])
const imagePreviewVisible = ref(false)
const imagePreviewList = ref<string[]>([])
const imageUploadVisible = ref(false)
const showUploadDialog = () => {
  imageUploadVisible.value = true
}
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
const qualityInspectionForm = reactive({
  sku: '',
  status: 0,
  productName: '',
  id: '',
  po: '',
  packageTaskId: ''
})

const handleRemoveImage = () => {
  // _row.image = ''
}
// 质检报告提交
const handleSubmitInspection = async () => {
  // const { data } = await submitPackageInspection({
  //   id: qualityInspectionForm.id,
  //   packageLength: qualityInspectionForm.packageLength,
  //   packageWidth: qualityInspectionForm.packageWidth,
  //   packageHeight: qualityInspectionForm.packageHeight,
  //   packageCount: qualityInspectionForm.packageCount,
  //   packageWeight: qualityInspectionForm.packageWeight,
  //   remark: qualityInspectionForm.remark,
  // })
  // if (data) {
  //   $baseMessage('质检报告提交成功', 'success')
  //   closeQualityInspection()
  // }
}
let _row: any
// 质检报告下载
const downloadInspection = async () => {
  await downloadFile('/package/inspection/download', {
    // poId: copyRow.value.poId,
  })
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
    // try {
    //   await updatePackageInspectionDetail({
    //     id: value.id,
    //     pass: value.pass,
    //     remark: value.remark,
    //   })
    // } catch {
    //   Object.assign(value, _row)
    // }
  }
}
// 质检报告详情修改
const handleUpdatePackageInspectionDetail = async (row: any) => {
  // await updatePackageInspectionDetail({
  //   id: row.id,
  //   pass: row.pass,
  //   remark: row.remark,
  // })
}
// 质检报告cellStyle
const qualityInspectionCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '检查类型' || label === '通过' || label === '需质检' || label === '需拍照') {
    return {
      textAlign: 'center',
    }
  } else if (label === '备注') {
    return {
      cursor: 'pointer',
      textAlign: 'left'
    }
  } else {
    return {
      textAlign: 'left',
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
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.label === '上传图片') {
    return 'clear-padding'
  }
  return ''
}

const fetchData = async () => {
  const { data } = await getPackageInspection({
    taskId: props.taskId,
    sku: props.sku,
  })
  if (data) {
    inspectionList.value = data.inspectionList
    Object.assign(qualityInspectionForm, data)
  }
}
</script>

<style lang="scss" scoped>
// 图片样式
.image-cell {
  width: 75px;
  height: 75px;
  
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
.el-table :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.el-table :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.none {
  display: none;
}
.el-checkbox {
  transform: scale(1.2);
}
</style>