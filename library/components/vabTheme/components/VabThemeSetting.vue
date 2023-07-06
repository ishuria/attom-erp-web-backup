<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translateTitle } from '/@/utils/i18n'

  const $pub: any = inject('$pub')

  const settingsStore: any = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)

  const handleOpenTheme = () => {
    $pub('shop-vite-theme')
  }

  const buy = () => {
    window.open('https://vue-admin-beautiful.com/authorization/shop-vite.html')
  }

  const removeLocalStorage = () => {
    localStorage.clear()

    location.reload()
  }

  const resetTheme = () => {
    $pub('shop-vite-reset')
  }
  const changeTheme = (value: string) => {
    $pub('shop-vite-change-theme', value)
  }
</script>

<template>
  <ul v-if="theme.showThemeSetting" class="vab-theme-setting">
    <li @click="handleOpenTheme">
      <a>
        <vab-icon icon="brush-line" />
        <p>{{ translateTitle('主题配置') }}</p>
      </a>
    </li>
    <li @click="buy">
      <a>
        <vab-icon icon="shopping-cart-2-line" />
        <p>{{ translateTitle('购买源码') }}</p>
      </a>
    </li>
    <li @click="changeTheme('technology')">
      <a>
        <vab-icon icon="user-5-line" />
        <p>
          {{ translateTitle('科技主题') }}
        </p>
      </a>
    </li>
    <li @click="changeTheme('plain')">
      <a>
        <vab-icon icon="computer-line" />
        <p>
          {{ translateTitle('简洁主题') }}
        </p>
      </a>
    </li>
    <li @click="resetTheme">
      <a>
        <vab-icon icon="arrow-go-back-line" />
        <p>
          {{ translateTitle('默认主题') }}
        </p>
      </a>
    </li>
    <li @click="removeLocalStorage">
      <a>
        <vab-icon icon="delete-bin-4-line" />
        <p>
          {{ translateTitle('清理缓存') }}
        </p>
      </a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .vab-theme-setting {
    position: fixed;
    top: 50%;
    right: 0;
    z-index: $base-z-index - 2;
    padding: 10px 0 0 0;
    margin: 0;
    text-align: center;
    cursor: pointer;
    background: var(--el-color-white);
    border: 1px solid var(--el-border-color);
    border-top-left-radius: calc(var(--el-border-radius-base) + 3px);
    border-bottom-left-radius: calc(var(--el-border-radius-base) + 3px);
    box-shadow: 0 0 50px 0 rgb(82 63 105 / 15%);
    transform: translateY(-50%);

    > li {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px 10px 10px;
      margin: 0;
      list-style: none;

      // &:nth-child(2) {
      //   [class*='ri-'] {
      //     animation: rotate 6s linear infinite;
      //   }
      // }

      $colors: (
        1: #3698fd,
        2: #7a66f8,
        3: #3698fd,
        4: #faa500,
        5: #3698fd,
        6: #ef4c5d,
      );

      @each $key, $color in $colors {
        &:nth-child(#{$key}) {
          a {
            color: $color;
            background: mix($base-color-white, $color, 90%);
            transition:
              color 0.15s ease,
              background-color 0.15s ease,
              border-color 0.15s ease,
              box-shadow 0.15s ease,
              -webkit-box-shadow 0.15s ease;

            &:hover {
              color: var(--el-color-white);
              background: $color;
            }
          }
        }
      }

      a {
        display: inline-block;
        width: 60px;
        height: 60px;
        padding-top: 10px;
        text-align: center;
        background: #f6f8f9;
        border-radius: calc(var(--el-border-radius-base) + 3px);

        p {
          padding: 0;
          margin: 0;
          overflow: hidden;
          font-size: var(--el-font-size-small);
          line-height: 25px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
