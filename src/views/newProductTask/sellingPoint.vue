<template>
  <div class="comprehensive-form-container">
    <div style="display: flex; flex-direction: column; min-height: calc(var(--el-container-height) - 44px)">
      <el-page-header class="selling-point-page-header" @back="goBack">
        <template #content>
          <div class="selling-point-title">
            <span class="selling-point-title__name" :title="pageSkuTitle || '未选择 SKU'">{{ pageSkuTitle || '未选择 SKU' }}</span>
            <el-divider direction="vertical" />
            <span class="selling-point-title__sub">卖点填写</span>
            <el-tag v-if="isBatchSellingPoint" effect="light" size="small" type="warning">批量填写</el-tag>
          </div>
        </template>
      </el-page-header>
      <div style="display: flex; flex: 1; flex-direction: column">
        <el-row :gutter="40" style="display: flex; flex-grow: 1; align-items: flex-start; justify-content: center; padding: 0 0 20px">
          <!-- 左侧表单 -->
          <el-col :span="8" style="display: flex; flex-direction: column">
            <el-form ref="formRef1" class="custom-form" label-position="top" :model="form" :rules="formRules1" style="width: 100%">
              <el-form-item label="产品英文主品名" prop="productNameEn">
                <el-input v-model="form.productNameEn" clearable @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="卖点站点" prop="site">
                <el-select v-model="form.site" clearable @change="debouncedSave">
                  <el-option v-for="item in siteOption" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="产品差异化程度" prop="productDifferences">
                <el-select v-model="form.productDifferences" @change="debouncedSave">
                  <el-option v-for="item in differencesOption" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="选品理由一句话概括" prop="summary">
                <el-select v-model="form.summary" @change="debouncedSave">
                  <el-option v-for="item in reasonsOption" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="主要卖点以及与竞品相比差异化的地方" prop="competitiveProductDifferences">
                <el-input v-model="form.competitiveProductDifferences" :autosize="{ minRows: 2 }" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="目标客群" prop="targetAudience">
                <el-input v-model="form.targetAudience" :autosize="{ minRows: 2 }" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="产品使用场景" prop="usageScenario">
                <el-input v-model="form.usageScenario" clearable @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="材质" prop="material">
                <el-input v-model="form.material" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="本产品知名品牌" prop="brand">
                <el-input v-model="form.brand" clearable placeholder="链接文案需要规避的品牌词" @change="debouncedSave" />
              </el-form-item>
              <el-form-item prop="competitiveAsin">
                <template #label>
                  <span class="field-label-with-help">
                    <span>竞品ASIN</span>
                    <el-tooltip effect="dark" placement="top-start">
                      <template #content>
                        <div class="custom-tooltip">
                          <div>提供至少2个同类产品中销量好的产品</div>
                          <div>必须是逗号隔开格式，只能有ASIN不能有其他任何信息</div>
                          <div>无ASIN填入对应的平台商品id</div>
                        </div>
                      </template>
                      <span class="field-help-trigger" @click.stop>
                        <el-icon class="field-help-icon"><question-filled /></el-icon>
                      </span>
                    </el-tooltip>
                  </span>
                </template>
                <el-input
                  v-model="form.competitiveAsin"
                  clearable
                  placeholder="多个ASIN用英文逗号隔开，不能含其他字符，例：B0XXXXXXXX,B0YYYYYYYY"
                  @change="debouncedSave"
                />
              </el-form-item>
              <el-form-item prop="sameTrackAsin">
                <template #label>
                  <span class="field-label-with-help">
                    <span>同赛道ASIN</span>
                    <el-tooltip effect="dark" placement="top-start">
                      <template #content>
                        <div class="custom-tooltip">
                          <div>提供至少2个产品价格定位和类型与我们一致的ASIN（1个是上线时间长的且卖得好的成熟ASIN；1个是新品卖得好的）</div>
                          <div>必须是逗号隔开格式，只能有ASIN不能有其他任何信息</div>
                          <div>无ASIN填入对应的平台商品id</div>
                        </div>
                      </template>
                      <span class="field-help-trigger" @click.stop>
                        <el-icon class="field-help-icon"><question-filled /></el-icon>
                      </span>
                    </el-tooltip>
                  </span>
                </template>
                <el-input
                  v-model="form.sameTrackAsin"
                  clearable
                  placeholder="多个ASIN用英文逗号隔开，不能含其他字符，例：B0XXXXXXXX,B0YYYYYYYY"
                  @change="debouncedSave"
                />
              </el-form-item>
              <el-form-item prop="linkKeywords">
                <template #label>
                  <span class="field-label-with-help">
                    <span>链接关键词</span>
                    <el-tooltip effect="dark" placement="top-start">
                      <template #content>
                        <span class="custom-tooltip">
                          产品相关的特点（中英文都可以）。会填到亚马逊产品链接里，影响搜索结果。例子：金属，钢铁，防锈，超大号，可调，有涂层，厚，硬，可爱，轻薄等
                        </span>
                      </template>
                      <span class="field-help-trigger" @click.stop>
                        <el-icon class="field-help-icon"><question-filled /></el-icon>
                      </span>
                    </el-tooltip>
                  </span>
                </template>
                <el-input
                  v-model="form.linkKeywords"
                  :autosize="{ minRows: 2 }"
                  placeholder="产品相关特点，中英文都可以；会填到亚马逊产品链接里，影响搜索结果。例：金属，钢铁，防锈，超大号，可调，有涂层，厚，硬，可爱，轻薄"
                  type="textarea"
                  @change="debouncedSave"
                />
              </el-form-item>
              <el-form-item label="图片配色，风格和道具选用要求拍摄注意事项" prop="precautions">
                <div class="precautions-editor-wrap">
                  <toolbar
                    class="precautions-editor-toolbar"
                    :default-config="precautionsToolbarConfig"
                    :editor="precautionsEditorRef"
                    mode="default"
                  />
                  <editor
                    v-model="form.precautions"
                    class="precautions-editor-content"
                    :default-config="precautionsEditorConfig"
                    mode="default"
                    @on-change="debouncedSave"
                    @on-created="handlePrecautionsCreated"
                  />
                </div>
              </el-form-item>
            </el-form>
          </el-col>

          <!-- 中间表单 -->
          <el-col :span="8" style="display: flex; flex-direction: column">
            <el-form label-position="top" :model="form" style="width: 100%">
              <el-form-item label="功能/卖点/5点 (重要性从高到低排列)" prop="sellingPointContent">
                <el-input
                  v-model="form.sellingPointContent"
                  :autosize="{ minRows: 36 }"
                  resize="none"
                  style="flex-grow: 1"
                  type="textarea"
                  @change="debouncedSave"
                />
              </el-form-item>
              <div style="text-align: right">
                <el-button
                  :disabled="!isLeftFormFilled || !isSingleSellingPoint || _id == null || aiGenerating"
                  :loading="aiGenerating"
                  type="primary"
                  @click="handleAiGenerate5Points"
                >
                  AI生成5点
                </el-button>
                <el-button
                  :disabled="!form.sellingPointContent || _id == null || translating"
                  :loading="translating"
                  type="primary"
                  @click="handleTranslate"
                >
                  翻译成译文
                </el-button>
              </div>
            </el-form>
          </el-col>

          <!-- 右侧表单 -->
          <el-col :span="8" style="display: flex; flex-direction: column">
            <el-form ref="formRef" class="custom-form" label-position="top" :model="form" style="width: 100%; height: 100%">
              <el-form-item label="标题1" prop="title1">
                <el-input v-model="form.title1" :autosize="{ minRows: 4 }" resize="none" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="标题2" prop="title2">
                <el-input v-model="form.title2" :autosize="{ minRows: 4 }" resize="none" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="链接关键词(译文)" prop="linkKeywordsTs">
                <el-input v-model="form.linkKeywordsTs" :autosize="{ minRows: 4 }" resize="none" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="功能/卖点/5点(译文)" prop="sellingPointContentTs">
                <el-input
                  v-model="form.sellingPointContentTs"
                  :autosize="{ minRows: 20 }"
                  resize="none"
                  style="flex-grow: 1"
                  type="textarea"
                  @change="debouncedSave"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <!-- Footer -->
        <div style="text-align: center">
          <el-button type="primary" @click="showSelectSKU">从其他SKU导入</el-button>
          <el-button type="danger" @click="goBack">返回</el-button>
          <el-button type="success" @click="handleConfirmSave">完成并提交</el-button>
        </div>
      </div>
    </div>
    <vab-dialog v-model="selectSKUVisible" title="从其他SKU导入" width="20%" @close="closeSelectedSKU">
      <el-form style="margin: 0 10px">
        <el-form-item label="SKU">
          <el-select
            v-model="selectedSKUForm.sku"
            default-first-option
            filterable
            :loading="skuLoading"
            placeholder="点击输入和搜索"
            remote
            :remote-method="remoteSKUMethod"
          >
            <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- 提示 -->
          <vab-alert show-icon type="warning">
            <div>导入卖点里的产品尺寸，材质，颜色等信息可能和当前产品不同，需要检查和修改！</div>
          </vab-alert>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 10px">
          <el-button @click="closeSelectedSKU">取消</el-button>
          <el-button type="primary" @click="handleConfirmSelectedSKU">确认</el-button>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { createSellingPointConversation } from '/@/api/devlocal/ai'
