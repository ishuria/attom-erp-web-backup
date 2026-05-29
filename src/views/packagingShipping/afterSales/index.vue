<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待联系" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <operation-column-setting v-model:columns="columns" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-class-name="pendingCellClassName"
          :cell-style="pendingCellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @cell-click="contactedInputChange"
          @row-click="handleRowClick"
        >
          <after-sales-data-columns
            :active-name="activeName"
            :after-sales-option="afterSalesOption"
            :columns="columns"
            :list="list"
            :upload-image="uploadImage"
            @open-po-detail="openPoDetail"
            @preview-file="handlePreview"
            @remove-image="handleRemove"
            @show-preview-image="showPreviewImage"
            @update-after-sales="handleUpdateAfterSales"
          />

          <el-table-column fixed="right" label="操作" width="260">
            <template #default="{ row }">
              <el-space>
                <el-link type="primary" underline="never" @click="showMove(row)">移动到已联系</el-link>
                <el-link type="primary" underline="never" @click="showAfterSalesLog(row)">打包反馈日志</el-link>
              </el-space>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
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
      <el-tab-pane label="已联系" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <operation-column-setting v-model:columns="columns" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-class-name="contactedCellClassName"
          :cell-style="contactedCellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @cell-click="contactedInputChange"
          @row-click="handleRowClick"
        >
          <after-sales-data-columns
            :active-name="activeName"
            :after-sales-option="afterSalesOption"
            :columns="columns"
            :list="list"
            :upload-image="uploadImage"
            @open-po-detail="openPoDetail"
            @preview-file="handlePreview"
            @remove-image="handleRemove"
            @show-preview-image="showPreviewImage"
            @update-after-sales="handleUpdateAfterSales"
          />

          <el-table-column fixed="right" label="操作" width="200">
            <template #default="{ row }">
              <div class="after-sales-actions">
                <el-link class="after-sales-actions__archive" type="primary" @click="handleArchive(row)">归档</el-link>
                <div class="after-sales-actions__secondary">
                  <el-link type="primary">采购申请</el-link>
                  <el-link type="primary" @click="showAfterSalesLog(row)">打包反馈日志</el-link>
                </div>
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
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
      <el-tab-pane label="已完成" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <operation-column-setting v-model:columns="columns" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-class-name="contactedCellClassName"
          :cell-style="contactedCellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @cell-click="contactedInputChange"
          @row-click="handleRowClick"
        >
          <after-sales-data-columns
            :active-name="activeName"
            :after-sales-option="afterSalesOption"
            :columns="columns"
            :list="list"
            :upload-image="uploadImage"
            @open-po-detail="openPoDetail"
            @preview-file="handlePreview"
            @remove-image="handleRemove"
            @show-preview-image="showPreviewImage"
            @update-after-sales="handleUpdateAfterSales"
          />

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
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
      <el-tab-pane label="多" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <operation-column-setting v-model:columns="columns" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-class-name="pendingCellClassName"
          :cell-style="pendingCellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @cell-click="contactedInputChange"
          @row-click="handleRowClick"
        >
          <after-sales-data-columns
            :active-name="activeName"
            :after-sales-option="afterSalesOption"
            :columns="columns"
            :list="list"
            :upload-image="uploadImage"
            @open-po-detail="openPoDetail"
            @preview-file="handlePreview"
            @remove-image="handleRemove"
            @show-preview-image="showPreviewImage"
            @update-after-sales="handleUpdateAfterSales"
          />

          <el-table-column fixed="right" label="操作" width="260">
            <template #default="{ row }">
              <el-space>
                <el-link type="primary" underline="never" @click="showMove(row)">移动到已联系</el-link>
                <el-link type="primary" underline="never" @click="showAfterSalesLog(row)">打包反馈日志</el-link>
              </el-space>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
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
      <el-tab-pane label="坏账" :name="4">
        <vab-query-form>
          <vab-query-form-left-panel>
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap">
              <el-button type="primary">售后历史</el-button>
              <el-date-picker
                :key="datePickerKey"
                v-model="date"
                :clearable="true"
                :editable="true"
                type="daterange"
                value-format="YYYY-MM-DD"
                @change="queryData"
                @visible-change="(visible: boolean) => !visible && (datePickerKey += 1)"
              />
              <div
                style="
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                  padding: 6px 10px;
                  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
                  border-radius: 6px;
                  border: 1px solid #fca5a5;
                "
              >
                <span style="font-size: 15px; color: #7f1d1d">该区间坏账金额：</span>
                <span style="font-size: 18px; font-weight: 700; color: #dc2626; font-family: 'Arial', sans-serif">
                  ¥ {{ badDebtTotal }}
                </span>
              </div>
            </div>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <operation-column-setting v-model:columns="columns" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-class-name="badDebtsCellClassName"
          :cell-style="contactedCellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @cell-click="contactedInputChange"
          @row-click="handleRowClick"
        >
          <after-sales-data-columns
            :active-name="activeName"
            :after-sales-option="afterSalesOption"
            :columns="columns"
            :list="list"
            :upload-image="uploadImage"
            @open-po-detail="openPoDetail"
            @preview-file="handlePreview"
            @remove-image="handleRemove"
            @show-preview-image="showPreviewImage"
            @update-after-sales="handleUpdateAfterSales"
          />

          <el-table-column fixed="right" label="操作" width="140">
            <template #default="{ row }">
              <el-link type="primary" underline="never" @click="showAfterSalesLog(row)">打包反馈日志</el-link>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
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
      <el-tab-pane label="汇总" :name="-1">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <operation-column-setting v-model:columns="columns" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="queryForm.keyWord"
                  clearable
                  placeholder="请输入搜索关键词"
                  @input="queryData"
                  @keyup.enter="queryData"
                />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          border
          :cell-class-name="pendingCellClassName"
          :cell-style="pendingCellStyle"
          class="noneHoveTable custom-table-hover"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="tableRowClassName"
          stripe
          @cell-click="contactedInputChange"
          @row-click="handleRowClick"
        >
          <after-sales-data-columns
            :active-name="activeName"
            :after-sales-option="afterSalesOption"
            :columns="columns"
            :list="list"
            :upload-image="uploadImage"
            @open-po-detail="openPoDetail"
            @preview-file="handlePreview"
            @remove-image="handleRemove"
            @show-preview-image="showPreviewImage"
            @update-after-sales="handleUpdateAfterSales"
          />

          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
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
    <!-- 移动到已联系 -->
    <vab-dialog v-model="moveVisible" title="已联系" width="23%" @close="closeMove">
      <el-form
        ref="contactedFormRef"
        label-position="right"
        label-width="auto"
        :model="contactedForm"
        style="margin-right: 10px; margin-left: 10px"
      >
        <el-form-item label="选择售后方式" prop="type">
          <el-select v-model="contactedForm.type">
            <el-option v-for="item in afterSalesOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="closeMove">取消</el-button>
        <el-button type="success" @click="confirmContacted">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 采购申请 -->
    <vab-dialog v-model="purchaseRequisitionVisible" title="采购申请" width="60%">
      <el-table border :data="fakePurchaseData" :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column label="图片" />
        <el-table-column label="零件ID" min-width="70" prop="id" />
        <el-table-column label="零件名" min-width="150" />
        <el-table-column label="订货总数" />
        <el-table-column label="单位" min-width="70" />
        <el-table-column label="原因" min-width="150" />
        <el-table-column label="默认供应商" min-width="150" />
        <el-table-column label="收货仓库" min-width="150" />
        <el-table-column label="操作">
          <!-- <template #default="{ row }">
            <el-button text type="danger">删除</el-button>
          </template> -->
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button type="danger" @click="purchaseRequisitionVisible = false">取消</el-button>
        <el-button type="success">提交审批</el-button>
      </template>
    </vab-dialog>
    <!-- 打包反馈日志 -->
    <vab-dialog v-model="afterSalesLogVisible" title="打包反馈日志" width="57%">
      <el-table border :cell-style="afterSalesLogCellStyle" :data="afterSalesLogList" :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column label="反馈日期" min-width="115" prop="createTime">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="任务ID" min-width="70" prop="taskId" />
        <el-table-column label="任务数" min-width="100" prop="packageTaskCount" />
        <el-table-column label="好" min-width="100" prop="goodCount" />
        <el-table-column label="多" min-width="100" prop="manyCount" />
        <el-table-column label="留样" min-width="100" prop="keepSampleCount" />
        <el-table-column label="缺" min-width="100" prop="lackCount" />
        <el-table-column label="坏" min-width="100" prop="badCount" />
        <el-table-column label="待售后￥" min-width="100" prop="salesPrice" />
        <el-table-column label="日志类型" min-width="180" prop="logType" />
        <el-table-column label="备注" min-width="180" prop="remark" />
      </el-table>
    </vab-dialog>
    <wang-editor
      :content="LogCopy"
      :draft-field="draftField"
      :draft-id="detailId"
      source-page="afterSales"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorLogVisible"
      @click-boolean="cancelEditorLog"
      @click-child="confirmEditorLog"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- PO明细 -->
    <po-detail v-model="poDetailVisible" :close="closePoDetail" :poSkuId="poSkuId" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext, UploadFile } from 'element-plus'
