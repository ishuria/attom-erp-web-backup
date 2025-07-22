<template>
  <vab-dialog v-model="dflag" :before-close="handlerCloseDialog" title="产品成本核算与推进" top="10vh" width="100%">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handlerAddRowCost">新增</el-button>
        <el-button type="primary" @click="handlerProductProgress">新品推进(发布到新品进度管理)</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <vue-draggable v-model="dList" :animation="150" ghost-class="ghost" target="tbody" @end="onEnd">
      <el-table
        border
        :cell-class-name="getCellStyle"
        :cell-style="cellStyle"
        :data="dList"
        :header-cell-style="{ textAlign: 'center' }"
        max-height="65vh"
        stripe
        @cell-click="changeInput"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="38" />
        <el-table-column label="日期" prop="createTime" width="115" />
        <el-table-column label="站点" prop="site" width="180">
          <template #default="{ row }">
            <el-select v-model="row.site" placeholder="请选择站点" style="min-width: 100%" @change="handlerSiteChange(row)">
              <el-option v-for="dict in props.siteList" :key="dict.id" :label="dict.label" :value="dict.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="币种" prop="currencyType" width="60" />
        <el-table-column label="汇率" prop="foreignExchange" width="80" />
        <el-table-column label="图片" prop="imgUrl" width="76px">
          <template #default="{ row }">
            <div class="image-cell">
              <!-- 有图片时显示 -->
              <div v-if="row.imgUrl" class="image-preview">
                <img alt="" :src="row.imgUrl" />
                <div class="image-actions">
                  <el-icon @click="handlePreview(row.imgUrl)"><zoom-in /></el-icon>
                  <el-icon @click="removeImage(row)"><delete /></el-icon>
                </div>
              </div>
              <!-- 无图片时显示 -->
              <div v-else class="upload-placeholder" @click="showUploadDialog(row)">
                <el-icon><plus /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品描述" min-width="120" prop="desc">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.desc }}</div>
              </template>
              <el-text style="vertical-align: middle;" truncated>{{ row.desc }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="价格信息" min-width="120" prop="priceInfo">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ row.priceInfo }}</div>
              </template>
              <el-text style="vertical-align: middle;" truncated>{{ row.priceInfo }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="1688链接" min-width="120" prop="url1688">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <!-- <el-link class="link-tooltip" :href="row.url1688" target="_blank" type="primary">{{ row.url1688 }}</el-link> -->
                <div class="link-tooltip">{{ row.url1688 }}</div>
              </template>
              <el-text style="vertical-align: middle;" truncated>{{ row.url1688 }}</el-text>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="价格￥" prop="price" width="85">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.price" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span>{{ row.price ? '￥' + row.price : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="长(cm)" prop="length" width="85">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.length" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <!-- <span>{{ row.length != null ? row.length : '' }}</span> -->
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(dList, '长(cm)', 'length', 0), 'text-align': 'right' }">
              {{ row.length != null ? row.length : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="宽(cm)" prop="width" width="85">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.width" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <!-- <span>{{ row.width != null ? row.width : '' }}</span> -->
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(dList, '长(cm)', 'width', 0), 'text-align': 'right' }">
              {{ row.width != null ? row.width : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="高(cm)" prop="height" width="85">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.height" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <!-- <span>{{ row.height != null ? row.height : '' }}</span> -->
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(dList, '长(cm)', 'height', 0), 'text-align': 'right' }">
              {{ row.height != null ? row.height : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="重量(g)" prop="weight" width="85">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.weight" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(dList, '重量(g)', 'weight', 0), 'text-align': 'right' }">
              {{ row.weight != null ? row.weight : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="尾程" prop="lastMile" width="85">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.lastMile" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
           
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(dList, '尾程', 'lastMile', 0), 'text-align': 'right' }">
              {{ row.lastMile ? row.symbol + row.lastMile : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="头程￥" prop="firstMile" width="85">
          <template #default="{ row }">
            
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(dList, '头程￥', 'firstMile', 0), 'text-align': 'right' }">
              {{ row.firstMile ? '￥' + row.firstMile : '' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="打包￥" prop="packaging" width="85">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.packaging" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span>{{ row.packaging ? '￥' + row.packaging : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头程渠道" min-width="120" prop="firstMileChannel">
          <template #default="{ row }">
            <el-select v-model="row.firstMileChannel" placeholder="请选择" style="min-width: 100%" @change="handlerEstimatedChange(row)">
              <el-option v-for="dict in props.channelList" :key="dict.id" :label="dict.label" :value="dict.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="售价" prop="sellingPrice" width="85">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.sellingPrice"
                @blur="clickCancel($event, row)"
                @keydown.enter="effectiveCountInputHandle($event)"
              />
            </div>
            <span>{{ row.sellingPrice ? row.symbol + row.sellingPrice : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="毛利率" prop="grossMarginRate" width="85">
          <template #default="{ row }">
            
            <span :style="{ display: 'inline-block', 'min-width': flexColumnWidth(dList, '毛利率', 'grossMarginRate', 0), 'text-align': 'right' }">
              <el-text v-if="row.grossMarginRate >= 30" type="success">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 25 && row.grossMarginRate < 30" type="primary">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate >= 20 && row.grossMarginRate < 25" type="warning">{{ row.grossMarginRate + '%' }}</el-text>
            <el-text v-if="row.grossMarginRate < 20" type="danger">
              {{ row.grossMarginRate != null ? row.grossMarginRate + '%' : '' }}
            </el-text>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="ROI" prop="roi" width="85">
          <template #default="{ row }">
            {{ row.roi != null ? row.roi + '%' : '' }}
          </template>
        </el-table-column>

        <el-table-column label="重量系数" prop="weightCoefficient" width="100">
     
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.weightCoefficient"
                @blur="clickCancel($event, row)"
                @keydown.enter="effectiveCountInputHandle($event)"
              />
            </div>
            <span>{{ row.weightCoefficient }}</span>
          </template>
        </el-table-column>

        <el-table-column label="体积系数" prop="volumeCoefficient" width="100">
     
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.volumeCoefficient"
                @blur="clickCancel($event, row)"
                @keydown.enter="effectiveCountInputHandle($event)"
              />
            </div>
            <span>{{ row.volumeCoefficient }}</span>
          </template>
        </el-table-column>

        <el-table-column label="关税%" prop="tariff" width="85">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.tariff" @blur="clickCancel($event, row)" @keydown.enter="effectiveCountInputHandle($event)" />
            </div>
            <span>{{ row.tariff != null ? row.tariff + '%' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台佣金" prop="platformCommission" width="90">
          <template #default="{ row }">
            <span>{{ row.platformCommission ? row.symbol + row.platformCommission.toFixed(2) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓储费" prop="storageFee" width="85">
          <!-- <template #header>
            仓储费
            <br />
            2个月
          </template> -->
          <template #default="{ row }">
            <span>{{ row.storageFee ? row.symbol + row.storageFee.toFixed(2) : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :fixed="fixed" label="操作" width="120">
          <template #default="{ row }">
            <el-dropdown>
              <el-button text type="primary" @click="handleCalculate(row)">
                逆算
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleCalculate(row)">
                    <el-link type="primary" :underline="false">逆算</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handlerCopyData(row)">
                    <el-link type="primary" :underline="false">复制</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handlerDelete(row)">
                    <el-link type="danger" :underline="false">删除</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </vue-draggable>
    <template #footer></template>
  </vab-dialog>

  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />

  <!-- 产品描述 -->
  <vab-dialog v-model="productDescriptionVisible" title="产品描述" width="35%">
    <el-input v-model="productDescription" :rows="20" type="textarea" />
    <template #footer>
      <el-button @click="productDescriptionVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmUpdate1Dialog">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 价格信息 -->
  <vab-dialog v-model="priceInformationVisible" title="价格信息" width="35%">
    <el-input v-model="priceInformation" :rows="20" type="textarea" />
    <template #footer>
      <el-button @click="priceInformationVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmUpdate2Dialog">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 1688链接 -->
  <vab-dialog v-model="link1688Visible" title="1688链接" width="35%">
    <el-input v-model="link1688" :rows="20" type="textarea" />
    <template #footer>
      <el-button @click="link1688Visible = false">取消</el-button>
      <el-button type="primary" @click="confirmUpdate3Dialog">确认</el-button>
    </template>
  </vab-dialog>
  <!-- 上传图片 -->
  <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
</template>

<script lang="ts" setup>
import { ArrowDown, Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElLink, ElMessageBox } from 'element-plus'
import { isEqual } from 'lodash-es'
import debounce from 'lodash/debounce'
import type { CSSProperties } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { flexColumnWidth } from '~/src/utils/tableColum'
import { siteReflectCurrencyAndExchangeRate } from '../../indexCommon'
import {
  addEstimatedCostAccounting,
  addEstimatedCostAccountingProductRelease,
  copyEstimatedCostAccounting,
  deleteEstimatedCostAccounting,
  evaluationCostDeleteImg,
  getExchangeRate,
  reverseCalculateEstimatedCostAccounting,
  updateEstimatedCostAccounting,
  updateEstimatedCostAccountingFirstMileChannel,
  updateEstimatedCostAccountingSort,
  uploadFileBoBakend,
} from '/@/api/devlocal/evaluation'
import type { IEstimatedCostAccounting } from '/@/type/evaluation/evaluationType'
import { formatDate } from '/@/utils/dateUtils'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { convertString } from '/@/utils/stringUtils'

defineOptions({
  name: 'VabEstimatedCostAccounting'
})

const imageUploadVisible = ref<boolean>(false)
let props = defineProps<{
  flag: boolean
  evaluationId: string
  list: IEstimatedCostAccounting[]
  channelList: { id: number; label: string }[]
  siteList: { id: number; label: string }[]
  callParentMethod: (id: number) => void
}>()

// 产品描述可见
const productDescriptionVisible = ref<boolean>(false)
const productDescription = ref<string>('')
// 价格信息可见
const priceInformationVisible = ref<boolean>(false)
const priceInformation = ref<string>('')
// 1688链接可见
const link1688Visible = ref<boolean>(false)
const link1688 = ref<string>('')

const dList = ref<IEstimatedCostAccounting[]>([])
const dflag = ref<boolean>(false)
watchEffect(() => {
  dList.value = props.list
  dflag.value = props.flag
})

const imagePreviewVisible = ref<boolean>(false)
const fixed = ref<string>('right')
const estimatedCostAccountingList = ref<IEstimatedCostAccounting[]>([])
const imagePreviewList = ref<string[]>([])
const selectRows = ref<IEstimatedCostAccounting[]>([])
const router = useRouter()
let { evaluationId } = toRefs(props)
let copyRow: any

// 打开上传图片弹窗
const showUploadDialog = (row: any) => {
  imageUploadVisible.value = true
  copyRow = row
}
// 上传图片
const uploadImage = async (file: File) => {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file);
    uploadImgForm.append('id', `${copyRow.id}`);

    const { data } = await uploadFileBoBakend(uploadImgForm)
    if (data) {
      copyRow.imgUrl = data
      $baseMessage('图片上传成功！', 'success')
      imageUploadVisible.value = false
    } else {
      $baseMessage('图片上传失败！', 'error')
    }
  } catch (error) {
    console.error(error)
  }
}
// 删除图片
const removeImage = (row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
      const { data } = await evaluationCostDeleteImg({
        id: row.id
      })
      if (data) {
        row.imgUrl = ''
        $baseMessage("图片删除成功!","success","hey")
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 图片预览
const handlePreview = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const isValueAllInput = (row: IEstimatedCostAccounting) => {
  if (row.site == null) {
    $baseMessage('站点不能为空，请选择后再进行逆算！', 'warning')
    return false
  } else if (row.price == null) {
    $baseMessage('产品价格不能为空，请填写后再进行逆算！', 'warning')
    return false
  } else if (row.length == null) {
    $baseMessage('产品的长度(cm)不能为空，请填写后再进行逆算！', 'warning')
    return false
  } else if (row.width == null) {
    $baseMessage('产品的宽度(cm)不能为空，请填写后再进行逆算！', 'warning')
    return false
  } else if (row.height == null) {
    $baseMessage('产品的高度(cm)不能为空，请填写后再进行逆算！', 'warning')
    return false
  } else if (row.weight == null) {
    $baseMessage('产品的重量(g)不能为空，请填写后再进行逆算！', 'warning')
    return false
  } else if (row.packaging == null) {
    $baseMessage('产品的打包价格不能为空，请填写后再进行逆算！', 'warning')
    return false
  } else if (row.firstMileChannel == null) {
    $baseMessage('产品的头程渠道不能为空，请选择后再进行逆算！', 'warning')
    return false
  } else if (row.weightCoefficient == null) {
    $baseMessage('产品的重量系数不能为空，请填写后再进行逆算！', 'warning')
    return false
  } else if (row.volumeCoefficient == null) {
    $baseMessage('产品的体积系数不能为空，请填写后再进行逆算！', 'warning')
    return false
  } else if (row.tariff == null) {
    $baseMessage('产品的关税不能为空，请填写后再进行逆算！', 'warning')
    return false
  }
  return true
}

// 逆算
const handleCalculate = async (row: IEstimatedCostAccounting) => {
  // 判断可以编辑的值是否都已填
  const isInputAll = isValueAllInput(row)
  if (isInputAll) {
    const { data } = await reverseCalculateEstimatedCostAccounting({ id: Number(row.id) })
    if (data) {
      $baseMessage('逆算成功！', 'success')
      props.callParentMethod(parseInt(evaluationId.value))
    }
  }
}
// 鼠标enter事件
const effectiveCountInputHandle = (event: Event) => {
  const targetElement = event.target as HTMLInputElement
  targetElement.blur()
}

// 新增行
const handlerAddRowCost = async () => {
  let newData: IEstimatedCostAccounting = {
    id: '',
    evaluationId: '',
    createTime: formatDate(new Date()),
    site: '0',
    currencyType: '',
    foreignExchange: '',
    imgUrl: '',
    desc: '',
    priceInfo: '',
    url1688: '',
    price: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    packaging: '',
    firstMileChannel: 1,
    sellingPrice: '',
    weightCoefficient: '',
    volumeCoefficient: '',
    tariff: '',
    lastMile: '',
    firstMile: '',
    grossMarginRate: '',
    roi: '',
    platformCommission: '',
    storageFee: '',
  }

  const formdata = new FormData()
  formdata.append('evaluationId', `${evaluationId.value}`)
  formdata.append('sort', convertString(dList.value.length + 1))

  const { data } = await addEstimatedCostAccounting(formdata)
  if (data) {
    // 获取汇率
    const { data } = await getExchangeRate({ currency: siteReflectCurrencyAndExchangeRate.get(newData.site)! })
    newData.foreignExchange = data

    $baseMessage('产品成本核算添加成功！', 'success', 'hey')
    estimatedCostAccountingList.value.push(newData)
    props.callParentMethod(parseInt(evaluationId.value))
  }
}

let _row: any
let clickRow: any
// 修改输入
const changeInput = (row: any, column: any, cell: HTMLTableCellElement) => {
  clickRow = row
  if (column.property === 'desc') {
    productDescription.value = row.desc
    productDescriptionVisible.value = true
  }
  if (column.property === 'priceInfo') {
    priceInformation.value = row.priceInfo
    priceInformationVisible.value = true
  }
  if (column.property === 'url1688') {
    link1688.value = row.url1688
    link1688Visible.value = true
  }

  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  _row = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')
    focusAndSelectInput(cell)
  }
}

// 产品描述的确认修改
const confirmUpdate1Dialog = async () => {
  await updateEstimatedCostAccounting({
    ...clickRow,
    desc: productDescription.value,
    tariff: clickRow.tariff / 100,
    grossMarginRate: clickRow.grossMarginRate / 100,
    roi: clickRow.roi / 100,
  })
  clickRow.desc = productDescription.value
  productDescriptionVisible.value = false
}
// 价格信息的确认修改
const confirmUpdate2Dialog = async () => {
  await updateEstimatedCostAccounting({
    ...clickRow,
    priceInfo: priceInformation.value,
    tariff: clickRow.tariff / 100,
    grossMarginRate: clickRow.grossMarginRate / 100,
    roi: clickRow.roi / 100,
  })
  clickRow.priceInfo = priceInformation.value
  priceInformationVisible.value = false
}
// 1688链接的确认修改
const confirmUpdate3Dialog = async () => {
  await updateEstimatedCostAccounting({
    ...clickRow,
    url1688: link1688.value,
    tariff: clickRow.tariff / 100,
    grossMarginRate: clickRow.grossMarginRate / 100,
    roi: clickRow.roi / 100,
  })
  clickRow.url1688 = link1688.value
  link1688Visible.value = false
}
// 相当于输入input blur事件
const clickCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    // 更新 t1 和 t2 的 class
    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(_row, value)) {
    return
  }
  if (value.tariff < 0) {
    $baseMessage('关税不能为复数！', 'error')
    value.tariff = 0
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { firstMileChannel, ...filterValue } = value
  await updateEstimatedCostAccounting({
    ...filterValue,
    tariff: value.tariff / 100,
    grossMarginRate: value.grossMarginRate / 100,
    roi: clickRow.roi / 100,
  })
  props.callParentMethod(parseInt(evaluationId.value))
}

const getCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 5) {
    return 'clear-padding'
  }
  return ''
}

// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}

// 通过事件,修改父元素的值
const handlerCloseDialog = () => {
  dflag.value = false
}

// 复制
const handlerCopyData = async (row: any) => {
  const { data } = await copyEstimatedCostAccounting({ id: `${row.id}` })
  if (data == true) {
    $baseMessage('此条产品成本核算信息复制成功!', 'success', 'hey')
    props.callParentMethod(parseInt(evaluationId.value))
  }
}

// 删除
const handlerDelete = async (row: any) => {
  $baseConfirm('您确定要删除产品成本信息吗', null, async () => {
    const { data } = await deleteEstimatedCostAccounting({ id: row.id })
    if (data == true) {
      $baseMessage('此条产品成本信息删除成功!', 'success', 'hey')
      props.callParentMethod(parseInt(evaluationId.value))
    }
  })
}

// 头程渠道修改
const handlerEstimatedChange = async (row: IEstimatedCostAccounting) => {
  await updateEstimatedCostAccountingFirstMileChannel({
    id: Number(row.id),
    channelId: row.firstMileChannel,
  })
  props.callParentMethod(parseInt(evaluationId.value))
}

// 修改站点
const handlerSiteChange = async (row: IEstimatedCostAccounting) => {
  await updateEstimatedCostAccounting({
    ...row,
    tariff: Number(row.tariff) / 100,
    grossMarginRate: Number(row.grossMarginRate) / 100,
    roi: Number(row.roi) / 100,
  })
  props.callParentMethod(parseInt(evaluationId.value))
}

// 添加到新品进度管理
const handlerProductProgress = async () => {
  const idsArr: string[] = selectRows.value.map((item: IEstimatedCostAccounting) => {
    return item.id
  })
  const ids: string = idsArr.map(String).join(',')
  try {
    const { data } = await addEstimatedCostAccountingProductRelease({ ids, evaluationId: props.evaluationId })
    if (data == true) {
      ElMessageBox({
        title: '发布成功',
        confirmButtonText: '关闭',
        showClose: false,
        showCancelButton: false,
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: () =>
          h('div', { style: 'cursor: pointer; color: #409eff;', onClick: handleClick }, { default: () => '点击此链接跳转到新品进度管理' }),
      })
    }
  } catch (error) {
    console.error(error as Error)
  }
}

// 处理MessageBox的页面跳转
const handleClick = () => {
  ElMessageBox.close()
  router.push({
    path: '/newProductDevelopment/newProductProgress',
  })
}

// 移动之后触发修改排序接口
const onEnd = debounce(async () => {
  try {
    const idList = dList.value.map((item: IEstimatedCostAccounting) => {
      return item.id
    })

    await updateEstimatedCostAccountingSort(idList)
  } catch (error_) {
    console.error(error_ as Error)
  }
}, 500)

// table checkbox事件
const handleSelectionChange = (val: IEstimatedCostAccounting[]) => {
  selectRows.value = val
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  
  const label = data.column.label
  switch (label) {
    case '产品描述': 
    case '价格信息': 
    case '1688链接':
    case '站点': {
      return {
        textAlign: 'left',
        cursor: 'pointer',
      }
    }
    case '日期': 
    case '币种': {
      return {
        textAlign: 'center',
        cursor: 'not-allowed'
      }
    }
    case '汇率': 
    case 'ROI': 
    case '平台佣金': 
    case '仓储费2个月': {
      return {
        textAlign: 'right',
        cursor: 'not-allowed'
      }
    }
  // No default
  }
  return {
    textAlign: 'center',
    cursor: 'pointer'
  }
}
// const headerCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  
//   const label = data.column.label
//   switch (label) {
//     case '产品描述': 
//     case '价格信息': 
//     case '1688链接':
//     case '日期':
//     case '外汇币种':
//     case '站点': {
//       return {
//         textAlign: 'left',
//       }
//     }
//     case '头程渠道':
//     case '操作':
//     case '图片': {
//       return {
//         textAlign: 'center',
//       }
//     }
//   // No default
//   }
//   return {
//     textAlign: 'right',
//   }
// }
</script>

<style lang="scss" scoped>
.none {
  display: none !important;
}

.block {
  display: block;
}

.ghost {
  background: #c8ebfb;
  opacity: 0.5;
}
:deep(.el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 75px;
}
.custom-tooltip {
  max-width: 650px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}
.link-tooltip {
  // max-width: 650px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}
// 图片样式
.image-cell {
  width: 100%;
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
      background: rgba(0, 0, 0, 0.45);  // 悬停时的背景色
      opacity: 1;  // 悬停时完全显示
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
