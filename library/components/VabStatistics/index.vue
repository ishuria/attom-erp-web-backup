<script lang="ts" setup>
  defineOptions({
    name: 'VabStatistics',
  })
  // 网站访问量统计 如不需要请自行注释
  onMounted(() => {
    if (
      location.hostname !== 'localhost' ||
      location.hostname !== '127.0.0.1'
    ) {
      const _hmt: any = _hmt || []
      ;(function () {
        const hm: any = document.createElement('script')
        hm.src = 'https://hm.baidu.com/hm.js?820b686671af452e8a4e18952ce946d8'
        const s: any = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(hm, s)
      })()
    }
  })
</script>

<template>
  <div></div>
</template>
