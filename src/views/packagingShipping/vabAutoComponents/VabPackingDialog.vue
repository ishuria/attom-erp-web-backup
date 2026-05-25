<template>
  <vab-dialog
    v-model="dflag"
    class="dialog"
    :close-on-click-modal="false"
    title="装箱"
    width="660px"
    @close="handleCloseDialog"
    @opened="handlePackingOpen"
  >
    <el-alert
      :closable="false"
      show-icon
      style="margin-bottom: 12px"
      title="请扫描条形码，并核对扫描结果（SKU、产品名称、图片）与箱中是否一致"
      type="warning"
    />
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="packingFormRef" label-position="top" :model="packingForm" :rules="packingFormRules">
          <el-form-item :label="upcOrFnSku" prop="fnSkuOrUpc">
            <el-input
              ref="barcodeInput"
              v-model="packingForm.fnSkuOrUpc"
              clearable
              :disabled="barcodeDisabled"
              @blur="handleBlur"
              @keydown.enter="handleEnter"
            />
          </el-form-item>
          <el-form-item label="SKU" prop="sku">
            <el-input v-model="packingForm.sku" disabled />
          </el-form-item>
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="packingForm.productName" disabled />
          </el-form-item>
          <el-form-item label="数量" prop="count">
            <el-input ref="packingCount" v-model="packingForm.count" clearable @change="handleUpdate" />
          </el-form-item>
          <el-form-item label="装箱图片" prop="packingImages">
            <!-- 拍照上传 -->
            <packing-image-capture v-model="packingForm.packingImages" @change="handlePackingImagesChange" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-image
          :src="packingForm.skuImageUrl"
          style="width: 300px; height: 300px; cursor: pointer; border: 2px #dcdfe6 solid; border-radius: 2%"
          @click="imagePreviewShow(packingForm.skuImageUrl!)"
        >
          <template #error>
            <el-icon />
          </template>
        </el-image>
      </el-col>
    </el-row>
    <template #footer>
      <div style="text-align: center">
        <el-button v-show="previousVisible" @click="switchPrevious">上一个</el-button>
        <el-button :loading="nextLoading" type="primary" @click="switchNext">下一个</el-button>
        <el-button :loading="finishLoading" type="success" @click="showConfirm">完成</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 确认 -->
  <vab-dialog v-model="confirmVisible" :close-on-click-modal="false" title="确认" width="50%" @close="closeConfirm">
    <el-form ref="confirmFormRef" :model="confirmForm" :rules="confirmFormRules" style="margin-right: 1px; margin-left: 1px">
      <el-form-item label="数量(箱)" prop="encaseCount">
        <el-input v-model="confirmForm.encaseCount" clearable style="width: 100%" />
      </el-form-item>
    </el-form>
    <vab-query-form style="margin-top: 20px">
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keydown.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border :data="list" :header-cell-style="{ textAlign: 'center' }" height="22vh" max-height="30vh" stripe>
      <el-table-column label="SKU" :min-width="flexColumnWidth(list, 'SKU', 'sku')" prop="sku" />
      <el-table-column :label="upcOrFnSku" :min-width="120" prop="fnSkuOrUpc" />
      <el-table-column label="Description" :min-width="flexColumnWidth(list, 'Description', 'productName')" prop="productName">
        <template #default="{ row }">
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.productName }}</div>
            </template>
            <span style="display: flex; align-items: center">
              <div class="multi-line-ellipsis-1">{{ row.productName }}</div>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" :min-width="90" prop="count" />

      <el-table-column label="装箱图片" min-width="300">
        <template #default="{ row }">
          <div v-if="row.packingImages?.length" class="packing-image-list">
            <el-image
              v-for="image in getVisiblePackingImages(row.packingImages)"
              :key="image.uid"
              fit="cover"
              :src="image.url"
              style="width: 50px; height: 50px; cursor: pointer"
              @click.stop="imagePreviewShow(image.url)"
            />
            <el-button
              v-if="getHiddenPackingImageCount(row.packingImages) > 0"
              class="packing-image-more"
              @click.stop="showPackingImageInfoDialog(row.packingImages)"
            >
              +{{ getHiddenPackingImageCount(row.packingImages) }}
            </el-button>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <template #footer>
      <div style="text-align: center">
        <el-button :loading="saveLoading" type="primary" @click="saveAndPrint">保存并打印条形码</el-button>
        <el-button :loading="saveLoading" type="success" @click="save">保存</el-button>
        <el-button @click="closeConfirm">关闭</el-button>
      </div>
    </template>
  </vab-dialog>

  <!-- 装箱图片完整信息 -->
  <packing-image-info-dialog v-model="packingImageInfoVisible" :image-list="packingImageInfoList" />

  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, InputInstance } from 'element-plus'
