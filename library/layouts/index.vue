<template>
  <div class="vue-shop-vite-box" :class="{ mobile }">
    <component
      :is="'vab-layout-' + theme.layout"
      :collapse="collapse"
      :device="device"
      :fixed-header="theme.fixedHeader"
      :show-tabs="theme.showTabs"
    />
    <el-backtop target="#app" />
    <vab-theme-drawer />
    <vab-theme-setting />
    <vab-surely-form />
    <vab-statistics />
  </div>
</template>

<script>
  import { useSettingsStore } from '/@/store/modules/settings'

  const imports = import.meta.glob('./**/*.vue', { eager: true })
  const Components = {}
  Object.getOwnPropertyNames(imports).forEach((key) => {
    Components[key.replace(/(\/|\.|index.vue)/g, '')] = imports[key].default
  })

  export default defineComponent({
    name: 'Layouts',
    components: Components,
    setup() {
      const settingsStore = useSettingsStore()
      const { device, collapse, theme } = storeToRefs(settingsStore)
      const { toggleDevice, foldSideBar, openSideBar, updateTheme } =
        settingsStore

      const mobile = ref(false)
      let oldLayout = theme.value.layout

      const resizeBody = () => {
        mobile.value = document.body.getBoundingClientRect().width - 1 < 992
      }

      watch(mobile, (val) => {
        if (val) {
          oldLayout = theme.value.layout
          foldSideBar()
        } else openSideBar()
        theme.value.layout = val ? 'vertical' : oldLayout
        toggleDevice(val ? 'mobile' : 'desktop')
      })

      onMounted(() => {
        resizeBody()
        updateTheme()
        window.addEventListener('resize', resizeBody)
      })

      onBeforeUnmount(() => {
        if (mobile) theme.value.layout = oldLayout
        window.removeEventListener('resize', resizeBody)
      })

      return {
        theme,
        device,
        mobile,
        collapse,
        foldSideBar,
        openSideBar,
        toggleDevice,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .vue-shop-vite-box {
    position: relative;
    width: 100%;
    height: 100%;

    [class*='vab-layout-'] {
      :deep() {
        .vab-layout-header {
          border-bottom: 1px solid var(--el-border-color);

          &.is-no-tabs {
            border-bottom: 0;
          }
        }
      }

      &.fixed {
        padding-top: $base-nav-height + $base-tabs-height;
      }

      &.fixed.no-tabs-bar {
        padding-top: $base-nav-height;
      }
    }

    :deep() {
      .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        z-index: $base-z-index - 1;
        width: 100%;
      }

      .vab-main {
        position: relative;
        width: auto;
        min-height: 100%;
        margin-left: var(--el-left-menu-width);

        &.is-collapse-main {
          margin-left: var(--el-left-menu-width-min);

          .fixed-header {
            width: $base-right-content-width-min;
          }
        }

        &:not(.is-collapse-main) {
          .fixed-header {
            width: calc(100% - var(--el-left-menu-width));
          }
        }
      }
    }

    /* 手机端开始 */
    &.mobile {
      :deep() {
        .vab-layout-vertical {
          .el-scrollbar.vab-side-bar.is-collapse {
            width: 0;
          }

          .vab-main {
            .fixed-header {
              width: 100%;
            }

            margin-left: 0;
          }
        }

        /* 隐藏分页和页码跳转 */
        .el-pager,
        .el-pagination__jump {
          display: none;
        }
      }
    }

    /* 手机端结束 */
  }
</style>
