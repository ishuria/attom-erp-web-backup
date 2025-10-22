<template>
  <vab-card :body-style="{ height: '470px' }" class="warehouse-capacity-card" skeleton>
    <template #header>
      <vab-icon icon="bar-chart-2-line" />
      仓库容量
      <div class="right-select">
        <el-radio-group v-model="displayType" size="small" @change="handleDisplayTypeChange">
          <el-radio-button label="quantity">产品数量</el-radio-button>
          <el-radio-button label="volume">产品体积</el-radio-button>
        </el-radio-group>
        <slot name="select"></slot>
      </div>
    </template>
    <vab-chart :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'
import { IWarehouseCapacityItem } from '/@/type/index/frontPage'

defineOptions({
  name: 'WarehouseCapacity',
})

const props = withDefaults(
  defineProps<{
    data: IWarehouseCapacityItem[]
  }>(),
  {
    data: () => [],
  }
)
const emit = defineEmits(['update'])

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

// 显示类型：数量或体积
const displayType = ref<'quantity' | 'volume'>('quantity')

// 图表配置
const option = reactive<any>({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(238, 246, 253, 0.7)',
    borderWidth: 0,
    confine: true,
    formatter: (params: any[]) => {
      let titleHtmlStr = `<div style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 8px;">${params[0].name}</div>`

      const yAxisName = displayType.value === 'quantity' ? '产品数量' : '产品体积(m³)'
      const unit = displayType.value === 'volume' ? 'm³' : ''

      let fbaInTransitTotal = 0
      let fbaAvailableTotal = 0
      let fbaInTransitItems: any[] = []
      let fbaAvailableItems: any[] = []
      let otherItems: any[] = []

      params.forEach((item) => {
        const value = Number(item.value || 0)

        // 只处理数值不为0的项目
        if (value === 0) return

        // 根据系列名称判断类型
        if (item.seriesName === 'FBA在途') {
          fbaInTransitTotal += value
          fbaInTransitItems.push(item)
        } else if (item.seriesName === 'FBA可售') {
          fbaAvailableTotal += value
          fbaAvailableItems.push(item)
        } else {
          otherItems.push(item)
        }
      })

      // FBA在途分组
      const fbaInTransitHtml =
        fbaInTransitItems.length > 0
          ? `
        <div style="background: #fff; padding: 3px 8px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); margin-bottom: 5px;">
          <div style="display: flex; justify-content: space-between; color: #333; font-size: 13px">
            <div style="display: flex; align-items: center;">
              <span style="
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #13c2c2;
                margin-right: 9px;
                color: #333;
              "></span>
              <span>FBA在途</span>
            </div>
            <span style="font-weight: bold; color: #333;">${fbaInTransitTotal.toLocaleString()}${unit}</span>
          </div>
          <div style="margin-top: 2px; padding-left: 10px;">
            ${fbaInTransitItems
              .map((item, index) => {
                const siteDetails = item.data?.siteDetails || []
                return siteDetails
                  .filter((site: any) => site.value > 0)
                  .map(
                    (site: any) => `
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 1px;">
                        <div style="display: flex; align-items: center;">${item.marker}<span style="margin-left: 5px;">${site.siteName}</span></div>
                        <span>${site.value.toLocaleString()}${unit}</span>
                      </div>
                    `
                  )
                  .join('')
              })
              .join('')}
          </div>
        </div>
      `
          : ''

      // FBA可售分组
      const fbaAvailableHtml =
        fbaAvailableItems.length > 0
          ? `
        <div style="background: #fff; padding: 3px 8px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); margin-bottom: 5px;">
          <div style="display: flex; justify-content: space-between; color: #333; font-size: 13px">
            <div style="display: flex; align-items: center;">
              <span style="
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #1890ff;
                margin-right: 9px;
                color: #333;
              "></span>
              <span>FBA可售</span>
            </div>
            <span style="font-weight: bold; color: #333;">${fbaAvailableTotal.toLocaleString()}${unit}</span>
          </div>
          <div style="margin-top: 2px; padding-left: 10px;">
            ${fbaAvailableItems
              .map((item, index) => {
                const siteDetails = item.data?.siteDetails || []
                return siteDetails
                  .filter((site: any) => site.value > 0)
                  .map(
                    (site: any) => `
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 1px;">
                        <div style="display: flex; align-items: center;">${item.marker}<span style="margin-left: 5px;">${site.siteName}</span></div>
                        <span>${site.value.toLocaleString()}${unit}</span>
                      </div>
                    `
                  )
                  .join('')
              })
              .join('')}
          </div>
        </div>
      `
          : ''

      // 其他项目（非FBA分类）
      const otherHtmlArr = otherItems.map((item) => {
        const name = item.seriesName
        const value = item.value
        const formattedValue = typeof value === 'number' ? value.toLocaleString() : value
        return `
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            padding: 3px 8px;
            margin-bottom: 5px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            font-size: 13px;
          ">
            <div style="display: flex; align-items: center;">
              ${item.marker}
              <span style="color: #333; margin-left: 6px;">${name}</span>
            </div>
            <span style="font-weight: bold; color: #333;">${formattedValue}${unit}</span>
          </div>
        `
      })

      return `
        <div style="padding: 0px; border-radius: 20px; width: 220px;">
          ${titleHtmlStr}
          ${otherHtmlArr.join('')}
          ${fbaInTransitHtml}
          ${fbaAvailableHtml}
        </div>
      `
    },
  },
  legend: {
    data: [],
    bottom: '0%',
  },
  grid: {
    top: '10%',
    left: '2%',
    right: '4%',
    bottom: '10%',
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
    name: '产品数量',
    position: 'left',
    show: true,
  },
  series: [],
})

