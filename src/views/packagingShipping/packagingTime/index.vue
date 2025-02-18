<template>
  <div class="comprehensive-table-container auto-height-container">
    <el-row :gutter="30" style="height: calc(100% - 52px)">
      <el-col :span="17" style="height: 100%">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">请假申请</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel >
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item >
                <el-select placeholder="选择人员" style="width: 30px; margin-right: 10px;"/>
              </el-form-item>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <div class="flex-container">
          <el-table
            border :cell-style="cellStyle"
            class="leftTable"
            :data="leftList"
            :header-cell-style="{ textAlign: 'center' }"
            stripe
          >
            <el-table-column label="姓名" min-width="90" prop="name"/>
            <el-table-column label="开始时间" min-width="76" prop="startTime">
              <template #default="{ row }">
                {{ formatTime(row.startTime) }}
              </template>
            </el-table-column>
            <el-table-column label="结束时间" min-width="76" prop="endTime">
              <template #default="{ row }">
                {{ formatTime(row.endTime) }}
              </template>
            </el-table-column>
            <el-table-column label="工作时长(分钟)" min-width="70" prop="workerHouse"/>
            <el-table-column label="PO" min-width="50" prop="po">
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
            <el-table-column v-permissions="{ permission: ['system:package:time:update'] }" label="操作" width="70" >
              <template #default="{ row }">
                <span style="color: #4E88F3; cursor: pointer;" @click="showModify(row)">修改</span>
              </template>
            </el-table-column>
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
      <el-col :span="7" >
        <vab-query-form>
          <vab-query-form-left-panel :span="20" style="margin-bottom: 10px;">
            <el-date-picker
              v-model="date"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期" 
              style="width: 100px"
              type="daterange"
              unlink-panels
              value-format="YYYY-MM-DD"
              @change="queryRightData"
            />
            <el-select placeholder="选择人员" style="width: 30px; margin-left: 10px;"/>
          </vab-query-form-left-panel>
        </vab-query-form>
        <div class="flex-container">
          <el-table
            border :cell-style="cellStyle"
            class="center-table"
            :data="rightList"
            :header-cell-style="{ textAlign: 'center' }"
            show-summary
            stripe
          >
            <el-table-column label="姓名" min-width="100" prop="name"/>
            <el-table-column label="日期" min-width="80" prop="time">
              <template #default="{ row }">
                {{ row.time ? row.time.split(' ')[0] : '' }}
              </template>
            </el-table-column>
            <el-table-column label="工时(分钟)" min-width="70" prop="workerHouse"/>
            <el-table-column label="餐补次数" min-width="60" prop=""/>
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
    <vab-dialog
      v-model="modifyVisible"
      title="修改"
      width="20%"
      @close="closeModify"
    >
      <el-form  ref="modifyFormRef" :model="modifyForm" style="margin-right: 20px; margin-left: 20px;">
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
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { getPackageTimeDay, getPackageTimeList, updatePackageTime } from '/@/api/devlocal/packagingShipping'

// 日期初始化
const date = ref<string[]>(getDefaultStringTime()); // 初始化为两个空字符串
function getDefaultStringTime(): [string, string] {
  const today = new Date();
  // 上月的26日
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 27);
  // 今天的日期
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  // 格式化为字符串形式
  const formattedLastMonthDate = lastMonthDate.toISOString().split('T')[0];
  const formattedTodayDate = todayDate.toISOString().split('T')[0];
  return [formattedLastMonthDate, formattedTodayDate];
}
// 修改可见
const modifyVisible = ref<boolean>(false)
const modifyForm = reactive<any>({
  startTime: '',
  endTime: ''
})
const modifyFormRef = ref<FormInstance>()
const copyRow = ref<any>()
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
        endTime: modifyForm.endTime
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
  pageSize: 20
})
const queryRightForm = reactive<any>({
  userId: '',
  startTime: date.value[0],
  endTime: date.value[1],
  pageNo: 1,
  pageSize: 20
})
const rightTotal = ref<number>(0)
const rightList = ref<any>([])
const leftList = ref<any>([])
const listLoading = ref<boolean>(false)

const formatTime = (time: string) => {
  if (!time) return '';
  
  // 将字符串转换为日期对象
  const date = new Date(time.replace(' ', 'T')); // 替换空格为T以符合ISO 8601格式
  
  // 格式化日期为 YYYY-MM-DD HH:mm
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getPackageTimeList(queryForm)
  leftList.value = data?.list
  total.value = data?.total!
  leftList.value.forEach((item: any) => {
    item.po = item.po.replaceAll(',', '<br>');
    item.sku = item.sku.replaceAll(',', '<br>');
    item.productName = item.productName.replaceAll(',', '<br>');
  })
  listLoading.value = false
}
const fetchRightData = async () => {
  listLoading.value = true
  const { data } = await getPackageTimeDay(queryRightForm)
  rightList.value = data?.list
  rightTotal.value = data?.total!
  // leftList.value.forEach((item: any) => {
  //   item.po = item.po.replace(/,/g, '<br>');
  //   item.sku = item.sku.replace(/,/g, '<br>');
  //   item.productName = item.productName.replace(/,/g, '<br>');
  // })
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
const cellStyle = () => {
  return {
    textAlign: 'center' as const
  }
}
onBeforeMount(() => {
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
</style>
