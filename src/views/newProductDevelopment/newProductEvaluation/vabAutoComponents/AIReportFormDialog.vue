<template>
  <!-- 生成AI调研报告 -->
  <vab-dialog
    v-model="visible"
    class="ai-report-dialog"
    title="生成AI调研报告"
    width="min(640px, calc(100vw - 32px))"
    @closed="resetAIReportForm"
  >
    <el-form ref="aiReportFormRef" class="ai-report-form" label-position="top" :model="aiReportForm" :rules="aiReportRules" @submit.prevent>
      <el-form-item label="产品品名" prop="productName">
        <el-input v-model.trim="aiReportForm.productName" clearable placeholder="请输入产品品名" />
      </el-form-item>
      <el-form-item prop="competitorAsin">
        <template #label>
          <span class="form-label">
            <span class="label-title">需要分析的主要竞对ASIN</span>
            <span class="label-tip">要求逗号分割</span>
          </span>
        </template>
        <el-input v-model.trim="aiReportForm.competitorAsin" clearable placeholder="例如：B0XXXXXXXX, B0YYYYYYYY" />
      </el-form-item>
      <el-form-item prop="coreKeyWord">
        <template #label>
          <span class="form-label">
            <span class="label-title">调研核心关键词</span>
            <span class="label-tip">可不填，让AI自己挖掘；多个关键词请用逗号分割</span>
          </span>
        </template>
        <el-input v-model="aiReportForm.coreKeyWord" clearable placeholder="例如：Power bank, portable charger, battery" />
      </el-form-item>
      <el-form-item prop="count">
        <template #label>
          <span class="form-label">
            <span class="label-title">需要AI自行挖掘并调研的核心关键词数量（除了已给到的核心关键词之外）</span>
          </span>
        </template>
        <div class="keyword-count-row">
          <el-input-number v-model="aiReportForm.count" controls-position="right" :max="3" :min="0" :precision="0" :step="1" />
          <span class="label-tip">未填写调研核心关键词时，此数量不能为0，建议1-3个。</span>
        </div>
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
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="aiReportSubmitting" type="primary" @click="submitAIReport">生成报告</el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { checkFeishuDoc, createEvaluationResearchReportConversation, getFeishuUrl } from '/@/api/devlocal/ai'
import { useAiStore } from '/@/store/modules/ai'
import type { EvaluationResearchReportPayload } from '/@/type/ai/chat'

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

const asinPattern = /^B0[A-Z0-9]{8}$/i
const asinInTextPattern = /\bB0[A-Z0-9]{8}\b/i
const splitCommaSeparatedInput = (value: string) => value.split(/[,，]/).map((item) => item.trim())

const validateCompetitorAsin = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const inputValue = value?.trim()
  if (!inputValue) {
    callback()
    return
  }

  const invalidAsin = splitCommaSeparatedInput(inputValue).find((asin) => asin && !asinPattern.test(asin))
  if (invalidAsin) {
    callback(new Error(`ASIN格式错误：${invalidAsin} 不是有效ASIN，请输入正确的ASIN`))
    return
  }

  callback()
}

const validateCoreKeyWord = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const inputValue = value?.trim()
  if (!inputValue) {
    callback()
    return
  }

  const asinMatch = inputValue.match(asinInTextPattern)
  if (asinMatch) {
    callback(new Error(`检测到疑似ASIN：${asinMatch[0]}，请填写到“需要分析的主要竞对ASIN”中`))
    return
  }

  callback()
}

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
  competitorAsin: [{ validator: validateCompetitorAsin, trigger: 'blur' }],
  coreKeyWord: [{ validator: validateCoreKeyWord, trigger: 'blur' }],
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

const runReportCreation = async (payload: EvaluationResearchReportPayload) => {
  let conversationId: number | string | null = null
  try {
    const createResponse = await createEvaluationResearchReportConversation(payload)
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
      placeholderText: '已提交AI调研报告请求，正在等待模型返回结果...',
    })
    $baseMessage('已开始生成 AI 调研报告，生成期间暂无法发送新消息，请耐心等待结果返回。', 'success')
    // 调研报告改为流式输出：与 setConversationBusy 创建的占位消息绑定，由流回写。
    void aiStore.streamConversationReply(conversationId)
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

