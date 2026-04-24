<template>
  <div class="comprehensive-table-container">
    <el-page-header :content="`修改 ${route.query.title}`" @back="goBack" />
    <div style="height: 100%; display: flex; justify-content: center; margin-top: 50px; margin-left: -75px">
      <el-row :gutter="100" style="max-width: 80vw">
        <el-col :span="outPutResFlg ? 12 : 24">
          <el-form
            ref="inputFormRef"
            label-position="right"
            label-width="auto"
            :model="inputForm"
            :rules="rules"
            style="width: 100%"
            @submit.prevent
          >
            <el-form-item label="产品来源" prop="productSource">
              <el-select v-model="inputForm.productSource" allow-create clearable filterable :reserve-keyword="false">
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="国家" prop="countryId">
              <el-select v-model="inputForm.countryId" clearable filterable placeholder="请选择国家" style="width: 100%">
                <el-option
                  v-for="item in countryOptions"
                  :key="item.countryId"
                  :label="item.countryName"
                  :value="item.countryId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="中文品名" prop="productNameZh">
              <el-input v-model="inputForm.productNameZh" clearable style="width: 100%" />
            </el-form-item>
            <el-form-item label="亚马逊前台关键词" prop="amazonFrontendKeywords">
              <el-input v-model="inputForm.amazonFrontendKeywords" clearable style="width: 100%" />
            </el-form-item>
            <el-form-item label="亚马逊后台关键词" prop="amazonBackendKeywords">
              <el-input v-model="inputForm.amazonBackendKeywords" clearable />
            </el-form-item>
            <el-form-item label="亚马逊listing数量" prop="amazonListingQuantity">
              <el-input v-model="inputForm.amazonListingQuantity" clearable />
            </el-form-item>
            <el-form-item label="90天搜索量" prop="searchVolume90Days">
              <el-input v-model="inputForm.searchVolume90Days" clearable />
            </el-form-item>
            <el-form-item label="平均售价" prop="averageSellingPrice">
              <el-input v-model="inputForm.averageSellingPrice" clearable />
            </el-form-item>
            <el-form-item label="360天平均销量" prop="averageSales360Days">
              <el-input v-model="inputForm.averageSales360Days" clearable />
            </el-form-item>
            <el-form-item label="前80%点击的产品个数" prop="top80PercentClickedProductsCount">
              <el-input v-model="inputForm.top80PercentClickedProductsCount" clearable />
            </el-form-item>
            <el-form-item label="亚马逊广告单个点击价格$(CPC)" prop="amazonAdCpc">
              <el-input v-model="inputForm.amazonAdCpc" clearable />
            </el-form-item>
            <el-form-item label="类目平均转化率" prop="categoryAvgConversionRate">
              <el-input v-model="inputForm.categoryAvgConversionRate" clearable>
                <template #suffix>%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="亚马逊首页数据上传">
              <el-upload
                ref="uploadRef"
                accept=".xls, .xlsx"
                action="none"
                :auto-upload="false"
                :before-remove="fileBeforeRemove"
                class="upload-demo"
                drag
                :file-list="fileList"
                :limit="1"
                :on-change="fileOnChange"
                style="width: 600px"
                @before-upload="uploadFileCheck"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  点击上传
                  <em>将文件拖拽到此区域</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">上传易芽导出的excel文件，至少2页/80个产品数据</div>
                </template>
              </el-upload>
            </el-form-item>

            <div style="display: flex; justify-content: end">
              <el-button :loading="isSaveLoading" type="success" @click="handlerSave">{{ saveBtnText }}</el-button>
            </div>
          </el-form>
        </el-col>

        <el-col :span="12">
          <el-form
            v-if="outPutResFlg"
            ref="outputFormRef"
            label-position="right"
            label-width="auto"
            :model="outputForm"
            style="width: 95%"
            @submit.prevent
          >
            <el-form-item label="评估编号" prop="productSource">
              <el-input v-model="outputForm.evaluationId" disabled />
            </el-form-item>

            <div style="display: flex">
              <el-form-item label="年市场容量" prop="marketCapacity">
                <el-input v-model="outputForm.marketCapacity" disabled />
              </el-form-item>
              <el-form-item label="竞争度" prop="competitiveness">
                <el-input v-model="outputForm.competitiveness" disabled />
              </el-form-item>
            </div>

            <div style="display: flex">
              <el-form-item label="首页平均销售额" prop="avgSalse">
                <el-input v-model="outputForm.avgSalse" disabled />
              </el-form-item>
              <el-form-item label="首页平均销售额偏离度" prop="salseDeviation">
                <el-input v-model="outputForm.salseDeviation" disabled />
              </el-form-item>
            </div>

            <div style="display: flex">
              <el-form-item label="30%毛利盈亏自然单占比" prop="grossProfitAndLoss">
                <el-input v-model="outputForm.grossProfitAndLoss" disabled />
              </el-form-item>
              <el-form-item label="平均上架天数" prop="avgDaysListed">
                <el-input v-model="outputForm.avgDaysListed" disabled />
              </el-form-item>
            </div>

            <div style="display: flex">
              <el-form-item label="亚马逊关键词首页评分" prop="amazonKeyWordScore">
                <el-input v-model="outputForm.amazonKeyWordScore" disabled />
              </el-form-item>
              <el-form-item label="市场供求评分" prop="supplyScore">
                <el-input v-model="outputForm.supplyScore" disabled />
              </el-form-item>
            </div>
            <el-form-item label="总评分" prop="finalScore">
              <el-input v-model="outputForm.finalScore" disabled />
            </el-form-item>

            <el-form-item label="关键词趋势跨度" prop="finalScore">
              <el-select v-model="keyWordValue" :reserve-keyword="false" @change="updateKeyWordTrend">
                <el-option v-for="item in idxKeyWordOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item style="margin-left: 100px; margin-right: -20px">
              <vab-echarts-chart-line v-if="echartsFlag" :x-axis-data="x" :y-axis-data="y" />
            </el-form-item>

            <div style="display: flex; justify-content: end">
              <el-button v-if="aginAnalyzeFlg" type="success" @click="aginAnalyze">再分析一个</el-button>
              <el-button type="danger" @click="goBack">退出</el-button>
            </div>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, UploadFile, UploadFiles, UploadInstance } from 'element-plus'
