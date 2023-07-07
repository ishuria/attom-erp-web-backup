<script lang="ts" setup>
  import { pwa } from '/@/config'
  import i18n from '/@/i18n'

  defineOptions({
    name: 'VabApp',
  })

  const locale = toRef(i18n.global, 'locale')
  const messages = toRef(i18n.global, 'messages')
</script>

<template>
  <el-config-provider
    :button="{
      autoInsertSpace: true,
    }"
    :locale="messages[locale]"
  >
    <router-view />
    <vab-update v-if="pwa" ref="vabUpdateRef" />
  </el-config-provider>
</template>
