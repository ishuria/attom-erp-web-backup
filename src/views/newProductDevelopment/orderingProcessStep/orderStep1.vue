<template>
    <div>
        <el-space direction="vertical" style="width: 100%">
            <el-form 
                ref="formRef" 
                class="demo-form" 
                label-position="right" 
                label-width="auto" 
                :model="form" 
                style="max-width: 370px;"
                @submit.prevent
                :rules="rules" 
            >
                <el-form-item label="合并变体的SKU(若有)" prop="excludingTax">
                    <el-input v-model="form.excludingTax" clearable />
                </el-form-item>
                <el-form-item label="产品主品名" prop="standardInvoice">
                    <el-input v-model="form.standardInvoice" clearable placeholder="eg:碗架,硅胶吸管,水杯收纳" />
                </el-form-item>
                <el-form-item label="产品短描述" prop="specialInvoice">
                    <el-input v-model="form.specialInvoice" clearable placeholder="eg:20管45×31.7CM" />
                </el-form-item>
                <el-form-item label="新建变体数量(含本体)" prop="variantsTotal">
                    <el-input v-model="form.variantsTotal" type="number" min="0" clearable @input="updateVariants"/>
                </el-form-item>
            </el-form>
            <el-space>
                <el-form 
                    ref="formRef" 
                    label-position="right" 
                    label-width="80px" 
                    :model="form" 
                    style="max-width: 370px; "
                    @submit.prevent
                >
                    <el-form-item 
                        v-for="(item, index) in form.variantNames"
                        :key="index"
                        :label="`变体名 ${index + 1}`"
                        :prop="`variantNames.${index}`"
                    >
                        <el-input v-model="form.variantNames[index]" clearable placeholder="黑色；白色；1大1小；海洋系列等"/>
                    </el-form-item>
                </el-form>
                <el-form 
                    ref="formRef" 
                    label-position="right" 
                    label-width="180px" 
                    :model="form" 
                    style="max-width: 370px;"
                    @submit.prevent
                >
                    <el-form-item 
                        v-for="(item, index) in form.bookTotal"
                        :key="index"
                        :label="`订货数量(亚马逊US) ${index + 1}`"
                        :prop="`bookTotal.${index}`"
                    >
                        <el-input v-model="form.bookTotal[index]" clearable />
                    </el-form-item>
                </el-form>
            </el-space>
            <div style="color: var(--el-color-primary)">注：产品最终名称系统自动合成=产品主品名+产品规格描述+变体名（若有）</div>
        </el-space>
        <div class="pay-button-group">
            <el-button @click="handleGoback">退出</el-button>
            <el-button native-type="submit" type="primary" @click="handleSubmit">保存</el-button>
            <el-button native-type="submit" type="primary" @click="handleSubmitAndContinue">保存并继续</el-button>
        </div>
    </div>
  </template>
  
<script lang="ts" setup>
defineOptions({
    name: 'OrderStep1',
})
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import type { FormInstance } from 'element-plus'

const route: any = useRoute()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore


const emit = defineEmits(['change-step'])
const formRef = ref<FormInstance>()
const form = reactive<any>({
  payAccount: '****************',
  gatheringAccount: '****************',
  gatheringName: '***',
  variantsTotal: 1,
  variantNames: [''],
  bookTotal: [''],
})
const rules = reactive<any>({
  payAccount: [{ required: true, message: '请输入产品主品名', trigger: 'blur' }],
  gatheringAccount: [
    { required: true, message: '请输入产品短描述', trigger: 'blur' },
  ],
  gatheringName: [{ required: true, message: '请输入新建变体数量(含本体)', trigger: 'blur' }],
})
// 当变体数量改变时
function updateVariants() {
    // 如果变体数量小于variantNames数组长度，会裁剪数组
    if (form.variantsTotal < form.variantNames.length) {
        form.variantNames = form.variantNames.slice(0, form.variantsTotal);
    } else {
    // 如果变体数量大于variantNames数组长度，会扩展数组，并初始化新元素
        form.variantNames = Array.from({ length: form.variantsTotal }, (_, i) => form.variantNames[i] || '');
    }
    if (form.variantsTotal < form.bookTotal.length) {
        form.bookTotal = form.bookTotal.slice(0, form.variantsTotal);
    } else {
    // 如果变体数量大于bookTotal数组长度，会扩展数组，并初始化新元素
        form.bookTotal = Array.from({ length: form.variantsTotal }, (_, i) => form.bookTotal[i] || '');
    }
}  
// 当点击保存的时候
const handleSubmit = () => {
  formRef.value?.validate((valid: any) => {
    if (valid) {
      $baseMessage("当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。","success","hey")
    }
  })
}
// 当点击保存并继续的时候
const handleSubmitAndContinue = () => {
  formRef.value?.validate((valid: any) => {
    if (valid) {
      $baseMessage("当前进度已成功保存到“新品审核与记录”。如果中途退出后需要继续编辑，请到“新品审核与记录”里查看。","success","hey")
      emit('change-step', 1)
    }
  })
}
// 当点击退出的时候
const handleGoback = async () => {
    await delVisitedRoute(handleActivePath(route, true))
    history.back()
}
</script>
  
<style lang="scss" scoped>
.pay-button-group {
    display: block;
    margin: 20px auto;
    text-align: center;
}
</style>
  