import { h } from 'vue'
import {
  checkPlagiarisme,
  doAddEvaluation,
  getCountryList,
  getEvaluationById,
  getEvaluationTrendList,
  updateEvaluation,
} from '/@/api/devlocal/evaluation'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

import { rules, selectOptions } from './addOrUpdateEvalution'

import { idxKeyWordOptions } from '/@/const/selectoptions'

const inputFormRef = ref<FormInstance>()
const outputFormRef = ref<FormInstance>()

defineOptions({
  name: 'AddOrUpdateEvalution',
})

// route
const route: any = useRoute()

const echartsFlag = ref(false)

const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
const uploadRef = ref<UploadInstance>()
const fileList = ref<any>([])
const isSaveLoading = ref<boolean>(false)
// 标识
const outPutResFlg = ref<boolean>(false)
const aginAnalyzeFlg = ref<boolean>(true)
const saveBtnText = ref<string>('分析并保存')
const keyWordValue = ref<string>('2')
const x = ref<string[]>([])
const y = ref<number[]>([])
const countryOptions = ref<{ countryId: number; countryName: string }[]>([])

// inputForm
const inputForm = reactive<any>({
  productSource: '亚马逊随机浏览',
  countryId: undefined,
  productNameZh: '',
  amazonFrontendKeywords: '',
  amazonBackendKeywords: '',
  amazonListingQuantity: '',
  averageSellingPrice: '',
  searchVolume90Days: '',
  averageSales360Days: '',
  top80PercentClickedProductsCount: '',
  amazonAdCpc: '',
  categoryAvgConversionRate: '',
})

// saveAfter outputForm
const outputForm = reactive<any>({
  evaluationId: '',
  marketCapacity: '',
  competitiveness: '',
  avgSalse: '',
  salseDeviation: '',
  grossProfitAndLoss: '',
  avgDaysListed: '',
  amazonKeyWordScore: '',
  supplyScore: '',
  finalScore: '',
})

