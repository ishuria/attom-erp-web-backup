<template>
  <el-dialog
    v-model="dialogFormVisible"
    draggable
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form">
      <el-form-item label="父级key值" prop="parentKey">
        <el-input v-model="form.parentKey" disabled />
      </el-form-item>
      <el-form-item label="id" prop="id">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="key值" prop="key">
        <el-input v-model="form.key" />
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="form.value" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { doEdit } from '/@/api/dictionaryManagement'
  import { uuid } from '/@/utils'

  defineOptions({
    name: 'DictionaryManagementEdit',
  })

  const emit = defineEmits(['fetch-data'])

  const $baseMessage = inject<any>('$baseMessage')

  const formRef: Ref<any> = ref(null)
  let form: any = reactive({
    parentKey: '',
    id: uuid(),
    key: '',
    value: '',
  })
  const title = ref('')
  const dialogFormVisible = ref(false)

  const showEdit = (row: any) => {
    title.value = '添加/编辑'
    if (row) form = reactive({ ...row, id: uuid() })
    else
      form = reactive({
        ...row,
        id: uuid(),
        parentKey: 'root',
      })
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
        emit('fetch-data', { key: form.parentKey })
        close()
      }
    })
  }
</script>
