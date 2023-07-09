<template>
  <el-dialog
    v-model="dialogFormVisible"
    append-to-body
    draggable
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="父节点" prop="parentValue">
        <el-tree-select v-model="form.parentValue" :data="treeData" />
      </el-form-item>
      <el-form-item label="名称" prop="label">
        <el-input v-model="form.label" />
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
  let form = ref<any>({
    parentValue: '',
  })
  const rules = reactive<any>({
    parentValue: [{ required: true, trigger: 'blur', message: '请选择父节点' }],
    label: [{ required: true, trigger: 'blur', message: '请输入名称' }],
    order: [{ required: true, trigger: 'blur', message: '请输入排序' }],
  })
  const title = ref<string>('')
  const dialogFormVisible = ref<boolean>(false)

  const fetchData = async () => {
    const { data } = await getList()
    treeData.value = data.list
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

<style lang="scss" scoped>
  :deep() {
    .el-select {
      width: 100%;
    }
  }
</style>
