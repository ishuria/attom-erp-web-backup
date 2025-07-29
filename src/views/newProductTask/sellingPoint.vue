<template>
  <div class="comprehensive-form-container">
    <div style="display: flex; flex-direction: column; min-height: calc(var(--el-container-height) - 44px)">
      <el-page-header @back="goBack" >
        <template #content>
          <span class="text-large font-600 mr-3">{{ route.query.sku ? route.query.sku : '' }}</span>
          <span class="text-large font-600 mr-3"> 卖点 </span>
          <span class="text-large font-600 mr-3" style="color: var(--el-color-primary)">(输入后系统自动保存)</span>
        </template>
      </el-page-header>
      <div style="display: flex; flex: 1; flex-direction: column">
        <el-row :gutter="30" style=" display: flex;flex-grow: 1; align-items: center; justify-content: center;">
          <!-- 左侧表单 -->
          <el-col :span="10" style="display: flex; flex-direction: column;">
            <el-form ref="formRef1" class="custom-form" label-position="right" label-width="15em" :model="form" :rules="formRules1" style="width: 100%; padding-right: 80px">
              <el-form-item label="产品差异化程度" prop="productDifferences">
                <el-select v-model="form.productDifferences" @change="setLocalStorageData">
                  <el-option v-for="item in differencesOption" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="选品理由一句话概括" prop="summary">
                <el-select v-model="form.summary" @change="setLocalStorageData">
                  <el-option v-for="item in reasonsOption" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="与竞品相比差异化的地方" prop="competitiveProductDifferences">
                <el-input v-model="form.competitiveProductDifferences" type="textarea" @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="目标客群" prop="targetAudience">
                <el-input v-model="form.targetAudience" type="textarea" @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="产品使用场景" prop="usageScenario">
                <el-input v-model="form.usageScenario" clearable @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="材质" prop="material">
                <el-input v-model="form.material" @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="本产品知名品牌" prop="brand">
                <el-input v-model="form.brand" clearable placeholder="链接文案需要规避的品牌词" @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="竞品ASIN" prop="competitiveAsin">
                <el-input v-model="form.competitiveAsin" clearable @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="同赛道ASIN" prop="sameTrackAsin">
                <el-input v-model="form.sameTrackAsin" clearable placeholder="提供至少2个产品价格定位和类型与我们一致的ASIN：上线时间长卖得好的成熟ASIN，以及新品卖得好的" @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="链接关键词" prop="linkKeywords">
                <el-input v-model="form.linkKeywords" type="textarea" @change="setLocalStorageData" />
              </el-form-item>
              <el-form-item label="图片配色，风格和道具选用要求拍摄注意事项" prop="precautions">
                <el-input v-model="form.precautions" resize="none" :rows="8" type="textarea" @change="setLocalStorageData" />
              </el-form-item>
            </el-form>
          </el-col>

          <!-- 右侧表单 -->
          <el-col :span="10" style=" display: flex; justify-content: flex-start;padding: 45px;"> 
            <el-form :model="form" style="width: 100%" >
              <el-form-item 
                label="功能/卖点/5点&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&ensp;(重要性从高到低排列)"
                label-width="11.5em" 
                prop="sellingPointContent" 
                :rules="[
                  { required: true, message: '请输入功能/卖点/5点(重要性从高到低排列)', trigger: 'blur' }
                ]"
              >
                <el-input v-model="form.sellingPointContent" resize="none" :rows="36"  style="flex-grow: 1;" type="textarea" @change="setLocalStorageData" />
              </el-form-item>
            </el-form>
          
          </el-col>
        </el-row>

        <!-- Footer -->
        <div style="text-align: center;">
          <el-button type="primary" @click="showSelectSKU">从其他SKU导入</el-button>
          <el-button type="danger" @click="goBack">返回</el-button>
          <el-button type="success" @click="handleConfirmSave">确定</el-button>
        </div>
      </div>
    </div>
    <vab-dialog
      v-model="selectSKUVisible"
      title="从其他SKU导入"
      width="20%"
      @close="closeSelectedSKU"
    >
      <el-form style="margin: 0 10px;">
        <el-form-item label="SKU" >
          <el-select
            v-model="selectedSKUForm.sku"
            default-first-option
            filterable
            :loading="skuLoading"
            placeholder="点击输入和搜索"
            remote
            :remote-method="remoteSKUMethod"
          >
            <el-option
              v-for="item in skuOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 10px;">
          <el-button @click="closeSelectedSKU">取消</el-button>
          <el-button type="primary" @click="handleConfirmSelectedSKU">确认</el-button>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { confirmOtherSkuArtDesignSellingPoint, getArtDesignSelectionReasons, getArtDesignSellingPoint, getArtDesignSellingPointDropdownList, getBatchArtDesignSellingPoint, saveArtDesignSellingPoint, saveBatchArtDesignSellingPoint } from '/@/api/devlocal/imageTask'