import { usePackingImageInfo } from '../composables/usePackingImageInfo'
import PackingImageCapture from './PackingImageCapture.vue'
import { getEncasementSku, printBarcodeEncasement, submitEncasementSkuWithImages, verifyPackingImage } from '/@/api/devlocal/encasement'
import { getPackagePackagerList } from '/@/api/devlocal/packagingShipping'
import { SiteEnum } from '/@/const/site'
import { useImagePreview } from '/@/hooks/useImagePreview'
import { usePackingStore } from '/@/store/modules/packing'
import type { SelectOption } from '/@/type/common'
import type { EncasementDetailList, IEncasementProduct, PackingImageItem } from '/@/type/packagingShipping/shippedType'
import { getCurrentFormatDate } from '/@/utils/dateUtils'
import { _addPacking, _clearPacking, _updatePacking } from '/@/utils/packing'
import { flexColumnWidth } from '/@/utils/tableColum'

// 走 GTIN 的站点（条码前可能带前导 00 需要剥掉）
const GTIN_SITES: ReadonlySet<number> = new Set([SiteEnum.WALMART_US, SiteEnum.TIKTOK_US])

let props = defineProps<{
  packingVisible: boolean
  site: number | undefined
  encasementNo: number
  isReinsert: boolean
  partner?: number[]
}>()
const dflag = ref<boolean>(false)
const upcOrFnSku = computed<string>(() => (props.site !== undefined && GTIN_SITES.has(props.site) ? 'GTIN' : 'FNSKU'))

// 上一个显示与否
const previousVisible = ref<boolean>(false)
// 图片预览
const {
  imagePreviewVisible,
  imagePreviewList,
  openImagePreview: imagePreviewShow,
  closeImagePreview: imagePreviewClose,
} = useImagePreview()
const { getVisiblePackingImages, getHiddenPackingImageCount, packingImageInfoVisible, packingImageInfoList, showPackingImageInfoDialog } =
  usePackingImageInfo<PackingImageItem>((image) => image.url)
