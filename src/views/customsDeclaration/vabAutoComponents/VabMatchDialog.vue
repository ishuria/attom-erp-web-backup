<template>
  <vab-dialog
    title="查看"
    width="80%"
    v-model="dflag"
    class="dialog"
    top="10vh"
    @close="handleCloseCheck"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="showSentButNotReported">已发未报</el-button>
        <el-button type="primary">清空全部</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" @input="queryData" @keydown.enter.native="queryData"  placeholder="请输入搜索关键词" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" native-type="submit" :loading="listLoading" @click="queryData"></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      class="noneHoveTable"
      :cell-style="match1Style"
      :data="list"
      :span-method="objectSpanMethod1"
      :row-class-name="stripedRowClass"
    >
      <el-table-column label="SKU">
        <el-table-column label="SKU" prop="sku" min-width="200"></el-table-column>
        <el-table-column label="装箱总数" prop="encasementCount" min-width="100"></el-table-column>
        <el-table-column label="站点" prop="site" min-width="130"></el-table-column>
        <el-table-column label="匹配的PO" prop="po" min-width="110"></el-table-column>
        <el-table-column label="SKU实际数量" prop="skuActualCount" min-width="130"></el-table-column>
      </el-table-column>
      <el-table-column label="零件">
        <el-table-column label="零件名" prop="componentName" min-width="200"></el-table-column>
        <el-table-column label="实际数量" prop="actualComponentCount" min-width="100"></el-table-column>
        <el-table-column label="退税报关数量" prop="customsDeclarationCount" min-width="130"></el-table-column>
        <el-table-column label="PO总数" prop="purchaseCount" min-width="90"></el-table-column>
        <el-table-column label="采购方" prop="purchase" min-width="90"></el-table-column>
        <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="80">
          <template #default="{ row }">
            <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="有已发未报" prop="flag" min-width="110">
          <template #default="{ row }">
            <el-icon v-show="row.flag === true"><Select /></el-icon>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleShowMatch2(row)">匹配</el-link>
          <el-link type="danger" :underline="false">清空</el-link>
          <el-link v-if="row.delStatus === 1" type="danger" :underline="false">删除</el-link>
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
    <template #footer>
      <div style="text-align: center;">
        <el-button type="danger" @click="handleCloseCheck">取消</el-button>
        <el-button type="success">确定</el-button>
      </div>
    </template>
  </vab-dialog>
  <vab-dialog
    title="匹配"
    class="dialog"
    top="7vh"
    width="90%"
    v-model="match2Visible"
  >

    <div style="margin-bottom: 15px">
      <el-button type="primary" style="margin-right: 10px" @click="handleClearAll">清空全部</el-button>
      <el-text style="font-weight: 600">
        SKU：<span :style="{ color: 'var(--el-color-primary)' }">{{ _sku }}</span>  
        品名：<span :style="{ color: 'var(--el-color-primary)' }">{{ _desc }}</span>  
        剩余未匹配数量：<span :style="{ color: 'var(--el-color-danger)' }">100</span>
      </el-text>
    </div>

    <el-table
      border
      :header-cell-style="{ textAlign: 'center' }"
      class="noneHoveTable"
      :cell-style="match2Style"
      :data="matchList"
      max-height="60vh"
      :span-method="objectSpanMethod2"
      :row-class-name="stripedRowClass2"
    >
      <el-table-column label="SKU">
        <el-table-column label="匹配的PO" prop="po" min-width="100"></el-table-column>
        <el-table-column label="站点" prop="siteName" min-width="150"></el-table-column>
        <el-table-column label="打包完成数(好)" prop="goodCount" min-width="140"></el-table-column>
        <el-table-column label="打包任务数" prop="packageTaskCount" min-width="110"></el-table-column>
        <el-table-column label="打包任务状态" prop="status" min-width="130"></el-table-column>
        <el-table-column label="SKU实际数量" prop="skuActualCount" min-width="130">
          <template #default="{ row }">
            <el-input type="number" :min="0" :max="row.goodCount" v-model="row.skuActualCount" @change="handleUpdateSkuCount(row)" clearable />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="零件">
        <el-table-column label="零件名" prop="componentName" min-width="200"></el-table-column>
        <el-table-column label="实际数量" prop="componentActualCount" min-width="100">
          <template #default="{ row }">
            <el-input type="number" :min="0" v-model="row.componentActualCount" clearable @change="handleUpdateComponentCount(row)" />
          </template>
        </el-table-column>
        <el-table-column label="退税报关数量" prop="customsDeclarationCount" min-width="130">
          <template #default="{ row }">
            <el-input v-model="row.customsDeclarationCount" :min="0" type="number" @change="handleUpdateComponentCustomCount(row)" clearable />
          </template>
        </el-table-column>
        <el-table-column label="剩余可报" prop="reportable" min-width="100"></el-table-column>
        <el-table-column label="PO总数" prop="purchaseCount" min-width="90"></el-table-column>
        <el-table-column label="采购方" prop="purchase" min-width="90"></el-table-column>
        <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="80">
          <template #default="{ row }">
            <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="已发未报" prop="yfwbCount" min-width="100"></el-table-column>
        <el-table-column label="已报未发" prop="ybwfCount" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleInsertAll(row)">填入全部</el-link>
          <el-link type="danger" :underline="false" @click="handleClear(row)">清空</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div style=" margin-top: 20px;text-align: center">
      <el-text style="font-weight: 600">
        剩余SKU：<span :style="{ color: 'var(--el-color-danger)'}">18个</span>
      </el-text>
    </div>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="warning">上一个</el-button>
        <el-button type="success" @click="match2Visible = false">关闭</el-button>
        <el-button type="warning">下一个</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 已发未报 -->
  <vab-dialog
    title="已发未报"
    width="60%"
    class="dialog"
    v-model="sentButNotReportedVisible"
    top="10vh"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary">归档</el-button>
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
        <el-button @click="sentButNotReportedVisible = false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </div>
    </template>
  </vab-dialog>

