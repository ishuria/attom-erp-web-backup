<template>
  <vab-dialog v-model="visible" title="发布任务" width="25%" @close="handleClose">
    <el-form ref="formRef" label-position="right" label-width="auto" :model="form" :rules="rules" style="margin: 0 60px">
      <el-form-item label="sku" prop="sku">
        <div class="sku-select-container">
          <el-select
            v-model="form.sku"
            default-first-option
            filterable
            :loading="skuLoading"
            placeholder="点击输入和搜索"
            remote
            :remote-method="remoteSKUMethod"
            @change="handleFetchArtDesignUserList"
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
        <el-select v-model="form.taskType" placeholder="请选择任务类型">
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
      <el-form-item label="美工" prop="artDesign">
        <el-select v-model="form.artDesign" clearable collapse-tags collapse-tags-tooltip multiple placeholder="请选择人员">
          <el-option v-for="item in artDesignUserList" :key="item.id" :disabled="item.status" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="要求" prop="remark">
        <el-input v-model="form.remark" resize="none" :rows="3" type="textarea" />
      </el-form-item>
      <el-form-item label="需求文件共享文档地址" prop="linkAddress">
        <el-input v-model="form.linkAddress" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="margin-right: 60px">
        <el-button type="danger" @click="handleClose">取消</el-button>
        <el-button type="success" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { CopyDocument } from '@element-plus/icons-vue'
import { type FormInstance, type FormRules } from 'element-plus'
import { designTypeOption, taskTypeOption } from '../constantOption'
import { addArtDesignTask, getArtDesignTaskUserListBySku } from '/@/api/devlocal/imageTask'
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
const form = reactive({
  sku: '',
  taskType: '老品优化',
  sites: [] as number[],
  position: 0,
  finishDate: '',
  artDesignType: [] as number[],
  artDesign: [] as number[],
  remark: '',
  linkAddress: '',
})

const rules = reactive<FormRules<IAddArtDesignTaskReq>>({
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  sites: [{ required: true, message: '请选择站点', trigger: 'change' }],
  position: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
  finishDate: [{ required: true, message: '请选择要求完成日期', trigger: 'change' }],
  artDesignType: [{ required: true, message: '请选择设计类型', trigger: 'change' }],
})

// SKU 远程搜索
const skuLoading = ref(false)
const skuOptions = ref<{ value: string; label: string }[]>([])
const skuList = ref<{ value: string; label: string }[]>([])

const remoteSKUMethod = async (query: string) => {
  if (query) {
    const { data } = await getPoSkuList({ sku: query })
    skuList.value = data.map((item: any) => ({
      value: `${item}`,
      label: `${item}`,
    }))
    skuLoading.value = true
    setTimeout(() => {
      skuLoading.value = false
      skuOptions.value = skuList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    skuOptions.value = []
  }
}

// 美工人员列表
const artDesignUserList = ref<IGetArtDesignTaskUserListBySku[]>([])
const handleFetchArtDesignUserList = async () => {
  const { data } = await getArtDesignTaskUserListBySku({ sku: form.sku })
  artDesignUserList.value = data
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
  visible.value = false
}

const handleConfirm = async () => {
  formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addArtDesignTask({
        ...form,
        sites: Array.isArray(form.sites) ? form.sites.join(',') : '',
        artDesignType: Array.isArray(form.artDesignType) ? form.artDesignType.join(',') : '',
        artDesign: Array.isArray(form.artDesign) ? form.artDesign.join(',') : '',
      })
      if (data) {
        $baseMessage('发布任务成功！', 'success')
        handleClose()
        emit('success')
      }
    }
  })
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
