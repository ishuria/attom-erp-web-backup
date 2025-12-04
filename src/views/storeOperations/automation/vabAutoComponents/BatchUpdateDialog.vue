<template>
  <vab-dialog v-model="visible" :title="title" top="7vh" width="23%">
    <el-form ref="formRef" label-position="right" label-width="auto" :model="form" style="margin: 0">
      <el-form-item label="规则开关" prop="roleStatus">
        <el-select v-model="form.roleStatus" :disabled="loading" placeholder="请填入信息">
          <el-option label="关闭广告" :value="0" />
          <el-option label="开启广告" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作对象" prop="requiredCompletionDate">
        <el-select v-model="form.group" :disabled="loading" placeholder="请选择操作对象">
          <el-option v-for="item in operationTypeList" :key="item.code" :label="item.name" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作广告类型" prop="requiredCompletionDate">
        <el-select v-model="form.operationAdvType" :disabled="loading" multiple placeholder="请选择广告类型">
          <el-option v-for="item in operationAdvTypeList" :key="item.code" :label="item.name" :value="item" />
        </el-select>
      </el-form-item>

      <el-card>
        <template #header><h3>开启广告</h3></template>
        <el-form-item label="剩余可售天数 ≥ " prop="requiredCompletionDate">
          <el-input v-model="form.openDays" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="可售库存数 ≥ " prop="cooperationCommissionRatio">
          <el-input v-model="form.openStock" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="断货天数 ≤ " prop="individualCommissionRate">
          <el-input v-model="form.openOutStockDays" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="广告ACOS ≤ " prop="cooperationWeight">
          <el-input v-model="form.openAdvAcos" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="Rating ≥ " prop="addition">
          <el-input v-model="form.openRating" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="毛利率 ≥ " prop="lowRate">
          <el-input v-model="form.openGrossProfit" :disabled="loading" type="number" />
        </el-form-item>
      </el-card>

      <el-card>
        <template #header><h3>关闭广告</h3></template>
        <el-form-item label="断货天数 ≥ " prop="lowRate">
          <el-input v-model="form.closeOutStockDays" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="剩余可售天数 ≤ " prop="lowRate">
          <el-input v-model="form.closeDays" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="可售库存数 ≤ " prop="lowRate">
          <el-input v-model="form.closeStock" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="Rating ≤ " prop="lowRate">
          <el-input v-model="form.closeRating" :disabled="loading" type="number" />
        </el-form-item>
        <el-form-item label="毛利率 ≤ " prop="lowRate">
          <el-input v-model="form.closeGrossProfit" :disabled="loading" type="number" />
        </el-form-item>
      </el-card>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { IAutoMationUpdateReq, IOperationType } from '/@/type/storeOperation/autoMation'

defineOptions({
  name: 'BatchUpdateDialog',
})

interface Props {
  title: string
  loading: boolean
  form: IAutoMationUpdateReq
  operationTypeList: IOperationType[]
  operationAdvTypeList: IOperationType[]
}
const visible = defineModel({ default: false })
const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: []
}>()

const formRef = ref()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  visible.value = false
}
</script>
