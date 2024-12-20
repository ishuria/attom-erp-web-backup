<template>
  <vab-dialog
    :model-value="props.trendEchartsVisible"
    :before-close="handlerClose"
    width="75%"
    title="关键词趋势"
    top="10vh"
  >
    <el-select v-model="idxKeyWordValue" :reserve-keyword="false" @change="idxUpdateKeyWordTrend" style="width: 200px">
      <el-option v-for="item in idxKeyWordOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <vab-echarts-chart-line class="chart-line" :x-axis-data="trendData.xAxis" :y-axis-data="trendData.yAxis" />
    <template #footer></template>
  </vab-dialog>
</template>

<script lang="ts" setup>

import { getEvaluationTrendList, } from '/@/api/devlocal/evaluation'
import {
  idxKeyWordOptions
} from '/@/const/selectoptions'
import { IKeyWordTrend } from '/@/type/evaluation/evaluationType'

defineOptions({
  name: 'VabTrend',
})

const emit = defineEmits<{ 
  (e: 'update:visibleValue', value: boolean): void
  (e: 'update:clearInputKeyWord', value: string): void
  (e: 'update:trendEchartsList', value: IKeyWordTrend): void
}>()

let props = withDefaults(defineProps<{
    trendEchartsVisible: boolean
    keyWord: string
    trendData: IKeyWordTrend
}>(),{

});

// 关键词趋势列表下拉框默认选中值
const idxKeyWordValue = ref<string>('0')


// 清除关键词趋势相关数据
const handlerClose = () => {
    setTimeout(() => {
      idxKeyWordValue.value = "0"
      emit('update:clearInputKeyWord', "")
      emit('update:visibleValue', false)
      emit('update:trendEchartsList',{xAxis:[],yAxis:[]})
    }, 800);
}

/**
 * 关键词下拉change
 */
 const idxUpdateKeyWordTrend = async (val: any) => {
  emit('update:trendEchartsList',{xAxis:[],yAxis:[]})  
  const { data } = await getEvaluationTrendList({ keyWord: props.keyWord, type: val })
  emit('update:trendEchartsList',{xAxis:data.xAxis,yAxis:data.y})
}


</script>

<style lang="scss" scope>
.chart-line {
  width: 100%;
  height: 100%;
  min-height: 700px;
}
</style>