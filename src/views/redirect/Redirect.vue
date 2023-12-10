<template>
  <div class="redirect-container"></div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Redirect',
})

onBeforeMount(() => {
  useTimeoutFn(() => {
    history.back()
  }, 500)
})
</script>
