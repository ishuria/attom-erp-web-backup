<template>
  <el-dialog v-model="dialogFormVisible" append-to-body draggable :title="title" width="500px" @close="close">
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="角色码" prop="role">
        <el-input v-model="form.role" clearable />
      </el-form-item>
      <el-form-item label="菜单">
        <div class="vab-tree-border">
          <el-tree
            ref="treeRef"
            :data="list"
            :default-checked-keys="['/', '/vab', '/other', '/noColumn', '/setting']"
            :default-expanded-keys="[]"
            node-key="path"
            show-checkbox
          >
            <template #default="{ data }">
              <span>{{ data.meta.title }}</span>
            </template>
          </el-tree>
        </div>
      </el-form-item>
      <el-form-item label="按钮权限">
        <el-input v-model="form.btnRolesCheckedList" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { doEdit } from '/@/api/roleManagement'
import { getList } from '/@/api/router'

defineOptions({
  name: 'RoleManagementEdit',
})

const emit = defineEmits(['fetch-data'])

const $baseMessage = inject<any>('$baseMessage')

const formRef = ref<any>(null)
const treeRef = ref<any>(null)
let form = reactive<any>({
  role: '',
  btnRolesCheckedList: [],
})
const rules = reactive<any>({
  role: [{ required: true, trigger: 'blur', message: '请输入角色码' }],
})
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)
const list = ref<any>([])

const showEdit = (row: any) => {
  if (!row) {
    title.value = '添加'
    form = reactive<any>({})
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
const fetchData = async () => {
  const { data } = await getList()
  list.value = data.list
}
const save = () => {
  formRef.value.validate(async (valid: any) => {
    if (valid) {
      const tree = treeRef.value.getCheckedKeys()
      const treeObject = { 'treeArray:': tree }
      const { msg }: any = await doEdit({
        ...form,
        ...treeObject,
      })
      $baseMessage(msg, 'success', 'hey')
      emit('fetch-data')
      close()
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
