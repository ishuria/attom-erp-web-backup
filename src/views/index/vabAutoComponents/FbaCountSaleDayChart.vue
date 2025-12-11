<template>
  <vab-card :body-style="{ height: '522px' }" class="fba-count-sale-day-chart-card" skeleton>
    <template #header>
      <vab-icon icon="align-top" />
      剩余FBA库存数
      <div class="right-select">
        <el-select v-model="userId" placeholder="人员" style="max-width: 5em" @change="fetchData">
          <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>

        <el-select v-model="site" placeholder="站点" style="max-width: 5em" @change="fetchData">
          <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </div>
    </template>
    <vab-chart :loading="loading" :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'FbaCountSaleDayChart',
})

import { getFrontPageFbaCountSaleDayChart } from '/@/api/devlocal/frontPage'
import { useSettingsStore } from '/@/store/modules/settings'
import type { IGetFrontPageFbaCountSaleDayChartRes } from '/@/type/index/frontPage'

const props = defineProps<{
  userList: { id: number; label: string }[]
  siteList: { id: number; label: string }[]
}>()

const userId = ref<number>(-1)
const site = ref<number>(-1)
const settingsStore = useSettingsStore()
const loading = ref(false)
const { theme } = storeToRefs(settingsStore)
const list = ref<IGetFrontPageFbaCountSaleDayChartRes[]>([])

const option = reactive<any>({
  grid: {
    top: 30,
    right: 30,
    bottom: 50,
    left: 60,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
    formatter: (params: any) => {
      const param = params[0]
      return `${param.name}<br/>${param.seriesName}: ${param.value}`
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

const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await getFrontPageFbaCountSaleDayChart({ userId: userId.value, site: site.value })
    list.value = data || []

    // 更新图表数据
    option.xAxis.data = list.value.map((item) => item.saleDayRange)
    option.series[0].data = list.value.map((item) => item.fbaCount)
  } catch (error) {
    console.error('获取FBA库存数据失败:', error)
    list.value = []
    option.xAxis.data = []
    option.series[0].data = []
  } finally {
    loading.value = false
  }
}

// 监听主题色变化
watch(
  () => theme.value.color,
  (color) => {
    option.series[0].lineStyle.color = color
    option.series[0].itemStyle = {
      color: color,
    }
    option.series[0].areaStyle.color = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: color,
        },
        {
          offset: 1,
          color: 'rgba(255, 255, 255, 0)',
        },
      ],
    }
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
