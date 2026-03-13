<template>
  <vab-card :body-style="{ height: '422px' }" class="shipping-error-chart-card" skeleton>
    <template #header>
      <vab-icon icon="exchange-line" />
      收发误差数
      <div class="right-select">
        <el-date-picker v-model="monthRange" :clearable="false" type="monthrange" value-format="YYYY-MM" @change="fetchData" />
        <el-select v-model="dateType" style="max-width: 7em" @change="fetchData">
          <el-option label="发货日期" value="shipDate" />
          <el-option label="上架日期" value="shelfDate" />
        </el-select>
        <el-checkbox v-model="includeReceiving" label="包含接收中" @change="fetchData" />
      </div>
    </template>
    <vab-chart :key="chartKey" :loading="loading" :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'ShippingErrorChart',
})

import { getShippingErrorChart } from '/@/api/devlocal/frontPage'
import { useSettingsStore } from '/@/store/modules/settings'

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const loading = ref(false)
const dateType = ref<string>('shipDate')
const includeReceiving = ref<boolean>(false)

// 默认最近一年
const now = new Date()
const endMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
const startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1)
const startMonth = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
const monthRange = ref<string[]>([startMonth, endMonth])

const option = reactive<any>({
  grid: {
    top: 40,
    right: 30,
    bottom: 50,
    left: 70,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
  },
  xAxis: {
    type: 'category',
    data: [],
    name: '月份',
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: {
      color: '#333333',
      fontSize: 14,
    },
    axisLabel: {
      rotate: 0,
      interval: 0,
    },
    axisLine: {
      lineStyle: {
        color: '#e0e0e0',
      },
    },
  },
  yAxis: {
    type: 'value',
    name: '收发误差数',
    nameTextStyle: {
      color: '#333333',
      fontSize: 14,
      padding: [0, 0, 0, 10],
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#e0e0e0',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#e0e0e0',
        width: 1,
      },
    },
  },
  series: [
    {
      name: '收发误差数',
      type: 'line',
      data: [],
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2,
      },
      areaStyle: {
        opacity: 0.3,
      },
      itemStyle: {
        color: '#ee6666',
      },
    },
  ],
})

const chartKey = ref(0)

const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await getShippingErrorChart({
      dateType: dateType.value,
      includeReceiving: includeReceiving.value,
      startMonth: monthRange.value[0],
      endMonth: monthRange.value[1],
    })

    if (!data || !Array.isArray(data) || data.length === 0) {
      option.xAxis.data = []
      option.series[0].data = []
      chartKey.value++
      return
    }

    option.xAxis.data = data.map((item: any) => item.month)
    option.series[0].data = data.map((item: any) => item.errorCount)
    chartKey.value++
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(
  () => theme.value.color,
  (color) => {
    option.tooltip.borderColor = color
  },
  { immediate: true }
)

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.shipping-error-chart-card {
  position: relative;

  :deep(.el-card__header) {
    position: relative;
    display: flex;
    align-items: center;
  }

  .right-select {
    position: absolute;
    top: 50%;
    right: 10px;
    width: auto;
    height: 60px;
    line-height: 60px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
  }
}
</style>