const confirmFormRef = ref<FormInstance>()
// 确认的form
const confirmForm = reactive<{ encaseCount: number | undefined }>({
  encaseCount: undefined,
})
const isPositiveInteger = (value: unknown) => /^[1-9]\d*$/.test(String(value ?? '').trim())
const normalizePositiveInteger = (value: unknown) => Number(String(value ?? '').trim())
const positiveIntegerValidator = (message: string) => (_rule: any, value: unknown, callback: (error?: Error) => void) => {
  if (!isPositiveInteger(value)) {
    callback(new Error(message))
    return
  }
  callback()
}
const packingImagesValidator = (_rule: any, value: unknown, callback: (error?: Error) => void) => {
  if (!Array.isArray(value) || value.length === 0) {
    callback(new Error('请上传至少一张装箱图片'))
    return
  }
  callback()
}
const confirmFormRules = reactive<FormRules<{ encaseCount: number | undefined }>>({
  encaseCount: [
    { required: true, message: '请输入箱数', trigger: 'blur' },
    { validator: positiveIntegerValidator('箱数必须是正整数'), trigger: ['blur', 'change'] },
  ],
})
// 扫描完的disabled
const barcodeDisabled = ref<boolean>(false)
watch(
  () => props.packingVisible,
  (visible, oldVisible) => {
    dflag.value = visible
    if (visible && !oldVisible) {
      // 首次打开先清空
      _clearPacking()
      // 第一次 上一个按钮隐藏，下一个按钮是一直存在
      previousVisible.value = false
      barcodeDisabled.value = false
    }
  },
  {
    immediate: true,
  }
)
const emit = defineEmits(['update:packingVisible', 'update:finish'])
const revokePackingImageUrls = (images?: PackingImageItem[]) => {
  images?.forEach((image) => {
    if (image.url) URL.revokeObjectURL(image.url)
  })
}
const revokeAllPackingImageUrls = () => {
  const urls = new Set<string>()
  packingStore.packingData.forEach((item: PackingType) => {
    item.packingImages?.forEach((image: PackingImageItem) => {
      if (image.url) urls.add(image.url)
    })
  })
  packingForm.packingImages?.forEach((image: PackingImageItem) => {
    if (image.url) urls.add(image.url)
  })
  urls.forEach((url) => URL.revokeObjectURL(url))
}
const clearCurrentPackingImages = () => {
  revokePackingImageUrls(packingForm.packingImages)
  packingForm.packingImages = []
}
const handleCloseDialog = () => {
  dflag.value = false
  emit('update:packingVisible', dflag.value)
  // 表单也先清空
  tempCurId.value = ''
  revokeAllPackingImageUrls()
  packingFormRef.value?.resetFields()
  packingForm.skuImageUrl = ''
  packingForm.packingImages = []
}
const packingForm = reactive<IEncasementProduct>({
  fnSkuOrUpc: '',
  sku: '',
  productName: '',
  count: undefined,
  skuImageUrl: '',
  packingImages: [],
})
const packingFormRef = ref<FormInstance>()
// 打包人员选项
const packagerOptions = ref<SelectOption[]>([])
const packagerOptionsLoading = ref<boolean>(false)
const getPartnerNames = (partnerIds: number[] = []) => {
  return partnerIds
    .map((id) => packagerOptions.value.find((item) => item.id === id)?.label)
    .filter((name): name is string => Boolean(name))
    .join(',')
}
const boxPartnerNames = computed(() => getPartnerNames(props.partner ?? []))
// 查询打包人员
const fetchPackagerOptions = async () => {
  if (packagerOptions.value.length > 0) {
    return
  }

  if (packagerOptionsLoading.value) {
    return
  }

  packagerOptionsLoading.value = true
  try {
    const { data } = await getPackagePackagerList()
    packagerOptions.value = data ?? []
  } catch {
    $baseMessage('获取装箱人列表失败，请刷新后重试', 'error')
  } finally {
    packagerOptionsLoading.value = false
  }
}
const packingFormRules = computed(() => ({
  fnSkuOrUpc: [{ required: true, message: `请输入${upcOrFnSku.value}`, trigger: 'blur' }],
  count: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { validator: positiveIntegerValidator('数量必须是正整数'), trigger: ['blur', 'change'] },
  ],
  packingImages: [{ validator: packingImagesValidator, trigger: 'change' }],
}))
const tempCurId = ref<string>('')
const packingStore = usePackingStore()
// FNSKU输入框引用
const barcodeInput = ref<InputInstance>()
// 装箱数量引用
const packingCount = ref<InputInstance>()
// 确认可见
const confirmVisible = ref<boolean>(false)

