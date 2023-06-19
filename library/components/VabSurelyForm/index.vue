<script lang="ts" setup>
  defineOptions({
    name: 'VabSurelyForm',
  })

  const formShow = ref(false)

  onMounted(() => {
    if (
      location.hostname === 'vue-admin-beautiful.com' ||
      location.hostname === 'chu1204505056.gitee.io'
    ) {
      // 演示地址启用问答表单
      formShow.value = true
      const script = document.createElement('script')
      script.src = 'https://aliyuncdn.antdv.com/form/static/embed/runtime.js'
      document.body.appendChild(script)
    }
  })
</script>

<template>
  <div
    v-if="formShow"
    class="surveybyantdv"
    data-sf-id="64cd8f71e1d200b1"
    data-sf-mode="popover"
    data-sf-button-color="var(--el-color-primary)"
    data-sf-text-color="#ffffff"
    data-sf-button-radius="50"
    data-sf-button-icon="mail-outlined"
    data-sf-default-open="false"
    data-sf-allow-repeat-submit="true"
    data-sf-close-after-submit="true"
    data-sf-hide-after-submit="false"
    data-sf-delay-visible="false"
    data-sf-preload="true"
    data-sf-width="450px"
    data-sf-height="660px"
  ></div>
</template>
