<script setup>
  const oops = ref('抱歉！')
  const headline = ref('服务器发生错误。')
  const info = ref('请稍后重试，或点击下面的按钮返回首页。')
  const btn = ref('返回首页')
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="pic-error">
        <vab-icon class="error-svg" icon="500" is-custom-svg />
      </div>
      <div class="bullshit">
        <div class="bullshit-oops">{{ oops }}</div>
        <div class="bullshit-headline">{{ headline }}</div>
        <div class="bullshit-info">{{ info }}</div>
        <router-link v-slot="{ navigate }" custom to="/">
          <a class="bullshit-return-home" @click="navigate">
            {{ btn }}
          </a>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import './scss/error';
</style>
