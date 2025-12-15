<template>
  <div class="comprehensive-table-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center">
    <el-table
      ref="tableRef"
      border
      class="vab-table-container"
      :data="exchangeList"
      :header-cell-style="{ 'text-align': 'center' }"
      stripe
      style="width: auto; table-layout: fixed"
      @cell-click="changeInput"
    >
      <!-- 第一列固定标签列 -->
      <el-table-column align="right" fixed :label="labelMap['column0']" :prop="'column0'" width="310">
        <template #default="{ row }">
          <strong style="color: var(--el-table-header-text-color)" v-html="labelMap[row['column0']]"></strong>
        </template>
      </el-table-column>
      <el-table-column align="center" label="变体值相同" width="110">
        <template #default="{ row }">
          <template v-if="row['column0'] !== 'productImgUrl'">
            <el-checkbox v-model="row.variantsSame" class="custom-checkbox" @change="handleVariantsSame(row)" />
          </template>
        </template>
      </el-table-column>
      <!-- 动态列 -->
      <el-table-column v-for="(prop, index) in columnsChange" :key="index" align="center" :label="prop" min-width="260" :prop="prop">
        <template #default="{ row }">
          <template v-if="row['column0'] === 'productImgUrl'">
            <div style="display: flex; justify-content: center">
              <div class="image-cell">
                <!-- 有图片时显示 -->
                <div v-if="row[prop]" class="image-preview">
                  <img alt="" :src="row[prop]" />
                  <div class="image-actions">
                    <el-icon @click="handlePictureCardPreview(row[prop])"><zoom-in /></el-icon>
                    <el-icon @click="handleRemove(prop)"><delete /></el-icon>
                  </div>
                </div>
                <!-- 无图片时显示 -->
                <div v-else class="upload-placeholder" @click="showUploadDialog(row, prop)">
                  <el-icon><plus /></el-icon>
                </div>
              </div>
            </div>
          </template>
          <template
            v-if="
              [
                'productLength',
                'productWidth',
                'productHeight',
                'material',
                'battery',
                'benchmarkAsin',
                'patent',
                'manufacturerEnName',
              ].includes(row['column0'])
            "
          >
            <div class="none">
              <el-input
                v-model="row[prop]"
                @blur="clickCancel($event, prop)"
                @input="handleInputChange(row, prop)"
                @keyup.enter="clickCancel($event, prop)"
              />
            </div>
            <span>{{ row[prop] }}</span>
          </template>
          <template v-if="row['column0'] === 'productManager'">
            <el-select
              v-model="row[prop]"
              class="center-input"
              clearable
              default-first-option
              filterable
              :loading="peopleLoading"
              placeholder="点击输入和搜索"
              remote
              :remote-method="remotePeopleMethod"
              @change="handleChangeProductManager(row, prop)"
            >
              <el-option v-for="item in peopleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <template v-if="row['column0'] === 'productDesign'">
            <el-select
              v-model="row[prop]"
              class="center-input"
              clearable
              default-first-option
              filterable
              :loading="peopleLoading"
              placeholder="点击输入和搜索"
              remote
              :remote-method="remotePeopleMethod"
              @change="handleChangeProductDesign(row, prop)"
            >
              <el-option v-for="item in peopleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <template v-if="row['column0'] === 'sampleRetention'">
            <el-select
              v-model="row[prop]"
              class="center-select"
              collapse-tags
              collapse-tags-tooltip
              multiple
              placeholder="请选择拍照留样情况"
              @change="handleSampleRetentionStatus(row, prop)"
            >
              <el-option v-for="item in packageSampleOption" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </template>
          <template v-if="row['column0'] === 'packingGroup'">
            <el-checkbox
              v-model="row[prop]"
              class="custom-checkbox"
              :false-value="0"
              :true-value="1"
              @change="handlePackingUpdate(row, prop)"
            />
          </template>
          <template v-if="row['column0'] === 'operate'">
            <el-link type="primary" underline="never" @click="handleInsertSku(row, prop)">导入合并变体SKU的数据</el-link>
          </template>
          <template v-if="row['column0'] === 'productPosition'">
            <el-select
              v-model="row[prop]"
              class="center-select"
              placeholder="请选择产品定位"
              @change="handleChangeProductPosition(row, prop)"
            >
              <el-option v-for="item in productPositionOption" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </template>
          <template v-if="row['column0'] === 'oem'">
            <el-checkbox
              v-model="row[prop]"
              class="custom-checkbox"
              :false-value="0"
              :true-value="1"
              @change="handleUpdateOEM(row, prop)"
            />
          </template>
          <template v-if="row['column0'] === 'graphicDesign'">
            <el-checkbox
              v-model="row[prop]"
              class="custom-checkbox"
              :false-value="0"
              :true-value="1"
              @change="handleUpdateGraphicDesign(row, prop)"
            />
          </template>
          <template v-if="row['column0'] === 'magnetic'">
            <el-checkbox
              v-model="row[prop]"
              class="custom-checkbox"
              :false-value="0"
              :true-value="1"
              @change="handleUpdateMagnetic(row, prop)"
            />
          </template>
          <template v-if="row['column0'] === 'woodenProduct'">
            <el-checkbox
              v-model="row[prop]"
              class="custom-checkbox"
              :false-value="0"
              :true-value="1"
              @change="handleUpdateMagnetic(row, prop)"
            />
          </template>
          <template v-if="row['column0'] === 'toy'">
            <el-checkbox
              v-model="row[prop]"
              class="custom-checkbox"
              :false-value="0"
              :true-value="1"
              @change="handleUpdateMagnetic(row, prop)"
            />
          </template>

          <template v-if="row['column0'] === 'seasonal'">
            <el-checkbox
              v-model="row[prop]"
              class="custom-checkbox"
              :false-value="0"
              :true-value="1"
              @change="handleUpdateMagnetic(row, prop)"
            />
          </template>

          <template v-if="row['column0'] === 'procurementManager'">
            <!-- <el-select
              v-model="row[prop]"
              class="center-input"
              clearable
              default-first-option
              filterable
              :loading="peopleLoading"
              placeholder="点击输入和搜索"
              remote
              :remote-method="remoteProcurementManagerMethod"
              @change="handleChangeProcurementManager(row, prop)"
            >
              <el-option v-for="item in peopleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-select
              v-model="row[prop]"
              class="center-input"
              clearable
              filterable
              placeholder="点击输入或搜索采购"
              @change="handleChangeProcurementManager(row, prop)"
            >
              <el-option v-for="item in procurementManagerList" :key="item.userId" :label="item.userName" :value="item.userId" />
            </el-select>
          </template>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" min-width="200px" />
      </template>
    </el-table>

    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
    <vab-site-operation-user-select :distribution-list="distributionList" :operation-user-list="operationUserList" />

    <div class="pay-button-group">
      <el-button @click="handleGoback">上一步</el-button>
      <el-button native-type="submit" type="primary" @click="handleSave">保存</el-button>
      <el-button native-type="submit" type="primary" @click="handleSaveAndContinue">保存并继续</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import {
  getOperationDistributionList,
  getProductPositionList,
  getReviewVariantPackageSampleList,
  reviewGetSkuList,
  reviewInsertSkuInfo,
  reviewProductManager,
  reviewStepNo3GetSelectVariantList,
  reviewStepNo5SaveFv,
  reviewStepNo5SkuInfoPerfect,
  reviewStepNo5VariantImgDel,
  reviewStepNo5VariantImgUpload,
} from '/@/api/devlocal/orderProcess'
import { getAllName, getUserProcurementName } from '/@/api/devlocal/user'
import type { IGetSelectVariantsList, IOperationDistributionList } from '/@/type/orderProcess/orderProcessType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { _setStepNo } from '/@/utils/stepNoState'
import { getDistributionOptionUserList } from '/@/api/devlocal/productDistribution'