const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const list = ref<EncasementDetailList[]>([])
const filteredData = computed(() => {
  if (!queryForm.keyWord) return packingStore.packingData // 如果没有输入 SKU，返回所有数据
  return packingStore.packingData.filter(
    (item) => item.sku.toLowerCase().includes(queryForm.keyWord.toLowerCase()) // 根据 SKU 字段过滤
  )
})
const queryData = () => {
  queryForm.pageNo = 1
  // 过滤数据：根据 SKU 字段过滤

  list.value = filteredData.value
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const fetchData = () => {
  list.value = packingStore.packingData.slice((queryForm.pageNo - 1) * queryForm.pageSize, queryForm.pageNo * queryForm.pageSize)
  total.value = packingStore.packingData.length
}
const validatePackingForm = () => {
  return new Promise<boolean>((resolve) => {
    if (!packingFormRef.value) {
      resolve(false)
      return
    }

    packingFormRef.value.validate((isValid: boolean) => {
      resolve(isValid)
    })
  })
}
const validateConfirmForm = () => {
  return new Promise<boolean>((resolve) => {
    if (!confirmFormRef.value) {
      resolve(false)
      return
    }

    confirmFormRef.value.validate((isValid: boolean) => {
      resolve(isValid)
    })
  })
}
// 展示确认/完成
const showConfirm = async () => {
  if (finishLoading.value) return

  finishLoading.value = true
  try {
    if (packingForm.fnSkuOrUpc || packingForm.count != null || packingForm.packingImages?.length) {
      const isValid = await validatePackingForm()
      if (!isValid) return

      const imageValid = await handleVerifyPackingImage()
      if (!imageValid) return

      handleUpdate()
    }

    // 先判断存入数据是否为空
    if (packingStore.packingData.length === 0) {
      $baseMessage(`请先填写${upcOrFnSku.value}`, 'error')
    } else {
      // 校验所有存储的是否是已填
      const countValid = packingStore.packingData.every((item: PackingType) => {
        return isPositiveInteger(item.count)
      })
      if (!countValid) {
        $baseMessage(`数量必须是正整数`, 'error')
        return
      }
      const upcOrFnSkuValid = packingStore.packingData.every((item: PackingType) => {
        return item.fnSkuOrUpc
      })

      if (!upcOrFnSkuValid) {
        $baseMessage(`${upcOrFnSku.value}不能为空`, 'error')
        return
      }
      const packingImagesValid = packingStore.packingData.every((item: PackingType) => item.packingImages?.length)
      if (!packingImagesValid) {
        $baseMessage('请给每条装箱明细上传至少一张装箱图片', 'error')
        return
      }
      confirmForm.encaseCount = undefined // 每次打开数量置空
      confirmVisible.value = true
      fetchData()
    }
  } finally {
    finishLoading.value = false
  }
}

// 关闭确认
const closeConfirm = () => {
  confirmForm.encaseCount = undefined
  confirmVisible.value = false
  handleCloseDialog()
  emit('update:finish')
}
const buildEncasementDetailList = (): EncasementDetailList[] => {
  return packingStore.packingData.map((item: PackingType) => ({
    fnSkuOrUpc: item.fnSkuOrUpc,
    sku: item.sku,
    productName: item.productName,
    count: isPositiveInteger(item.count) ? normalizePositiveInteger(item.count) : item.count,
  }))
}
const buildSubmitFormData = () => {
  const submitData = {
    encaseCount: confirmForm.encaseCount,
    encasementNo: props.encasementNo,
    planSite: props.site,
    partner: props.partner ?? [],
    encasementDetailList: buildEncasementDetailList(),
    isReinsert: props.isReinsert === true ? 1 : 0,
  }
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(submitData)], { type: 'application/json' }))
  packingStore.packingData.forEach((item: PackingType, index: number) => {
    item.packingImages?.forEach((image: PackingImageItem) => {
      formData.append(`files_${index}`, image.file)
    })
  })
  return formData
}
// 保存并打印
const saveAndPrint = async () => {
  if (saveLoading.value) return

  const isValid = await validateConfirmForm()
  if (!isValid) return

  saveLoading.value = true
  try {
    confirmForm.encaseCount = normalizePositiveInteger(confirmForm.encaseCount)
    const { data } = await submitEncasementSkuWithImages(buildSubmitFormData())
    if (data) {
      const req = `${getCurrentFormatDate()}-${props.encasementNo}-${confirmForm.encaseCount}`
      const { code } = await printBarcodeEncasement({ code: req })
      if (code === 0) {
        $baseMessage('保存并打印条形码成功', 'success')
        // const { data: res } = await printBarcodeEncasementSuccess(JSON.stringify(data))
        // if (res) {
        handleCloseDialog()
        emit('update:finish')
        // }
      }
    }
  } finally {
    saveLoading.value = false
  }
}
// 保存
const save = async () => {
  if (saveLoading.value) return

  const isValid = await validateConfirmForm()
  if (!isValid) return

  saveLoading.value = true
  try {
    confirmForm.encaseCount = normalizePositiveInteger(confirmForm.encaseCount)
    const { data } = await submitEncasementSkuWithImages(buildSubmitFormData())
    if (data) {
      $baseMessage('保存成功', 'success')
    } else {
      $baseMessage('保存失败', 'error')
    }
  } finally {
    saveLoading.value = false
  }
}
// 打开装箱时自动聚焦到FNSKU输入框
const handlePackingOpen = () => {
  // 重置上次处理的条码，确保每次打开弹窗都能正常扫码
  lastProcessedBarcode.value = ''
  void fetchPackagerOptions()
  barcodeInput.value?.focus()
}
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 添加一个标志来防止重复处理同一个条码
const lastProcessedBarcode = ref('')
// 扫码查询中先锁住输入，避免扫码枪连扫触发并发查询
const barcodeScanning = ref(false)

