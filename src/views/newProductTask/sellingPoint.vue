<template>
  <div class="comprehensive-form-container">
    <div style="display: flex; flex-direction: column; min-height: calc(var(--el-container-height) - 44px)">
      <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3">
            {{ pageSkuTitle }}
          </span>
          <span class="text-large font-600 mr-3">&nbsp;卖点</span>
          <span class="text-large font-600 mr-3" style="color: var(--el-color-primary)">
            {{ route.query.sku ? '(输入后系统自动保存)' : '(批量填写)' }}
          </span>
        </template>
      </el-page-header>
      <div style="display: flex; flex: 1; flex-direction: column">
        <el-row :gutter="40" style="display: flex; flex-grow: 1; align-items: flex-start; justify-content: center; padding: 20px 0">
          <!-- 左侧表单 -->
          <el-col :span="8" style="display: flex; flex-direction: column">
            <el-form
              ref="formRef1"
              class="custom-form"
              label-position="right"
              label-width="15em"
              :model="form"
              :rules="formRules1"
              style="width: 100%; padding-right: 80px"
            >
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
              <el-form-item label="与竞品相比差异化的地方" prop="competitiveProductDifferences">
                <el-input v-model="form.competitiveProductDifferences" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="目标客群" prop="targetAudience">
                <el-input v-model="form.targetAudience" type="textarea" @change="debouncedSave" />
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
              <el-form-item label="竞品ASIN" prop="competitiveAsin">
                <el-input v-model="form.competitiveAsin" clearable @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="同赛道ASIN" prop="sameTrackAsin">
                <el-input
                  v-model="form.sameTrackAsin"
                  clearable
                  placeholder="提供至少2个产品价格定位和类型与我们一致的ASIN：上线时间长卖得好的成熟ASIN，以及新品卖得好的"
                  @change="debouncedSave"
                />
              </el-form-item>
              <el-form-item label="链接关键词" prop="linkKeywords">
                <el-input v-model="form.linkKeywords" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="图片配色，风格和道具选用要求拍摄注意事项" prop="precautions">
                <el-input v-model="form.precautions" resize="none" :rows="8" type="textarea" @change="debouncedSave" />
              </el-form-item>
            </el-form>
          </el-col>

          <!-- 中间表单 -->
          <el-col :span="8" style="display: flex; flex-direction: column">
            <el-form :model="form" style="width: 100%">
              <el-form-item
                label="功能/卖点/5点&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&ensp;(重要性从高到低排列)"
                label-width="11.5em"
                prop="sellingPointContent"
                :rules="[{ required: true, message: '请输入功能/卖点/5点(重要性从高到低排列)', trigger: 'blur' }]"
              >
                <el-input
                  v-model="form.sellingPointContent"
                  resize="none"
                  :rows="36"
                  style="flex-grow: 1"
                  type="textarea"
                  @change="debouncedSave"
                />
              </el-form-item>
            </el-form>
          </el-col>

          <!-- 右侧表单 -->
          <el-col :span="8" style="display: flex; flex-direction: column">
            <el-form
              ref="formRef"
              class="custom-form"
              label-position="right"
              label-width="10.5em"
              :model="form"
              style="width: 100%; height: 100%"
            >
              <el-form-item label="标题1" prop="title1">
                <el-input v-model="form.title1" resize="none" :rows="4" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="标题2" prop="title2">
                <el-input v-model="form.title2" resize="none" :rows="4" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="链接关键词(译文)" prop="linkKeywordsTs">
                <el-input v-model="form.linkKeywordsTs" resize="none" :rows="4" type="textarea" @change="debouncedSave" />
              </el-form-item>
              <el-form-item label="功能/卖点/5点(译文)" prop="sellingPointContentTs">
                <el-input
                  v-model="form.sellingPointContentTs"
                  resize="none"
                  :rows="20"
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
import {
  confirmOtherSkuArtDesignSellingPoint,
  getArtDesignSelectionReasons,
  getArtDesignSellingPoint,
  getArtDesignSellingPointDropdownList,
  getBatchArtDesignSellingPoint,
  saveArtDesignSellingPoint,
  saveArtDesignSellingPointRealtime,
  saveBatchArtDesignSellingPoint,
} from '/@/api/devlocal/imageTask'

import type { FormInstance, FormRules } from 'element-plus'
import { getPoSkuList } from '/@/api/devlocal/purchasePo'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IGetSellingPoint } from '/@/type/listingTask/imageTaskType'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'SellingPoint',
})
const sku = ref<string>('')
const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const getQueryValue = (value: unknown) => {
  return Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '')
}
const pageSkuTitle = computed(() => {
  const skus = route.query.skus
  const querySku = getQueryValue(route.query.sku)
  if (querySku) return querySku
  if (skus && skus?.length > 0) return getQueryValue(route.query.skus).split(',').filter(Boolean).join(' ，')
})
const selectSKUVisible = ref<boolean>(false)
const selectedSKUForm = reactive<{ sku: string }>({
  sku: '',
})
const differencesOption = ref<{ id: number; label: string }[]>([])
const reasonsOption = ref<{ id: number; label: string }[]>([])
const form = reactive<IGetSellingPoint>({
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

const formRules1 = reactive<FormRules>({
  productDifferences: [{ required: true, message: '请选择产品差异化程度', trigger: 'change' }],
  summary: [{ required: true, message: '请选择选品理由一句话概括', trigger: 'change' }],
  competitiveProductDifferences: [{ required: true, message: '请填写与竞品相比差异化的地方', trigger: 'blur' }],
  targetAudience: [{ required: true, message: '请填写目标客群', trigger: 'blur' }],
  material: [{ required: true, message: '请填写材质', trigger: 'blur' }],
  brand: [{ required: true, message: '请填写本产品知名品牌', trigger: 'blur' }],
  competitiveAsin: [{ required: true, message: '请填写竞品ASIN', trigger: 'blur' }],
  sameTrackAsin: [{ required: true, message: '请填写同赛道ASIN', trigger: 'blur' }],
  linkKeywords: [{ required: true, message: '请填写链接关键词', trigger: 'blur' }],
})
const formRef1 = ref<FormInstance>()

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
    if (route.query.sku) {
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
      if (route.query.sku) {
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

// 防抖保存函数，避免频繁调用接口（仅单个SKU）
let saveTimer: NodeJS.Timeout | null = null
const debouncedSave = () => {
  // 只有单个SKU才自动保存
  if (!route.query.sku) {
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
    if (route.query.sku) {
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

  const querySku = getQueryValue(route.query.sku)
  const querySkus = getQueryValue(route.query.skus)
  if (!querySku && !querySkus) {
    $baseMessage('目前没有SKU，无法获取卖点', 'warning')
    return
  }
  if (querySku) {
    // 单个SKU，直接从后端获取数据
    sku.value = querySku
    const { data } = await getArtDesignSellingPoint({
      sku: sku.value,
    })
    _id.value = data.id!
    Object.assign(form, data)
  } else if (querySkus && querySkus?.length > 0) {
    // 批量修改，直接从后端获取数据
    sku.value = querySkus.split(',').sort().join(',')
    const { data } = await getBatchArtDesignSellingPoint({
      skus: sku.value,
    })
    Object.assign(form, data)
  }
}

onBeforeMount(async () => {
  fetchDifferencesOption()
  fetchReasonsOption()
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
    margin-bottom: 25px;
  }
}
</style>
