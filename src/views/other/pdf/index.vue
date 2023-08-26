<template>
  <div class="pdf-container">
    <vab-pdf :source="source" />
  </div>
</template>

<script lang="ts" setup>
import VabPdf from '/@/plugins/VabPdf'

defineOptions({
  name: 'PDF',
})

const source = ref<any>('https://gcore.jsdelivr.net/gh/chuzhixin/image/demo.pdf')
</script>
