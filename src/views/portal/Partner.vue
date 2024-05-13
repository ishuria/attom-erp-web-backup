<template>
  <el-scrollbar wrap-class="scroll-wrap-partner">
    <div class="partner-main-mobile hidden-sm-and-up">
      <vab-alert title="手机端不支持合作伙伴演示" type="warning" />
    </div>
    <div class="partner-main hidden-xs-only">
      <portal-header active-menu="partner" />
      <div class="partner-content">
        <div class="banner">
          <main>
            <div class="banner-title">合作伙伴计划</div>
            <div class="banner-description">虚位以待，合作共赢，Vue Shop Vite与您共同成长</div>

            <el-button
              href="https://vue-admin-beautiful.com/authorization/shop-vite.html"
              rel="noopener noreferrer"
              tag="a"
              target="_blank"
              type="success"
            >
              立即购买
            </el-button>
            <el-button
              href="https://vue-admin-beautiful.com/shop-vite"
              plain
              rel="noopener noreferrer"
              tag="a"
              target="_blank"
              type="success"
            >
              进入产品
            </el-button>

            <div class="image-bg"></div>
            <el-image :src="logo" />
          </main>
        </div>
        <main>
          <h1>TODO</h1>
        </main>
      </div>
      <portal-divider active-menu="partner" style="margin-top: 12px" />
      <vab-footer />
    </div>
    <el-backtop target="#app .scroll-wrap-partner" />
    <vab-theme-setting />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import logo from '/@/assets/logo.svg'

defineOptions({
  name: 'Partner',
})
</script>

<style lang="scss" scoped>
.partner-main {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .partner-content {
    flex: 1;
  }

  &-mobile {
    height: 100vh;
    padding: var(--el-padding);
    background: var(--el-color-white);
  }

  main {
    position: relative;
    width: 1152px;
    min-height: calc(100vh - 550px);
    padding: 10px 0 0 0;
    margin-right: auto;
    margin-left: auto;
  }

  .banner {
    position: relative;
    width: 100%;
    height: 430px;
    background: var(--el-color-success-light-9);

    &-title {
      margin-top: 150px;
      margin-bottom: 12px;
      font-size: 40px;
      font-weight: 600;
      line-height: 60px;
      color: #000;
    }

    &-description {
      width: 600px;
      margin-bottom: 40px;
      font-size: 16px;
      line-height: 20px;
    }

    .image-bg {
      position: absolute;
      top: 150px;
      right: 30px;
      width: 192px;
      height: 192px;
      background-image: linear-gradient(-45deg, #35495e 50%, #41b882 50%);
      filter: blur(40px);
      border-radius: 50%;
    }

    :deep() {
      .el-image {
        position: absolute;
        top: 155px;
        right: 35px;
        width: 170px;
      }
    }
  }
}

:deep() {
  .vab-footer {
    margin-top: 0;
    background: #f6f8f9;
    border: 0;
  }

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
