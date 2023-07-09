<script lang="ts" setup>
  defineOptions({
    name: 'VabColorfulCard',
  })

  defineProps({
    shadow: {
      type: String,
      default: 'never',
    } as any,
    colorFrom: {
      type: String,
      default: '',
    },
    colorTo: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    style: {
      type: Object,
      default: () => {},
    },
  })
</script>

<template>
  <el-card
    class="vab-colorful-card"
    :shadow="shadow"
    :style="
      style
        ? style
        : {
            background: `linear-gradient(120deg, ${colorFrom} 10%, ${colorTo})`,
          }
    "
  >
    <template #header>{{ title }}</template>
    <vab-icon v-if="icon" :icon="icon" />
    <slot />
  </el-card>
</template>

<style lang="scss" scoped>
  .vab-colorful-card {
    position: relative;
    min-height: 120px;
    cursor: pointer;

    * {
      color: var(--el-color-white);
    }

    :deep() {
      .el-card__header {
        color: var(--el-color-white);
        border-bottom: 0;
      }

      .el-card__body {
        padding-top: 0;
      }
    }

    i {
      position: absolute;
      right: 20px;
      font-size: 60px;
      transform: rotate(15deg);
    }
  }
</style>