defineOptions({
  name: 'OrderStep5',
})

const route: any = useRoute()
const props = defineProps<{ step1Data: number }>()
const emit = defineEmits<{
  (e: 'change-step', value: number): void
  (e: 'update:imagePreviewVisible', value: boolean): void
  (e: 'update:previewListValue', value: string): void
}>()
// 查询下拉变体列表
const variantsSelectList = ref<IGetSelectVariantsList[]>([])
// const listLoading = ref<boolean>(true)
const peopleLoading = ref(false) //搜索产品经理和产品设计loading
const peopleOptions = ref<any[]>([]) //搜索选项
const peopleList = ref<any[]>([]) //搜索列表
const remotePeopleMethod = async (query: string) => {
  if (query) {
    const { data } = await getAllName({
      name: query,
    })

    peopleList.value = data.map((item: any) => {
      return { value: item.userId, label: item.userName }
    })
    peopleLoading.value = true
    setTimeout(() => {
      peopleLoading.value = false
      peopleOptions.value = peopleList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    peopleOptions.value = []
  }
}

// 采购负责人列表
const remoteProcurementManagerMethod = async (query: string) => {
  if (query) {
    const { data } = await getUserProcurementName({
      name: query,
    })

    peopleList.value = data.map((item: any) => {
      return { value: item.userId, label: item.userName }
    })
    peopleLoading.value = true
    setTimeout(() => {
      peopleLoading.value = false
      peopleOptions.value = peopleList.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    peopleOptions.value = []
  }
}

const handleUpdateOEM = async (row: any, prop: string) => {
  if (exchangeList.value[FIELD_INDEX_MAP.GRAPHIC_DESIGN][prop] === 1 && row[prop] === 1) {
    // o 1 g 1
    row[prop] = 0
    $baseMessage('每个变体只能选择OEM或平面设计其中一个，要选择另外一个请取消当前选择', 'error', 'hey')
    return
  }
  handlePackingUpdate(row, prop)
}
const handleUpdateGraphicDesign = async (row: any, prop: string) => {
  if (exchangeList.value[FIELD_INDEX_MAP.OEM][prop] === 1 && row[prop] === 1) {
    // o 1 g 1
    row[prop] = 0
    $baseMessage('每个变体只能选择OEM或平面设计其中一个，要选择另外一个请取消当前选择', 'error', 'hey')
    return
  }
  handlePackingUpdate(row, prop)
}
const handleUpdateMagnetic = async (row: any, prop: string) => {
  handlePackingUpdate(row, prop)
}
const handleInsertSku = async (row: any, prop: string) => {
  try {
    // console.log(exchangeList.value)
    // console.log(row)
    // console.log(prop)
    // console.log(index)
    const { data } = await reviewInsertSkuInfo({ sku: exchangeList.value[FIELD_INDEX_MAP.SKU_MERGE][prop] })
    if (data) {
      exchangeList.value[FIELD_INDEX_MAP.PRODUCT_LENGTH][prop] = data.productLength
      exchangeList.value[FIELD_INDEX_MAP.PRODUCT_WIDTH][prop] = data.productWidth
      exchangeList.value[FIELD_INDEX_MAP.PRODUCT_HEIGHT][prop] = data.productHeight
      exchangeList.value[FIELD_INDEX_MAP.MATERIAL][prop] = data.material
      exchangeList.value[FIELD_INDEX_MAP.BATTERY][prop] = data.battery
      exchangeList.value[FIELD_INDEX_MAP.MAGNETIC][prop] = data.magnetic || 0
      exchangeList.value[FIELD_INDEX_MAP.WOODEN_PRODUCT][prop] = data.woodenProduct || 0
      exchangeList.value[FIELD_INDEX_MAP.TOY][prop] = data.toy || 0
      exchangeList.value[FIELD_INDEX_MAP.SEASONAL][prop] = data.seasonal || 0
      exchangeList.value[FIELD_INDEX_MAP.BENCHMARK_ASIN][prop] = data.benchmarkAsin

      await reviewStepNo5SkuInfoPerfect({
        productLength: exchangeList.value[FIELD_INDEX_MAP.PRODUCT_LENGTH][prop],
        productWidth: exchangeList.value[FIELD_INDEX_MAP.PRODUCT_WIDTH][prop],
        productHeight: exchangeList.value[FIELD_INDEX_MAP.PRODUCT_HEIGHT][prop],
        material: exchangeList.value[FIELD_INDEX_MAP.MATERIAL][prop],
        battery: exchangeList.value[FIELD_INDEX_MAP.BATTERY][prop],
        magnetic: exchangeList.value[FIELD_INDEX_MAP.MAGNETIC][prop],
        woodenProduct: exchangeList.value[FIELD_INDEX_MAP.WOODEN_PRODUCT][prop],
        toy: exchangeList.value[FIELD_INDEX_MAP.TOY][prop],
        seasonal: exchangeList.value[FIELD_INDEX_MAP.SEASONAL][prop],
        benchmarkAsin: exchangeList.value[FIELD_INDEX_MAP.BENCHMARK_ASIN][prop],
        orderEntryId: exchangeList.value[FIELD_INDEX_MAP.ORDER_ENTRY_ID][prop],
      })
      $baseMessage('导入该SKU数据成功', 'success', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}

const tableRef = ref<TableInstance>()

/**
 * 图片预览事件
 */
const handlePictureCardPreview = (url: string) => {
  emit('update:previewListValue', url)
  emit('update:imagePreviewVisible', true)
}
let _prop = ''
let copyRow: any = null
const imageUploadVisible = ref<boolean>(false)
// 打开上传图片弹窗
const showUploadDialog = (row: any, prop: string) => {
  imageUploadVisible.value = true
  copyRow = row
  _prop = prop
}
async function uploadImage(file: File) {
  try {
    let imageForm = new FormData()
    imageForm.append('file', file)
    imageForm.append('orderEntryId', exchangeList.value[FIELD_INDEX_MAP.ORDER_ENTRY_ID][_prop])

    // 上传图片
    const { data } = await reviewStepNo5VariantImgUpload(imageForm)
    if (data) {
      copyRow[_prop] = data
      // 提示成功信息
      $baseMessage('图片上传成功!', 'success', 'hey')
      imageUploadVisible.value = false
    } else {
      $baseMessage('图片上传失败!', 'error', 'hey')
    }
  } catch (error) {
    console.error(error)
    $baseMessage('图片上传失败!', 'error', 'hey')
  }
}
/**
 * 图片删除功能
 */
const handleRemove = async (prop: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗', '系统提示', async () => {
      const { data } = await reviewStepNo5VariantImgDel({ orderEntryId: exchangeList.value[FIELD_INDEX_MAP.ORDER_ENTRY_ID][prop] })
      if (data === true) {
        $baseMessage('此产品图片信息删除成功!', 'success', 'hey')
        exchangeList.value[FIELD_INDEX_MAP.PRODUCT_IMG_URL][prop] = ''
      }
    })
  } catch (error) {
    console.error(error)
  }
}

// 字段索引映射 - 固定下标，便于维护
// 添加新列时，只需要：
// 1. 在这里添加新的常量（使用下一个可用数字）
// 2. 在labelMap中添加对应的标签
// 3. 在数据转换中添加字段
// 4. 在buildParams中使用常量而不是硬编码下标
const FIELD_INDEX_MAP = {
  PRODUCT_IMG_URL: 0,
  PRODUCT_POSITION: 1,
  OEM: 2,
  GRAPHIC_DESIGN: 3,
  PRODUCT_LENGTH: 4,
  PRODUCT_WIDTH: 5,
  PRODUCT_HEIGHT: 6,
  MATERIAL: 7,
  BATTERY: 8,
  MAGNETIC: 9,
  WOODEN_PRODUCT: 10,
  TOY: 11,
  SEASONAL: 12,
  BENCHMARK_ASIN: 13,
  PATENT: 14,
  PRODUCT_MANAGER: 15,
  PRODUCT_DESIGN: 16,
  PROCUREMENT_MANAGER: 17,
  SAMPLE_RETENTION: 18,
  PACKING_GROUP: 19,
  MANUFACTURER_EN_NAME: 20,
  CERTIFICATE_UPLOAD: 21,
  SKU_MERGE: 22,
  OPERATE: 23,
  ORDER_ENTRY_ID: 24,
  PRODUCT_MANAGER_ID: 25,
  PRODUCT_DESIGN_ID: 26,
  PROCUREMENT_MANAGER_ID: 27,
} as const

const labelMap: Record<string, string> = {
  column0: '',
  productImgUrl: '上传成套产品图片<br>(产品要和实际一致)',
  productPosition: '产品定位',
  oem: 'OEM',
  graphicDesign: '平面设计',
  productLength: '产品长(cm)',
  productWidth: '产品宽(cm)',
  productHeight: '产品高(cm)',
  material: '产品材质',
  battery: '是否含电池<br>(若有则填入电池类型)',
  magnetic: '带磁',
  woodenProduct: '木制品',
  toy: '玩具',
  seasonal: '应季产品',
  benchmarkAsin: '对标竞品ASIN',
  patent: '专利情况<br>(是否排查以及结果)',
  productManager: '产品经理',
  productDesign: '产品设计',
  procurementManager: '采购负责人',
  sampleRetention: '打包留样<br>(发布订货后系统自动增加数量和质检项)',
  packingGroup: '打包小组每次打包都要<br>拍照发微信群给产品经理检查',
  manufacturerEnName: '制造商英文名称<br>需认证产品必填(CPC/FCC/UL等)',
  certificateUpload: '证书上传',
  skuMerge: '合并变体的SKU',
  operate: '操作',
}
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
const buildParams = (key: string) => {
  const params = {
    productPosition: exchangeList.value[FIELD_INDEX_MAP.PRODUCT_POSITION][key],
    oem: exchangeList.value[FIELD_INDEX_MAP.OEM][key],
    graphicDesign: exchangeList.value[FIELD_INDEX_MAP.GRAPHIC_DESIGN][key],
    productLength: exchangeList.value[FIELD_INDEX_MAP.PRODUCT_LENGTH][key],
    productWidth: exchangeList.value[FIELD_INDEX_MAP.PRODUCT_WIDTH][key],
    productHeight: exchangeList.value[FIELD_INDEX_MAP.PRODUCT_HEIGHT][key],
    material: exchangeList.value[FIELD_INDEX_MAP.MATERIAL][key],
    battery: exchangeList.value[FIELD_INDEX_MAP.BATTERY][key],
    magnetic: exchangeList.value[FIELD_INDEX_MAP.MAGNETIC][key],
    woodenProduct: exchangeList.value[FIELD_INDEX_MAP.WOODEN_PRODUCT][key],
    toy: exchangeList.value[FIELD_INDEX_MAP.TOY][key],
    seasonal: exchangeList.value[FIELD_INDEX_MAP.SEASONAL][key],
    benchmarkAsin: exchangeList.value[FIELD_INDEX_MAP.BENCHMARK_ASIN][key],
    patent: exchangeList.value[FIELD_INDEX_MAP.PATENT][key],
    productManagerId: exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER_ID][key],
    productDesignId: exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN_ID][key],
    procurementManagerId: exchangeList.value[FIELD_INDEX_MAP.PROCUREMENT_MANAGER_ID][key],
    sampleRetention: exchangeList.value[FIELD_INDEX_MAP.SAMPLE_RETENTION][key].join(','),
    checkStatus: exchangeList.value[FIELD_INDEX_MAP.PACKING_GROUP][key],
    manufacturerEnName: exchangeList.value[FIELD_INDEX_MAP.MANUFACTURER_EN_NAME][key],
    orderEntryId: exchangeList.value[FIELD_INDEX_MAP.ORDER_ENTRY_ID][key],
  }
  return params
}
const update = async (prop: string) => {
  const params = buildParams(prop)
  await reviewStepNo5SkuInfoPerfect(params)
}
function arraysEqual(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) return false
  for (const [i, element] of arr1.entries()) {
    if (element !== arr2[i]) return false
  }
  return true
}

// 处理变体值相同
const handleVariantsSame = (row: any) => {
  //变体值相同的值改变的时候,也要检查是否更改
  const values = Object.values(row).filter(
    (value) => value !== null && value !== undefined && value !== '' && value !== row.variantsSame && value !== row.column0
  )
  // console.log(values)
  if (row.variantsSame) {
    // console.log(values)
    // 如果有值，
    if (values.length === 1) {
      // 更新所有非空单元格的值
      Object.keys(row).forEach((key) => {
        if (key !== 'column0' && key !== 'variantsSame') {
          row[key] = values[0]
        }
      })
    } else if (values.length > 1) {
      let valuesResult
      if (row['column0'] === 'sampleRetention') {
        valuesResult = values.every((item) => arraysEqual(item as any[], values[0] as any[]))
      } else {
        valuesResult = values.every((item) => item === values[0])
      }
      if (!valuesResult) {
        row.variantsSame = false
        $baseMessage('当前多个变体值不同，无法勾选。', 'error', 'hey')
      } else if (valuesResult) {
        row.variantsSame = true
        Object.keys(row).forEach((key) => {
          if (key !== 'column0' && key !== 'variantsSame') {
            row[key] = values[0]
            update(key)
          }
        })
      }
    }
  }
  return row.variantsSame
}
const syncVariantValues = (row: any) => {
  //默认勾选,如果当前行1个单元格只填了1个值，则该行其他单元格都填入该值。
  const values = Object.values(row).filter(
    (value) => value !== null && value !== undefined && value !== '' && value !== row.variantsSame && value !== row.column0
  )
  // console.log(values[0]);

  if (values.length === 1) {
    Object.keys(row).forEach((key) => {
      if (key !== 'column0' && key !== 'variantsSame') {
        row[key] = values[0]
      }
    })
  } else if (values.length > 1) {
    let valuesResult
    if (row['column0'] === 'sampleRetention') {
      valuesResult = values.every((item) => arraysEqual(item as any[], values[0] as any[]))
    } else {
      valuesResult = values.every((item) => item === values[0])
    }
    if (!valuesResult) {
      row.variantsSame = false
    } else if (valuesResult) {
      row.variantsSame = true
    }
  }
}

const handleInputChange = async (row: any, prop: string) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop]

    // 确保新值非空
    if (newValue !== null && newValue !== undefined && newValue !== '') {
      Object.keys(row).forEach(async (key) => {
        if (key !== 'column0' && key !== 'variantsSame' && key !== prop) {
          row[key] = newValue // 将其他单元格的值更新为当前输入框的值
          update(key)
        }
      })
    }
  }
}
/**
 * 输入失焦事件
 */
