<template>
  <div class="detail-container">
    <el-page-header :content="'【' + title + '】详情页面'" @back="goBack" />
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
          刷新商品管理页面
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

<script>
  import { useTabsStore } from '@/store/modules/tabs'
  import { handleActivePath } from '@/utils/routes'
  import { Refresh } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'Detail',
    setup() {
      const route = useRoute()
      const router = useRouter()

      const $pub = inject('$pub')

      const tabsStore = useTabsStore()
      const { changeTabsMeta, delVisitedRoute } = tabsStore

      const state = reactive({
        route: { query: { title: '加载中' } },
        rate: 0,
        form: {
          text: '',
        },
        title: '加载中',
      })

      const goBack = async () => {
        const detailPath = await handleActivePath(route, true)
        await router.push('/goods/goodsManagement')
        await delVisitedRoute(detailPath)
      }

      const handleRefreshMainPage = () => {
        $pub('reload-router-view', 'GoodsManagement')
      }

      onMounted(() => {
        changeTabsMeta({
          title: '详情页',
          meta: {
            title: `${route.query.title} 详情页`,
          },
        })
        state.title = route.query.title
        state.route = {
          path: route.path,
          params: route.params,
          query: { ...route.query, ...{ rate: parseInt(route.query.rate) } },
          name: route.name,
          meta: route.meta,
        }
      })

      return {
        ...toRefs(state),
        goBack,
        handleRefreshMainPage,
        Refresh,
      }
    },
  })
</script>
