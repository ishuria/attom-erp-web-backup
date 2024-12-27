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
    default: [],
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
      startAngle: 30, //起始角度
      label: {
        show: false,
      },
      data: props.data,
      color: ['#ffdc4c', '#62d9ad', '#e65a56', '#00aeef'],
    },
  ],
})

onMounted(() => {
  
})

onBeforeUnmount(() => {
})

</script>



