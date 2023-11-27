<template>
  <div class="change-log-container no-background-container">
    <el-row :gutter="20">
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <vab-card
          :body-style="{
            height: 'calc(var(--el-container-height) - 57px)',
          }"
        >
          <template #header>
            <vab-icon icon="file-word-line" />
            更新日志
          </template>
          <el-scrollbar style="height: 100%">
            <el-timeline style="margin-top: 5px">
              <el-timeline-item v-for="(item, index) in activities" :key="index" :color="item.color" :timestamp="item.timestamp">
                <template v-if="item.waver" #dot>
                  <span
                    class="vab-dot"
                    :class="{
                      ['vab-dot-' + item.waver]: true,
                    }"
                  >
                    <span></span>
                  </span>
                </template>
                <vab-card v-if="item.card">
                  <div class="change-log-item" v-html="item.content"></div>
                </vab-card>
                <template v-else>
                  <div class="change-log-item" v-html="item.content"></div>
                </template>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { getList } from '/@/api/changeLog'

defineOptions({
  name: 'ChangeLog',
})

const lastTime = dayjs().format('YYYY-MM-DD')
const commonUrl = `https://vue-admin-beautiful.com`
const activities = ref<any[]>([])

interface Log {
  timestamp: string
  content: string
}

const sortLogs = (logs: Log[]): Log[] => {
  return logs.sort((a, b) => {
    const d1 = new Date(a.timestamp)
    const d2 = new Date(b.timestamp)

    if (d1 < d2) {
      return 1
    } else if (d1 > d2) {
      return -1
    } else {
      return 0
    }
  })
}

onBeforeMount(async () => {
  const { data } = await getList()
  // const _data = data.map((obj: any) => {
  //   return { ...obj, color: 'var(--el-timeline-node-color)' }
  // })
  data.push({
    timestamp: lastTime,
    content: `
    温馨提示：
    <br />
    小版本更新日志及bug修复日志演示地址不做展示，具体更新内容以购买者绑定仓库提交日志为准
    <a href='${commonUrl}/authorization/shop-vite.html' target='_blank'>点我购买</a>
    `,
    waver: 'success',
  })
  console.log(sortLogs(data))
  activities.value = sortLogs(data)
})
</script>

<style lang="scss" scoped>
.change-log-container {
  .change-log-item {
    line-height: 24px;
  }

  :deep() {
    .el-timeline-item__dot {
      .vab-dot {
        left: -1px;
        width: 12px;
        height: 12px;
        margin: auto !important;
      }
    }
  }
}
</style>
