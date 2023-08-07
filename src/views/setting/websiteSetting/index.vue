<template>
  <div class="website-setting-container no-background-container">
    <el-row :gutter="20">
      <el-col :lg="6" :md="14" :sm="24" :xl="10" :xs="24">
        <vab-card>
          <template #header>网站设置</template>
          <el-form ref="formRef" label-width="100px" :model="form" :rules="formRules" @submit="submitForm">
            <el-form-item label="网站名称" prop="siteName">
              <el-input v-model="form.siteName" clearable />
            </el-form-item>
            <el-form-item label="网址" prop="siteUrl">
              <el-input v-model="form.siteUrl" clearable />
            </el-form-item>
            <el-form-item label="META关键词" prop="metaKeywords">
              <el-input v-model="form.metaKeywords" clearable />
            </el-form-item>
            <el-form-item label="META描述" prop="metaDesc">
              <el-input v-model="form.metaDesc" clearable />
            </el-form-item>
            <el-form-item label="版权信息" prop="copyright">
              <el-input v-model="form.copyright" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">保存</el-button>
            </el-form-item>
          </el-form>
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'WebsiteSetting',
})

interface formType {
  siteName: string
  siteUrl: string
  metaKeywords: string
  metaDesc: string
  copyright: string
}

const $baseMessage = inject<any>('$baseMessage')

const form = reactive<formType>({
  siteName: 'Vue Shop Vite',
  siteUrl: 'https://vue-admin-beautiful.com/shop-vite',
  metaKeywords: '',
  metaDesc: '',
  copyright: '',
})
const formRef = ref<any>(null)
const formRules = reactive<any>({
  siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  siteUrl: [
    { required: true, message: '请输入网址', trigger: 'blur' },
    {
      pattern: /^https?:\/\/.*/,
      message: '请输入正确的网址',
      trigger: 'blur',
    },
  ],
  metaKeywords: [{ required: true, message: '请输入META关键词', trigger: 'blur' }],
  metaDesc: [{ required: true, message: '请输入META描述', trigger: 'blur' }],
  copyright: [{ required: true, message: '请输入版权信息', trigger: 'blur' }],
})

const submitForm = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      $baseMessage('表单提交成功', 'success', 'hey')
    }
  })
}
</script>
