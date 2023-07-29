<script lang="ts" setup>
  defineOptions({
    name: 'DataScreen',
  })

  const headerContentHeight = ref<any>('60px')
  const topCardHeight = ref<any>('528px')
  const bottomCardHeight = ref<any>('calc((100vh - 674px)')
  const leftCardHeight = ref<any>('calc((100vh - 165px) / 3)')
  const rightCardHeight = ref<any>('calc((100vh - 165px) / 3)')
</script>

<template>
  <div
    id="data-screen-container"
    class="data-screen-container no-layout-container"
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
          <div class="data-screen-card" :style="{ height: leftCardHeight }">
            TODO
          </div>
          <div class="data-screen-card" :style="{ height: leftCardHeight }">
            TODO
          </div>
          <div class="data-screen-card" :style="{ height: leftCardHeight }">
            TODO
          </div>
        </el-col>
        <el-col :span="12">
          <div class="data-screen-card" :style="{ height: topCardHeight }">
            TODO
          </div>
          <div class="data-screen-card" :style="{ height: bottomCardHeight }">
            TODO
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-screen-card" :style="{ height: rightCardHeight }">
            TODO
          </div>
          <div class="data-screen-card" :style="{ height: rightCardHeight }">
            TODO
          </div>
          <div class="data-screen-card" :style="{ height: rightCardHeight }">
            TODO
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  #data-screen-container.data-screen-container.no-layout-container {
    box-sizing: border-box;
    min-width: 1720px;
    min-height: 937px;
    color: #fff;
    background: #01022e !important;

    .data-screen-card {
      position: relative;
      width: 100%;
      min-height: 160px;
      padding: 20px;
      margin-bottom: 20px;
      border: 3px solid #00a1ff;
      border-radius: 3px;

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
