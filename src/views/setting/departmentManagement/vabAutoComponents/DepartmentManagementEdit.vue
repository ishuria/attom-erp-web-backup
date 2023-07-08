<template>
  <el-dialog
    v-model="dialogFormVisible"
    draggable
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="父节点" prop="parentName">
        <el-select v-model="form.parentId" placeholder="请选择父节点">
          <el-option
            :label="form.parentName"
            style="height: auto; padding: 0"
            :value="form.parentId"
          >
            <el-tree
              ref="treeRef"
              :data="treeData"
              default-expand-all
              :props="defaultProps"
              @node-click="handleNodeClick"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input v-model="form.order" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { doEdit, getList } from '/@/api/departmentManagement'

  defineOptions({
    name: 'DepartmentManagementEdit',
  })

  const emit = defineEmits(['fetch-data'])
  const $baseMessage = inject<any>('$baseMessage')

  const formRef = ref<any>(null)
  const treeData = ref<any>([])
  const defaultProps = reactive<any>({
    children: 'children',
    label: 'name',
  })
  let form = ref<any>({
    parentName: '',
    parentId: '',
  })
  const rules = reactive<any>({
    parentName: [{ required: true, trigger: 'blur', message: '请选择父节点' }],
    name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
    order: [{ required: true, trigger: 'blur', message: '请输入排序' }],
  })
  const title = ref<string>('')
  const dialogFormVisible = ref<boolean>(false)

  const fetchData = async () => {
    const { data } = await getList()
    treeData.value = data.list
  }
  const handleNodeClick = (node: { name: any; id: any }) => {
    form.parentName = node.name
    form.parentId = node.id
  }
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

  onMounted(() => {
    fetchData()
  })
</script>
