<!-- 旭日图 -->
<script lang="ts" setup>
  import { random } from 'lodash-es'
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabChartSunburst',
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
      bottom: 20,
      left: 20,
    },
    series: {
      type: 'sunburst',
      data: [
        {
          children: [
            {
              value: random(0, 40),
              children: [
                {
                  value: random(0, 40),
                },
                {
                  value: random(0, 40),
                  children: [
                    {
                      value: random(0, 40),
                    },
                  ],
                },
                {
                  children: [
                    {
                      value: random(0, 40),
                    },
                  ],
                },
              ],
            },
            {
              value: random(0, 40),
              children: [
                {
                  value: random(0, 40),
                  children: [
                    {
                      value: random(0, 40),
                    },
                    {
                      value: random(0, 40),
                    },
                    {
                      value: random(0, 40),
                    },
                    {
                      value: random(0, 40),
                    },
                  ],
                },
                {
                  value: random(0, 40),
                  children: [
                    {
                      value: random(0, 40),
                    },
                  ],
                },
                {
                  children: [
                    {
                      value: random(0, 40),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          value: random(0, 40),
          children: [
            {
              value: random(0, 40),
              children: [
                {
                  value: random(0, 40),
                },
                {
                  children: [
                    {
                      value: random(0, 40),
                    },
                  ],
                },
              ],
            },
            {
              children: [
                {
                  value: random(0, 40),
                  children: [
                    {
                      value: random(0, 40),
                    },
                    {
                      value: random(0, 40),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          value: random(0, 40),
          children: [
            {
              children: [
                {
                  value: random(0, 40),
                },
                {
                  value: random(0, 40),
                  children: [
                    {
                      value: random(0, 40),
                    },
                    {
                      value: random(0, 40),
                    },
                  ],
                },
                {
                  value: random(0, 40),
                  children: [
                    {
                      value: random(0, 40),
                    },
                    {
                      value: random(0, 40),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          children: [
            {
              value: random(0, 40),
              children: [
                {
                  value: random(0, 40),
                },
                {
                  value: random(0, 40),
                  children: [
                    {
                      value: random(0, 40),
                    },
                  ],
                },
                {
                  value: random(0, 40),
                },
              ],
            },
            {
              value: random(0, 40),
              children: [
                {
                  value: random(0, 40),
                },
                {
                  children: [
                    {
                      value: random(0, 40),
                    },
                  ],
                },
                {
                  value: random(0, 40),
                },
              ],
            },
          ],
        },
      ],
      radius: ['10%', '100%'],
      label: {
        rotate: 'radial',
      },
    },
  })

  const timer = setInterval(() => {
    option.series.data = [
      {
        children: [
          {
            value: random(0, 40),
            children: [
              {
                value: random(0, 40),
              },
              {
                value: random(0, 40),
                children: [
                  {
                    value: random(0, 40),
                  },
                ],
              },
              {
                children: [
                  {
                    value: random(0, 40),
                  },
                ],
              },
            ],
          },
          {
            value: random(0, 40),
            children: [
              {
                value: random(0, 40),
                children: [
                  {
                    value: random(0, 40),
                  },
                  {
                    value: random(0, 40),
                  },
                  {
                    value: random(0, 40),
                  },
                  {
                    value: random(0, 40),
                  },
                ],
              },
              {
                value: random(0, 40),
                children: [
                  {
                    value: random(0, 40),
                  },
                ],
              },
              {
                children: [
                  {
                    value: random(0, 40),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        value: random(0, 40),
        children: [
          {
            value: random(0, 40),
            children: [
              {
                value: random(0, 40),
              },
              {
                children: [
                  {
                    value: random(0, 40),
                  },
                ],
              },
            ],
          },
          {
            children: [
              {
                value: random(0, 40),
                children: [
                  {
                    value: random(0, 40),
                  },
                  {
                    value: random(0, 40),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        value: random(0, 40),
        children: [
          {
            children: [
              {
                value: random(0, 40),
              },
              {
                value: random(0, 40),
                children: [
                  {
                    value: random(0, 40),
                  },
                  {
                    value: random(0, 40),
                  },
                ],
              },
              {
                value: random(0, 40),
                children: [
                  {
                    value: random(0, 40),
                  },
                  {
                    value: random(0, 40),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            value: random(0, 40),
            children: [
              {
                value: random(0, 40),
              },
              {
                value: random(0, 40),
                children: [
                  {
                    value: random(0, 40),
                  },
                ],
              },
              {
                value: random(0, 40),
              },
            ],
          },
          {
            value: random(0, 40),
            children: [
              {
                value: random(0, 40),
              },
              {
                children: [
                  {
                    value: random(0, 40),
                  },
                ],
              },
              {
                value: random(0, 40),
              },
            ],
          },
        ],
      },
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
