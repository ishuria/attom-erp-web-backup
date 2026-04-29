<template>
  <!-- 生成AI调研报告 -->
  <vab-dialog v-model="visible" title="生成AI调研报告" width="640" @closed="resetAIReportForm">
    <el-form ref="aiReportFormRef" label-position="top" :model="aiReportForm" :rules="aiReportRules" @submit.prevent>
      <el-form-item label="产品品名" prop="productName">
        <el-input v-model.trim="aiReportForm.productName" clearable placeholder="请输入产品品名" />
      </el-form-item>
      <el-form-item prop="competitorAsin">
        <template #label>
          <span class="form-label">
            需要分析的主要竞对ASIN
            <span class="label-tip">要求逗号分割不区分中英文</span>
          </span>
        </template>
        <el-input v-model.trim="aiReportForm.competitorAsin" clearable placeholder="例如：B0XXXXXXXX, B0YYYYYYYY" />
      </el-form-item>
      <el-form-item prop="coreKeyWord">
        <template #label>
          <span class="form-label">
            调研核心关键词
            <span class="label-tip">不填写关键词时，请填写AI挖掘核心关键词数量</span>
          </span>
        </template>
        <el-input v-model.trim="aiReportForm.coreKeyWord" clearable placeholder="例如：Power bank, portable charger, battery" />
      </el-form-item>
      <el-form-item label="除了已给到的核心关键词外，需要AI自行挖掘并调研的核心关键词数量" prop="count">
        <el-input-number v-model="aiReportForm.count" controls-position="right" :min="0" :precision="0" :step="1" />
        <div class="form-tip">未填写调研核心关键词时，此数量不能为0。</div>
      </el-form-item>
      <el-form-item label="产品差异化初步想法" prop="userIdea">
        <el-input
          v-model.trim="aiReportForm.userIdea"
          :autosize="{ minRows: 4, maxRows: 8 }"
          placeholder="请输入产品差异化初步想法"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="aiReportSubmitting" type="primary" @click="submitAIReport">生成报告</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { createEvaluationResearchReportConversation, sendAiChatMessage } from '/@/api/devlocal/ai'
import { useAiStore } from '/@/store/modules/ai'

defineOptions({
  name: 'AIReportFormDialog',
})

const props = defineProps<{
  evaluationId?: number | null
  productName?: string
}>()

const visible = defineModel<boolean>('visible', { default: false })
const router = useRouter()
const aiStore = useAiStore()
const aiReportFormRef = ref<FormInstance>()
const aiReportSubmitting = ref<boolean>(false)

interface AIReportForm {
  evaluationId: number | null
  productName: string
  competitorAsin: string
  coreKeyWord: string
  count: number
  userIdea: string
}

const createDefaultAIReportForm = (): AIReportForm => ({
  evaluationId: null,
  productName: '',
  competitorAsin: '',
  coreKeyWord: '',
  count: 0,
  userIdea: '',
})
const aiReportForm = reactive<AIReportForm>(createDefaultAIReportForm())

const validateKeywordCount = (_rule: any, value: number, callback: (error?: Error) => void) => {
  if (!Number.isInteger(value) || value < 0) {
    callback(new Error('关键词数量必须是大于等于0的整数'))
    return
  }
  if (!aiReportForm.coreKeyWord.trim() && value === 0) {
    callback(new Error('未填写调研核心关键词时，AI挖掘关键词数量不能为0'))
    return
  }
  callback()
}

const aiReportRules = reactive<FormRules<AIReportForm>>({
  productName: [{ required: true, message: '产品品名是必填项', trigger: 'blur' }],
  count: [{ validator: validateKeywordCount, trigger: 'change' }],
})

const resetAIReportForm = () => {
  Object.assign(aiReportForm, createDefaultAIReportForm())
  aiReportFormRef.value?.clearValidate()
}

const initAIReportForm = () => {
  Object.assign(aiReportForm, createDefaultAIReportForm(), {
    evaluationId: props.evaluationId ?? null,
    productName: props.productName ?? '',
  })
  nextTick(() => {
    aiReportFormRef.value?.clearValidate()
  })
}

const normalizeAiConversationId = (response: any) => {
  const payload = response?.data ?? response ?? {}
  return payload?.id ?? payload?.conversationId ?? payload?.conversation?.id ?? null
}

const submitAIReport = async () => {
  if (!aiReportForm.evaluationId) {
    $baseMessage('当前新款评估缺少编号，无法生成AI调研报告', 'error')
    return
  }

  const valid = await aiReportFormRef.value?.validate().catch(() => false)
  if (!valid) return

  aiReportSubmitting.value = true
  let conversationId: number | string | null = null
  try {
    const createResponse = await createEvaluationResearchReportConversation({
      evaluationId: aiReportForm.evaluationId,
      productName: aiReportForm.productName.trim(),
      competitorAsin: aiReportForm.competitorAsin.trim(),
      coreKeyWord: aiReportForm.coreKeyWord.trim(),
      count: aiReportForm.count,
      userIdea: aiReportForm.userIdea.trim(),
    })
    conversationId = normalizeAiConversationId(createResponse)

    if (conversationId == null || conversationId === '') {
      throw new Error('会话创建成功但未返回有效会话ID')
    }
    visible.value = false

    await aiStore.ensureInitialized({
      createIfEmpty: false,
      forceRefresh: true,
    })
    await aiStore.switchConversation(conversationId)
    aiStore.setConversationBusy(conversationId, {
      reason: 'evaluation-research-report',
      message: 'AI调研报告生成中，当前会话暂时不能发送消息，请等待结果返回。',
      placeholderText: '已提交AI调研报告请求，正在等待模型返回结果...',
    })
    $baseMessage('已开始生成 AI 调研报告，预计耗时约 30 分钟左右。生成期间暂无法发送新消息，请耐心等待结果返回。', 'success')
    await sendAiChatMessage({
      conversationId,
    })
    void aiStore.waitForConversationReply(conversationId)

    $baseMessage('已开始生成AI调研报告', 'success')
  } catch (error: any) {
    const errorMessage = error?.msg ?? error?.message ?? '生成AI调研报告失败'
    if (conversationId != null && conversationId !== '') {
      aiStore.failConversationBusy(conversationId, errorMessage)
    }
    $baseMessage(errorMessage, 'error')
  } finally {
    aiReportSubmitting.value = false
  }
}

watch(
  () => visible.value,
  (value) => {
    if (value) initAIReportForm()
  }
)
</script>

<style lang="scss" scoped>
.form-label {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.label-tip {
  font-size: 14px;
  font-weight: 400;
  color: var(--el-text-color-secondary);
}

.form-tip {
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
</style>
