<template>
  <el-col :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
    <vab-card shadow="hover" skeleton>
      <template #header>
        <span>{{ title }}</span>
      </template>
      <vab-chart
        :init-options="initOptions"
        :option="option"
        theme="vab-echarts-theme"
      />
    </vab-card>
  </el-col>
</template>

<script lang="ts" setup>
  import _ from 'lodash'

  defineOptions({
    name: 'VabChartBar',
  })

  defineProps({
    title: {
      type: String,
      default: '',
    },
  })

  const initOptions = reactive({
    renderer: 'svg',
  })

  const option = reactive({
    grid: {
      top: 20,
      right: 20,
      bottom: 60,
      left: 40,
    },
    series: {
      type: 'treemap',
      data: [
        {
          name: 'nodeA',
          value: _.random(0, 10),
          children: [
            {
              name: 'nodeAa',
              value: _.random(0, 10),
            },
            {
              name: 'nodeAb',
              value: _.random(0, 10),
            },
          ],
        },
        {
          name: 'nodeB',
          value: _.random(0, 10),
          children: [
            {
              name: 'nodeBa',
              value: _.random(0, 10),
              children: [
                {
                  name: 'nodeBa1',
                  value: _.random(0, 10),
                },
              ],
            },
          ],
        },
      ],
    },
  })

  const timer = setInterval(() => {
    option.series.data = [
      {
        name: 'nodeA',
        value: _.random(0, 10),
        children: [
          {
            name: 'nodeAa',
            value: _.random(0, 10),
          },
          {
            name: 'nodeAb',
            value: _.random(0, 10),
          },
        ],
      },
      {
        name: 'nodeB',
        value: _.random(0, 10),
        children: [
          {
            name: 'nodeBa',
            value: _.random(0, 10),
            children: [
              {
                name: 'nodeBa1',
                value: _.random(0, 10),
              },
            ],
          },
        ],
      },
    ]
  }, 3000)

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>
