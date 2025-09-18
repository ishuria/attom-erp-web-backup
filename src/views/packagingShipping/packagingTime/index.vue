<template>
  <div class="comprehensive-table-container auto-height-container">
    <el-row :gutter="30" style="height: calc(100% - 52px)">
      <el-col :span="17" style="height: 100%">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showCost">打包成本设定</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-select
                  v-model.trim="queryForm.userId"
                  clearable
                  placeholder="全部人员"
                  style="width: 30px; margin-right: 10px"
                  @change="queryData"
                >
                  <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <div class="flex-container">
          <el-table border :cell-style="cellStyle" class="leftTable" :data="leftList" :header-cell-style="{ textAlign: 'center' }" stripe>
            <el-table-column label="姓名" prop="name" width="100" />
            <el-table-column label="开始时间" prop="startTime" width="160">
              <template #default="{ row }">
                {{ formatTime(row.startTime) }}
              </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="endTime" width="160">
              <template #default="{ row }">
                {{ formatTime(row.endTime) }}
              </template>
            </el-table-column>
            <el-table-column label="工时(分钟)" prop="workerHouse" width="130" />
            <el-table-column label="任务编号" prop="packTaskId" width="90">
              <template #default="{ row }">
                <span v-html="row.packTaskId"></span>
              </template>
            </el-table-column>
            <el-table-column label="PO" prop="po" width="100">
              <template #default="{ row }">
                <span v-html="row.po"></span>
              </template>
            </el-table-column>
            <el-table-column label="SKU" min-width="80" prop="sku">
              <template #default="{ row }">
                <span v-html="row.sku"></span>
              </template>
            </el-table-column>
            <el-table-column label="产品" min-width="80" prop="productName">
              <template #default="{ row }">
                <span v-html="row.productName"></span>
              </template>
            </el-table-column>
            <el-table-column v-permissions="{ permission: ['system:package:time:update'] }" label="操作" width="70">
              <template #default="{ row }">
                <span style="color: #4e88f3; cursor: pointer" @click="showModify(row)">修改</span>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty class="vab-data-empty" />
            </template>
          </el-table>
          <vab-pagination
            class="pagination"
            :current-page="queryForm.pageNo"
            :page-size="queryForm.pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-col>
      <el-col :span="7" style="height: 100%">
        <vab-query-form>
          <vab-query-form-left-panel :span="18" style="margin-bottom: 10px">
            <el-date-picker
              :key="datePickerKey"
              v-model="date"
              :disabled-date="disabledDate"
              :editable="false"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="width: 200px"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="queryRightData"
            />
            <el-select
              v-model="queryRightForm.userId"
              clearable
              placeholder="全部人员"
              style="width: 30px; margin-left: 10px"
              @change="queryRightData"
            >
              <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="6">
            <el-button type="danger" @click="showErrors">查错</el-button>
          </vab-query-form-right-panel>
        </vab-query-form>
        <div class="flex-container">
          <el-table
            border
            :cell-style="cellStyle"
            class="center-table"
            :data="rightList"
            :header-cell-style="{ textAlign: 'center' }"
            show-summary
            stripe
          >
            <el-table-column label="姓名" min-width="100" prop="name" />
            <el-table-column label="日期" min-width="80" prop="time">
              <template #default="{ row }">
                {{ row.time ? row.time.split(' ')[0] : '' }}
              </template>
            </el-table-column>
            <el-table-column label="工时(分钟)" min-width="70" prop="workerHouse" />
            <el-table-column label="餐补次数" min-width="60" prop="mealSupplement" />
            <template #empty>
              <el-empty class="vab-data-empty" />
            </template>
            <template #append>
              <div v-if="rightTotal <= queryRightForm.pageSize" class="data-end-tip">
                <el-divider>
                  <el-icon><check /></el-icon>
                  <span>数据已全部显示</span>
                </el-divider>
              </div>
              <div
                v-if="rightTotal > queryRightForm.pageSize && queryRightForm.pageNo < rightTotal / queryRightForm.pageSize"
                class="data-more-tip"
              >
                <el-divider>
                  <el-icon><arrow-down /></el-icon>
                  <span>还有更多数据，请翻页查看</span>
                </el-divider>
              </div>
            </template>
          </el-table>
          <vab-pagination
            class="pagination"
            :current-page="queryRightForm.pageNo"
            :page-size="queryRightForm.pageSize"
            :total="rightTotal"
            @current-change="handleRightCurrentChange"
            @size-change="handleRightSizeChange"
          />
        </div>
      </el-col>
    </el-row>
    <vab-dialog v-model="modifyVisible" title="修改" width="20%" @close="closeModify">
      <el-form ref="modifyFormRef" :model="modifyForm" style="margin-right: 20px; margin-left: 20px">
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="modifyForm.startTime"
            format="YYYY-MM-DD HH:mm"
            placeholder="选择开始时间"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="modifyForm.endTime"
            format="YYYY-MM-DD HH:mm"
            placeholder="选择结束时间"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeModify">取消</el-button>
        <el-button type="primary" @click="confirmModify">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 打包成本设定 -->
    <vab-dialog v-model="costVisible" title="打包成本设定" width="20%">
      <el-form ref="costFormRef" :model="costForm" :rules="costRules" style="margin: auto 0">
        <el-form-item label="每个工时成本" prop="cost">
          <el-input v-model="costForm.cost" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeCost">取消</el-button>
        <el-button type="primary" @click="confirmCost">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 查错 -->
    <vab-dialog v-model="errorsVisible" title="查错" width="40%">
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="errorsQueryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="errorsQueryForm.keyWord"
                clearable
                placeholder="请输入搜索关键词"
                @input="queryErrorsData"
                @keyup.enter="queryErrorsData"
              />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryErrorsData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table border :data="errorList" :header-cell-style="{ textAlign: 'center' }" stripe>
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
          :width="flexColumnWidth(errorList, '打包人姓名', 'packPersonName')"
        />
        <el-table-column
          align="center"
          label="工作时长(分钟)"
          prop="workingHours"
          :width="flexColumnWidth(errorList, '工作时长(分钟)', 'workingHours')"
        />
        <el-table-column align="center" label="PO" min-width="100" prop="po" />
        <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(errorList, 'SKU', 'sku')" />
      </el-table>
      <vab-pagination
        :current-page="errorsQueryForm.pageNo"
        :page-size="errorsQueryForm.pageSize"
        :total="errorsTotal"
        @current-change="handleErrorsCurrentChange"
        @size-change="handleErrorsSizeChange"
      />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Check, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { FormInstance } from 'element-plus'
