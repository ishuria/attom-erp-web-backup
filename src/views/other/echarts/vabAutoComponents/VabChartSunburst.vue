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
    name: 'VabChartSunburst',
  })

  defineProps({
    title: {
      type: String,
      default: '',
    },
  })

  const initOptions = reactive<any>({
    renderer: 'svg',
  })

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
              value: _.random(0, 40),
              children: [
                {
                  value: _.random(0, 40),
                },
                {
                  value: _.random(0, 40),
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
                {
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
              ],
            },
            {
              value: _.random(0, 40),
              children: [
                {
                  value: _.random(0, 40),
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                    {
                      value: _.random(0, 40),
                    },
                    {
                      value: _.random(0, 40),
                    },
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
                {
                  value: _.random(0, 40),
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
                {
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          value: _.random(0, 40),
          children: [
            {
              value: _.random(0, 40),
              children: [
                {
                  value: _.random(0, 40),
                },
                {
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
              ],
            },
            {
              children: [
                {
                  value: _.random(0, 40),
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          value: _.random(0, 40),
          children: [
            {
              children: [
                {
                  value: _.random(0, 40),
                },
                {
                  value: _.random(0, 40),
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
                {
                  value: _.random(0, 40),
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                    {
                      value: _.random(0, 40),
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
              value: _.random(0, 40),
              children: [
                {
                  value: _.random(0, 40),
                },
                {
                  value: _.random(0, 40),
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
                {
                  value: _.random(0, 40),
                },
              ],
            },
            {
              value: _.random(0, 40),
              children: [
                {
                  value: _.random(0, 40),
                },
                {
                  children: [
                    {
                      value: _.random(0, 40),
                    },
                  ],
                },
                {
                  value: _.random(0, 40),
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
            value: _.random(0, 40),
            children: [
              {
                value: _.random(0, 40),
              },
              {
                value: _.random(0, 40),
                children: [
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
              {
                children: [
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
            ],
          },
          {
            value: _.random(0, 40),
            children: [
              {
                value: _.random(0, 40),
                children: [
                  {
                    value: _.random(0, 40),
                  },
                  {
                    value: _.random(0, 40),
                  },
                  {
                    value: _.random(0, 40),
                  },
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
              {
                value: _.random(0, 40),
                children: [
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
              {
                children: [
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        value: _.random(0, 40),
        children: [
          {
            value: _.random(0, 40),
            children: [
              {
                value: _.random(0, 40),
              },
              {
                children: [
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
            ],
          },
          {
            children: [
              {
                value: _.random(0, 40),
                children: [
                  {
                    value: _.random(0, 40),
                  },
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        value: _.random(0, 40),
        children: [
          {
            children: [
              {
                value: _.random(0, 40),
              },
              {
                value: _.random(0, 40),
                children: [
                  {
                    value: _.random(0, 40),
                  },
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
              {
                value: _.random(0, 40),
                children: [
                  {
                    value: _.random(0, 40),
                  },
                  {
                    value: _.random(0, 40),
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
            value: _.random(0, 40),
            children: [
              {
                value: _.random(0, 40),
              },
              {
                value: _.random(0, 40),
                children: [
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
              {
                value: _.random(0, 40),
              },
            ],
          },
          {
            value: _.random(0, 40),
            children: [
              {
                value: _.random(0, 40),
              },
              {
                children: [
                  {
                    value: _.random(0, 40),
                  },
                ],
              },
              {
                value: _.random(0, 40),
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
