<template>
  <vab-dialog
    v-model="dflag"
    title="关键词排名趋势"
    width="20%"
    @close="handleClose"
  >
    <el-form label-position="top" >
      <el-form-item label="关键词">
        <el-input v-model="inputKeyWord" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="queryLoading" type="primary" @click="queryKeyWordTrend">查询</el-button>
    </template>
  </vab-dialog>
  <!-- 关键词趋势图表 -->
  <vab-trend
    :key-word="inputKeyWord"
    :trend-data="trendData"
    :trend-echarts-visible="keywordTrendChartVisible"
    @update:clear-input-key-word="cleanKeyWordTrendData"
    @update:trend-echarts-list="updateTrendEchartsData"
    @update:visible-value="updateTrendVisibleValue"
  />
</template>

<script lang="ts" setup>
import { getEvaluationTrendList } from '/@/api/devlocal/evaluation'
defineOptions({
  name: 'VabKeyWordRankTrend'
})
const dflag = ref<boolean>(false)
const props = defineProps<{
  keyWordTrendVisible: boolean
}>()
watchEffect(() => {
  dflag.value = props.keyWordTrendVisible
})
const inputKeyWord = ref<string>('')
const emit = defineEmits(['updateVisible'])
const keywordTrendChartVisible = ref<boolean>(false)
let trendData = {
  xAxis: [],
  yAxis: []
}
const queryLoading = ref<boolean>(false)
const queryKeyWordTrend = () => {
  queryLoading.value = true
  keyWordTrend(inputKeyWord.value)
  queryLoading.value = false
}
const keyWordTrend = async (str: string) => {
  const { data } = await getEvaluationTrendList({ keyWord: str, type: 0 })
  trendData.xAxis = data.xAxis
  trendData.yAxis = data.yAxis
  dflag.value = false
  keywordTrendChartVisible.value = true
}
const handleClose = () => {
  emit('updateVisible', false)
}
// 清除关键词趋势相关数据
const cleanKeyWordTrendData = (newValue: string) => {
  inputKeyWord.value = newValue
  trendData.xAxis = []
  trendData.yAxis = []
  keywordTrendChartVisible.value = false
  dflag.value = false
}
const updateTrendEchartsData = (newValue: IKeyWordTrend) => {
  trendData = newValue
}

const updateTrendVisibleValue = (newValue: boolean) => {
  keywordTrendChartVisible.value = newValue
}
</script>