import {
  confirmOtherSkuArtDesignSellingPoint,
  getArtDesignSelectionReasons,
  getArtDesignSellingPoint,
  getArtDesignSellingPointDropdownList,
  getBatchArtDesignSellingPoint,
  getSellingPointSiteList,
  saveArtDesignSellingPoint,
  saveArtDesignSellingPointRealtime,
  saveBatchArtDesignSellingPoint,
  translateArtDesignSellingPoint,
} from '/@/api/devlocal/imageTask'

import { QuestionFilled } from '@element-plus/icons-vue'
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import type { FormInstance, FormRules } from 'element-plus'
import { uploadEditorImage } from '/@/api/devlocal/progress'
import { getPoSkuList } from '/@/api/devlocal/purchasePo'
import { useAiStore } from '/@/store/modules/ai'
import { useTabsStore } from '/@/store/modules/tabs'
import type { ChatMessage } from '/@/type/ai/chat'
import type { IGetSellingPoint } from '/@/type/listingTask/imageTaskType'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'SellingPoint',
})
const sku = ref<string>('')
const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const aiStore = useAiStore()
const { delVisitedRoute } = tabsStore
const aiGenerating = ref(false)
const translating = ref(false)
const getQueryValue = (value: unknown) => {
  return Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '')
}
const querySku = computed(() => getQueryValue(route.query.sku))
const querySkus = computed(() => getQueryValue(route.query.skus))
const isSingleSellingPoint = computed(() => Boolean(querySku.value))
const isBatchSellingPoint = computed(() => Boolean(querySkus.value))
const pageSkuTitle = computed(() => {
  if (querySku.value) return querySku.value
  if (querySkus.value) return querySkus.value.split(',').filter(Boolean).join(' ，')
})
const selectSKUVisible = ref<boolean>(false)
const selectedSKUForm = reactive<{ sku: string }>({
  sku: '',
})
const differencesOption = ref<{ id: number; label: string }[]>([])
const reasonsOption = ref<{ id: number; label: string }[]>([])
const siteOption = ref<{ id: number; label: string }[]>([])
const form = reactive<IGetSellingPoint>({
  productNameEn: '',
  site: undefined,
  productDifferences: 0,
  summary: 0,
  competitiveProductDifferences: '',
  targetAudience: '',
  usageScenario: '',
  material: '',
  brand: '',
  competitiveAsin: '',
  sameTrackAsin: '',
  linkKeywords: '',
  precautions: '',
  sellingPointContent: '',
  title1: '',
  title2: '',
  linkKeywordsTs: '',
  sellingPointContentTs: '',
  id: null,
})

