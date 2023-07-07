<script lang="ts" setup>
  import { useRoutesStore } from '/@/store/modules/routes'

  defineOptions({
    name: 'VabHeader',
  })

  defineProps({
    layout: {
      type: String,
      default: 'horizontal',
    },
  })

  const routesStore = useRoutesStore()
  const { getActiveMenu: activeMenu, getRoutes: routes } =
    storeToRefs(routesStore)
</script>

<template>
  <div class="vab-header">
    <div class="vab-main">
      <div class="right-panel">
        <vab-logo />
        <el-menu
          v-if="'horizontal' === layout"
          active-text-color="var(--el-menu-color-text)"
          background-color="var(--el-menu-background-color)"
          :default-active="activeMenu.data"
          menu-trigger="hover"
          mode="horizontal"
          text-color="var(--el-menu-color-text)"
        >
          <template
            v-for="(item, index) in routes.flatMap((route) =>
              route.meta && route.meta.levelHidden && route.children
                ? [...route.children]
                : route
            )"
          >
            <vab-menu
              v-if="item.meta && !item.meta.hidden"
              :key="index + item['name']"
              :item="item"
              :layout="layout"
            />
          </template>
        </el-menu>
        <vab-right-tools is-horizontal />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use 'sass:math';

  $base-menu-height: 40px;
  .vab-header {
    display: flex;
    align-items: center;
    justify-items: flex-end;
    height: $base-header-height;
    background: var(--el-menu-background-color);

    .vab-main {
      padding: 0 var(--el-padding) 0 var(--el-padding);

      .right-panel {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: $base-header-height;

        :deep() {
          .logo-container {
            width: 360px;
          }

          .el-sub-menu__icon-more {
            margin-top: #{math.div($base-menu-height - 20, 2)} !important;
            margin-right: 20px !important;
          }

          .el-menu {
            border: 0 !important;

            &.el-menu--horizontal {
              width: 100%;
              height: $base-menu-height;
              border: 0 !important;

              > .el-menu-item,
              > .el-sub-menu {
                border-radius: 3px;

                > .el-sub-menu__title {
                  display: flex;
                  align-items: flex-start;
                  line-height: $base-menu-height;
                  border-radius: 3px;
                }
              }
            }

            [class*='ri-'],
            .vab-icon {
              margin-left: 0;
              font-size: lighter;
              color: var(--el-color-white);
              cursor: pointer;
              -webkit-font-smoothing: antialiased;
            }

            .el-sub-menu,
            .el-menu-item {
              &.is-active {
                border: 0 !important;

                .el-sub-menu__title {
                  border: 0 !important;
                }
              }
            }

            .el-menu-item {
              &.is-active {
                background: var(--el-color-primary) !important;
              }
            }
          }

          .username {
            color: var(--el-color-white);
          }

          .username + i {
            color: var(--el-color-white);
          }

          [class*='ri-'] {
            margin-left: var(--el-margin);
            font-size: lighter;
            color: var(--el-color-white);
            cursor: pointer;
            -webkit-font-smoothing: antialiased;
          }

          button {
            svg {
              margin-right: 0;
              color: var(--el-color-white);
              cursor: pointer;
              fill: var(--el-color-white);
            }
          }

          .el-color-picker {
            &__trigger {
              margin: -5px;
              border: 0;
            }
          }

          .vab-search-autocomplete {
            margin-left: 20px;

            .el-input__wrapper {
              background-color: transparent;
              border-radius: 15px;
            }
          }
        }
      }
    }
  }
</style>
<style>
  .el-menu--horizontal,
  .el-popper.is-light {
    border: 0 !important;
  }
</style>
