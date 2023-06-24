vab
<script lang="ts" setup>
  import { VuePdf, createLoadingTask } from 'vue3-pdfjs/esm'
  import { VuePdfPropsType } from 'vue3-pdfjs/components/vue-pdf/vue-pdf-props'
  import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

  defineOptions({
    name: 'PDF',
  })

  const pdfSrc = ref<VuePdfPropsType['src']>(
    'https://fastly.jsdelivr.net/gh/' + 'chuzh' + 'ixin/image' + `/demo.pdf`
  )
  const numOfPages = ref(0)

  onMounted(() => {
    const loadingTask = createLoadingTask(pdfSrc.value)
    loadingTask.promise.then((pdf: PDFDocumentProxy) => {
      numOfPages.value = pdf.numPages
    })
  })
</script>

<template>
  <div class="pdf-container">
    <vue-pdf
      v-for="page in numOfPages"
      :key="page"
      :src="pdfSrc"
      :page="page"
    />
  </div>
</template>
