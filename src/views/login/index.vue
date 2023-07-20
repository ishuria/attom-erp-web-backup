<template>
  <div class="login-container">
    <div class="login-form">
      <img class="left-img" :src="leftImg" />
      <el-form
        ref="formRef"
        label-position="left"
        :model="form"
        :rules="rules"
        @submit.prevent
      >
        <div class="title">hello !</div>
        <div class="title-tips">{{ translate('欢迎来到') }}{{ title }}！</div>
        <el-form-item prop="username">
          <el-input
            v-model.trim="form.username"
            v-focus
            clearable
            :placeholder="translate('请输入用户名')"
            type="text"
          >
            <template #prefix>
              <vab-icon icon="user-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="passwordRef"
            v-model.trim="form.password"
            clearable
            :placeholder="translate('请输入密码')"
            :type="passwordType"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
          </el-input>
        </el-form-item>
        <!-- 验证码验证逻辑需自行开发，如不需要验证码功能建议注释 -->
        <el-form-item prop="verificationCode">
          <el-input
            v-model.trim="form.verificationCode"
            :placeholder="translate('验证码') + previewText"
            type="text"
          >
            <template #prefix>
              <vab-icon icon="barcode-box-line" />
            </template>
          </el-input>
          <el-image class="code" :src="codeUrl" @click="changeCode" />
        </el-form-item>
        <el-button
          v-throttle="handleLogin"
          class="login-btn"
          :loading="loading"
          native-type="submit"
          type="primary"
        >
          {{ translate('登录') }}
        </el-button>
        <router-link to="/register">
          <el-button
            style="margin-top: 20px; margin-left: -10px"
            type="primary"
          >
            {{ translate('注册') }}
          </el-button>
        </router-link>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { useUserStore } from '/@/store/modules/user'
  import { translate } from '/@/i18n'
  import { isPassword } from '/@/utils/validate'
  import { onBeforeRouteLeave } from 'vue-router'
  import { getImageUrl } from '/@/utils/imageUrl'

  defineOptions({
    name: 'Login',
  })

  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const settingsStore = useSettingsStore()
  const leftImg = ref<string>(getImageUrl(`assets/login_images/left_img.png`))
  const login = (form: any) => userStore.login(form)
  const loading = ref<boolean>(false)
  const passwordType = ref<string>('password')
  const redirect = ref<any>(undefined)
  let timer: any
  const codeUrl = ref<string>('https://www.oschina.net/action/user/captcha')
  const previewText = ref<string>('')
  const title = settingsStore.getTitle
  const formRef = ref<any>(null)
  const passwordRef = ref<any>(null)
  const form = reactive<any>({
    username: '',
    password: '',
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

  const rules = reactive<any>({
    username: [
      {
        required: true,
        trigger: 'blur',
        validator: validateUsername,
      },
    ],
    password: [
      {
        required: true,
        trigger: 'blur',
        validator: validatePassword,
      },
    ],
  })

  const handleRoute = () => {
    return redirect.value === '/404' || redirect.value === '/403'
      ? '/'
      : redirect.value
  }

  const handleLogin = async () => {
    if (formRef.value)
      formRef.value.validate(async (valid: any) => {
        if (valid)
          try {
            loading.value = true
            await login(form).catch(() => {
              loading.value = false
            })
            await router.push(handleRoute())
          } finally {
            loading.value = false
          }
      })
  }
  const changeCode = () => {
    codeUrl.value = `https://www.oschina.net/action/user/captcha?timestamp=${new Date().getTime()}`
  }

  onBeforeMount(() => {
    form.username = 'admin'
    form.password = '123456'
    // 为了演示效果，会在官网演示页自动登录到首页，正式开发可删除
    if (
      location.hostname === 'vue-admin-beautiful.com' ||
      location.hostname === 'chu1204505056.gitee.io'
    ) {
      previewText.value = '（演示地址验证码可不填）'
      timer = setTimeout(() => {
        handleLogin()
      }, 5000)
    }
  })

  watchEffect(() => {
    redirect.value = (route.query && route.query.redirect) || '/'
  })

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer)
    next()
  })
</script>

<style lang="scss" scoped>
  .login-container {
    position: relative;
    height: 100vh;
    padding-top: 20vh;
    background: url('/@/assets/login_images/background.jpg') center center fixed
      no-repeat;
    background-size: cover;
  }

  @media (max-width: 576px) {
    .login-form {
      width: 85vw !important;
      margin: auto !important;

      .left-img {
        display: none !important;
      }

      :deep() {
        .el-form--default {
          width: 94% !important;
        }
      }
    }
  }

  .login-form {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 1000px;
    height: 550px;
    padding: 4.5vh;
    margin: auto;
    overflow: hidden;
    background: var(--el-color-white);
    background-size: 100% 100%;
    border-radius: 15px;

    .left-img {
      float: left;
      width: 50%;
    }

    :deep() {
      .el-form--default {
        float: left;
        width: 44%;
        margin-left: 5.8%;
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

      .login-btn {
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
    }
  }
</style>
