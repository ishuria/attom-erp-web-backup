<template>
  <el-scrollbar wrap-class="scroll-wrap-product">
    <div class="product-main-mobile hidden-sm-and-up">
      <el-alert :closable="false" title="手机端不支持产品简介演示" type="error" />
    </div>
    <div class="product-main hidden-xs-only">
      <portal-header active-menu="product" />
      <div class="banner">
        <main>
          <div class="banner-title">企业级通用型中后台前端框架</div>
          <div class="banner-description">
            便捷式全域数据采集，全域用户行为分析，深耕科学营销运营应用，智能化洞察用户行为，全方位驱动企业数字化经营。
          </div>

          <el-button
            href="https://vue-admin-beautiful.com/authorization/shop-vite.html"
            rel="noopener noreferrer"
            tag="a"
            target="_blank"
            type="primary"
          >
            立即购买
          </el-button>
          <el-button
            href="https://vue-admin-beautiful.com/shop-vite"
            plain
            rel="noopener noreferrer"
            tag="a"
            target="_blank"
            type="primary"
          >
            进入产品
          </el-button>

          <div class="image-bg"></div>
          <el-image :src="logo" />
        </main>
      </div>

      <main>
        <div class="news-box">
          <div class="news-box-item">
            <a class="news-box-title">全链路监控营销推广</a>
            <div class="news-box-description">全链路监控营销推广</div>
          </div>
          <div class="news-box-item">
            <a class="news-box-title">全方位优化产品体验</a>
            <div class="news-box-description">全方位优化产品体验</div>
          </div>
          <div class="news-box-item">
            <a class="news-box-title">精准刻画用户画像</a>
            <div class="news-box-description">精准刻画用户画像</div>
          </div>
        </div>

        <div style="margin-top: 100px">
          <h1>TODO</h1>
        </div>
      </main>

      <vab-footer />
    </div>
    <el-backtop target="#app .scroll-wrap-product" />
    <vab-theme-setting />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import logo from '/@/assets/avatar.svg'

defineOptions({
  name: 'Product',
})

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

  .banner {
    position: relative;
    width: 100%;
    height: 410px;
    margin-top: 70px;
    background: var(--el-color-primary-light-9);

    &-title {
      margin-top: 80px;
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
      top: 80px;
      right: 30px;
      width: 192px;
      height: 192px;
      background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
      filter: blur(40px);
      border-radius: 50%;
    }

    :deep() {
      .el-image {
        position: absolute;
        top: 85px;
        right: 35px;
        width: 170px;
      }
    }
  }

  main {
    position: relative;
    width: 1152px;
    min-height: calc(100vh - 550px);
    padding: 10px 0 0 0;
    margin-right: auto;
    margin-left: auto;

    .news-box {
      position: absolute;
      top: -60px;
      left: 50%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 1200px;
      height: 120px;
      padding: 40px 0;
      background-color: rgba(255, 255, 255, 0.6);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      border: 1.5px solid #fff;
      border-radius: 15px;
      box-shadow: 0 4px 33px rgba(190, 196, 207, 0.28);
      transform: translate(-50%, 0);
      -ms-flex-align: center;

      &-item {
        box-sizing: border-box;
        width: 33.3%;
        padding: 0 30px;
        border-right: 1px solid var(--el-border-color);

        &:last-child {
          border-right: 0;
        }
      }

      &-title {
        display: inline-block;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        color: #282c33;
        cursor: pointer;

        &:hover {
          color: #0054e6;
        }
      }

      &-description {
        line-height: 20px;
        color: #848b99;
      }
    }
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