// ASIN 列表格式校验：必须是英文逗号隔开的字母数字 ASIN，不能含空格或其他字符
const asinListPattern = /^[A-Za-z0-9]+(,[A-Za-z0-9]+)*$/
const validateAsinList = (_rule: unknown, value: string, callback: (err?: Error) => void) => {
  if (!value) {
    callback()
    return
  }
  if (!asinListPattern.test(value)) {
    callback(new Error('格式错误：必须是英文逗号隔开的ASIN，不能含空格或其他字符'))
    return
  }
  callback()
}

const formRules1 = reactive<FormRules>({
  productNameEn: [{ required: true, message: '请填写产品英文主品名', trigger: 'blur' }],
  site: [{ required: true, message: '请选择卖点站点', trigger: 'change' }],
  productDifferences: [{ required: true, message: '请选择产品差异化程度', trigger: 'change' }],
  summary: [{ required: true, message: '请选择选品理由一句话概括', trigger: 'change' }],
  competitiveProductDifferences: [{ required: true, message: '请填写主要卖点以及与竞品相比差异化的地方', trigger: 'blur' }],
  targetAudience: [{ required: true, message: '请填写目标客群', trigger: 'blur' }],
  material: [{ required: true, message: '请填写材质', trigger: 'blur' }],
  brand: [{ required: true, message: '请填写本产品知名品牌', trigger: 'blur' }],
  competitiveAsin: [
    { required: true, message: '请填写竞品ASIN', trigger: 'blur' },
    { validator: validateAsinList, trigger: 'blur' },
  ],
  sameTrackAsin: [
    { required: true, message: '请填写同赛道ASIN', trigger: 'blur' },
    { validator: validateAsinList, trigger: 'blur' },
  ],
  linkKeywords: [{ required: true, message: '请填写链接关键词', trigger: 'blur' }],
})
const formRef1 = ref<FormInstance>()

