<template>
  <vab-dialog v-model="visible" title="查错" top="10vh" width="40%">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" native-type="submit" type="primary" @click="handleQuery" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table v-loading="loading" border :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="60vh" stripe>
      <el-table-column align="center" label="开始时间" prop="startTime" :width="160">
        <template #default="{ row }">
          {{ formatTime(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" prop="endTime" :width="160">
        <template #default="{ row }">
          {{ formatTime(row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="打包人姓名"
        prop="packPersonName"
        :width="flexColumnWidth(list, '打包人姓名', 'packPersonName')"
      />
      <el-table-column
        align="center"
        label="工时(分钟)"
        prop="workingHours"
        :width="flexColumnWidth(list, '工时(分钟)-', 'workingHours')"
      />
      <el-table-column align="center" label="PO" prop="po" :width="100">
        <template #default="{ row }">
          <div class="multi-line-text">{{ row.po.replaceAll(',', '\n') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SKU" min-width="160" prop="sku">
        <template #default="{ row }">
          <div class="multi-line-text">{{ row.sku.replaceAll(',', '\n') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="错误类型" prop="errorType" :width="100" />
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { checkingPackagingTimeError } from '/@/api/devlocal/packagingShipping'
import type { ICheckingPackagingTimeError, ICheckingPackagingTimeErrorForm } from '/@/type/packagingShipping/packagingType'
import { flexColumnWidth } from '/@/utils/tableColum'

interface Props {
  modelValue: boolean
  startTime: string
  endTime: string
  userId: number | string | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const allData = ref<ICheckingPackagingTimeError[]>([]) // 所有原始数据
const filteredData = ref<ICheckingPackagingTimeError[]>([]) // 过滤后的数据
const list = ref<ICheckingPackagingTimeError[]>([]) // 当前页数据
const total = ref<number>(0)
const loading = ref<boolean>(false)

const queryForm = reactive<ICheckingPackagingTimeErrorForm>({
  startTime: '',
  endTime: '',
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  userId: -1,
})

const formatTime = (time: string) => {
  if (!time) return ''

  // 将字符串转换为日期对象
  const date = new Date(time.replace(' ', 'T')) // 替换空格为T以符合ISO 8601格式

  // 格式化日期为 YYYY-MM-DD HH:mm
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 获取所有数据
const fetchAllData = async () => {
  loading.value = true
  try {
    const requestData = {
      startTime: props.startTime,
      endTime: props.endTime,
      keyWord: queryForm.keyWord,
      userId: props.userId ? Number(props.userId) : -1,
    }

    const { data } = await checkingPackagingTimeError(requestData)
    allData.value = data.list || []
    allData.value.forEach((item: any) => {
      if (item.workingHours) {
        item.workingHours = item.workingHours.toFixed(2)
      }
    })

    // 初始化过滤数据
    filteredData.value = [...allData.value]
    total.value = filteredData.value.length

    // 执行前端分页
    updatePagedData()
  } catch (error) {
    console.error('获取查错数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 前端分页处理
const updatePagedData = () => {
  const start = (queryForm.pageNo - 1) * queryForm.pageSize
  const end = start + queryForm.pageSize
  list.value = filteredData.value.slice(start, end)
}

// 搜索过滤
const filterData = () => {
  if (!queryForm.keyWord.trim()) {
    filteredData.value = [...allData.value]
  } else {
    const keyword = queryForm.keyWord.toLowerCase()
    filteredData.value = allData.value.filter(
      (item: any) =>
        item.po?.toLowerCase().includes(keyword) ||
        item.sku?.toLowerCase().includes(keyword) ||
        item.packPersonName?.toLowerCase().includes(keyword) ||
        item.errorType?.toLowerCase().includes(keyword)
    )
  }

  total.value = filteredData.value.length
  queryForm.pageNo = 1 // 重置到第一页
  updatePagedData()
}

// 查询
const handleQuery = () => {
  filterData()
}

// 页码变化
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  updatePagedData()
}

// 页大小变化
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  updatePagedData()
}

// 监听弹窗打开
watch(visible, (newVal) => {
  if (newVal) {
    fetchAllData()
  }
})
</script>

<style scoped>
.multi-line-text {
  white-space: pre-line;
  word-break: break-all;
}
</style>
