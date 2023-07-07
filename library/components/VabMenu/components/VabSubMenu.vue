<script lang="ts" setup>
  import { translateTitle } from '/@/utils/i18n'

  defineOptions({
    name: 'VabSubMenu',
  })

  defineProps({
    itemOrMenu: {
      type: Object,
      default() {
        return null
      },
    },
  })
</script>

<template>
  <template v-if="itemOrMenu.meta && itemOrMenu.meta.levelHidden">
    <template v-for="route in itemOrMenu.children" :key="route.path">
      <vab-menu :item="route" />
    </template>
  </template>
  <el-sub-menu v-else :index="itemOrMenu.path" popper-class="vab-sub-menu">
    <template #title>
      <vab-icon
        v-if="itemOrMenu.meta && itemOrMenu.meta.icon"
        :icon="itemOrMenu.meta.icon"
        :is-custom-svg="itemOrMenu.meta.isCustomSvg"
        :title="translateTitle(itemOrMenu.meta.title)"
      />
      <span :title="translateTitle(itemOrMenu.meta.title)">
        {{ translateTitle(itemOrMenu.meta.title) }}
      </span>
    </template>
    <slot />
  </el-sub-menu>
</template>

<style lang="scss">
  .vab-sub-menu {
    border: 0 !important;
  }
</style>
