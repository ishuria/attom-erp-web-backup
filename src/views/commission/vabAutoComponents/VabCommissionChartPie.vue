<template>
  <vab-chart
    :option="option"
  />
</template>
  
<script lang="ts" setup>
import { colorList } from '/@/views/commission/constantOption'

defineOptions({
  name: 'VabCommissionChartPie',
})
  
const props = defineProps({
  data: {
    type: Array,
  },
})
  

const option = reactive<any>({
  tooltip: {
    show: true,
    confine: true,
    // formatter: '{c}',
    formatter: (params: any) => {
        const contentHtmlStr = `<div>
          ￥${params.data.trueValue}
        </div>`

        return contentHtmlStr
      },
    textStyle: {
      fontSize: 14, // 设置字体大小
    },
    padding: [0, 5], // 设置内边距，调整提示框的宽高
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: '100%',
      emphasis: {
        scale: false
      },
      startAngle: 90, //起始角度
      label: {
        show: false,
      },
      stillShowZeroSum: false,
      data: [],
    },
  ],
})

watch(
  () => [props.data],
  () => {
    // 先排序数据
    const sortedData = props.data?.slice().sort((a: any, b: any) => b.value - a.value)
    
    // 为每个数据项分配固定的颜色
    option.series[0].data = sortedData?.map((item: any, index: number) => ({
      ...item,
      itemStyle: {
        color: colorList[index % colorList.length]
      }
    }))
  },
  { immediate: true, deep: true }
)
</script>



