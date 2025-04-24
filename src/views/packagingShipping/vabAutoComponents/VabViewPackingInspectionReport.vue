<template>
  <!-- 打包质检报告 -->
  <vab-dialog v-model="visible" title="打包质检报告" top="10vh" width="50%" @close="closeQualityInspection">
    <el-form
      label-position="left"
      label-width="auto"
      :model="qualityInspectionForm"
      require-asterisk-position="right"
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
        :cell-style="qualityInspectionCellStyle"
        class="quality-inspection"
        :data="inspectionList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
      >
        <el-table-column label="质检项目" min-width="330" prop="qualityInspection" />
        <el-table-column label="检查类型" min-width="100" prop="type" />
        <el-table-column label="通过" min-width="70" prop="pass">
          <template #default="{ row }">
            <el-checkbox v-model="row.pass" disabled :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column label="需质检" width="90">
          <template #default="{ row }">
            <el-checkbox v-model="row.status" disabled :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column label="需拍照" width="90">
          <template #default="{ row }">
            <el-checkbox v-model="row.isUploadImages" disabled :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column label="上传图片" :width="getImageColumnWidth()" >
          <template #default="{ row }">
            <div v-if="row.isUploadImages === 1" style="display: flex; gap: 8px; align-items: center">
                <div v-for="(image, index) in row.images" :key="index" class="image-cell">
                  <div class="image-preview">
                    <img :alt="image.id" :src="image.imgUrl" />
                    <div class="image-actions">
                      <el-icon @click="showPreviewImage(row.images, index)"><zoom-in /></el-icon>
                    </div>
                  </div>
                </div>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="150" prop="remark">
          <template #default="{ row }">
            {{ row.remark }}
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="结论" prop="status" style="margin-top: 10px">
        <el-radio-group v-model="qualityInspectionForm.status" disabled>
          <el-radio :value="0">通过</el-radio>
          <el-radio :value="1">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="margin-right: 30px">
        <el-button type="warning" @click="closeQualityInspection">关闭</el-button>
      </div>
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :initial-index="currentPreviewIndex"  :url-list="imagePreviewList" @close="imagePreviewClose" />
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { IInspectionList } from '/@/type/packagingShipping/packagingType'

defineOptions({
  name: 'VabViewPackingInspectionReport',
})

const props = defineProps<{
  modelValue: boolean
  reportData: any
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
const qualityInspectionForm = reactive({
  sku: '',
  status: 0,
  productName: '',
  id: '',
  po: '',
  packageTaskId: ''
})
const inspectionList = ref<IInspectionList[]>([])
const currentPreviewIndex = ref<number>(0)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const closeQualityInspection = () => {
  visible.value = false
}
const showPreviewImage = (images: any[], currentIndex: number) => {
  imagePreviewList.value = images.map(img => img.imgUrl)
  imagePreviewVisible.value = true
  // 设置当前预览图片的索引
  currentPreviewIndex.value = currentIndex
}
const getImageColumnWidth = (): number => {
  const imageWidth = 75 // 每张图片宽度
  let maxWidth = 0
  inspectionList.value.forEach((row) => {
    const imageCount = row?.images?.length || 0
    let totalWidth = 0
    if (imageCount === 5) totalWidth = (imageCount * imageWidth) + 24 + (imageCount - 1) * 8
    else totalWidth = ((imageCount + 1) * imageWidth) + 24 + imageCount * 8
    if (totalWidth > maxWidth) {
      maxWidth = totalWidth
    }
  })
  return maxWidth
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
</script>