const clickCancel = async (event: any, prop: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1 && t1.classList[0] !== 'el-select') {
      t1.classList.add('none')
    }
    if (t2) t2.classList.remove('none')
  }

  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    update(prop)
  }
}
// 修改打包小组
const handlePackingUpdate = async (row: any, prop: any) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop]
    // 确保新值非空
    if (newValue !== null && newValue !== undefined && newValue !== '') {
      Object.keys(row).forEach(async (key) => {
        if (key !== 'column0' && key !== 'variantsSame') {
          row[key] = newValue // 将其他单元格的值更新为当前输入框的值
          update(key)
        }
      })
    }
  } else {
    await update(prop)
  }
}
// 修改产品经理
const handleChangeProductManager = async (row: any, prop: any) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop]
    Object.keys(row).forEach(async (key) => {
      if (key !== 'column0' && key !== 'variantsSame') {
        row[key] = newValue // 将其他单元格的值更新为当前输入框的值

        // 点击了修改,manager对应的就是id,让managerId就等于id
        exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER_ID][key] = exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER][key]
        if (exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER_ID][key] === exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN_ID][key]) {
          $baseMessage('产品经理和产品设计不能相同！', 'error')
          row[key] = ''
          row[prop] = ''
          exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER_ID][key] = null
        }
        update(key)
      }
    })
  } else {
    exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER_ID][prop] = exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER][prop]
    if (exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER_ID][prop] === exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN_ID][prop]) {
      $baseMessage('产品经理和产品设计不能相同！', 'error')
      row[prop] = ''
      exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER_ID][prop] = null
    }
    update(prop)
  }
}
// 修改产品设计
const handleChangeProductDesign = async (row: any, prop: any) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop]

    Object.keys(row).forEach(async (key) => {
      if (key !== 'column0' && key !== 'variantsSame') {
        row[key] = newValue // 将其他单元格的值更新为当前输入框的值

        // 点击了修改,design对应的就是id,让designId就等于id
        exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN_ID][key] = exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN][key]
        if (exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER_ID][key] === exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN_ID][key]) {
          $baseMessage('产品经理和产品设计不能相同！', 'error')
          row[key] = ''
          row[prop] = ''
          exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN_ID][key] = null
        }
        update(key)
      }
    })
  } else {
    exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN_ID][prop] = exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN][prop]
    if (exchangeList.value[FIELD_INDEX_MAP.PRODUCT_MANAGER_ID][prop] === exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN_ID][prop]) {
      $baseMessage('产品经理和产品设计不能相同！', 'error')
      row[prop] = ''
      exchangeList.value[FIELD_INDEX_MAP.PRODUCT_DESIGN_ID][prop] = null
    }
    update(prop)
  }
}

