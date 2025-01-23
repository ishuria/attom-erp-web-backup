<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="明细" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-date-picker v-model="queryForm.date" style="max-width: 300px;" type="monthrange" />
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table border :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }" stripe>
          <el-table-column label="基本信息">
            <el-table-column label="月份" min-width="100" prop=""/>
            <el-table-column label="姓名" min-width="100" prop=""/>
            <el-table-column label="角色" min-width="100" prop=""/>
          </el-table-column>
          <el-table-column label="加班和请假">
            <el-table-column min-width="100" prop="">
              <template #header>打包时长<br>(小时)</template>
            </el-table-column>
            <el-table-column min-width="100" prop="">
              <template #header>加班时长<br>(小时)</template>
            </el-table-column>
            <el-table-column min-width="90" prop="">
              <template #header>事假<br>(天)</template>
            </el-table-column>
            <el-table-column min-width="90" prop="">
              <template #header>年假<br>(天)</template>
            </el-table-column>
            <el-table-column min-width="90" prop="">
              <template #header>病假<br>(小时)</template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="考勤异常">
            <el-table-column min-width="100" prop="">
              <template #header>上班缺卡<br>(次)</template>
            </el-table-column>
            <el-table-column min-width="100" prop="">
              <template #header>下班缺卡<br>(次)</template>
            </el-table-column>
            <el-table-column min-width="90" prop="">
              <template #header>旷工<br>(天)</template>
            </el-table-column>
            <el-table-column min-width="100" prop="">
              <template #header>缺勤时长<br>(小时)</template>
            </el-table-column>
            <el-table-column min-width="90" prop="">
              <template #header>早退<br>(次)</template>
            </el-table-column>
            <el-table-column min-width="100" prop="">
              <template #header>早退时长<br>(小时)</template>
            </el-table-column>
            <el-table-column min-width="90" prop="">
              <template #header>迟到<br>(次数)</template>
            </el-table-column>
            <el-table-column min-width="100" prop="">
              <template #header>严重迟到<br>(次数)</template>
            </el-table-column>
            <el-table-column min-width="100" prop="">
              <template #header>迟到时长<br>(小时)</template>
            </el-table-column>
            <el-table-column min-width="130" prop="">
              <template #header>严重迟到时长<br>(小时)</template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="奖金">
            <el-table-column label="采购奖金" min-width="100" prop=""/>
            <el-table-column label="采购降本" min-width="100" prop=""/>
            <el-table-column label="美工图片" min-width="100" prop=""/>
            <el-table-column label="美工长期" min-width="100" prop=""/>
            <el-table-column label="产品开发设计" min-width="130" prop=""/>
            <el-table-column label="总奖金" min-width="90" prop=""/>
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
      </el-tab-pane>
      <el-tab-pane label="概览" :name="1"/>
      <el-tab-pane label="产品经理" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-date-picker v-model="queryForm.date" style="max-width: 300px;" type="monthrange" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="showSetting">考核数设定</el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table v-loading="listLoading" border :header-cell-style="{ textAlign: 'center' }" stripe>
          <el-table-column label="月份" min-width="100" prop="" />
          <el-table-column label="姓名" min-width="100" prop="" />
          <el-table-column label="角色" min-width="100" prop="" />
          <el-table-column label="职级" min-width="100" prop="" />
          <el-table-column label="总考核完成数" min-width="110" prop="" />
          <el-table-column label="OEM完成数" min-width="110" prop="" />
          <el-table-column label="新款采购额" min-width="110" prop="" />
          <el-table-column label="新款评估跑分次数" min-width="135" prop="" />
          <el-table-column label="新品进度记录数" min-width="120" prop="" />
          <el-table-column label="拿样次数" min-width="100" prop="" />
          <el-table-column label="侵权产品数" min-width="110" prop="" />
          <el-table-column label="下架产品数" min-width="110" prop="" />
          <el-table-column label="销毁货值" min-width="100" prop="" />
          <el-table-column label="当月产品提成" min-width="120" prop="" />
          <el-table-column min-width="120" prop="" >
            <template #header>过去6个月<br />月均产品提成</template>
          </el-table-column>
          <el-table-column min-width="145" prop="">
            <template #header>过去6个月月均<br />上线1年内新品提成</template>
          </el-table-column>
          <el-table-column label="总开发数" min-width="100" prop="" />
          <el-table-column label="总停产数" min-width="100" prop="" />
          <el-table-column label="停产%" min-width="90" prop="" />
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
      </el-tab-pane>
    </el-tabs>
    <!-- 考核数设定 -->
    <vab-dialog
      v-model="settingVisible"
      title="产品经理考核设定和追踪"
    >
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="settingQueryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="settingQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="querySettingData" @keyup.enter="querySettingData" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="settingListLoading" type="primary" @click="querySettingData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table 
        border 
        :cell-style="cellStyle" 
        class="noneHoverTable" 
        :data="fakeData" 
        :header-cell-style="{ textAlign: 'center' }" 
        stripe 
        @cell-click="changeInput"
      >
        <el-table-column label="姓名" min-width="100" prop="name"/>
        <el-table-column label="月份" min-width="100" prop="month"/>
        <el-table-column label="总考核完成数" min-width="120" prop=""/>
        <el-table-column label="总考核数" min-width="100" prop="">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.number1" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.number1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="OEM完成数" min-width="110" prop=""/>
        <el-table-column label="OEM考核数" min-width="110">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.number2" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.number2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="考核未达标" min-width="110" prop="">
          <el-checkbox :false-value="0" :true-value="1" />
        </el-table-column>
      </el-table>
      <vab-pagination
        :current-page="settingQueryForm.pageNo"
        :page-size="settingQueryForm.pageSize"
        :total="settingTotal"
        @current-change="handleSettingCurrentChange"
        @size-change="handleSettingSizeChange"
      />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { isEqual } from 'lodash'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'PerformanceStatistics'
})

