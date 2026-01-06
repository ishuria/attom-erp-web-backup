<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleStatus1Change">{{ queryForm.status === 0 ? '展示停产' : '隐藏停产' }}</el-button>
        <el-button
          v-permissions="{ permission: [SkuPermission.CUSTOM_DECLARE_RATIO_QUERY] }"
          type="primary"
          @click="showPriceCoefficientSetting"
        >
          价格系数设定
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      class="noneHoveTable"
      :data="list"
      :header-cell-style="headerCellStyle"
      :row-class-name="tableRowClassName"
      @cell-click="changeInput"
      @row-click="handleRowClick"
    >
      <el-table-column fixed="left" label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image
            fit="fill"
            :src="row.skuImgUrl"
            style="display: block; width: 75px; height: 75px"
            @click="showImagePreview(row.skuImgUrl)"
          >
            <template #error>
              <div class="image-slot">
                <el-icon />
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="SKU品名" :min-width="flexColumnWidth(list, 'SKU品名', 'sku')" prop="sku">
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.description }}
        </template>
      </el-table-column>
      <el-table-column label="UPC" :min-width="calculateBrColumnWidth(list, (row: any) => row.upc, 90)" prop="upc">
        <template #default="{ row }">
          <div v-html="row.upc"></div>
        </template>
      </el-table-column>
      <el-table-column
        label="北美FNSKU"
        :min-width="calculateBrColumnWidth(list, (row: any) => row.northAmericaFnSku, 90)"
        prop="northAmericaFnSku"
      >
        <template #default="{ row }">
          <div v-html="row.northAmericaFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="欧洲FNSKU" :min-width="calculateBrColumnWidth(list, (row: any) => row.europeFnSku, 90)" prop="europeFnSku">
        <template #default="{ row }">
          <div v-html="row.europeFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="日本FNSKU" :min-width="calculateBrColumnWidth(list, (row: any) => row.jpFnSku, 90)" prop="jpFnSku">
        <template #default="{ row }">
          <div v-html="row.jpFnSku"></div>
        </template>
      </el-table-column>
      <el-table-column label="品牌" :min-width="flexColumnWidth(list, '品牌', 'brank')" prop="brank">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.brank" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.brank }}</span>
        </template>
      </el-table-column>

      <el-table-column label="FDA申报" :min-width="flexColumnWidth(clearanceList, 'FDA申报', 'fdaFlag')" prop="fdaFlag">
        <template #default="{ row }">
          <el-checkbox v-model="row.fdaFlag" @change="changeFdaFlag(row)" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="HTS美国" width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.us"
            filterable
            placeholder="请选择HTS美国"
            @change="handleChangeHtsUsa(row)"
          >
            <el-option
              v-for="item in usaList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="HTS英国" width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.uk"
            filterable
            placeholder="请选择HTS英国"
            @change="handleChangeHtsUk(row)"
          >
            <el-option
              v-for="item in ukHtsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="HTS德国"  width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.de"
            filterable
            placeholder="请选择HTS德国"
            @change="handleChangeHtsDe(row)"
          >
            <el-option
              v-for="item in deHtsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="HTS加拿大"  width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.ca"
            filterable
            placeholder="请选择HTS加拿大"
            @change="handleChangeHtsCa(row)"
          >
            <el-option
              v-for="item in caHtsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="HTS日本" width="160" >
        <template #default="{ row }">
          <el-select
            v-model="row.hts.jp"
            filterable
            placeholder="请选择HTS日本"
            @change="handleChangeHtsJp(row)"
          >
            <el-option
              v-for="item in jpHtsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="制造商英文名称" min-width="140" prop="manufacturerEn" >
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.manufacturerEn"
              @blur="clickCancel($event, row)"
              @keydown.enter="clickCancel($event,row)"
            />
          </div>
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip" >{{ row.manufacturerEn }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.manufacturerEn }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="制造商英文地址" min-width="140" prop="manufacturerAddressEn" >
        <template #default="{ row }">
          <div class="none">
            <el-input
              v-model="row.manufacturerAddressEn"
              @blur="clickCancel($event, row)"
              @keydown.enter="clickCancel($event,row)"
            />
          </div>
          <el-tooltip content="" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip" >{{ row.manufacturerAddressEn }}</div>
            </template>
            <el-text style="vertical-align: middle;" truncated>{{ row.manufacturerAddressEn }}</el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="英文清关品名" prop="clearanceNameEn" :width="flexColumnWidth(list, '英文清关品名', 'clearanceNameEn')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.clearanceNameEn" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.clearanceNameEn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中文清关品名" prop="clearanceNameZh" :width="flexColumnWidth(list, '中文清关品名', 'clearanceNameZh')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.clearanceNameZh" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.clearanceNameZh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材质比例(英文)" prop="materialEn" :width="flexColumnWidth(list, '材质比例(英文)', 'materialEn')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.materialEn" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.materialEn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="材质比例(中文)" prop="materialZh" :width="flexColumnWidth(list, '材质比例(中文)', 'materialZh')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.materialZh" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.materialZh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途(中文)" prop="usageZh" :width="flexColumnWidth(list, '用途(中文)', 'usageZh')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.usageZh" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.usageZh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途(英文)" prop="usageEn" :width="flexColumnWidth(list, '用途(英文)', 'usageEn')" >
        <template #default="{ row }">
          <div class="none">
              <el-input v-model="row.usageEn" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.usageEn }}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" fixed="right" label="操作" width="360">
        <template #default="{ row }">
          <el-space>
          <el-link type="primary" underline="never" @click="showSkuCustomsClearance(row)">导入清关信息</el-link>
            <el-link type="primary" underline="never" @click="showFnSkuDialog(row)">FNSKU</el-link>
          <el-link type="primary" underline="never" @click="showHts(row)">查看HTS</el-link>
          <el-link type="primary" underline="never" @click="showClearance(row)">查看清关信息</el-link>
          </el-space>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 价格系数设定 -->
    <vab-dialog v-model="priceCoefficientSettingVisible" title="价格系数设定" width="47em" @close="closePriceCoefficientSetting">
      <el-form :model="priceCoefficientSettingForm">
        <el-form-item>
          <el-text>
            云舟采购单价 = PO含税单价￥ × Random（
            <el-input
              v-model="priceCoefficientSettingForm.minProcurementCoefficient"
              clearable
              placeholder="随机最小价格系数"
              style="width: 10em"
            />
            &nbsp;
            <el-input
              v-model="priceCoefficientSettingForm.maxProcurementCoefficient"
              clearable
              placeholder="随机最大价格系数"
              style="width: 10em"
            />
            ）
          </el-text>
        </el-form-item>
        <el-form-item>
          <el-text>
            云舟销售单价 = ( PO未税单价￥ ×
            <el-input v-model="priceCoefficientSettingForm.salesCoefficient1" clearable placeholder="价格系数" style="width: 6em" />
            + 预估运费 ×
            <el-input v-model="priceCoefficientSettingForm.salesCoefficient2" clearable placeholder="价格系数" style="width: 6em" />
            ) / 当前汇率
          </el-text>
        </el-form-item>
        <el-form-item>
          <el-text>
            SKU清关单价 = PO未税单价￥ / 当前汇率 ×
            <el-input
              v-model="priceCoefficientSettingForm.customClearanceCoefficient"
              clearable
              placeholder="价格系数"
              style="width: 6em"
            />
          </el-text>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="danger" @click="closePriceCoefficientSetting">取消</el-button>
          <el-button type="success" @click="confirmPriceCoefficientSetting">确定</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 查看HTS -->
    <vab-hts-dialog v-model="htsVisible" :sku-customs-declaration-id="id" />
    <!-- 查看清关信息 -->
    <vab-dialog v-model="clearanceVisible" :draggable="false" title="查看和修改清关信息" width="60%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="showAddClearance">新增</el-button>
          <el-button type="primary" @click="showBatchUpdate">批量修改</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table
        border
        :data="clearanceList"
        max-height="700"
        stripe
        @cell-click="changeInput"
        @row-click="handleRowClick"
        @selection-change="setSelectRows"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column label="国家" min-width="80" prop="countryName" />

        <el-table-column label="制造商名称" :min-width="flexColumnWidth(clearanceList, '制造商名称', 'manufacturer')" prop="manufacturer">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.manufacturer"
                @blur="clickCustomCleanCancel($event, row)"
                @keypress.enter="clickCustomCleanCancel($event, row)"
              />
            </div>
            <span>{{ row.manufacturer }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="制造商地址"
          :min-width="flexColumnWidth(clearanceList, '制造商地址', 'manufacturerAddress')"
          prop="manufacturerAddress"
        >
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.manufacturerAddress"
                @blur="clickCustomCleanCancel($event, row)"
                @keypress.enter="clickCustomCleanCancel($event, row)"
              />
            </div>
            <span>{{ row.manufacturerAddress }}</span>
          </template>
        </el-table-column>

        <el-table-column label="清关品名" :min-width="flexColumnWidth(clearanceList, '清关品名', 'clearanceName')" prop="clearanceName">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.clearanceName"
                @blur="clickCustomCleanCancel($event, row)"
                @keypress.enter="clickCustomCleanCancel($event, row)"
              />
            </div>
            <span>{{ row.clearanceName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="材质比例" :min-width="flexColumnWidth(clearanceList, '材质比例', 'material')" prop="material">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.material"
                @blur="clickCustomCleanCancel($event, row)"
                @keypress.enter="clickCustomCleanCancel($event, row)"
              />
            </div>
            <span>{{ row.material }}</span>
          </template>
        </el-table-column>

        <el-table-column label="用途" :min-width="flexColumnWidth(clearanceList, '用途', 'usage')" prop="usage">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.usage"
                @blur="clickCustomCleanCancel($event, row)"
                @keypress.enter="clickCustomCleanCancel($event, row)"
              />
            </div>
            <span>{{ row.usage }}</span>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
      <template #footer></template>
    </vab-dialog>
    <vab-dialog v-model="addClearanceVisible" title="新增" width="30%">
      <el-form ref="addClearanceFormRef" label-position="top" :model="addClearanceForm" :rules="addClearanceFormRules">
        <el-form-item label="国家" prop="countryIds">
          <el-select v-model="addClearanceForm.countryIds" multiple placeholder="请选择国家">
            <el-option v-for="item in countryList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="制造商名称" prop="manufacturer">
          <el-input v-model="addClearanceForm.manufacturer" clearable />
        </el-form-item>
        <el-form-item label="制造商地址" prop="manufacturerAddress">
          <el-input v-model="addClearanceForm.manufacturerAddress" clearable />
        </el-form-item>
        <el-form-item label="清关品名" prop="clearanceName">
          <el-input v-model="addClearanceForm.clearanceName" clearable />
        </el-form-item>
        <el-form-item label="材质比例" prop="material">
          <el-input v-model="addClearanceForm.material" clearable />
        </el-form-item>
        <el-form-item label="用途" prop="usage">
          <el-input v-model="addClearanceForm.usage" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeAddClearance">取消</el-button>
        <el-button type="primary" @click="confirmAddClearance">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 批量修改 -->
    <vab-dialog v-model="batchUpdateVisible" title="批量修改" width="30%">
      <el-form ref="batchUpdateFormRef" label-position="top" :model="batchUpdateForm">
        <el-form-item label="制造商名称" prop="manufacturer">
          <el-input v-model="batchUpdateForm.manufacturer" clearable />
        </el-form-item>
        <el-form-item label="制造商地址" prop="manufacturerAddress">
          <el-input v-model="batchUpdateForm.manufacturerAddress" clearable />
        </el-form-item>
        <el-form-item label="清关品名" prop="clearanceName">
          <el-input v-model="batchUpdateForm.clearanceName" clearable />
        </el-form-item>
        <el-form-item label="材质比例" prop="material">
          <el-input v-model="batchUpdateForm.material" clearable />
        </el-form-item>
        <el-form-item label="用途" prop="usage">
          <el-input v-model="batchUpdateForm.usage" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeBatchUpdate">取消</el-button>
        <el-button type="primary" @click="confirmBatchUpdate">确定</el-button>
      </template>
    </vab-dialog>

    <!-- 导入sku清关信息 -->
    <sku-customs-clearance-component v-model="skuCustomsClearanceVisible" :targetCustomClearnId="targetId" />
    <!-- FNSKU修改弹窗 -->
    <fn-sku-dialog v-model="fnSkuDialogVisible" :row-data="currentFnSkuRow" @success="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, TableInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { ref } from 'vue'
import {
  addCustomsClearanceSkuInfo,
  getCustomsClearanceCountryList,
  getCustomsClearanceRatio,
  getCustomsClearanceSkuInfo,
  getCustomsClearanceSkuList,
  getHtsSelectList,
  updateCustomsClearanceRatio,
  updateCustomsClearanceSku,
  updateCustomsClearanceSkuHts,
  updateCustomsClearanceSkuInfo,
  updateCustomsClearanceSkuInfoSign,
} from '/@/api/devlocal/productInformation'
import SkuPermission from '/@/permissions/sku'
import { IGetCustomsClearanceSkuInfo } from '/@/type/productInformation/skuInformationType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'SkuDeclaration',
})

const getHtsName = (hsId: number, htsList: any[]) => {
  if (!hsId || !htsList) return ''
  const hts = htsList.find((item: any) => item.id === hsId)
  return hts ? hts.label : ''
}
const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.id
}
const tableRowClassName = ({ row }: { row: any }) => {
  if (row.id === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}
const router = useRouter()
const route = useRoute()
const skuCustomsClearanceVisible = ref<boolean>(false)
const ukHtsList = ref<{ id: number; label: string }[]>([])
const deHtsList = ref<{ id: number; label: string }[]>([])
const caHtsList = ref<{ id: number; label: string }[]>([])
const jpHtsList = ref<{ id: number; label: string }[]>([])
const usaList = ref<{ id: number; label: string }[]>([])
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  status: 1, //隐藏停产0，展示停产1
  pageNo: 1,
  pageSize: 20,
})
const htsVisible = ref<boolean>(false)
const htsForm = reactive<any>({})
const clearanceVisible = ref<boolean>(false)
const clearanceList = ref<IGetCustomsClearanceSkuInfo[]>([])
let skuCustomId = -1
const showClearance = async (row: any) => {
  clearanceVisible.value = true
  skuCustomId = row.id
  const { data } = await getCustomsClearanceSkuInfo({ skuCustomId })
  clearanceList.value = data
}
const addClearanceVisible = ref<boolean>(false)
const addClearanceForm = reactive<any>({
  countryIds: [],
})
const addClearanceFormRef = ref<FormInstance>()
const addClearanceFormRules = reactive<any>({
  countryIds: [{ required: true, message: '请选择国家', trigger: 'change' }],
})
const countryList = ref<{ id: number; label: string }[]>([])
const showAddClearance = async () => {
  const { data } = await getCustomsClearanceCountryList()
  countryList.value = data
  addClearanceVisible.value = true
}
let id = -1
const showHts = async (row: any) => {
  id = row.id
  htsVisible.value = true
}

