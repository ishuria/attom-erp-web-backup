<script lang="ts" setup>
  import { useRoutesStore } from '/@/store/modules/routes'
  import { useSettingsStore } from '/@/store/modules/settings'
  import { defaultOpeneds, uniqueOpened } from '/@/config'

  defineOptions({
    name: 'VabSideBar',
  })

  const props = defineProps({
    layout: {
      type: String,
      default: 'vertical',
    },
  })

  const settingsStore = useSettingsStore()
  const { collapse } = storeToRefs(settingsStore)
  const routesStore = useRoutesStore()
  const {
    getRoutes: routes,
    getActiveMenu: activeMenu,
    getPartialRoutes: partialRoutes,
  } = storeToRefs(routesStore)

  const handleRoutes = computed(() => {
    return props.layout === 'comprehensive'
      ? partialRoutes.value
      : routes.value.flatMap((route: any) =>
          route.meta.levelHidden && route.children ? [...route.children] : route
        )
  })
</script>

<template>
  <el-scrollbar class="vab-side-bar" :class="{ 'is-collapse': collapse }">
    <vab-logo v-if="layout === 'comprehensive' || layout === 'vertical'" />
    <el-menu
      background-color="var(--el-menu-background-color)"
      :collapse="collapse"
      :collapse-transition="false"
      :default-active="activeMenu.data"
      :default-openeds="defaultOpeneds"
      menu-trigger="click"
      mode="vertical"
      text-color="var(--el-menu-color-text)"
      :unique-opened="uniqueOpened"
    >
      <template v-for="(item, index) in handleRoutes" :key="index + item.name">
        <vab-menu v-if="!item.meta.hidden" :item="item" />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);
    }

    &.is-active {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);
    }
  }

  .vab-side-bar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: $base-z-index + 1;
    width: var(--el-left-menu-width);
    height: 100vh;
    overflow: hidden;
    background: var(--el-menu-background-color);
    transition: var(--el-transition);

    &.side-bar-common {
      top: $base-header-height;
      height: calc(100vh - #{$base-header-height});
    }

    &.is-collapse {
      width: var(--el-left-menu-width-min);
      border-right: 0;

      :deep() {
        .el-menu {
          border-right: 0 !important;
        }

        .el-menu--collapse.el-menu {
          > .el-menu-item,
          > .el-sub-menu {
            justify-content: center;
            padding: 0;
            text-align: center;

            [class*='ri'] {
              display: block;
              padding: 0 !important;
              margin: 0 !important;
            }

            .el-tag {
              display: none;
            }
          }
        }

        .el-menu-item,
        .el-sub-menu {
          text-align: left;
        }

        .el-menu--collapse {
          border-right: 0;

          .el-sub-menu__icon-arrow {
            right: 10px;
            margin-top: -3px;
          }
        }
      }
    }

    :deep() {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-menu-item,
      .el-sub-menu__title {
        height: var(--el-menu-item-height);
        margin: 0 10px 5px 10px;
        overflow: hidden;
        line-height: var(--el-menu-item-height);
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        border-radius: var(--el-border-radius-base);
      }

      .el-menu-item {
        @include active;
      }
    }
  }
</style>

<style lang="scss">
  .el-menu {
    border-right: 0;
  }
</style>
