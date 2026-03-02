<template>
  <vab-dialog v-model="visible" title="统计采购量" width="70%">
    <div class="trend-dialog-content">
      <!-- 时间选择器 -->
      <div class="time-selector">
        <el-form inline>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="date"
              :clearable="false"
              :disabled-date="(time: Date) => time.getTime() > Date.now()"
              type="daterange"
              @change=""
            />
          </el-form-item>
          <el-form-item label="SKU">
            <el-select
              v-model="skuList"
              filterable
              :loading="skuLoading"
              multiple
              placeholder="请搜索SKU"
              remote
              :remote-method="remoteMethod"
              remote-show-suffix
              reserve-keyword
            >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 图表区域 -->
      <div class="chart-container">
        <div ref="chartContainer" v-loading="chartLoading" style="width: 100%; height: 550px"></div>
      </div>
    </div>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { getPoSkuList } from '~/src/api/devlocal/purchasePo'

defineOptions({
  name: 'PurchaseQuantityLineChart',
})

const visible = defineModel('visible', { default: false, required: true })
const date = defineModel<[string, string]>('date', { required: true })
const chartLoading = ref<boolean>(false)
const skuLoading = ref(false) //搜索SKU-loading
const options = ref<any[]>([]) //下拉选项列表
const skuList = ref<any[]>([]) //用户选中的SKU列表

const remoteMethod = async (query: string) => {
  query = query.trim()
  if (query) {
    skuLoading.value = true
    try {
      const { data } = await getPoSkuList({
        sku: query,
      })

      // 将搜索结果赋值给 options，而不是 skuList
      const searchResults = data.map((item: any) => {
        return { value: `${item}`, label: `${item}` }
      })

      options.value = searchResults
    } catch (error) {
      console.error('搜索SKU失败:', error)
      options.value = []
    } finally {
      skuLoading.value = false
    }
  } else {
    options.value = []
  }
}
</script>

<style lang="scss" scoped>
.trend-dialog-content {
  .time-selector {
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: center;
  }

  .chart-container {
    display: flex;
    justify-content: center;

    .chart-wrapper {
      height: 600px;
      width: 100%;
    }
  }
}
</style>
