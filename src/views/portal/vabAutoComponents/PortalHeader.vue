<template>
  <header>
    <div class="index-nav">
      <div class="logo">
        <a href="#/portal"></a>
        <span class="logo-title">Vue Shop Vite</span>
      </div>

      <ul class="nav-item">
        <li :class="activeMenu === 'portal' ? 'is-active' : ''">
          <a href="#/portal">主页</a>
        </li>
        <li :class="activeMenu === 'product' ? 'is-active' : ''">
          <a href="#/product">产品简介</a>
        </li>
        <li>
          <a href="#/index" target="_blank">后台管理</a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'PortalHeader',
})

defineProps({
  activeMenu: {
    type: String,
    default: 'portal',
  },
})

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
    min-width: 1152px;
    max-width: 1366px;
    padding: 0;
    margin: auto;

    .logo {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      float: left;
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

    .nav-item {
      margin: auto;

      li {
        position: relative;
        float: left;
        padding: 0 10px 0 10px;
        list-style: none;

        &.is-active {
          &::before {
            position: absolute;
            right: 8px;
            bottom: 10px;
            left: 8px;
            height: 2px;
            content: '';
            background-color: var(--el-color-primary);
          }
        }

        a {
          position: relative;
          display: block;
          height: 100%;
          padding: 0 16px;
          font-size: var(--el-font-size-big);
          line-height: 71px;
          color: #545c63;
          text-align: center;
          transition: background-color 0.3s;
        }
      }
    }
  }
}
</style>