// 左侧表单必填项是否全部填写完成（用于控制「AI生成5点」按钮的可点击状态）
const isLeftFormFilled = computed(() => {
  if (!form.productNameEn) return false
  if (form.site == null) return false
  if (form.productDifferences == null) return false
  if (form.summary == null) return false
  if (!form.competitiveProductDifferences) return false
  if (!form.targetAudience) return false
  if (!form.material) return false
  if (!form.brand) return false
  if (!form.competitiveAsin || !asinListPattern.test(form.competitiveAsin)) return false
  if (!form.sameTrackAsin || !asinListPattern.test(form.sameTrackAsin)) return false
  if (!form.linkKeywords) return false
  return true
})

const skuLoading = ref(false) //搜索SKU-loading
const skuOptions = ref<{ value: string; label: string }[]>([]) //搜索选项
const skuList = ref<{ value: string; label: string }[]>([]) //搜索列表
const _id = ref<number | null>(null)
const handleConfirmSelectedSKU = async () => {
  const { data } = await confirmOtherSkuArtDesignSellingPoint({
    sku: selectedSKUForm.sku,
  })
  if (data) {
    $baseMessage('导入成功！', 'success')
    Object.assign(form, data)
    form.id = _id.value!

    // 导入数据后自动保存（仅单个SKU）
    if (isSingleSellingPoint.value) {
      debouncedSave()
    }
    // 多个SKU时只赋值表单，不发送保存请求
    selectSKUVisible.value = false
  }
}
const closeSelectedSKU = () => {
  selectedSKUForm.sku = ''
  selectSKUVisible.value = false
}
const handleConfirmSave = async () => {
  formRef1.value?.validate(async (isValid) => {
    if (isValid) {
      if (isSingleSellingPoint.value) {
        const { summary, ...filteredForm } = form
        const { data } = await saveArtDesignSellingPoint({
          ...filteredForm,
          artDesignTaskId: Number(route.query.id),
          summaryId: form.summary,
        })
        if (data) {
          $baseMessage('确定保存并完成卖点填写成功！', 'success')
          goBack()
        } else {
          $baseMessage('确定保存并完成卖点填写失败！', 'error')
        }
      } else {
        const { summary, ...filteredForm } = form
        const { data } = await saveBatchArtDesignSellingPoint({
          ...filteredForm,
          ids: route.query.ids,
          summaryId: form.summary,
        })
        if (data) {
          $baseMessage('确定保存并完成卖点批量填写成功！', 'success')
          goBack()
        } else {
          $baseMessage('确定保存并完成卖点批量填写失败！', 'error')
        }
      }
    }
  })
}
const remoteSKUMethod = async (query: string) => {
  if (query) {
    const { data } = await getPoSkuList({ sku: query })

    skuList.value = data.map((item: any) => {
      return { value: `${item}`, label: `${item}` }
    })
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
const showSelectSKU = () => {
  selectSKUVisible.value = true
}

const handleTranslate = async () => {
  if (!_id.value) {
    $baseMessage('当前卖点缺少 ID，无法翻译', 'error')
    return
  }
  if (translating.value) return

  translating.value = true
  try {
    const { data } = await translateArtDesignSellingPoint(_id.value)
    if (data) {
      $baseMessage('翻译成功！', 'success')
      await fetchSellingPointData()
    } else {
      $baseMessage('翻译失败！', 'error')
    }
  } finally {
    translating.value = false
  }
}

const normalizeAiConversationId = (response: any) => {
  const payload = response?.data ?? response ?? {}
  return payload?.id ?? payload?.conversationId ?? payload?.conversation?.id ?? null
}

const handleAiGenerate5Points = async () => {
  if (!_id.value) {
    $baseMessage('当前卖点缺少 ID，无法生成', 'error')
    return
  }
  if (aiGenerating.value) return

  const sellingPointId = _id.value
  const productName = (form.productNameEn ?? '').trim()

  aiGenerating.value = true
  let conversationId: number | string | null = null

  try {
    const createResponse = await createSellingPointConversation({ sellingPointId, productName })
    conversationId = normalizeAiConversationId(createResponse)
    if (conversationId == null || conversationId === '') {
      throw new Error('会话创建成功但未返回有效会话 ID')
    }

    await aiStore.ensureInitialized({ createIfEmpty: false, forceRefresh: true })
    await aiStore.switchConversation(conversationId)
    aiStore.setConversationBusy(conversationId, {
      reason: 'selling-point',
      placeholderText: '已提交AI生成5点请求，正在等待模型返回结果...',
    })

    const key = String(conversationId)
    const placeholderId = aiStore.conversationBusyMap[key]?.placeholderMessageId

    // 流式结束后重新拉取卖点数据，让后端持久化的 AI 结果回填到表单
    if (placeholderId != null) {
      const stop = watch(
        () => aiStore.messages[key],
        (list) => {
          const msg = list?.find((m: ChatMessage) => String(m.id) === String(placeholderId))
          if (!msg) return
          if (msg.status === 'success') {
            stop()
            void fetchSellingPointData()
          } else if (msg.status === 'error') {
            stop()
          }
        },
        { deep: true }
      )
    }

    $baseMessage('已开始生成5点，结果会在左侧会话流式展示，完成后自动回填', 'success')
    void aiStore.streamConversationReply(conversationId)
  } catch (error: any) {
    const errorMessage = error?.msg ?? error?.message ?? 'AI生成5点失败'
    if (conversationId != null && conversationId !== '') {
      aiStore.failConversationBusy(conversationId, errorMessage)
    }
    $baseMessage(errorMessage, 'error')
  } finally {
    aiGenerating.value = false
  }
}
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  router.push({
    path: '/newProductTask/listingImageTask',
  })
}
const fetchDifferencesOption = async () => {
  const { data } = await getArtDesignSellingPointDropdownList()
  differencesOption.value = data
}
const fetchReasonsOption = async () => {
  const { data } = await getArtDesignSelectionReasons()
  reasonsOption.value = data
}
const fetchSiteOption = async () => {
  const { data } = await getSellingPointSiteList()
  siteOption.value = data
}

// 防抖保存函数，避免频繁调用接口（仅单个SKU）
let saveTimer: NodeJS.Timeout | null = null
const debouncedSave = () => {
  // 只有单个SKU才自动保存
  if (!isSingleSellingPoint.value) {
    return
  }

  if (saveTimer) {
    clearTimeout(saveTimer)
  }
  saveTimer = setTimeout(async () => {
    await autoSave()
  }, 1000) // 1秒防抖
}

// 自动保存到后端（仅单个SKU）
const autoSave = async () => {
  try {
    if (isSingleSellingPoint.value) {
      // 单个SKU保存
      const { summary, ...filteredForm } = form
      await saveArtDesignSellingPointRealtime({
        ...filteredForm,
        artDesignTaskId: Number(route.query.id),
        summaryId: form.summary,
      })
    }
    // 批量SKU不自动保存，只在确定按钮时保存
  } catch (error) {
    console.warn('自动保存失败:', error)
  }
}

// 加载卖点数据
const fetchSellingPointData = async () => {
  // 重置表单数据
  Object.assign(form, {
    productNameEn: '',
    site: undefined,
    productDifferences: 0,
    summary: 0,
    competitiveProductDifferences: '',
    targetAudience: '',
    usageScenario: '',
    material: '',
    brand: '',
    competitiveAsin: '',
    sameTrackAsin: '',
    linkKeywords: '',
    precautions: '',
    sellingPointContent: '',
    title1: '',
    title2: '',
    linkKeywordsTs: '',
    sellingPointContentTs: '',
    id: null,
  })
  _id.value = null

  const currentSku = querySku.value
  const currentSkus = querySkus.value
  if (!currentSku && !currentSkus) {
    $baseMessage('目前没有SKU，无法获取卖点', 'warning')
    return
  }
  if (currentSku) {
    // 单个SKU，直接从后端获取数据
    sku.value = currentSku
    const { data } = await getArtDesignSellingPoint({
      sku: sku.value,
    })
    _id.value = data.id!
    Object.assign(form, data)
  } else if (currentSkus) {
    // 批量修改，直接从后端获取数据
    sku.value = currentSkus.split(',').sort().join(',')
    const { data } = await getBatchArtDesignSellingPoint({
      skus: sku.value,
    })
    Object.assign(form, data)
  }
}

// 注意事项富文本编辑器
const precautionsEditorRef = shallowRef<IDomEditor | undefined>()
type InsertImageFnType = (url: string, alt?: string, href?: string) => void

const precautionsToolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'codeBlock', 'fullScreen'],
}

