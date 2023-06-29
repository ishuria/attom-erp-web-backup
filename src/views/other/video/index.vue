<script lang="ts" setup>
  defineOptions({
    name: 'Video',
  })
  const configMp4 = reactive({
    url:
      'https://fastly.jsdel' +
      'ivr.net/gh/chuz' +
      'hixin/videos@master/video.mp4',
    id: 'mse',
    lang: 'zh',
    volume: 0.3,
    autoplay: true,
    screenShot: true,
    playbackRate: [0.5, 0.75, 1, 1.5, 2],
    fluid: true,
  })

  const playerInstance = (Player: any) => {
    console.log(Player)
  }
</script>

<template>
  <div class="video-container">
    <el-row :gutter="20">
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <vab-player
          :config="configMp4"
          style="background-color: rgba(0, 0, 0, 0.87)"
          @player="playerInstance"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped></style>
