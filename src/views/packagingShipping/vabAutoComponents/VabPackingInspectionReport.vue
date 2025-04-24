<template>
 <!-- 打包质检报告 -->
 <vab-dialog v-model="visible" title="打包质检报告" top="10vh" width="50%" @close="closeQualityInspection">
    <el-form
      ref="qualityInspectionFormRef"
      label-position="left"
      label-width="auto"
      :model="qualityInspectionForm"
      require-asterisk-position="right"
      :rules="qualityInspectionFormRules"
      style="margin-right: 30px; margin-left: 30px"
    >
      <el-form-item label="日期">
        <el-input disabled style="margin-right: 0" />
      </el-form-item>
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
                      <el-icon @click="handleImageRemove(image, row)"><delete /></el-icon>
                    </div>
                  </div>
                </div>
                <!-- 添加按钮 -->
                <div class="image-cell">
                  <div class="upload-placeholder" @click="showUploadDialog(row)">
                    <el-icon><plus /></el-icon>
                  </div>
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
      <el-form-item label="结论" prop="status" style="margin-top: 10px">
        <el-radio-group v-model="qualityInspectionForm.status" @change="handleUpdateInspection">
          <el-radio :value="0">通过</el-radio>
          <el-radio :value="1">不通过</el-radio>
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
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :initial-index="currentPreviewIndex"  :url-list="imagePreviewList" @close="imagePreviewClose" />
  <!-- 上传图片 -->
  <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
</template>

<script lang="ts" setup>
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { isEqual } from 'lodash'
import type { CSSProperties } from 'vue'
import { deletePackageInspectionItemImage, getPackageInspection, submitPackageInspection, updateNewPackageInspection, updatePackageInspectionDetail, uploadPackageInspectionItemImage } from '/@/api/devlocal/packagingShipping'
import type { IInspectionList } from '/@/type/packagingShipping/packagingType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

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
  status: [
    { required: true, message: '请选择结论', trigger: 'change' },
  ],
})
const inspectionList = ref<IInspectionList[]>([])
const reportId = ref<number | undefined>(undefined)
const imagePreviewVisible = ref(false)
const imagePreviewList = ref<string[]>([])
const imageUploadVisible = ref(false)
const id = ref<number>(0)
let _row: any
const currentPreviewIndex = ref<number>(0)
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
const showUploadDialog = (row: any) => {
  id.value = row.id
  _row = row
  imageUploadVisible.value = true
}
const showPreviewImage = (images: any[], currentIndex: number) => {
  imagePreviewList.value = images.map(img => img.imgUrl)
  imagePreviewVisible.value = true
  // 设置当前预览图片的索引
  currentPreviewIndex.value = currentIndex
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

const uploadImage = async (file: File) => {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file)
    uploadImgForm.append('reportDetailId', String(id.value))

    const { data } = await uploadPackageInspectionItemImage(uploadImgForm)
    if (data) {   
      _row.images.push(data)
      $baseMessage('图片上传成功！', 'success')
      imageUploadVisible.value = false
    } else {
      $baseMessage('图片上传失败！', 'error')
    }
  } catch (error) {
    console.error(error)
  }
}
const handleImageRemove = async (image: any, row: any) => {
  try {
    $baseConfirm('确定删除图片吗？', null,  async () => {
      const { data } = await deletePackageInspectionItemImage({ id: image.id  })
      if (data) {
        const index = row.images.findIndex((item: any) => item.id === image.id)
        row.images.splice(index, 1)
        $baseMessage('图片删除成功！','success')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleUpdateInspection = async () => {
  try {
    await updateNewPackageInspection({
      reportId: reportId.value,
      status: qualityInspectionForm.status,
    })
  } catch (error) {
    console.log(error)
  }
}
// 质检报告提交
const handleSubmitInspection = async () => {
  qualityInspectionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const { data } = await submitPackageInspection({
        reportId: reportId.value!,
        type: 1
      })
      if (data) {
        $baseMessage('打包质检报告提交成功', 'success')
        visible.value = false
      }
    }
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
// 质检报告详情修改
const handleUpdatePackageInspectionDetail = async (row: any) => {
  await updatePackageInspectionDetail({
    id: row.id,
    pass: row.pass,
    remark: row.remark,
  })
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
// const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
//   if (data.column.label === '上传图片') {
//     return 'clear-padding'
//   }
//   return ''
// }

const fetchData = async () => {
  const { data } = await getPackageInspection({
    taskId: props.taskId,
    sku: props.sku,
  })
  if (data) {
    data.inspectionList.forEach((row: any) => {
      if (row.images.length === 0) {
        row.imgUrl = ''
      } else {
        row.imgUrl = row.images[0].imgUrl
        row.imgId = row.images[0].id
      }
    })
    inspectionList.value = data.inspectionList
    // console.log(inspectionList.value)
    reportId.value = data.reportId
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