import {
  checkingPackagingTimeError,
  getMorkPackageList,
  getPackageTimeDay,
  getPackageTimeList,
  getPackagingCost,
  updatePackageTime,
  updatePackagingCost,
} from '/@/api/devlocal/packagingShipping'
import type { ICheckingPackagingTimeError, ICheckingPackagingTimeErrorReq } from '/@/type/packagingShipping/packagingType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'PackagingTime',
})
const errorList = ref<ICheckingPackagingTimeError[]>([])
const errorsTotal = ref<number>(0)
const errorsQueryForm = reactive<ICheckingPackagingTimeErrorReq>({
  startTime: '',
  endTime: '',
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  userId: -1,
})
const errorsVisible = ref<boolean>(false)
const costVisible = ref<boolean>(false)
const costForm = reactive<any>({
  cost: '',
})
const costFormRef = ref<FormInstance>()
const costRules = reactive<any>({
  cost: [{ required: true, message: '请输入每个工时成本', trigger: 'blur' }],
})
// 日期初始化
const date = ref<string[]>(getDefaultStringTime()) // 初始化为两个空字符串
const datePickerKey = ref<number>(0) // 用于强制重新渲染日期选择器
const disabledDate = (time: Date) => {
  const date = dayjs(time)
  const now = dayjs()
  const lastMonth = now.subtract(1, 'month').startOf('month')
  // 不能选择早于上月的1号，不能选择晚于今天的日期
  return date.isBefore(lastMonth, 'day') || date.isAfter(now, 'day')
}

function getDefaultStringTime(): [string, string] {
  const now = dayjs()
  // 获取当月1号
  const monthStart = now.startOf('month').format('YYYY-MM-DD')
  // 获取今天
  const today = now.format('YYYY-MM-DD')

  return [monthStart, today]
}
// 修改可见
const modifyVisible = ref<boolean>(false)
const modifyForm = reactive<any>({
  startTime: '',
  endTime: '',
})
const modifyFormRef = ref<FormInstance>()
const copyRow = ref<any>()