// 5个分类的配置
const categoryConfig = {
  quantity: {
    yAxisName: '产品数量',
    series: [
      {
        name: '未到国内仓',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#ff7875', width: 2 },
        itemStyle: { color: '#ff7875', borderWidth: 2, borderColor: '#fff' },
      },
      {
        name: '待打包',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#faad14', width: 2 },
        itemStyle: { color: '#faad14', borderWidth: 2, borderColor: '#fff' },
      },
      {
        name: '已打包完成',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#52c41a', width: 2 },
        itemStyle: { color: '#52c41a', borderWidth: 2, borderColor: '#fff' },
      },
      {
        name: 'FBA在途',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#13c2c2', width: 2 },
        itemStyle: { color: '#13c2c2', borderWidth: 2, borderColor: '#fff' },
      },
      {
        name: 'FBA可售',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#1890ff', width: 2 },
        itemStyle: { color: '#1890ff', borderWidth: 2, borderColor: '#fff' },
      },
    ],
  },
  volume: {
    yAxisName: '产品体积(m³)',
    series: [
      {
        name: '未到国内仓',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#ff7875', width: 2 },
        itemStyle: { color: '#ff7875', borderWidth: 2, borderColor: '#fff' },
      },
      {
        name: '待打包',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#faad14', width: 2 },
        itemStyle: { color: '#faad14', borderWidth: 2, borderColor: '#fff' },
      },
      {
        name: '已打包完成',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#52c41a', width: 2 },
        itemStyle: { color: '#52c41a', borderWidth: 2, borderColor: '#fff' },
      },
      {
        name: 'FBA在途',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#13c2c2', width: 2 },
        itemStyle: { color: '#13c2c2', borderWidth: 2, borderColor: '#fff' },
      },
      {
        name: 'FBA可售',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: { color: '#1890ff', width: 2 },
        itemStyle: { color: '#1890ff', borderWidth: 2, borderColor: '#fff' },
      },
    ],
  },
}

// 初始化图表配置
const initChartConfig = () => {
  const config = categoryConfig[displayType.value]
  option.yAxis.name = config.yAxisName
  option.legend.data = config.series.map((s) => s.name)
  option.series = config.series
}

// 切换显示类型
const handleDisplayTypeChange = () => {
  initChartConfig()
  updateChartData()
}

// 更新图表数据
const updateChartData = () => {
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) return

  option.xAxis.data = props.data.map((item) => item.date)

  // 根据显示类型更新数据
  if (displayType.value === 'quantity') {
    option.series[0].data = props.data.map((item) => item.notArrivedQuantity || 0)
    option.series[1].data = props.data.map((item) => item.pendingPackQuantity || 0)
    option.series[2].data = props.data.map((item) => item.packedQuantity || 0)

    // FBA在途数量 - 计算总值并保存站点详情
    option.series[3].data = props.data.map((item) => {
      const totalValue = item.fbaInTransitQuantity?.reduce((sum, siteData) => sum + (siteData.value || 0), 0) || 0
      return {
        value: totalValue,
        siteDetails: item.fbaInTransitQuantity || [],
      }
    })

    // FBA可售数量 - 计算总值并保存站点详情
    option.series[4].data = props.data.map((item) => {
      const totalValue = item.fbaAvailableQuantity?.reduce((sum, siteData) => sum + (siteData.value || 0), 0) || 0
      return {
        value: totalValue,
        siteDetails: item.fbaAvailableQuantity || [],
      }
    })
  } else {
    option.series[0].data = props.data.map((item) => item.notArrivedVolume || 0)
    option.series[1].data = props.data.map((item) => item.pendingPackVolume || 0)
    option.series[2].data = props.data.map((item) => item.packedVolume || 0)

    // FBA在途体积 - 计算总值并保存站点详情
    option.series[3].data = props.data.map((item) => {
      const totalValue = item.fbaInTransitVolume?.reduce((sum, siteData) => sum + (siteData.value || 0), 0) || 0
      return {
        value: totalValue,
        siteDetails: item.fbaInTransitVolume || [],
      }
    })

    // FBA可售体积 - 计算总值并保存站点详情
    option.series[4].data = props.data.map((item) => {
      const totalValue = item.fbaAvailableVolume?.reduce((sum, siteData) => sum + (siteData.value || 0), 0) || 0
      return {
        value: totalValue,
        siteDetails: item.fbaAvailableVolume || [],
      }
    })
  }
}

// 更新数据
const updateWarehouseCapacity = async () => {
  // TODO: 调用API更新数据
  $baseMessage('更新成功', 'success', 'hey')
  emit('update')
}

// 监听数据变化
watch(
  () => props.data,
  () => {
    updateChartData()
  },
  { immediate: true }
)

// 初始化
onMounted(() => {
  initChartConfig()
})
</script>

<style lang="scss" scoped>
.warehouse-capacity-card {
  :deep() {
    .echarts {
      height: 430px !important;
    }
  }
  .right-select {
    position: absolute;
    top: 50%;
    right: 20px;
    height: 60px;
    line-height: 60px;
    text-align: right;
    transform: translateY(-50%);

    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;

    .el-radio-group {
      flex-shrink: 0;
      .el-radio-button__inner {
        padding: 4px 12px;
        font-size: 12px;
      }
    }

    .el-date-picker {
      flex-shrink: 0;
    }

    .el-button {
      flex-shrink: 0;
    }
  }
}
</style>
