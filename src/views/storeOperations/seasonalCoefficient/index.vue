<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="站点">
            <el-select v-model="queryForm.siteId" placeholder="请选择站点" @change="handleChangeSite">
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">参考值计算</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="请输入搜索关键词"
              @input="queryData"
              @keydown.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      border
      :cell-style="cellStyle"
      class="noneHoverTable custom-table-hover"
      :data="list"
      :header-cell-style="headerCellStyle"
      :row-class-name="tableRowClassName"
      stripe
      @cell-click="changeInput"
      @row-click="handleRowClick"
    >
      <el-table-column fixed="left" label="品名" prop="kindName" :width="flexColumnWidth(list, '品名', 'kindName')" />
      <el-table-column label="1月">
        <el-table-column label="实际值" prop="janActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.janActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.janActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="janReference" />
        <el-table-column label="最值日" prop="janPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.janPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.janPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="2月">
        <el-table-column label="实际值" prop="febActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.febActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.febActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="febReference" />
        <el-table-column label="最值日" prop="febPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.febPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.febPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="3月">
        <el-table-column label="实际值" prop="marActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.marActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.marActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="marReference" />
        <el-table-column label="最值日" prop="marPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.marPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.marPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="4月">
        <el-table-column label="实际值" prop="aprActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.aprActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.aprActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="aprReference" />
        <el-table-column label="最值日" prop="aprPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.aprPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.aprPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="5月">
        <el-table-column label="实际值" prop="mayActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.mayActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.mayActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="mayReference" />
        <el-table-column label="最值日" prop="mayPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.mayPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.mayPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="6月">
        <el-table-column label="实际值" prop="junActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.junActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.junActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="junReference" />
        <el-table-column label="最值日" prop="junPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.junPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.junPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="7月">
        <el-table-column label="实际值" prop="julActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.julActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.julActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="julReference" />
        <el-table-column label="最值日" prop="julPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.julPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.julPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="8月">
        <el-table-column label="实际值" prop="augActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.augActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.augActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="augReference" />
        <el-table-column label="最值日" prop="augPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.augPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.augPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="9月">
        <el-table-column label="实际值" prop="sepActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.sepActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.sepActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="sepReference" />
        <el-table-column label="最值日" prop="sepPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.sepPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.sepPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="10月">
        <el-table-column label="实际值" prop="octActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.octActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.octActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="octReference" />
        <el-table-column label="最值日" prop="octPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.octPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.octPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="11月">
        <el-table-column label="实际值" prop="novActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.novActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.novActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="novReference" />
        <el-table-column label="最值日" prop="novPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.novPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.novPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="12月">
        <el-table-column label="实际值" prop="decActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.decActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.decActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="decReference" />
        <el-table-column label="最值日" prop="decPeakDay">
          <template #header>
            <el-popover>
              <template #reference>最值日</template>
              设定当月销量的最大值或者最小值在哪一天
            </el-popover>
          </template>
          <template #default="{ row }">
            <div class="none">
              <el-input v-model.trim="row.decPeakDay" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.decPeakDay }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="备注" min-width="200" prop="remark" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-link type="primary" underline="never" @click="viewChart(row)">查看</el-link>
          <span style="margin: 0 5px"></span>
          <el-link type="danger" underline="never" @click="handleDel(row)">删除</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <vab-dialog v-model="viewVisible" title="查看" width="95%" @open="handleDialogOpened">
      <div ref="chartContainer" style="width: 100%; height: 600px"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 添加季节系数 -->
    <vab-dialog v-model="addVisible" title="新增季节系数" width="20%" @close="handleCloseAdd">
      <el-form ref="formRef" label-position="right" label-width="auto" :model="form" :rules="formRules" style="margin: 0 10px">
        <el-form-item label="品名" prop="kindName">
          <el-input v-model="form.kindName" clearable />
        </el-form-item>
        <el-form-item label="1月实际系数" prop="janActual">
          <el-input v-model="form.janActual" type="number" />
        </el-form-item>
        <el-form-item label="2月实际系数" prop="febActual">
          <el-input v-model="form.febActual" type="number" />
        </el-form-item>
        <el-form-item label="3月实际系数" prop="marActual">
          <el-input v-model="form.marActual" type="number" />
        </el-form-item>
        <el-form-item label="4月实际系数" prop="aprActual">
          <el-input v-model="form.aprActual" type="number" />
        </el-form-item>
        <el-form-item label="5月实际系数" prop="mayActual">
          <el-input v-model="form.mayActual" type="number" />
        </el-form-item>
        <el-form-item label="6月实际系数" prop="junActual">
          <el-input v-model="form.junActual" type="number" />
        </el-form-item>
        <el-form-item label="7月实际系数" prop="julActual">
          <el-input v-model="form.julActual" type="number" />
        </el-form-item>
        <el-form-item label="8月实际系数" prop="augActual">
          <el-input v-model="form.augActual" type="number" />
        </el-form-item>
        <el-form-item label="9月实际系数" prop="sepActual">
          <el-input v-model="form.sepActual" type="number" />
        </el-form-item>
        <el-form-item label="10月实际系数" prop="octActual">
          <el-input v-model="form.octActual" type="number" />
        </el-form-item>
        <el-form-item label="11月实际系数" prop="novActual">
          <el-input v-model="form.novActual" type="number" />
        </el-form-item>
        <el-form-item label="12月实际系数" prop="decActual">
          <el-input v-model="form.decActual" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseAdd">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { FormInstance, FormRules } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import {
  addSeasonalCoefficient,
  delSeasonalCoefficient,
  getSeasonalCoefficientDailyList,
  getSeasonalCoefficientList,
  getSeasonalCoefficientSiteList,
  updateSeasonalCoefficient,
} from '/@/api/devlocal/seasonalCoefficient'
import type {
  IDailySeasonalCoefficient,
  IGetSeasonalCoefficientList,
  IGetSeasonalCoefficientListReq,
  ISiteList,
  IUpdateSeasonalCoefficientReq,
} from '/@/type/storeOperation/seasonalCoefficientType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'SeasonalCoefficient',
})

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<IGetSeasonalCoefficientListReq>({
  siteId: 0,
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})
const viewVisible = ref<boolean>(false)
const chartContainer = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let chartObserver: ResizeObserver
const option = ref<any>({})
const siteList = ref<ISiteList[]>([])
const list = ref<IGetSeasonalCoefficientList[]>([])
let copyRow: any
let actualData: (number | undefined)[] = []
let referenceData: (number | undefined)[] = []
let dailyCoefficientData: (number | undefined)[] = []
const allDailyData = ref<IDailySeasonalCoefficient[]>([])
const addVisible = ref<boolean>(false)
const selectedRowIndex = ref<number>(-1)
// 行点击处理函数
const handleRowClick = (row: any, column: any, event: Event) => {
  selectedRowIndex.value = row.id
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.id === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}
const form = reactive<any>({})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules>({
  kindName: [{ required: true, message: '请输入品类名称', trigger: 'blur' }],
  janActual: [
    { required: true, message: '请输入1月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  febActual: [
    { required: true, message: '请输入2月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  marActual: [
    { required: true, message: '请输入3月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  aprActual: [
    { required: true, message: '请输入4月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  mayActual: [
    { required: true, message: '请输入5月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  junActual: [
    { required: true, message: '请输入6月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  julActual: [
    { required: true, message: '请输入7月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  augActual: [
    { required: true, message: '请输入8月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  sepActual: [
    { required: true, message: '请输入9月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  octActual: [
    { required: true, message: '请输入10月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  novActual: [
    { required: true, message: '请输入11月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  decActual: [
    { required: true, message: '请输入12月实际系数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('季节系数必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
const handleConfirmAdd = async () => {
  formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addSeasonalCoefficient({
        site: queryForm.siteId,
        ...form,
      })
      if (data) {
        $baseMessage('新增季节系数成功！', 'success')
        handleCloseAdd()
        fetchData()
      }
    }
  })
}
const handleCloseAdd = () => {
  formRef.value?.resetFields()
  addVisible.value = false
}
const handleAdd = () => {
  addVisible.value = true
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const handleChangeSite = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleDialogOpened = () => {
  nextTick(() => {
    if (chartContainer.value) {
      chartInstance = echarts.init(chartContainer.value)
      chartObserver = new ResizeObserver(() => {
        if (chartInstance) {
          chartInstance.resize()
        }
      })
      chartObserver.observe(chartContainer.value)
      // option.value.series[0].data = actualData
      // option.value.series[1].data = referenceData
      // updateChart()
    }
  })
}
const viewChart = async (row: IGetSeasonalCoefficientList) => {
  selectedRowIndex.value = row.id
  viewVisible.value = true

  try {
    // 获取每天的季节系数数据
    const { data } = await getSeasonalCoefficientDailyList({ id: row.id, siteId: queryForm.siteId })

    // 按天排序并生成图表数据
    const sortedData = data.sort((a: any, b: any) => {
      if (a.month !== b.month) return a.month - b.month
      return a.day - b.day
    })

    // 保存所有数据
    allDailyData.value = sortedData

    // 保存原始行数据用于获取参考值
    copyRow = row

    // 直接显示全年数据
    updateChartForAllData()
  } catch (error) {
    console.error('获取每日季节系数数据失败:', error)
    $baseMessage('获取数据失败', 'error')
  }
}

// 更新图表配置为每日数据展示
const updateChartForDailyData = (dayLabels: string[], title: string = '季节系数') => {
  // 生成日期数据
  const dateData: [number, number][] = []
  const referenceDateData: [number, number][] = []
  const dailyDateData: [number, number][] = []
  const dailyReferenceDateData: [number, number][] = []

  // 如果有每日数据，使用每日数据
  if (allDailyData.value.length > 0) {
    allDailyData.value.forEach((item: IDailySeasonalCoefficient, index: number) => {
      // 根据API返回的month和day生成正确的日期，添加小时避免重叠
      const currentDate = new Date(2025, item.month - 1, item.day, 12, 0, 0)
      const timestamp = currentDate.getTime()

      dateData.push([timestamp, getMonthlyActual(item.month)])
      referenceDateData.push([timestamp, getMonthlyReference(item.month)])
      dailyDateData.push([timestamp, item.actual])
      // 添加每日系数-参考值
      dailyReferenceDateData.push([timestamp, item.reference || 0])
    })
  } else {
    // 如果没有每日数据，生成12个月的数据点（每月1号）
    for (let month = 1; month <= 12; month++) {
      const currentDate = new Date(2025, month - 1, 1, 12, 0, 0)
      const timestamp = currentDate.getTime()

      dateData.push([timestamp, getMonthlyActual(month)])
      referenceDateData.push([timestamp, getMonthlyReference(month)])
      dailyDateData.push([timestamp, 0]) // 每日系数没有值时用0
      dailyReferenceDateData.push([timestamp, 0]) // 每日系数-参考值没有值时用0
    }
  }

  option.value = {
    legend: {
      top: 40,
    },
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '10%']
      },
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
        label: {
          formatter: function (params: any) {
            // 仅在横轴显示“几月几日”，纵轴保留数值
            if (params && params.axisDimension === 'x') {
              const date = new Date(params.value)
              const month = date.getMonth() + 1
              const day = date.getDate()
              return `${month}月${day}日`
            }
            const v = Number(params?.value)
            return isNaN(v) ? `${params?.value ?? ''}` : v.toFixed(2)
          },
        },
      },
      formatter: (params: any) => {
        if (params && params.length > 0) {
          const date = new Date(params[0].data[0])
          const month = date.getMonth() + 1
          const day = date.getDate()

          let result = `${month}月${day}日<br/>`

          // 只显示可见的数据系列
          params.forEach((param: any) => {
            if (param.visible !== false) {
              result += `${param.seriesName}: ${param.data[1]}<br/>`
            }
          })

          return result
        }
        return ''
      },
    },

    grid: {
      top: 90,
      bottom: 80,
      left: 60,
      right: 60,
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#999',
        },
      },
      axisLabel: {
        formatter: function (value: any) {
          const date = new Date(value)
          const month = date.getMonth() + 1
          const day = date.getDate()
          if (day === 1) {
            return `${month}月${day}日`
          }
          return ''
        },
        interval: 0, // 强制显示所有标签
        showMaxLabel: true, // 显示最大值标签
        showMinLabel: true, // 显示最小值标签
      },
    },
    yAxis: {
      name: '系数',
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999',
        },
      },
    },
    // 数据缩放配置
    dataZoom: [
      // 内部缩放：鼠标滚轮缩放，拖拽平移
      {
        type: 'inside', // 内部缩放类型
        start: 0, // 初始显示范围开始位置（0%）
        end: 100, // 初始显示范围结束位置（100%）
      },
      // 滑块缩放：底部滑块控制显示范围
      {
        type: 'slider', // 滑块类型
        start: 0, // 滑块开始位置（0%）
        end: 100, // 滑块结束位置（100%）
        height: 40, // 滑块高度
        bottom: 10, // 距离底部距离
        // 滑块标签格式化：显示为"几月几日"
        labelFormatter: function (value: any) {
          const date = new Date(value)
          const month = date.getMonth() + 1
          const day = date.getDate()
          return `${month}月${day}日`
        },
      },
    ],
    series: [
      {
        name: '实际值',
        type: 'line',
        data: dateData,
        itemStyle: {
          color: '#1890ff',
        },
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
        },
      },
      {
        name: '参考值',
        type: 'line',
        data: referenceDateData,
        itemStyle: {
          color: '#f5222d',
        },
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
        },
      },
      {
        name: '每日系数-实际',
        type: 'line',
        data: dailyDateData,
        itemStyle: {
          color: '#52c41a',
        },
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
        },
      },
      {
        name: '每日系数-参考值',
        type: 'line',
        data: dailyReferenceDateData,
        itemStyle: {
          color: '#faad14',
        },
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          type: 'dashed',
        },
      },
    ],
  }

  chartInstance?.setOption(option.value, true)
}

// 更新图表显示全年数据
const updateChartForAllData = () => {
  const dayLabels: string[] = []
  actualData = []
  referenceData = []
  dailyCoefficientData = []

  // 如果没有每日数据，生成12个月的数据点（每月1号）
  if (allDailyData.value.length === 0) {
    for (let month = 1; month <= 12; month++) {
      dayLabels.push(`${month}月1日`)
      actualData.push(getMonthlyActual(month))
      referenceData.push(getMonthlyReference(month))
      dailyCoefficientData.push(0) // 每日系数没有值时用0
    }
  } else {
    // 有每日数据时，正常处理
    allDailyData.value.forEach((item: IDailySeasonalCoefficient, index: number) => {
      dayLabels.push((index + 1).toString())
      // 获取该月对应的实际值
      actualData.push(getMonthlyActual(item.month))
      // 获取该月对应的参考值
      referenceData.push(getMonthlyReference(item.month))
      // 添加每天的季节系数
      dailyCoefficientData.push(item.actual)
    })
  }

  updateChartForDailyData(dayLabels, '全年数据')
}

// 获取指定月份的参考值
const getMonthlyReference = (month: number): number => {
  if (!copyRow) return 0

  const referenceMap: Record<number, number> = {
    1: copyRow.janReference || 0,
    2: copyRow.febReference || 0,
    3: copyRow.marReference || 0,
    4: copyRow.aprReference || 0,
    5: copyRow.mayReference || 0,
    6: copyRow.junReference || 0,
    7: copyRow.julReference || 0,
    8: copyRow.augReference || 0,
    9: copyRow.sepReference || 0,
    10: copyRow.octReference || 0,
    11: copyRow.novReference || 0,
    12: copyRow.decReference || 0,
  }

  return referenceMap[month] || 0
}
const getMonthlyActual = (month: number): number => {
  if (!copyRow) return 0

  const actualMap: Record<number, number> = {
    1: copyRow.janActual || 0,
    2: copyRow.febActual || 0,
    3: copyRow.marActual || 0,
    4: copyRow.aprActual || 0,
    5: copyRow.mayActual || 0,
    6: copyRow.junActual || 0,
    7: copyRow.julActual || 0,
    8: copyRow.augActual || 0,
    9: copyRow.sepActual || 0,
    10: copyRow.octActual || 0,
    11: copyRow.novActual || 0,
    12: copyRow.decActual || 0,
  }

  return actualMap[month] || 0
}
// const updateChart = () => {
//   chartInstance?.setOption(option.value, true)
// }
const handleDel = async (row: IGetSeasonalCoefficientList) => {
  selectedRowIndex.value = row.id
  $baseConfirm('确定要删除季节系数吗？', null, async () => {
    const { data } = await delSeasonalCoefficient({
      id: row.id,
    })
    if (data) {
      $baseMessage('删除季节系数成功！', 'success')
      fetchData()
    }
  })
}
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
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

// table blur事件
const clickCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }

  // 只检查当前编辑的字段（通过比较找出变化的字段）
  const monthlyFields = [
    'janActual',
    'febActual',
    'marActual',
    'aprActual',
    'mayActual',
    'junActual',
    'julActual',
    'augActual',
    'sepActual',
    'octActual',
    'novActual',
    'decActual',
  ]

  // 找出当前被修改的字段（只检查实际值字段）
  let currentField: string | null = null
  for (const field of monthlyFields) {
    // 比较当前值和原始值，找出变化的字段
    const currentValue = value[field]
    const originalValue = copyRow[field]

    // 如果值发生了变化，说明这是当前编辑的字段
    if (currentValue !== originalValue) {
      currentField = field
      break
    }
  }

  // 如果找到了当前编辑的字段，检查它是否为空或0
  if (currentField) {
    const currentValue = value[currentField]

    // 如果当前值为空、null、undefined或0，则恢复原值并提示
    if (currentValue === '' || currentValue === null || currentValue === undefined || currentValue === 0 || currentValue === '0') {
      value[currentField] = copyRow[currentField]
      $baseMessage('季节系数不能为空或0，请重新输入！', 'warning')
      return
    }
  }

  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      // 确保传递完整的更新数据，包括所有实际值和最值日字段
      const updateData: IUpdateSeasonalCoefficientReq = {
        id: value.id,
        janActual: value.janActual,
        febActual: value.febActual,
        marActual: value.marActual,
        aprActual: value.aprActual,
        mayActual: value.mayActual,
        junActual: value.junActual,
        julActual: value.julActual,
        augActual: value.augActual,
        sepActual: value.sepActual,
        octActual: value.octActual,
        novActual: value.novActual,
        decActual: value.decActual,
        janPeakDay: value.janPeakDay,
        febPeakDay: value.febPeakDay,
        marPeakDay: value.marPeakDay,
        aprPeakDay: value.aprPeakDay,
        mayPeakDay: value.mayPeakDay,
        junPeakDay: value.junPeakDay,
        julPeakDay: value.julPeakDay,
        augPeakDay: value.augPeakDay,
        sepPeakDay: value.sepPeakDay,
        octPeakDay: value.octPeakDay,
        novPeakDay: value.novPeakDay,
        decPeakDay: value.decPeakDay,
      }
      const { data } = await updateSeasonalCoefficient(updateData)
      if (data) {
        $baseMessage('更新成功！', 'success')
      } else {
        $baseMessage('更新失败！', 'error')
      }
    } catch {
      Object.assign(value, copyRow)
    }
  }
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  const prop = data.column.property

  // 最值日列添加右边框作为月份分组分隔
  const peakDayProps = [
    'janPeakDay',
    'febPeakDay',
    'marPeakDay',
    'aprPeakDay',
    'mayPeakDay',
    'junPeakDay',
    'julPeakDay',
    'augPeakDay',
    'sepPeakDay',
    'octPeakDay',
    'novPeakDay',
    'decPeakDay',
  ]

  if (label === '品名') {
    return {
      textAlign: 'left',
    }
  }
  if (label === '参考值') {
    return {
      textAlign: 'center',
      color: '#999',
      cursor: 'not-allowed',
    }
  }

  // 最值日列添加右边框
  if (peakDayProps.includes(prop)) {
    return {
      textAlign: 'center',
      cursor: 'pointer',
      borderRight: '2px solid #cbd5e1',
    }
  }

  return {
    textAlign: 'center',
    cursor: 'pointer',
  }
}

