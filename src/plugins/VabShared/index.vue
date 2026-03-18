<template>
  <vab-dialog 
    v-model="dflag" 
    :before-close = "handlerCloseDialog" 
    title="共享"
    top="5vh"
    width="650"
 >
    <el-table :cell-style="{ textAlign: 'center' }" :data="props.list" :header-cell-style="{ 'text-align': 'center' }" height="75vh">
      <el-table-column label="用户id" prop="userID" />
      <el-table-column label="用户名" prop="userName" />
      <el-table-column column-key="type" :filter-method="filterHandler" :filters="roleNameFilters" label="角色名" prop="roleName" />
      <el-table-column label="操作" prop="isShare" >
        <template #default="{ row }">
          <el-switch
            v-model="row.share"
            class="ml-2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="props.handlerSwitchChange(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>

import { TableColumnCtx } from 'element-plus'
import { IShared, } from '/@/type/evaluation/evaluationType'
import { IProgressShared } from '/@/type/progress/progressType'
defineOptions({
  name: 'VabShared',
})

// 设置props属性并赋值默认值
let props = withDefaults(defineProps<{
    visible: boolean
    id:string
    list: IShared[] | IProgressShared[]
    handlerSwitchChange: (row: any) => void
    fetchData: () => void
}>(),{
    visible: false,
})

// 定义事件
const emit = defineEmits<{ 
    (e: 'update:sharedVisible', value: boolean): void
}>()

const dflag = ref<boolean>(false)
  watchEffect(()=>{
    dflag.value = props.visible
  }
)

// 计算属性：从list中提取角色名并去重
const roleNameFilters = computed(() => {
  const roleNames = [...new Set(props.list.map(item => item.roleName))]
  return roleNames.map(roleName => ({
    text: roleName,
    value: roleName
  }))
})

const filterHandler = (
  value: string,
  row: IShared,
  column: TableColumnCtx<IShared>
) => {
  const property = column['property']
  return row[property] === value
}
const sharedColumns = [
  {
    label: '用户id',
    prop: 'userID',
  },
  {
    label: '用户名',
    prop: 'userName',
  },
  {
    label: '角色名',
    prop: 'roleName',
  },
  {
    label: '操作',
    prop: 'isShare',
  },
]

// 关闭dialog
const handlerCloseDialog = () =>{
    emit('update:sharedVisible', false);
    props.fetchData()
}


</script>