// 通用的扫码处理函数
const processBarcodeScan = async (barcodeValue: string) => {
  if (barcodeScanning.value) {
    return
  }
  // 检查是否已经处理过这个条码
  if (lastProcessedBarcode.value === barcodeValue) {
    return
  }

  // 记录当前处理的条码
  lastProcessedBarcode.value = barcodeValue
  barcodeScanning.value = true
  barcodeDisabled.value = true

  packingForm.fnSkuOrUpc = barcodeValue
  let str = barcodeValue
  // 沃尔玛/Tiktok 的 GTIN 扫枪可能带前导 00，需要去掉
  if (props.site !== undefined && GTIN_SITES.has(props.site) && barcodeValue.startsWith('00')) {
    str = barcodeValue.substring(2)
  }

  // 发送网络请求，根据结果判断，是否是清空重新输入还是聚焦到数量框
  try {
    const { data } = await getEncasementSku({
      site: props.site!,
      fnSkuOrUpc: str,
    })
    if (data) {
      // Object.assign(packingForm, data)
      // 更新 packingForm
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(packingForm, key)) {
          packingForm[key] = (data as any)[key]
        }
      }
      // console.log('扫码后的form', packingForm);

      tempCurId.value = generateUUID()
      let flag = _addPacking(packingForm, tempCurId.value)
      if (flag) {
        // 已存在相同条码：清空表单，并清掉去重记录，允许用户重新操作
        clearCurrentPackingImages()
        packingFormRef.value?.resetFields()
        packingForm.skuImageUrl = ''
        barcodeDisabled.value = false
        lastProcessedBarcode.value = ''
        nextTick(() => {
          barcodeInput.value?.focus()
        })
        return
      }
      // console.log('packingData', packingStore.packingData)
      barcodeDisabled.value = true
      if (packingCount.value) {
        packingCount.value.focus()
        packingCount.value.select()
      }
    } else {
      // 查不到：清空表单和去重记录，允许重扫同一个码
      packingForm.fnSkuOrUpc = ''
      barcodeDisabled.value = false
      lastProcessedBarcode.value = ''
      $baseMessage(`找不到该${upcOrFnSku.value}，请重新扫描`, 'error')
      nextTick(() => {
        barcodeInput.value?.focus()
      })
    }
  } catch (e) {
    // 网络/后端异常：回滚状态，允许重扫
    packingForm.fnSkuOrUpc = ''
    barcodeDisabled.value = false
    lastProcessedBarcode.value = ''
    $baseMessage('扫码查询失败，请重试', 'error')
    nextTick(() => {
      barcodeInput.value?.focus()
    })
  } finally {
    barcodeScanning.value = false
  }
}

// 处理回车键事件（扫枪或用户手动回车）
const handleEnter = async (event: any) => {
  const barcodeValue = (event.target as HTMLInputElement).value
  if (!barcodeValue || !barcodeValue.trim()) {
    return
  }
  await processBarcodeScan(barcodeValue)
}

// 处理失焦事件
const handleBlur = async (event: any) => {
  const barcodeValue = (event.target as HTMLInputElement).value
  if (!barcodeValue || !barcodeValue.trim()) {
    return
  }
  await processBarcodeScan(barcodeValue)
}

// 更新表单
const handleUpdate = () => {
  // console.log('更新count后的', packingForm);
  if (!tempCurId.value) {
    return
  }

  const updatePacking = {
    tempId: tempCurId.value,
    ...packingForm,
    count: isPositiveInteger(packingForm.count) ? normalizePositiveInteger(packingForm.count) : packingForm.count,
  }
  // console.log('updatePacking', updatePacking);

  _updatePacking(updatePacking)
  // console.log('更新', packingStore.packingData);
}
const handlePackingImagesChange = () => {
  handleUpdate()
  void packingFormRef.value?.validateField('packingImages')
}

