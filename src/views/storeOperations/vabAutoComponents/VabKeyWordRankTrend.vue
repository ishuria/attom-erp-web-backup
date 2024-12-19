<template>
  <vab-dialog
    title="关键词排名趋势"
    width="20%"
    v-model="dflag"
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
    title="关键词排名趋势图"
    v-model="keywordTrendChartVisible"
  >
    <vab-query-form>
      <vab-query-form-left-panel :span="6" >
        <el-select>
          <el-option 
            v-for="item in keyWordTrendOption"
            :label="item.label"
            :key="item.value"
            :value="item.value"
          />
        </el-select>
      </vab-query-form-left-panel>
    </vab-query-form>
    <vab-chart />    
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
const queryKeyWordTrend = () => {
  keywordTrendChartVisible.value = true
}

const handleClose = () => {
  emit('updateVisible', false)
}
</script>

<style lang="scss" scoped>

</style>