import type { CSSProperties } from 'vue'
import { getDefaultStringTime } from '~/src/utils/dateUtils'
import {
  archiveAfterSales,
  badDebtAfterSales,
  checkAfterSalesArchive,
  deleteAfterSales,
  getAfterSalesList,
  getAfterSalesLog,
  getAfterSalesLogs,
  updateAfterSales,
  updateAfterSalesLog,
  updateSalesStatus,
  uploadAfterSales,
} from '/@/api/devlocal/packagingShipping'
import { getOperationColumnList } from '/@/api/devlocal/productPerformance'
import OperationColumnSetting from '/@/components/OperationColumnSetting.vue'
import type { IGetOperationColumnList } from '/@/type/storeOperation/productPerformanceType'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'
import poDetail from '/@/views/packagingShipping/components/poDetail.vue'

defineOptions({
  name: 'AfterSales',
})

const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any) => {
  selectedRowIndex.value = row.id
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (row.id === selectedRowIndex.value) {
    return 'select-row'
  }
  return ''
}

const activeName = ref<number>(0)
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)

const total = ref<number>(0)
const date = ref<[string, string]>(getDefaultStringTime())
const datePickerKey = ref(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 0,
})

const columns = ref<IGetOperationColumnList[]>([])

const fakePurchaseData = [
  {
    id: 123,
  },
]
// 移动到已联系的显示
const moveVisible = ref<boolean>(false)
// 选择售后方式选项
const afterSalesOption = [
  { label: '退款', value: 0 },
  { label: '随大货补寄', value: 1 },
  { label: '单独补寄', value: 2 },
  { label: '采购', value: 3 },
  { label: '无法售后', value: 4 },
  { label: '需要采购', value: 5 },
]
const confirmContacted = async () => {
  const { data } = await updateSalesStatus({
    id: copyRow.value.id,
    status: contactedForm.type,
  })
  if (data) {
    $baseMessage('移动到已联系成功', 'success')
    closeMove()
    fetchData()
  }
}
// 已联系修改
const handleUpdateAfterSales = async (row: any) => {
  await updateAfterSales({
    id: row.id,
    salesPrice: row.refundAmount,
    salesMethod: row.afterSalesMethod,
  })
}
const contactedForm = reactive<any>({
  type: 0,
})
const contactedFormRef = ref<any>()
const copyRow = ref<any>()
// 移动到已联系展示
const showMove = (row: any) => {
  copyRow.value = row
  moveVisible.value = true
}
// 关闭移动到已联系
const closeMove = () => {
  contactedFormRef.value.resetFields()
  moveVisible.value = false
}
// 售后日志可见
const afterSalesLogVisible = ref<boolean>(false)
// 售后日志列表
const afterSalesLogList = ref<any>()
// 售后日志展示
const showAfterSalesLog = async (row: any) => {
  const { data } = await getAfterSalesLog({
    poId: row.poId,
  })
  afterSalesLogList.value = data
  afterSalesLogVisible.value = true
}
// 采购申请可见
const purchaseRequisitionVisible = ref<boolean>(false)
// 展示采购申请
// const showPurchaseRequisition = () => {
//   purchaseRequisitionVisible.value = true
// }
async function uploadImage(params: any, row: any) {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', params.file)
    uploadImgForm.append('id', row.id)

    const { data } = await uploadAfterSales(uploadImgForm)
    row.hide = true

    Object.assign(row.imageList, [{ url: data }])
  } catch (error) {
    console.error(error)
  }
}
async function handleRemove(row: any) {
  try {
    $baseConfirm('确定要删除这张图片吗', '系统提示', async () => {
      const { data } = await deleteAfterSales({
        id: row.id,
      })
      if (data) {
        row.imageList = []
        row.hide = false
        $baseMessage('图片删除成功!', 'success', 'hey')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleTabClick = (tab: TabsPaneContext) => {
  // Object.assign(list.value, [])
  if (tab.props.name !== undefined) {
    queryForm.status = Number(tab.props.name)
    activeName.value = Number(tab.props.name)
  }
  router.push({
    query: {
      ...route.query,
      tab: tab.props.name,
    },
  })
  fetchData()
}
const badDebtTotal = ref<number>(0)
const fetchData = async () => {
  listLoading.value = true
  // 时间范围只作用于坏账tab
  if (activeName.value === 4) {
    queryForm.startDate = date.value?.[0]
    queryForm.endDate = date.value?.[1]
  } else {
    queryForm.startDate = undefined
    queryForm.endDate = undefined
  }
  try {
    const { data } = await getAfterSalesList(queryForm)
    if (data) {
      list.value = data.list
      total.value = data.total
      badDebtTotal.value = data.badDebtTotal
      list.value.forEach((item: any) => {
        item.suppliser = item.suppliser.replaceAll(',', '<br>')
        item.remark = item.remark.replace(/,/g, '\n')
        item.hide = false
        if (!item.voucherUrl) {
          item.hide = false
          item.imageList = []
        } else if (item.voucherUrl) {
          item.hide = true
          item.imageList = [{ url: item.voucherUrl }]
        }
      })
    }
  } finally {
    listLoading.value = false
  }
}
const router = useRouter()
const route = useRoute()
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    },
  })
  fetchData()
}

// 处理归档
const handleArchive = async (row: any) => {
  // // 如果已退款>=待售后，则归类为已完成。
  // if (row.refundAmount >= row.salesPrice) {

  // } else {
  //   $baseConfirm(`有${row.badCount+row.lackCount}套产品，${row.salesPrice}金额会被记为坏账，是否继续？`, '系统提示', async () => {
  //     // 归类为坏账
  //   })
  // }
  const { data } = await checkAfterSalesArchive({
    id: row.id,
  })
  if (data) {
    const { data: archive } = await archiveAfterSales({
      id: row.id,
    })
    if (archive) {
      $baseMessage('已成功归档到已完成', 'success')
      fetchData()
    }
  } else {
    $baseConfirm(`有${row.badCount + row.lackCount}套产品，${row.salesPrice}金额会被记为坏账，是否继续？`, '系统提示', async () => {
      // 归类为坏账
      const { data: badDebt } = await badDebtAfterSales({
        id: row.id,
      })
      if (badDebt) {
        $baseMessage('已成功归档到坏账', 'success')
        fetchData()
      }
    })
  }
}

const wangEditorTitle = ref<string>('')
const draftField = ref<string>('')
const wangEditorLogVisible = ref<boolean>(false)
const LogCopy = ref<string>('')
const cancelEditorLog = () => {
  wangEditorLogVisible.value = false
}
const confirmEditorLog = async (val: any) => {
  const { data } = await updateAfterSalesLog({ id: clickRow.value.id, log: val })
  if (data) {
    LogCopy.value = val
    clickRow.value.salesLog = val
  }
}
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
// 待联系点击输入框
// const pendingInputChange = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
//   // 处理图片放大预览
//   let el = getSpecificChildren(cell, "img")[0]
//   if (getDataAttribute(el, 'img') && el) {
//     imagePreviewVisible.value = true
//     imagePreviewList.value = []
//     imagePreviewList.value.push(el.src!)
//   }
//   if (column.property === 'afterSalesLog') {
//     clickRow.value = row
//     // const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.id })
//     LogCopy.value = row.afterSalesLog
//     // row.afterSalesLog = data
//     wangEditorTitle.value = '编辑售后日志'
//     draftField.value = 'afterSalesLog'
//     wangEditorLogVisible.value = !wangEditorLogVisible.value
//   }
// }
const clickRow = ref<any>()
const detailId = ref<number>(-1)
const contactedInputChange = async (row: any, column: any) => {
  if (column.property === 'salesLog') {
    clickRow.value = row
    const { data } = await getAfterSalesLogs({ id: row.id })
    LogCopy.value = row.salesLog
    row.salesLog = data
    wangEditorTitle.value = '编辑售后日志'
    detailId.value = row.id
    draftField.value = 'salesLog'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  }
}
const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const handlePreview = (file: UploadFile) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(file.url!)
}