</template>

<script lang="ts" setup>
import { Search, Select } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { clearAllMatchComponent, clearMatchComponent, getCheckMatchList, getMatchPackageList, insertAllMatchComponent, updateMatchComponentActualCount, updateMatchComponentCustomCount, updateMatchSkuActualCount } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { IGetCheckMatchList, IGetMatchPackageList } from '/@/type/customsDeclarationAndTaxRefund/matchPo'

const dflag = ref<boolean>(false)
const match2Visible = ref<boolean>(false)
let props = defineProps<{
  matchVisible: boolean
  status: number
  shipId: number
}>()
watchEffect(() => {
  dflag.value = props.matchVisible
  if (dflag.value === true) {
    fetchData()
  }
})
const emit = defineEmits<{
  updateMatchVisible: [value: boolean]
}>()
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetCheckMatchList[]>([])
const matchList = ref<IGetMatchPackageList[]>([])
const _sku = ref<string>('')
const _desc = ref<string>('')
const _id = ref<number>(0)


const handleShowMatch2 = async (row: any) => {
  match2Visible.value = true
  _sku.value = row.sku
  _desc.value = row.desc
  _id.value = row.id
  const { data } = await getMatchPackageList({
    sku: row.sku,
    status: props.status
  })
  matchList.value = data
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
// 展示已发未报
const showSentButNotReported = () => {
  sentButNotReportedVisible.value = true
}


// 关闭匹配
const handleCloseCheck = () => {
  emit('updateMatchVisible', false)
}
// 修改SKU实际数量
const handleUpdateSkuCount = async (row: IGetMatchPackageList) => {
  try {
    await updateMatchSkuActualCount({
      id: _id.value,
      poId: row.poId,
      sku: row.sku,
      mId: row.mId,
      skuCount: row.skuActualCount
    })
  } catch (error) {
    console.error(error)
  }
}
// 修改零件的实际数量
const handleUpdateComponentCount = async (row: IGetMatchPackageList) => {
  try {
    await updateMatchComponentActualCount({
      id: _id.value,
      mId: row.mId,
      dId: row.dId,
      count: row.componentActualCount
    })
  } catch (error) {
    console.error(error)
  }
}
// 修改零件的退税报关数量
const handleUpdateComponentCustomCount = async (row: IGetMatchPackageList) => {
  try {
    await updateMatchComponentCustomCount({
      id: _id.value,
      mId: row.mId,
      dId: row.dId,
      count: row.customsDeclarationCount
    })
  } catch (error) {
    console.error(error)
  }
}
// 填入全部
const handleInsertAll = async (row: IGetMatchPackageList) => {
  $baseConfirm('确定要填入全部吗?', null, async () => {
    try {
      const { data } = await insertAllMatchComponent({
        id: _id.value,
        poId: row.poId,
        sku: row.sku,
        mId: row.mId
      })
      if (data) {
        $baseMessage('填入全部成功', 'success')
      }
    } catch (error) {
      console.error(error)
    }
  })
}
// 清空
const handleClear = async (row: IGetMatchPackageList) => {
  $baseConfirm('确定要清空吗?', null, async () => {
    try {
      const { data } = await clearMatchComponent({
        mId: row.mId,
        id: _id.value
      })
      if (data) {
        $baseMessage('清空成功', 'success')
      }
    } catch (error) {
      console.error(error)
    }
  })
}
// 清空全部
const handleClearAll = async () => {
  const setMids = new Set()
  matchList.value.forEach((item: IGetMatchPackageList) => {
    setMids.add(item.mId)
  })
  const mIds = Array.from(setMids).join(',')
  $baseConfirm('确定要清空全部吗?', null, async () => {
    try {
      const { data } = await clearAllMatchComponent({
        mIds: mIds,
        id: _id.value
      })
      if (data) {
        $baseMessage('清空全部成功', 'success')
      }
    } catch (error) {
      console.error(error)
    }
  })
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCheckMatchList({...queryForm, shipId: props.shipId})
  total.value = data.total
  list.value = data.list
  listLoading.value = false
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

// 匹配1col合并方法
const objectSpanMethod1 = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1; // 默认不跨行

  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 12) {
    const id = row.id;

    // 遍历后面的行，检查相同的 PO ID
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || list.value[rowIndex - 1].id !== id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 };
  }

  // 合并 SKU 行
  if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
    const pId = row.pId;

    // 遍历后面的行，检查相同的 SKU ID
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].pId === pId && list.value[i].id === row.id) {
        rowspan++;
      } else {
        break;
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || list.value[rowIndex - 1].pId !== pId || list.value[rowIndex - 1].id !== row.id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 };
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 };
}

