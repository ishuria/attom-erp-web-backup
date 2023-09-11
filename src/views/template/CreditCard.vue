<template>
  <div class="credit-card-container">
    <credit-card-form :background-image="backgroundImage" :form-data="formData" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" setup>
import { CreditCardForm } from '@opentiny/vue'

defineOptions({
  name: 'CreditCard',
})

const date = new Date()
const $baseMessage = inject<any>('$baseMessage')
const backgroundImage = ref(`https://res.hc-cdn.com/tiny-vue-web-doc/3.10.5.20230903162611/static/images/mountain.png`)
const formData = ref({
  cardName: 'FULL NAME',
  cardNumber: '6288888888888888888',
  cardMonth: date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1,
  cardYear: date.getFullYear(),
  cardCvv: '',
})

const handleSubmit = (value: any) => {
  $baseMessage(`提交的信息为：${JSON.stringify(value)}`, 'success', 'hey')
}
</script>

<style lang="scss" scoped>
.credit-card-container {
  :deep() {
    .credit-card-input {
      &__label {
        color: var(--el-color-black);
      }

      &__input {
        color: var(--el-color-black);
        border: 1px solid var(--el-border-color);

        &:focus,
        &:hover {
          border-color: var(--el-color-primary);
          border-radius: var(--el-border-radius-base);
        }

        &.-select {
          font-size: 16px;
          background-image: none;
          border-radius: var(--el-border-radius-base);

          option {
            color: var(--el-color-black);
            background: var(--el-color-white);
            border: 0;
            border-radius: var(--el-border-radius-base);
          }
        }
      }

      &__eye {
        top: 34px;

        &.-active:not(:disabled),
        &:hover:not(:disabled) {
          color: var(--el-color-primary);
        }
      }
    }

    .credit-card-form {
      &__inner {
        background: var(--el-color-white);
        border: 1px solid var(--el-border-color);
        box-shadow: 0 30px 60px 0 var(--el-border-color);
      }

      &__button {
        color: var(--el-color-white);
        background: var(--el-color-primary);
        box-shadow: none;
        transition: var(--el-transition);

        &:hover,
        &:focus {
          background-color: var(--el-color-primary-light-3);
          border-color: var(--el-color-primary-light-3);
        }
      }
    }

    .credit-card-item {
      &__side {
        border: 1px solid var(--el-border-color);
        box-shadow: none;
      }
    }
  }
}
</style>
