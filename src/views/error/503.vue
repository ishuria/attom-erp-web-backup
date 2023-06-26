<script setup>
  const state = reactive({
    oops: '抱歉!',
    headline: '服务不可用...',
    info: '服务器当前无法处理请求，可能是由于过载或正在进行维护。',
    btn: '返回首页',
  })
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="pic-error">
        <vab-icon class="error-svg-503" icon="503" is-custom-svg />
      </div>
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import './scss/error';
</style>
