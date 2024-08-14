<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :title="title" width="500px" @close="close" :draggable="false">
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="角色代码" prop="roleCode">
        <el-tooltip class="item" effect="dark" content="角色代码必须是ROLE_XXXX形式，且必须是全大写英文" placement="top-start">
          <el-input :disabled="disableRoleCode" v-model="form.roleCode" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="菜单">
        <div class="vab-tree-border">
          <el-tree
            ref="treeRef"
            highlight-current
            default-expand-all
            :data="list"
            :default-checked-keys="form.menuCheckedList"
            node-key="id"
            show-checkbox
            @check="handleCheckChange"
          >
            <template #default="{ data }">
              <span>{{ data.meta.title }}</span>
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
import { doAdd, doEdit, getAllMenuAndBtnList, getMenuAndBtnListByRoleCode } from '/@/api/devlocal/role'

defineOptions({
  name: 'RoleEdit',
})

const emit = defineEmits(['fetch-data'])
const formRef = ref<FormInstance>()
const treeRef = ref<any>(null)
const disableRoleCode = ref<boolean>(false)
const form = reactive<any>({
  menuCheckedList: [],
  menuIds: '',
  menuBtnIds: '',
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
const checkMenuList = ref<any>([])
const childMenuBtnList = ref<any>([])
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)
const list = ref<any>([])

const showEdit = (row: any) => {
  dialogFormVisible.value = true

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
      form.menuCheckedList.length = 0
      form.menuCheckedList = []
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
  // 清空tree勾选
  treeRef.value.setCheckedKeys([])
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
      if (checkMenuList.value.length == 0) {
        checkMenuList.value = [...treeRef.value.getCheckedKeys(), ...treeRef.value.getHalfCheckedKeys()]
      }

      const menuIdsStr = checkMenuList.value.map(String).join(',')
      // tree菜单对应的keys
      form.menuIds = menuIdsStr


      if (childMenuBtnList.value == 0){
        childMenuBtnList.value = [...treeRef.value.getCheckedKeys()]
      }

      const menuBtnIdsStr = childMenuBtnList.value.map(String).join(',')
      form.menuBtnIds = menuBtnIdsStr

      // 权限
      const permissionIdsList: [] = treeRef.value.getCheckedNodes(false, true).map((item: any) => {
        return item.permissionId + ''
      })

      const permissionIdsStr = permissionIdsList.map(String).join(',')
      form.permissionIds = permissionIdsStr

      if (form.roleId) {
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
      treeRef.value.setCheckedKeys([])
      form.menuIds = ''
      form.permissionIds = ''
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
  height: 250px;
  padding: var(--el-padding);
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}
</style>