// 修改采购负责人
const handleChangeProcurementManager = async (row: any, prop: any) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop]

    Object.keys(row).forEach(async (key) => {
      if (key !== 'column0' && key !== 'variantsSame') {
        row[key] = newValue
        exchangeList.value[FIELD_INDEX_MAP.PROCUREMENT_MANAGER_ID][key] = exchangeList.value[FIELD_INDEX_MAP.PROCUREMENT_MANAGER][key]
        update(key)
      }
    })
  } else {
    exchangeList.value[FIELD_INDEX_MAP.PROCUREMENT_MANAGER_ID][prop] = exchangeList.value[FIELD_INDEX_MAP.PROCUREMENT_MANAGER][prop]
    update(prop)
  }
}

// 修改产品定位
const handleChangeProductPosition = async (row: any, prop: any) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop]
    // console.log(exchangeList.value);
    // console.log(peopleList.value);
    Object.keys(row).forEach(async (key) => {
      if (key !== 'column0' && key !== 'variantsSame') {
        row[key] = newValue // 将其他单元格的值更新为当前输入框的值

        update(key)
      }
    })
  } else {
    update(prop)
  }
}
// 修改打包留样情况
const handleSampleRetentionStatus = async (row: any, prop: any) => {
  if (row.variantsSame) {
    // 获取当前输入框的值
    const newValue = row[prop]
    // console.log(exchangeList.value);
    // console.log(peopleList.value);
    Object.keys(row).forEach(async (key) => {
      if (key !== 'column0' && key !== 'variantsSame') {
        row[key] = newValue // 将其他单元格的值更新为当前输入框的值

        update(key)
      }
    })
  } else {
    update(prop)
  }
}
// 当点击保存的时候
const handleSave = async () => {
  let classReviewId: number | undefined
  if (route.query.progressId) {
    //说明是订大货进去的,接受上一步传来的reviewId
    classReviewId = props.step1Data
  } else {
    classReviewId = route.query.reviewId
  }

  try {
    const { data } = await reviewStepNo5SaveFv({ reviewId: classReviewId! })
    if (data === true) {
      $baseMessage('当前信息已保存。', 'success', 'hey')
      _setStepNo(Number(classReviewId), 4)
      // await delVisitedRoute(handleActivePath(route, true))
    }
  } catch (error) {
    console.error(error)
  }
}

