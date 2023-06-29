<script lang="ts" setup>
  defineOptions({
    name: 'Video',
  })
  const configMp4 = reactive({
    id: 'mse',
    lang: 'zh',
    volume: 0.3,
    autoplay: true,
    screenShot: true,
    playbackRate: [0.5, 0.75, 1, 1.5, 2],
    url:
      'https://fastly.jsdel' +
      'ivr.net/gh/chuz' +
      'hixin/videos@master/video.mp4',
  })

  const playerInstance = (Player: any) => {
    console.log(Player)
  }
</script>

<template>
  <div class="video-container">
    <vab-player
      :config="configMp4"
      style="background-color: rgba(0, 0, 0, 0.87)"
      @player="playerInstance"
    />
  </div>
</template>

<style lang="scss" scoped></style>
