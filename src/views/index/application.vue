<template>
  <div class="application-container">
    <vab-alert
      title="点击安装前需按下 Ctrl + F5 强制刷新当前页面，如果无法安装，PC端请点击浏览器地址栏右侧安装按钮进行安装，手机端请点击添加到主屏幕进行安装，仅支持Edge、Chrome、Safari"
    />
    <el-button type="primary" @click="handleInstall">点击安装</el-button>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Application',
})

let deferredPrompt: any

const beforeinstallprompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
  })
}

onBeforeMount(() => {
  beforeinstallprompt()
})

const handleInstall = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null
      beforeinstallprompt()
    })
  }
}
</script>
