<script lang="ts" setup>
  import { reactive } from 'vue'

  defineOptions({
    name: 'Amount',
  })

  const formRef = ref<any>()
  const NUMBERS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const IUNIT = ['元', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿']
  const DUNIT = ['角', '分']
  const form = reactive<any>({
    value: '',
    transformed: '',
  })
  const $baseMessage = inject<any>('$baseMessage')
  const regex = /^\d+(\.\d{1,2})?$/

  const rules = reactive<any>({
    amount: [
      { required: true, message: '请输入金额', trigger: 'blur' },
      {
        pattern: regex,
        message: '请输入有效的金额格式',
        trigger: 'blur',
      },
    ],
  })

  const onInput = () => {
    const formatted = format(form.amount.toString())
    form.amount = formatted
    form.transformed = toChinese(formatted)
  }

  const format = (value: string) => {
    value = value.replace(/^0*([1-9]\d*)/, '$1')
    value = value.replace(/^(\d+)\.(\d{2}).*/, '$1.$2')
    if (value.length > 16) {
      value = value.substring(0, 16)
    }
    return value
  }

  const toChinese = (value: string) => {
    if (!regex.test(value)) $baseMessage('请输入有效的金额格式', 'error', 'hey')
    else {
      const [integer, decimal] = value.split('.')
      if (integer.length > 9) {
        $baseMessage('整数部分不能超过9位', 'error', 'hey')
        return
      }

      const intTrans = (integer: string) => {
        let result = ''
        const intArr = integer.split('').reverse()
        for (let i = 0; i < intArr.length; i++) {
          if (intArr[i] === '0') continue
          result = NUMBERS[parseInt(intArr[i])] + IUNIT[i] + result
        }
        return result
      }

      const decTrans = (decimal: string) => {
        let result = ''
        const decArr = decimal.split('')
        for (let i = 0; i < decArr.length; i++) {
          result += NUMBERS[parseInt(decArr[i])] + DUNIT[i]
        }
        return `点${result}`
      }

      if (decimal) return intTrans(integer) + decTrans(decimal)
      else return intTrans(integer)
    }
  }
</script>

<template>
  <div class="amount-container no-background-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="12" :xl="8" :xs="24">
        <vab-card>
          <template #header>大写金额转换</template>
          <el-form
            ref="formRef"
            label-position="top"
            :model="form"
            :rules="rules"
            @submit.prevent
          >
            <el-form-item label="金额（数字）" prop="amount">
              <el-input v-model="form.amount" clearable />
            </el-form-item>
            <el-form-item label="操作">
              <el-button native-type="submit" type="primary" @click="onInput">
                转换
              </el-button>
            </el-form-item>
            <el-form-item label="转换结果">
              <h2>{{ form.transformed }}</h2>
            </el-form-item>
          </el-form>
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>
