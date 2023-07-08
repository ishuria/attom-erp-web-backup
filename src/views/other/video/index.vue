<script lang="ts" setup>
  defineOptions({
    name: 'Video',
  })
  const isLeft = usePageLeave()

  const $baseMessage = inject<any>('$baseMessage')

  const configMp4 = reactive<any>({
    url:
      'https://fastly.jsdel' +
      'ivr.net/gh/chuz' +
      'hixin/videos@master/video.mp4',
    id: 'mse',
    lang: 'zh',
    volume: 0,
    autoplay: true,
    screenShot: true,
    playbackRate: [0.5, 0.75, 1, 1.5, 2],
    fluid: true,
  })

  let _Player: any

  const playerInstance = (Player: any) => {
    _Player = Player
  }

  watch(isLeft, (value) => {
    if (true === value) {
      $baseMessage('鼠标已离开页面，暂停播放！', 'warning', 'hey')
      _Player.pause()
    } else {
      $baseMessage('鼠标已回到页面，继续播放！', 'success', 'hey')
      _Player.play()
    }
  })

  onBeforeRouteLeave(() => {
    _Player.pause()
  })
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
