<template>
  <div class="cost-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <vab-card class="card1" style="height: 400px" title="支出构成">
          <el-row>
            <el-col :span="9">
              <!-- <span style="font-weight: 600;">支出构成</span> -->
              <div ref="chartContainer1" style="width: 100%; height: 345px"></div>
            </el-col>
            <el-col :span="15">
              <el-table :data="percentageData" :header-cell-style="headerCellStyle" max-height="325">
                <el-table-column fixed="left" label="项目" min-width="170" prop="name">
                  <template #default="{ row, $index }">
                    <span class="table-item" :style="{ '--dot-color': colorList[$index] }">
                      {{ row.name }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="金额" min-width="60" prop="value">
                  <template #default="{ row }">${{ row.value }}</template>
                </el-table-column>
                <el-table-column align="right" label="占比" min-width="90" prop="percentage" />
              </el-table>
            </el-col>
          </el-row>
        </vab-card>
      </el-col>
      <el-col :span="8">
        <vab-card class="card2" style="height: 400px" title="库龄">
          <div style="margin-bottom: 15px; text-align: right">
            <el-radio-group v-model="ageRadio" size="small" @change="handleSwitchBar">
              <el-radio-button label="数量" :value="0" />
              <el-radio-button label="占比" :value="1" />
            </el-radio-group>
          </div>
          <el-row>
            <el-col :span="9">
              <div ref="chartContainer2" style="width: 100%; height: 322px"></div>
            </el-col>
            <el-col :span="15">
              <el-table :data="percentageAgeData" :header-cell-style="headerCellStyle" max-height="325" show-summary>
                <el-table-column label="项目" min-width="110" prop="name">
                  <template #default="{ row, $index }">
                    <span class="table-item" :style="{ '--dot-color': storageAgeColorList[$index] }">
                      {{ row.name }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column v-if="ageRadio === 0" align="right" label="FBA仓" min-width="90" prop="value" />
                <el-table-column v-if="ageRadio === 1" align="right" label="FBA仓" min-width="90" prop="percentage">
                  <template #default="{ row }">{{ row.percentage }}%</template>
                </el-table-column>
                <el-table-column label="预估下月费用" min-width="120" />
              </el-table>
            </el-col>
          </el-row>
        </vab-card>
      </el-col>
      <el-col :span="8">
        <vab-card class="card3" style="height: 150px">
          <el-container style="display: flex; gap: 10px; align-items: center">
            <el-aside style="width: 2.5em">
              <el-text style="letter-spacing: 0.3em; writing-mode: vertical-lr">包装信息</el-text>
            </el-aside>
            <!-- 内容 -->
            <el-main style="flex: 1; padding: 0">
              <div class="grid-container">
                <div class="grid-item">
                  <el-tooltip
                    content="亚马逊产品包装尺寸"
                    :disabled="isOverflow"
                    effect="dark"
                    placement="top"
                    popper-style="font-size: var(--el-font-size-base)"
                  >
                    <div class="grid-title" @mouseenter="tooltipIsDisHandler($event)">亚马逊产品包装尺寸</div>
                  </el-tooltip>
                  <el-tooltip
                    content="20×10×2.0 cm"
                    :disabled="isOverflow"
                    effect="dark"
                    placement="top"
                    popper-style="font-size: var(--el-font-size-base)"
                  >
                    <div class="grid-value" @mouseenter="tooltipIsDisHandler($event)">20×10×2.0 cm</div>
                  </el-tooltip>
                </div>
                <div class="grid-item" data-label="amazon">
                  <el-tooltip
                    content="自量产品包装尺寸"
                    :disabled="isOverflow"
                    effect="dark"
                    placement="top"
                    popper-style="font-size: var(--el-font-size-base)"
                  >
                    <div class="grid-title" @mouseenter="tooltipIsDisHandler($event)">自量产品包装尺寸</div>
                  </el-tooltip>
                  <el-tooltip
                    content="20×10×1.0 cm"
                    :disabled="isOverflow"
                    effect="dark"
                    placement="top"
                    popper-style="font-size: var(--el-font-size-base)"
                  >
                    <div class="grid-value" @mouseenter="tooltipIsDisHandler($event)">20×10×1.0 cm</div>
                  </el-tooltip>
                </div>
                <div class="grid-item">
                  <el-tooltip
                    content="重量 (自量/亚马逊)"
                    :disabled="isOverflow"
                    effect="dark"
                    placement="top"
                    popper-style="font-size: var(--el-font-size-base)"
                  >
                    <div class="grid-title" @mouseenter="tooltipIsDisHandler($event)">重量 (自量/亚马逊)</div>
                  </el-tooltip>
                  <el-tooltip
                    content="200g / 300g"
                    :disabled="isOverflow"
                    effect="dark"
                    placement="top"
                    popper-style="font-size: var(--el-font-size-base)"
                  >
                    <div class="grid-value" @mouseenter="tooltipIsDisHandler($event)">200g / 300g</div>
                  </el-tooltip>
                </div>
                <div class="grid-item" data-label="fba">
                  <el-tooltip
                    content="FBA (自量/亚马逊)"
                    :disabled="isOverflow"
                    effect="dark"
                    placement="top"
                    popper-style="font-size: var(--el-font-size-base)"
                  >
                    <div class="grid-title" @mouseenter="tooltipIsDisHandler($event)">FBA (自量/亚马逊)</div>
                  </el-tooltip>
                  <el-tooltip
                    content="$5.4 / $4.9"
                    :disabled="isOverflow"
                    effect="dark"
                    placement="top"
                    popper-style="font-size: var(--el-font-size-base)"
                  >
                    <div class="grid-value" @mouseenter="tooltipIsDisHandler($event)">
                      <span class="grid-value-green">$5.4</span>
                      /
                      <span>$4.9</span>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </el-main>
            <!-- 右侧图片 -->
            <el-aside :style="{ maxWidth: imageHeight + 'px', padding: '0' }">
              <el-image src="https://picsum.photos/200/200" style="display: block; border-radius: 10px">
                <template #error><el-icon /></template>
              </el-image>
            </el-aside>
          </el-container>
        </vab-card>
        <vab-card class="card4" style="position: relative; height: 240px">
          <div ref="chartContainer3" style="width: 100%; height: 240px"></div>
          <div v-if="!dateRangeSelectVisible" style="position: absolute; top: 5px; right: 5px">
            <el-select v-model="card4Select" placeholder="请选择日期" size="default" style="max-width: 5em" @change="handleCard4Select">
              <el-option v-for="item in card4Option" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div v-if="dateRangeSelectVisible" style="position: absolute; top: 5px; right: 5px; display: flex; align-items: center">
            <el-date-picker
              v-model="card4DateRange"
              :clearable="false"
              :editable="false"
              size="default"
              style="max-width: 13em"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="handleCard4DateSelect"
            />
            <el-icon class="custom-cancel" color="#999" @click="handleClickCancel"><circle-close /></el-icon>
          </div>
        </vab-card>
      </el-col>
    </el-row>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item>
            <el-text>产品成本核算</el-text>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleOpenAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table border :cell-style="cellStyle" :data="list" :header-cell-style="{ textAlign: 'center' }" @cell-click="cellClick">
      <el-table-column label="日期" min-width="115" prop="createTime" />
      <el-table-column label="站点" min-width="175" prop="site">
        <template #default="{ row }">
          <el-select v-model="row.site" placeholder="请选择站点" style="min-width: 100%" @change="handleUpdateList(row)">
            <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="外汇币种" min-width="100" prop="currencyType" />
      <el-table-column label="汇率" min-width="90" prop="foreignExchange" />
      <el-table-column label="产品价格¥" min-width="110" prop="price">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.price" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.price != null ? '￥' + row.price : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="长(cm)" min-width="90" prop="length">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.length" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.length != null ? row.length + 'cm' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽(cm)" min-width="90" prop="width">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.width" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.width != null ? row.width + 'cm' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高(cm)" min-width="90" prop="height">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.height" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.height != null ? row.height + 'cm' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" min-width="100" prop="weight">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.weight" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.weight != null ? row.weight + 'g' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下一档位" min-width="200" prop="nextGear">
        <template #default="{ row }">
          <span v-html="row.nextGear"></span>
        </template>
      </el-table-column>
      <el-table-column label="尺寸/尾程来源" min-width="150" prop="sizeSource">
        <template #default="{ row }">
          <el-select v-model="row.sizeSource" style="min-width: 100%" @change="handleUpdateList(row)">
            <el-option v-for="item in sizeSourceOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="尾程" min-width="80" prop="lastMile">
        <template #default="{ row }">
          <div v-if="row.sizeSource === 0" class="none">
            <el-input v-model="row.lastMile" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.lastMile != null ? row.symbol + row.lastMile : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打包¥" min-width="100" prop="packaging">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.packaging" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.packaging != null ? '￥' + row.packaging : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头程¥" min-width="100" prop="firstMile">
        <template #default="{ row }">
          {{ row.firstMile != null ? '￥' + row.firstMile : '' }}
        </template>
      </el-table-column>
      <el-table-column label="头程渠道" min-width="150" prop="firstMileChannel">
        <template #default="{ row }">
          <el-select v-model="row.firstMileChannel" placeholder="请选择头程渠道" style="min-width: 100%" @change="handleUpdateList(row)">
            <el-option v-for="item in channelList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="售价" min-width="100" prop="sellingPrice">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.sellingPrice" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.sellingPrice != null ? row.symbol + row.sellingPrice : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毛利率" min-width="100" prop="grossMarginRate">
        <template #default="{ row }">
          <el-text v-if="row.grossMarginRate >= 30" type="success">{{ row.grossMarginRate + '%' }}</el-text>
          <el-text v-if="row.grossMarginRate >= 25 && row.grossMarginRate < 30" type="primary">{{ row.grossMarginRate + '%' }}</el-text>
          <el-text v-if="row.grossMarginRate >= 20 && row.grossMarginRate < 25" type="warning">{{ row.grossMarginRate + '%' }}</el-text>
          <el-text v-if="row.grossMarginRate < 20" type="danger">
            {{ row.grossMarginRate != null ? row.grossMarginRate + '%' : '' }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="ROI" min-width="90" prop="roi">
        <template #default="{ row }">
          {{ row.roi != null ? row.roi + '%' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="重量系数" min-width="100" prop="weightCoefficient">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.weightCoefficient" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.weightCoefficient }}</span>
        </template>
      </el-table-column>
      <el-table-column label="体积系数" min-width="100" prop="volumeCoefficient">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.volumeCoefficient" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.volumeCoefficient }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关税%" min-width="100" prop="tariff">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.tariff" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.tariff != null ? row.tariff + '%' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关税" min-width="100" prop="tariffPrice">
        <template #default="{ row }">
          <span>{{ row.tariffPrice != null ? '￥' + row.tariffPrice : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VAT" min-width="100" prop="vat">
        <template #default="{ row }">
          <span>{{ row.vat != null ? row.vat + '%' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台佣金" min-width="100" prop="platformCommission">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.platformCommission" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.platformCommission != null ? row.symbol + row.platformCommission.toFixed(2) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓储费2个月" min-width="140" prop="storageFee">
        <template #default="{ row }">
          <div class="none">
            <el-input v-model="row.storageFee" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
          </div>
          <span>{{ row.storageFee != null ? row.symbol + Number(row.storageFee).toFixed(2) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="110">
        <template #default="{ row, $index }">
          <el-dropdown>
            <el-button text type="primary" @click="handleReverseCalc(row.id)">
              逆算
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleReverseCalc(row.id)">
                  <el-link type="primary" underline="never">逆算</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleCopy(row.id)">
                  <el-link type="primary" underline="never">复制</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleDelete(row.id, $index)">
                  <el-link type="danger" underline="never">删除</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
    <!-- 新增 -->
    <vab-dialog v-model="addVisible" title="新增" width="20%">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" style="width: 100%">
        <el-form-item label="站点" prop="site">
          <el-select v-model="addForm.site" placeholder="请选择站点">
            <el-option v-for="item in siteAddList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseAdd">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, CircleClose } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { FormInstance, FormRules } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { card4Option, colorList, sizeSourceOption, storageAgeColorList } from '../constantOption'
import { getChannelList } from '/@/api/devlocal/encasement'
import { getSalesSiteList } from '/@/api/devlocal/evaluation'
import {
  addOperationAmazonCost,
  copyOperationAmazonCost,
  deleteOperationAmazonCost,
  getOperationAmazonCostList,
  reverseCalcOperationAmazonCost,
  updateOperationAmazonCost,
} from '/@/api/devlocal/productAnalysis'
import type { IGetOperationAmazonCostList, IGetOperationAmazonCostListReq } from '/@/type/storeOperation/productAnalysisType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'VabCostAnalysis',
})

const props = defineProps<{ sku: string }>()
watch(
  () => props.sku,
  () => {
    fetchData()
  },
  { immediate: false }
)
// 新增弹窗
const addVisible = ref<boolean>(false)
const addForm = reactive<any>({
  site: '',
})
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<FormRules>({
  site: [{ required: true, message: '请选择站点', trigger: 'change' }],
})
const list = ref<IGetOperationAmazonCostList[]>([])
const total = ref<number>(0)
const queryForm = reactive<IGetOperationAmazonCostListReq>({
  sku: '',
  pageNo: 1,
  pageSize: 20,
})

const isOverflow = ref(false)
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
const chartContainer3 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartInstance3: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
let chartObserver3: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({})
const option3 = ref<any>({})

const data1 = ref<any[]>([
  { value: 300, name: '平台费' },
  { value: 600, name: 'FBA发货费' },
  { value: 50, name: '其他订单费用' },
  { value: 150, name: '广告费' },
  { value: 100, name: '推广费' },
  { value: 120, name: 'FBA仓储费' },
  { value: 200, name: 'FBA国际物流运费' },
  { value: 30, name: '调整费用' },
  { value: 40, name: '平台其他费' },
  { value: 60, name: '其他费用' },
  { value: 500, name: '头程成本' },
  { value: 100, name: '其他成本' },
  { value: 800, name: '采购成本' },
  { value: -20, name: '市场税退款额' },
  { value: 70, name: '市场税' },
  { value: -10, name: '销售税退款额' },
  { value: 90, name: '销售税' },
])
const data2 = ref<any[]>([
  { name: '0-90', value: 11800 },
  { name: '91-180', value: 2644 },
  { name: '181-270+', value: 1175 },
  { name: '271-365', value: 152 },
  { name: '365+', value: 293 },
])
const data3 = ref<any[]>([
  { date: '2024-12-20', sku: 100, fba: 90, cost: 80, freight: 70 },
  { date: '2024-12-21', sku: 120, fba: 95, cost: 85, freight: 75 },
  { date: '2024-12-22', sku: 110, fba: 92, cost: 82, freight: 72 },
  { date: '2024-12-23', sku: 130, fba: 98, cost: 88, freight: 78 },
  { date: '2024-12-24', sku: 105, fba: 87, cost: 79, freight: 68 },
  { date: '2024-12-25', sku: 115, fba: 93, cost: 83, freight: 73 },
])

const ageRadio = ref<number>(0)
const imageHeight = ref<number>(0)
const card4Select = ref<number>(0)
// 日期选择框是否可见
const dateRangeSelectVisible = ref<boolean>(false)
const card4DateRange = ref<[string, string]>(['', ''])
// 计算总和
const totalValue = data1.value.reduce((sum, item) => sum + item.value, 0)
// 计算库龄总和
const totalAgeValue = data2.value.reduce((sum, item) => sum + item.value, 0)
const formattedTotalValue = totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
// 计算占比
const percentageData = data1.value.map((item) => ({
  ...item,
  percentage: `${((item.value / totalValue) * 100).toFixed(2)}%`,
}))
let percentageAgeData: any[]
let copyRow: any

// 修改产品核算的站点
const handleUpdateList = async (row: IGetOperationAmazonCostList) => {
  const { data } = await updateOperationAmazonCost({
    ...row,
    grossMarginRate: Number(row.grossMarginRate) / 100,
    roi: Number(row.roi) / 100,
    tariff: Number(row.tariff) / 100,
  })
  if (data) {
    fetchData()
  }
}
// 确定新增
const handleConfirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addOperationAmazonCost({
        sku: props.sku,
        site: addForm.site,
      })
      if (data) {
        $baseMessage('新增成功！', 'success')
        handleCloseAdd()
        fetchData()
      }
    }
  })
}
// 关闭新增弹窗
const handleCloseAdd = () => {
  addVisible.value = false
}
// 打开新增弹窗
const handleOpenAdd = () => {
  addVisible.value = true
  addForm.site = ''
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
// 产品核算的复制
const handleCopy = async (id: number) => {
  $baseConfirm('确定要复制吗？', null, async () => {
    const { data } = await copyOperationAmazonCost({ id })
    if (data) {
      $baseMessage('复制成功！', 'success')
      fetchData()
    }
  })
}
// 产品核算的删除
const handleDelete = async (id: number, index: number) => {
  $baseConfirm('确定要删除吗？', null, async () => {
    const { data } = await deleteOperationAmazonCost({ id })
    if (data) {
      $baseMessage('删除成功！', 'success')
      list.value.splice(index, 1)
    }
  })
}
// 产品核算的逆算
const handleReverseCalc = async (id: number) => {
  const { data } = await reverseCalcOperationAmazonCost({ id })
  if (data) {
    $baseMessage('逆算成功！', 'success')
    fetchData()
  }
}
const handleCard4Select = () => {
  if (card4Select.value === 4) {
    dateRangeSelectVisible.value = true
    option3.value.legend.data = ['SKU实际价格', 'FBA配送费', '', '打包成本', '头程运费']
    option3.value.grid.top = 60
    updateChart3()
  }
}
const handleCard4DateSelect = () => {}
const handleClickCancel = () => {
  card4Select.value = 0
  dateRangeSelectVisible.value = false
  option3.value.legend.data = ['SKU实际价格', 'FBA配送费', '打包成本', '头程运费']
  option3.value.grid.top = 40
  updateChart3()
}
// 切换是百分比还是数量
const handleSwitchBar = () => {
  const threshold = 10
  if (ageRadio.value === 0) {
    option2.value.series.forEach((seriesItem: any, index: number) => {
      const value = percentageAgeData[4 - index].value
      const percentage = percentageAgeData[4 - index].percentage
      seriesItem.data = [value]
      if (percentage > threshold) {
        seriesItem.label = {
          show: false,
        }
      }
    })
    option2.value.yAxis.axisLabel = {}
  } else if (ageRadio.value === 1) {
    option2.value.series.forEach((seriesItem: any, index: number) => {
      const percentage = percentageAgeData[4 - index].percentage
      seriesItem.data = [percentage]
      seriesItem.label = {
        show: percentage > threshold, // 当占比大于阈值时显示比例
        formatter: (params: any) => `${params.value}%`,
      }
    })
    option2.value.yAxis.axisLabel = {
      formatter: '{value}%',
    }
  }
  updateChart2()
}

const initChart1 = () => {
  option1.value = {
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">支出构成</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''

        // 计算销售额的百分比
        itemHtmlStrArr = `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.data.name}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">$${params.data.value} (${params.percent}%)</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
    },
    series: [
      {
        name: '支出构成',
        type: 'pie',
        radius: ['50%', '80%'],
        left: 0,
        right: 0,
        // avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true, // 始终显示
          position: 'center',
          formatter: [`{a|${formattedTotalValue}}`, '{b|总支出}'].join('\n'), // 设置显示的文字
          rich: {
            a: {
              color: '#000',
              fontSize: 17,
              fontWeight: 550,
              lineHeight: 28,
            },
            b: {
              color: '#999',
              fontSize: 14,
              lineHeight: 20,
            },
          },
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        labelLine: {
          show: false,
        },
        data: data1.value,
        color: colorList,
      },
    ],
  }
  chartInstance1?.setOption(option1.value)
}
const initChart2 = () => {
  option2.value = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // tooltip标题
        let titleHtmlStr = `<div style="font-size: var(--el-font-size-base);color: #666;line-height: 1;">库龄</div>`

        // tooltip详情内容
        let itemHtmlStrArr = ''

        itemHtmlStrArr = `<div style="display: flex;align-items:center;">
          ${params.marker}
          <div style="font-size: var(--el-font-size-base);color: #666;margin: 0 10px 0 2px;">${params.seriesName}: </div>
          <span style="margin-left: auto;text-align: right;font-size: var(--el-font-size-base);font-weight: 900;">${ageRadio.value === 0 ? '$' : ''}${params.value}${ageRadio.value === 1 ? '%' : ''}</span>
        </div>`

        const contentHtmlStr = `<div style="display: flex;flex-direction: column;margin-top: 10px;">
          ${itemHtmlStrArr}
        </div>`
        // 最终html字符串
        const resHtmlStr = titleHtmlStr + contentHtmlStr
        return resHtmlStr
      },
      confine: true,
    },
    grid: {
      top: 10,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['FBA仓'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
      axisLabel: {
        fontSize: '14px',
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.1], // 为顶部留出空间
    },
    series: [
      {
        name: '365+',
        type: 'bar',
        stack: '总量',
        data: [data2.value[4].value],
        itemStyle: {
          color: storageAgeColorList[4],
        },
        emphasis: {
          focus: 'series',
        },
      },
      {
        name: '271-365',
        type: 'bar',
        stack: '总量',
        data: [data2.value[3].value],
        itemStyle: {
          color: storageAgeColorList[3],
        },
        emphasis: {
          focus: 'series',
        },
      },
      {
        name: '181-270+',
        type: 'bar',
        stack: '总量',
        data: [data2.value[2].value],
        itemStyle: {
          color: storageAgeColorList[2],
        },
        emphasis: {
          focus: 'series',
        },
      },
      {
        name: '91-180',
        type: 'bar',
        stack: '总量',
        data: [data2.value[1].value],
        itemStyle: {
          color: storageAgeColorList[1],
        },
        emphasis: {
          focus: 'series',
        },
      },
      {
        name: '0-90',
        type: 'bar',
        stack: '总量',
        barWidth: '40%',
        data: [data2.value[0].value],
        itemStyle: {
          color: storageAgeColorList[0],
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }
  chartInstance2?.setOption(option2.value)
}
// 获取 CSS 变量的值
const fontSizeBase = getComputedStyle(document.documentElement).getPropertyValue('--el-font-size-base').trim()
const initChart3 = () => {
  option3.value = {
    legend: {
      icon: 'circle',
      left: 0,
      top: 5,
      textStyle: {
        fontSize: parseInt(fontSizeBase) - 1,
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 5,
      data: ['SKU实际价格', 'FBA配送费', '打包成本', '头程运费'],
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    grid: {
      top: 50,
      bottom: 5,
      left: 10,
      right: 10,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data3.value.map((item) => item.date),
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        fontSize: parseInt(fontSizeBase) - 1,
      },
    },
    yAxis: {
      type: 'value',
      min: 'dataMin', // 自动以数据中的最小值为起点
      boundaryGap: [0, 0.1],
      axisLabel: {
        fontSize: parseInt(fontSizeBase) - 1,
      },
    },
    series: [
      {
        name: 'SKU实际价格',
        type: 'line',
        data: data3.value.map((item) => item.sku),
        itemStyle: {
          color: storageAgeColorList[4],
        },
        smooth: true,
        symbol: 'none',
        // symbolSize: 6,
      },
      {
        name: 'FBA配送费',
        type: 'line',
        data: data3.value.map((item) => item.fba),
        itemStyle: {
          color: storageAgeColorList[3],
        },
        smooth: true,
        symbol: 'none',
      },
      {
        name: '打包成本',
        type: 'line',
        data: data3.value.map((item) => item.cost),
        itemStyle: {
          color: storageAgeColorList[2],
        },
        smooth: true,
        symbol: 'none',
      },
      {
        name: '头程运费',
        type: 'line',
        data: data3.value.map((item) => item.freight),
        itemStyle: {
          color: storageAgeColorList[1],
        },
        smooth: true,
        symbol: 'none',
      },
    ],
  }
  chartInstance3?.setOption(option3.value)
}
const updateChart2 = () => {
  chartInstance2?.setOption(option2.value, true)
}
const updateChart3 = () => {
  chartInstance3?.setOption(option3.value, true)
}

const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
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
const clickCancel = async (event: Event, value: any) => {
  const rootElement = getRootElement(event.target, '.cell')

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
    handleUpdateList(value)
  }
}
const headerCellStyle = (): CSSProperties => {
  return {
    backgroundColor: '#f2f5fa',
    textAlign: 'center',
  }
}
// 动态设置图片列高度
const setImageHeight = () => {
  const dom1 = document.querySelector('div[data-label="amazon"]')
  const dom2 = document.querySelector('div[data-label="fba"]')

  if (dom1 && dom2) {
    const height1 = dom1.getBoundingClientRect()
    const height2 = dom2.getBoundingClientRect()
    imageHeight.value = height2.bottom - height1.top
  }
  // console.log('imageHeight', imageHeight.value);
}
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const columnIndex = data.columnIndex
  if (
    columnIndex === 0 ||
    columnIndex === 2 ||
    columnIndex === 3 ||
    columnIndex === 9 ||
    columnIndex === 13 ||
    columnIndex === 16 ||
    columnIndex === 17
  ) {
    return {
      fontWeight: 600,
      textAlign: 'center',
      cursor: 'not-allowed',
    }
  }
  const label = data.column.label
  if (
    data.row.sizeSource === 1 &&
    (label === '长(cm)' || label === '宽(cm)' || label === '高(cm)' || label === '重量(g)' || label === '尾程')
  ) {
    return {
      fontWeight: 600,
      textAlign: 'center',
      cursor: 'not-allowed',
      backgroundColor: 'rgba(245, 108, 108, 0.1)', // 浅红色背景
      // color: 'var(--el-color-danger)', // 红色文字
      // border: '1px solid rgba(245, 108, 108, 0.3)', // 淡红色边框
      // borderRadius: '4px', // 圆角
    }
  }
  return {
    textAlign: 'center',
    cursor: 'pointer',
  }
}

const tooltipIsDisHandler = (event: any) => {
  if (event.target.clientWidth < event.target.scrollWidth) {
    isOverflow.value = false
  } else {
    isOverflow.value = true
  }
}
const channelList = ref<{ id: number; label: string }[]>([])
const siteList = ref<{ id: number; label: string }[]>([])
// 新增的站点列表，过滤掉沃尔玛
const siteAddList = ref<{ id: number; label: string }[]>([])
const fetchChannelData = async () => {
  const { data } = await getChannelList()
  channelList.value = data
}
const fetchSalesSiteList = async () => {
  const { data } = await getSalesSiteList()
  siteList.value = data
  siteAddList.value = siteList.value.filter((item) => item.label !== '沃尔玛US美国')
}
// 获取成本核算数据
const fetchData = async () => {
  queryForm.sku = props.sku
  const { data } = await getOperationAmazonCostList(queryForm)
  list.value = data.list
  total.value = data.total
}
onBeforeMount(() => {
  fetchChannelData()
  fetchSalesSiteList()
  percentageAgeData = data2.value.map((item) => ({
    ...item,
    percentage: ((item.value / totalAgeValue) * 100).toFixed(2),
  }))
  fetchData()
})

onMounted(() => {
  if (chartContainer1.value) {
    chartInstance1 = echarts.init(chartContainer1.value)
    chartObserver1 = new ResizeObserver(() => {
      if (chartInstance1) {
        chartInstance1.resize()
      }
    })
    chartObserver1.observe(chartContainer1.value)
    initChart1()
  }
  if (chartContainer2.value) {
    chartInstance2 = echarts.init(chartContainer2.value)
    chartObserver2 = new ResizeObserver(() => {
      if (chartInstance2) {
        chartInstance2.resize()
      }
    })
    chartObserver2.observe(chartContainer2.value)
    initChart2()
  }
  if (chartContainer3.value) {
    chartInstance3 = echarts.init(chartContainer3.value)
    chartObserver3 = new ResizeObserver(() => {
      if (chartInstance3) {
        chartInstance3.resize()
      }
    })
    chartObserver3.observe(chartContainer3.value)
    initChart3()
  }
  nextTick(() => {
    setImageHeight()
  })
  // console.log(var(--el-font-size-base));
})
</script>

<style lang="scss" scoped>
.cost-container {
  display: flex;
  flex-direction: column;
  height: calc(var(--el-container-height) - var(--el-padding) - 52px - 70px) !important;

  .none {
    display: none;
  }
  .el-table {
    flex: 1;
  }
  .card1 {
    :deep() {
      .el-card__header {
        border-bottom: 0;
      }
      .el-card__body {
        padding-top: 0;
        padding-left: 0;
      }
    }
  }
  .table-item {
    position: relative;
    padding-left: 13px;

    &::before {
      position: absolute;
      top: 50%;
      left: -5px;
      width: 10px;
      height: 10px;
      content: '';
      background-color: var(--dot-color, gray);
      border-radius: 16px;
      transform: translateY(-50%);
    }
  }
  .card2 {
    :deep() {
      .el-card__header {
        padding-bottom: 0;
        border-bottom: 0;
      }
      .el-card__body {
        padding-top: 0;
        padding-left: 0;
      }
    }
  }
  .card3 {
    :deep() {
      .el-card__body {
        padding-top: 10px;
        padding-right: 10px;
        padding-bottom: 0;
        padding-left: 15px;
      }
    }
    margin-bottom: 10px;
  }
  .card4 {
    :deep() {
      .el-card__body {
        padding: 0;
      }
    }
  }
  .custom-cancel {
    width: 1em;
    height: 1em;
    margin-left: 2px;
    &:hover {
      color: #4e88f3;
      cursor: pointer;
    }
  }
  .grid-container {
    display: grid;
    grid-template-rows: repeat(2, 1fr); /* 两行 */
    grid-template-columns: repeat(2, 1fr); /* 两列 */
    gap: 10px; /* 单元格间隙 */
    justify-content: flex-end;

    .grid-item {
      padding: 10px 5px 5px 10px;
      overflow: hidden;
      text-align: left;
      background-color: #f2f5fa;
      border: 0;
      border-radius: 5px;

      .grid-title {
        padding: 0 0 5px 0;
        margin-bottom: 3px;
        overflow: hidden;
        color: #606266;
        text-overflow: ellipsis;
        white-space: nowrap; /* 防止文字换行 */
      }
      .grid-value {
        overflow: hidden;
        font-size: var(--el-font-size-base);
        font-weight: 550;
        color: #4e88f3;
        text-overflow: ellipsis;
        white-space: nowrap; /* 防止文字换行 */

        &-green {
          color: #24ada1;
        }
        &-red {
          color: #d14d4d;
        }
      }
    }
  }
}
</style>
