<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="广告库存规则" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline :model="queryForm">
              <el-form-item>
                <el-button type="primary" @click="showBatchUpdateOperationAutoRules">批量修改</el-button>
                <el-button type="primary" @click="queryDefautlParmas">默认参数</el-button>
              </el-form-item>
              <el-form-item label="站点">
                <el-select
                  v-model="queryForm.sites"
                  class="multiple-select"
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                  multiple
                  placeholder="全部站点"
                  style="width: 220px"
                  @change="queryData"
                >
                  <template #header>
                    <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">所有</el-checkbox>
                  </template>
                  <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运营">
                <el-select v-model="queryForm.operationUserId" placeholder="请选择运营人员" @change="queryData">
                  <el-option v-for="item in operateUserList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input
                  v-model="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>

        <div v-if="listLoading">
          <el-skeleton animated :loading="listLoading">
            <template #template>
              <div style="display: flex; flex-direction: column; height: calc(100vh - 270px)">
                <div style="display: flex; flex: 1; flex-direction: column; padding: 0">
                  <el-skeleton-item style="flex: 1; min-height: 300px" variant="p" />
                  <div style="display: flex; justify-content: center; margin-top: 20px">
                    <el-skeleton-item style="width: 100%; height: 32px" variant="text" />
                  </div>
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>

        <el-table
          v-loading="listLoading"
          border
          :cell-class-name="clearPadding"
          :cell-style="cellStyle"
          :data="operationAutoMationList"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="changeCreateInput"
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed="left" type="selection" width="38" />
          <el-table-column class="image-wall" label="图片" width="75">
            <template #default="{ row }">
              <el-image
                fit="fill"
                :src="row.skuImg"
                style="display: block; width: 75px; height: 75px"
                @click="imagePreviewShow(row.skuImg)"
              >
                <template #error><el-icon /></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(operationAutoMationList, 'SKU', 'sku')" />
          <el-table-column label="站点" prop="siteName" width="135" />
          <el-table-column label="运营" prop="operationUser" width="95" />
          <el-table-column label="规则开关" width="95">
            <template #default="scope1">
              <el-switch
                v-model="scope1.row.roleStatus"
                :active-value="1"
                :inactive-value="0"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                @change="updateRoleStatus(scope1.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作对象" width="130">
            <template #default="scope">
              <el-select
                v-model="scope.row.group"
                placeholder="请选择操作对象"
                style="min-width: 100%"
                @change="updateSelectType(scope.row)"
              >
                <el-option v-for="item in scope.row.operationTypeList" :key="item.code" :label="item.name" :value="item" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作广告类型" width="130">
            <template #default="scope">
              <el-select
                v-model="scope.row.operationAdvType"
                multiple
                placeholder="请选择广告类型"
                style="min-width: 100%"
                @change="updateSelectType(scope.row)"
              >
                <el-option v-for="item in scope.row.operationAdvTypeList" :key="item.code" :label="item.name" :value="item" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="开启广告（满足全部条件）">
            <el-table-column label="剩余可售天数≥" min-width="125" prop="openDays">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.openDays"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.openDays }}</span>
              </template>
            </el-table-column>
            <el-table-column label="可售库存数≥" min-width="110" prop="openStock">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.openStock"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.openStock }}</span>
              </template>
            </el-table-column>
            <el-table-column label="断货天数≤" min-width="95" prop="openOutStockDays">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.openOutStockDays"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.openOutStockDays }}</span>
              </template>
            </el-table-column>
            <el-table-column label="广告ACOS≤" min-width="120" prop="openAdvAcos">
              <template #header>
                <el-tooltip content="" effect="dark" placement="top">
                  <div class="questionIcon">
                    广告ACOS≤
                    <el-icon><info-filled /></el-icon>
                  </div>
                  <template #content>
                    <div class="custom-tooltip">最近30个有广告花费记录日期的整体ACOS</div>
                  </template>
                </el-tooltip>
              </template>
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.openAdvAcos"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.openAdvAcos }}%</span>
              </template>
            </el-table-column>

            <el-table-column label="Rating≥" min-width="90" prop="openRating">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.openRating"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.openRating }}</span>
              </template>
            </el-table-column>

            <el-table-column label="毛利率≥" min-width="110" prop="openGrossProfit">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.openGrossProfit"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.openGrossProfit }}%</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="关闭广告（满足任一条件）">
            <el-table-column label="断货天数≥" min-width="95" prop="closeOutStockDays">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.closeOutStockDays"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.closeOutStockDays }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余可售天数≤" min-width="125" prop="closeDays">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.closeDays"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.closeDays }}</span>
              </template>
            </el-table-column>
            <el-table-column label="可售库存数≤" min-width="110" prop="closeStock">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.closeStock"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.closeStock }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Rating≤" min-width="90" prop="closeRating">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.closeRating"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.closeRating }}</span>
              </template>
            </el-table-column>

            <el-table-column label="毛利率≤" min-width="110" prop="closeGrossProfit">
              <template #default="{ row, $index }">
                <div class="none">
                  <el-input
                    v-model="row.closeGrossProfit"
                    type="number"
                    @blur="clickCreateCancel($event, row, $index)"
                    @keyup.enter="clickCreateCancel($event, row, $index)"
                  />
                </div>
                <span>{{ row.closeGrossProfit }}%</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="系统最新操作日期" prop="lastUpdateTime" width="110">
            <template #header>
              系统最新
              <br />
              操作日期
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="130">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="openSystemOperationLog(row)">系统操作日志</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
        <vab-pagination
          v-model:limit="queryForm.pageSize"
          v-model:page="queryForm.pageNo"
          :default-page-size="queryForm.pageSize"
          :total="queryTotal"
          @current-change="currentChange"
          @size-change="sizeChange"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 批量修改 -->
    <vab-dialog v-model="pictureBatchUpdateVisible" :title="dialogTitle" top="7vh" width="23%">
      <el-form ref="pictureBatchUpdateFormRef" label-position="right" label-width="auto" :model="pictureBatchUpdateForm" style="margin: 0">
        <el-form-item label="规则开关" prop="roleStatus">
          <el-select v-model="pictureBatchUpdateForm.roleStatus" :disabled="batchBtnLoading" placeholder="请填入信息">
            <el-option label="关闭广告" :value="0" />
            <el-option label="开启广告" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作对象" prop="requiredCompletionDate">
          <el-select v-model="pictureBatchUpdateForm.group" :disabled="batchBtnLoading" placeholder="请选择操作对象">
            <el-option v-for="item in operationTypeList" :key="item.code" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作广告类型" prop="requiredCompletionDate">
          <el-select v-model="pictureBatchUpdateForm.operationAdvType" :disabled="batchBtnLoading" multiple placeholder="请选择广告类型">
            <el-option v-for="item in operationAdvTypeList" :key="item.code" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>

        <el-card>
          <template #header><h3>开启广告</h3></template>
          <el-form-item label="剩余可售天数 ≥ " prop="requiredCompletionDate">
            <el-input v-model="pictureBatchUpdateForm.openDays" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
          <el-form-item label="可售库存数 ≥ " prop="cooperationCommissionRatio">
            <el-input v-model="pictureBatchUpdateForm.openStock" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
          <el-form-item label="断货天数 ≤ " prop="individualCommissionRate">
            <el-input v-model="pictureBatchUpdateForm.openOutStockDays" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
          <el-form-item label="广告ACOS ≤ " prop="cooperationWeight">
            <el-input v-model="pictureBatchUpdateForm.openAdvAcos" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
          <el-form-item label="Rating ≥ " prop="addition">
            <el-input v-model="pictureBatchUpdateForm.openRating" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
          <el-form-item label="毛利率 ≥ " prop="lowRate">
            <el-input v-model="pictureBatchUpdateForm.openGrossProfit" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
        </el-card>

        <el-card>
          <template #header><h3>关闭广告</h3></template>
          <el-form-item label="断货天数 ≥ " prop="lowRate">
            <el-input v-model="pictureBatchUpdateForm.closeOutStockDays" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
          <el-form-item label="剩余可售天数 ≤ " prop="lowRate">
            <el-input v-model="pictureBatchUpdateForm.closeDays" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
          <el-form-item label="可售库存数 ≤ " prop="lowRate">
            <el-input v-model="pictureBatchUpdateForm.closeStock" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
          <el-form-item label="Rating ≤ " prop="lowRate">
            <el-input v-model="pictureBatchUpdateForm.closeRating" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
          <el-form-item label="毛利率 ≤ " prop="lowRate">
            <el-input v-model="pictureBatchUpdateForm.closeGrossProfit" :disabled="batchBtnLoading" type="number" />
          </el-form-item>
        </el-card>
      </el-form>
      <template #footer>
        <el-button @click="cancleUpdateTask">取消</el-button>
        <el-button :loading="batchBtnLoading" type="primary" @click="batchUpdateTask">确认</el-button>
      </template>
    </vab-dialog>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <automation-system-operation-log :id="logId" v-model="systemOperationLogVisible" />
  </div>
