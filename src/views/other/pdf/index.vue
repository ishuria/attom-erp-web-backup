<template>
  <div v-loading="loading" class="pdf-container">
    <vab-pdf :source="source" @rendered="handleDocumentRender" />
  </div>
</template>

<script lang="ts" setup>
import VabPdf from '/@/plugins/VabPdf'

defineOptions({
  name: 'PDF',
})

const source = ref<any>('https://gcore.jsdelivr.net/gh/chuzhixin/image/demo.pdf')
const loading = ref<boolean>(true)

const handleDocumentRender = () => {
  loading.value = false
}
</script>
