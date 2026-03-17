<template>
  <vab-card :body-style="{ height: '422px' }" class="new-product-sale-day-chart-card" skeleton>
    <template #header>
      <vab-icon icon="chart-line" />
      上新天数 vs 利润/销售额
      <div class="right-select">
        <el-select v-model="dataType" style="max-width: 7em" @change="fetchData">
          <el-option label="利润" value="profit" />
          <el-option label="销售额" value="sales" />
        </el-select>
        <el-date-picker
          v-model="selectedMonth"
          format="YYYY-MM"
          placeholder="选择月份"
          style="width: 120px"
          type="month"
          value-format="YYYY-MM"
          @change="fetchData"
        />
        <el-select v-model="userId" placeholder="人员" style="max-width: 6em" @change="fetchData">
          <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
        <el-select v-model="site" placeholder="站点" style="max-width: 5em" @change="fetchData">
          <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </div>
    </template>
    <vab-chart :key="chartKey" :loading="loading" :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'NewProductSaleDayChart',
})

import { getFrontPageNewProductSaleDayChart } from '/@/api/devlocal/frontPage'
import { useSettingsStore } from '/@/store/modules/settings'
import { getCurrentMonth } from '/@/utils/dateUtils'

const props = defineProps<{
  userList: { id: number; label: string }[]
  siteList: { id: number; label: string }[]
}>()

const dataType = ref<string>('profit') // 默认选择利润
const selectedMonth = ref<string>(getCurrentMonth())
const userId = ref<number>(-1)
const site = ref<number>(-1)
const settingsStore = useSettingsStore()
const loading = ref(false)
const { theme } = storeToRefs(settingsStore)

// 预定义的颜色系列
const colorPalette = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']

const option = reactive<any>({
  grid: {
    top: 60,
    right: 30,
    bottom: 50,
    left: 70,
  },
  legend: {
    show: true,
    top: 10,
    type: 'scroll',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
    formatter: (params: any) => {
      if (!params || params.length === 0) return ''
      let result = `${params[0].name}<br/>`
      params.forEach((param: any) => {
        const value = param.value !== undefined && param.value !== null ? param.value.toLocaleString() : '-'
        result += `${param.marker} ${param.seriesName}: ¥${value}<br/>`
      })
      return result
    },
  },
  xAxis: {
    type: 'category',
    data: [],
    name: '上新天数',
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
    name: '利润(¥)',
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
    axisLabel: {
      formatter: (value: number) => {
        if (value >= 10000) {
          return (value / 10000).toFixed(1) + 'w'
        }
        return value
      },
    },
  },
  series: [
    {
      name: '利润',
      type: 'line',
      data: [],
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2,
        color: colorPalette[0],
      },
      itemStyle: {
        color: colorPalette[0],
      },
      areaStyle: {
        opacity: 0.1,
        color: colorPalette[0],
      },
    },
  ],
})

const chartKey = ref(0)

const resetChart = () => {
  option.xAxis.data = []
  option.series = []
  option.legend.data = []
  chartKey.value++
}

const fetchData = async () => {
  if (!selectedMonth.value) {
    resetChart()
    return
  }

  loading.value = true
  try {
    const { data } = await getFrontPageNewProductSaleDayChart({
      userId: userId.value,
      site: site.value,
      month: selectedMonth.value,
      dataType: dataType.value,
    })

    // 空对象 or 非法数据
    if (!data || !Array.isArray(data) || data.length === 0) {
      resetChart()
      return
    }

    // 更新 Y 轴名称
    option.yAxis.name = dataType.value === 'sales' ? '销售额(¥)' : '利润(¥)'

    // 获取 X 轴数据
    option.xAxis.data = data.map((item: any) => item.dayRange)

    // 构建折线图数据
    const seriesData = data.map((item: any) => (dataType.value === 'sales' ? item.sales : item.profit))

    option.series = [
      {
        name: dataType.value === 'sales' ? '销售额' : '利润',
        type: 'line',
        data: seriesData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: colorPalette[0],
        },
        itemStyle: {
          color: colorPalette[0],
        },
        areaStyle: {
          opacity: 0.1,
          color: colorPalette[0],
        },
      },
    ]
    option.legend.data = [dataType.value === 'sales' ? '销售额' : '利润']
  } catch (e) {
    console.error(e)
    resetChart()
  } finally {
    loading.value = false
  }
}

// 监听主题色变化
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
.new-product-sale-day-chart-card {
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

  :deep(.el-table) {
    height: calc(100% - 52px);
  }
}
</style>
