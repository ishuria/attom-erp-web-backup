<template>
  <vab-dialog 
    v-model="dflag" 
    title="共享" 
    width="650"
    :before-close = "handlerCloseDialog"
 >
    <el-table :data="props.list" :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }">
      <el-table-column v-for="(item, index) in sharedColumns" :key="index" :label="item.label" :prop="item.prop">
        <template #default="{ row }">
          <div v-if="item.label === '操作'">
            <el-switch
              v-model="row.share"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              @change="props.handlerSwitchChange(row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>

import {IShared,} from '/@/type/evaluation/evaluationType'
import { IProgressShared} from '/@/type/progress/progressType'
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