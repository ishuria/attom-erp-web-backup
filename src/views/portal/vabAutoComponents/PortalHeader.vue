<template>
  <header>
    <div class="index-nav">
      <div class="logo">
        <a href="#/portal"></a>
        <span class="logo-title">Vue Shop Vite</span>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabsList" :key="index" :label="item.label" :name="item.name" />
      </el-tabs>
    </div>
  </header>
</template>

<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import router from '~/src/router'

defineOptions({
  name: 'PortalHeader',
})

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'portal',
  },
})

const el = ref<any>(null)
const activeName = ref<any>(props.activeMenu)
const tabsList = reactive<any>([
  {
    label: '主页',
    name: 'portal',
  },
  {
    label: '产品简介',
    name: 'product',
  },
  {
    label: '合作伙伴',
    name: 'partner',
  },
  {
    label: '后台管理',
    name: 'index',
  },
])

const handleClick = (tab: TabsPaneContext) => {
  router.push(`/${tab.props.name}`)
}

onMounted(() => {
  document.querySelectorAll('body')[0].className = ''

  if (activeName.value == 'partner') useCssVar('--el-color-primary', el).value = '#13ce66'
  else useCssVar('--el-color-primary', el).value = '#4e88f3'
})
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  margin: 0;
  background: rgba(251, 251, 253, 0.8);
  backdrop-filter: saturate(180%) blur(20px);

  .index-nav {
    display: flex;
    align-items: center;
    min-width: 1152px;
    max-width: 1366px;
    padding: 0;
    margin: auto;

    .logo {
      display: flex;
      flex: 1;
      align-items: center;
      height: 70px;
      font-size: 20px;
      line-height: 70px;

      a {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-right: 15px;
        background: url('/@/assets/avatar.svg') center center no-repeat;
        background-size: 100% 100%;
      }

      span {
        margin-right: 40px;
      }
    }

    :deep() {
      .el-tabs {
        &__header {
          margin: 0;
        }
      }
    }
  }
}
</style>
