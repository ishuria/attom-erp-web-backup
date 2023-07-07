<script lang="ts" setup>
  import { translateTitle } from '/@/utils/i18n'
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabThemeDrawer',
  })

  const $sub = inject<any>('$sub')
  const $pub: any = inject('$pub')
  const $unsub = inject<any>('$unsub')
  const $baseLoading = inject<any>('$baseLoading')
  const $baseMessage = inject<any>('$baseMessage')
  const settingsStore: any = useSettingsStore()
  const { theme, device }: any = storeToRefs(settingsStore)
  const { saveTheme, resetTheme, updateTheme }: any = settingsStore
  const drawerVisible = ref(false)

  const handleOpenTheme = () => {
    drawerVisible.value = true
  }

  const updateMenuWidth = () => {
    useCssVar('--el-left-menu-width', ref(null)).value = theme.value.menuWidth
  }

  const _updateTheme = (value: any = '') => {
    if (value == 'default') $pub('shop-vite-reset-dark')

    const loading = $baseLoading()
    setTimeout(() => {
      updateTheme()
    }, 500)

    setTimeout(() => {
      loading.close()
      $baseMessage('切换成功', 'success', 'hey')
    }, 1000)
  }

  const setDefaultTheme = async () => {
    drawerVisible.value = false
    await _updateTheme()
    setTimeout(() => {
      resetTheme()
      $pub('shop-vite-reset-color')
      $pub('shop-vite-reset-dark')
    }, 500)
    if (document.body.getBoundingClientRect().width - 1 < 992) location.reload()
  }

  const handleSaveTheme = async () => {
    await saveTheme()
    drawerVisible.value = false
    if (document.body.getBoundingClientRect().width - 1 < 992) location.reload()
  }

  onMounted(() => {
    $sub('shop-vite-theme', () => {
      handleOpenTheme()
    })
    $sub('shop-vite-reset', () => {
      setDefaultTheme()
    })
    $sub('shop-vite-change-theme', (value: string) => {
      theme.value.themeName = value
      _updateTheme()
    })
  })

  onBeforeUnmount(() => {
    $unsub('shop-vite-theme')
    $unsub('shop-vite-reset')
    $unsub('shop-vite-change-theme')
  })
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    append-to-body
    class="vab-drawer"
    direction="rtl"
    size="288px"
    :title="translateTitle('主题配置')"
  >
    <el-scrollbar height="85vh">
      <el-form ref="form" label-position="left" :model="theme">
        <el-form-item v-if="device !== 'mobile'" class="vab-shop-item1">
          <template #label>
            {{ translateTitle('布局') }}
            <el-tooltip
              :content="
                translateTitle(
                  '布局配置仅' +
                    '在电脑视窗下生效，手机视窗时将' +
                    '默认锁定为纵向布局'
                )
              "
              effect="dark"
              placement="top"
            >
              <vab-icon icon="question-line" />
            </el-tooltip>
          </template>
          <el-radio-group
            v-model="theme.layout"
            class="vab-shop-layout"
            :disabled="device === 'mobile'"
          >
            <el-radio-button label="column">
              <template #default>
                <vab-icon icon="column" is-custom-svg />
              </template>
            </el-radio-button>
            <el-radio-button label="vertical">
              <template #default>
                <vab-icon icon="vertical" is-custom-svg />
              </template>
            </el-radio-button>
            <el-radio-button label="horizontal">
              <template #default>
                <vab-icon icon="horizontal" is-custom-svg />
              </template>
            </el-radio-button>
            <el-radio-button label="comprehensive">
              <template #default>
                <vab-icon icon="comprehensive" is-custom-svg />
              </template>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="translateTitle('主题')">
          <el-radio-group v-model="theme.themeName" @change="_updateTheme">
            <el-radio-button label="default">
              <template #default>{{ translateTitle('默认') }}</template>
            </el-radio-button>
            <el-radio-button label="plain">
              <template #default>{{ translateTitle('简洁') }}</template>
            </el-radio-button>
            <el-radio-button label="technology">
              <template #default>{{ translateTitle('科技') }}</template>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="translateTitle('配色')">
          <vab-color-picker />
        </el-form-item>
        <el-form-item :label="translateTitle('菜单宽度')">
          <el-select
            v-model="theme.menuWidth"
            :disabled="theme.layout === 'horizontal'"
            @change="updateMenuWidth"
          >
            <el-option key="266px" label="266px" value="266px" />
            <el-option key="277px" label="277px" value="277px" />
            <el-option key="288px" label="288px" value="288px" />
          </el-select>
        </el-form-item>
        <el-form-item :label="translateTitle('标签')">
          <el-switch v-model="theme.showTabs" />
        </el-form-item>
        <el-form-item>
          <template #label>
            {{ translateTitle('标签图标') }}
            <el-tooltip
              :content="translateTitle('标签开启时生效')"
              effect="dark"
              placement="top"
            >
              <vab-icon icon="question-line" />
            </el-tooltip>
          </template>
          <el-switch v-model="theme.showTabsIcon" :disabled="!theme.showTabs" />
        </el-form-item>
        <el-form-item>
          <template #label>
            {{ translateTitle('标签风格') }}
            <el-tooltip
              :content="translateTitle('标签开启时生效')"
              effect="dark"
              placement="top"
            >
              <vab-icon icon="question-line" />
            </el-tooltip>
          </template>
          <el-select v-model="theme.tabsBarStyle" :disabled="!theme.showTabs">
            <el-option
              key="card"
              :label="translateTitle('卡片')"
              value="card"
            />
            <el-option
              key="smart"
              :label="translateTitle('灵动')"
              value="smart"
            />
            <el-option
              key="smooth"
              :label="translateTitle('圆滑')"
              value="smooth"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template #label>
            {{ translateTitle('分栏风格') }}
            <el-tooltip
              :content="translateTitle('分栏布局时生效')"
              effect="dark"
              placement="top"
            >
              <vab-icon icon="question-line" />
            </el-tooltip>
          </template>
          <el-select
            v-model="theme.columnStyle"
            :disabled="theme.layout !== 'column'"
          >
            <el-option
              key="vertical"
              :label="translateTitle('纵向')"
              value="vertical"
            />
            <el-option
              key="horizontal"
              :label="translateTitle('横向')"
              value="horizontal"
            />
            <el-option
              key="card"
              :label="translateTitle('卡片')"
              value="card"
            />
            <el-option
              key="arrow"
              :label="translateTitle('箭头')"
              value="arrow"
            />
            <el-option
              key="semicircle"
              :label="translateTitle('半圆')"
              value="semicircle"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="translateTitle('头部固定')">
          <el-switch v-model="theme.fixedHeader" />
        </el-form-item>
        <el-form-item :label="translateTitle('国际化')">
          <el-switch v-model="theme.showLanguage" />
        </el-form-item>
        <el-form-item :label="translateTitle('进度条')">
          <el-switch v-model="theme.showProgressBar" />
        </el-form-item>
        <el-form-item :label="translateTitle('刷新')">
          <el-switch v-model="theme.showRefresh" />
        </el-form-item>
        <el-form-item :label="translateTitle('搜索')">
          <el-switch v-model="theme.showSearch" />
        </el-form-item>
        <el-form-item :label="translateTitle('通知')">
          <el-switch v-model="theme.showNotice" />
        </el-form-item>
        <el-form-item :label="translateTitle('全屏')">
          <el-switch v-model="theme.showFullScreen" />
        </el-form-item>
        <el-form-item :label="translateTitle('页面动画')">
          <el-select v-model="theme.pageTransition">
            <el-option key="" label="无动画" value="" />
            <el-option
              key="el-fade-in-linear"
              label="fade-in-linear"
              value="el-fade-in-linear"
            />
            <el-option key="el-fade-in" label="fade-in" value="el-fade-in" />
            <el-option
              key="el-zoom-in-center"
              label="zoom-in-center"
              value="el-zoom-in-center"
            />
            <el-option
              key="el-zoom-in-top"
              label="zoom-in-top"
              value="el-zoom-in-top"
            />
            <el-option
              key="el-zoom-in-bottom"
              label="zoom-in-bottom"
              value="el-zoom-in-bottom"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button type="primary" @click="handleSaveTheme">
        {{ translateTitle('保存') }}
      </el-button>
      <el-button @click="setDefaultTheme">
        {{ translateTitle('恢复默认') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss">
  @use 'sass:math';

  .vab-drawer {
    .el-drawer__header {
      padding: var(--el-padding) var(--el-padding) 0 var(--el-padding);
      margin-bottom: 0;
    }

    .el-drawer__body {
      padding-right: 0;

      .el-scrollbar__wrap {
        height: calc(100vh - 80px);
        padding-right: var(--el-padding);

        .el-divider--horizontal {
          margin: $base-margin * 2 0 $base-margin * 2 0;
        }

        .el-form-item {
          display: flex;
          align-items: center;
          margin-bottom: 17.5px;

          &__label {
            flex: 1 1;

            i {
              cursor: pointer;
            }
          }

          &__content {
            flex: 0 0 auto;
          }

          &.vab-item-custom {
            display: block !important;
            height: 130px;
          }

          &.vab-shop-item1 {
            display: block !important;

            .el-form-item__content {
              .vab-shop-layout {
                .el-radio-button {
                  position: relative;
                  display: block;
                  float: left;
                  width: 50px;
                  height: 50px;
                  padding: 0;
                  margin: 10px 10px 5px 4px;
                  cursor: pointer;
                  background: transparent;
                  border: 0;
                  box-shadow: none;

                  &.is-disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                  }

                  .el-radio-button__orig-radio {
                    display: none;
                  }

                  .el-radio-button__original-radio:checked
                    + .el-radio-button__inner {
                    .vab-icon {
                      box-shadow: 0 0 2px 2px var(--el-color-primary);
                    }
                  }

                  .el-radio-button__inner {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: block;
                    width: 50px;
                    height: 50px;
                    padding: 0;
                    margin: 0;
                    border: 0;
                    box-shadow: none;

                    .vab-icon {
                      width: 50px;
                      height: 50px;
                      padding: 0;
                      margin: 0;
                      border: 1px solid var(--el-border-color);
                      border-radius: var(--el-border-radius-base);
                    }
                  }
                }
                .el-radio-button:last-child {
                  margin-right: 0;
                }
              }
            }
          }

          .el-input__inner {
            width: 115px;
          }
        }
      }
    }

    .el-drawer__footer {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $base-z-index + 1;
      padding: math.div($base-padding, 2);
      background: var(--el-color-white);
      border-top: 1px solid var(--el-border-color);
    }
  }
</style>