// 当点击保存并继续的时候
const handleSaveAndContinue = async () => {
  let classReviewId: number | undefined
  if (route.query.progressId) {
    //说明是订大货进去的,接受上一步传来的reviewId
    classReviewId = props.step1Data
  } else {
    classReviewId = route.query.reviewId
  }
  // 校验是否为空
  for (const item of exchangeList.value) {
    const column0 = item.column0
    if (column0 === 'productImgUrl') {
      for (const key of Object.keys(item)) {
        if (key !== 'column0' && key !== 'variantSame' && !item[key]) {
          $baseMessage(`${key}变体的图片不能为空!`, 'warning')
          return
        }
      }
    }
    if (
      [
        'productLength',
        'productWidth',
        'productHeight',
        'material',
        'battery',
        'benchmarkAsin',
        'productManager',
        'procurementManager',
        'manufacturerEnName',
      ].includes(column0)
    ) {
      for (const key of Object.keys(item)) {
        if (key !== 'column0' && key !== 'variantsSame' && !item[key]) {
          $baseMessage(`${key}变体的${labelMap[column0]}不能为空!`, 'warning')
          return
        }
      }
    }
  }

  // 获取采购负责人字段的所有变体值
  const procurementManagerField = exchangeList.value[FIELD_INDEX_MAP.PROCUREMENT_MANAGER]
  const variantNames = Object.keys(procurementManagerField).filter((key) => key !== 'column0' && key !== 'variantsSame')
  const allManagers = variantNames.map((variantName) => procurementManagerField[variantName]).filter(Boolean) // 过滤掉 undefined/null
  if (new Set(allManagers).size !== 1) {
    $baseMessage('采购负责人必须都一样!', 'warning')
    return
  }
  try {
    const { data } = await reviewStepNo5SaveFv({ reviewId: classReviewId! })
    if (data === true) {
      $baseMessage('当前信息已保存。', 'success', 'hey')
      emit('change-step', 5)
      _setStepNo(Number(classReviewId), 4)
      // if (route.query.reviewId) {
      //   await delVisitedRoute(handleActivePath(route, true))
      // }
    }
  } catch (error) {
    console.error(error)
  }
}
// 当点击上一步的时候
const handleGoback = () => {
  emit('change-step', 3)
}

