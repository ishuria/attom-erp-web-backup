<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'

  const $pub: any = inject('$pub')

  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)

  const className = ref('')

  const refreshRoute = async () => {
    className.value = 'rotate'
    await $pub('reload-router-view')
    setTimeout(() => {
      className.value = ''
    }, 500)
  }
</script>

<template>
  <vab-icon
    v-if="theme.showRefresh"
    :class="className"
    icon="refresh-line"
    @click="refreshRoute"
  />
</template>
