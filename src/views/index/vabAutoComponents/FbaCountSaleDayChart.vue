<template>
  <vab-card :body-style="{ height: '422px' }" class="fba-count-sale-day-chart-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      剩余FBA库存数
      <div class="right-select">
        <el-select v-model="type" style="max-width: 5em" @change="handleChangeType">
          <el-option label="库存天数" :value="0" />
          <el-option label="库存天数含在途" :value="1" />
        </el-select>
        <el-date-picker v-model="selectedDates" placeholder="选择日期" type="dates" @change="fetchData" />
        <el-select v-model="userId" placeholder="人员" style="max-width: 5em" @change="fetchData">
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
  name: 'FbaCountSaleDayChart',
})

import { getFrontPageFbaCountSaleDayChart } from '/@/api/devlocal/frontPage'
import { useSettingsStore } from '/@/store/modules/settings'
import { formatDateToString } from '/@/utils/dateUtils'

const props = defineProps<{
  userList: { id: number; label: string }[]
  siteList: { id: number; label: string }[]
}>()
const type = ref<number>(0)
// 默认选中今天
const selectedDates = ref<string[]>([formatDateToString(new Date())])
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
        result += `${param.marker} ${param.seriesName}: ${param.value}<br/>`
      })
      return result
    },
  },
  xAxis: {
    type: 'category',
    data: [],
    name: '库存可售天数',
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
    name: '剩余FBA库存数',
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
      name: '剩余FBA库存数',
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
const handleChangeType = () => {
  option.xAxis.name = type.value === 0 ? '库存天数' : '库存天数含在途'
  fetchData()
}
const fetchData = async () => {
  if (!selectedDates.value?.length) {
    resetChart()
    return
  }

  loading.value = true
  try {
    const { data } = await getFrontPageFbaCountSaleDayChart({
      userId: userId.value,
      site: site.value,
      dates: selectedDates.value.map((date) => formatDateToString(new Date(date))),
      type: type.value,
    })

    // 空对象 or 非法数据
    if (!data || Object.keys(data).length === 0) {
      resetChart()
      return
    }

    // 获取 X 轴数据（后端已排序好，直接取第一个日期的数据即可）

    const dates = Object.keys(data)
    if (dates.length === 0) {
      resetChart()
      return
    }
    const firstDateData = data[dates[0] as keyof typeof data] as any[]
    if (!Array.isArray(firstDateData) || firstDateData.length === 0) {
      resetChart()
      return
    }

    option.xAxis.data = firstDateData.map((i) => i.saleDayRange)

    // 构建多条折线数据
    const series: any[] = []
    const legendData: string[] = []

    dates.forEach((date, index) => {
      const dateData = data[date as keyof typeof data] as any
      if (!Array.isArray(dateData)) return

      legendData.push(date)

      // 构建该日期的数据
      const seriesData = dateData.map((item: any) => item.fbaCount)

      const color = colorPalette[index % colorPalette.length]

      series.push({
        id: `line-${date}`,
        name: date,
        type: 'line',
        data: seriesData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: color,
        },
        itemStyle: {
          color: color,
        },
        areaStyle: {
          opacity: 0.1,
          color: color,
        },
      })
    })
    // 如果所有日期都被过滤掉了（全是空数组），也要清
    if (series.length === 0) {
      resetChart()
      return
    }

    option.series = series
    option.legend.data = legendData
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
.fba-count-sale-day-chart-card {
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
