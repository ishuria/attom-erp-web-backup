<template>
  <vab-dialog v-model="visible" title="发布任务" width="25%" @close="handleClose">
    <el-form ref="formRef" label-position="right" label-width="auto" :model="form" :rules="rules" style="margin: 0 60px">
      <el-form-item label="SKU" prop="sku" :required="form.taskType !== '设计任务'">
        <div class="sku-select-container">
          <el-select
            v-model="form.sku"
            default-first-option
            filterable
            :loading="skuLoading"
            placeholder="点击输入和搜索"
            remote
            :remote-method="remoteSKUMethod"
            @change="handleSkuChange"
          >
            <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button
            v-if="form.sku"
            circle
            class="copy-btn"
            :icon="CopyDocument"
            size="small"
            type="primary"
            @click="handleClip(form.sku)"
          />
        </div>
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType">
        <el-select v-model="form.taskType" placeholder="请选择任务类型" @change="fetchArtDesignUserList">
          <el-option v-for="item in taskTypeOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="站点" prop="sites">
        <el-select v-model="form.sites" clearable collapse-tags collapse-tags-tooltip multiple placeholder="请选择站点">
          <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品分类" prop="position">
        <el-select v-model="form.position" placeholder="请选择产品分类">
          <el-option v-for="item in productPositionOption" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="要求完成日期" prop="finishDate">
        <el-date-picker
          v-model="form.finishDate"
          :disabled-date="(time: Date) => time.getTime() < Date.now() - 8.64e7"
          type="date"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="设计类型" prop="artDesignType">
        <el-select v-model="form.artDesignType" clearable multiple placeholder="请选择设计类型">
          <el-option v-for="item in filteredDesignTypeOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.taskType === '设计任务'" label="是否有最终产品" prop="hasFinalProduct">
        <el-radio-group v-model="form.hasFinalProduct">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="美工" prop="artDesign">
        <el-select v-model="form.artDesign" clearable collapse-tags collapse-tags-tooltip multiple placeholder="请选择人员">
          <el-option v-for="item in artDesignUserList" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="要求" prop="remark" :required="form.taskType === '设计任务' && !form.sku">
        <el-input v-model="form.remark" placeholder="如没有SKU，请填写产品中文名称" resize="none" :rows="3" type="textarea" />
      </el-form-item>
      <el-form-item label="需求文件共享文档地址" prop="linkAddress" :required="form.taskType === '设计任务'">
        <el-input v-model="form.linkAddress" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="margin-right: 60px">
        <el-button type="danger" @click="handleClose">取消</el-button>
        <el-button :disabled="submitting" :loading="submitting" type="success" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { CopyDocument } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules } from 'element-plus'
import { designTypeOption, taskTypeOption } from '../constantOption'
import { addArtDesignTask, getArtDesignTaskUserList, getArtDesignTaskUserListBySku } from '/@/api/devlocal/imageTask'
import { getProductPositionList } from '/@/api/devlocal/orderProcess'
import { getPoSkuList } from '/@/api/devlocal/purchasePo'
import type { IAddArtDesignTaskReq, IGetArtDesignTaskUserListBySku } from '/@/type/listingTask/imageTaskType'
import { handleClip } from '/@/utils/clipboard'

defineOptions({
  name: 'PostTaskDialog',
})

const props = defineProps<{
  siteList: { id: number; label: string }[]
}>()

const emit = defineEmits<{
  success: []
}>()

const visible = defineModel<boolean>('visible', {
  required: true,
})

const formRef = ref<FormInstance>()

interface PostTaskForm {
  sku: string
  taskType: string
  sites: number[]
  position: number | null
  finishDate: string
  artDesignType: number[]
  artDesign: number[]
  remark: string
  linkAddress: string
  hasFinalProduct: number
}

const form = reactive<PostTaskForm>({
  sku: '',
  taskType: '老品优化',
  sites: [] as number[],
  position: null,
  finishDate: '',
  artDesignType: [] as number[],
  artDesign: [] as number[],
  remark: '',
  linkAddress: '',
  hasFinalProduct: 1,
})

