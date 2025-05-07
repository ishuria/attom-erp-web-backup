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
      data: props.data,
     
      // color: ['#ffdc4c', '#62d9ad', '#e65a56', '#00aeef'],
      color: colorList,
    },
  ],
})

watch(
  () => [props.data],
  () => {
      option.series[0].data = props.data
  },
  { immediate: true },
)
</script>



