<script lang="ts" setup>
  import { useTabsStore } from '/@/store/modules/tabs'
  import { handleActivePath } from '/@/utils/routes'
  import { Refresh } from '@element-plus/icons-vue'

  defineOptions({
    name: 'DefaultTableDetail',
  })

  const route: any = useRoute()
  const $pub = inject<any>('$pub')
  const tabsStore = useTabsStore()
  const { changeTabsMeta, delVisitedRoute } = tabsStore
  const form = reactive<any>({ text: '' })

  const goBack = async () => {
    await delVisitedRoute(handleActivePath(route, true))
    history.go(-1)
  }

  const handleRefreshMainPage = () => {
    $pub('reload-router-view', 'DefaultTable')
  }

  onMounted(() => {
    changeTabsMeta({
      title: '详情页',
      meta: {
        title: `${route.query.title} 详情页`,
      },
    })
  })
</script>

<template>
  <div class="default-table-detail-container">
    <el-page-header
      :content="'【' + route.query.title + '】详情页面'"
      @back="goBack"
    />
    <el-alert
      :closable="false"
      title="详情页演示共用demo，所有表格都会跳转详情至此页面，菜单高亮至【默认表格】，当前详情页允许多开"
    />
    <el-form inline :model="form">
      <el-form-item label="输入框缓存">
        <el-input v-model="form.text" clearable />
      </el-form-item>
      <el-form-item>
        <el-button
          :icon="Refresh"
          type="primary"
          @click="handleRefreshMainPage"
        >
          刷新默认表格页面
        </el-button>
      </el-form-item>
    </el-form>

    <el-descriptions border :column="2" title="详情">
      <el-descriptions-item>
        <template #label>标题</template>
        {{ route.query.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>作者</template>
        {{ route.query.author }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>时间</template>
        {{ route.query.datetime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>评级</template>
        <el-rate v-model="route.query.rate" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>备注</template>
        {{ route.query.description }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style lang="scss" scoped>
  .default-table-detail-container {
    :deep() {
      .el-form--inline {
        .el-form-item {
          margin-right: 10px;
        }
      }

      .el-descriptions__label {
        min-width: 80px !important;
        text-align: right;
      }
    }
  }
</style>
