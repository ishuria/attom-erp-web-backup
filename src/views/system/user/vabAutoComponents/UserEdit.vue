<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :title="title" width="500px" @close="close" :draggable="false">
    <el-form ref="formRef" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model.trim="form.userName" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" clearable type="password" />
      </el-form-item>

      <el-form-item label="今年病假" prop="currentYearSickLeave">
        <el-input v-model.trim="form.currentYearSickLeave" clearable />
      </el-form-item>
      <el-form-item label="明年病假" prop="nextYearSickLeave">
        <el-input v-model.trim="form.nextYearSickLeave" clearable />
      </el-form-item>
      <el-form-item label="今年年假" prop="currentYearAnnualLeave">
        <el-input v-model.trim="form.currentYearAnnualLeave" clearable />
      </el-form-item>
      <el-form-item label="明年年假" prop="nextYearAnnualLeave">
        <el-input v-model.trim="form.nextYearAnnualLeave" clearable />
      </el-form-item>
      <el-form-item label="所属分公司" prop="affiliatedBranchCompany">
        <el-select v-model="form.affiliatedBranchCompany" filterable clearable placeholder="请选择分公司">
          <el-option v-for="item in form.companies" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
import { convertString } from '/@/utils/stringUtils'
import { getList } from '/@/api/devlocal/role'
import { doAdd, doEdit, getCompany } from '/@/api/devlocal/user'
import { IAddParams, IEditParams, IUserAddOrUpateReq } from '/@/type/user/userType'
import { constantRoutes } from '~/src/router'

defineOptions({
  name: 'UserEdit',
})

const emit = defineEmits(['fetch-data'])
const formRef = ref<FormInstance>()
const form = reactive<IUserAddOrUpateReq>({
  userId:'',
  userName: '',
  password: '',
  currentYearSickLeave: null,
  nextYearSickLeave: null,
  currentYearAnnualLeave: null,
  nextYearAnnualLeave: null,
  affiliatedBranchCompany: "",
  email: '',
  roleName: '',
  roleCode: '',
  status: '0',
  roles: [],
  companies: [], //分公司列表
})

const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)

const rules = reactive<any>({
  userName: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
  email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
  roleId: [{ required: true, trigger: 'blur', message: '请选择角色' }],
  status: [{ required: true, trigger: 'blur', message: '请选择状态' }],
  currentYearSickLeave: [{ required: true, trigger: 'blur', message: '请输入今年年假' }],
  nextYearSickLeave: [{ required: true, trigger: 'blur', message: '请输入明年年假' }],
  currentYearAnnualLeave: [{ required: true, trigger: 'blur', message: '请输入今年年假' }],
  nextYearAnnualLeave: [{ required: true, trigger: 'blur', message: '请输入明年年假' }],
  affiliatedBranchCompany: [{ required: true, trigger: 'blur', message: '请选择所属分公司' }],
})

const showEdit = (row: any) => {
  dialogFormVisible.value = true
  fetchData()
  fetchCompanyData()
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
        const newForm: IEditParams = {
          userId: form.userId ,
          username: form.userName,
          password: form.password,
          roleCode: form.roleCode,
          status: form.status,
          currentYearSickLeave: form.currentYearSickLeave,
          nextYearSickLeave: form.nextYearSickLeave,
          currentYearAnnualLeave: form.currentYearAnnualLeave,
          nextYearAnnualLeave: form.nextYearAnnualLeave,
          affiliatedBranchCompanyId: form.affiliatedBranchCompany
        }
        const { msg }: any = await doEdit(newForm)
        await $baseMessage(msg, 'success', '用户编辑成功！')
        await close()
      } else {
        const newForm: IAddParams = {
          username: form.userName,
          password: form.password,
          email: form.email,
          roleCode: form.roleCode,
          status: form.status,
          currentYearSickLeave: form.currentYearSickLeave,
          nextYearSickLeave: form.nextYearSickLeave,
          currentYearAnnualLeave: form.currentYearAnnualLeave,
          nextYearAnnualLeave: form.nextYearAnnualLeave ,
          affiliatedBranchCompanyId: form.affiliatedBranchCompany
        }
        const { msg }: any = await doAdd(newForm)
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
const fetchCompanyData = async () => {
  const { data } = await getCompany()
  data.forEach((item: any) => {
    item.value = convertString(item.value)
  });
  form.companies = data
}
</script>
