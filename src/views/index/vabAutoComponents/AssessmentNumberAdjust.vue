<template>
  <div>
    <vab-dialog v-model="visible" title="考核数调整" width="900">
      <vab-alert show-icon type="info">
        <div class="alert-content">
          <div class="rule-item">
            <el-icon class="rule-icon"><clock /></el-icon>
            <span>每月3号之前完成上月完成数自调</span>
          </div>
          <div class="rule-item">
            <el-icon class="rule-icon"><clock /></el-icon>
            <span>4号上午8点最后一次更新上月提成</span>
          </div>
          <div class="rule-item">
            <el-icon class="rule-icon"><warning /></el-icon>
            <span>碰到节假日需要提前自调或者远程自调</span>
          </div>
          <div class="rule-item">
            <el-icon class="rule-icon"><warning /></el-icon>
            <span>每月限提交一次</span>
          </div>
        </div>
      </vab-alert>
      <div class="slider-demo-block">
        <span class="demonstration">从【{{ fromMonthText }}】放到【{{ toMonthText }}】的完成数</span>
        <div class="slider-container">
          <el-slider
            v-model="value"
            :disabled="disabled"
            :max="max"
            :show-tooltip="false"
            :step="0.1"
            style="flex: 1; min-width: 200px"
            @input="handleAdjustValue"
          />
          <el-input-number
            v-model="value"
            :disabled="disabled"
            :max="max"
            :min="0"
            :precision="1"
            :step="0.1"
            style="width: 120px; flex-shrink: 0"
            @change="handleAdjustValue"
          />
        </div>
      </div>
      <el-table border :data="list" :header-cell-style="{ color: '#303133' }" style="margin-top: 20px">
        <el-table-column align="center" :label="`${fromMonthText}完成数`" prop="monthlyCompletion">
          <template #default="{ row }">
            <div class="adjustment-display adjustment-display-red">
              <div class="original-value">{{ originalMonthCompletion }}</div>
              <div class="operation">- {{ value }}</div>
              <div class="arrow">→</div>
              <div class="adjusted-value">{{ adjustedFromMonthCompletion }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="`${fromMonthText}考核数`" prop="monthlyAssess" width="140" />
        <el-table-column align="center" :label="`${toMonthText}完成数`" prop="nextMonthCompletion">
          <template #default="{ row }">
            <div class="adjustment-display adjustment-display-green">
              <div class="original-value">{{ originalNextMonthCompletion }}</div>
              <div class="operation">+ {{ value }}</div>
              <div class="arrow">→</div>
              <div class="adjusted-value">{{ adjustedToMonthCompletion }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="`${toMonthText}考核数`" prop="nextMonthAssess" width="140" />
      </el-table>

      <template #footer>
        <el-button :disabled="disabled" type="primary" @click="handleConfirm">提交</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Clock, Warning } from '@element-plus/icons-vue'
import { getMonthlyAndNextMonthAssess, submitAssess } from '/@/api/devlocal/frontPage'
import { IAssessAdjustRes } from '/@/type/index/frontPage'
import { getCurrentDate, getMonth, getYear } from '/@/utils/dateUtils'

defineOptions({
  name: 'AssessmentNumberAdjust',
})

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'update:frontPage'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(
  () => props.modelValue,
  async () => {
    if (!props.modelValue) return
    await fetchData()
  }
)
const _value = ref<number>(0)
const value = ref<number>(0)
const max = ref<number>(0)
const list = ref<IAssessAdjustRes[]>([])
const disabled = ref<boolean>(false)

const handleConfirm = async () => {
  if (!value.value) {
    $baseMessage('请输入调整值', 'warning')
    return
  }
  $baseConfirm('每月只能提交一次且不可修改，是否确认提交？', null, async () => {
    const { data } = await submitAssess({ number: value.value })
    if (data) {
      $baseMessage('提交成功', 'success')
      visible.value = false
      emit('update:frontPage')
    }
  })
}
const handleAdjustValue = () => {
  if (value.value == undefined) value.value = 0
  // 强制格式化为1位小数，确保精度一致
  const formattedValue = parseFloat(value.value.toFixed(1))
  value.value = formattedValue
  _value.value = formattedValue

  // 使用计算属性的值来更新列表数据，确保精度一致
  list.value[0].nextMonthCompletion = adjustedToMonthCompletion.value
  list.value[0].monthlyCompletion = adjustedFromMonthCompletion.value
}
const originalMonthCompletion = ref<number>(0)
const originalNextMonthCompletion = ref<number>(0)

// 计算调整后的完成数，确保小数点精度
const adjustedFromMonthCompletion = computed(() => {
  return parseFloat((originalMonthCompletion.value - value.value).toFixed(1))
})

const adjustedToMonthCompletion = computed(() => {
  return parseFloat((originalNextMonthCompletion.value + value.value).toFixed(1))
})

// 计算起始月份文本
const fromMonthText = computed(() => {
  const now = getCurrentDate()
  const currentDay = now.getDate()

  if (currentDay <= 3) {
    // 3号之前，显示上个月
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const year = getYear(lastMonth)
    const month = getMonth(lastMonth)
    return `${year}-${month.toString().padStart(2, '0')}`
  } else {
    // 3号之后，显示本月
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const year = getYear(currentMonth)
    const month = getMonth(currentMonth)
    return `${year}-${month.toString().padStart(2, '0')}`
  }
})

// 计算目标月份文本
const toMonthText = computed(() => {
  const now = getCurrentDate()
  const currentDay = now.getDate()

  if (currentDay <= 3) {
    // 3号之前，显示本月
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const year = getYear(currentMonth)
    const month = getMonth(currentMonth)
    return `${year}-${month.toString().padStart(2, '0')}`
  } else {
    // 3号之后，显示下个月
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const year = getYear(nextMonth)
    const month = getMonth(nextMonth)
    return `${year}-${month.toString().padStart(2, '0')}`
  }
})
const fetchData = async () => {
  const { data } = await getMonthlyAndNextMonthAssess()
  list.value[0] = data
  max.value = data.monthlyCompletion - data.monthlyAssess
  if (max.value <= 0) {
    disabled.value = true
  }
  originalMonthCompletion.value = data.monthlyCompletion
  originalNextMonthCompletion.value = data.nextMonthCompletion ? data.nextMonthCompletion : 0
  _value.value = 0 // 重置为0
}
</script>

<style lang="scss" scoped>
// 警告框样式
.alert-content {
  .rule-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 16px;
    color: #606266;

    &:last-child {
      margin-bottom: 0;
    }

    .rule-icon {
      color: var(--el-color-primary);
      font-size: 18px;
    }
  }
}

