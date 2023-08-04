<template>
  <div class="application-container">
    <el-alert
      :closable="false"
      title="点击安装前需按下 Ctrl + F5 强制刷新当前页面，如果无法安装，PC端请点击浏览器地址栏右侧安装按钮进行安装，手机端请点击添加到主屏幕进行安装，仅支持Edge、Chrome、Safari"
      type="info"
    />

    <el-button type="primary" @click="handleInstall">点击安装</el-button>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'Application',
  })

  const $baseMessage = inject<any>('$baseMessage')
  // @ts-ignore
  let deferredPrompt: BeforeInstallPromptEvent = 'init'

  const PWAInstallationGuide = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      if (deferredPrompt === 'init') deferredPrompt = e
    })
  }

  PWAInstallationGuide()

  const handleInstall = () => {
    if (deferredPrompt && deferredPrompt !== 'init') {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'dismissed') {
          $baseMessage(
            '检测到您已取消安装需为您重载网页',
            'error',
            'hey',
            () => {
              location.reload()
            }
          )
        }
      })
    }
  }
</script>
