<template>
  <vab-dialog v-model="sampleVisible" :before-close="childCloseDialog" title="拿样" width="25%">
    <el-form ref="sampleFormRef" label-width="auto" :model="sampleForm" :rules="rules" style="max-width: 600px">
      <el-form-item label="零件名" prop="componentInfo">
        <el-select
          v-model="sampleForm.componentInfo!"
          allow-create
          clearable
          filterable
          placeholder="请选择拿样零件或输入拿样零件"
          :reserve-keyword="false"
          value-key="id"
          @change="componentSelectChange"
        >
          <el-option v-for="val in componentList" :key="val.id!" :label="val.label!" :value="val" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="suppliserInfo">
        <div class="supplier-select-container">
          <el-select
            v-model="sampleForm.suppliserInfo!"
            allow-create
            clearable
            :disabled="suppliserFlag"
            filterable
            placeholder="请选择供应商或输入供应商"
            :reserve-keyword="false"
            value-key="id"
          >
            <el-option v-for="val in supplisertList" :key="val.id!" :label="val.label!" :value="val" />
          </el-select>
          <el-button
            v-if="sampleForm.suppliserInfo?.label"
            circle
            class="copy-btn"
            :icon="CopyDocument"
            size="small"
            type="primary"
            @click="handleClip(sampleForm.suppliserInfo.label)"
          />
        </div>
      </el-form-item>

      <el-form-item label="1688单号" prop="orderNo1688">
        <el-input v-model="sampleForm.orderNo1688" type="input" />
      </el-form-item>

      <el-form-item label="物流单号" prop="logisticsNo">
        <el-input v-model="sampleForm.logisticsNo" type="input" />
      </el-form-item>

      <el-form-item label="拿样金额" prop="price">
        <el-input v-model="sampleForm.price" type="input" />
      </el-form-item>

      <el-form-item label="下大货可退拿样金额" prop="bulkGoodsReturnable">
        <el-input v-model="sampleForm.bulkGoodsReturnable" type="input" />
      </el-form-item>

      <el-form-item v-if="needProof" label="可退拿样金额证明" prop="proof" required>
        <div class="proof-upload">
          <div v-if="proofPreviews.length" class="proof-thumb-list">
            <div v-for="(url, index) in proofPreviews" :key="index" class="proof-thumb">
              <el-image fit="cover" :preview-src-list="proofPreviews" :preview-teleported="true" :src="url" :z-index="3000" />
              <vab-icon class="proof-thumb__remove" icon="close-circle-fill" @click="removeProof(index)" />
            </div>
          </div>
          <el-upload accept="image/*" :auto-upload="false" drag multiple :on-change="handleProofChange" :show-file-list="false">
            <vab-icon class="proof-add-icon" icon="image-add-fill" />
            <div class="el-upload__text">
              拖拽 / 粘贴 图片到此处，或
              <em>点击上传</em>
              （可多张）
            </div>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="sampleForm.remark" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="childCloseDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(sampleFormRef)">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { CopyDocument } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { addSample, getComponentInfoList, getSuppliserInfoList } from '/@/api/devlocal/progressSample'
import type { ISampleAddReq, ISampleItem } from '/@/type/progress/sampleAndComponentType'
import { handleClip } from '/@/utils/clipboard'

defineComponent({
  name: 'VabSample',
})

const props = defineProps<{
  visible: boolean
  progressId: string
  closeDialog: () => void
  refreshComponent: () => void
}>()

const sampleFormRef = ref<FormInstance>()
const componentList = ref<ISampleItem[]>([])
const supplisertList = ref<ISampleItem[]>([])
const suppliserFlag = ref<boolean>(true)

interface AddSampleForm {
  progressId: string
  componentInfo?: ISampleItem | null
  suppliserInfo?: ISampleItem | null
  orderNo1688: string
  logisticsNo: string
  price: string
  bulkGoodsReturnable: string
  remark: string
  // 可退拿样金额证明（仅用于表单校验，文件单独存于 proofFile）
  proof?: string
}
const sampleVisible = ref<boolean>(false)

// 可退拿样金额证明文件及预览（支持多张）
const proofFiles = ref<File[]>([])
const proofPreviews = ref<string[]>([])

// 下大货可退拿样金额非空且不等于 0 时，需上传可退拿样金额证明
const needProof = computed(() => {
  const value = sampleForm.bulkGoodsReturnable
  return value !== '' && value !== null && value !== undefined && Number(value) !== 0
})

const progressId = ref<string>()

// 拿样form
let sampleForm = reactive<AddSampleForm>({
  progressId: props.progressId,
  componentInfo: null,
  suppliserInfo: null,
  orderNo1688: '',
  logisticsNo: '',
  price: '',
  bulkGoodsReturnable: '',
  remark: '',
})

