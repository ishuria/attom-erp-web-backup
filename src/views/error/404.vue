<script setup>
  const state = reactive({
    oops: '抱歉!',
    headline: '当前页面不存在...',
    info: '请检查您输入的网址是否正确，或点击下面的按钮返回首页。',
    btn: '返回首页',
  })
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="pic-error">
        <vab-icon class="error-svg-404" icon="404" is-custom-svg />
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