const fetchOperationColumns = async () => {
  const { data } = await getOperationColumnList({ type: 23 })
  columns.value = data
}

// 待联系cellStyle
const pendingCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (!['sku', 'suppliser', 'remark', 'salesLog'].includes(data.column.property)) {
    return {
      textAlign: 'center' as const,
    }
  }
  return {
    textAlign: 'left' as const,
  }
}
// 前四个tab去掉padding和颜色显示
const pendingCellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.property === 'skuImageUrl') {
    return 'clear-padding'
  }
  if (data.column.property === 'goodCount') {
    if (data.row.goodCount >= data.row.purchaseSkuNumber) {
      return 'green'
    }
    return 'red'
  }
  return ''
}
// 已联系和已完成去掉padding和颜色显示
const contactedCellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (['skuImageUrl', 'voucherUrl'].includes(data.column.property)) {
    return 'clear-padding'
  }
  if (data.column.property === 'goodCount') {
    if (data.row.goodCount >= data.row.purchaseSkuNumber) {
      return 'green'
    }
    return 'red'
  }
  return ''
}
// 坏账去掉padding和颜色显示
const badDebtsCellClassName = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.column.property === 'skuImageUrl') {
    return 'clear-padding'
  }
  if (data.column.property === 'goodCount') {
    if (data.row.goodCount >= data.row.purchaseSkuNumber) {
      return 'green'
    }
    return 'red'
  }
  return ''
}
// 已联系cellStyle
const contactedCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '操作') {
    return {
      textAlign: 'center',
    }
  } else if (label === '打包反馈备注' || label === 'SKU' || label === '供应商' || label === '售后日志') {
    return {
      textAlign: 'left',
    }
  }

  return {
    textAlign: 'center',
  }
}
// 采购申请cellStyle
const afterSalesLogCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.columnIndex !== 9) {
    return {
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'left',
  }
}

