<script lang="ts" setup>
  const state = reactive({
    oops: '抱歉!',
    headline: '您没有操作权限...',
    info: '当前帐号没有操作权限，请联系管理员。',
    btn: '返回首页',
  })
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="pic-error">
        <vab-icon class="error-svg" icon="403" is-custom-svg />
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
