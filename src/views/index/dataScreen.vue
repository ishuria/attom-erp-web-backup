<template>
  <div>
    <div
      id="data-screen-container"
      class="data-screen-container no-layout-container hidden-sm-and-up"
    >
      <div style="width: 100vw; padding: 20px">
        <el-alert :closable="false" title="手机端不支持门户演示" type="error" />
      </div>
    </div>
    <div
      id="data-screen-container"
      class="data-screen-container no-layout-container hidden-xs-only"
    >
      <data-screen-header
        :style="{
          height: headerContentHeight,
          'line-height': headerContentHeight,
        }"
      />
      <div style="padding: 30px 40px 0px 40px">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="data-screen-card" :style="{ height: leftCardHeight1 }">
              <div class="card-title">数据聚合</div>
              <data-screen-left1 />
            </div>
            <div class="data-screen-card" :style="{ height: leftCardHeight2 }">
              <div class="card-title">人群画像</div>
              <data-screen-left2 />
            </div>
            <div class="data-screen-card" :style="{ height: leftCardHeight3 }">
              TODO
            </div>
          </el-col>
          <el-col :span="12">
            <div class="data-screen-card" :style="{ height: topCardHeight }">
              <data-screen-map />
            </div>
            <div class="data-screen-card" :style="{ height: bottomCardHeight }">
              <data-screen-bottom />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="data-screen-card" :style="{ height: rightCardHeight1 }">
              TODO
            </div>
            <div class="data-screen-card" :style="{ height: rightCardHeight2 }">
              TODO
            </div>
            <div class="data-screen-card" :style="{ height: rightCardHeight3 }">
              <div class="card-title">访问量</div>
              <data-screen-right3 />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'DataScreen',
  })

  const headerContentHeight = ref<any>('60px')
  const topCardHeight = ref<any>('calc((100vh - 320px)')
  const bottomCardHeight = ref<any>('174px')

  const leftCardHeight1 = ref<any>('calc((100vh - 165px) / 3.5)')
  const leftCardHeight2 = ref<any>('calc((100vh - 165px) / 3)')
  const leftCardHeight3 = ref<any>('calc((100vh - 165px) / 2.63)')

  const rightCardHeight1 = ref<any>('calc((100vh - 165px) / 3)')
  const rightCardHeight2 = ref<any>('calc((100vh - 165px) / 2.63)')
  const rightCardHeight3 = ref<any>('calc((100vh - 165px) / 3.5)')
  const $baseMessage = inject<any>('$baseMessage')

  onMounted(() => {
    $baseMessage('点击右上角【全屏】按钮使用效果更佳', 'success', 'hey')

    if (
      location.hostname === 'vue-admin-beautiful.com' ||
      location.hostname === 'chu1204505056.gitee.io'
    ) {
      // 数据大屏占用内存较大，演示地址每隔3分钟刷新一次页面缓解浏览器压力
      setTimeout(() => {
        location.reload()
      }, 1000 * 3)
    }
  })
</script>

<style lang="scss" scoped>
  #data-screen-container.data-screen-container.no-layout-container {
    min-width: 1720px;
    color: #fff;
    background: #01022e !important;

    .data-screen-card {
      position: relative;
      width: 100%;
      min-height: 160px;
      padding: 20px;
      margin-bottom: 20px;
      border: 3px solid #01ffff;
      border-radius: 3px;

      .card-title {
        height: 20px;
        padding-left: 10px;
        line-height: 20px;
        text-align: left;
        border-left: 3px solid #01ffff;
      }

      &::before {
        position: absolute;
        top: -3px;
        bottom: -3px;
        left: 30px;
        z-index: 0;
        width: calc(100% - 60px);
        pointer-events: none;
        content: '';
        border-top: 3px solid #101f58;
        border-bottom: 3px solid #101f58;
      }

      &::after {
        position: absolute;
        top: 30px;
        right: -3px;
        left: -3px;
        z-index: 0;
        height: calc(100% - 60px);
        pointer-events: none;
        content: '';
        border-right: 3px solid #101f58;
        border-left: 3px solid #101f58;
      }
    }
  }
</style>
<style lang="scss">
  @keyframes twink {
    0% {
      opacity: 0.9;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
    100% {
      opacity: 0.9;
      transform: scale(1);
    }
  }
  @keyframes twinkImage {
    0% {
      opacity: 0.9;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 0.9;
      transform: scale(1);
    }
  }
  @keyframes rotate-left {
    0% {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(-180deg);
    }

    100% {
      transform: rotate(-360deg);
    }
  }
  @keyframes rotate-right {
    0% {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(180deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
