<template>
  <vab-dialog v-model="visible" title="SKU变更日志" width="60%">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-date-picker
              v-model="queryForm.dateRange"
              end-placeholder="结束日期"
              start-placeholder="开始日期"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="搜索SKU" @input="handleSearch" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="handleSearch" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table border :data="changeLogList" :max-height="700" stripe>
      <el-table-column label="修改时间" prop="createTime" width="170" />
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(changeLogList, 'SKU', 'sku')" />
      <el-table-column label="PO" prop="po" width="100" />
      <el-table-column label="已有零件ID" prop="componentId" width="130" />
      <el-table-column label="变更项目" prop="changeField" width="200" />
      <el-table-column label="变更前" min-width="120" prop="oldValue" show-overflow-tooltip />
      <el-table-column label="变更后" min-width="120" prop="newValue" show-overflow-tooltip />
      <el-table-column label="修改理由" min-width="120" prop="changeReason" show-overflow-tooltip />
      <el-table-column label="操作类型" prop="type" width="150" />
      <el-table-column label="操作人" prop="operator" width="100" />
    </el-table>
    <vab-pagination
      :current-page="changeLogPageNo"
      :page-size="changeLogPageSize"
      :total="changeLogTotal"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { flexColumnWidth } from '~/src/utils/tableColum'
import { querySkuChangeLog } from '/@/api/devlocal/productInformation'
import type { IskuChangeLogItem } from '/@/type/productInformation/skuInformationType'

defineOptions({
  name: 'SkuChangeLogDialog',
})

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const changeLogList = ref<IskuChangeLogItem[]>([])
const changeLogTotal = ref<number>(0)
const changeLogPageNo = ref<number>(1)
const changeLogPageSize = ref<number>(20)
const queryForm = reactive({
  keyWord: '',
  dateRange: null as [string, string] | null,
})

const fetchChangeLog = async () => {
  const params: any = {
    pageNo: changeLogPageNo.value,
    pageSize: changeLogPageSize.value,
  }
  if (queryForm.keyWord) {
    params.keyWord = queryForm.keyWord
  }
  if (queryForm.dateRange && queryForm.dateRange.length === 2) {
    params.startTime = queryForm.dateRange[0]
    params.endTime = queryForm.dateRange[1]
  }
  const { data } = await querySkuChangeLog(params)
  if (data) {
    changeLogList.value = data.list || []
    changeLogTotal.value = data.total || 0
  }
}

const handleSearch = () => {
  changeLogPageNo.value = 1
  fetchChangeLog()
}

const handleCurrentChange = (val: number) => {
  changeLogPageNo.value = val
  fetchChangeLog()
}

const handleSizeChange = (val: number) => {
  changeLogPageNo.value = 1
  changeLogPageSize.value = val
  fetchChangeLog()
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      changeLogPageNo.value = 1
      fetchChangeLog()
    }
  }
)
</script>
