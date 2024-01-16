<template>
  <div class="register-container">
    <div v-show="theme.showLanguage || theme.showColorPicker || theme.showDark" class="register-right-tools">
      <vab-language v-show="theme.showLanguage" />
      <vab-color-picker v-show="theme.showColorPicker" />
      <vab-dark v-show="theme.showDark" />
    </div>
    <div class="register-form">
      <img alt="" class="left-img" :src="leftImg" />
      <el-form ref="formRef" label-position="left" :model="form" :rules="rules" @submit.prevent>
        <div class="title">hello !</div>
        <div class="title-tips">{{ translate('账号注册') }}</div>
        <el-form-item prop="username">
          <el-input v-model.trim="form.username" v-focus auto-complete="off" clearable :placeholder="translate('请输入用户名')" type="text">
            <template #prefix>
              <vab-icon icon="user-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model.trim="form.phone" clearable maxlength="11" :placeholder="translate('请输入手机号')" show-word-limit type="text">
            <template #prefix>
              <vab-icon icon="smartphone-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phoneCode" style="position: relative">
          <el-input v-model.trim="form.phoneCode" :placeholder="translate('请输入手机验证码')" type="text">
            <template #prefix>
              <vab-icon icon="barcode-box-line" />
            </template>
          </el-input>
          <el-button class="phone-code" :disabled="isGetPhone" type="primary" @click="getPhoneCode">
            {{ translate(phoneCode) }}
          </el-button>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model.trim="form.password"
            autocomplete="new-password"
            clearable
            :placeholder="translate('请输入密码')"
            type="password"
          >
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-button v-throttle="handleRegister" class="register-btn" :loading="loading" native-type="submit" type="primary">
          {{ translate('注册') }}
        </el-button>
        <router-link to="/login">
          <el-button style="margin-top: 20px; margin-left: -10px" type="primary">
            {{ translate('登录') }}
          </el-button>
        </router-link>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { register } from '/@/api/user'
import leftImg from '/@/assets/login_images/left_img_2.png'
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'
import { useUserStore } from '/@/store/modules/user'
import { isPassword, isPhone } from '/@/utils/validate'

defineOptions({
  name: 'Register',
})

const $baseConfirm = inject<any>('$baseConfirm')
const router = useRouter()
const userStore = useUserStore()
const { setToken } = userStore
const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const isGetPhone = ref<boolean>(false)
const getPhoneInterval = ref<any>(null)
const phoneCode = ref<any>(translate('获取验证码'))
const form = reactive<any>({
  username: '',
  password: '',
  phone: '',
  verificationCode: '',
})

const validateUsername = (rule: any, value: any, callback: any) => {
  if ('' === value) callback(new Error(translate('用户名不能为空')))
  else callback()
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!isPassword(value)) callback(new Error(translate('密码不能少于6位')))
  else callback()
}
const validatePhone = (rule: any, value: any, callback: any) => {
  if (!isPhone(value)) {
    callback(new Error(translate('请输入正确的手机号')))
  } else {
    callback()
  }
}

const rules = reactive<any>({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: translate('请输入用户名'),
    },
    { validator: validateUsername, trigger: 'blur' },
  ],
  phone: [
    {
      required: true,
      trigger: 'blur',
      message: translate('请输入手机号'),
    },
    { validator: validatePhone, trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: translate('请输入密码'),
    },
    { validator: validatePassword, trigger: 'blur' },
  ],
  phoneCode: [
    {
      required: true,
      trigger: 'blur',
      message: translate('请输入手机验证码'),
    },
  ],
})

const getPhoneCode = () => {
  if (!isPhone(form.phone)) {
    formRef.value.validateField('phone')
    return
  }
  isGetPhone.value = true
  let n = 60
  getPhoneInterval.value = setInterval(() => {
    if (n > 0) {
      n--
      phoneCode.value = `${translate('获取验证码 ') + n}s`
    } else {
      clearInterval(getPhoneInterval.value)
      phoneCode.value = translate('获取验证码')
      getPhoneInterval.value = null
      isGetPhone.value = false
    }
  }, 1000)
}
const handleRegister = () => {
  formRef.value.validate(async (valid: any) => {
    if (valid) {
      loading.value = true
      const {
        msg,
        data: { token },
      }: any = await register(form).catch(() => {
        loading.value = false
      })
      $baseConfirm(`${msg}，点击确定模拟进入拥有【admin】角色的首页`, null, async () => {
        loading.value = false
        setToken(token)
        await router.push('/index')
      })
    }
  })
}

onUnmounted(() => {
  clearInterval(getPhoneInterval.value)
  getPhoneInterval.value = null
})
</script>

<style lang="scss" scoped>
.register-container {
  position: relative;
  height: 100vh;
  background: linear-gradient(to top, var(--el-color-primary), var(--el-color-primary-light-3));

  .register-right-tools {
    position: fixed;
    top: var(--el-margin);
    right: var(--el-margin);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(var(--el-padding) / 2);
    background: var(--el-color-white);
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);

    :deep() {
      .vab-language,
      .vab-color-picker,
      .vab-dark {
        margin: 0 calc(var(--el-padding) / 2) 0 calc(var(--el-padding) / 2) !important;
      }
    }
  }

  @media (max-width: 696px) {
    .register-right-tools {
      display: none;
    }

    .register-form {
      width: 90vw !important;
      margin: auto !important;

      .left-img {
        display: none !important;
      }

      :deep() {
        .el-form--default {
          width: 100% !important;
          margin-right: auto !important;
          margin-left: auto !important;
        }
      }
    }
  }

  @media (min-width: 696px) and (max-width: 999px) {
    .register-right-tools {
      display: none;
    }

    .register-form {
      width: 90vw !important;
      margin: auto !important;

      :deep() {
        .el-form--default {
          width: 50% !important;
        }
      }
    }
  }

  .register-form {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 1000px;
    height: 620px;
    padding: 4.5vh;
    margin: auto;
    overflow: hidden;
    background: var(--el-color-white);
    background-size: 100% 100%;
    border: 1px solid var(--el-border-color);
    border-radius: 15px;
    transition: var(--el-transition);

    * {
      transition: var(--el-transition);
    }

    .left-img {
      width: 50%;
    }

    :deep() {
      * {
        transition: var(--el-transition);
      }

      .el-form--default {
        width: 44%;
      }

      .title {
        font-size: 54px;
        font-weight: 500;
        color: var(--el-color-black);
      }

      .title-tips {
        margin-top: 29px;
        font-size: 26px;
        font-weight: 400;
        color: var(--el-color-black);
      }

      .register-btn {
        width: 100%;
        height: 50px;
      }

      .el-form-item {
        margin: 20px 0;

        &__error {
          position: absolute;
          font-size: var(--el-font-size-small);
          line-height: 18px;
          color: var(--el-color-error);
        }

        .el-input {
          width: 100%;
          height: 48px;
          line-height: 48px;
        }
      }

      .code {
        position: absolute;
        top: 4px;
        right: 4px;
        cursor: pointer;
        border-radius: var(--el-border-radius-base);
      }

      .phone-code {
        position: absolute;
        top: 8px;
        right: 10px;
        width: 120px;
        height: 32px;
        font-size: var(--el-font-size-default);
        color: var(--el-color-white);
        cursor: pointer;
        user-select: none;
        border-radius: 3px;
      }
    }
  }
}
</style>