const submitAIReport = async () => {
  if (!aiReportForm.evaluationId) {
    $baseMessage('当前新款评估缺少编号，无法生成AI调研报告', 'error')
    return
  }

  const valid = await aiReportFormRef.value?.validate().catch(() => false)
  if (!valid) return

  aiReportSubmitting.value = true

  // 点击时快照表单数据：授权等待期间用户可能再次编辑表单，提交以快照为准
  const payload: EvaluationResearchReportPayload = {
    evaluationId: aiReportForm.evaluationId,
    productName: aiReportForm.productName.trim(),
    competitorAsin: aiReportForm.competitorAsin.trim(),
    coreKeyWord: aiReportForm.coreKeyWord.trim(),
    count: aiReportForm.count,
    userIdea: aiReportForm.userIdea.trim(),
  }

  try {
    const checkResponse = await checkFeishuDoc()
    const canCreate = checkResponse?.data ?? checkResponse
    if (!canCreate) {
      const urlResponse = await getFeishuUrl(1)
      const url = urlResponse?.data ?? urlResponse

      $baseMessage('需要先完成飞书授权，已在新标签页打开授权页面，授权后将自动继续生成报告', 'info')

      // 跨 origin 场景下（内网入口写、外网 origin 回调）localStorage 不共享，改用 postMessage：
      // 回调 tab 完成 token 交换后通知本 tab，本 tab 用闭包里持有的 payload 直接发起报告创建。
      let timeoutId!: ReturnType<typeof setTimeout>
      const handler = async (event: MessageEvent) => {
        if (event.data?.type !== 'feishu-doc-authorized') return
        // 仅信任来自外部 origin 的消息，避免本页脚本误触
        if (event.origin === window.location.origin) return
        window.removeEventListener('message', handler)
        clearTimeout(timeoutId)
        await runReportCreation(payload)
      }
      window.addEventListener('message', handler)
      timeoutId = setTimeout(
        () => {
          window.removeEventListener('message', handler)
          aiReportSubmitting.value = false
          $baseMessage('飞书授权等待超时，请重试', 'warning')
        },
        10 * 60 * 1000
      )

      window.open(url, '_blank')
      return
    }

    await runReportCreation(payload)
  } catch (error: any) {
    aiReportSubmitting.value = false
    $baseMessage(error?.msg ?? error?.message ?? '飞书授权校验失败', 'error')
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
.ai-report-form {
  padding: 2px 2px 4px;
}

.ai-report-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.ai-report-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.ai-report-form :deep(.el-form-item__label) {
  padding-bottom: 6px;

  font-weight: 600;
  line-height: 22px;
  color: var(--el-text-color-primary);
}

.ai-report-form :deep(.el-form-item__content) {
  align-items: flex-start;
}

.ai-report-form :deep(.el-input),
.ai-report-form :deep(.el-textarea) {
  width: 100%;
}

.ai-report-form :deep(.el-input__wrapper),
.ai-report-form :deep(.el-textarea__inner) {
  border-radius: 6px;
  transition:
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.ai-report-form :deep(.el-input__wrapper:hover),
.ai-report-form :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
}

.ai-report-form :deep(.el-input__wrapper.is-focus),
.ai-report-form :deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.ai-report-form :deep(.el-input__inner::placeholder),
.ai-report-form :deep(.el-textarea__inner::placeholder) {
  color: #a8b1c0;
}

.ai-report-form :deep(.el-textarea__inner) {
  min-height: 96px !important;
  line-height: 1.55;
}

.ai-report-form :deep(.el-form-item__error) {
  padding-top: 4px;
  font-size: 12px;
  line-height: 18px;
}

.form-label {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.label-title {
  color: var(--el-text-color-primary);
}

.label-tip {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 1px 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  color: var(--el-color-primary);
  white-space: normal;
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 4px;
}

.keyword-count-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  width: 100%;
}

.keyword-count-row :deep(.el-input-number) {
  flex: 0 0 108px;
  width: 108px;
}

.dialog-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.dialog-footer :deep(.el-button) {
  min-width: 78px;
  border-radius: 6px;
}

.dialog-footer :deep(.el-button + .el-button) {
  margin-left: 0;
}

@media (max-width: 720px) {
  .ai-report-form :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  .label-tip,
  .keyword-count-row .label-tip {
    max-width: 100%;
  }
}
</style>