// 切换上一个
const switchPrevious = () => {
  // 如果表单什么也没输入，可以切换到上一个
  if (!packingForm.fnSkuOrUpc && packingForm.count == null) {
    const data = packingStore.packingData
    const index = data.length - 1
    // console.log('上一个的数据是', data[index]);
    // console.log('index', index);

    if (index === 0) {
      previousVisible.value = false
    }
    Object.assign(packingForm, data[index])
    // id赋值
    tempCurId.value = data[index].tempId
    // 扫抢扫码不能输入
    barcodeDisabled.value = true
    return
  }
  // 首先判断是否都输入
  packingFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      // console.log(packingForm);

      // 上一个一定是有数据的
      const data = packingStore.packingData
      const index = data.findIndex((item: PackingType) => item.tempId === tempCurId.value)
      // 先判断上一个是不是第一个，如果是，上一个显示隐藏
      if (index - 1 === 0) {
        previousVisible.value = false
      }
      Object.assign(packingForm, data[index - 1])
      // id赋值
      tempCurId.value = data[index - 1].tempId
      // 扫抢扫码不能输入
      barcodeDisabled.value = true
    }
  })
}
const nextLoading = ref<boolean>(false)
const finishLoading = ref<boolean>(false)
const saveLoading = ref<boolean>(false)
// 切换下一个
const switchNext = async () => {
  if (nextLoading.value) return

  nextLoading.value = true
  try {
    // 首先判断是否都输入
    const isValid = await validatePackingForm()
    if (!isValid) return

    const imageValid = await handleVerifyPackingImage()
    if (!imageValid) return

    handleUpdate()
    // 两种情况，一种是在中间点击下一个，跳到对应的数据位置；一种是在最后一个点击下一个，跳到新的数据
    const data = packingStore.packingData
    const length = data.length
    const index = data.findIndex((item: PackingType) => item.tempId === tempCurId.value)
    if (length - 1 === index) {
      // 如果就是最后一个，创建一个新的
      tempCurId.value = ''
      packingFormRef.value?.resetFields()
      packingForm.skuImageUrl = ''
      // 装箱人不清空，装箱图片清空
      packingForm.packingImages = []
      // 清掉上次扫码记录，让重复条码交给 store 层报错
      lastProcessedBarcode.value = ''
      // console.log('最后一个下一个后的数据', packingStore.packingData)
      // 上一个按钮展示
      previousVisible.value = true
      // 扫枪扫码可以输入（先解禁，等 DOM 更新后再聚焦）
      barcodeDisabled.value = false
      nextTick(() => {
        barcodeInput.value?.focus()
      })
    } else {
      // 如果是中间的，就再跳到下一个
      Object.assign(packingForm, data[index + 1])
      // 当前id变换
      tempCurId.value = data[index + 1].tempId
      // console.log('中间的下一个后的数据', packingStore.packingData);
      // 上一个按钮展示
      previousVisible.value = true
      // 扫抢扫码不能输入
      barcodeDisabled.value = true
    }
  } finally {
    nextLoading.value = false
  }
}
// 点击下一个 或 完成的时候 调接口 触发校验图片
const handleVerifyPackingImage = async () => {
  if (!packingForm.fnSkuOrUpc) {
    $baseMessage(`请先扫描${upcOrFnSku.value}`, 'error')
    return false
  }

  if (props.site == null) {
    $baseMessage('站点为空，无法校验装箱图片', 'error')
    return false
  }

  if (!packingForm.packingImages?.length) {
    $baseMessage('请上传至少一张装箱图片', 'error')
    return false
  }

  const formData = new FormData()
  formData.append('fnSkuOrUpc', packingForm.fnSkuOrUpc)
  formData.append('site', String(props.site))
  packingForm.packingImages.forEach((image: PackingImageItem) => {
    formData.append('files', image.file)
  })

  try {
    const { data } = await verifyPackingImage(formData)
    if (!data) {
      $baseMessage('装箱图片校验失败，请重新拍摄', 'error')
      return false
    }
    return true
  } catch {
    return false
  }
}
</script>

<style lang="scss" scoped>
.packing-image-list {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.packing-image-more {
  width: 50px;
  height: 50px;
  padding: 0;
}
</style>
