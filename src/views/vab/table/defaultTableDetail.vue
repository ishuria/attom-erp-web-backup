<template>
  <div class="detail-container">
    <el-page-header
      :content="'【' + route.query.title + '】详情页面'"
      @back="goBack"
    />
    <el-alert
      :closable="false"
      show-icon
      title="详情页菜单高亮，并缓存详情页，返回上一页再次打开可看到效果，dynamicNewTab可配置详情页只打开一个tab页还是可以根据参数不同无限打开多个，当前展示的是可以打开多个"
      type="success"
    />
    <el-form inline :model="form">
      <el-form-item label="输入框缓存">
        <el-input v-model="form.text" />
      </el-form-item>
      <el-form-item :label-width="0">
        <el-button
          :icon="Refresh"
          type="primary"
          @click="handleRefreshMainPage"
        >
          刷新默认表格页面
        </el-button>
      </el-form-item>
    </el-form>

    <el-descriptions border :column="3" title="详情">
      <template #extra>
        <el-button size="small" type="primary">操作</el-button>
      </template>
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
      <el-descriptions-item>
        <template #label>
          <i class="el-icon-office-building"></i>
          联系地址
        </template>
        江苏省苏州市吴中区吴中大道 1188 号
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts" setup>
  import { useTabsStore } from '/@/store/modules/tabs'
  import { handleActivePath } from '/@/utils/routes'
  import { Refresh } from '@element-plus/icons-vue'

  defineOptions({
    name: 'ComprehensiveTableDetail',
  })

  const route: any = useRoute()
  const router: any = useRouter()

  const $pub = inject<any>('$pub')

  const tabsStore = useTabsStore()
  const { changeTabsMeta, delVisitedRoute } = tabsStore

  const form = reactive<any>({ text: '' })

  const goBack = async () => {
    await router.push('/vab/table/defaultTable')
    await delVisitedRoute(handleActivePath(route, true))
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