// 导入清关信息
const targetId = ref<number>(0)
const showSkuCustomsClearance = (val: any) => {
  skuCustomsClearanceVisible.value = true
  targetId.value = val.id
}

// FNSKU修改弹窗
const fnSkuDialogVisible = ref<boolean>(false)
const currentFnSkuRow = ref<
  | {
      sku?: string
      northAmericaFnSku?: string
      europeFnSku?: string
      jpFnSku?: string
    }
  | undefined
>(undefined)
const showFnSkuDialog = (row: any) => {
  currentFnSkuRow.value = {
    sku: row.sku,
    northAmericaFnSku: row.northAmericaFnSku || '',
    europeFnSku: row.europeFnSku || '',
    jpFnSku: row.jpFnSku || '',
  }
  fnSkuDialogVisible.value = true
}

const closeAddClearance = () => {
  addClearanceVisible.value = false
  addClearanceForm.countryIds = []
}
const confirmAddClearance = async () => {
  addClearanceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const { data } = await addCustomsClearanceSkuInfo({
        ...addClearanceForm,
        skuClearanceId: skuCustomId,
        countryIds: addClearanceForm.countryIds.join(','),
      })
      if (data) {
        $baseMessage('新增成功！', 'success')
        addClearanceVisible.value = false
        const { data } = await getCustomsClearanceSkuInfo({ skuCustomId })
        clearanceList.value = data
      }
    }
  })
}
const batchUpdateVisible = ref<boolean>(false)
const selectRows = ref<any>([])
const setSelectRows = (value: any) => {
  selectRows.value = value
}
const batchUpdateForm = reactive<any>({
  manufacturer: '',
  manufacturerAddress: '',
  clearanceName: '',
  material: '',
  usage: '',
})
const batchUpdateFormRef = ref<FormInstance>()
const showBatchUpdate = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('请选择要修改的行！', 'warning')
    return
  } else if (selectRows.value.length === 1) {
    Object.assign(batchUpdateForm, selectRows.value[0])
  } else {
    batchUpdateFormRef.value?.resetFields()
  }
  batchUpdateVisible.value = true
}
const closeBatchUpdate = () => {
  batchUpdateVisible.value = false
}
const confirmBatchUpdate = async () => {
  const { data } = await updateCustomsClearanceSkuInfo({
    ids: selectRows.value.map((item: any) => item.id).join(','),
    ...batchUpdateForm,
  })
  if (data) {
    $baseMessage('修改成功！', 'success')
    batchUpdateVisible.value = false
    const { data } = await getCustomsClearanceSkuInfo({ skuCustomId })
    clearanceList.value = data
  }
}
// 价格系数设定
const priceCoefficientSettingVisible = ref<boolean>(false)
const priceCoefficientSettingForm = reactive<any>({})

