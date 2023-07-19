<template>
  <el-config-provider
    :button="{
      autoInsertSpace: true,
    }"
    :locale="locale"
  >
    <router-view />
    <vab-update v-if="pwa" />
  </el-config-provider>
</template>

<script lang="ts" setup>
  import { pwa } from '/@/config'
  import { enLocale, zhLocale } from '/@/i18n'

  const { locale: language } = useI18n()

  const locale = computed(() => (language.value === 'en' ? enLocale : zhLocale))

  defineOptions({
    name: 'VabApp',
  })
</script>
