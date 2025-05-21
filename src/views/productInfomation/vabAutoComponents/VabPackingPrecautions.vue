<template>
  <vab-dialog 
    v-model="visible" 
    :before-close="handlerCloseDialog" 
    title="打包注意事项"
    top="15vh"
    width="70%"
  >
    <div id="table-height-container">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table 
        ref="tableRef" 
        v-loading="listLoading" border 
        :cell-style="cellStyle"
        :data="list"
        :header-cell-style="{ 'text-align': 'center' }"
        stripe
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
            <el-select v-model="row.site" placeholder="请选择站点" @change="handleStatusChange(row)">
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
            <!-- <el-tooltip content=" " effect="dark" placement="top">
              <template #content>
                <div class="custom-tooltip">{{ removeHtmlTags(row.packagePrecautions) }}</div>
              </template>
              <div style="white-space: pre-wrap" v-html="row.packagePrecautions"></div>
            </el-tooltip> -->
            <div class="none">
              <el-input v-model="row.packagePrecautions" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" @blur="clickCancel($event, row)" />
            </div>
            <div style="white-space: pre-wrap" v-html="row.packagePrecautions"></div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="{ row, $index }">
            <el-link type="danger" :underline="false" @click="handleDelQualityInspection(row, $index)">删除</el-link>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
    </div>
  </vab-dialog>
  <!-- <vab-remark-dialog 
    v-model="remarkVisible"
    :remark="remark"
    title="修改打包注意事项"
    @update:remark="handleUpdatePackagePrecautions"
  /> -->
</template>

<script lang="ts" setup>
import type { TableInstance } from 'element-plus'
import { isEqual } from 'lodash'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { addProductQualityInspection, delProductQualityInspection, getProductQualityInspection, updateProductQualityInspection } from '/@/api/devlocal/productInformation'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { checkTypeList } from '/@/views/newProductDevelopment/indexCommon'

defineOptions({
  name: 'VabPackingPrecautions'
})

const props = defineProps<{
  modelValue: boolean
  skuId: number
}>()
const emit = defineEmits(['update:modelValue', 'update:tableValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(() => props.modelValue, (val) => {
  if (val) {
    fetchData()
    fetchSiteData()
  }
})
// const remarkVisible = ref<boolean>(false)
// const remark = ref<string>('')
const siteList = ref<{ id: number, label: string }[]>([])
const list = ref<any>([])
// 表格加载loading状态
const listLoading = ref<boolean>(true)
const tableRef = ref<TableInstance>()

// const handleUpdatePackagePrecautions = async (val: string) => {
//   const { data } = await updateProductQualityInspection({ ...copyRow, packagePrecautions: val })
//   if (data) {
//     remarkVisible.value = false
//     $baseMessage('修改打包注意事项成功','success', 'hey')
//     await fetchData()
//   }
//   copyRow.status = 1
// }
const handlerCloseDialog = () => {
  visible.value = false
  emit('update:tableValue', list.value)
}
const handleCheckType = async (row: any) => {
  await updateProductQualityInspection(row)
  fetchData()
  row.status = 1
}
const handleStatusChange = async (row: any) => {
  // 勾选了需拍照的，需质检列必须也勾选
  if (row.isUploadImages === 1) {
    row.status = 1
    $baseMessage('勾选了需拍照的，需质检列必须也勾选','warning', 'hey')
  }
  await updateProductQualityInspection(row)
  fetchData()
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
const handleAdd = async () => {
  try {
    const newQualityInspection = {
      skuId: props.skuId,
      status: 1,
      checkType: 0,
      packagePrecautions: '',
    }
    const { data } = await addProductQualityInspection(newQualityInspection)
    if (data) {
      const { data: tableData } = await getProductQualityInspection({
        skuId: props.skuId
      })
      list.value = tableData
      // list.value.sort((a: any, b: any) => new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime());
      $baseMessage('新增质检清单成功', 'success', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}
let copyRow: any
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => { 
  // if (column.label === '打包注意事项') {
  //   remarkVisible.value = true
  //   remark.value = row.packagePrecautions
  //   copyRow = row
  //   return
  // }
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  copyRow = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
const clickCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      const { data } = await updateProductQualityInspection({ ...copyRow, packagePrecautions: value.packagePrecautions })
      if (data) {
        // remarkVisible.value = false
        $baseMessage('修改打包注意事项成功','success', 'hey')
        await fetchData()
      }
      copyRow.status = 1
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
// 删除
const handleDelQualityInspection = async (row: any, index: number) => {
  try {
    $baseConfirm('确定要删除本条信息吗? ', "系统提示", async () => {
      try {
        const { data } = await delProductQualityInspection({ id: row.id! })
        if (data) {
          list.value.splice(index, 1);
          fetchData()
          $baseMessage("删除成功！","success","hey")
        } else {
          $baseMessage("删除失败，请重试。", "error", "hey");
        }
      } catch (delError) {
        console.error(delError);
        $baseMessage("删除操作失败，请重试。", "error", "hey");
      }
    });
  } catch(error){
    console.log(error as Error)
  }
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
/**
 * 获取样品进度数据
 */
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getProductQualityInspection({
    skuId: props.skuId
  })
  list.value = data
  listLoading.value = false
  list.value.sort((a: any, b: any) => new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime());
}
onActivated(() => {
  tableRef.value?.doLayout()
})
</script>

<style lang="scss" scoped>
#table-height-container {
  display: flex;
  flex-direction: column;
  height: calc(80vh - 120px);
  max-height: calc(80vh - 120px);
  padding-bottom: 20px;
  .el-table {
    flex: 1; // 使表格占据剩余空间
    overflow: auto; // 确保表格内容可以滚动
  }
}
.custom-checkbox {
  transform: scale(1.2); 
  transform-origin: center;
}
.none {
  display: none;
}
.custom-tooltip {
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
}
</style>