/******* PO明细弹窗 *******/
const poDetailVisible = ref<boolean>(false)
const poSkuId = ref<number | null>(null)
// 打开PO明细弹窗
const openPoDetail = (skuId: any) => {
  const id = skuId ?? null
  if (id == null) {
    ElMessage.warning('缺少 PO SKU') // 按需
    return
  }
  poDetailVisible.value = true
  poSkuId.value = id
}
// 关闭PO明细弹窗
const closePoDetail = () => {
  poDetailVisible.value = false
  poSkuId.value = null
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(async () => {
  const { pageNo, pageSize, tab } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  if (tab) {
    activeName.value = Number(tab)
    queryForm.status = Number(tab)
  }
  await fetchOperationColumns()
  fetchData()
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

        // .vab-query-form {
        //   .left-panel {
        //     margin-bottom: 5px !important;
        //   }
        //   .el-form {
        //     .el-form-item:first-child {
        //       margin: 0 !important;

        //       .el-check-tag,
        //       .el-form-item__label {
        //         margin: 0 10px 5px 0;
        //         border-radius: 99px;
        //       }
        //     }
        //     .el-form-item:last-child {
        //       margin: 0 !important;
        //     }
        //   }
        // }

        .el-table {
          flex: 1;
          .clear-padding {
            padding-top: 0;
            padding-bottom: 0;
            .cell {
              padding-right: 0;
              padding-left: 0;
            }
          }
        }
      }
    }
  }
}

.noneHoveTable {
  :deep(.el-checkbox) {
    transform: scale(1.2);
    transform-origin: center;
  }
}
:deep(.red) {
  color: #f56c6c;
}
:deep(.green) {
  color: #67c23a;
}
.overflow-text {
  display: block;
  max-height: 65.2px;
  overflow-y: auto;
}
// 选中且不被禁用的样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

.after-sales-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 54px;
}

.after-sales-actions__archive {
  font-weight: 600;
}

.after-sales-actions__secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  white-space: nowrap;
}
</style>
