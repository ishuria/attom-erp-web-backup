<template>
    <vab-chart :option="option" />
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
    name: 'VabEchaartsChartBar',
})

let props = defineProps({
    xAxisData: {
        type: Array,
        default: [],
    },
    yAxisData: {
        type: Array,
        default: [],
    },
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const option = reactive<any>({
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        axisLine: {
            show: true, 
            lineStyle: {
                color: '#1f2a62'
            }, 
        },
        axisLabel: {
            interval: 0, 
            rotate: -60, 
            inside: false, 
            margin: 6,
        },
        data: props.xAxisData,
        name:"时间"

    },
    yAxis: {
        axisLine: {
            show: true,
            axisLabel :{
                interval:0
            },
            lineStyle: {
                color: '#1f2a62'
            }
        },
        type: 'value',
        name: '关键词排名'
    },
    series: [
        {
            type: 'line',
            data:  props.yAxisData,
        }
    ]
})
watch(
    () => [props.xAxisData,props.yAxisData,theme.value],
    () => {
        option.series.data = props.yAxisData
        option.xAxis.data = props.xAxisData
        option.color = [theme.value.color]
    },
    { immediate: true },
)

onMounted(() => {
    
})

onBeforeUnmount(() => {
    
})
</script>