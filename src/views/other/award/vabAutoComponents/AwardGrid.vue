<script lang="ts" setup>
  import _ from 'lodash'
  import { getImageUrl } from '/@/utils/imageUrl'
  import { VabAwardGrid } from '/@/plugins/VabAward'

  const buttonImg = getImageUrl('assets/award_images/button2.png')
  const award_1 = getImageUrl('assets/award_images/award_1.png')
  const btnImg = getImageUrl('assets/award_images/btn.png')

  const $baseMessage = inject<any>('$baseMessage')
  const luckyNum = 1

  const blocks = [
    { padding: '15px', background: '#ffc27a', borderRadius: 28 },
    { padding: '8px', background: '#ff4a4c', borderRadius: 23 },
    { padding: '8px', background: '#ff625b', borderRadius: 20 },
  ]
  const buttons = [
    {
      x: 1,
      y: 1,
      background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
      shadow: '0 5 1 #e89b4f',
      fonts: [
        {
          text: `${luckyNum} 次`,
          fontColor: '#fff',
          top: '73%',
          fontSize: '11px',
        },
      ],
      imgs: [
        { src: buttonImg, width: '65%', top: '12%' },
        { src: btnImg, width: '50%', top: '73%' },
      ],
    },
  ]

  const prizes = [
    {
      name: '1元红包',
      index: 0,
      x: 0,
      y: 0,
      fonts: [
        { text: '1元红包', top: '70%', fontColor: '#ff6642', fontSize: 12 },
      ],
      imgs: [{ src: award_1, width: '30%', top: '15%' }],
      background: '#fefaea',

      col: 1,
      row: 1,
    },
    {
      name: '100元红包',
      index: 1,
      x: 1,
      y: 0,
      fonts: [
        { text: '100元红包', top: '70%', fontColor: '#ff6642', fontSize: 12 },
      ],
      imgs: [{ src: award_1, width: '30%', top: '15%' }],
      background: '#fefaea',
      col: 1,
      row: 1,
    },
    {
      name: '0.5元红包',
      index: 2,
      x: 2,
      y: 0,
      fonts: [
        { text: '0.5元红包', top: '70%', fontColor: '#ff6642', fontSize: 12 },
      ],
      imgs: [{ src: award_1, width: '30%', top: '15%' }],
      background: '#fefaea',
      col: 1,
      row: 1,
    },
    {
      name: '2元红包',
      index: 3,
      x: 2,
      y: 1,
      fonts: [
        { text: '2元红包', top: '70%', fontColor: '#ff6642', fontSize: 12 },
      ],
      imgs: [{ src: award_1, width: '30%', top: '15%' }],
      background: '#fefaea',
      col: 1,
      row: 1,
    },
    {
      name: '10元红包',
      index: 4,
      x: 2,
      y: 2,
      fonts: [
        { text: '10元红包', top: '70%', fontColor: '#ff6642', fontSize: 12 },
      ],
      imgs: [{ src: award_1, width: '30%', top: '15%' }],
      background: '#fefaea',
      col: 1,
      row: 1,
    },
    {
      name: '50元红包',
      index: 5,
      x: 1,
      y: 2,
      fonts: [
        { text: '50元红包', top: '70%', fontColor: '#ff6642', fontSize: 12 },
      ],
      imgs: [{ src: award_1, width: '30%', top: '15%' }],
      background: '#fefaea',
      col: 1,
      row: 1,
    },
    {
      name: '0.3元红包',
      index: 6,
      x: 0,
      y: 2,
      fonts: [
        { text: '0.3元红包', top: '70%', fontColor: '#ff6642', fontSize: 12 },
      ],
      imgs: [{ src: award_1, width: '30%', top: '15%' }],
      background: '#fefaea',
      col: 1,
      row: 1,
    },
    {
      name: '20元红包',
      index: 7,
      x: 0,
      y: 1,
      fonts: [
        { text: '20元红包', top: '70%', fontColor: '#ff6642', fontSize: 12 },
      ],
      imgs: [{ src: award_1, width: '30%', top: '15%' }],
      background: '#fefaea',
      col: 1,
      row: 1,
    },
  ]

  const awardGridRef: Ref<any> = ref(null)
  const startCallback = () => {
    awardGridRef.value.play()

    setTimeout(() => {
      //中奖的数组下标
      const index = _.random(0, 5)
      awardGridRef.value.stop(index)
    }, 3000)
  }
  const endCallback = (prize: any) => {
    $baseMessage(`恭喜你获得${prize.fonts[0].text}`, 'success', 'hey')
  }
</script>

<template>
  <vab-award-grid
    ref="awardGridRef"
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
