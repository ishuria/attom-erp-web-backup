<template>
  <el-dialog
    v-model="trendEchatsVisible"
    :close-on-click-modal="false"
    :before-close="cleanKeyWordTrendData"
    width="75%"
    title="关键词趋势"
  >
    <el-select v-model="idxKeyWordValue" :reserve-keyword="false" @change="idxUpdateKeyWordTrend" style="width: 200px">
      <el-option v-for="item in idxKeyWordOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <vab-echarts-chart-line class="chart-line" :x-axis-data="trnedData.xAxis" :y-axis-data="trnedData.yAxis" v-if="trendEchatsVisible" />
  </el-dialog>
</template>

<script lang="ts" setup>

import {getEvaluationTrendList,} from '/@/api/devlocal/evaluation'
import {IKeyWordTrend} from '/@/type/evaluation/evaluationType'
import {
  idxKeyWordOptions
} from '/@/const/selectoptions'

defineOptions({
  name: 'VabTrend',
})

const emit = defineEmits<{ 
    (e: 'update:trendEchatsVisible', value: boolean): void
    (e: 'update:clearnInputKeyWord', value: string): void
    (e: 'update:trendEchatsList', value: IKeyWordTrend): void
 }>()


const props = withDefaults(defineProps<{
    trendEchatsVisible: boolean
    keyWord:string
    trnedData:IKeyWordTrend
}>(),{
    trendVisible: false,
    trendEchatsVisible: false,
});

// 关键词趋势列表下拉框默认选中值
const idxKeyWordValue = ref<string>('0')
let {trendEchatsVisible} = toRefs(props)


// 清除关键词趋势相关数据
const cleanKeyWordTrendData = () => {
    idxKeyWordValue.value = "0"
    emit('update:clearnInputKeyWord', "")
    emit('update:trendEchatsVisible', false)
}

/**
 * 关键词下拉change
 */
 const idxUpdateKeyWordTrend = async (val: any) => {
  const { data } = await getEvaluationTrendList({ keyWord: props.keyWord, type: val })
  emit('update:trendEchatsList',{xAxis:data.xAxis,yAxis:data.y})
  emit('update:trendEchatsVisible', true)
}


</script>

<style lang="scss" scope>
.chart-line {
  width: 100%;
  height: 100%;
  min-height: 700px;
}
</style>