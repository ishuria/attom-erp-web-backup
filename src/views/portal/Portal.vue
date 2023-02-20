<script lang="ts" setup>
  import { getImageUrl } from '/@/utils/imageUrl'

  const background = ref('')

  const handleChange = (value: any) => {
    const img = getImageUrl(`assets/portal_images/carousel_${value + 1}.jpg`)
    background.value = `url('${img}')`
  }
</script>
<template>
  <div class="portal-main">
    <header>
      <div class="index-nav">
        <div class="logo">
          <a href="/"></a>
        </div>
        <ul class="nav-item">
          <li>
            <a href="#/portal">页面1</a>
          </li>
          <li>
            <a href="#/portal">页面2</a>
          </li>
          <li><a href="#/portal">页面3</a></li>
          <li><a href="#/portal">页面4</a></li>
          <li><a href="#/portal">页面5</a></li>
        </ul>
      </div>
    </header>
    <div class="carousel-background" :style="{ background: background }"></div>
    <main>
      <el-carousel
        arrow="always"
        height="500px"
        :interval="3000"
        @change="handleChange"
      >
        <el-carousel-item v-for="item in 2" :key="item" />
      </el-carousel>
    </main>
    <div style="background-color: #f5f7fa">
      <main>
        <div class="description-box">
          <h1>
            <span class="clip">Vite</span>
          </h1>
          <p class="text">下一代的前端工具链</p>
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .portal-main {
    margin-top: -15px;
    header {
      position: relative;
      z-index: 999;
      height: 71px;
      margin: 0;
      background: rgba(#fff, 0.5);

      .index-nav {
        min-width: 1152px;
        max-width: 1366px;
        margin: 0 auto;
      }
      .logo {
        float: left;
        margin: 0 20px;
        a {
          display: block;
          width: 140px;
          height: 71px;
          background: url('/@/assets/avatar.svg') center center no-repeat;
          transition: background-color 0.2s;
        }
      }
      .nav-item {
        li {
          float: left;
          list-style: none;

          a {
            position: relative;
            display: block;
            height: 71px;
            padding: 0 16px;
            font-size: 16px;
            line-height: 71px;
            color: #545c63;
            text-align: center;
            transition: background-color 0.3s;
          }
        }
      }
    }

    .carousel-background {
      position: absolute;
      width: 100%;
      height: 180px;
      background: url('/@/assets/portal_images/carousel_1.jpg');
      filter: blur(100px);
      opacity: 0.5;
    }
    main {
      width: 1152px;
      padding: 32px 0 0 0;
      margin-right: auto;
      margin-left: auto;
      border-top: 1px solid #f3f5f6;

      .el-carousel--horizontal {
        border-radius: 15px;
      }

      .el-carousel__item:nth-of-type(1) {
        background: url('/@/assets/portal_images/carousel_1.jpg');
        background-size: cover;
      }

      .el-carousel__item:nth-of-type(2) {
        background: url('/@/assets/portal_images/carousel_2.jpg');
        background-size: cover;
      }

      .description-box {
        h1 {
          .clip {
            font-size: 46px;
            background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .text {
          margin-top: -10px;
          font-size: 46px;
          font-weight: bold;
        }
      }
    }
  }
</style>
