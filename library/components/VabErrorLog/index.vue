<template>
  <div v-if="errorLogs.length > 0">
    <el-badge
      type="danger"
      :value="errorLogs.length"
      @click="dialogVisible = true"
    >
      <vab-icon icon="bug-line" />
    </el-badge>

    <el-dialog
      v-model="dialogVisible"
      append-to-body
      draggable
      title="shop-vite 异常捕获(温馨提示：错误必须解决)"
      width="60%"
    >
      <el-table border :data="errorLogs">
        <el-table-column label="报错路由">
          <template #default="{ row }">
            <a :href="row.url" target="_blank">
              <el-tag type="success">{{ row.url }}</el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="错误信息">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.err.message }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-tooltip :content="row.err.stack" effect="light">
              <el-button>错误详情</el-button>
            </el-tooltip>
            <a
              v-for="(item, index) in searchList"
              :key="index"
              :href="item.url + row.err.message"
              target="_blank"
            >
              <el-button>
                <vab-icon :icon="item.icon" />
                <span>{{ item.title }}</span>
              </el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="clearAll">暂不显示</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { useErrorLogStore } from '/@/store/modules/errorLog'

  defineOptions({
    name: 'VabErrorLog',
  })

  const errorLogStore = useErrorLogStore()
  const { errorLogs } = storeToRefs(errorLogStore)
  const { clearErrorLog } = errorLogStore
  const dialogVisible = ref<boolean>(false)
  const searchList = [
    {
      title: '百度搜索',
      url: 'https://www.baidu.com/baidu?wd=',
      icon: 'baidu-line',
    },
    {
      title: '谷歌搜索',
      url: 'https://www.google.com/search?q=',
      icon: 'google-line',
    },
  ]

  const clearAll = () => {
    dialogVisible.value = false
    clearErrorLog()
  }
</script>
