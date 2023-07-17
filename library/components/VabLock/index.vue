<script lang="ts" setup>
  import { useUserStore } from '/@/store/modules/user'
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translateTitle } from '/@/utils/i18n'

  defineOptions({
    name: 'VabLock',
  })

  const userStore = useUserStore()
  const { avatar } = storeToRefs(userStore)
  const settingsStore = useSettingsStore()
  const { theme, lock, title } = storeToRefs(settingsStore)
  const { handleLock: _handleLock, handleUnLock: _handleUnLock } = settingsStore
  const url = 'https://cdn.jsdelivr.net/gh/chuzhixin/image/vab-image-lock/'

  const background = ref(`${url}${Math.round(Math.random() * 31)}.jpg`)
  const randomBackground = () => {
    background.value = `${url}${Math.round(Math.random() * 31)}.jpg`
  }

  const validatePass = (rule: any, value: string, callback: any) => {
    if (value === '' || value !== '123456') {
      callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  }

  const formRef = ref()
  const form = ref({
    password: '123456',
  })
  const rules = {
    password: [{ validator: validatePass, trigger: 'blur' }],
  }

  const handleUnLock = () => {
    formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        setTimeout(async () => {
          await _handleUnLock()
          await randomBackground()
        }, 500)
      }
    })
  }

  const handleLock = () => {
    _handleLock()
  }
</script>

<template>
  <vab-icon v-if="theme.showLock" icon="lock-line" @click="handleLock" />
  <transition v-if="theme.showLock" mode="out-in" name="fade-transform">
    <div v-if="lock" class="vab-screen-lock">
      <div
        class="vab-screen-lock-background"
        :style="{
          background: `fixed url(${background}) center`,
          backgroundSize: '100% 100%',
          filter: 'blur(10px)',
          transform: 'scale(1.05)',
        }"
      ></div>

      <div class="vab-screen-lock-content">
        <div class="vab-screen-lock-content-title">
          <el-avatar :size="180" :src="avatar" />
          <vab-icon icon="lock-line" />
          {{ title }} {{ translateTitle('屏幕已锁定') }}
        </div>
        <div class="vab-screen-lock-content-form">
          <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent>
            <el-form-item label="" :label-width="0" prop="password">
              <el-input
                v-model="form.password"
                v-focus
                autocomplete="off"
                placeholder="请输出密码123456"
                type="password"
              >
                <template #suffix>
                  <el-button
                    native-type="submit"
                    type="primary"
                    @click="handleUnLock"
                  >
                    <vab-icon icon="lock-line" />
                    <span>{{ translateTitle('解锁') }}</span>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span @click="randomBackground">{{ translateTitle('切换壁纸') }}</span>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
  .vab-screen-lock {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: $base-z-index;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    background: var(--el-mask-color);
    backdrop-filter: blur(10px);
    opacity: var(--opacity-value);
    transition: var(--el-transition);

    &-background {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $base-z-index - 1;
    }

    &-content {
      z-index: $base-z-index;
      width: 400px;
      padding: 40px 55px 40px 55px;
      color: var(--el-color-grey);
      text-align: center;
      background: var(--el-mask-color);
      backdrop-filter: blur(10px);
      border-radius: 15px;

      > span {
        font-size: var(--el-font-size-small);
        cursor: pointer;
      }

      &-title {
        line-height: 50px;
        color: var(--el-color-grey);
        text-align: center;

        .ri-lock-line,
        .ri-lock-unlock-line {
          display: block;
          margin: auto !important;
          font-size: 30px;
          color: var(--el-color-grey) !important;
          transition: var(--el-transition);
        }
      }

      &-form {
        :deep() {
          .el-input {
            position: relative;
            width: 100%;
            height: 40px;
            line-height: 40px;

            .el-input__wrapper {
              padding-right: 0;
              border: 1px solid var(--el-color-primary);
              box-shadow: none;
              .el-input__suffix {
                .el-button {
                  position: absolute;
                  right: -1px;
                  height: 40px;
                  line-height: 40px;
                  border-top-left-radius: 0;
                  border-bottom-left-radius: 0;
                }
                .el-input__validateIcon {
                  display: none;
                }
              }
            }
          }
        }
      }
    }

    @media (max-width: 576px) {
      .vab-screen-lock-content {
        width: 100% !important;
        margin: 5vw;
      }
    }
  }
</style>
