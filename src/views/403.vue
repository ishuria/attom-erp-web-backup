<script lang="ts" setup>
  import { useTabsStore } from '/@/store/modules/tabs'

  const route = useRoute()

  const tabsStore = useTabsStore()
  const { delVisitedRoute } = tabsStore

  const state = reactive({
    jumpTime: 8,
    oops: '抱歉!',
    headline: '您没有操作角色...',
    info: '当前帐号没有操作角色，请联系管理员。',
    btn: '返回首页',
  })

  onBeforeRouteLeave((to, from, next) => {
    delVisitedRoute(route.path)
    next()
  })
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <el-row :gutter="20">
        <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
          <div class="pic-error">
            <vab-icon class="error-svg-403" icon="403" is-custom-svg />
          </div>
        </el-col>

        <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
          <div class="bullshit">
            <div class="bullshit-oops">{{ state.oops }}</div>
            <div class="bullshit-headline">{{ state.headline }}</div>
            <div class="bullshit-info">{{ state.info }}</div>
            <router-link v-slot="{ navigate }" custom to="/">
              <a class="bullshit-return-home" @click="navigate">
                {{ state.btn }}
              </a>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .error-container {
    position: relative;
    min-height: 100vh;

    .error-content {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40vw;
      height: 300px;
      transform: translate(-50%, -50%);

      .pic-error {
        position: relative;
        float: left;
        width: 100%;
        height: 300px;
        overflow: hidden;
        .error-svg-403 {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 36vh;
          margin: auto;
        }
      }

      @media only screen and (max-width: 768px) {
        .pic-error {
          margin-top: -100px;
        }
        .bullshit {
          padding: 0 !important;
          margin-left: 0 !important;
        }
      }
      .bullshit {
        position: relative;
        float: left;
        width: 35vh;
        padding: 8vh 0;
        margin-left: 50px;
        overflow: hidden;

        &-oops {
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
          line-height: 40px;
          color: var(--el-color-primary);
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        &-headline {
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: bold;
          line-height: 24px;
          color: var(--el-color-grey);
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-delay: 0.1s;
          animation-fill-mode: forwards;
        }

        &-info {
          margin-bottom: 30px;
          font-size: 13px;
          line-height: 21px;
          color: var(--el-color-grey);
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-delay: 0.2s;
          animation-fill-mode: forwards;
        }

        &-return-home {
          display: block;
          float: left;
          width: 110px;
          height: 36px;
          font-size: var(--el-font-size-default);
          line-height: 36px;
          color: var(--el-color-white);
          text-align: center;
          cursor: pointer;
          background: var(--el-color-primary);
          border-radius: 100px;
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-delay: 0.3s;
          animation-fill-mode: forwards;
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(60px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }
    }
  }
</style>
