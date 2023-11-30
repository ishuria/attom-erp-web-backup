<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :title="title" width="500px" @close="close">
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="form.username" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" clearable type="password" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-checkbox-group v-model="form.roles">
          <el-checkbox label="admin" />
          <el-checkbox label="editor" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { doEdit } from '/@/api/userManagement'

defineOptions({
  name: 'UserManagementEdit',
})

const emit = defineEmits(['fetch-data'])
const $baseMessage = inject<any>('$baseMessage')

const formRef = ref<any>(null)
let form = ref<any>({
  username: '',
  password: '',
  email: '',
  roles: [],
})
const rules = reactive<any>({
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
  email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
  roles: [{ required: true, trigger: 'blur', message: '请选择角色' }],
})
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)

const showEdit = (row: any) => {
  if (!row) {
    title.value = '添加'
  } else {
    title.value = '编辑'
    form = reactive<any>({ ...row })
  }
  dialogFormVisible.value = true
}

defineExpose({
  showEdit,
})

const close = () => {
  formRef.value.resetFields()
  emit('fetch-data')
  dialogFormVisible.value = false
}

const save = () => {
  formRef.value.validate(async (valid: any) => {
    if (valid) {
      const { msg }: any = await doEdit(form)
      $baseMessage(msg, 'success', 'hey')
      emit('fetch-data')
      close()
    }
  })
}
</script>