import type { FormInstance, FormRules } from 'element-plus'
import { getPoSkuList } from '/@/api/devlocal/purchasePo'
import { useTabsStore } from '/@/store/modules/tabs'
import type { IGetSellingPoint } from '/@/type/listingTask/imageTaskType'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'SellingPoint'
})
const sku = ref<string>('')
const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const selectSKUVisible = ref<boolean>(false)
const selectedSKUForm = reactive<{ sku: string }>({
  sku: ''
})
const differencesOption = ref<{ id: number, label: string }[]>([])
const reasonsOption = ref<{ id: number, label: string }[]>([])
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
  sellingPointContent: ''
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
const skuOptions = ref<{ value: string, label: string }[]>([]) //搜索选项
const skuList = ref<{ value: string, label: string }[]>([]) //搜索列表
const _id = ref<number>(0)
const handleConfirmSelectedSKU = async () => {
  const { data } = await confirmOtherSkuArtDesignSellingPoint({
    sku: selectedSKUForm.sku
  })
  if (data) {
    $baseMessage('导入成功！', 'success')
    Object.assign(form, data)
    form.id = _id.value
    
    setLocalStorageData()
    selectSKUVisible.value = false
  }
}
const closeSelectedSKU = () => {
  selectedSKUForm.sku = ''
  selectSKUVisible.value = false
}
const handleConfirmSave = async () => {
  console.log("222")
  formRef1.value?.validate(async (isValid) => {
    if (isValid) {
      if (route.query.sku) {
        const { summary, ...filteredForm } = form
        const { data } = await saveArtDesignSellingPoint({
          ...filteredForm,
          artDesignTaskId: Number(route.query.id),
          summaryId: form.summary
        })
        if (data) {
          $baseMessage('保存成功！', 'success')
          localStorage.removeItem(`${sku.value}_sellingPointForm`)
          goBack()
        }
      } else {
        const { summary, ...filteredForm } = form
        const { data } = await saveBatchArtDesignSellingPoint({
          ...filteredForm,
          ids: route.query.ids,
          summaryId: form.summary
        })
        if (data) {
          $baseMessage('保存成功！', 'success')
          localStorage.removeItem(`${sku.value}_sellingPointForm`)
          goBack()
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
const setLocalStorageData = () => {
  const rawForm = toRaw(form)  // 获取非响应式的原始数据
  const jsonString = JSON.stringify(rawForm)  // 现在可以进行字符串化了
  localStorage.setItem(`${sku.value}_sellingPointForm`, jsonString)
}
onBeforeMount(async () => {
  fetchDifferencesOption()
  fetchReasonsOption()
  const querySku = route.query.sku
  if (querySku) {
    // 有缓存 读缓存, 每个sku的卖点和文案是不一样的，
    sku.value = querySku
    const savedForm = localStorage.getItem(`${sku.value}_sellingPointForm`)
    if (savedForm) {
      Object.assign(form, JSON.parse(savedForm))
    } else {
      // 没缓存 get数据
      const { data } = await getArtDesignSellingPoint({
        sku: sku.value
      })
      _id.value = data.id!
      Object.assign(form, data)
      // 获取到的数据存储到localStorage
      setLocalStorageData()
    }
    
  } else {
    // 批量修改，按照skus排序后的进行缓存，进来先排序，查找有缓存，获取缓存的数据；没缓存，请求数据；然后导入其他sku后，修改这个skus对应的数据，
    const querySkus = route.query.skus
    sku.value = querySkus.split(',').sort().join(',')
    // skus可能是乱序的，需要判断这个是否是一致的
    const savedForm = localStorage.getItem(`${sku.value}_sellingPointForm`)
    if (savedForm) {
      Object.assign(form, JSON.parse(savedForm))
    } else {
      // 没缓存 get数据
      const { data } = await getBatchArtDesignSellingPoint({
        skus: sku.value
      })
      Object.assign(form, data)
      // 获取到的数据存储到localStorage
      setLocalStorageData()
    }
  }
})
</script>

<style lang="scss" scoped>

.custom-form {
  .el-form-item {
    margin-bottom: 25px;
  }
}
</style>