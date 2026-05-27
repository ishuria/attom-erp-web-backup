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
      <el-form-item label="除了已给到的核心关键词外，需要AI自行挖掘并调研的核心关键词数量，建议1-3个" prop="count">
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
