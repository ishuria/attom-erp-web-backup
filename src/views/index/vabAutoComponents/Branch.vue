<template>
  <vab-card class="branch">
    <template #header>
      <vab-icon icon="donut-chart-fill" />
      分布
    </template>
    <vab-chart class="branch-echart" :option="option" />
  </vab-card>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'

  const settingsStore = useSettingsStore()
  const { color } = storeToRefs(settingsStore)
  const option = reactive({
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['50%', '70%'],
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2,
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        data: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' },
          { value: 300, name: '视频广告' },
        ],
      },
    ],
  })

  watch(
    color,
    () => {
      option.color = [color.value]
    },
    { immediate: true }
  )
</script>