</template>

<script lang="ts" setup>
import { InfoFilled, Search } from '@element-plus/icons-vue'
import type { CheckboxValueType } from 'element-plus'
import { isEqual } from 'lodash-es'
import { CSSProperties } from 'vue'
import {
  queryDefaultParamsOperationAutoMation,
  queryOperationAutoMationList,
  updateBatchOperationAutoMation,
  updateDefailtParmasOperationAutoMation,
  updateOperationAutoMation,
} from '/@/api/devlocal/operationAutoMation'
import { getDistributionOptionUserList, getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import { getUserAmazonOperation } from '/@/api/devlocal/productPerformance'
import { useAclStore } from '/@/store/modules/acl'
import type { IAutoMationItem, IAutoMationQueryReq, IAutoMationUpdateReq, IOperationType } from '/@/type/storeOperation/autoMation'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'
defineOptions({
  name: 'Automation',
})

interface OptionType {
  id: number
  label: string
}
const router = useRouter()
const route = useRoute()
const aclStore = useAclStore()
const dialogTitle = ref<string>('批量修改')
const indeterminate = ref<boolean>(false)
const checkAll = ref<boolean>(false)
const pictureBatchUpdateVisible = ref<boolean>(false)
const batchBtnLoading = ref<boolean>(false)
const activeName = ref(0)
const operationTypeList = ref<IOperationType[]>([])
const operationAdvTypeList = ref<IOperationType[]>([])
const queryForm = reactive<IAutoMationQueryReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 30,
  sites: [],
  operationUserId: -1,
})
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const systemOperationLogVisible = ref<boolean>(false)
const pictureBatchUpdateForm = reactive<IAutoMationUpdateReq>({
  closeDays: undefined,
  closeGrossProfit: undefined,
  closeOutStockDays: undefined,
  closeRating: undefined,
  closeStock: undefined,
  group: { code: undefined, name: undefined },
  openAdvAcos: undefined,
  openDays: undefined,
  openGrossProfit: undefined,
  openOutStockDays: undefined,
  openRating: undefined,
  openStock: undefined,
  operationAdvType: [],
  roleStatus: 0,
})

