<template>
  <vab-dialog
    v-model="dflag"
    title="关键词排名趋势"
    width="20%"
    @close="handleClose"
  >
    <el-form label-position="top" >
      <el-form-item label="关键词">
        <el-input clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="queryKeyWordTrend">查询</el-button>
    </template>
  </vab-dialog>
  <!-- 关键词趋势图表 -->
  <vab-dialog
    v-model="keywordTrendChartVisible"
    title="关键词排名趋势图"
  >
    <vab-query-form>
      <vab-query-form-left-panel :span="6" >
        <el-select>
          <el-option 
            v-for="item in keyWordTrendOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </vab-query-form-left-panel>
    </vab-query-form>
    <vab-echarts-chart-line  class="chart-line"  :x-axis-data="trendData.xAxis" :y-axis-data="trendData.yAxis" />
    <template #footer></template>  
  </vab-dialog>
</template>

<script lang="ts" setup>
import { keyWordTrendOption } from '../constantOption'

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
const emit = defineEmits(['updateVisible'])
const keywordTrendChartVisible = ref<boolean>(false)
const trendData = {
  xAxis: ['2024-12-20', '2024-12-20'],
  yAxis: [30, 50]
}
const queryKeyWordTrend = () => {
  keywordTrendChartVisible.value = true
}

const handleClose = () => {
  emit('updateVisible', false)
}
</script>

<style lang="scss" scoped>

</style>