<template>
  <vab-dialog
    title="匹配"
    width="80%"
    v-model="dflag"
    class="dialog"
    top="10vh"
    @close="handleCloseCheck"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button v-if="!disabled3" type="primary" :disabled="disabled1 || (!disabled1 && !disabled2)" @click="handleStartMatch">开始匹配</el-button>
        <el-button v-if="!disabled3 && (!disabled1 && !disabled2)" type="primary" @click="showSentButNotReported">已发未报</el-button>
        <el-button v-if="!disabled3 && (!disabled1 && !disabled2)" type="primary" @click="handleClearCheckAll">清空全部</el-button>
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
        <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
        <el-table-column label="装箱总数" prop="encasementCount" min-width="100"></el-table-column>
        <el-table-column label="站点" prop="site" min-width="130"></el-table-column>
        <el-table-column label="匹配的PO" prop="po" min-width="110"></el-table-column>
        <el-table-column label="SKU实际数量" prop="skuActualCount" min-width="130"></el-table-column>
      </el-table-column>
      <el-table-column label="零件">
        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(list, '零件名', 'componentName')"></el-table-column>
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
      <el-table-column label="操作" width="150" fixed="right" v-if="!disabled3 && (!disabled1 && !disabled2)">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleShowMatch2(row)">匹配</el-link>
          <el-link type="danger" :underline="false" @click="handleCheckClear(row)">清空</el-link>
          <el-link v-if="row.delStatus === 1" type="danger" :underline="false" @click="handleDelCheckMatch(row)">删除</el-link>
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
        <el-button v-if="!disabled3 && (!disabled1 && !disabled2)" type="danger" @click="handleUnlockAndClear">清空解锁</el-button>
        <el-button v-if="!disabled3 && (!disabled1 && !disabled2)" type="success" @click="handleConfirmCheckMatch">确认匹配结果</el-button>
      </div>
    </template>
  </vab-dialog>
  <vab-dialog
    title="匹配"
    class="dialog"
    top="7vh"
    width="90%"
    v-model="match2Visible"
    :before-close="handleCloseMatch2"
  >

    <div style="margin-bottom: 15px">
      <el-button type="primary" style="margin-right: 10px" @click="handleClearAll">清空全部</el-button>
      <el-text style=" font-size: var(--el-font-size-base);font-weight: 600;">
        SKU：<span :style="{ color: 'var(--el-color-primary)' }">{{ _sku }}</span>  
        品名：<span :style="{ color: 'var(--el-color-primary)' }">{{ _desc }}</span>  
        剩余未匹配数量：<span :style="{ color: 'var(--el-color-danger)' }">{{ _encasementCount }}</span>
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
            <el-input type="number" @wheel.stop.prevent :min="0" :max="row.goodCount" v-model="row.skuActualCount" @focus="handleFocus(row)" @change="handleUpdateSkuCount(row)" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="零件">
        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(matchList, '零件名', 'componentName')"></el-table-column>
        <el-table-column label="实际数量" prop="componentActualCount" min-width="100"></el-table-column>
        <el-table-column label="退税报关数量" prop="customsDeclarationCount" min-width="130">
          <template #default="{ row }">
            <el-input v-model="row.customsDeclarationCount" @wheel.stop.prevent :min="0" type="number" @focus="handleFocus(row)" @change="handleUpdateComponentCustomCount(row)" />
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
      <el-table-column label="操作" width="230" fixed="right">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleShowPackingCount(row)">修正质检</el-link>
          <el-link type="primary" :underline="false" @click="handleInsertAll(row)">填入全部</el-link>
          <el-link type="danger" :underline="false" @click="handleClear(row)">清空</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div style=" margin-top: 20px;text-align: center">
      <el-text style=" font-size: var(--el-font-size-base);font-weight: 600;">
        剩余SKU：<span :style="{ color: 'var(--el-color-danger)'}">{{ lastSku }}个</span>
      </el-text>
    </div>
    <template #footer>
      <div style="text-align: center;">
        <el-button v-if="previousVisible" type="warning" @click="fetchPreviousMatchData">上一个</el-button>
        <el-button type="success" @click="handleCloseMatch2">关闭</el-button>
        <el-button v-if="nextVisible" type="warning" @click="fetchNextMatchData" >下一个</el-button>
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
        <el-button type="primary" @click="handleArchive">归档</el-button>
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
      :data="sentList"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="SKU" prop="sku" min-width="200"></el-table-column>
      <el-table-column label="描述" prop="desc" min-width="200"></el-table-column>
      <el-table-column label="PO" prop="po" min-width="100"></el-table-column>
      <el-table-column label="未报已发" prop="yfwbCount" min-width="100"></el-table-column>
      <el-table-column label="已报未发" prop="ybwfCount" min-width="100"></el-table-column>
      <el-table-column label="采购方" prop="purchase" min-width="90"></el-table-column>
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
  <!-- 点击清点质检 - 打包总数 -->
  <vab-dialog
    title="打包总数"
    width="22%"
    v-model="packingCountVisible"
    class="packingTotal"
    :before-close="closePackingCount"
  >
    <el-form ref="packingCountFormRef" :model="packingCountForm" label-position="left" label-width="auto" style=" margin-right: 0px;margin-left: 20px">
      <el-form-item label="任务数量" prop="packageTaskCount">
        <div style="width: 85%;">
          <el-input v-model="packingCountForm.packageTaskCount" disabled  ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="好" prop="goodCount">
        <div style="width: 85%; margin-right: 10px;">
          <el-input v-model.trim="packingCountForm.goodCount" clearable/>
        </div>
        <div style=" display: flex; align-items: center;width: 10%">
          <el-icon :size="23" class="add-icon" style="margin: 0 auto; cursor: pointer;" @click="handleShowAdd"><CirclePlus /></el-icon>
        </div>
      </el-form-item>
      <el-form-item label="留样" prop="keepSampleCount">
        <div style="width: 85%;">
          <el-input v-model.trim="packingCountForm.keepSampleCount" clearable/>
        </div>
      </el-form-item>
      <el-form-item label="坏" prop="badCount">
        <div style="width: 85%;">
          <el-input v-model.trim="packingCountForm.badCount" clearable/>
        </div>
      </el-form-item>
      <el-form-item label="缺">
        <div style="width: 85%;">
          <el-input v-model="lackCount" disabled />
        </div>
      </el-form-item>
      <el-form-item label="多">
        <div style="width: 85%;">
          <el-input v-model="manyCount" disabled />
        </div>
      </el-form-item>
      <el-form-item label="打包总数">
        <div style="width: 85%;">
          <el-input v-model="packingTotal" disabled />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="margin-right: 10px">
        <el-button type="danger" @click="closePackingCount">取消</el-button>
        <el-button type="success" @click="confirmQualityCheck">确认</el-button>
      </div>
    </template>
  </vab-dialog>
  <!-- 增加 -->
  <vab-dialog
    title="增加"
    v-model="addVisible"
    @close="handleCloseAdd"
    width="17%"
  >
    <el-form ref="addFormRef" :model="addForm" label-width="auto" label-position="left" style=" margin-right: 20px;margin-left: 20px">
      <el-form-item label="好" prop="good">
        <el-input v-model.trim="addForm.good" clearable />
      </el-form-item>
      <el-form-item label="留样" prop="sample">
        <el-input v-model.trim="addForm.sample" clearable />
      </el-form-item>
      <el-form-item label="坏" prop="bad">
        <el-input v-model.trim="addForm.bad" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCloseAdd">取消</el-button>
      <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { CirclePlus, Search, Select } from '@element-plus/icons-vue'
