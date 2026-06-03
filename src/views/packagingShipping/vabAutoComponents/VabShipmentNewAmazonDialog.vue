<template>
  <!-- 发货（新亚马逊）表单 dialog -->
  <vab-dialog
    v-model="formVisible"
    class="dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="false"
    title="发货新（亚马逊）"
    top="6vh"
    width="25%"
    @close="closeForm"
  >
    <el-form ref="formRef" label-position="top" :model="form" :rules="formRules">
      <el-form-item style="margin-bottom: 10px">
        <el-text>
          {{ `总箱数：${totalBoxNumber}，总重：${totalWeight.toFixed(2)}(kg)，总体积：${totalVolume.toFixed(2)}(m3)` }}
        </el-text>
      </el-form-item>
      <el-form-item label="发往站点" prop="siteId">
        <el-input v-model="form.site" disabled />
      </el-form-item>
      <el-form-item label="货代渠道" prop="channel">
        <div class="channel-select-container">
          <el-select v-model="form.channel" class="channel-select" clearable filterable placeholder="请选择货代渠道">
            <el-option v-for="item in channelList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-button
            circle
            class="copy-btn"
            :disabled="!form.channel"
            :icon="CopyDocument"
            size="small"
            type="primary"
            @click="handleClip(getChannelName(form.channel))"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center">
        <el-button :loading="submitLoading" type="primary" @click="handleSubmit">
          {{ submitLoading ? '正在获取货件方案，请等待！' : '提交货件信息' }}
        </el-button>
      </div>
    </template>
  </vab-dialog>

  <!-- 货件方案结果 dialog -->
  <vab-dialog
    v-model="planResultVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="false"
    title="选择货件方案"
    width="45%"
  >
    <el-table border :data="flattenedRows" :span-method="spanMethod">
      <el-table-column label="货件方案" width="120">
        <template #default="{ row }">
          <el-radio v-model="selectedPlanId" :value="row.placementOptionId">{{ row.shipmentCount }}个货件</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="费用" width="140">
        <template #default="{ row }">
          <el-popover placement="bottom" trigger="click" :width="360">
            <template #reference>
              <el-button link>
                {{ formatFee(row.fees) }}
                <el-icon style="margin-left: 2px"><arrow-down /></el-icon>
              </el-button>
            </template>
            <el-table :data="row.fees" size="small">
              <el-table-column label="费用项" min-width="140" prop="target" />
              <el-table-column label="金额" prop="amount" width="80" />
              <el-table-column label="货币" prop="code" width="70" />
              <el-table-column label="类型" prop="type" width="80" />
            </el-table>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="货件编号" min-width="160" prop="placementOptionId" />
      <el-table-column label="入库区域" prop="postalCodeMark" width="90" />
      <el-table-column label="物流中心编码" prop="wareHouseId" width="120" />
      <el-table-column label="配送地址" min-width="200">
        <template #default="{ row }">{{ formatAddress(row.address) }}</template>
      </el-table-column>
      <el-table-column label="商品总数" prop="itemCount" width="90" />
    </el-table>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="planResultVisible = false">取消</el-button>
        <el-button :loading="declareLoading" type="primary" @click="handleDeclareShipment">
          {{ declareLoading ? '处理中' : '申报发货' }}
        </el-button>
      </div>
    </template>
  </vab-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ArrowDown, CopyDocument } from '@element-plus/icons-vue'
import { checkEncasementShipment, createShipmentTask, getChannelList } from '/@/api/devlocal/encasement'
import type { IEncasementList, OptionType } from '/@/type/packagingShipping/shippedType'
import { handleClip } from '/@/utils/clipboard'

const props = defineProps<{
  selectRows: IEncasementList[]
}>()

// 汇总数据（根据选中行实时计算）
const totalBoxNumber = computed(() => props.selectRows.reduce((total, item: any) => total + (Number(item.numberOfBoxes) || 0), 0))
const totalWeight = computed(() => props.selectRows.reduce((total, item: any) => total + (Number(item.totalWeight) || 0), 0))
const totalVolume = computed(() => props.selectRows.reduce((total, item: any) => total + (Number(item.totalVolume) || 0), 0))

