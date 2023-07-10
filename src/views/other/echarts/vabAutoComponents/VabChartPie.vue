<!-- 饼状图 -->
<template>
  <el-col :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
    <vab-card skeleton>
      <template #header>
        <span>{{ title }}</span>
      </template>
      <vab-chart :option="option" />
    </vab-card>
  </el-col>
</template>

<script lang="ts" setup>
  import _ from 'lodash'
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabChartPie',
  })

  defineProps({
    title: {
      type: String,
      default: '',
    },
  })

  const settingsStore = useSettingsStore()
  const { color } = storeToRefs(settingsStore)

  const option = reactive<any>({
    grid: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 40,
    },
    tooltip: {
      trigger: 'item',
    },
    series: {
      name: '访问来源',
      type: 'pie',
      radius: ['40%', '80%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: _.random(0, 100), name: '搜索引擎' },
        { value: _.random(0, 100), name: '直接访问' },
        { value: _.random(0, 100), name: '邮件营销' },
        { value: _.random(0, 100), name: '联盟广告' },
        { value: _.random(0, 100), name: '视频广告' },
      ],
    },
  })

  const timer = setInterval(() => {
    option.series.data = [
      { value: _.random(0, 100), name: '搜索引擎' },
      { value: _.random(0, 100), name: '直接访问' },
      { value: _.random(0, 100), name: '邮件营销' },
      { value: _.random(0, 100), name: '联盟广告' },
      { value: _.random(0, 100), name: '视频广告' },
    ]
  }, 3000)

  watch(
    color,
    () => {
      option.color = [color.value]
    },
    { immediate: true }
  )

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>