import { FormInstance } from 'element-plus'
import { CSSProperties } from 'vue'
import { getQualityCheck } from '~/src/api/devlocal/packagingShipping'
import { IGetQualityCheck } from '~/src/type/packagingShipping/packagingType'
import { flexColumnWidth } from '~/src/utils/tableColum'
import { clearAllMatchComponent, clearAllMatchShipment, clearMatchComponent, clearMatchShipment, clearUnlockMatchShipment, delMatchShipment, getCheckMatchList, getMatchPackageList, getMatchSentList, insertAllMatchComponent, lockMatchShipment, submitMatchShipment, updateMatchComponentCustomCount, updateMatchQuality, updateMatchSkuActualCount } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { IGetCheckMatchList, IGetMatchPackageList, IGetMatchSentList } from '/@/type/customsDeclarationAndTaxRefund/matchPo'

const dflag = ref<boolean>(false)
const match2Visible = ref<boolean>(false)
const disabled1 = ref<boolean>(false)
const disabled2 = ref<boolean>(true)
const disabled3 = ref<boolean>(false)
let props = defineProps<{
  matchVisible: boolean
  status: number
  shipId: number
  disabled1: boolean
  disabled2: boolean
  disabled3: boolean
}>()
watchEffect(() => {
  dflag.value = props.matchVisible
  disabled1.value = props.disabled1
  disabled2.value = props.disabled2
  disabled3.value = props.disabled3
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
// 关闭匹配2
const handleCloseMatch2 = () => {
  match2Visible.value = false
  matchList.value = []
  Object.keys(skuActualCountMap).forEach(key => delete skuActualCountMap[key]);
  Object.keys(customsDeclarationCountMap).forEach(key => delete customsDeclarationCountMap[key]);
  fetchData()
}
// 已发未报的多选
const selectRows = ref<IGetMatchSentList[]>([]) 
const setSelectRows = (value: IGetMatchSentList[]) => {
  selectRows.value = value
}
// 打包总数是否可见
const packingCountVisible = ref<boolean>(false)
// 增加是否可见
const addVisible = ref<boolean>(false)
interface IAddForm {
  good: number | null
  sample: number | null
  bad: number | null
}
// 增加form
const addForm = reactive<IAddForm>({
  good: null,
  sample: null,
  bad: null
})
// 增加form-ref
const addFormRef = ref<FormInstance>()

// 点击增加按钮
const handleShowAdd = () => {
  addVisible.value = true
}

// 关闭增加
const handleCloseAdd = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
// 增加确认
const handleConfirmAdd = () => {
  let good = Number(addForm.good)
  let sample = Number(addForm.sample)
  let bad = Number(addForm.bad)
  let pGood = Number(packingCountForm.goodCount)
  packingCountForm.goodCount = pGood + good
  let pSample = Number(packingCountForm.keepSampleCount)
  packingCountForm.keepSampleCount = pSample + sample
  let pBad = Number(packingCountForm.badCount)
  packingCountForm.badCount = pBad + bad
  handleCloseAdd()
}

// 打包总数form
const packingCountForm = reactive<IGetQualityCheck>({})
// 打包总数formRef
const packingCountFormRef = ref<FormInstance>()
// 传递给打包总数的值
const _mId = ref<number>()
const _taskId = ref<number>()
// 展示打包总数
const handleShowPackingCount = async (row: any) => {

  packingCountVisible.value = true
  _mId.value = row.mId
  _taskId.value = row.taskId
  const { data } = await getQualityCheck({
    id: row.taskId
  })
  Object.assign(packingCountForm, data)
  if (!data!.id) {
    packingCountForm.packageTaskCount = row.packageTaskCount
  }
  // if (!data?.packageTaskCount) {
  //   packingCountForm.packageTaskCount = 0
  // }
  lackCount.value = data?.lackCount!
  manyCount.value = data?.manyCount
}
// 清点质检的取消
const closePackingCount = () => {
  packingCountVisible.value = false
}
// 清点质检的确认
const confirmQualityCheck = async () => {
  const { data } = await updateMatchQuality({
    taskId: _taskId.value!,
    mId: _mId.value!,
    goodCount: packingCountForm.goodCount!,
    manyCount: manyCount.value!,
    keepSampleCount: packingCountForm.keepSampleCount!,
    lackCount: lackCount.value,
    badCount: packingCountForm.badCount!,
  })
  if (data) {
    $baseMessage('修正质检信息成功', 'success')
    packingCountVisible.value = false
    fetchMatchData()
  }
}
// 缺的数量
const lackCount = computed<number>({
  get() {
    let good = Number(packingCountForm.goodCount);
    let bad = Number(packingCountForm.badCount);
    let taskCount = Number(packingCountForm.packageTaskCount);
    return taskCount - good - bad;
  },
  set(value) {

  }
});
// 多的数量
const manyCount = computed({
  get() {
    let good = Number(packingCountForm.goodCount)
    let taskCount = Number(packingCountForm.packageTaskCount)
    if (good > taskCount) {
      return good - taskCount
    }
  },
  set(value) {

  }
})
// 打包总数数量
const packingTotal = computed({  
  get() {
    let good = Number(packingCountForm.goodCount)
    let bad = Number(packingCountForm.badCount)
    return good + bad
  },
  set(value) {

  }
})
// 开始匹配
const handleStartMatch = async () => {
  const { data } = await lockMatchShipment({
    id: props.shipId
  })
  if (data) {
    $baseMessage('开始匹配成功', 'success')
    disabled1.value = false
    disabled2.value = false 
  }
}
// 获取第二个匹配的数据
const fetchMatchData = async () => {
  const { data } = await getMatchPackageList({
    sku: _sku.value,
    status: props.status,
    matchId: _id.value
  })
  matchList.value = data
  matchList.value.forEach((item: any) => {
    if (item.skuActualCount !== 0 && item.skuActualCount != null && item.skuActualCount != undefined) {
      skuActualCountMap[item.mId] = Number(item.skuActualCount) || 0
    }
    if (item.customsDeclarationCount !== '0' && item.customsDeclarationCount != null && item.customsDeclarationCount != undefined) {
      customsDeclarationCountMap[item.poComponentId] = Number(item.customsDeclarationCount) || 0
    }
  })
}
// 上一个显示
const previousVisible = ref<boolean>(false)
// 下一个显示
const nextVisible = ref<boolean>(false)
// 剩余未匹配数的初始值
const _originalCount = ref<number>(0)
// 剩余SKU数
const lastSku = ref<number>(0)
// 点击上一个
const fetchPreviousMatchData = async () => {
  const index = idList.value.findIndex((item: any) => item === _id.value)
  _id.value = idList.value[index - 1]
  const item = list.value.find((item: any) => item.id === _id.value)
  _sku.value = item!.sku
  _originalCount.value = Number(item!.encasementCount)
  Object.keys(skuActualCountMap).forEach(key => delete skuActualCountMap[key]);
  Object.keys(customsDeclarationCountMap).forEach(key => delete customsDeclarationCountMap[key]);
  const { data } = await getMatchPackageList({
    sku: _sku.value,
    status: props.status,
    matchId: _id.value
  })
  matchList.value = data
  matchList.value.forEach((item: any) => {
    if (item.skuActualCount !== 0 && item.skuActualCount != null && item.skuActualCount != undefined) {
      skuActualCountMap[item.mId] = Number(item.skuActualCount) || 0
    }
    if (item.customsDeclarationCount !== '0' && item.customsDeclarationCount != null && item.customsDeclarationCount != undefined) {
      customsDeclarationCountMap[item.poComponentId] = Number(item.customsDeclarationCount) || 0
    }
  })
  handleShowPreviousOrNext(_id.value)
}
// 点击下一个
const fetchNextMatchData = async () => {
  const index = idList.value.findIndex((item: any) => item === _id.value)
  _id.value = idList.value[index + 1]
  const item = list.value.find((item: any) => item.id === _id.value)
  _sku.value = item!.sku
  _originalCount.value = Number(item!.encasementCount)
  Object.keys(skuActualCountMap).forEach(key => delete skuActualCountMap[key]);
  Object.keys(customsDeclarationCountMap).forEach(key => delete customsDeclarationCountMap[key]);
  const { data } = await getMatchPackageList({
    sku: _sku.value,
    status: props.status,
    matchId: _id.value
  })
  matchList.value = data
  matchList.value.forEach((item: any) => {
    if (item.skuActualCount !== 0 && item.skuActualCount != null && item.skuActualCount != undefined) {
      skuActualCountMap[item.mId] = Number(item.skuActualCount) || 0
    }
    if (item.customsDeclarationCount !== '0' && item.customsDeclarationCount != null && item.customsDeclarationCount != undefined) {
      customsDeclarationCountMap[item.poComponentId] = Number(item.customsDeclarationCount) || 0
    }
  })    
  handleShowPreviousOrNext(_id.value)
}
const handleShowPreviousOrNext = (id: number) => {
  const length = idList.value.length
  const index = idList.value.findIndex((item: any) => item === id)
  lastSku.value = length - index - 1
  // 处理上一个还是下一个显示
  if (index === 0) {
    previousVisible.value = false
    nextVisible.value = true
  } else if (index === length - 1) {
    previousVisible.value = true
    nextVisible.value = false
  } else {
    previousVisible.value = true
    nextVisible.value = true
  }
}
const handleShowMatch2 = (row: any) => {
  match2Visible.value = true
  _sku.value = row.sku
  _desc.value = row.desc
  _id.value = row.id
  _originalCount.value = Number(row.encasementCount)

  handleShowPreviousOrNext(row.id)
  fetchMatchData()
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
const sentList = ref<IGetMatchSentList[]>([])
const querySentData = () => {
  querySentForm.pageNo = 1
  fetchSentData()
}
const handleCurrentSentChange = (value: number) => {
  querySentForm.pageNo = value
  fetchSentData()
}
const handleSizeSentChange = (value: number) => {
  querySentForm.pageNo = 1
  querySentForm.pageSize = value
  fetchSentData()
}
// 展示已发未报
const showSentButNotReported = () => {
  sentButNotReportedVisible.value = true
  fetchSentData()
}
// 已发未报的归档
const handleArchive = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选择任何行!', 'warning')
    return
  }
  if (selectRows.value.length > 1) {
    $baseMessage('只能选择一项进行归档!', 'warning')
    return
  }
  // $baseConfirm('确定要归档吗?', null, async () => {
  //   const { data } = await archiveMatchSentList({
  //     id: selectRows.value[0].id!
  //   })
  //   if (data) {
  //     $baseMessage('归档成功', 'success')
      
  //   }
  // })
}
// 确定已发未报
const confirmSent = async () => {

}
const fetchSentData = async () => {
  sentListLoading.value = true
  const { data } = await getMatchSentList(querySentForm)
  sentTotal.value = data.total
  sentList.value = data.list
  sentListLoading.value = false
}

// 关闭匹配
const handleCloseCheck = () => {
  emit('updateMatchVisible', false)
}

// 用于存储改变过的项
const skuActualCountMap = reactive<Record<string, number>>({});
const customsDeclarationCountMap = reactive<Record<string, number>>({});

const handleFocus = (row: IGetMatchPackageList) => {
  // 如果该 mId 不存在于 changedItems 中，初始化记录
  if (!(row.mId in skuActualCountMap)) {
    skuActualCountMap[row.mId] = Number(row.skuActualCount) || 0
  }
  if (!(row.mId in customsDeclarationCountMap)) {
    customsDeclarationCountMap[row.poComponentId] = Number(row.customsDeclarationCount) || 0
  }
}
const handleUpdateSkuCount = async (row: IGetMatchPackageList) => {
  
  if (row.goodCount == null || row.goodCount == undefined) {
    $baseMessage('当前打包显示的打包任务没有好的数量，不能输入数量！', 'error');
    if (row.mId in skuActualCountMap) {
      const previousValues = skuActualCountMap[row.mId];
      row.skuActualCount = previousValues;
    }
    return;
  }

  try {
    const { data } = await updateMatchSkuActualCount({
      id: _id.value,
      poId: row.poId,
      sku: row.sku,
      mId: row.mId,
      skuCount: row.skuActualCount,
    });

    if (data) {
      fetchMatchData();
      skuActualCountMap[row.mId] = Number(row.skuActualCount)
    }
  } catch (error: any) {
    // 恢复修改前的值
    if (row.mId in skuActualCountMap) {
      const previousValues = skuActualCountMap[row.mId];
      row.skuActualCount = previousValues
    }
  }
}

const _encasementCount = computed(() => {
  // 初始值减去所有修改过的 skuActualCount
  const changedTotal = Object.values(skuActualCountMap).reduce((sum, count) => sum + count, 0);
  return _originalCount.value - changedTotal;
});

// 修改零件的退税报关数量
const handleUpdateComponentCustomCount = async (row: IGetMatchPackageList) => {
  try {
    const { data } = await updateMatchComponentCustomCount({
      id: _id.value,
      mId: row.mId,
      dId: row.dId,
      count: row.customsDeclarationCount
    })
    if (data) {
      fetchMatchData()
      customsDeclarationCountMap[row.poComponentId] = Number(row.customsDeclarationCount)
    }
  } catch (error) {
    // 恢复修改前的值
    if (row.poComponentId in customsDeclarationCountMap) {
      const previousValues = customsDeclarationCountMap[row.poComponentId]
      row.customsDeclarationCount = previousValues
    }
  }
}
// 填入全部
const handleInsertAll = async (row: IGetMatchPackageList) => {
  try {
    const { data } = await insertAllMatchComponent({
      id: _id.value,
      poId: row.poId,
      sku: row.sku,
      mId: row.mId
    })
    if (data) {
      $baseMessage('填入全部成功', 'success')
      fetchMatchData()
    }
  } catch (error) {
    console.error(error)
  }
}
// 查看匹配的清空
const handleCheckClear = async (row: IGetCheckMatchList) => {
  $baseConfirm('确定要清空吗?', null, async () => {
    try {
      const { data } = await clearMatchShipment({
        id: row.id
      })
      if (data) {
        $baseMessage('清空成功', 'success')
        fetchData()
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
        fetchMatchData()
      }
    } catch (error) {
      console.error(error)
    }
  })
}
// 查看匹配的清空全部
const handleClearCheckAll = async () => {
  const setIds = new Set()
  list.value.forEach((item: IGetCheckMatchList) => {
    setIds.add(item.id)
  })
  const ids = Array.from(setIds).join(',')
  $baseConfirm('确定要清空全部吗?', null, async () => {
    try {
      const { data } = await clearAllMatchShipment({
        ids: ids,
      })
      if (data) {
        $baseMessage('清空全部成功', 'success')
        fetchData()
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
        fetchMatchData()
      }
    } catch (error) {
      console.error(error)
    }
  })
}
// 查看匹配的删除
const handleDelCheckMatch = async (row: IGetCheckMatchList) => {
  try {
    const { data } = await delMatchShipment({
      id: row.id
    })
    if (data) {
      $baseMessage('删除成功', 'success')
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
// 清空解锁并取消
const handleUnlockAndClear = async () => {
  const setIds = new Set()
  list.value.forEach((item: IGetCheckMatchList) => {
    setIds.add(item.id)
  })
  const ids = Array.from(setIds).join(',')
  try {
    const { data } = await clearUnlockMatchShipment({
      ids: ids,
      id: props.shipId
    })
    if (data) {
      $baseMessage('清空解锁并取消成功', 'success')
      emit('updateMatchVisible', false)
    }
  } catch (error) {
    console.error(error)
  }
}
// 确认提交
const handleConfirmCheckMatch = async () => {
  try {
    const { data } = await submitMatchShipment({
      id: props.shipId
    })
    if (data) {
      $baseMessage('确认提交成功!', 'success')
      emit('updateMatchVisible', false)
    }
  } catch (error) {
    console.error(error)
  }
}
const idList = ref<any[]>([])
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getCheckMatchList({...queryForm, shipId: props.shipId})
  total.value = data.total
  list.value = data.list
  let idSet = new Set()
  list.value.forEach((item: any) => {
    idSet.add(item.id)
  })
  idList.value = Array.from(idSet)
  list.value.sort((a, b) => {
    return a.id - b.id;
  })  
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
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

/**
 * @description 支持非连续的相同值合并以及处理两种合并逻辑
 */
const objectSpanMethod1 = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1 // 默认不跨行
 
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 12) {
    const id = row.id

    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }
    // rowspan = list.value.filter(item => item.id === id).length

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || list.value[rowIndex - 1].id !== id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 }
  }

  if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
    const pId = row.pId
    const id = row.id

    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].pId === pId && list.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || list.value[rowIndex - 1].pId !== pId || list.value[rowIndex - 1].id !== row.id
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 }
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 }
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
  return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : '';
};
let previous2: any = null; 
let currentGroupIndex2 = 0; // 当前组索引

const stripedRowClass2 = (_row: any) => {
  const { row } = _row;
  const currentId = row.mId;
  // 检查当前行是否与上一行不同
  if (currentId !== previous2) {
    previous2 = currentId; 
    currentGroupIndex2++; 
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex2 % 2 === 0 ? 'el-table__row--striped' : '';
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
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
:deep(.striped) {
  background-color: #fafafa;
}
.add-icon:hover {
  color: var(--el-color-primary); 
}
</style>