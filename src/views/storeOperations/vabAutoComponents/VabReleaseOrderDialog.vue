<template>
  <div>
    <vab-dialog v-model="visible" :draggable="false" title="发布订货" width="55%" @opened="handleOpened">
      <div class="release-order-content">
        <el-alert
          v-if="form.warningMessage"
          class="release-order-alert"
          :closable="false"
          show-icon
          :title="form.warningMessage"
          type="warning"
        />

        <el-form v-loading="loading" class="release-order-form" label-position="top" :model="form">
          <!-- 第一行：图片、SKU和描述 -->
          <div class="form-row">
            <el-form-item class="image-item">
              <el-image
                class="sku-image"
                close-on-press-escape
                fit="cover"
                hide-on-click-modal
                :preview-src-list="form.skuImageUrl ? [form.skuImageUrl] : []"
                preview-teleported
                :src="form.skuImageUrl"
              >
                <template #error><el-icon /></template>
              </el-image>
            </el-form-item>

            <el-form-item class="sku-item" label="SKU">
              <el-select v-model="form.sku" class="sku-select" placeholder="请选择SKU" @change="handleSwitchSku">
                <el-option v-for="item in skuList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item class="description-item" label="描述">
              <el-input v-model="form.description" class="description-input" disabled />
            </el-form-item>
          </div>

          <!-- 第二行：其他信息 -->
          <div class="form-row">
            <el-form-item class="number-item" label="订货数量">
              <el-input-number ref="inputRef" v-model="form.number" class="number-input" :min="0" />
            </el-form-item>

            <!-- <el-form-item class="split-item" label="拆分">
            <div class="checkbox-wrapper">
              <el-checkbox v-model="form.split" disabled :false-value="0" :true-value="1" />
              <span class="checkbox-label">{{ form.split ? '是' : '否' }}</span>
            </div>
          </el-form-item> -->

            <el-form-item class="moq-item" label="起订量">
              <el-input v-model="form.moq" class="info-input" disabled />
            </el-form-item>

            <el-form-item class="carton-item" label="整箱数">
              <el-input v-model="form.numberOfCartons" class="info-input" disabled />
            </el-form-item>

            <el-form-item class="manager-item" label="产品经理">
              <el-input v-model="form.productManagerName" class="info-input" disabled />
            </el-form-item>
          </div>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="handleConfirm">发布</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'

defineOptions({
  name: 'VabReleaseOrderDialog',
})

interface Props {
  modelValue: boolean
  skuList: { value: string; label: string }[]
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', form: any): void
  (e: 'switch-sku', sku: string): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const inputRef = ref<any>(null)

const handleOpened = async () => {
  await nextTick()
  // el-input-number 内部是真正的 input
  const input = inputRef.value?.$el?.querySelector('input')
  input?.focus()
  input?.select()
}
// 弹窗显示状态
const visible = ref(false)

// 表单数据
const form = reactive({
  sku: '',
  skuImageUrl: '',
  description: '',
  number: 0,
  split: 0,
  moq: '',
  numberOfCartons: '',
  productManagerName: '',
  warningMessage: '',
})

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (newValue) => {
    visible.value = newValue
  }
)

// 监听弹窗内部状态变化
watch(visible, (newValue) => {
  emit('update:modelValue', newValue)
})

// 处理SKU切换
const handleSwitchSku = (sku: string) => {
  emit('switch-sku', sku)
}

// 处理取消
const handleCancel = () => {
  visible.value = false
}

// 处理确认
const handleConfirm = async () => {
  // 检查订货数量是否为整箱数的倍数
  const numberOfCartons = Number(form.numberOfCartons)
  const orderNumber = Number(form.number)

  // 如果整箱数有效且订货数量不是整箱数的倍数，则弹出二次确认
  if (numberOfCartons > 0 && orderNumber > 0 && orderNumber % numberOfCartons !== 0) {
    try {
      await ElMessageBox.confirm(`订货数量 ${orderNumber} 不是整箱数 ${numberOfCartons} 的倍数，是否继续发布？`, '提示', {
        confirmButtonText: '继续发布',
        cancelButtonText: '取消',
        type: 'warning',
      })
      // 用户确认后继续发布
      emit('confirm', { ...form })
    } catch {
      // 用户取消，不执行任何操作
      return
    }
  } else {
    // 是整箱数的倍数或没有整箱数限制，直接发布
    emit('confirm', { ...form })
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    sku: '',
    skuImageUrl: '',
    description: '',
    number: 0,
    split: 0,
    moq: '',
    numberOfCartons: '',
    productManagerName: '',
    warningMessage: '',
  })
}

// 设置表单数据
const setFormData = (data: any) => {
  Object.assign(form, data)
  form.number = data.orderQuantity
}

const setSelectedSku = (sku: string) => {
  resetForm()
  form.sku = sku
}

// 暴露方法给父组件
defineExpose({
  resetForm,
  setFormData,
  setSelectedSku,
})
</script>

<style lang="scss" scoped>
/* 发布订货弹窗样式 */
.release-order-content {
  padding: 20px;
}

.release-order-alert {
  margin-bottom: 16px;
}

.release-order-form {
  .form-row {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    align-items: flex-start;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .image-item {
    margin-bottom: 0;

    .sku-image {
      width: 100px;
      height: 100px;
      border: 2px solid #e4e7ed;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--el-color-primary);
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .sku-item {
    flex: 1;
    margin-bottom: 0;

    .sku-select {
      width: 100%;
      min-width: 200px;
    }
  }

  .description-item {
    flex: 1;
    margin-bottom: 0;

    .description-input {
      width: 100%;
      min-width: 200px;
    }
  }

  .number-item {
    flex: 1;
    margin-bottom: 0;

    .number-input {
      width: 100%;
      min-width: 150px;
    }
  }

  .split-item {
    margin-bottom: 0;

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      background-color: #f5f7fa;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      height: 32px;
      box-sizing: border-box;
      min-width: 120px;

      :deep(.el-checkbox) {
        transform: scale(1);
        margin: 0;
      }

      .checkbox-label {
        font-size: 14px;
        color: #606266;
        font-weight: 500;
      }
    }
  }

  .moq-item,
  .carton-item,
  .manager-item {
    flex: 1;
    margin-bottom: 0;

    .info-input {
      width: 100%;
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }

  :deep(.el-input-number) {
    .el-input__inner {
      text-align: center;
    }
  }
}
</style>