const fakeData = [
  { month: '2025-12', number1: 33, number2: 66 }
]
const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const settingVisible = ref<boolean>(false)
const settingQueryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const settingTotal = ref<number>(0)
const settingListLoading = ref<boolean>(false)
let copyRow: any
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
  
  }
}
const fetchSettingData = () => {}
const querySettingData = () => {
  settingQueryForm.pageNo = 1
  fetchSettingData()
}
const showSetting = () => {
  // fetchSettingData()
  settingVisible.value = true
}
const handleSettingCurrentChange = (value: number) => {
  settingQueryForm.pageNo = value
  fetchSettingData()
}
const handleSettingSizeChange = (value: number) => {
  settingQueryForm.pageNo = 1
  settingQueryForm.pageSize = value
  fetchSettingData()
}
const fetchData = async () => {
  //
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
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
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  const index = data.columnIndex
  if (index === 0 || index === 1 || index === 2 || index === 4) {
    return {
      textAlign: 'center',
      cursor: 'not-allowed'
    }
  }
  else if (index === 3 || index === 5) {
    return {
      textAlign: 'center',
      cursor: 'pointer'
    }
  }
  return {
    textAlign: 'center'
  }
}
</script>

<style lang="scss" scoped>
.tabs-table-container {
  :deep() {
    .el-tabs {
      border-radius: var(--el-border-radius-base);

      &__header {
        border-top-left-radius: var(--el-border-radius-base);
        border-top-right-radius: var(--el-border-radius-base);
      }

      &__nav-wrap {
        border-radius: var(--el-border-radius-base);
      }

      .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: calc(var(--el-container-height) - var(--el-padding) - 52px) !important;

        .vab-query-form {
          .el-form {
            .el-form-item:first-child {
              // margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
          }
        }

        .el-table {
          flex: 1;
        }
      }
    }
  }
}
.noneHoverTable {
  .none {
    display: none;
  }
  :deep() {
    .el-checkbox {
      transform: scale(1.3);
    }
  }
}
</style>