let copyRow: IAutoMationItem
const listLoading = ref<boolean>(false)
const operationAutoMationList = ref<IAutoMationItem[]>([])
const siteList = ref<OptionType[]>([])
const operateUserList = ref<OptionType[]>([])
const queryTotal = ref<number>(0)
const disabledDev = ref<boolean>(false)
const multipleSelection = ref<IAutoMationItem[]>([])
const logId = ref<number>(-1)
// 打开系统操作日志
const openSystemOperationLog = (row: IAutoMationItem) => {
  logId.value = row.id!
  systemOperationLogVisible.value = true
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

// 获取站点列表
const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}

// 获取运营列表
const fetchOperateUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  operateUserList.value = data
  operateUserList.value.unshift({ id: -1, label: '全部' })
}

// 获取当前登录账号信息
const fetchOperationUser = async () => {
  const { data } = await getUserAmazonOperation()
  queryForm.operationUserId = data.operationUserId
}

// 获取数据
const fetchData = async () => {
  try {
    listLoading.value = true
    const { data } = await queryOperationAutoMationList({
      ...queryForm,
    })
    if (data?.list.length == 0) {
      listLoading.value = false
      operationAutoMationList.value = []
      queryTotal.value = 0
      return
    }
    operationAutoMationList.value = data?.list!
    queryTotal.value = data?.total!
    listLoading.value = false
  } catch (error) {
    listLoading.value = false
  }
}

const sizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: value,
    },
  })
  fetchData()
}

// 创建blur修改
const clickCreateCancel = (event: any, value: IAutoMationItem, index: number) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add('none')
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    updateCommon(value)
  }
  queryData()
}

const updateCommon = async (value: IAutoMationItem) => {
  const advTypes = value.operationAdvType.map((el) => el.code).join(',')

  const { data } = await updateOperationAutoMation({
    id: value.id,
    closeDays: value.closeDays,
    closeOutStockDays: value.closeOutStockDays,
    closeRating: value.closeRating,
    closeGrossProfit: value.closeGrossProfit,
    closeStock: value.closeStock,
    openAdvAcos: value.openAdvAcos,
    openDays: value.openDays,
    openGrossProfit: value.openGrossProfit,
    openOutStockDays: value.openOutStockDays,
    openRating: value.openRating,
    openStock: value.openStock,
    groupId: value.group.code,
    operationAdvTypeStr: advTypes,
    roleStatus: value.roleStatus,
  })

  if (data) {
    $baseMessage('修改成功！', 'success')
  }
}

const currentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: value,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    queryForm.sites = siteList.value.map((_) => _.id)
    // 全选的时候获取数据
    if (activeName.value === 0) {
      queryData()
    }
  } else {
    queryForm.sites = []
    // 取消全选获取数据
    if (activeName.value === 0) {
      fetchData()
    }
  }
}

