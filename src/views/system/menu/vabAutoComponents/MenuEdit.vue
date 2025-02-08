<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :draggable="false" :title="title" width="850px" @close="close">
    <el-form ref="formRef" label-position="right" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="上级菜单" prop="pid">
        <el-tree-select
          v-model="form.pid"
          :check-strictly="true"
          clearable
          :data="menuList"
          :filter-node-method="filterNodeMethod"
          filterable
          value-key="id"
          @change="changePid"
          @clear="cleanSelectData"
        />
      </el-form-item>
      <el-row :gutter="24" type="flex">
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio value="0">菜单</el-radio>
              <el-radio value="1">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col class="menu-row" :span="11">
          <el-form-item label="菜单排序" prop="sort">
            <el-input-number v-model="form.sort" :max="100" :min="0" @change="handleChange" />
          </el-form-item>
        </el-col>

        <el-col class="menu-row" :span="13">
          <el-form-item label="菜单状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col v-if="form.type == 0" :span="11">
          <el-form-item class="menu-row" label="name" prop="name">
            <el-input v-model="form.name" clearable />
          </el-form-item>
        </el-col>

        <el-col v-if="form.type == 0" :span="13">
          <el-form-item class="menu-row" label="路径" prop="path">
            <el-input v-model="form.path" clearable />
          </el-form-item>
        </el-col>

        <el-col class="menu-row" :span="11">
          <el-form-item v-if="form.type == 0" label="标题" prop="meta.title">
            <el-input v-model="form.meta.title" clearable />
          </el-form-item>
          <el-form-item v-if="form.type == 1" label="按钮名称" prop="meta.title">
            <el-input v-model="form.meta.title" clearable />
          </el-form-item>
        </el-col>

        <el-col v-if="form.type != 0" class="menu-row" :span="13">
          <el-form-item label="后台权限id" prop="permissionId">
            <el-input v-model="form.permissionId" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="form.type == 0" class="menu-row" label="图标">
        <el-popover popper-class="icon-selector-popper" trigger="click" :width="500">
          <template #reference>
            <el-input v-model="form.meta.icon" clearable placeholder="点击选择图标" />
          </template>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form inline @submit.prevent>
                <el-form-item>
                  <el-input v-model="iconTitle" clearable />
                </el-form-item>
                <el-form-item>
                  <el-button :icon="Search" native-type="submit" type="primary" @click="queryData" />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <div style="display: flex; flex-wrap: wrap; justify-content: space-around; max-height: 300px; overflow-y: auto">
            <div v-for="(item, index) in queryIcon" :key="index" :span="6">
              <vab-card @click="handleIcon(item)">
                <vab-icon :icon="item" />
              </vab-card>
            </div>
          </div>
        </el-popover>
      </el-form-item>

      <el-form-item v-if="form.pid == '1' && form.type != 1" label="vue文件路径" prop="component">
        <el-input v-model="form.component" :disabled="true" />
      </el-form-item>

      <el-form-item v-if="form.pid != '1' && form.type != 1" label="vue文件路径" prop="component">
        <el-input v-model="form.component" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'
import { doAdd, getMenuNameList } from '/@/api/devlocal/router'
import { icons } from '/@/icon'

import type { IMenuAddOrUpdteReq } from '/@/type/menu/menuType'

defineOptions({
  name: 'MenuEdit',
})
const queryIcon = ref<any>([])
const iconTitle = ref()
const emit = defineEmits(['fetch-data'])

const formRef = ref<FormInstance>()

const form = reactive<IMenuAddOrUpdteReq>({
  id: '',
  pid: '',
  name: '',
  path: '',
  component: '',
  permissionId: '',
  type: 0,
  sort: 0,
  status: '0',
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
  menuName: '',
})

const rules = reactive<any>({
  pid: [{ required: true, trigger: 'blur', message: '请选择上级菜单id' }],
  name: [{ required: true, trigger: 'blur', message: '请输入name' }],
  path: [{ required: true, trigger: 'blur', message: '请输入path' }],
  component: [{ required: true, trigger: 'blur', message: '请输入component' }],
  'meta.title': [{ required: true, trigger: 'blur', message: '请输入标题' }],
})

const title = ref<string>('')

const dialogFormVisible = ref<boolean>(false)

const menuList = ref()

const handleIcon = (item: string) => {
  form.meta.icon = item
}

const showEdit = (row: IMenuAddOrUpdteReq) => {
  dialogFormVisible.value = true
  nextTick(async () => {
    if (row) {
      title.value = '编辑'
      Object.assign(form, row)
    } else {
      title.value = '添加'
      form.pid = ''
      form.component = ''
      form.permissionId = ''
      form.name = ''
      form.path = ''
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
  dialogFormVisible.value = false
  emit('fetch-data')
  form.id = ''
}

const save = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      if (form.id && form.id != '') {
        console.log(form, '修改')
        // const { msg }: any = await doUpdate({...form,menuName:form.meta.title})
        // await $baseMessage(msg, 'success', 'hey')
      } else {
        const { msg }: any = await doAdd({ ...form, menuName: form.meta.title })
        await $baseMessage(msg, 'success', 'hey')
      }
      await close()
      dialogFormVisible.value = false
    }
  })
}

const menuInit = async () => {
  const { data } = await getMenuNameList()
  menuList.value = data
  // 图标初始化
  queryIcon.value = icons
}

// 上级菜单搜索过滤
const filterNodeMethod = (value: string, data: any) => data.label.includes(value)

// 菜单排序
const handleChange = (value: any) => {
  form.sort = value
}

// icon图标过滤方法
const queryData = () => {
  if (iconTitle.value == undefined || iconTitle.value == '') {
    queryIcon.value = icons
  } else {
    queryIcon.value = queryIcon.value.filter((val: string) => val.includes(iconTitle.value))
  }
}

// 主目录变化
const changePid = (value: any) => {
  if (value == 1) {
    form.component = 'Layout'
  }
  form.pid = value
}

const cleanSelectData = () => {
  form.pid = ''
  form.component = ''
}

onBeforeMount(() => {
  menuInit()
})
</script>

<style lang="scss" scoped>
:deep() {
  .menu-row {
    padding-top: 25px;
  }
}

.icon-selector-popper {
  .vab-query-form {
    margin-top: calc(var(--el-margin) / 2);

    .el-input {
      width: 220px;
    }
  }

  .el-card__body {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 25px;
    cursor: pointer;

    [class*='ri-'] {
      font-size: 28px;
      color: var(--el-color-grey);
      text-align: center;
      pointer-events: none;
      cursor: pointer;
    }
  }
}
</style>