const rules = reactive<FormRules<PostTaskForm>>({
  sku: [
    {
      validator: (_rule, value, callback) => {
        if (form.taskType !== '设计任务' && !value) {
          callback(new Error('请输入SKU'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  sites: [{ required: true, type: 'array', min: 1, message: '请选择站点', trigger: 'change' }],
  position: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
  finishDate: [{ required: true, message: '请选择要求完成日期', trigger: 'change' }],
  artDesignType: [{ required: true, type: 'array', min: 1, message: '请选择设计类型', trigger: 'change' }],
  linkAddress: [
    {
      validator: (_rule, value, callback) => {
        if (form.taskType === '设计任务' && !value) {
          callback(new Error('请输入需求文件共享文档地址'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  remark: [
    {
      validator: (_rule, value, callback) => {
        if (form.taskType === '设计任务' && !form.sku && !value) {
          callback(new Error('没有SKU，请输入产品中文名称'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
})

// SKU 远程搜索
const skuLoading = ref(false)
const skuOptions = ref<{ value: string; label: string }[]>([])
const skuList = ref<{ value: string; label: string }[]>([])
let skuSearchSeq = 0

const remoteSKUMethod = async (query: string) => {
  const keyword = query.trim()
  const currentSeq = ++skuSearchSeq

  if (keyword) {
    skuLoading.value = true
    try {
      const { data } = await getPoSkuList({ sku: keyword })
      if (currentSeq !== skuSearchSeq) return

      skuList.value = data.map((item: any) => ({
        value: `${item}`,
        label: `${item}`,
      }))
      skuOptions.value = skuList.value.filter((item) => {
        return item.label.toLowerCase().includes(keyword.toLowerCase())
      })
    } finally {
      if (currentSeq === skuSearchSeq) {
        skuLoading.value = false
      }
    }
  } else {
    skuLoading.value = false
    skuList.value = []
    skuOptions.value = []
  }
}

// 美工人员列表
const artDesignUserList = ref<IGetArtDesignTaskUserListBySku[]>([])
let artDesignUserRequestSeq = 0
const fetchArtDesignUserOptions = async () => {
  const currentSeq = ++artDesignUserRequestSeq
  artDesignUserList.value = []

  if (form.taskType === '设计任务') {
    const { data } = await getArtDesignTaskUserList()
    if (currentSeq === artDesignUserRequestSeq) {
      artDesignUserList.value = data
    }
    return
  }

  if (form.sku) {
    const { data } = await getArtDesignTaskUserListBySku({ sku: form.sku })
    if (currentSeq === artDesignUserRequestSeq) {
      artDesignUserList.value = data
    }
  }
}
const handleSkuChange = async () => {
  form.artDesign = []
  await fetchArtDesignUserOptions()
}
const fetchArtDesignUserList = async () => {
  form.artDesignType = []
  form.artDesign = []
  if (form.taskType !== '设计任务') {
    form.hasFinalProduct = 1
  }
  await fetchArtDesignUserOptions()
}

// 产品分类
const productPositionOption = ref<{ id: number; label: string }[]>([])
const fetchProductPositionOption = async () => {
  const { data } = await getProductPositionList()
  productPositionOption.value = data
}

// 根据任务类型过滤设计类型选项
const filteredDesignTypeOption = computed(() => {
  const taskType = form.taskType
  if (taskType === '设计任务') {
    return designTypeOption.filter((item) => [4, 6, 7].includes(item.value))
  }
  if (taskType === '新品任务' || taskType === '老品优化') {
    return designTypeOption.filter((item) => [0, 1, 2, 3, 5].includes(item.value))
  }
  return designTypeOption
})

const handleClose = () => {
  formRef.value?.resetFields()
  artDesignUserList.value = []
  skuOptions.value = []
  skuList.value = []
  skuLoading.value = false
  visible.value = false
}

const submitting = ref(false)
const handleConfirm = async () => {
  if (submitting.value) return
  if (form.taskType === '设计任务' && form.hasFinalProduct === 0) {
    $baseMessage('没有最终产品时暂不能发布设计任务', 'warning')
    return
  }

  const isValid = await formRef.value?.validate().catch(() => false)
  if (!isValid) return

  submitting.value = true
  try {
    const payload: IAddArtDesignTaskReq = {
      sku: form.sku,
      taskType: form.taskType,
      sites: form.sites.join(','),
      position: form.position as number,
      finishDate: form.finishDate,
      artDesignType: form.artDesignType.map(String),
      artDesign: form.artDesign.join(','),
      remark: form.remark,
      linkAddress: form.linkAddress,
    }
    const { data } = await addArtDesignTask(payload)
    if (data) {
      $baseMessage('已提交发布审批，等待直属上级审批！', 'success')
      handleClose()
      emit('success')
    }
  } finally {
    submitting.value = false
  }
}

// 弹窗打开时加载产品分类
watch(visible, async (val) => {
  if (val) {
    await fetchProductPositionOption()
  }
})
</script>

<style lang="scss" scoped>
.sku-select-container {
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
</style>