const handleChangeHtsUsa = async () => {
  await updateCustomsClearanceSkuHts({
    id: id,
    htsId: htsForm.us,
    type: 0,
  })
}
const handleChangeHtsUk = async () => {
  await updateCustomsClearanceSkuHts({
    id: id,
    htsId: htsForm.uk,
    type: 1,
  })
}

const handleChangeHtsDe = async () => {
  await updateCustomsClearanceSkuHts({
    id: id,
    htsId: htsForm.de,
    type: 2,
  })
}

const handleChangeHtsCa = async () => {
  await updateCustomsClearanceSkuHts({
    id: id,
    htsId: htsForm.ca,
    type: 3,
  })
}

const handleChangeHtsJp = async () => {
  await updateCustomsClearanceSkuHts({
    id: id,
    htsId: htsForm.jp,
    type: 4,
  })
}

// 打开价格系数设定
const showPriceCoefficientSetting = async () => {
  priceCoefficientSettingVisible.value = true
  const { data } = await getCustomsClearanceRatio()
  Object.assign(priceCoefficientSettingForm, data)
}
// 关闭价格系数设定
const closePriceCoefficientSetting = () => {
  priceCoefficientSettingVisible.value = false
}
// 确认价格系数
const confirmPriceCoefficientSetting = async () => {
  const { data } = await updateCustomsClearanceRatio({
    minProcurementCoefficient: priceCoefficientSettingForm.minProcurementCoefficient,
    maxProcurementCoefficient: priceCoefficientSettingForm.maxProcurementCoefficient,
    salesCoefficient1: priceCoefficientSettingForm.salesCoefficient1,
    salesCoefficient2: priceCoefficientSettingForm.salesCoefficient2,
    customClearanceCoefficient: priceCoefficientSettingForm.customClearanceCoefficient,
  })
  if (data) {
    $baseMessage('价格系数修改成功', 'success')
    closePriceCoefficientSetting()
  }
}

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const showImagePreview = (url: string) => {
  imagePreviewList.value = []
  imagePreviewVisible.value = true
  imagePreviewList.value.push(url)
}
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}
const handleStatus1Change = async () => {
  queryForm.status === 0 ? (queryForm.status = 1) : (queryForm.status = 0)
  fetchData()
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['SKU品名', 'UPC', '北美FNSKU', '欧洲FNSKU', '日本FNSKU'].includes(label)) {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign: 'left',
    }
  } else {
    return {
      textAlign: 'center',
      cursor: 'pointer',
    }
  }
}
const headerCellStyle = (): CSSProperties => {
  return {
    textAlign: 'center',
  }
}
let copyRow: any
// table单击修改
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}

