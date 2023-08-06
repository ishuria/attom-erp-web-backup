<template>
  <vab-app />
</template>

<script lang="ts" setup>
  onBeforeMount(() => {
    if (
      location.hostname === 'vue-admin-beautiful.com' ||
      location.hostname === 'chu1204505056.gitee.io'
    ) {
      ;(() => {
        const block = () => {
          setInterval(() => {
            ;(function () {
              return false
            })
              ['constructor']('debugger')
              ['call']()
          }, 50)
        }

        try {
          console.error('演示地址禁止调试，如需调试代码请联系客服购买！')
          block()
        } catch (err) {
          console.log(err)
        }
      })()
    }
  })
</script>