// table点击事件
const changeCreateInput = async (row: IAutoMationItem, column: any, cell: HTMLTableCellElement) => {
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

const operationAndDevelopSelect = () => {
  const role = aclStore.getRole[0]
  switch (role) {
    // 老板和运营主管
    case 'ROLE_BOSS': {
      disabledDev.value = false
      queryForm.sites = [0]
      break
    }
    case 'ROLE_ECOMMERCEOPERATIONLEAD': {
      disabledDev.value = false

      break
    }
    // 运营
    case 'ROLE_ECOMMERCEOPERATOR': {
      disabledDev.value = true
      break
    }
  }
}

// table多选事件
const handleSelectionChange = (val: IAutoMationItem[]) => {
  multipleSelection.value = val
}

// 批量修改按钮
const showBatchUpdateOperationAutoRules = async () => {
  dialogTitle.value = '批量修改'
  resetForm()
  if (multipleSelection.value.length === 0) {
    $baseMessage('请选择需要批量修改的数据！', 'warning')
    return
  }
  operationTypeList.value = operationAutoMationList.value[0].operationTypeList
  operationAdvTypeList.value = operationAutoMationList.value[0].operationAdvTypeList
  pictureBatchUpdateVisible.value = true
}

// 批量修改确定
const batchUpdateTask = async () => {
  try {
    if (isEqual(dialogTitle.value, '批量修改')) {
      batchBtnLoading.value = true
      let ids: number[] = []
      multipleSelection.value.forEach((el) => {
        ids.push(el.id!)
      })
      $baseConfirm('确定要批量修改吗？', null, async () => {
        const { ...filterForm } = pictureBatchUpdateForm

        const advsTypes = pictureBatchUpdateForm.operationAdvType?.map((el) => el.code).join(',')

        const params = {
          ids: ids,
          ...filterForm,
          groupId: filterForm.group?.code,
          operationAdvTypeStr: advsTypes,
        }
        const { data } = await updateBatchOperationAutoMation(params)
        if (data) {
          $baseMessage('批量修改成功！', 'success')
          batchBtnLoading.value = false
          pictureBatchUpdateVisible.value = false
          resetForm()
          queryData()
        }
      })
    } else {
      batchBtnLoading.value = true
      let ids: number[] = []
      multipleSelection.value.forEach((el) => {
        ids.push(el.id!)
      })
      const { ...filterForm } = pictureBatchUpdateForm
      const advsTypes = pictureBatchUpdateForm.operationAdvType?.map((el) => el.code).join(',')
      const params = {
        ...filterForm,
        groupId: filterForm.group?.code,
        operationAdvTypeStr: advsTypes,
      }
      const { data } = await updateDefailtParmasOperationAutoMation(params)
      if (data) {
        $baseMessage('默认参数修改成功！', 'success')
        batchBtnLoading.value = false
        pictureBatchUpdateVisible.value = false
        resetForm()
        queryData()
      }
    }
  } catch (error) {
    batchBtnLoading.value = false
    pictureBatchUpdateVisible.value = false
  }
}

// 获取默认参数信息
const queryDefautlParmas = async () => {
  dialogTitle.value = '自动化默认参数'
  operationTypeList.value = operationAutoMationList.value[0].operationTypeList
  operationAdvTypeList.value = operationAutoMationList.value[0].operationAdvTypeList
  const { data } = await queryDefaultParamsOperationAutoMation()
  pictureBatchUpdateForm.closeDays = data?.closeDays!
  pictureBatchUpdateForm.roleStatus = data?.roleStatus!
  pictureBatchUpdateForm.closeGrossProfit = data?.closeGrossProfit!
  pictureBatchUpdateForm.closeOutStockDays = data?.closeOutStockDays!
  pictureBatchUpdateForm.closeRating = data?.closeRating!
  pictureBatchUpdateForm.closeStock = data?.closeStock!
  pictureBatchUpdateForm.group = data?.group!
  pictureBatchUpdateForm.openAdvAcos = data?.openAdvAcos!
  pictureBatchUpdateForm.openDays = data?.openDays!
  pictureBatchUpdateForm.openGrossProfit = data?.openGrossProfit!
  pictureBatchUpdateForm.openOutStockDays = data?.openOutStockDays!
  pictureBatchUpdateForm.openRating = data?.openRating!
  pictureBatchUpdateForm.openStock = data?.openStock!
  pictureBatchUpdateForm.operationAdvType = data?.operationAdvType!
  pictureBatchUpdateVisible.value = true
}

const resetForm = () => {
  pictureBatchUpdateForm.closeDays = undefined
  pictureBatchUpdateForm.closeGrossProfit = undefined
  pictureBatchUpdateForm.closeOutStockDays = undefined
  pictureBatchUpdateForm.closeRating = undefined
  pictureBatchUpdateForm.closeStock = undefined
  pictureBatchUpdateForm.group = undefined
  pictureBatchUpdateForm.openAdvAcos = undefined
  pictureBatchUpdateForm.openDays = undefined
  pictureBatchUpdateForm.openGrossProfit = undefined
  pictureBatchUpdateForm.openOutStockDays = undefined
  pictureBatchUpdateForm.openRating = undefined
  pictureBatchUpdateForm.openStock = undefined
  pictureBatchUpdateForm.operationAdvType = undefined
  pictureBatchUpdateForm.roleStatus = 0
}

const cancleUpdateTask = () => {
  pictureBatchUpdateVisible.value = false
  batchBtnLoading.value = false
}

const updateRoleStatus = (value: IAutoMationItem) => {
  updateCommon(value)
}

const updateSelectType = (value: IAutoMationItem) => {
  updateCommon(value)
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}

const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === 'SKU') {
    return {
      textAlign: 'left',
    }
  } else if (label !== '站点' && label !== '运营') {
    return {
      cursor: 'pointer',
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'center',
  }
}
onBeforeMount(() => {
  operationAndDevelopSelect()
  const { pageNo, pageSize } = route.query
  queryForm.pageNo = Number(pageNo) || 1
  queryForm.pageSize = Number(pageSize) || 50
  fetchData()
  fetchSiteList()
  fetchOperateUserList()
  fetchOperationUser()
})
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
          .left-panel {
            margin-bottom: 5px !important;
          }
          .right-panel {
            margin-bottom: 5px !important;
          }
        }

        .el-table {
          flex: 1;
          .el-table__body {
            .cell {
              max-height: 81.2px;
            }
          }
          .clear-padding {
            padding-top: 0px;
            padding-bottom: 0px;
          }
          .clear-padding .cell {
            padding-right: 0px;
            padding-left: 0px;
          }
        }
      }
      .el-checkbox {
        transform: scale(1.2); // 放大 20%
        transform-origin: center; // 确保放大从中心开始
      }
    }
  }
}
.none {
  display: none;
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
</style>