// 表格原始数据
const skuVariantsData = ref<any>([])
// 转换后的表格数据
const exchangeList = ref<any>([])
// 表格行转换成列的函数
const useTableDataLineToColumn = () => {
  // 一条数据的所有字段数组
  let props = ref<string[]>([])
  // 每个字段的分组数据
  let groupData = ref<any[][]>([])
  // 计算表头
  const columns = computed(() => {
    return props.value.length > 0 ? [...groupData.value[0]] : []
  })
  // 根据每条数据的字段对数据进行分组
  const dataToGroupByKey = (list: any) => {
    list.forEach((item: any) => {
      // 遍历每个字段
      props.value.forEach((key, index) => {
        // 把对应字段的值放到对应字段分组中
        groupData.value[index].push(item[key])
      })
    })
  }

  // 根据分组数据，转换成最终显示的数据个数
  const changeGroupData = () => {
    // 转换后的数据
    const list: any = []
    // 解构分组数据
    const [column0, ...otherData] = groupData.value
    // 初始化每一行的数据, 除去表头，有几个key就算有几行
    props.value.slice(1).forEach((prop, i) => {
      list[i] = []
      // 设置第一列标题索引名称
      const data = { [props.value[0]]: prop }
      // 通过遍历每一列的日期，设置对应行的数据
      column0.forEach((column0, dateIndex) => {
        data[column0] = otherData[i][dateIndex]
      })
      list[i] = data
    })
    return list
  }

  // 初始化分组数据
  const initGroup = (list: any) => {
    const firstData = list[0] || {}
    // 获取一条数组的所有字段
    props.value = Object.keys(firstData)
    // 初始化每个字段的分组数据
    for (let i = 0; i < props.value.length; i++) {
      groupData.value[i] = []
    }
  }

  return {
    columns,
    initData: (data: any) => {
      // 初始化分组
      initGroup(data)
      // 向分组加入数据
      dataToGroupByKey(data)
      // 初始化分组内的数据，转为列数据
      return changeGroupData()
    },
  }
}
// 转换后的列的数据
let columnsChange: any

