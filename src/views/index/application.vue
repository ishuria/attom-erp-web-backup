<template>
  <div class="application-container">
    <el-alert
      :closable="false"
      title="如果无法安装，PC端请点击浏览器地址栏右侧安装按钮进行安装，手机端请点击添加到主屏幕进行安装"
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
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault()
      if (deferredPrompt === 'init') deferredPrompt = e
    })
  }

  PWAInstallationGuide()

  const handleInstall = () => {
    if (deferredPrompt && deferredPrompt !== 'init') {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: any) => {
        console.log(choiceResult.outcome)
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
