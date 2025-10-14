<template>
  <vab-dialog v-model="visible" title="查错" width="40%">
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
      <el-table-column align="center" label="开始时间" min-width="160" prop="startTime">
        <template #default="{ row }">
          {{ formatTime(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" min-width="160" prop="endTime">
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
        label="工作时长(分钟)"
        prop="workingHours"
        :width="flexColumnWidth(list, '工作时长(分钟)', 'workingHours')"
      />
      <el-table-column align="center" label="PO" min-width="100" prop="po" />
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')" />
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
import type { ICheckingPackagingTimeError, ICheckingPackagingTimeErrorReq } from '/@/type/packagingShipping/packagingType'
import { flexColumnWidth } from '/@/utils/tableColum'

interface Props {
  modelValue: boolean
  startTime: string
  endTime: string
  userId: number
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

const list = ref<ICheckingPackagingTimeError[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)

const queryForm = reactive<ICheckingPackagingTimeErrorReq>({
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

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    queryForm.startTime = props.startTime
    queryForm.endTime = props.endTime
    queryForm.userId = props.userId

    const { data } = await checkingPackagingTimeError(queryForm)
    total.value = data.total
    list.value = data.list
    list.value.forEach((item: any) => {
      if (item.workingHours) {
        item.workingHours = item.workingHours.toFixed(2)
      }
    })
  } catch (error) {
    console.error('获取查错数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  queryForm.pageNo = 1
  fetchData()
}

// 页码变化
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

// 页大小变化
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

// 监听弹窗打开
watch(visible, (newVal) => {
  if (newVal) {
    fetchData()
  }
})
</script>