const changeFdaFlag = async (value: any) => {
  // 执行失去焦点处理逻辑
  try {
    const { data } = await updateCustomsClearanceSku({
      id: value.id,
      brank: value.brank,
      manufacturerEn: value.manufacturerEn,
      manufacturerAddressEn: value.manufacturerAddressEn,
      clearanceNameEn: value.clearanceNameEn,
      clearanceNameZh: value.clearanceNameZh,
      materialEn: value.materialEn,
      materialZh: value.materialZh,
      usageEn: value.usageEn,
      usageZh: value.usageZh,
      fdaFlag: value.fdaFlag,
    })

    if (data) {
      $baseMessage('修改成功！', 'success')
    }
  } catch {
    Object.assign(value, copyRow)
  }
}

// 零件table blur事件
const clickCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')
  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }

  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      await updateCustomsClearanceSku({
        id: value.id,
        brank: value.brank,
        manufacturerEn: value.manufacturerEn,
        manufacturerAddressEn: value.manufacturerAddressEn,
        clearanceNameEn: value.clearanceNameEn,
        clearanceNameZh: value.clearanceNameZh,
        materialEn: value.materialEn,
        materialZh: value.materialZh,
        usageEn: value.usageEn,
        usageZh: value.usageZh,
        fdaFlag: value.fdaFlag,
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
}

const clickCustomCleanCancel = async (event: any, value: any) => {
  console.log(event)
  const rootElement = getRootElement(event.srcElement, '.cell')
  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }

  if (event.type === 'blur') {
    try {
      const { data } = await updateCustomsClearanceSkuInfoSign({
        ids: value.id,
        clearanceName: value.clearanceName,
        manufacturer: value.manufacturer,
        manufacturerAddress: value.manufacturerAddress,
        material: value.material,
        usage: value.usage,
      })
      if (data) {
        $baseMessage('修改成功！', 'success')
        const { data } = await getCustomsClearanceSkuInfo({ skuCustomId })
        clearanceList.value = data
      }
    } catch {
      Object.assign(value, copyRow)
    }
  }
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCustomsClearanceSkuList(queryForm)
  list.value = data!.list
  total.value = data!.total!
  listLoading.value = false
  list.value.forEach((item: any) => {
    item.sku = item.sku.replaceAll(',', '<br />')
    item.northAmericaFnSku = item.northAmericaFnSku.replaceAll(',', '<br />')
    item.upc = item.upc.replaceAll(',', '<br />')
    item.europeFnSku = item.europeFnSku.replaceAll(',', '<br />')
  })
}
const cellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
// 获取HTS欧洲列表
const fetchHtsUkList = async () => {
  const { data } = await getHtsSelectList({ country: '英国' })
  ukHtsList.value = data
}
// 获取HTS美国列表
const fetchHtsUsaList = async () => {
  const { data } = await getHtsSelectList({ country: '美国' })
  usaList.value = data
}
const fetchHtsDeList = async () => {
  const { data } = await getHtsSelectList({ country: '德国' })
  deHtsList.value = data
}
const fetchHtsCaList = async () => {
  const { data } = await getHtsSelectList({ country: '加拿大' })
  caHtsList.value = data
}
const fetchHtsJpList = async () => {
  const { data } = await getHtsSelectList({ country: '日本' })
  jpHtsList.value = data
}
onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) queryForm.pageNo = Number(pageNo)
  if (pageSize) queryForm.pageSize = Number(pageSize)
  fetchHtsUkList()
  fetchHtsUsaList()
  fetchHtsDeList()
  fetchHtsCaList()
  fetchHtsJpList()
  fetchData()
})
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}

.custom-checkbox {
  transform: scale(1.4); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
// /* 取消没有条纹的行的悬停背景色 */
// :deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
//   background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
// }

// /* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
// :deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
//   background-color: #fafafa !important; /* 保持原有条纹颜色 */
// }
.el-table :deep(.clear-padding) {
  padding-top: 0;
  padding-bottom: 0;
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0;
  padding-left: 0;
}
:deep(.el-checkbox) {
  transform: scale(1.3);
}
.el-table :deep(.select-row > td) {
  background-color: #7bddde !important;
}
/* 供应商选择容器样式 */
.hts-select-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.copy-btn {
  flex-shrink: 0;
}
</style>
