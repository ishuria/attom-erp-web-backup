<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :draggable="false" :title="title" top="7vh" width="500px" @close="close">
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="角色代码" prop="roleCode">
        <el-tooltip class="item" content="角色代码必须是ROLE_XXXX形式，且必须是全大写英文" effect="dark" placement="top-start">
          <el-input v-model="form.roleCode" :disabled="disableRoleCode" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="菜单">
        <div class="vab-tree-border">
          <el-tree
            ref="treeRef"
            :data="list"
            :default-checked-keys="form.menuCheckedList"
            highlight-current
            node-key="id"
            show-checkbox
            @check="handleCheckChange"
          >
            <template #default="{ data }">
              <span>
                {{ data.meta.title }}
                <span v-if="data.id === 146">-沃尔玛</span>
                <span v-else-if="data.id === 151">-美工</span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" clearable />
      </el-form-item>
      <el-form-item label="角色英文" prop="roleNameEn">
        <el-input v-model="form.roleNameEn" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status" active-color="#13ce66" active-value="0" inactive-color="#ff4949" inactive-value="1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { doAdd, doEdit, getAllMenuAndBtnList, getMenuAndBtnListByRoleCode } from '/@/api/devlocal/role'
import type { IRole, IRoleAddOrUpdateReq } from '/@/type/role/roleType'

defineOptions({
  name: 'RoleEdit',
})

const emit = defineEmits(['fetch-data'])
const formRef = ref<FormInstance>()
const treeRef = ref<any>(null)
const disableRoleCode = ref<boolean>(false)
const form = reactive<IRoleAddOrUpdateReq>({
  roleId: '',
  menuCheckedList: [],
  menuIds: '',
  permissionIds: '',
  roleCode: '',
  roleName: '',
  roleNameEn: '',
  status: '0',
})

const rules = reactive<any>({
  roleCode: [{ required: true, trigger: 'blur', message: '请输入角色码' }],
  roleName: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
  roleNameEn: [{ required: true, trigger: 'blur', message: '请给角色英文' }],
})
const checkMenuList = ref<string[]>([])
const childMenuBtnList = ref<string[]>([])
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)
const list = ref<IRole[]>([])

const showEdit = (row: any) => {
  dialogFormVisible.value = true
  checkMenuList.value = []
  childMenuBtnList.value = []

  nextTick(async () => {
    if (row) {
      const { data } = await getMenuAndBtnListByRoleCode({ roleCode: row.roleCode })

      // 处理拿到菜单回显问题
      const arr: any = []

      data.forEach((item: any) => {
        if (!treeRef.value?.getNode(item).childNodes || !treeRef.value?.getNode(item).childNodes.length) {
          arr.push(item)
        }
      })
      form.menuCheckedList = arr
      treeRef.value?.setCheckedKeys(arr)
      title.value = '编辑'
      disableRoleCode.value = true
      Object.assign(form, row)
    } else {
      disableRoleCode.value = false
      Object.assign(form, {
        roleId: '',
        menuIds: '',
        permissionIds: '',
        roleCode: '',
        roleName: '',
        roleNameEn: '',
        status: '0',
      })
      form.menuCheckedList.length = 0
      form.menuCheckedList = []
      treeRef.value?.setCheckedKeys([])
      title.value = '添加'
    }
  })
}

defineExpose({
  showEdit,
})

const close = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  checkMenuList.value = []
  childMenuBtnList.value = []
  form.menuIds = ''
  form.permissionIds = ''
  form.menuCheckedList = []
  // 清空tree勾选
  treeRef.value?.setCheckedKeys([])
  emit('fetch-data')
}

// 菜单节点处理方法
const handleCheckChange = (data1: any, data2: any) => {
  // 选中的子节点
  const checkedKeys = data2.checkedKeys
  childMenuBtnList.value = checkedKeys

  // 选中的父节点
  const halfCheckedKeys = data2.halfCheckedKeys

  // 数据合并
  checkMenuList.value = [...checkedKeys, ...halfCheckedKeys]
}

const fetchData = async () => {
  const { data } = await getAllMenuAndBtnList()
  list.value = data
}

const save = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      const checkedMenuKeys = [...treeRef.value.getCheckedKeys(), ...treeRef.value.getHalfCheckedKeys()]
      if (checkedMenuKeys.length === 0) {
        await $baseMessage('请至少选择一个菜单', 'warning', 'hey')
        return
      }

      const menuIdsStr = checkedMenuKeys.map(String).join(',')
      // tree菜单对应的keys
      form.menuIds = menuIdsStr

      // 权限
      const permissionIdsList: [] = treeRef.value.getCheckedNodes(false, true).map((item: any) => {
        return `${item.permissionId}`
      })

      const permissionIdsStr = permissionIdsList.map(String).join(',')
      form.permissionIds = permissionIdsStr
      if (form.roleId && form.roleId != '') {
        const { msg }: any = await doEdit({
          ...form,
        })
        await $baseMessage(msg, 'success', 'hey')
      } else {
        const { msg }: any = await doAdd({
          ...form,
        })
        await $baseMessage(msg, 'success', 'hey')
      }
      await close()
      dialogFormVisible.value = false

      // 清空
      treeRef.value?.setCheckedKeys([])
      form.menuIds = ''
      form.permissionIds = ''
      checkMenuList.value = []
      childMenuBtnList.value = []
    }
  })
}

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.vab-tree-border {
  width: 100%;
  height: 600px;
  padding: var(--el-padding);
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}
</style>
