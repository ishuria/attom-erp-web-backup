<script lang="ts" setup>
  onMounted(() => {
    if (
      location.hostname === 'vue-admin-beautiful.com' ||
      location.hostname === 'chu1204505056.gitee.io'
    ) {
      // 演示地址禁止调试
      ;(() => {
        function block() {
          setInterval(() => {
            ;(function () {
              return false
            })
              ['constructor']('debugger')
              ['call']()
          }, 50)
        }

        try {
          block()
        } catch (err) {
          console.log(err)
        }
      })()
    }
  })
</script>
<template>
  <vab-app />
</template>
