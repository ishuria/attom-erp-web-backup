<template>
  <vab-dialog
    :before-close="handlerClose"
    :model-value="props.trendEchartsVisible"
    title="关键词趋势"
    top="10vh"
    width="75%"
  >
    <el-select v-model="idxKeyWordValue" :reserve-keyword="false" style="width: 200px" @change="idxUpdateKeyWordTrend">
      <el-option v-for="item in idxKeyWordOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <vab-echarts-chart-line class="chart-line" :x-axis-data="props.trendData.xAxis" :y-axis-data="props.trendData.yAxis" />
    <template #footer></template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { getEvaluationTrendList, } from '/@/api/devlocal/evaluation'
import { idxKeyWordOptions } from '/@/const/selectoptions'
import type { IKeyWordTrend } from '/@/type/evaluation/evaluationType'

defineOptions({
  name: 'VabTrend',
})

const emit = defineEmits<{ 
  (e: 'update:visibleValue', value: boolean): void
  (e: 'update:clearInputKeyWord', value: string): void
  (e: 'update:trendEchartsList', value: IKeyWordTrend): void
}>()

const props = defineProps<{
  trendEchartsVisible: boolean
  keyWord: string
  trendData: IKeyWordTrend
}>()

// 关键词趋势列表下拉框默认选中值
const idxKeyWordValue = ref<string>('0')
// const chartData = computed(() => ({
//   xAxis: props.trendData.xAxis,
//   yAxis: props.trendData.yAxis
// }))

// 清除关键词趋势相关数据
const handlerClose = () => {
  idxKeyWordValue.value = "0"
  emit('update:clearInputKeyWord', "")
  emit('update:visibleValue', false)
  emit('update:trendEchartsList',{xAxis:[],yAxis:[]})
}

/**
 * 关键词下拉change
 */
const idxUpdateKeyWordTrend = async (val: any) => {
  try {
    const { data } = await getEvaluationTrendList({ keyWord: props.keyWord, type: val })
    if (data && data.xAxis && data.yAxis) {
      emit('update:trendEchartsList', {
        xAxis: data.xAxis,
        yAxis: data.yAxis  // 修正这里，使用 yAxis 而不是 y
      })
    }
  } catch (error) {
    console.error('获取趋势数据失败:', error)
    // 只有在出错时才清空数据
    emit('update:trendEchartsList', {xAxis: [], yAxis: []})
  }
}
</script>

<style lang="scss" scope>
.chart-line {
  width: 100%;
  height: 100%;
  min-height: 700px;
}
</style>