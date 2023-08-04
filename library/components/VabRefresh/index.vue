<template>
  <vab-icon :class="className" icon="refresh-line" @click="refreshRoute" />
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'VabRefresh',
  })

  const $pub = inject<any>('$pub')
  const className = ref<string>('')

  const refreshRoute = async () => {
    className.value = 'rotate'
    await $pub('reload-router-view')
    setTimeout(() => {
      className.value = ''
    }, 500)
  }
</script>
