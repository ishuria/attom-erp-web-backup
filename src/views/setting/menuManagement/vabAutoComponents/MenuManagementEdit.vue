<template>
  <el-dialog v-model="dialogFormVisible" append-to-body draggable :title="title" width="830px" @close="close">
    <el-form ref="formRef" inline label-width="140px" :model="form" :rules="rules">
      <el-form-item label="父级Id" prop="parentId">
        <el-input v-model="form.parentId" clearable />
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path" clearable />
      </el-form-item>
      <el-form-item label="vue文件路径" prop="component">
        <el-input v-model="form.component" clearable />
      </el-form-item>
      <el-form-item label="重定向" prop="redirect">
        <el-input v-model="form.redirect" clearable />
      </el-form-item>
      <el-form-item label="标题" prop="meta.title">
        <el-input v-model="form.meta.title" clearable />
      </el-form-item>
      <el-form-item label="图标">
        <el-popover popper-class="icon-selector-popper" trigger="hover" :width="305">
          <template #reference>
            <el-input v-model="form.meta.icon" clearable />
          </template>
          <vab-icon-selector @handle-icon="handleIcon" />
        </el-popover>
      </el-form-item>
      <el-form-item label="badge">
        <el-input v-model="form.meta.badge" clearable />
      </el-form-item>
      <el-form-item label="dot">
        <el-switch v-model="form.meta.dot" />
      </el-form-item>
      <el-form-item label="隐藏">
        <el-switch v-model="form.meta.hidden" />
      </el-form-item>
      <el-form-item label="始终显示当前节点">
        <el-switch v-model="form.meta.levelHidden" />
      </el-form-item>
      <el-form-item label="自定义svg图标">
        <el-switch v-model="form.meta.isCustomSvg" />
      </el-form-item>
      <el-form-item label="固定">
        <el-switch v-model="form.meta.noClosable" />
      </el-form-item>
      <el-form-item label="无缓存">
        <el-switch v-model="form.meta.noKeepAlive" />
      </el-form-item>
      <el-form-item label="不显示当前标签页">
        <el-switch v-model="form.meta.tabHidden" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { doEdit } from '/@/api/menuManagement'

defineOptions({
  name: 'MenuManagementEdit',
})

const emit = defineEmits(['fetch-data'])
const $baseMessage = inject<any>('$baseMessage')
const formRef = ref<any>(null)
let form = reactive<any>({
  parentId: '',
  name: '',
  path: '',
  component: '',
  redirect: '',
  meta: {
    title: '',
    icon: '',
    badge: '',
    dot: false,
    hidden: false,
    levelHidden: false,
    isCustomSvg: false,
    noClosable: false,
    noKeepAlive: false,
    tabHidden: false,
  },
})
const rules = reactive<any>({
  parentId: [{ required: true, trigger: 'blur', message: '请输入父级id' }],
  name: [{ required: true, trigger: 'blur', message: '请输入name' }],
  path: [{ required: true, trigger: 'blur', message: '请输入path' }],
  component: [{ required: true, trigger: 'blur', message: '请输入component' }],
  'meta.title': [{ required: true, trigger: 'blur', message: '请输入标题' }],
})
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)

const handleIcon = (item: string) => {
  form.meta.icon = item
}

const showEdit = (row: any) => {
  if (!row) {
    title.value = '添加'
    form = reactive<any>({
      parentId: '',
      name: '',
      path: '',
      component: '',
      redirect: '',
      meta: {
        title: '',
        icon: '',
        badge: '',
        dot: false,
        hidden: false,
        levelHidden: false,
        isCustomSvg: false,
        noClosable: false,
        noKeepAlive: false,
        tabHidden: false,
      },
    })
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

<style lang="scss" scoped>
.el-input {
  width: 200px;
}
</style>
