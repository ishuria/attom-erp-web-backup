<template>
  <vab-card :body-style="{ height: '470px' }" class="inventory-products-total-value-card" skeleton>
    <template #header>
      <vab-icon icon="bar-chart-2-line" />
      库存货值
      <div class="right-select">
        <slot name="select"></slot>
      </div>
    </template>
    <vab-chart :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'
import { IGetFrontPageInventoryProductsTotalValue } from '/@/type/index/frontPage'

const props = withDefaults(
  defineProps<{
    data: IGetFrontPageInventoryProductsTotalValue[]
  }>(),
  {
    data: () => [],
  }
)
const emit = defineEmits(['update'])

defineOptions({
  name: 'InventoryProductsTotalValue',
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const option = reactive<any>({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(238, 246, 253, 0.7)',
    borderWidth: 0,
    confine: true,
    formatter: (params: any[]) => {
      let titleHtmlStr = `<div style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 8px;">${params[0].name}</div>`

      let fbaArrivedTotal = 0
      let fbaInTransitTotal = 0
      let fbaArrivedItems: any[] = []
      let fbaInTransitItems: any[] = []
      let otherItems: any[] = []

      params.forEach((item) => {
        const value = Number(item.value || 0)

        // 只处理数值不为0的项目
        if (value === 0) return

        // 直接根据系列名称判断类型
        if (item.seriesName === 'FBA已到库存') {
          fbaArrivedTotal += value
          fbaArrivedItems.push(item)
        } else if (item.seriesName === 'FBA在途库存') {
          fbaInTransitTotal += value
          fbaInTransitItems.push(item)
        } else {
          otherItems.push(item)
        }
      })

      // FBA已到库存分组
      const fbaArrivedHtml =
        fbaArrivedItems.length > 0
          ? `
        <div style="background: #fff; padding: 3px 8px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); margin-bottom: 5px;">
          <div style="display: flex; justify-content: space-between; color: #333; font-size: 13px">
            <div style="display: flex; align-items: center;">
              <span style="
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #52c41a;
                margin-right: 9px;
                color: #333;
              "></span>
              <span>FBA已到库存</span>
            </div>
            <span style="font-weight: bold; color: #333;">¥${fbaArrivedTotal.toLocaleString()}</span>
          </div>
          <div style="margin-top: 2px; padding-left: 10px;">
            ${fbaArrivedItems
              .map((item, index) => {
                const siteDetails = item.data?.siteDetails || []
                return siteDetails
                  .filter((site: any) => site.value > 0)
                  .map(
                    (site: any) => `
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 1px;">
                        <div style="display: flex; align-items: center;">${item.marker}<span style="margin-left: 5px;">${site.siteName}</span></div>
                        <span>¥${site.value.toLocaleString()}</span>
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

      // FBA在途库存分组
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
              <span>FBA在途库存</span>
            </div>
            <span style="font-weight: bold; color: #333;">¥${fbaInTransitTotal.toLocaleString()}</span>
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
                        <span>¥${site.value.toLocaleString()}</span>
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

      // 其他项目（货值类型）
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
            <span style="font-weight: bold; color: #333;">¥${formattedValue}</span>
          </div>
        `
      })

      return `
        <div style="padding: 0px; border-radius: 20px; width: 220px;">
          ${titleHtmlStr}
          ${otherHtmlArr.join('')}
          ${fbaArrivedHtml}
          ${fbaInTransitHtml}
        </div>
      `
    },
  },
  legend: {
    data: ['库存产品总货值', '未付货款', 'FBA已到库存', 'FBA在途库存'],
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
    name: '金额',
    position: 'left',
    show: true,
  },
  series: [
    {
      name: '库存产品总货值',
      type: 'line',
      yAxisIndex: 0,
      data: [],
      smooth: true,
      lineStyle: {
        color: '#1890ff',
        width: 2,
      },
      itemStyle: {
        color: '#1890ff',
        borderWidth: 2,
        borderColor: '#fff',
      },
    },
    {
      name: '未付货款',
      type: 'line',
      yAxisIndex: 0,
      data: [],
      smooth: true,
      lineStyle: {
        color: '#ff7875',
        width: 2,
      },
      itemStyle: {
        color: '#ff7875',
        borderWidth: 2,
        borderColor: '#fff',
      },
    },
    {
      name: 'FBA已到库存',
      type: 'line',
      yAxisIndex: 0,
      data: [],
      smooth: true,
      lineStyle: {
        color: '#52c41a',
        width: 2,
      },
      itemStyle: {
        color: '#52c41a',
        borderWidth: 2,
        borderColor: '#fff',
      },
    },
    {
      name: 'FBA在途库存',
      type: 'line',
      yAxisIndex: 0,
      data: [],
      smooth: true,
      lineStyle: {
        color: '#13c2c2',
        width: 2,
      },
      itemStyle: {
        color: '#13c2c2',
        borderWidth: 2,
        borderColor: '#fff',
      },
    },
  ],
})

watch(
  () => props.data,
  () => {
    if (!props.data || !Array.isArray(props.data) || props.data.length === 0) return

    option.xAxis.data = props.data.map((item) => item.date)
    option.series[0].data = props.data.map((item) => item.totalValue)
    option.series[1].data = props.data.map((item) => item.unpaidGoods)

    // 处理FBA库存数据 - 计算总值
    if (props.data.length > 0) {
      // 计算FBA已到库存总金额
      option.series[2].data = props.data.map((item) => {
        const totalValue = item.fbaArrivedInventory?.reduce((sum, siteData) => sum + (siteData.value || 0), 0) || 0
        return {
          value: totalValue,
          siteDetails: item.fbaArrivedInventory || [],
        }
      })

      // 计算FBA在途库存总值
      option.series[3].data = props.data.map((item) => {
        const totalValue = item.fbaInTransitInventory?.reduce((sum, siteData) => sum + (siteData.value || 0), 0) || 0
        return {
          value: totalValue,
          siteDetails: item.fbaInTransitInventory || [],
        }
      })
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.card-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.inventory-products-total-value-card {
  :deep() {
    .echarts {
      height: 430px !important;
    }
  }
  .right-select {
    position: absolute;
    top: 50%;
    right: 20px;
    width: 330px;
    height: 60px;
    line-height: 60px;
    text-align: right;
    transform: translateY(-50%);

    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