// file format upload  check
const uploadFileCheck = async (file: File) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const whiteList = ['xls', 'xlsx']
  if (!whiteList.includes(fileSuffix)) {
    await $baseMessage('上传文件只能是xls、xlsx格式', 'error', 'hey')
    await close()
    return false
  }
}

// add upload file to fileList
const fileOnChange = (file: UploadFile, fileListVal: UploadFiles) => {
  fileList.value = fileListVal
}

// remote upload file
const fileBeforeRemove = (file: UploadFile, fileListVal: UploadFiles) => {
  fileList.value = fileListVal
  return true
}

const handlerSave = async () => {
  inputFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      isSaveLoading.value = true

      const formData = new FormData()
      // 向formData中添加数据
      formData.append('productSource', inputForm.productSource)
      formData.append('countryId', inputForm.countryId)
      formData.append('productNameZh', inputForm.productNameZh)
      formData.append('amazonFrontendKeywords', inputForm.amazonFrontendKeywords)
      formData.append('amazonBackendKeywords', inputForm.amazonBackendKeywords)
      formData.append('amazonListingQuantity', inputForm.amazonListingQuantity)
      formData.append('averageSellingPrice', inputForm.averageSellingPrice)
      formData.append('searchVolume90Days', inputForm.searchVolume90Days)
      formData.append('averageSales360Days', inputForm.averageSales360Days)
      formData.append('top80PercentClickedProductsCount', inputForm.top80PercentClickedProductsCount)
      formData.append('amazonAdCpc', inputForm.amazonAdCpc)
      formData.append('categoryAvgConversionRate', inputForm.categoryAvgConversionRate)

      // formData可以添加同名数据，
      fileList.value.forEach((v: any) => {
        formData.append('file', v.raw)
      })

      if (route.query.idNo) {
        formData.append('id', route.query.idNo)

        $baseConfirm('您确定要修改保存新款评估吗', null, async () => {
          // aginAnalyzeFlg.value = false
          const { data } = await updateEvaluation(formData)
          if (data) {
            $baseMessage('新款评估修改保存成功!', 'success', 'hey')
          }
          setResponseValue(data)
        })
        isSaveLoading.value = false
      } else {
        // 先进行跑分查重
        const { data } = await checkPlagiarisme({
          amazonFrontendKeywords: inputForm.amazonFrontendKeywords,
          amazonBackendKeywords: inputForm.amazonBackendKeywords,
        })
        if (data.length > 0) {
          const nameItems = data.map((item: string) => h('div', { style: 'margin: 8px 0; color: #666;' }, `• ${item}`))
          const content = h('div', { style: 'text-align: left;' }, [
            h('div', { style: 'margin-bottom: 15px; color: #333;' }, '以下人员已经评估过该产品：'),
            ...nameItems,
            h('div', { style: 'margin-top: 15px; color: #333;' }, '是否继续跑分？'),
          ])

          $baseConfirm(content, null, async () => {
            await handleAddEvaluation(formData)
            outPutResFlg.value = true
          })
        } else {
          await handleAddEvaluation(formData)
          outPutResFlg.value = true
        }
        isSaveLoading.value = false
      }
    }
  })
}
const handleAddEvaluation = async (formData: FormData) => {
  try {
    const { data } = await doAddEvaluation(formData)
    await $baseMessage('评估分析成功！', 'success', 'hey')
    setResponseValue(data)
    route.query.idNo = data.evaluationId
    aginAnalyzeFlg.value = true
    saveBtnText.value = '修改保存'
  } catch {
    isSaveLoading.value = false
  }
}
const setResponseValue = (data: any) => {
  outputForm.evaluationId = data.evaluationId
  outputForm.marketCapacity = data.marketCapacity
  outputForm.competitiveness = data.competitiveness
  outputForm.avgSalse = data.avgSalse
  outputForm.salseDeviation = data.salseDeviation
  outputForm.grossProfitAndLoss = data.grossProfitAndLoss
  outputForm.avgDaysListed = data.avgDaysListed
  outputForm.amazonKeyWordScore = data.amazonKeyWordScore
  outputForm.supplyScore = data.supplyScore
  outputForm.finalScore = data.finalScore
  x.value = data.trendList.xAxis
  y.value = data.trendList.yAxis
  echartsFlag.value = true
}

