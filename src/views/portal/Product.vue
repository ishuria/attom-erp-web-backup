<template>
  <el-scrollbar wrap-class="scroll-wrap-product">
    <div class="product-main-mobile hidden-sm-and-up">
      <el-alert :closable="false" title="手机端不支持产品简介演示" type="error" />
    </div>
    <div class="product-main hidden-xs-only">
      <header>
        <div class="index-nav">
          <div class="logo">
            <a href="#/portal"></a>
            <span class="logo-title">Vue Shop Vite</span>
          </div>

          <ul class="nav-item">
            <li>
              <a href="#/portal">主页</a>
            </li>
            <li class="is-active">
              <a href="#/product">产品简介</a>
            </li>
            <li>
              <a href="#/index" target="_blank">后台管理</a>
            </li>
          </ul>
        </div>
      </header>
      <div class="banner">
        <h1>TODO</h1>
      </div>
      <main><h1>TODO</h1></main>

      <vab-footer />
    </div>
    <el-backtop target="#app .scroll-wrap-product" />
    <vab-theme-setting />
  </el-scrollbar>
</template>

<script lang="ts" setup>
onMounted(() => {
  document.getElementsByTagName('body')[0].className = ''
})
</script>

<style lang="scss" scoped>
.product-main {
  &-mobile {
    height: 100vh;
    padding: var(--el-padding);
    background: var(--el-color-white);
  }

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

  .banner {
    width: 100%;
    height: 500px;
    margin-top: 70px;
    background: var(--el-color-primary-light-9);
  }

  main {
    width: 1152px;
    min-height: calc(100vh - 555px);
    padding: 10px 0 0 0;
    margin-right: auto;
    margin-left: auto;
  }
}

:deep() {
  .vab-theme-setting {
    section {
      > div {
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          display: none;
        }
      }
    }
  }
}
</style>
