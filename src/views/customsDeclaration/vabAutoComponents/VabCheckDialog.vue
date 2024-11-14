<template>
  <vab-dialog
    title="查看"
    v-model="dflag"
    top="10vh"
    class="dialog"
    width="70%"
    @close="closeCheck"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="showSentButNotReported">已发未报</el-button>
        <el-button type="primary">清空</el-button>
        <el-text style="font-weight: 600; margin: 0 10px calc(var(--el-margin) / 2) 0;">
          Shipment ID：<span :style="{ color: 'var(--el-color-primary)' }">123</span>  
        </el-text>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData"  placeholder="请输入搜索关键词" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" native-type="submit" :loading="listLoading" @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border stripe
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="fakeData"
      class="noneHoveTable"
    >
      <el-table-column label="SKU" prop="" min-width="200"></el-table-column>
      <el-table-column label="描述" prop="" min-width="130"></el-table-column>
      <el-table-column label="装箱个数" prop="" min-width="100"></el-table-column>
      <el-table-column label="站点" prop="" min-width="100"></el-table-column>
      <el-table-column label="当前匹配PO" prop="" min-width="120"></el-table-column>
      <el-table-column label="实际数量" prop="" min-width="100">
 
      </el-table-column>
      <el-table-column label="报关数量" prop="" min-width="100">
 
      </el-table-column>
      <el-table-column label="PO数量" prop="" min-width="100"></el-table-column>
      <el-table-column label="Agent" prop="" min-width="100"></el-table-column>
      <el-table-column label="是否有已报未发" prop="" min-width="140">
        <template #default="{ row }">
          <el-checkbox :true-value="1" :false-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" fixed="right" >
        <template #default="{ row }">
          <el-link type="primary" :underline="false">匹配PO</el-link>
          <el-link type="primary" :underline="false">清空</el-link>
          <el-link type="danger" :underline="false">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </vab-dialog>
  <!-- 匹配PO -->
  <vab-dialog
    title="匹配PO"
    v-model="matchPoVisible"
    top="10vh"
    class="dialog"
  >
    <div style="margin-bottom: 15px;">
      <el-button type="primary">自动填入</el-button>
      <el-button type="primary">清空所有</el-button>
      <el-text>
        SKU：<span :style="{ color: 'var(--el-color-primary)' }">Tomorotec-0017-bIkTri-RevB</span> 
        品名：<span :style="{ color: 'var(--el-color-primary)' }">三角沥水架-包胶款-黑色</span> 
        剩下个数：<span :style="{ color: 'var(--el-color-danger)' }">100</span>
      </el-text>
    </div>
    <el-table>
      <el-table-column label="序号" prop="" min-width="70"></el-table-column>
      <el-table-column label="PO" prop="" min-width="100"></el-table-column>
      <el-table-column label="站点" prop="" min-width="100"></el-table-column>
      <el-table-column label="打包完成数量" prop="" min-width="110"></el-table-column>
      <el-table-column label="Pack QTY" prop="" min-width="110"></el-table-column>
      <el-table-column label="Agent" prop="" min-width="80"></el-table-column>
      <el-table-column label="已报关" prop="" min-width="90">
        <template #default="{ row }">
          <el-checkbox :true-value="1" :false-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="实际数量" prop="" min-width="100">
        <template #default="row">
          <el-input clearable />
        </template> 
      </el-table-column>
      <el-table-column label="报关数量" prop="" min-width="100">
        <template #default="row">
          <el-input clearable />
        </template> 
      </el-table-column>
      <el-table-column label="PO数量" prop="" min-width="100"></el-table-column>
      <el-table-column label="已发未报" prop="" min-width="100"></el-table-column>
      <el-table-column label="已报未发" prop="" min-width="100"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">填入全部</el-link>
          <el-link type="primary" :underline="false">清空</el-link>
        </template>
      </el-table-column>

    </el-table>
    <div style="text-align: center; margin-top: 20px">
      <el-text>
        剩余SKU：<span :style="{ color: 'var(--el-color-danger)'}">18个</span>
      </el-text>
    </div>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="warning">上一个</el-button>
        <el-button type="success">关闭</el-button>
        <el-button type="warning">下一个</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 已报未发 -->
  <vab-dialog
    title="已报未发"
    width="60%"
    class="dialog"
    v-model="sentButNotReportedVisible"
    top="10vh"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">归档</el-button>
        <el-button type="primary" @click="showAggregate">聚合归档</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="querySentForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="querySentForm.keyWord" @input="querySentData" @keyup.enter.native="querySentData"  placeholder="请输入搜索关键词" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" native-type="submit" :loading="sentListLoading" @click="querySentData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border stripe
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="sentCellStyle"
      class="noneHoveTable"
      :data="fakeData"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="SKU" prop="sku" min-width="200"></el-table-column>
      <el-table-column label="描述" prop="" min-width="200"></el-table-column>
      <el-table-column label="PO" prop="" min-width="100"></el-table-column>
      <el-table-column label="未报已发" prop="" min-width="100"></el-table-column>
      <el-table-column label="已报未发" prop="" min-width="100"></el-table-column>
      <el-table-column label="agent" prop="" min-width="90"></el-table-column>
      <el-table-column label="备注" prop="" min-width="100"></el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="querySentForm.pageNo"
      :page-size="querySentForm.pageSize"
      :total="sentTotal"
      @current-change="handleCurrentSentChange"
      @size-change="handleSizeSentChange"
    />
    <template #footer>
      <div style="text-align: center;" >
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </div>
    </template>
  </vab-dialog>
  
  <!-- 聚合归档 -->
  <vab-dialog
    title="聚合归档"
    v-model="aggregateVisible"
    class="dialog"
    top="10vh"
    width="60%"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">批量归档</el-button>
        <el-button type="primary">筛选</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="aggregateForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="aggregateForm.keyWord" @input="queryAggregateData" @keyup.enter.native="queryAggregateData"  placeholder="请输入搜索关键词" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" native-type="submit" :loading="aggregateListLoading" @click="queryAggregateData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border stripe
      class="noneHoveTable"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="sentCellStyle"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="SKU" prop="" min-width=""></el-table-column>
      <el-table-column label="描述" prop="" min-width=""></el-table-column>
      <el-table-column label="未报已发之和" prop="" min-width=""></el-table-column>
      <el-table-column label="已报未发之和" prop="" min-width=""></el-table-column>
      <el-table-column label="差值" prop="" min-width=""></el-table-column>
      <el-table-column label="agent" prop="" min-width=""></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary">归档</el-button>
        </template>
      </el-table-column>
    </el-table>
    <vab-pagination 
      :current-page="aggregateForm.pageNo"
      :size-page="aggregateForm.pageSize"
      :total="aggregateTotal"
      @current-change="handleCurrentAggregateChange"
      @size-change="handleSizeAggregateChange"
    />
  </vab-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'

