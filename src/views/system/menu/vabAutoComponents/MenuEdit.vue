<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :title="title" width="850px" @close="close">
    <el-form ref="formRef" label-width="120px" :model="form" :rules="rules" label-position="right">
      <el-form-item label="上级菜单" prop="parentId">
        <!-- <el-input v-model="form.parentId" clearable /> -->
        <el-tree-select
          v-model="selectMenuValue"
          :data="menuList"
          :filter-node-method="filterNodeMethod"
          filterable
          clearable
          value-key="id"
        />
      </el-form-item>
      <el-row :gutter="24" type="flex">
        <el-col :span="12">
          <el-form-item label="name" prop="name">
            <el-input v-model="form.name" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="路径" prop="path">
            <el-input v-model="form.path" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12" class="menu-row">
          <el-form-item label="标题" prop="meta.title">
            <el-input v-model="form.meta.title" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="vue文件路径" prop="component" class="menu-row">
        <el-input v-model="form.component" clearable />
      </el-form-item>

      <!-- <el-form-item label="图标">
        <el-popover popper-class="icon-selector-popper" trigger="hover" :width="305">
          <template #reference>
            <el-input v-model="form.meta.icon" clearable />
          </template>
          <vab-icon-selector @handle-icon="handleIcon" />
        </el-popover>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { getMenuList, getMenuNameList } from '/@/api/devlocal/router'

defineOptions({
  name: 'MenuEdit',
})

const emit = defineEmits(['fetch-data'])

const formRef = ref<FormInstance>()
const form = reactive<any>({
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
    guard: [],
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

const selectMenuValue = ref()

const menuList = ref()

const handleIcon = (item: string) => {
  form.meta.icon = item
}

const showEdit = (row: any) => {
  dialogFormVisible.value = true
  nextTick(async () => {
    if (row) {
      title.value = '编辑'
      Object.assign(form, row)
    } else {
      title.value = '添加'
      form.meta = {
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
        guard: [],
      }
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
      // const { msg }: any = await doEdit(form)
      // await $baseMessage(msg, 'success', 'hey')
      // await close()
      dialogFormVisible.value = false
    }
  })
}

const menuInit = async () => {
  const { data } = await getMenuNameList()
  menuList.value = data
}

onBeforeMount(() => {
  menuInit()
})

const filterNodeMethod = (value, data) => data.label.includes(value)
</script>

<style lang="scss" scoped>
:deep() {
  .menu-row {
    padding-top: 25px;
  }
  // .el-form-item__content {
  //   min-width: 200px;

  //   .el-input {
  //     width: 200px;
  //   }
  // }
}
</style>