// 货代渠道
const channelList = ref<OptionType[]>([])
const getChannelName = (channelId: number) => {
  return channelList.value.find((item: any) => item.id === channelId)?.label ?? ''
}

// ───── 表单 dialog ─────
const formVisible = ref<boolean>(false)
const form = reactive<any>({})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules>({
  siteId: [{ required: true, message: '发往站点不能为空', trigger: 'change' }],
  channel: [{ required: true, message: '请选择货代渠道', trigger: 'change' }],
})

const closeForm = () => {
  formRef.value?.resetFields()
  formVisible.value = false
}

// ───── 货件方案结果 dialog ─────
const submitLoading = ref<boolean>(false)
const planResultVisible = ref<boolean>(false)
const planResult = ref<any[]>([])
const selectedPlanId = ref<string>('')
const declareLoading = ref<boolean>(false)

const handleDeclareShipment = async () => {
  // TODO: 对接申报发货接口
  declareLoading.value = true
  try {
  } finally {
    declareLoading.value = false
  }
}

const flattenedRows = computed(() => {
  const rows: any[] = []
  planResult.value.forEach((option) => {
    const shipments: any[] = option.shipmentInformationList || []
    shipments.forEach((shipment, idx) => {
      rows.push({
        isFirstInOption: idx === 0,
        optionRowSpan: idx === 0 ? shipments.length : 0,
        placementOptionId: option.placementOptionId,
        shipmentCount: shipments.length,
        fees: option.fees || [],
        ...shipment,
      })
    })
  })
  return rows
})

const spanMethod = ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
    const row = flattenedRows.value[rowIndex]
    if (row?.isFirstInOption) return { rowspan: row.optionRowSpan, colspan: 1 }
    return { rowspan: 0, colspan: 0 }
  }
}

const formatAddress = (addr: any) => {
  if (!addr) return ''
  return [addr.addressLine1, addr.addressLine2, addr.city, addr.countryCode, addr.companyName, addr.postalCode, addr.stateOrProvinceCode]
    .filter(Boolean)
    .join(', ')
}

const formatFee = (fees: any[]) => {
  if (!fees || fees.length === 0) return '$0'
  const total = fees.filter((f) => f.type === 'FEE').reduce((sum, f) => sum + Number(f.amount || 0), 0)
  return `$${total}`
}

const handleSubmit = () => {
  formRef.value?.validate(async (isValid: boolean) => {
    if (!isValid) return
    submitLoading.value = true
    try {
      const encasementIds = props.selectRows.map((item: any) => item.id)
      const { data } = await createShipmentTask({
        encasementIds,
        channelId: form.channel,
      })
      if (data) {
        planResult.value = data || []
        selectedPlanId.value = ''
        closeForm()
        planResultVisible.value = true
      }
    } finally {
      submitLoading.value = false
    }
  })
}

// 对外暴露 open()，由父组件按钮调用
const open = async () => {
  const rows = props.selectRows
  if (rows.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  const hasWalmart = rows.some((item: any) => item.planSiteName?.includes('沃尔玛'))
  if (hasWalmart) {
    $baseMessage('选中的装箱记录中包含非亚马逊站点，请仅选择发往亚马逊的记录', 'error')
    return
  }
  const discontinuedRows = rows.filter((item: any) => item.discontinued === 1)
  if (discontinuedRows.length > 0) {
    const skus = discontinuedRows.map((item: any) => item.sku).join(',')
    $baseMessage(`${skus} 被运营标记停产无法发货。如要发货请联系运营取消停产标记后再发。`, 'error')
    return
  }
  const encasementIds = rows.map((item: any) => item.id).join(',')
  const { data } = await checkEncasementShipment({ encasementIds })
  if (data) {
    const { data: res } = await getChannelList()
    channelList.value = res
    form.site = data.siteName
    form.siteId = data.siteId
    form.channel = data.channelId
    formVisible.value = true
  }
}

defineExpose({ open })
</script>

<style scoped>
.channel-select-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.channel-select {
  flex: 1;
}

.copy-btn {
  flex-shrink: 0;
}
</style>