const dflag = ref<boolean>(false)
let props = defineProps<{
  checkVisible: boolean
}>()
const emit = defineEmits(['update-checkVisible'])
watchEffect(() => {
  dflag.value = props.checkVisible
})

const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<any>([])
// 匹配PO可见
const matchPoVisible = ref<boolean>(false)
// 展示匹配PO
const showMatchPo = () => {
  matchPoVisible.value = true
}
// 已发未报的展示
const sentButNotReportedVisible = ref<boolean>(false)
const querySentForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const sentTotal = ref<number>(0)
const sentListLoading = ref<boolean>(false)
const querySentData = () => {
  querySentForm.pageNo = 1
  // fetchData()
}
const handleCurrentSentChange = (value: number) => {
  querySentForm.pageNo = value
  // fetchData()
}
const handleSizeSentChange = (value: number) => {
  querySentForm.pageSize = value
  // fetchData()
}
// 聚合归档的展示
const aggregateVisible = ref<boolean>(false)
const showAggregate = () => {
  aggregateVisible.value = true
}
const aggregateForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const aggregateListLoading = ref<boolean>(false)
const aggregateTotal = ref<number>(0)
const queryAggregateData = () => {
  aggregateForm.pageNo = 1
  // fetchData()
}
const handleCurrentAggregateChange = (value: number) => {
  aggregateForm.pageNo = value
  // fetchData()
}
const handleSizeAggregateChange = (value: number) => {
  aggregateForm.pageSize = value
  // fetchData()
}
// 关闭查看
const closeCheck = () => {
  emit('update-checkVisible', false)
}
// 展示已发未报
const showSentButNotReported = () => {
  sentButNotReportedVisible.value = true
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
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 0 || data.columnIndex === 1) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const sentCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex === 1 || data.columnIndex === 2) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const fakeData = [
  {
    sku: 'HLTH-0027-BLK'
  }
]
</script>