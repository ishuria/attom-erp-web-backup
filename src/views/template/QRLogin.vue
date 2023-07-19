<template>
  <div class="qr-login-container">
    <el-button type="primary" @click="dialogVisible = true">打开</el-button>

    <el-dialog v-model="dialogVisible" draggable title="扫码登录" width="350px">
      <div class="qr-box">
        <img class="qr-image" :src="QR" />
        <img class="scan-image" :src="scan" />
        <div class="wechat-title">
          打开微信扫一扫，快速登录/注册
          <p>其他登录方式</p>
        </div>

        <div class="qr-box-bottom">
          <vab-icon icon="qq-fill" />
          <vab-icon icon="weibo-fill" />
          <vab-icon icon="wechat-fill" />
          <vab-icon icon="github-fill" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { getImageUrl } from '/@/utils/imageUrl'

  const QR = getImageUrl('assets/qr_images/QR.png')
  const scan = ref<string>('')
  const dialogVisible = ref<boolean>(false)

  scan.value = getImageUrl('assets/qr_images/scan.png')
  const timer = setInterval(() => {
    scan.value = ''
    nextTick(() => {
      scan.value = getImageUrl('assets/qr_images/scan.png')
    })
  }, 10000)

  const timer2 = setTimeout(() => {
    dialogVisible.value = true
  }, 1000)
  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    clearInterval(timer2)
    next()
  })
</script>

<style lang="scss" scoped>
  .qr-login-container {
    .qr-box {
      position: relative;
      padding: 0px 50px 0px 50px;
      text-align: center;

      .qr-image {
        width: 210px;
        height: 210px;
      }

      .scan-image {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 999;
        width: 250px;
        height: 180px;
        transform: translate(-50%, -80%);
      }

      .wechat-title {
        text-align: center;

        p {
          height: 24px;
          margin-bottom: 8px;
          font-size: var(--el-font-size-small);
          font-weight: 400;
          line-height: 24px;
          color: #999aaa;
        }
      }

      .qr-box-bottom {
        text-align: center;
        cursor: pointer;

        [class*='ri-'] {
          margin: 10px;
          font-size: 20px;
        }
      }
    }
  }
</style>