const precautionsEditorConfig = reactive<any>({
  placeholder: '请输入拍摄注意事项，可粘贴或上传图片...',
  MENU_CONF: {
    uploadImage: {
      allowedFileTypes: ['image/*'],
      maxFileSize: 2 * 1024 * 1024,
      maxNumberOfFiles: 1,
      onBeforeUpload(file: File) {
        if (!file.type.startsWith('image/')) {
          $baseMessage('只能上传图片文件!', 'error', 'hey')
          return false
        }
        if (file.size > 2 * 1024 * 1024) {
          $baseMessage('图片大小不能超过 2MB!', 'error', 'hey')
          return false
        }
        return file
      },
      async customUpload(file: File, insertFn: InsertImageFnType) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          const { data } = await uploadEditorImage(formData)
          let imageUrl = ''
          if (data?.url) {
            imageUrl = data.url
          } else if (typeof data === 'string') {
            imageUrl = data
          } else {
            throw new Error('上传失败：无法获取图片地址')
          }
          insertFn(imageUrl, file.name, imageUrl)
          $baseMessage('图片上传成功!', 'success', 'hey')
        } catch (error: any) {
          console.error('图片上传失败:', error)
          $baseMessage(error?.message || '图片上传失败，请重试', 'error', 'hey')
        }
      },
    },
  },
})

