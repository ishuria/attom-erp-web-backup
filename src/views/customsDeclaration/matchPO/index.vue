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
      :data="fakeData"
      :cell-style="CellStyle"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货日期" prop="" min-width="115"></el-table-column>
      <el-table-column label="合同编号" prop="" min-width="115">
        <template #default="{ row }">
          <el-input clearable />
        </template>
      </el-table-column>
      <el-table-column label="Shipment ID" prop="shipmentId" min-width="130"></el-table-column>
      <el-table-column label="Reference ID" prop="" min-width="130">
        <template #default="{ row }">
          <el-input clearable />
        </template>
      </el-table-column>
      <el-table-column label="站点" prop="" min-width="100"></el-table-column>
      <el-table-column label="货代单号" prop="" min-width="100">
        <template #default="{ row }">
          <el-input clearable />
        </template>
      </el-table-column>
      <el-table-column label="合并报关" prop="" min-width="100"></el-table-column>
      <el-table-column label="合并清关" prop="" min-width="100"></el-table-column>
      <el-table-column label="货代渠道" prop="" min-width="180">
        <template #default="{ row }">
          <el-input clearable />
        </template>
      </el-table-column>
      <el-table-column label="产品总数" prop="" min-width="100"></el-table-column>
      <el-table-column label="重量" prop="" min-width="70"></el-table-column>
      <el-table-column label="体积" prop="" min-width="70"></el-table-column>
      <el-table-column label="预估运费" prop="" min-width="100"></el-table-column>
      <el-table-column label="实际运费" prop="" min-width="100"></el-table-column>
      <el-table-column label="已付运费" prop="" min-width="100">
        <template #default="{ row }">
          <el-checkbox :true-value="1" :false-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="130"></el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <el-dropdown>
            <el-button text type="primary" @click="showCheck">
              查看
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="showCheck">查看</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="showMatch">匹配</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">打包归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">退税归档</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="primary" :underline="false" @click="">修改货代渠道</el-link>
                </el-dropdown-item>
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
        class="noneHoveTable"
        show-summary
        :cell-style="firstLegFreightStyle"
        @close="closeFirstLegFreight"
      >
        <el-table-column label="费用名" prop="" min-width="100"></el-table-column>
        <el-table-column label="数量" prop="" min-width="70"></el-table-column>
        <el-table-column label="单价" prop="" min-width="70"></el-table-column>
        <el-table-column label="预估总费用" prop="" min-width="110"></el-table-column>
        <el-table-column label="暂估汇率" prop="" min-width="100"></el-table-column>
        <el-table-column label="货币" prop="" min-width="90">
          <template #default="{ row }">
            <el-select >
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
        <el-table-column label="差额" prop="" min-width="90"></el-table-column>
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
      @update-match-visible="handleCloseMatch"
    />
    <!-- 查看 -->
    <VabCheckDialog 
      :checkVisible="checkVisible"
      @update-check-visible="handleCloseCheck"
    />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { currencyOption } from '../constantOption'

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
// 头程运费可见
const firstLegFreightVisible = ref<boolean>(false)
// 匹配可见
const matchVisible = ref<boolean>(false)
// 查看可见
const checkVisible = ref<boolean>(false)
// 展示头程运费
const showFirstLegFreight = () => {
  firstLegFreightVisible.value = true
}
// 关闭头程运费
const closeFirstLegFreight = () => {
  firstLegFreightVisible.value = false
}
// 展示匹配
const showMatch = () => {
  matchVisible.value = true
}
// 关闭匹配
const handleCloseMatch = (value: boolean) => {
  matchVisible.value = value
}
// 展示查看
const showCheck = () => {
  checkVisible.value = true
}
// 关闭查看
const handleCloseCheck = (value: boolean) => {
  checkVisible.value = value
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  // fetchData()
}

const fakeData = [
  {
    shipmentId: '123',
    po: 'PO123'
  }
]
const CellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {

  if (data.columnIndex === 9 || data.columnIndex === 16) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const firstLegFreightStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  return {
    textAlign: 'center'
  }
}

</script>

<style lang="scss" scoped>
:deep(.noneHoveTable .el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
:deep(.dialog .el-dialog__body) {
  padding-top: 5px;
}
</style>