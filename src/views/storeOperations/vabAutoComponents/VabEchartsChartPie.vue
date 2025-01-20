<template>
  <vab-chart
    :option="option"
  />
</template>
  
<script lang="ts" setup>


defineOptions({
  name: 'VabEchartsChartPie',
})
  
const props = defineProps({
  data: {
    type: Array,
  },
})
  

const option = reactive<any>({
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
      data: props.data,
      // color: ['#ffdc4c', '#62d9ad', '#e65a56', '#00aeef'],
      color: [
        '#ffdc4c', // 金黄色
        '#62d9ad', // 青绿色
        '#e65a56', // 珊瑚红
        '#00aeef', // 天蓝色
        '#ffa500', // 橙色
        '#20c997', // 翠绿色
        '#f94d50', // 鲜红色
        '#0088cc', // 深天蓝色
        '#ffcc33', // 明黄色
        '#66cdaa', // 中青绿色
        '#d9534f', // 番茄红
        '#33b5e5', // 浅蓝色
        '#ffc107', // 柠檬黄
        '#3cb371', // 春绿色
        '#dc3545', // 枸杞红
        '#5bc0de'  // 宝石蓝
      ],
    },
  ],
})

</script>