const rules = reactive<FormRules<AddSampleForm>>({
  progressId: [
    {
      required: true,
      message: '进度id不能为空！',
      trigger: 'change',
    },
  ],
  componentInfo: [
    {
      required: true,
      message: '零件名不能为空！',
      trigger: 'change',
    },
  ],
  suppliserInfo: [
    {
      required: true,
      message: '供应商不能为空!',
      trigger: 'change',
    },
  ],
  price: [
    {
      required: true,
      message: '拿样金额不能为空！',
      trigger: 'blur',
    },
  ],
  orderNo1688: [
    {
      validator: (rule, value, callback) => {
        if (!value && !sampleForm.logisticsNo) {
          callback(new Error('1688和物流单号至少要填一个！'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  logisticsNo: [
    {
      validator: (rule, value, callback) => {
        if (!value && !sampleForm.orderNo1688) {
          callback(new Error('1688和物流单号至少要填一个！'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  bulkGoodsReturnable: [
    {
      required: true,
      message: '下大货可退拿样金额不能为空！',
      trigger: 'blur',
    },
  ],
  proof: [
    {
      validator: (rule, value, callback) => {
        if (needProof.value && proofFiles.value.length === 0) {
          callback(new Error('请上传可退拿样金额证明！'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(sampleForm)
      let params: ISampleAddReq = {
        progressId: sampleForm.progressId,
        orderNo1688: sampleForm.orderNo1688,
        logisticsNo: sampleForm.logisticsNo,
        price: sampleForm.price,
        bulkGoodsReturnable: sampleForm.bulkGoodsReturnable,
        remark: sampleForm.remark,
      }

      // 处理零件
      if (sampleForm && typeof sampleForm.componentInfo === 'object') {
        params.componentId = sampleForm.componentInfo?.id!
        params.componentName = sampleForm.componentInfo?.label!
      } else {
        params.componentId = -1
        params.componentName = sampleForm.componentInfo as string
      }

      // 处理供应商
      if (sampleForm && typeof sampleForm.suppliserInfo === 'object') {
        params.suppliserId = sampleForm.suppliserInfo?.id!
        params.supplierName = sampleForm.suppliserInfo?.label!
      } else {
        params.suppliserId = -1
        params.supplierName = sampleForm.suppliserInfo as string
      }

      // 整体改为 multipart 提交，证明文件随表单一起上传
      const formData = new FormData()
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val))
        }
      })
      if (needProof.value && proofFiles.value.length) {
        proofFiles.value.forEach((file) => formData.append('file', file))
      }

      const { data } = await addSample(formData)
      if (data === true) {
        $baseMessage('新增拿样零件成功', 'success', 'hey')
        childCloseDialog()
        if (params.componentId === -1 || params.suppliserId === -1) {
          props.refreshComponent()
        }
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

watchEffect(() => {
  sampleVisible.value = props.visible
  progressId.value = props.progressId
  if (sampleVisible.value === true) fetchData()
})

// 弹窗打开期间在 document 上监听粘贴，解决首次粘贴因焦点不在上传区而失效的问题
watch(sampleVisible, (val) => {
  if (val) {
    document.addEventListener('paste', handleProofPaste)
  } else {
    document.removeEventListener('paste', handleProofPaste)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('paste', handleProofPaste)
})

// 零件名selct切换
const componentSelectChange = async (value: ISampleItem) => {
  suppliserFlag.value = false

  if (value && typeof value === 'object') {
    const { data } = await getSuppliserInfoList({ componentId: value.id! })
    supplisertList.value = data
  }
}

// 追加一张可退拿样金额证明
const addProofFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    $baseMessage('只能上传图片！', 'warning')
    return
  }
  proofFiles.value.push(file)
  proofPreviews.value.push(URL.createObjectURL(file))
  // 同步表单值，满足 el-form-item 的 required 校验（证明文件单独存于 proofFiles）
  sampleForm.proof = String(proofFiles.value.length)
  sampleFormRef.value?.validateField('proof')
}

// 点击 / 拖拽上传（multiple 时每个文件触发一次）
const handleProofChange = (uploadFile: UploadFile) => {
  if (uploadFile.raw) addProofFile(uploadFile.raw)
}

// 截图粘贴上传（弹窗打开期间于 document 监听，不依赖焦点落点；仅在需要证明时处理）
const handleProofPaste = (event: ClipboardEvent) => {
  if (!needProof.value) return
  const items = event.clipboardData?.items
  if (!items) return
  Array.from(items).forEach((item) => {
    if (item.type.includes('image')) {
      const file = item.getAsFile()
      if (file) addProofFile(file)
    }
  })
}

// 移除一张证明
const removeProof = (index: number) => {
  URL.revokeObjectURL(proofPreviews.value[index])
  proofFiles.value.splice(index, 1)
  proofPreviews.value.splice(index, 1)
  sampleForm.proof = proofFiles.value.length ? String(proofFiles.value.length) : ''
  sampleFormRef.value?.validateField('proof')
}

const clearProof = () => {
  proofPreviews.value.forEach((url) => URL.revokeObjectURL(url))
  proofFiles.value = []
  proofPreviews.value = []
  sampleForm.proof = ''
}

const childCloseDialog = async () => {
  sampleFormRef.value!.resetFields()
  clearProof()
  props.closeDialog()
}
const fetchData = async () => {
  const { data } = await getComponentInfoList({ progressId: parseInt(props.progressId) })
  componentList.value = data
}
</script>

<style lang="scss" scoped>
// 供应商选择框容器样式
.supplier-select-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  .el-select {
    flex: 1;
  }

  .copy-btn {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 12px;
  }
}

// 可退拿样金额证明上传
.proof-upload {
  width: 100%;

  .proof-thumb-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;

    .proof-thumb {
      position: relative;
      width: 72px;
      height: 72px;

      .el-image {
        width: 100%;
        height: 100%;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
      }

      .proof-thumb__remove {
        position: absolute;
        top: -8px;
        right: -8px;
        font-size: 16px;
        color: var(--el-color-danger);
        cursor: pointer;
        background: #fff;
        border-radius: 50%;
      }
    }
  }

  .proof-add-icon {
    margin-bottom: 8px;
    font-size: 28px;
    color: #999;
  }
}
</style>