//匹配2合并
const objectSpanMethod2 = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 15) {
    // 获取当前row的零件id
    const id = row.mId;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < matchList.value.length; i++) {
      // 如果零件id一样需要合并
      if (matchList.value[i].mId === id) {
        rowspan++;
      } else {
        break;
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || matchList.value[rowIndex - 1].mId !== id) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
}

let previous: any = null; 
let currentGroupIndex = 0; // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row;
  const currentId = row.id;
  // 检查当前行是否与上一行不同
  if (currentId !== previous) {
    previous = currentId; 
    currentGroupIndex++; 
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex % 2 === 0 ? 'striped' : '';
};
let previous2: any = null; 
let currentGroupIndex2 = 0; // 当前组索引

const stripedRowClass2 = (_row: any) => {
  const { row } = _row;
  const currentId = row.poId;
  // 检查当前行是否与上一行不同
  if (currentId !== previous2) {
    previous2 = currentId; 
    currentGroupIndex2++; 
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex2 % 2 === 0 ? 'striped' : '';
};

const match1Style = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex !== 0 && data.columnIndex !== 5) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
const match2Style = (data: { row: any, column: any, rowIndex: number, columnIndex: number}): CSSProperties => {
  if (data.columnIndex !== 6) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
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
</script>

<style lang="scss" scoped>
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
:deep(.striped) {
  background-color: #fafafa;
}
</style>