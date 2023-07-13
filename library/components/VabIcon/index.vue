<script lang="ts" setup>
  import 'remixicon/fonts/remixicon.css'
  import { isExternal } from '/@/utils/validate'

  defineOptions({
    name: 'VabIcon',
  })

  const props = defineProps({
    icon: {
      type: String,
      required: true,
    },
    // 是否使用自定义图标
    isCustomSvg: {
      type: Boolean,
      default: false,
    },
    // 是否使用本地库Remix图标
    isDefaultSvg: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: '',
    },
  })

  const svgClass = computed(() => {
    if (props.className) return `vab-icon ${props.className}`
    else return 'vab-icon'
  })

  const remixIconPath = import('remixicon/fonts/remixicon.symbol.svg')

  const _isExternal = isExternal(props.icon)
</script>

<template>
  <img v-if="_isExternal" class="img-icon" :src="icon" />
  <svg v-else-if="isCustomSvg" aria-hidden="true" :class="svgClass">
    <use :xlink:href="'#vab-icon-' + icon" />
  </svg>
  <!-- 内置svg雪碧图较大，对性能要求苛刻的用户请勿使用isDefaultSvg属性 -->
  <svg v-else-if="isDefaultSvg" class="vab-icon">
    <use :xlink:href="remixIconPath + '#ri-' + icon" />
  </svg>
  <i
    v-else
    aria-hidden="true"
    :class="{
      ['ri-' + icon]: true,
    }"
  />
</template>

<style lang="scss" scoped>
  .img-icon {
    display: inline-block;
    width: var(--el-font-size-big);
    height: var(--el-font-size-big);
    vertical-align: middle;
  }

  .vab-icon {
    display: inline-block;
    width: var(--el-font-size-big);
    height: var(--el-font-size-big);
    margin: 0 auto;
    overflow: hidden;
    vertical-align: top;
    fill: currentColor;
  }

  [class*='ri'] {
    display: inline-block;
    font-size: var(--el-font-size-big);
    text-align: center;
    vertical-align: 0;
  }
</style>