// 异步获取变体数据
const fetchVariantList = async () => {
  let classReviewId: number | undefined
  if (route.query.progressId) {
    //说明是订大货进去的,接受上一步传来的reviewId
    classReviewId = props.step1Data
  } else {
    classReviewId = route.query.reviewId
  }
  try {
    // 获取有几个变体
    const { data: variantSelectList } = await reviewStepNo3GetSelectVariantList({ reviewId: classReviewId! })
    variantsSelectList.value = variantSelectList
    // 获取默认的产品经理数据
    const { data: defaultProductManager } = await reviewProductManager({ reviewId: classReviewId! })
    // 获取默认的产品经理对应的id
    const { data: nameList } = await getAllName({ name: defaultProductManager })
    const item = nameList.find((_: any) => _.userName === defaultProductManager)
    const defaultProductManagerId = item.userId
    // 获取table数据
    const { data } = await reviewGetSkuList({ reviewId: classReviewId! })

    // 默认采购负责人 赵梦凡
    const defaultProcurementManager = procurementManagerList.value.find((item: any) => item.userName === '赵梦凡')
    skuVariantsData.value = data.map((item: any) => {
      if (item.productManagerId === -1) {
        // 如果新的table里面的产品经理存在,就是新的; 如果不存在,就是默认的
        item.productManager = defaultProductManager
        item.productManagerId = defaultProductManagerId

        item.sampleRetention = item.sampleRetention === '' ? [] : item.sampleRetention.split(',').map(Number)
      } else {
        return {
          column0: '',
          productImgUrl: item.variantImg,
          productPosition: item.productPosition,
          oem: item.oem,
          graphicDesign: item.graphicDesign,
          productLength: item.productLength,
          productWidth: item.productWidth,
          productHeight: item.productHeight,
          material: item.material,
          battery: item.battery,
          magnetic: item.magnetic || 0,
          woodenProduct: item.woodenProduct || 0,
          toy: item.toy || 0,
          seasonal: item.seasonal || 0,
          benchmarkAsin: item.benchmarkAsin,
          patent: item.patent,
          productManager: item.productManager,
          productDesign: item.productDesign,
          procurementManager: item.procurementManager || defaultProcurementManager?.userName,
          sampleRetention: item.sampleRetention === '' ? [] : item.sampleRetention.split(',').map(Number),
          packingGroup: item.checkStatus,
          manufacturerEnName: item.manufacturerEnName,
          certificateUpload: item.certificateUpload,
          skuMerge: item.variantSku,
          operate: '操作',
          orderEntryId: undefined,
          productManagerId: item.productManagerId,
          productDesignId: item.productDesignId,
          procurementManagerId: item.procurementManagerId || defaultProcurementManager?.userId,
        }
      }
    })
    skuVariantsData.value.forEach((item: any, index: number) => {
      if (index < variantSelectList.length) {
        const key = variantSelectList[index]
        item.column0 = key.label
        item.orderEntryId = key.id
      }
    })
    // console.log(skuVariantsData.value);
    const { initData, columns } = useTableDataLineToColumn()
    columnsChange = columns
    exchangeList.value = initData(skuVariantsData.value)
    exchangeList.value.forEach((item: any) => {
      item.variantsSame = true
      if (item.column0 !== 'productImgUrl') {
        syncVariantValues(item)
      }
    })
  } catch (error) {
    console.error('Error fetching variant list:', error)
  }
}
const productPositionOption = ref<{ id: number; label: string }[]>([])
const packageSampleOption = ref<{ id: number; label: string }[]>([])
const fetchProductPositionOption = async () => {
  const { data } = await getProductPositionList()
  productPositionOption.value = data
}
const fetchPackagePositionOption = async () => {
  const { data } = await getReviewVariantPackageSampleList()
  packageSampleOption.value = data
}
/** 获取采购负责人列表 */
const procurementManagerList = ref<{ userId: number; userName: string }[]>([])
const fetchProcurementManagerList = async () => {
  const { data } = await getUserProcurementName({
    name: '',
  })
  procurementManagerList.value = data
}
const operationUserList = ref<{ id: number; label: string }[]>([])
const fetchOperationUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operationUserList.value = data
}
const distributionList = ref<IOperationDistributionList[]>([])
const fetchDistributionList = async () => {
  let classReviewId: number | undefined
  if (route.query.progressId) {
    //说明是订大货进去的,接受上一步传来的reviewId
    classReviewId = props.step1Data
  } else {
    classReviewId = route.query.reviewId
  }
  const { data } = await getOperationDistributionList({ reviewId: classReviewId! })
  distributionList.value = data
}
onMounted(() => {
  fetchProductPositionOption()
  fetchPackagePositionOption()
  fetchVariantList()
  fetchProcurementManagerList()
  fetchOperationUserList()
  fetchDistributionList()
})
</script>

<style lang="scss" scoped>
.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}
// 控制编辑框显示与隐藏
.none {
  display: none;
}
.custom-checkbox {
  transform: scale(1.3); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
:deep(.vab-table-container .el-table__body-wrapper tr:nth-last-child(-n + 4)) {
  display: none;
}
:deep(.center-select) {
  text-align: center;
  text-align-last: center;
}
:deep(.center-input) {
  text-align: center;
  text-align-last: center;
}
// 设置清除键不跳动
:deep(.el-select__wrapper) {
  position: relative;
  .el-select__inner {
    padding-right: 18px;
  }
  .el-select__suffix {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
  }
}
// 图片样式
.image-cell {
  width: 75px;
  height: 75px;

  // 有图片时的样式
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: fill;
    }

    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s ease;

      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45); // 悬停时的背景色
      opacity: 1; // 悬停时完全显示
    }
  }
  // 没图片时的样式
  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);

    &:hover {
      border-color: var(--el-color-primary);
      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
}
</style>