// reset
const close = () => {
  inputFormRef.value?.clearValidate()
  inputFormRef.value?.resetFields()
}

// 再分析一个
const aginAnalyze = async () => {
  outPutResFlg.value = false
  saveBtnText.value = '分析并保存'
  route.query.idNo = ''
  fileList.value = []
  inputForm.productSource = '亚马逊随机浏览'
  inputForm.countryId = undefined
  inputForm.productNameZh = ''
  inputForm.amazonFrontendKeywords = ''
  inputForm.amazonBackendKeywords = ''
  inputForm.amazonListingQuantity = ''
  inputForm.averageSellingPrice = ''
  inputForm.searchVolume90Days = ''
  inputForm.averageSales360Days = ''
  inputForm.top80PercentClickedProductsCount = ''
  inputForm.amazonAdCpc = ''
  inputForm.categoryAvgConversionRate = ''

  outputForm.evaluationId = ''
  outputForm.marketCapacity = ''
  outputForm.competitiveness = ''
  outputForm.avgSalse = ''
  outputForm.salseDeviation = ''
  outputForm.grossProfitAndLoss = ''
  outputForm.avgDaysListed = ''
  outputForm.amazonKeyWordScore = ''
  outputForm.supplyScore = ''
  outputForm.finalScore = ''
}

// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  // removeLocalStorage("evlautionRouteParams")
  history.back()
}

const fetchCountryOptions = async () => {
  const { data } = await getCountryList()
  countryOptions.value = data || []
}

const updateKeyWordTrend = async () => {
  let { data } = await getEvaluationTrendList({ keyWord: inputForm.amazonFrontendKeywords, type: parseInt(keyWordValue.value) })
  x.value = data.xAxis
  y.value = data.yAxis
}

onMounted(async () => {
  await fetchCountryOptions()

  if (route.query.idNo) {
    aginAnalyzeFlg.value = false
    outPutResFlg.value = true
    const { data } = await getEvaluationById({ idNo: route.query.idNo })
    inputForm.productSource = data.productSource
    inputForm.countryId = data.countryId
    inputForm.productNameZh = data.productNameZh
    inputForm.amazonFrontendKeywords = data.amazonFrontendKeywords
    inputForm.amazonBackendKeywords = data.amazonBackendKeywords
    inputForm.amazonListingQuantity = data.amazonListingQuantity
    inputForm.searchVolume90Days = data.searchVolume90Days
    inputForm.averageSellingPrice = data.averageSellingPrice
    inputForm.averageSales360Days = data.averageSales360Days
    inputForm.top80PercentClickedProductsCount = data.productsCount
    inputForm.amazonAdCpc = data.cpc
    inputForm.categoryAvgConversionRate = data.avgConversionRate

    outputForm.evaluationId = data.idNo
    outputForm.marketCapacity = data.marketVolume
    outputForm.competitiveness = data.competitiveness
    outputForm.avgSalse = data.avgSales
    outputForm.salseDeviation = data.salseDeviation
    outputForm.grossProfitAndLoss = data.grossProfitAndLoss
    outputForm.avgDaysListed = data.avgDaysListed
    outputForm.amazonKeyWordScore = Math.round(data.keyWordScore)
    outputForm.supplyScore = Math.round(data.supplyScore)
    outputForm.finalScore = Math.round(data.finalScore)

    x.value = data.trendList.xAxis
    y.value = data.trendList.yAxis

    echartsFlag.value = true
    saveBtnText.value = '修改保存'
  }

  // await changeTabsMeta({
  //   name: 'AddOrUpdateEvalution',
  //   meta: {
  //     title: `${route.query.idNo} - 新款评估`,
  //   },
  // })
})
</script>

<style lang="scss" scoped>
.vab-chart {
  width: 100%;
  height: 100%;
  min-height: 450px;
}
</style>
