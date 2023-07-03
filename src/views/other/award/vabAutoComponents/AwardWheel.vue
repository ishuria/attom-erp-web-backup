<script lang="ts" setup>
  import _ from 'lodash'
  import { getImageUrl } from '/@/utils/imageUrl'
  import { VabAwardWheel } from '/@/plugins/VabAward'

  const blockImg = getImageUrl('assets/award_images/block.png')
  const buttonImg = getImageUrl('assets/award_images/button.png')
  const award_1 = getImageUrl('assets/award_images/award_1.png')
  const award_2 = getImageUrl('assets/award_images/award_2.png')
  const $baseMessage = inject<any>('$baseMessage')

  const blocks = [
    {
      padding: '35px',
      imgs: [
        {
          src: blockImg,
          width: '100%',
        },
      ],
      rotate: true,
    },
  ]
  const prizes = [
    {
      fonts: [
        { text: '10金币', top: '10%', fontColor: '#ff6642', fontSize: 12 },
      ],
      background: '#fefaea',
      imgs: [
        {
          src: award_2,
          width: '20px',
          top: '35px',
        },
      ],
    },
    {
      fonts: [
        { text: '0.1元', top: '10%', fontColor: '#ff6642', fontSize: 12 },
      ],
      background: '#ffe358',
      imgs: [
        {
          src: award_1,
          width: '20px',
          top: '35px',
        },
      ],
    },
    {
      fonts: [
        { text: '20金币', top: '10%', fontColor: '#ff6642', fontSize: 12 },
      ],
      background: '#fefaea',
      imgs: [
        {
          src: award_2,
          width: '20px',
          top: '35px',
        },
      ],
    },
    {
      fonts: [
        { text: '0.2元', top: '10%', fontColor: '#ff6642', fontSize: 12 },
      ],
      background: '#ffe358',
      imgs: [
        {
          src: award_1,
          width: '20px',
          top: '35px',
        },
      ],
    },
    {
      fonts: [
        { text: '30金币', top: '10%', fontColor: '#ff6642', fontSize: 12 },
      ],
      background: '#fefaea',
      imgs: [
        {
          src: award_2,
          width: '20px',
          top: '35px',
        },
      ],
    },
    {
      fonts: [
        { text: '0.3元', top: '10%', fontColor: '#ff6642', fontSize: 12 },
      ],
      background: '#ffe358',
      imgs: [
        {
          src: award_1,
          width: '20px',
          top: '35px',
        },
      ],
    },
  ]
  const buttons = [
    {
      radius: '35%',
      imgs: [
        {
          src: buttonImg,
          width: '100%',
          top: '-46px',
        },
      ],
    },
  ]

  const awardWheelRef: Ref<any> = ref(null)
  const startCallback = () => {
    awardWheelRef.value.play()

    setTimeout(() => {
      //中奖的数组下标
      const index = _.random(0, 5)
      awardWheelRef.value.stop(index)
    }, 3000)
  }
  const endCallback = (prize: any) => {
    $baseMessage(`恭喜你获得${prize.fonts[0].text}`, 'success', 'hey')
  }
</script>

<template>
  <vab-award-wheel
    ref="awardWheelRef"
    :blocks="blocks"
    :buttons="buttons"
    height="300px"
    :prizes="prizes"
    width="300px"
    @end="endCallback"
    @start="startCallback"
  />
</template>

<style lang="scss" scoped></style>