const handlePrecautionsCreated = (editor: IDomEditor) => {
  precautionsEditorRef.value = Object.seal(editor)
}

// 数据从后端拉取后 Object.assign(form, data) 不会触发编辑器重渲，需要手动 setHtml
watch(
  () => form.precautions,
  (newVal) => {
    const editor = precautionsEditorRef.value
    if (!editor) return
    const current = editor.getHtml()
    if (current !== (newVal || '')) {
      editor.setHtml(newVal || '')
    }
  }
)

onBeforeUnmount(() => {
  const editor = precautionsEditorRef.value
  if (editor) editor.destroy()
  precautionsEditorRef.value = undefined
})

onBeforeMount(async () => {
  fetchDifferencesOption()
  fetchReasonsOption()
  fetchSiteOption()
  await fetchSellingPointData()
})

watch(
  // 1. 只精准监听 query 中的 id 变化
  () => route.query.id,
  async (newId, oldId) => {
    // 2. 核心判断：确保当前还在“卖点页面”（避免在其他页面因为 id 变化被误触发）
    if (route.name !== 'SellingPoint') return

    // 3. 确保 id 真的发生了变化，且新 id 存在
    if (newId && newId !== oldId) {
      console.log('检测到卖点页面 id 切换，重新加载数据:', newId)
      await fetchSellingPointData()
    }
  }
)
</script>

<style lang="scss" scoped>
.custom-form {
  .el-form-item {
    margin-bottom: 18px;
  }
}

// label-position=top 时让标签更醒目、与 viewer 风格保持一致
:deep(.el-form--label-top .el-form-item__label) {
  padding-bottom: 6px;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.selling-point-page-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.selling-point-title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

:deep(.selling-point-page-header .el-page-header__content) {
  min-width: 0;
  flex: 1;
}

.selling-point-title__name {
  max-width: min(68vw, 920px);
  overflow: hidden;
  color: var(--el-color-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selling-point-title__sub {
  color: var(--el-text-color-secondary);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
}

.field-label-with-help {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  vertical-align: top;

  .field-help-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }

  .field-help-icon {
    color: var(--el-text-color-secondary);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    transition: color var(--el-transition-duration);

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.precautions-editor-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;

  .precautions-editor-toolbar {
    border-bottom: 1px solid var(--el-border-color);
  }

  .precautions-editor-content {
    min-height: 320px;
    max-height: 600px;
    overflow-y: auto;

    :deep(img) {
      max-width: 100%;
    }
  }
}
</style>