// 滑块区域样式
.slider-demo-block {
  max-width: 900px;
  display: flex;
  align-items: center;
  gap: 20px;

  .demonstration {
    font-size: 16px;
    white-space: nowrap;
    flex-shrink: 0;

    @media (max-width: 768px) {
      font-size: 14px;
      width: 100%;
      margin-bottom: 10px;
    }
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;

    @media (max-width: 768px) {
      gap: 10px;
      flex-direction: column;
      align-items: stretch;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .el-slider {
    margin-top: 10px;
    margin-left: 20px;
    margin-bottom: 10px;
  }
}

.adjustment-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;

  .original-value {
    background-color: #f5f7fa;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    color: #606266;
    min-width: 50px;
    text-align: center;
  }

  .operation {
    font-weight: 600;
    font-size: 14px;
    min-width: 40px;
    text-align: center;
  }

  .arrow {
    color: #909399;
    font-size: 16px;
    font-weight: bold;
  }

  .adjusted-value {
    background-color: #e1f3d8;
    color: #67c23a;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
    min-width: 50px;
    text-align: center;
    border: 1px solid #b3e19d;
  }
}

// 红色样式 - 第一个完成数（减少）
.adjustment-display-red {
  .operation {
    color: #f56c6c !important;
  }
  .adjusted-value {
    background-color: #ffe1e1;
    color: #f56c6c;
    border: 1px solid #f56c6c;
  }
}

// 绿色样式 - 第二个完成数（增加）
.adjustment-display-green {
  .operation {
    color: #67c23a !important;
  }
  .adjusted-value {
    background-color: #e1f3d8;
    color: #67c23a;
    border: 1px solid #b3e19d;
  }
}

// 当调整值为0时的样式
.adjustment-display:has(.operation:empty) {
  .original-value,
  .adjusted-value {
    background-color: #f5f7fa;
    color: #909399;
    border: 1px solid #e4e7ed;
  }
}
</style>
