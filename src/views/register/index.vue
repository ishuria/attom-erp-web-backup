<template>
  <div class="register-container">
    <div class="register-form">
      <img class="left-img" :src="leftImg" />
      <el-form ref="formRef" label-position="left" :model="form" :rules="rules">
        <div class="title">hello !</div>
        <div class="title-tips">{{ translateTitle('账号注册') }}</div>
        <el-form-item prop="username">
          <el-input
            v-model.trim="form.username"
            v-focus
            auto-complete="off"
            :placeholder="translateTitle('请输入用户名')"
            type="text"
          >
            <template #prefix>
              <vab-icon icon="user-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model.trim="form.phone"
            maxlength="11"
            :placeholder="translateTitle('请输入手机号')"
            show-word-limit
            type="text"
          >
            <template #prefix>
              <vab-icon icon="smartphone-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phoneCode" style="position: relative">
          <el-input
            v-model.trim="form.phoneCode"
            :placeholder="translateTitle('请输入手机验证码')"
            type="text"
          >
            <template #prefix>
              <vab-icon icon="barcode-box-line" />
            </template>
          </el-input>
          <el-button
            class="phone-code"
            :disabled="isGetPhone"
            type="primary"
            @click="getPhoneCode"
          >
            {{ phoneCode }}
          </el-button>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model.trim="form.password"
            autocomplete="new-password"
            :placeholder="translateTitle('请输入密码')"
            type="password"
          >
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-button
          class="register-btn"
          type="primary"
          @click.prevent="handleRegister"
        >
          {{ translateTitle('注册') }}
        </el-button>
        <router-link to="/login">
          <el-button
            style="margin-top: 20px; margin-left: -10px"
            type="primary"
          >
            {{ translateTitle('登录') }}
          </el-button>
        </router-link>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { translateTitle } from '/@/utils/i18n'
  import { isPassword, isPhone } from '/@/utils/validate'
  import { register } from '/@/api/user'
  import { useUserStore } from '/@/store/modules/user'
  import { getImageUrl } from '/@/utils/imageUrl'

  defineOptions({
    name: 'Register',
  })

  const $baseConfirm = inject<any>('$baseConfirm')

  const router = useRouter()

  const userStore = useUserStore()
  const { setToken } = userStore

  const leftImg = ref('')
  const img = getImageUrl(`assets/login_images/left_img.png`)
  leftImg.value = img

  const validateUsername = (rule: any, value: any, callback: any) => {
    if ('' === value) callback(new Error(translateTitle('用户名不能为空')))
    else callback()
  }
  const validatePassword = (rule: any, value: any, callback: any) => {
    if (!isPassword(value))
      callback(new Error(translateTitle('密码不能少于6位')))
    else callback()
  }
  const validatePhone = (rule: any, value: any, callback: any) => {
    if (!isPhone(value)) {
      callback(new Error(translateTitle('请输入正确的手机号')))
    } else {
      callback()
    }
  }

  const formRef: Ref<any> = ref(null)
  const isGetPhone: Ref<any> = ref(false)
  const getPhoneInterval: Ref<any> = ref(null)
  const phoneCode: Ref<any> = ref(translateTitle('获取验证码'))
  const form: any = reactive({
    username: '',
    password: '',
    phone: '',
    verificationCode: '',
  })
  const rules: any = reactive({
    username: [
      {
        required: true,
        trigger: 'blur',
        message: translateTitle('请输入用户名'),
      },
      { validator: validateUsername, trigger: 'blur' },
    ],
    phone: [
      {
        required: true,
        trigger: 'blur',
        message: translateTitle('请输入手机号'),
      },
      { validator: validatePhone, trigger: 'blur' },
    ],
    password: [
      {
        required: true,
        trigger: 'blur',
        message: translateTitle('请输入密码'),
      },
      { validator: validatePassword, trigger: 'blur' },
    ],
    phoneCode: [
      {
        required: true,
        trigger: 'blur',
        message: translateTitle('请输入手机验证码'),
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
        phoneCode.value = `${translateTitle('获取验证码 ') + n}s`
      } else {
        clearInterval(getPhoneInterval.value)
        phoneCode.value = translateTitle('获取验证码')
        getPhoneInterval.value = null
        isGetPhone.value = false
      }
    }, 1000)
  }
  const handleRegister = () => {
    formRef.value.validate(async (valid: any) => {
      if (valid) {
        const {
          msg,
          data: { token },
        }: any = await register(form).catch(() => {})
        $baseConfirm(
          `${msg}，点击确定模拟进入拥有【admin】角色的首页`,
          null,
          async () => {
            setToken(token)
            await router.push('/index')
          }
        )
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
    min-height: 700px;
    background: url('/@/assets/login_images/background.jpg') center center fixed
      no-repeat;
    background-size: cover;

    @media (max-width: 576px) {
      .register-form {
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

    .register-form {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 1000px;
      height: 620px;
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

        .register-btn {
          display: inherit;
          width: 220px;
          height: 50px;
          margin-top: 5px;
          border: 0;

          &:hover {
            opacity: 0.9;
          }
        }

        .tips {
          margin-bottom: 10px;
          font-size: var(--el-font-size-default);
          color: var(--el-color-white);

          span {
            &:first-of-type {
              margin-right: 16px;
            }
          }
        }

        .title-container {
          position: relative;

          .title {
            margin: 0 auto 40px auto;
            font-size: 34px;
            font-weight: bold;
            color: var(--el-color-primary);
            text-align: center;
          }
        }

        i {
          position: absolute;
          top: 9px;
          left: 15px;
          z-index: $base-z-index;
          font-size: 16px;
          color: var(--el-color-black);
          cursor: pointer;
          user-select: none;
        }

        .show-password {
          position: absolute;
          right: 25px;
          left: -35px;
          font-size: 16px;
          color: var(--el-color-black);
          cursor: pointer;
          user-select: none;
        }

        .el-form-item {
          padding-right: 0;
          margin: 20px 0;
          color: #454545;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 2px;

          &__content {
            min-height: $base-input-height;
            line-height: $base-input-height;
          }

          &__error {
            position: absolute;
            top: 100%;
            left: 18px;
            font-size: var(--el-font-size-small);
            line-height: 18px;
            color: var(--el-color-error);
          }
        }

        .el-input {
          box-sizing: border-box;

          input {
            height: 48px;
            padding-left: 35px;
            font-size: var(--el-font-size-default);
            line-height: 48px;
            background: var(--el-color-white);
            border: 0;
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
          color: #fff;
          cursor: pointer;
          user-select: none;
          border-radius: 3px;
        }
      }
    }
  }
</style>
