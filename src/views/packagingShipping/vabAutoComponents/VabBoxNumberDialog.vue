<template>
  <vab-dialog
    v-model="visible"
    class="dialog"
    :close-on-click-modal="false"
    title="箱号"
    :width="dialogWidth"
    @close="handleCloseDialog"
    @opened="handleOpened"
  >
    <el-form
      ref="boxNumberFormRef"
      label-position="right"
      label-width="auto"
      :model="boxNumberForm"
      :rules="boxNumberFormRules"
      style="margin-right: 10px; margin-left: 10px"
    >
      <el-form-item label="箱号" prop="boxNumber">
        <el-input v-model="boxNumberForm.boxNumber" disabled />
      </el-form-item>
      <el-form-item label="合作人" prop="partner">
        <el-select
          v-model="boxNumberForm.partner"
          clearable
          filterable
          :loading="packagerOptionsLoading"
          multiple
          placeholder="请选择合作人"
          style="width: 100%"
        >
          <el-option v-for="item in packagerOptions" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发往站点" prop="site">
        <el-select v-model="boxNumberForm.site" placeholder="请选择站点" style="width: 100%">
          <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-button :loading="boxNumberLoading" type="primary" @click="reinsertBoxNumber">回插</el-button>
          <el-button :loading="boxNumberLoading" @click="increaseBoxNumber">递增</el-button>
        </div>
        <div>
          <el-button :loading="nextLoading" type="primary" @click="showPacking">下一步</el-button>
        </div>
      </div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { checkEncasementNo, getIncrementBoxNo, getReinsertionBoxNo } from '/@/api/devlocal/encasement'
import { getPackagePackagerList } from '/@/api/devlocal/packagingShipping'
import { useUserStore } from '/@/store/modules/user'
import type { SelectOption } from '/@/type/common'
import type { IBoxNumberForm, ISiteOption } from '/@/type/packagingShipping/shippedType'

defineProps<{
  siteList: ISiteOption[]
}>()

const visible = defineModel<boolean>({ default: false })
// 是否回插
const isReinsert = defineModel<boolean>('isReinsert', { default: false })
const emit = defineEmits<{
  (event: 'next', value: { boxNumber: number; site: number; partner: number[]; isReinsert: boolean }): void
}>()

const userStore = useUserStore()
const boxNumberLoading = ref<boolean>(false)
const nextLoading = ref<boolean>(false)
const packagerOptions = ref<SelectOption[]>([])
const packagerOptionsLoading = ref<boolean>(false)
const boxNumberFormRef = ref<FormInstance>()
const boxNumberForm = reactive<IBoxNumberForm>({
  boxNumber: undefined,
  site: undefined,
  partner: [],
})

// 校验规则
const partnerValidator = (_rule: any, value: number[] | undefined, callback: (error?: Error) => void) => {
  if (!Array.isArray(value) || value.length === 0) {
    callback(new Error('请选择合作人员'))
    return
  }
  callback()
}
const boxNumberFormRules = reactive<FormRules<IBoxNumberForm>>({
  site: [{ required: true, message: '请选择站点', trigger: 'change' }],
  partner: [{ required: true, validator: partnerValidator, trigger: 'change' }],
})

const getDefaultPartnerIds = () => {
  const currentUserId = Number(userStore.getUserId)
  if (!Number.isFinite(currentUserId)) return []

  return packagerOptions.value.some((item) => item.id === currentUserId) ? [currentUserId] : []
}

const fetchPackagerOptions = async () => {
  if (packagerOptions.value.length > 0 || packagerOptionsLoading.value) return

  packagerOptionsLoading.value = true
  try {
    const { data } = await getPackagePackagerList()
    packagerOptions.value = data ?? []
  } catch {
    $baseMessage('获取合作人列表失败，请刷新后重试', 'error')
  } finally {
    packagerOptionsLoading.value = false
  }
}

const setDefaultPartner = () => {
  if (!boxNumberForm.partner?.length) {
    boxNumberForm.partner = getDefaultPartnerIds()
  }
}

const fetchBoxNumber = async (reinsert: boolean) => {
  boxNumberLoading.value = true
  try {
    const { data } = reinsert ? await getReinsertionBoxNo() : await getIncrementBoxNo()
    if (data) {
      boxNumberForm.boxNumber = data
    }
  } finally {
    boxNumberLoading.value = false
  }
}

const handleOpened = async () => {
  await fetchBoxNumber(isReinsert.value)
  await fetchPackagerOptions()
  setDefaultPartner()
}

const increaseBoxNumber = async () => {
  isReinsert.value = false
  await fetchBoxNumber(false)
  $baseMessage('递增获取箱号成功', 'success')
}

const reinsertBoxNumber = async () => {
  isReinsert.value = true
  await fetchBoxNumber(true)
  $baseMessage('回插获取箱号成功', 'success')
}

const handleCloseDialog = () => {
  boxNumberFormRef.value?.resetFields()
  boxNumberForm.boxNumber = undefined
  boxNumberForm.partner = []
  visible.value = false
}

const showPacking = async () => {
  if (nextLoading.value || boxNumberForm.boxNumber == null) return

  nextLoading.value = true
  try {
    const { data } = await checkEncasementNo({ boxNo: boxNumberForm.boxNumber })
    if (!data) return

    await boxNumberFormRef.value?.validate((isValid: boolean) => {
      if (!isValid || boxNumberForm.boxNumber == null || boxNumberForm.site == null) return

      emit('next', {
        boxNumber: boxNumberForm.boxNumber,
        site: boxNumberForm.site,
        partner: boxNumberForm.partner ?? [],
        isReinsert: isReinsert.value,
      })
      handleCloseDialog()
    })
  } finally {
    nextLoading.value = false
  }
}

const dialogWidth = computed<string>(() => {
  // 获取屏幕宽度并根据不同设备返回宽度
  const screenWidth = window.innerWidth
  if (screenWidth <= 768) {
    return '80%' // 手机设备
  } else if (screenWidth <= 1024) {
    return '60%' // 小型平板设备
  } else if (screenWidth <= 1200) {
    return '50%' // 中型平板设备
  } else {
    return '20%' // 大屏设备
  }
})
</script>
