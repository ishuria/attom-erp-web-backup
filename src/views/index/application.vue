<template>
  <div class="application-container">
    <el-button :disabled="disabled" type="primary" @click="handleInstall">
      点击安装
    </el-button>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'Application',
  })

  const $baseMessage = inject<any>('$baseMessage')
  const disabled = ref<boolean>(false)
  // @ts-ignore
  let deferredPrompt: BeforeInstallPromptEvent = 'init'

  const PWAInstallationGuide = () => {
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault()
      if (deferredPrompt === 'init') {
        deferredPrompt = e
      }
    })
  }

  PWAInstallationGuide()

  const handleInstall = () => {
    if (deferredPrompt && deferredPrompt !== 'init') {
      disabled.value = false
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
    } else {
      disabled.value = true
    }
  }
</script>

<style lang="scss" scoped></style>
