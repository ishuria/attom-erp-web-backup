<template>
  <div>
    <vab-dialog v-model="visible" title="批量新增质检项" width="70%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table 
        ref="tableRef" 
        border 
        :cell-style="cellStyle"
        :data="list"
        :header-cell-style="{ 'text-align': 'center' }"
        stripe
        height="800"
        @cell-click="changeInput"
      >
        <el-table-column label="修改日期" prop="createTime" width="140">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="需质检" prop="status" width="90">
          <template #default="{ row }">
            <el-checkbox v-model="row.status" class="custom-checkbox" :false-value="0" :true-value="1" @change="handleStatusChange(row)"/>
          </template>
        </el-table-column>
        <el-table-column label="需拍照" prop="isUploadImages" width="90">
          <template #default="{ row }">
            <el-checkbox v-model="row.isUploadImages" class="custom-checkbox" :false-value="0" :true-value="1" @change="handleStatusChange(row)"/>
          </template>
        </el-table-column>
        <el-table-column label="站点" prop="site" width="200">
          <template #default="{ row }">
            <el-select v-model="row.site" placeholder="请选择站点">
              <el-option 
                v-for="item in siteList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="检查类型" min-width="40">
          <template #default="{ row }">
            <el-select v-model="row.checkType" placeholder="请选择检查类型" style="min-width: 100%;" @change="handleCheckType(row)">
              <el-option
                v-for="item in checkTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="打包注意事项" min-width="200" prop="packagePrecautions">
          <template #default="{ row }">
            <div  
              class="editable-cell"
              :class="{ 'show-border': editRow !== row }">
              <el-input 
                v-if="editRow === row" 
                ref="inputRef" 
                v-model="row.packagePrecautions" 
                :autosize="{ minRows: 2, maxRows: 4 }" 
                type="textarea" 
                @blur="clickCancel($event, row)" 
                @keyup.enter="clickCancel($event, row)" 
              />
              <div v-else-if="row.packagePrecautions" style="white-space: pre-wrap" v-html="row.packagePrecautions"></div>
              <div v-else> - </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template #default="{ row, $index }">
            <el-link type="danger" underline='never' @click="handleDelQualityInspection(row, $index)">删除</el-link>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { IgetProductQualityInspection } from '/@/type/productInformation/skuInformationType'
import { checkTypeList } from '/@/views/newProductDevelopment/indexCommon'

defineOptions({
  name: 'VabBatchPackingPrecautions',
})

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    fetchSiteData()
  }
})
const list = ref<IgetProductQualityInspection[]>([])
const siteList = ref<{ id: number, label: string }[]>([])
const editRow = ref<IgetProductQualityInspection | null>(null)
const inputRef = ref()

const handleCancel = () => {
  visible.value = false
  list.value = []
}
const handleConfirm = () => {
  console.log(list.value)
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  const label = data.column.label
  if  (label === '修改日期'){        
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign:'center'
    } 
  } else if (label === '打包注意事项') {
    return {
      cursor: 'pointer',
      textAlign: 'left'
    } 
  } else {
    return {
      textAlign:'center'
    }
  }
}
const handleStatusChange = async (row: any) => {
  // 勾选了需拍照的，需质检列必须也勾选
  if (row.isUploadImages === 1 && row.status === 0) {
    $baseMessage('勾选了需拍照的，需质检列必须也勾选', 'warning', 'hey')
    row.status = 1
  }
}
const handleCheckType = async (row: any) => {
  row.status = 1
}
const handleAdd = async () => {
 
  const newQualityInspection = {
    status: 1,
    checkType: 0,
    packagePrecautions: '',
    id: 0,
    skuId: 0,
    createTime: new Date().toISOString().split('T')[0],
    isUploadImages: 0,
    site: -1,
  }
    list.value.push(newQualityInspection)
  
}

const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => { 
  if (column.label === '打包注意事项') {
    editRow.value = row

    nextTick(() => {
      const inputEl = inputRef.value?.input
      if (inputEl) {
        inputEl.focus()
        inputEl.select()
      }
    })
  }
}
const clickCancel = async (event: any, row: any) => {
  editRow.value = null
  // 执行失去焦点处理逻辑
  row.status = 1
}
// 删除
const handleDelQualityInspection = async (row: any, index: number) => {
 
  list.value.splice(index, 1);
 
}
// 获取站点信息
const fetchSiteData = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
  siteList.value.unshift({
    id: -1,
    label: '全部发货站点'
  })
}
</script>

<style lang="scss" scoped>
.el-checkbox {
  transform: scale(1.3);
}
.el-table {
  // :deep(.el-table__row) {
  //   height: 51px;
  // }

  :deep(.editable-cell) {
    
    // 统一高度的边框盒子（仅在非编辑状态下出现）
    &.show-border {
      padding: 4px;
      border: 1px dotted transparent;

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }
}
</style>