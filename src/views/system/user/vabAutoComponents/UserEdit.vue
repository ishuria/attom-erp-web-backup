<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :title="title" width="500px" @close="close" :draggable="false">
    <el-form ref="formRef" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model.trim="form.userName" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" clearable type="password" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="roleName">
        <el-select v-model="form.roleCode" filterable clearable placeholder="请选择角色">
          <el-option v-for="item in form.roles" :key="item.roleCode" :label="item.roleName" :value="item.roleCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949" active-value="0" inactive-value="1"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { getList } from '/@/api/devlocal/role'
import { doAdd, doEdit } from '/@/api/devlocal/user'
import { IUserAddOrUpateReq } from '/@/type/user/userType'

defineOptions({
  name: 'UserEdit',
})

const emit = defineEmits(['fetch-data'])
const formRef = ref<FormInstance>()
const form = reactive<IUserAddOrUpateReq>({
  userId:'',
  userName: '',
  password: '',
  email: '',
  roleName: '',
  roleCode: '',
  status: '0',
  roles: [],
})

const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)

const rules = reactive<any>({
  userName: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
  email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
  roleId: [{ required: true, trigger: 'blur', message: '请选择角色' }],
  status: [{ required: true, trigger: 'blur', message: '请选择状态' }],
})

const showEdit = (row: any) => {
  dialogFormVisible.value = true
  fetchData()
  nextTick(() => {
    if (row) {
      title.value = '编辑'
      Object.assign(form, row)
    } else {
      title.value = '添加'
      form.roleCode = '' // 重置因角色prop字段一样导致先点编辑，再点添加页面会出现上次编辑时的角色名
    }
  })
}

defineExpose({
  showEdit,
})

const close = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  emit('fetch-data')
}

const save = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      if (form.userId && form.userId != "") {
        const { msg }: any = await doEdit(form)
        await $baseMessage(msg, 'success', '用户添加成功！')
        await close()
      } else {
        const { msg }: any = await doAdd(form)
        await $baseMessage(msg, 'success', '用户添加成功！')
        await close()
      }
      dialogFormVisible.value = false
    }
  })
}

const fetchData = async () => {
  const { data } = await getList()
  form.roles = data
}
</script>
