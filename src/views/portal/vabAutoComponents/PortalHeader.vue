<template>
  <header>
    <div class="index-nav">
      <div class="logo">
        <a href="#/portal"></a>
        <span class="logo-title">Vue Shop Vite</span>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="主页" name="portal"><a href="#/portal"></a></el-tab-pane>
        <el-tab-pane label="产品简介" name="product"><a href="#/product"></a></el-tab-pane>
        <el-tab-pane label="后台管理" name="admin"><a href="#/index" target="_blank"></a></el-tab-pane>
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

const activeName = ref(props.activeMenu)

const handleClick = (tab: TabsPaneContext) => {
  switch (tab.index) {
    case '0':
      router.push('/portal')
      break
    case '1':
      router.push('/product')
      break
    case '2':
      router.push('/index')
      break
  }
}

onMounted(() => {
  document.querySelectorAll('body')[0].className = ''
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
