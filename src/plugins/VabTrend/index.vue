<template>
  <vab-dialog :before-close="handlerClose" :model-value="props.trendEchartsVisible" title="关键词趋势" top="10vh" width="75%">
    <!-- 关键词输入框（可选） -->
    <div v-if="props.showInput" class="keyword-input-container">
      <el-form inline>
        <el-form-item label="关键词">
          <el-input v-model="localKeyWord" autocomplete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="props.loading" type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-select v-model="idxKeyWordValue" :reserve-keyword="false" style="width: 200px" @change="idxUpdateKeyWordTrend">
      <el-option v-for="item in idxKeyWordOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <vab-echarts-chart-line class="chart-line" :x-axis-data="props.trendData.xAxis" :y-axis-data="props.trendData.yAxis" />
    <template #footer></template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { getEvaluationTrendList } from '/@/api/devlocal/evaluation'
import { idxKeyWordOptions } from '/@/const/selectoptions'
import type { IKeyWordTrend } from '/@/type/evaluation/evaluationType'

defineOptions({
  name: 'VabTrend',
})

const emit = defineEmits<{
  (e: 'update:visibleValue', value: boolean): void
  (e: 'update:clearInputKeyWord', value: string): void
  (e: 'update:trendEchartsList', value: IKeyWordTrend): void
  (e: 'search', value: string): void
}>()

const props = defineProps<{
  trendEchartsVisible: boolean
  keyWord: string
  trendData: IKeyWordTrend
  loading?: boolean
  showInput?: boolean
}>()

// 关键词趋势列表下拉框默认选中值
const idxKeyWordValue = ref<string>('0')
// 本地关键词（用于输入框）
const localKeyWord = ref<string>('')

// 监听外部传入的keyWord变化，同步到本地
watch(
  () => props.keyWord,
  (val) => {
    localKeyWord.value = val
  },
  { immediate: true }
)
// const chartData = computed(() => ({
//   xAxis: props.trendData.xAxis,
//   yAxis: props.trendData.yAxis
// }))

// 清除关键词趋势相关数据
const handlerClose = () => {
  idxKeyWordValue.value = '0'
  localKeyWord.value = ''
  emit('update:clearInputKeyWord', '')
  emit('update:visibleValue', false)
  emit('update:trendEchartsList', { xAxis: [], yAxis: [] })
}

// 处理查询按钮点击
const handleSearch = () => {
  if (localKeyWord.value.trim()) {
    emit('search', localKeyWord.value.trim())
  } else {
    $baseMessage('请输入关键词', 'warning')
  }
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
        yAxis: data.yAxis, // 修正这里，使用 yAxis 而不是 y
      })
    }
  } catch (error) {
    console.error('获取趋势数据失败:', error)
    // 只有在出错时才清空数据
    emit('update:trendEchartsList', { xAxis: [], yAxis: [] })
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
