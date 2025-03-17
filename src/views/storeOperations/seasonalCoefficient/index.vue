<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline>
          <el-form-item label="站点">
            <el-select v-model="queryForm.siteId" placeholder="请选择站点" @change="handleChangeSite">
              <el-option 
                v-for="item in siteList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
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
    </vab-query-form>
    <el-table 
      border  
      :cell-style="cellStyle" 
      class="noneHoverTable" :data="list" :header-cell-style="{ textAlign: 'center' }" stripe 
      @cell-click="changeInput"
    >
      <el-table-column label="品名" >
        <el-table-column label="品名" prop="kindName" :width="flexColumnWidth(list, '品名', 'kindName')"/>
      </el-table-column>
      <el-table-column label="1月">
        <el-table-column label="实际值" prop="janActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.janActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.janActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="janReference"/>
      </el-table-column>
      <el-table-column label="2月">
        <el-table-column label="实际值" prop="febActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.febActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.febActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="febReference"/>
      </el-table-column>
      <el-table-column label="3月">
        <el-table-column label="实际值" prop="marActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.marActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.marActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="marReference"/>
      </el-table-column>
      <el-table-column label="4月">
        <el-table-column label="实际值" prop="aprActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.aprActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.aprActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="aprReference"/>
      </el-table-column>
      <el-table-column label="5月">
        <el-table-column label="实际值" prop="mayActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.mayActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.mayActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="mayReference"/>
      </el-table-column>
      <el-table-column label="6月">
        <el-table-column label="实际值" prop="junActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.junActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.junActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="junReference"/>
      </el-table-column>
      <el-table-column label="7月">
        <el-table-column label="实际值" prop="julActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.julActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.julActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="julReference"/>
      </el-table-column>
      <el-table-column label="8月">
        <el-table-column label="实际值" prop="augActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.augActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.augActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="augReference"/>
      </el-table-column>
      <el-table-column label="9月">
        <el-table-column label="实际值" prop="sepActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.sepActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.sepActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="sepReference"/>
      </el-table-column>
      <el-table-column label="10月">
        <el-table-column label="实际值" prop="octActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.octActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.octActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="octReference"/>
      </el-table-column>
      <el-table-column label="11月">
        <el-table-column label="实际值" prop="novActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.novActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.novActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="novReference"/>
      </el-table-column>
      <el-table-column label="12月">
        <el-table-column label="实际值" prop="decActual">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.decActual" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.decActual }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考值" prop="decReference"/>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="viewChart(row)">查看</el-link>
          <el-link type="danger" :underline="false" @click="handleDel(row)">删除</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty"/>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <vab-dialog
      v-model="viewVisible"
      title="查看"
      width="40%"
      @open="handleDialogOpened"
    >
      <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 添加季节系数 -->
    <vab-dialog
      v-model="addVisible"
      title="新增季节系数"
      width="20%"
      @close="handleCloseAdd"
    >
      <el-form ref="formRef" label-position="right" label-width="auto" :model="form" :rules="formRules" style="margin: 0 10px">
        <el-form-item label="品名" prop="kindName" >
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
import * as echarts from 'echarts'
import { isEqual } from 'lodash'
import type { CSSProperties } from 'vue'
import { months } from '../constantOption'
import { addSeasonalCoefficient, delSeasonalCoefficient, getSeasonalCoefficientList, getSeasonalCoefficientSiteList, updateSeasonalCoefficient } from '/@/api/devlocal/seasonalCoefficient'
import type { IGetSeasonalCoefficientList, IGetSeasonalCoefficientListReq, ISiteList } from '/@/type/storeOperation/seasonalCoefficientType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import type { FormInstance, FormRules } from 'element-plus'
import { flexColumnWidth } from '/@/utils/tableColum'
defineOptions({
  name: 'SeasonalCoefficient'
})

