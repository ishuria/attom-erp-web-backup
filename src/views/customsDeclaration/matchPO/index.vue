<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">报关资料生成</el-button>
        <el-button type="primary">清关资料生成</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" @input="queryData" @keypress.enter.native="queryData" placeholder="请输入搜索关键词" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="listLoading" @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border stripe
      :header-cell-style="{ textAlign: 'center' }"
      class="noneHoveTable"
      :data="list"
      :cell-style="CellStyle"
      :cell-class-name="getCellClass"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货日期" prop="shipmentDate" min-width="115">
        <template #default="{ row }">
          {{  row.shipmentDate ? row.shipmentDate.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="合同编号" prop="contractNumber" :width="flexColumnWidth(list, '合同编号', 'contractNumber')">
        <template #default="{ row }">
          <el-input v-model="row.contractNumber"  clearable />
        </template>
      </el-table-column>
      <el-table-column label="Shipment ID" prop="shipmentId" min-width="160"></el-table-column>
      <el-table-column label="Reference ID" prop="referenceId" min-width="130">
        <template #default="{ row }">
          <el-input v-model="row.referenceId" clearable />
        </template>
      </el-table-column>
      <el-table-column label="站点" prop="site" min-width="130"></el-table-column>
      <el-table-column label="货代单号" prop="freightForwardingNumber" min-width="120">
        <template #default="{ row }">
          <el-input v-model="row.freightForwardingNumber" clearable />
        </template>
      </el-table-column>
      <el-table-column label="合并报关" prop="" min-width="100"></el-table-column>
      <el-table-column label="合并清关" prop="" min-width="100"></el-table-column>
      <el-table-column label="货代渠道" prop="channelId" min-width="180">
        <template #default="{ row }">
          <el-select v-model="row.channelId" clearable >
            <el-option 
              v-for="item in forwarderOption"
              :label="item.label"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="产品总数" prop="totalNumber" min-width="100"></el-table-column>
      <el-table-column label="重量" prop="weight" min-width="70"></el-table-column>
      <el-table-column label="体积" prop="volume" min-width="70"></el-table-column>
      <el-table-column label="预估运费" prop="" min-width="100"></el-table-column>
      <el-table-column label="实际运费" prop="" min-width="100"></el-table-column>
      <el-table-column label="已付运费" prop="payStatus" min-width="100">
        <template #default="{ row }">
          <el-checkbox 
            :true-value="1" 
            :false-value="0"
            :class="{ 
              'checkbox-yellow': row.payStatus === 1, 
              'checkbox-green': row.payStatus === 2 
            }"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" min-width="160">
        <template #default="{ row }">
          <span :style="{ color: row.matchStatus === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
            {{ row.matchStatus === 0 ? '待匹配' : '已匹配' }}
          </span><br />
          <span :style="{ color: row.packArchiveStatus === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
            {{ row.packArchiveStatus === 0 ? '待打包归档' : '已打包归档' }}
          </span><br />
          <span :style="{ color: row.taxRefundStatus === 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
            {{ row.taxRefundStatus === 0 ? '待归档到退税关联' : '已归档到退税关联' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary" @click="showMatch(row)">
              匹配
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="showCheck">查看</el-link>
                </el-dropdown-item> -->
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="showMatch(row)">匹配</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">打包归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">退税归档</el-link>
                </el-dropdown-item>
                <!-- <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="showForwarderChannel">修改货代渠道</el-link>
                </el-dropdown-item> -->
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="showFirstLegFreight">头程运费</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">合同导入</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">撤销打包归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">撤销退税归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">撤销装箱(删除)</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据"></el-empty>
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 头程运费 -->
    <vab-dialog
      title="运费明细 | 货代单号： | 自测重量： | 自测体积： "
      width="65%"
      v-model="firstLegFreightVisible"
      top="10vh"
      class="dialog"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary">添加费用</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table
        border stripe
        :header-cell-style="{ textAlign: 'center' }"
        class="noneHoveTable center-table"
        show-summary
        :cell-style="firstLegFreightStyle"
        @close="closeFirstLegFreight"
        :data="fakeData"
      >
        <el-table-column label="费用名" prop="" min-width="100"></el-table-column>
        <el-table-column label="数量" prop="" min-width="70"></el-table-column>
        <el-table-column label="单价" prop="" min-width="70"></el-table-column>
        <el-table-column label="预估总费用" prop="" min-width="110"></el-table-column>
        <el-table-column label="暂估汇率" prop="" min-width="100"></el-table-column>
        <el-table-column label="货币" prop="" min-width="100">
          <template #default="{ row }">
            <el-select style="min-width: 100%;">
              <el-option 
                v-for="item in currencyOption"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="实际总费用" prop="" min-width="110"></el-table-column>
        <el-table-column label="实际汇率" prop="" min-width="100"></el-table-column>
        <el-table-column label="差额" prop="price" min-width="90">
          <template #default="{ row }">
            <span :style="{ color: row.price > 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">{{ row.price }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="已付" prop="" min-width="90">
          <template #default="{ row }">
            <el-checkbox :true-value="1" :false-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="付款日期" prop="" min-width="115"></el-table-column>
        <el-table-column label="合并报关/清关" prop="" min-width="130"></el-table-column>
        <el-table-column label="SKU运费分摊方式" prop="" min-width="100">
          <template #header>
            SKU运费<br>分摊方式
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template #default="{ row }">
            <el-link type="danger" :underline="false">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="closeFirstLegFreight">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 匹配 -->
    <VabMatchDialog 
      :matchVisible="matchVisible"
      :status="status"
      :shipId="shipId"
      :disabled1="disabled1"
      :disabled2="disabled2"
      :disabled3="disabled3"
      @update-match-visible="handleCloseMatch"
    />
    <!-- 查看 -->
    <!-- <VabCheckDialog 
      :checkVisible="checkVisible"
      @update-check-visible="handleCloseCheck"
    /> -->
    <!-- 修改货代渠道 -->
    <vab-dialog
      title="修改货代渠道"
      width="20%"
      v-model="updateForwarderChannelVisible"
    >
      <el-form ref="forwarderChannelFormRef" :model="forwarderChannelForm" :rules="forwarderChannelFormRules" label-position="top" style="margin-left: 10px; margin-right: 10px">
        <el-form-item label="货代渠道" prop="forwarderChannel">
          <el-input v-model="forwarderChannelForm.forwarderChannel" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeForwarderChannel">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import { CSSProperties, VNode } from 'vue'
import { currencyOption } from '../constantOption'
import { FormInstance } from 'element-plus'
import { getMatchPoList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { IGetMatchPoList } from '/@/type/customsDeclarationAndTaxRefund/matchPo'
import { getChannelList } from '/@/api/devlocal/encasement'
import { flexColumnWidth } from '/@/utils/tableColum'

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const list = ref<IGetMatchPoList[]>([])
const listLoading = ref<boolean>(false)
const selectRows = ref<any>([])
const setSelectRows = (value: any) => {
  selectRows.value = value
}
// 货代渠道选项
const forwarderOption = ref<any>([])
// 头程运费可见
const firstLegFreightVisible = ref<boolean>(false)
// 匹配可见
const matchVisible = ref<boolean>(false)
// 查看可见
const checkVisible = ref<boolean>(false)
const status = ref<number>(0)
const shipId = ref<number>(0)
// 修改货代渠道可见
const updateForwarderChannelVisible = ref<boolean>(false)
const forwarderChannelForm = reactive<any>({

})
const forwarderChannelFormRef = ref<FormInstance>()
const forwarderChannelFormRules = reactive<any>({
  forwarderChannel: [{ required: true, message: '请输入货代渠道', trigger: 'blur' }]
})
// 关闭货代渠道
const closeForwarderChannel = () => {
  updateForwarderChannelVisible.value = false
}
// 展示货代渠道
const showForwarderChannel = () => {
  updateForwarderChannelVisible.value = true
}
// 展示头程运费
const showFirstLegFreight = () => {
  firstLegFreightVisible.value = true
}
// 关闭头程运费
const closeFirstLegFreight = () => {
  firstLegFreightVisible.value = false
}
// 开始匹配按钮是否禁用,所有按钮不显示
const disabled1 = ref<boolean>(false)
// 开始匹配禁用,所有按钮显示
const disabled2 = ref<boolean>(true)
// 控制所有按钮不显示
const disabled3 = ref<boolean>(false)
// 展示匹配
const showMatch = (row: IGetMatchPoList) => {
  status.value = row.packArchiveStatus!
  shipId.value = row.id!
  if (row.packArchiveStatus === 1) {
    disabled3.value = true
  } else if (row.packArchiveStatus === 0) {
    disabled3.value = false
  }
  if (row.lockStatus === 0) { //0 0 / 0 1 开始匹配显示,所有按钮不显示
    disabled1.value = false
    if (row.status === 0) {
      disabled2.value = true // 没有点开始匹配,所有按钮不显示
    } else if (row.status === 1) {
      disabled2.value = false // 开始匹配禁止,所有按钮显示
    }
  } else if (row.lockStatus === 1) { // 1 0
    disabled1.value = true //开始匹配禁用, 所有按钮不显示
  }
  matchVisible.value = true
}
// 关闭匹配
const handleCloseMatch = (value: boolean) => {
  matchVisible.value = value
}

// 关闭查看
const handleCloseCheck = (value: boolean) => {
  checkVisible.value = value
}
// 头程运费：合计的方法
const handleSummaryMethod = (data: { columns: any[], data: any[] }) => {
  
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
  queryForm.pageSize = value
  fetchData()
}

const fakeData = [
  {
    shipmentId: '123',
    po: 'PO123',
    status: '1',
    price: -2,
    payStatus: 1
  },
  {
    shipmentId: '123',
    po: 'PO123',
    status: '1',
    price: -2,
    payStatus: 2
  },
]
const CellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {

  if (data.columnIndex === 9) {
    return {
      textAlign: 'left'
    }
  }
  if (data.columnIndex === 16) {
    return {
      textAlign: 'left',
    }
  }
  return {
    textAlign: 'center'
  }
}
const getCellClass = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 2 || data.columnIndex === 4 || data.columnIndex === 6 || data.columnIndex === 9) {
    return 'reduce-padding'
  }
  return ''
}
const firstLegFreightStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 3 || data.columnIndex === 6) {
    return {
      fontWeight: '600',
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'center'
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getMatchPoList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
// 获取货代渠道
const fetchChannelOption = async () => {
  const { data } = await getChannelList()
  forwarderOption.value = data
}
onBeforeMount(() => {
  fetchData()
  fetchChannelOption()
})
</script>

<style lang="scss" scoped>
:deep(.noneHoveTable .el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
:deep(.dialog .el-dialog__body) {
  padding-top: 5px;
}
// :deep(input::-webkit-outer-spin-button),
// :deep(input::-webkit-inner-spin-button) {
//   -webkit-appearance: none;
// }
// :deep(input[type="number"]) {
//   -moz-appearance: textfield;
// }
.el-table :deep(.reduce-padding .cell) {
  padding-right: 3px;
  padding-left: 3px;
}
:deep(.center-table tr:last-child td), 
:deep(.center-table tr:last-child th) {
  text-align: center !important;
}
.checkbox-yellow {
  :deep() {
    .el-checkbox__inner {
      &:hover {
        border-color: var(--el-color-warning);
      }
    }
  }
}
// 选中且不被禁用的样式
:deep(.checkbox-yellow .el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-warning);
  border-color: var(--el-color-warning);
}
.checkbox-green {
  :deep() {
    .el-checkbox__inner {
      &:hover {
        border-color: var(--el-color-success);
      }
    }
  }
}
// 选中且不被禁用的样式
:deep(.checkbox-green .el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
}
</style>