const fetchErrorsData = async () => {
  errorsQueryForm.startTime = date.value[0]
  errorsQueryForm.endTime = date.value[1]
  errorsQueryForm.userId = queryRightForm.userId
  const { data } = await checkingPackagingTimeError(errorsQueryForm)
  errorsTotal.value = data.total
  errorList.value = data.list
  errorList.value.forEach((item: any) => {
    if (item.workingHours) {
      item.workingHours = item.workingHours.toFixed(2)
    }
  })
}
const queryErrorsData = () => {
  errorsQueryForm.pageNo = 1
  fetchErrorsData()
}
const handleErrorsCurrentChange = (value: number) => {
  errorsQueryForm.pageNo = value
  fetchErrorsData()
}
const handleErrorsSizeChange = (value: number) => {
  errorsQueryForm.pageNo = 1
  errorsQueryForm.pageSize = value
  fetchErrorsData()
}
const showErrors = async () => {
  errorsVisible.value = true
  // console.log(date.value);
  fetchErrorsData()
}
const confirmCost = async () => {
  costFormRef.value?.validate(async (valid: any) => {
    if (valid) {
      const { data } = await updatePackagingCost({
        cost: costForm.cost,
      })
      if (data) {
        $baseMessage('修改成功', 'success')
        closeCost()
      }
    }
  })
}
const closeCost = () => {
  costVisible.value = false
}
const showCost = async () => {
  costVisible.value = true
  const { data } = await getPackagingCost()
  costForm.cost = data
}
// 修改展示
const showModify = (row: any) => {
  modifyVisible.value = true
  copyRow.value = row
  modifyForm.startTime = row.startTime
  modifyForm.endTime = row.endTime
}
const closeModify = () => {
  modifyFormRef.value?.resetFields()
  modifyVisible.value = false
}
// const modifyRules = reactive<any>({
//   startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
//   endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
// })
const confirmModify = async () => {
  modifyFormRef.value?.validate(async (valid: any) => {
    if (valid) {
      const { data } = await updatePackageTime({
        id: copyRow.value.id,
        startTime: modifyForm.startTime,
        endTime: modifyForm.endTime,
      })
      if (data) {
        $baseMessage('修改成功', 'success')
        closeModify()
        fetchData()
      }
    }
  })
}
const queryForm = reactive<any>({
  userId: '',
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const queryRightForm = reactive<any>({
  userId: '',
  startTime: date.value[0],
  endTime: date.value[1],
  pageNo: 1,
  pageSize: 20,
})
const rightTotal = ref<number>(0)
const rightList = ref<any>([])
const leftList = ref<any>([])
const listLoading = ref<boolean>(false)

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

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getPackageTimeList(queryForm)
  leftList.value = data?.list
  total.value = data?.total!
  leftList.value.forEach((item: any) => {
    item.po = item.po.replaceAll(',', '<br>')
    item.sku = item.sku.replaceAll(',', '<br>')
    item.productName = item.productName.replaceAll(',', '<br>')
    item.packTaskId = item.packTaskId.replaceAll(',', '<br>')
    if (item.workerHouse) {
      item.workerHouse = item.workerHouse.toFixed(2)
    }
  })
  listLoading.value = false
}
const fetchRightData = async () => {
  listLoading.value = true
  const { data } = await getPackageTimeDay(queryRightForm)
  rightList.value = data?.list
  rightTotal.value = data?.total!
  rightList.value.forEach((item: any) => {
    if (item.workerHouse) {
      item.workerHouse = item.workerHouse.toFixed(2)
    }
  })
  listLoading.value = false
}
const total = ref<number>(0)
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleRightSizeChange = (value: number) => {
  queryRightForm.pageNo = 1
  queryRightForm.pageSize = value
  fetchRightData()
}
const handleRightCurrentChange = (value: number) => {
  queryRightForm.pageNo = value
  fetchRightData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const queryRightData = () => {
  queryRightForm.pageNo = 1
  queryRightForm.startTime = date.value[0]
  queryRightForm.endTime = date.value[1]
  fetchRightData()
}

// 监听日期变化，确保数据及时更新
watch(
  () => date.value,
  () => {
    queryRightData()
  },
  { deep: true }
)

  // 强制重新渲染日期选择器，解决选择后无法再次打开的问题
  nextTick(() => {
    datePickerKey.value++
  })
}
const cellStyle = () => {
  return {
    textAlign: 'center' as const,
  }
}
// 人员列表
const userList = ref<{ label: string; value: number }[]>([])
// 获取人员
const fetchUserList = async () => {
  const { data } = await getMorkPackageList()
  userList.value = data.map((item: any) => {
    return {
      label: item.userName,
      value: item.userId,
    }
  })
}
onBeforeMount(() => {
  fetchUserList()
  fetchData()
  fetchRightData()
})
</script>

<style lang="scss" scoped>
:deep(.center-table tr:last-child td),
:deep(.center-table tr:last-child th) {
  text-align: center !important;
}
.flex-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.leftTable {
  flex: 1; /* 使左表格占据剩余空间 */
}

.pagination {
  flex: none; /* 不让分页器扩展 */
}

/* 数据结束提示样式 */
.data-end-tip {
  margin: 8px 0;
}

.data-end-tip .el-divider {
  margin: 0;
}

.data-end-tip .el-icon {
  margin-right: 4px;
}

/* 还有更多数据提示样式 */
.data-more-tip {
  margin: 8px 0;
}

.data-more-tip .el-divider {
  margin: 0;
}

.data-more-tip .el-icon {
  margin-right: 4px;
  animation: bounce 2s infinite;
}

/* 箭头动画 */
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}
</style>
