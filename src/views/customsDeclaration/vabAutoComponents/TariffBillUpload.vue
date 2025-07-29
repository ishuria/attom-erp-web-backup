<template>
  <div>
    <vab-dialog v-model="visible" title="关税单上传" width="20%" @close="close">
      <el-form ref="uploadFormRef" label-position="top" :model="uploadForm" :rules="rules">
        <el-form-item label="误差设定" prop="error">
          <el-input v-model.trim="uploadForm.error" >
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="关税记在" prop="shipId">
          <el-select v-model="uploadForm.shipId" placeholder="请选择关税记在">
            <el-option
              v-for="item in props.shipmentIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
           <el-upload v-model:file-list="fileList" :auto-upload="false" drag multiple style="min-width: 100%;">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将PDF文件拖拽至此处或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="success" @click="handleUpload" :loading="loading">上传</el-button>
      </template>
    </vab-dialog>   
  </div>

</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { FormInstance } from 'element-plus'
import { uploadTariffBillPDF } from '/@/api/devlocal/customsDeclarationAndTaxRefund'

defineOptions({
  name: 'TariffBillUpload',
})
const props = defineProps<{
  modelValue: boolean
  shipmentIdList: { label: string, value: number }[]
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const close = () => {
  visible.value = false
  fileList.value = []
  uploadFormRef.value?.resetFields()
}
const fileList = ref<any[]>([])
const loading = ref(false)
const uploadFormRef = ref<FormInstance>()
const uploadForm = reactive({
  error: undefined as number | undefined,
  shipId: undefined as number | undefined,
})
const rules = reactive({
  error: [
    { required: true, message: '请输入误差设定', trigger: 'blur' },
  ],
  shipId: [
    { required: true, message: '请选择关税记在', trigger: 'change' },
  ],
})
const handleUpload = async () => {
  if (fileList.value.length === 0) {
    $baseMessage('请上传关税单', 'warning')
    return
  }
  await uploadFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      loading.value = true
      let formData = new FormData()
      const shipIds = props.shipmentIdList.map((item) => item.value).join(',')
      formData.append('error', uploadForm.error!.toString())
      formData.append('selectShipId', uploadForm.shipId!.toString())
      formData.append('shipIds', shipIds)
      fileList.value.forEach((item: any) => {
        formData.append('file', item.raw)
      })
      try {
        const { data } = await uploadTariffBillPDF(formData)
        if (data) {
          $baseMessage('关税单上传成功', 'success')
          close()
        }
        loading.value = false
      } catch (error) {
        loading.value = false
      }
    }
  })
}
</script>