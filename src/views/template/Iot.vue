<template>
  <div class="iot-container">
    <div class="hidden-sm-and-up">
      <vab-alert title="手机端不支持物联网演示" type="warning" />
    </div>
    <div class="hidden-xs-only">
      <div class="left-panel">
        <el-avatar :size="50" :src="avatar" />
        <div class="username">{{ username }}</div>
        <ul class="menu">
          <li v-for="(item, index) in menuList" :key="index" :class="item.active ? 'menu-item-active' : ''" @click="openWindow(item)">
            <vab-icon :icon="item.icon" />
            <div>{{ item.title }}</div>
          </li>
        </ul>
      </div>
      <div class="right-panel">
        <div class="right-panel-content">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-row :gutter="20">
                <el-col :lg="24">
                  <vab-card
                    :body-style="{
                      height: '160px',
                    }"
                    class="top-card"
                  >
                    <page-header />
                  </vab-card>
                </el-col>
                <el-col :lg="8">
                  <vab-card class="left-card">
                    <div>空调</div>
                    <el-image fit="fill" :lazy="true" :src="iot_1" />
                  </vab-card>
                </el-col>
                <el-col :lg="8">
                  <vab-card class="left-card">
                    <div>扫地机器人</div>
                    <el-image fit="fill" :lazy="true" :src="iot_2" />
                  </vab-card>
                </el-col>
                <el-col :lg="8">
                  <vab-card class="left-card">
                    <div>摄像头</div>
                    <el-image fit="fill" :lazy="true" :src="iot_3" />
                  </vab-card>
                </el-col>
                <el-col :lg="8">
                  <vab-card class="left-card">
                    <div>空气净化器</div>
                    <el-image fit="fill" :lazy="true" :src="iot_4" />
                  </vab-card>
                </el-col>
                <el-col :lg="8">
                  <vab-card class="left-card">
                    <div>灯</div>
                    <el-image fit="fill" :lazy="true" :src="iot_5" />
                  </vab-card>
                </el-col>
                <el-col :lg="8">
                  <vab-card class="left-card">
                    <div>门锁</div>
                    <el-image fit="fill" :lazy="true" :src="iot_6" />
                  </vab-card>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row :gutter="20">
                <el-col :lg="12">
                  <vab-card class="right-card">TODO</vab-card>
                </el-col>
                <el-col :lg="12">
                  <vab-card class="right-card">TODO</vab-card>
                </el-col>
                <el-col :lg="12">
                  <vab-card class="right-card">TODO</vab-card>
                </el-col>
                <el-col :lg="12">
                  <vab-card class="right-card">TODO</vab-card>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import iot_1 from '/@/assets/iot_images/iot_1.png'
import iot_2 from '/@/assets/iot_images/iot_2.png'
import iot_3 from '/@/assets/iot_images/iot_3.png'
import iot_4 from '/@/assets/iot_images/iot_4.png'
import iot_5 from '/@/assets/iot_images/iot_5.png'
import iot_6 from '/@/assets/iot_images/iot_6.png'

import { useUserStore } from '/@/store/modules/user'

defineOptions({
  name: 'Iot',
})

interface MenuListType {
  icon: string
  title: string
  path: string
  active?: boolean
}

const userStore = useUserStore()
const { avatar, username } = storeToRefs(userStore)
const router = useRouter()
const menuList = ref<Array<MenuListType>>([
  {
    icon: 'earthquake-fill',
    title: '物联网',
    path: '/iot',
    active: true,
  },
  {
    icon: 'artboard-fill',
    title: '门户',
    path: '/portal',
  },
  {
    icon: 'admin-fill',
    title: '后台管理',
    path: '/index',
  },
])

const openWindow = (item: MenuListType) => {
  router.push(item.path)
}

onMounted(() => {
  document.querySelectorAll('body')[0].className = ''
})
</script>

<style lang="scss" scoped>
$breakpoints: (480px 95%, 768px 95%, 960px 95%, 1280px 95%, 1440px 95%, 1680px 95%, 1920px 80%, 2560px 70%);
.iot-container {
  position: fixed;
  inset: 0;
  z-index: var(--el-z-index);
  padding: 0 !important;
  margin: 0 !important;
  background-image: linear-gradient(to bottom, #4f6479, #b6bcc4) !important;
  transition: var(--el-transition);

  * {
    transition: var(--el-transition);
  }

  .left-panel {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 80px;
    color: var(--el-color-white);
    text-align: center;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)) !important;

    :deep() {
      .el-avatar {
        padding: 5px;
        margin-top: 15px;
        background: none !important;
        border-radius: 50%;
      }
    }

    .username {
      color: var(--el-color-white);
    }

    .menu {
      padding: 0;
      list-style: none;

      li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 100px;
        padding-top: 5px;
        padding-right: 20px;
        padding-bottom: 5px;
        margin-bottom: 10px;
        cursor: pointer;

        &:hover,
        &.menu-item-active {
          color: var(--el-color-primary);
          background-color: var(--el-color-white);
          border-top-right-radius: 50px;
          border-bottom-right-radius: 50px;

          [class*='ri-'] {
            color: var(--el-color-primary);
          }
        }

        [class*='ri-'] {
          width: 100%;
          font-size: var(--el-font-size-max);
        }
      }
    }
  }

  .right-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100vw - 80px);
    height: 100vh;
    margin-left: 80px;

    &-content {
      display: flex;
      align-items: center;
      min-height: 80vh;
      margin: auto;
      border-radius: 15px;

      @each $bp, $width in $breakpoints {
        @media (min-width: $bp) {
          width: $width;
        }
      }

      .top-card {
        background: transparent;
      }

      .left-card {
        background: rgba(255, 255, 255, 0.3);

        :deep() {
          .el-card__body {
            height: 160px;
          }

          .el-image {
            display: block;
            width: 100px;
            margin: auto;
          }
        }
      }

      .right-card {
        background-image: linear-gradient(to bottom, #718391, #9ba5b2) !important;

        :deep() {
          .el-card__body {
            height: 250px;
          }
        }
      }

      :deep() {
        > .el-row {
          width: calc(100% + 20px);

          .el-card {
            border: 0;
            border-radius: 15px;
          }

          .page-header {
            margin-left: -40px;
            background: transparent !important;
            border: 0 !important;

            .el-card__body {
              background-color: transparent !important;

              .el-avatar {
                display: none;
              }

              * {
                color: var(--el-color-white) !important;
              }

              .page-header-tip-title {
                margin-bottom: 10px;
                font-size: calc(var(--el-font-size-max) + 4px) !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
