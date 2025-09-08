<template>
  <vab-card :body-style="{ height: '242px' }" skeleton>
    <template #header>
      <vab-icon icon="bar-chart-2-line" />
      库存货值统计
      <el-button class="card-header-tag" type="primary" @click="updateInventoryProductsTotalValue">更新</el-button>
    </template>
    <vab-chart :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
import { graphic } from 'echarts/core'
import { updateFrontPageInventoryProductsTotalValue } from '~/src/api/devlocal/frontPage'
import { useSettingsStore } from '/@/store/modules/settings'
import { IGetFrontPageInventoryProductsTotalValue } from '/@/type/index/frontPage'
import { lightenColor } from '/@/utils/lightenColor'

const props = defineProps<{
  data: IGetFrontPageInventoryProductsTotalValue[]
}>()
const emit = defineEmits(['update'])

defineOptions({
  name: 'InventoryProductsTotalValue',
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const option = reactive<any>({
  tooltip: {
    trigger: 'axis',
    fontSize: 22,
  },
  legend: {
    data: ['库存产品总货值', '未付货款'],
    bottom: '0%',
  },
  grid: {
    top: '5%',
    left: '2%',
    right: '4%',
    bottom: '15%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '库存产品总货值',
      type: 'line',
      data: [],
      smooth: true,
      lineStyle: {
        color: theme.value.color,
        width: 3,
      },
      itemStyle: {
        color: theme.value.color,
        borderWidth: 2,
        borderColor: '#fff',
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: lightenColor(theme.value.color, 80) },
          { offset: 1, color: lightenColor(theme.value.color, 95) },
        ]),
      },
    },
    {
      name: '未付货款',
      type: 'line',
      data: [],
      smooth: true,
      lineStyle: {
        color: '#ff6b6b',
        width: 3,
      },
      itemStyle: {
        color: '#ff6b6b',
        borderWidth: 2,
        borderColor: '#fff',
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: lightenColor('#ff6b6b', 80) },
          { offset: 1, color: lightenColor('#ff6b6b', 95) },
        ]),
      },
    },
  ],
})

watch(
  () => props.data,
  () => {
    option.xAxis.data = props.data.map((item) => item.date)
    option.series[0].data = props.data.map((item) => item.totalValue)
    option.series[1].data = props.data.map((item) => item.unpaidGoods)
  },
  { immediate: true }
)
const updateInventoryProductsTotalValue = async () => {
  const { data } = await updateFrontPageInventoryProductsTotalValue()
  if (data) {
    $baseMessage('更新成功', 'success', 'hey')
    emit('update')
  }
}
</script>

<style lang="scss" scoped>
:deep() {
  .echarts {
    height: 210px !important;
  }
  .card-header-tag {
    cursor: pointer;
  }
}
</style>