// 表头样式 - 区分月份分组
const headerCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  // 月份分组表头 - 使用不同的背景色区分
  if (monthLabels.includes(label)) {
    const monthIndex = monthLabels.indexOf(label)
    // 奇数月份（1,3,5,7,9,11月）- 蓝色系
    if (monthIndex % 2 === 0) {
      return {
        textAlign: 'center',
        background: 'var(--el-color-primary-light-9)',
        // borderLeft: '3px solid var(--el-color-primary-light-9)',
        fontWeight: '600',
        // borderRight: '2px solid var(--el-color-primary-light-9)',
      }
    } else {
      // 偶数月份（2,4,6,8,10,12月）- 粉色系
      return {
        textAlign: 'center',
        background: 'var(--el-color-success-light-9)',
        // borderLeft: '3px solid var(--el-color-success-light-9)',
        fontWeight: '600',
        // borderRight: '2px solid var(--el-color-success-light-9)',
      }
    }
  }

  // 其他列（实际值、参考值、最值日）
  return {
    textAlign: 'center',
  }
}
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getSeasonalCoefficientList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
onBeforeMount(() => {
  fetchSiteList()
  fetchData()
})
</script>

<style lang="scss" scoped>
.cell-with-line {
  display: flex;
  align-items: center;
  justify-content: center;

  .value {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%; /* 每个值占一半的空间 */
  }
  .value2 {
    color: #999;
  }
  .separator {
    width: 1px;
    height: 40px;
    background-color: #dcdfe6;
  }
}

.noneHoverTable {
  :deep() {
    .el-table__body .cell {
      min-height: 32px;
      line-height: 32px;
    }

    // // 月份分组分隔线 - 每个月结束的列添加右边框
    // .el-table__header th[colspan='3'] {
    //   // 月份分组结束列添加右边框作为分隔
    //   border-right: 2px solid #cbd5e1 !important;
    // }

    // // 月份分组内的列（实际值、参考值、最值日）样式
    // .el-table__header th.el-table__cell {
    //   font-weight: 500;
    // }
  }
}
.none {
  display: none;
}
</style>
