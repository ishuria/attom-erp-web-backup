<script lang="ts" setup>
  import IconList from './components/IconList.vue'
  import { getImageUrl } from '/@/utils/imageUrl'
  const banner_1 = getImageUrl('assets/portal_images/banner_1.jpg')

  const background = ref('')

  const handleChange = (value: any) => {
    const img = getImageUrl(`assets/portal_images/carousel_${value + 1}.jpg`)
    background.value = `url('${img}')`
  }

  const openWindow = (url: string) => {
    window.open(url)
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
            <a href="#/portal">门户页</a>
          </li>
          <li>
            <a href="#/index">管理页</a>
          </li>
          <li><a href="#/portal">页面3</a></li>
          <li><a href="#/portal">页面4</a></li>
          <li><a href="#/portal">页面5</a></li>
        </ul>
      </div>
    </header>
    <div class="carousel-background" :style="{ background: background }"></div>
    <main>
      <el-row :gutter="0">
        <el-col :span="6">
          <div class="left-tab">
            <el-menu
              active-text-color="#fff"
              background-color="#39364d"
              text-color="#fff"
            >
              <el-menu-item
                index="1"
                @click="
                  openWindow('https://vue-admin-beautiful.com/admin-pro>')
                "
              >
                <template #title>Vue Admin Pro：企业级中后台前端框架</template>
              </el-menu-item>
              <el-menu-item
                index="2"
                @click="
                  openWindow('https://vue-admin-beautiful.com/admin-plus>')
                "
              >
                <template #title>Vue Admin Plus：企业级中后台前端框架</template>
              </el-menu-item>
              <el-menu-item
                index="3"
                @click="
                  openWindow('https://vue-admin-beautiful.com/shop-vite>')
                "
              >
                <template #title>Vue Shop Vite：全新一代前端模板</template>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="18">
          <el-carousel
            arrow="always"
            height="400px"
            :interval="3000"
            @change="handleChange"
          >
            <el-carousel-item
              @click="openWindow('https://vue-admin-beautiful.com/admin-plus>')"
            />
            <el-carousel-item
              @click="openWindow('https://vue-admin-beautiful.com/shop-vite>')"
            />
            <el-carousel-item
              @click="openWindow('https://vue-admin-beautiful.com/shop-pro>')"
            />
          </el-carousel>
        </el-col>
        <el-col :span="24">
          <div style="background-color: #f5f7fa">
            <div class="description-box">
              <el-row>
                <el-col :span="6">
                  <div class="show-box">
                    <div style="float: left">
                      <h1>
                        <span class="clip">Vue Shop Vite</span>
                      </h1>
                      <p class="text">全新一代的前端模板</p>
                    </div>
                  </div>
                  <el-divider direction="vertical" />
                </el-col>
                <el-col :span="6">
                  <div class="show-box">
                    <div class="system-class-icon" style="background: #20c2dc">
                      <vab-icon icon="bubble-chart-line" />
                    </div>
                    <div class="describe">高效 Efficient</div>
                  </div>
                  <el-divider direction="vertical" />
                </el-col>
                <el-col :span="6">
                  <div class="show-box">
                    <div class="system-class-icon" style="background: #f7753f">
                      <vab-icon icon="medal-fill" />
                    </div>
                    <div class="describe">专业 Major</div>
                  </div>
                  <el-divider direction="vertical" />
                </el-col>
                <el-col :span="6">
                  <div class="show-box">
                    <div class="system-class-icon" style="background: #6a59f4">
                      <vab-icon icon="seedling-fill" />
                    </div>
                    <div class="describe">美观 Beautiful</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </main>

    <div
      style="
        width: 100%;
        height: 40px;
        margin-bottom: 10px;
        box-shadow: rgb(7 17 27 / 6%) 6px 5px 8px 0px;
      "
    ></div>

    <main style="background: #f5f7fa">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="news-tit"><h2>今日要闻</h2></div>
          <el-image class="news-img" :src="banner_1" />
        </el-col>
        <el-col :span="16">
          <div class="news-tit"><h2>动态资讯</h2></div>
          <icon-list />
        </el-col>
      </el-row>
    </main>

    <main style="background: #f5f7fa">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="news-tit"><h2>占位符</h2></div>
          <el-image class="news-img" :src="banner_1" />
        </el-col>
        <el-col :span="16">
          <div class="news-tit"><h2>占位符</h2></div>
          <icon-list />
        </el-col>
      </el-row>
    </main>
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
      .left-tab {
        width: 100%;
        height: 400px;
        padding-top: 15px;
        background: #39364d;
        border-top-left-radius: 15px;

        :deep() {
          .el-menu-item.is-active {
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      }

      .el-carousel--horizontal {
        border-top-right-radius: 15px;
      }

      .el-carousel__item:nth-of-type(1) {
        background: url('/@/assets/portal_images/carousel_1.jpg');
        background-size: cover;
      }

      .el-carousel__item:nth-of-type(2) {
        background: url('/@/assets/portal_images/carousel_2.jpg');
        background-size: cover;
      }
      .el-carousel__item:nth-of-type(3) {
        background: url('/@/assets/portal_images/carousel_3.jpg');
        background-size: cover;
      }

      .description-box {
        width: 100%;
        height: 120px;
        padding: 10px 20px 20px 20px;
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
        box-shadow: 0 5px 20px 0 rgb(0 0 0 / 30%);

        :deep() {
          .el-divider--vertical {
            float: right;
            height: 7em;
            margin-top: -20px;
          }
        }

        h1 {
          margin-top: -10px;
          .clip {
            font-size: 32px;
            line-height: 0;
            background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .text {
          margin-top: -10px;
          font-size: 24px;
          font-weight: bold;
        }
        .show-box {
          padding-top: 25px;
          padding-left: 20px;
          .system-class-icon {
            float: left;
            width: 50px;
            height: 50px;
            line-height: 50px;
            color: #fff;
            text-align: center;
            border-radius: 100%;
            [class*='ri'] {
              font-size: 24px;
            }
          }
          .describe {
            float: left;
            margin-top: 15px;
            margin-left: 20px;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            line-height: 22px;
            color: #1c1f21;
            letter-spacing: 0.76px;
            white-space: nowrap;
          }
        }
      }
      .news-tit {
        position: relative;
        width: 100%;
        height: 78px;
        margin-top: -30px;
        line-height: 36px;

        h2 {
          float: left;
          font-size: 20px;
          line-height: 36px;
          color: #5184eb;
          border-bottom: 4px solid #5184eb;
        }
      }

      .news-img {
        border-radius: 15px;
      }
    }
  }
</style>