const total = ref<number>(0)
const queryForm = reactive<IGetSeasonalCoefficientListReq>({
  siteId: 0,
  pageNo: 1,
  pageSize: 20
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
const addVisible = ref<boolean>(false)
const form = reactive<any>({})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules>({
  kindName: [{ required: true, message: '请输入品类名称', trigger: 'blur' }],
  janActual: [{ required: true, message: '请输入1月实际系数', trigger: 'blur' }],
  febActual: [{ required: true, message: '请输入2月实际系数', trigger: 'blur' }],
  marActual: [{ required: true, message: '请输入3月实际系数', trigger: 'blur' }],
  aprActual: [{ required: true, message: '请输入4月实际系数', trigger: 'blur' }],
  mayActual: [{ required: true, message: '请输入5月实际系数', trigger: 'blur' }],
  junActual: [{ required: true, message: '请输入6月实际系数', trigger: 'blur' }],
  julActual: [{ required: true, message: '请输入7月实际系数', trigger: 'blur' }],
  augActual: [{ required: true, message: '请输入8月实际系数', trigger: 'blur' }],
  sepActual: [{ required: true, message: '请输入9月实际系数', trigger: 'blur' }],
  octActual: [{ required: true, message: '请输入10月实际系数', trigger: 'blur' }],
  novActual: [{ required: true, message: '请输入11月实际系数', trigger: 'blur' }],
  decActual: [{ required: true, message: '请输入12月实际系数', trigger: 'blur' }],
})
const handleConfirmAdd = async () => {
  formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addSeasonalCoefficient({
        site: queryForm.siteId,
        ...form
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
      initChart()
      // option.value.series[0].data = actualData
      // option.value.series[1].data = referenceData
      // updateChart()
    }
  })
}
const viewChart = (row: IGetSeasonalCoefficientList) => {
  viewVisible.value = true
  actualData = [row.janActual, row.febActual, row.marActual, row.aprActual, row.mayActual, row.junActual, row.julActual, row.augActual, row.sepActual, row.octActual, row.novActual, row.decActual]
  referenceData = [row.janReference, row.febReference, row.marReference, row.aprReference, row.mayReference, row.junReference, row.julReference, row.augReference, row.sepReference, row.octReference, row.novReference, row.decReference]
  
}
// const updateChart = () => {
//   chartInstance?.setOption(option.value, true)
// }
const initChart = () => {
  option.value = {
    legend: {
      left: '40%',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    grid: {
      top: 50,
      bottom: 30,
      left: 50,
      right: 50,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months.map((item) => item.label),
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
    },
    yAxis: {
      name: '系数',
      type: 'value',
      // min: 'dataMin', // 自动以数据中的最小值为起点
      boundaryGap: [0, 0.1],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      }
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: actualData,
        itemStyle: {
          color: '#52bfff'
        },
        smooth: true,
      },
      {
        name: '参考值',
        type: 'line',
        data: referenceData,
        itemStyle: {
          color: '#ff8fa5'
        },
        smooth: true,
      },
    ]
  }
  
  chartInstance?.setOption(option.value)
}
const handleDel = async (row: IGetSeasonalCoefficientList) => {
  $baseConfirm('确定要删除季节系数吗？', null, async () => {
    const { data } = await delSeasonalCoefficient({
      id: row.id
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
const clickCancel = async (event:any, value:any) => {
  const rootElement = getRootElement(event.srcElement, ".cell")

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add("none")
    if (t2) t2.classList.remove("none")
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    await updateSeasonalCoefficient(value)
  }
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 0) {
    return {
      textAlign: 'left'
    }
  } else if (index % 2 === 0) {
    return {
      textAlign: 'center',
      color: '#999'
    }
  } return {
    textAlign: 'center'
  }
}
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
}
const fetchData = async () => {
  const { data } = await getSeasonalCoefficientList(queryForm)
  list.value = data.list
  total.value = data.total
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
    /* 隐藏第二行表头 */
    .el-table__header-wrapper .el-table__header tr:nth-child(2) {
      display: none;
    }
  }
}
.none {
  display: none;
}
</style>