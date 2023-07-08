vab
<script lang="ts" setup>
  import VabPdf from '/@/plugins/VabPdf'

  defineOptions({
    name: 'PDF',
  })

  const source = ref<any>(
    'https://fastly.jsdelivr.net/gh/' + 'chuzh' + 'ixin/image' + `/demo.pdf`
  )
</script>

<template>
  <div class="pdf-container">
    <vab-pdf :source="source" />
  </div>
</template>
