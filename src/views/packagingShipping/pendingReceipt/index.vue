<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="待签收" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="handleAllSigned">批量签收</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          ref="tableRef" 
          stripe border 
          v-loading="listLoading"
          :data="list"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          @cell-click="changeInput"
          @selection-change="setSelectRows"
          :cell-class-name="getCellClass"
        >
          <el-table-column fixed="left" label="仓库操作" width="150" >
            <template #default="{ row, $index }">
              <el-space>
                <el-link type="primary" :underline="false" @click="showSignDialog(row)">签收</el-link>
                <el-link type="primary" :underline="false" @click="handleGetSignRecord(row)">修改</el-link>
                <el-link type="primary" :underline="false" >打印</el-link>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column type="selection" fixed="left"></el-table-column>
          <el-table-column label="外发" prop="outsourced" min-width="60">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.outsourced" :true-value="1" :false-value="0" class="custom-checkbox" disabled />
              </template>
          </el-table-column>
          <el-table-column label="PO" min-width="100" prop="po"></el-table-column>
          <el-table-column label="零件图片" class="image-wall" width="82">
            <template #header>
              零件<br>图片
            </template>
            <template #default="{ row, $index }">
              <el-image :src="row.componentUrl" data-img="img" fit="contain" style="width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" min-width="250"></el-table-column>
          <el-table-column label="签收数量" min-width="100" prop="signCount" ></el-table-column>
          <el-table-column label="零件数量" min-width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" min-width="60" prop="unit" ></el-table-column>
          <el-table-column label="收货仓库" min-width="120" prop="repositoryName" ></el-table-column>
          <el-table-column label="PO日期" prop="poDate" min-width="115">
            <template #default="{ row }">
              {{ row.poDate ? row.poDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="付款日期" prop="payDate" min-width="115">
            <template #default="{ row }">
              {{ row.payDate ? row.payDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="82">
            <template #header>
              SKU<br>图片
            </template>
            <template #default="{ row, $index }">
              <el-image :src="row.skuImageUrl" data-img="img" fit="contain" style="width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="160"></el-table-column>    
          <el-table-column label="剩余可售" prop="sellableDay" min-width="100"></el-table-column>
          <el-table-column  label="供应商" min-width="250" prop="suppliserName"></el-table-column>
          <el-table-column label="站点" prop="site" min-width="130">
            <template #default="{ row }">
              {{ siteMap[row.site as siteValue] }}
            </template>
          </el-table-column>
          <el-table-column label="生产完成日期" prop="produceCompletionDate" min-width="170">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.produceCompletionDate"
                type="date"
                placeholder="请选择日期"
                size="large"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                @change="changeProductDate(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="跟单日志" prop="log" min-width="250">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.log) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.log) }}</span>
              </el-tooltip>
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
      <el-tab-pane label="已签收" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="handleShowReceiptExport">入库单导出</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table 
          ref="tableRef" 
          stripe border 
          v-loading="listLoading"
          :data="list"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle2"
          @cell-click="changeInput"
          :cell-class-name="getCellClass2"
        >
          <el-table-column fixed="left" label="操作" width="150" >
            <template #default="{ row, $index }">
              <el-dropdown>
                <el-button text type="primary" >
                  打印面单
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link type="primary" :underline="false" >打印面单</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleGetSignedRecord(row)">
                      <el-link type="primary" :underline="false" >修改</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleIfShowRecord(row)">
                      <el-link type="danger" :underline="false" >取消签收</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column label="签收日期" prop="signDate" min-width="115">
            <template #default="{ row }">
              {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="外发" prop="outsourced" min-width="60">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.outsourced" :true-value="1" :false-value="0" class="custom-checkbox" disabled />
              </template>
          </el-table-column>
          <el-table-column label="PO" min-width="100" prop="po"></el-table-column>
          <el-table-column label="零件图片" min-width="82">
            <template #header>
              零件<br>图片
            </template>
            <template #default="{ row, $index }">
                <el-image :src="row.componentUrl" fit="contain" data-img="img" style="width: 100%; height: 100%">
                  <template #error>
                    <el-icon></el-icon>
                  </template>
                </el-image>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" min-width="250"></el-table-column>
          <el-table-column label="零件数量" min-width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="单位" min-width="60" prop="unit" ></el-table-column>
          <el-table-column label="收货仓库" min-width="120" prop="repositoryName" ></el-table-column>
          <el-table-column label="签收物流单号" width="130" prop="signOrder" >
            <template #default="{ row }">
              <span class="overflow-text" v-html="row.signOrder"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO日期" prop="poDate" min-width="115">
            <template #default="{ row }">
              {{ row.poDate ? row.poDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="付款日期" prop="payDate" min-width="115">
            <template #default="{ row }">
              {{ row.payDate ? row.payDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="82">
            <template #header>
              SKU<br>图片
            </template>
            <template #default="{ row, $index }">
              <el-image :src="row.skuImageUrl" fit="contain" data-img="img" style="width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" min-width="160"></el-table-column>
          <el-table-column  label="供应商" min-width="250" prop="suppliserName"></el-table-column>
          <el-table-column label="站点" prop="site" min-width="100">
            <template #default="{ row }">
              {{ siteMap[row.site as siteValue] }}
            </template>
          </el-table-column>  
          <el-table-column label="生产完成日期" prop="produceCompletionDate" min-width="170">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.produceCompletionDate"
                type="date"
                placeholder="请选择日期"
                size="large"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                @change="changeProductDate(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="跟单日志" prop="log" min-width="250">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.log) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.log) }}</span>
              </el-tooltip>
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
    </el-tabs>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if ="imagePreviewVisible" hide-on-click-modal />
    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorLogVisible"
      :content="progressLogCopy"
      @clickChild="clickLog"
      @clickBoolean="clickLogBool"
      :classify="classify"
    >
    </wangEditor>
    <!-- 待签收修改 -->
    <vab-dialog
      title="修改"
      width="40%"
      v-model="modifyPendingVisible"
      @close="closeModifyPendingDialog"
    >
      <el-table
        border
        :data="pendingSignRecord"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="cellStyle3"
        @cell-click="changeModifyInput"
      >
        <el-table-column label="签收日期" prop="createTime">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="签收数量" prop="signCount">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.signCount" clearable @keyup.enter="clickModifyCountCancel($event, row)" @blur="clickModifyCountCancel($event, row)" />
            </div>
            <span>{{ row.signCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单号" prop="signOrder">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.signOrder" clearable @keyup.enter="clickModifyOrderCancel($event, row)" @blur="clickModifyOrderCancel($event, row)" />
            </div>
            <span>{{ row.signOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <el-button text type="danger" @click="handleDeleteSignRecord(row, $index)">删除并取消签收</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="closeModifyPendingDialog">取消</el-button>
        <el-button type="primary" @click="confirmModifyPending">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 已签收修改 -->
    <vab-dialog
      title="修改"
      width="40%"
      v-model="modifyVisible"
      @close="closeModifyDialog"
    >
      <el-table
        border
        :data="signedRecord"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="cellStyle4"
        @cell-click="changeModifyInput"
      >
        <el-table-column label="签收日期" prop="createTime">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="签收数量" prop="signCount"></el-table-column>
        <el-table-column label="单号" prop="signOrder">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.signOrder" clearable @keyup.enter="clickModifyOrderCancel($event, row)"  @blur="clickModifyOrderCancel($event, row)" />
            </div>
            <span>{{ row.signOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <el-button text type="danger" @click="handleDeleteSignedRecord(row, $index)">删除并取消签收</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="closeModifyDialog">取消</el-button>
        <el-button type="primary" @click="confirmModify">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 入库单导出 -->
    <vab-dialog
      title="入库单导出"
      width="25%"
      v-model="receiptExportVisible"
      @close="closeReceiptExport"
    >
      <el-form ref="receiptExportFormRef" :model="receiptExportForm">
        <el-form-item label="日期" label-width="70px" prop="date">
          <el-date-picker 
            v-model="receiptExportForm.date" 
            end-placeholder="结束日期" 
            range-separator="至" 
            start-placeholder="开始日期" 
            type="daterange" 
            format="YYYY-MM-DD" 
            :editable="false"	
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeReceiptExport">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 签收 -->
    <vab-dialog
      title="签收"
      v-model="signVisible"
      @close="closeSignDialog"
      width="20%"
    >
      <el-form ref="signFormRef" :model="signForm" label-position="right" label-width="auto" :rules="signRules">
        <el-form-item label="签收数量" prop="signCount">
          <el-input v-model="signForm.signCount" clearable />
        </el-form-item>
        <el-form-item label="签收物流单号" prop="signOrder">
          <el-input v-model="signForm.signOrder" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="confirmSign">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 批量签收 -->
    <vab-dialog
      title="批量签收"
      width="20%"
      v-model="signBatchVisible"
    >
      <el-form ref="signBatchFormRef" :model="signBatchForm" :rules="signBatchFormRules" label-position="top">
        <el-form-item label="签收物流单号" prop="signOrder">
          <el-input clearable v-model="signBatchForm.signOrder" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCancelSignBatch">取消</el-button>
        <el-button type="primary" @click="handleConfirmSignBatch">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, TableInstance, TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import { siteMap, siteValue } from '../constantOption'
import {
  deleteSign,
  deleteSignRecord,
  getSignList,
  getSignLog,
  getSignRecord,
  signBatch,
  signComponent,
  signMoreRecord,
  updateProductDate,
  updateRecordCount,
  updateRecordOrder,
  updateSignLog
} from '/@/api/devlocal/packagingShipping'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IGetSignList } from '/@/type/packagingShipping/packagingType'
import { IGetPlanPoListQuery } from '/@/type/purchase/po'
import { focusAndSelectInput, getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'
import { isEqual } from 'lodash'
import { removeHtmlTags } from '/@/utils/tableColum'

defineOptions({
  name: 'pendingReceiptTable',
})

const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)

const selectRows = ref<any>([])
const setSelectRows = (value: string) => {
  selectRows.value = value
}
const list = ref<IGetSignList[]>([])
const activeName = ref<number>(0)
const tableRef = ref<TableInstance>()
const listLoading = ref<boolean>(true)
// 批量签收可见
const signBatchVisible = ref<boolean>(false)
const signBatchForm = reactive<{ signOrder: string }>({
  signOrder: ''
})
const signBatchFormRef = ref<FormInstance>()
const signBatchFormRules = reactive<FormRules<{ signOrder: string }>>({
  signOrder: [{ required: true, message: '请输入签收物流单号', trigger: 'blur' }]
})
const handleCancelSignBatch = () => {
  signBatchFormRef.value?.resetFields()
  signBatchVisible.value = false
}
// 签收可见
const signVisible = ref<boolean>(false)
// 签收form
const signForm = reactive<any>({
  signCount: '',
  signOrder: ''
})
const signRules = reactive<any>({
  signOrder: [{ required: true, message: '请输入签收物流单号', trigger: 'blur' }]
})
const signFormRef = ref<FormInstance>()
const copyRow = ref<any>()
// 展示签收弹窗
const showSignDialog = (row: any) => {
  signVisible.value = true
  copyRow.value = row
}
// 关闭签收弹窗
const closeSignDialog = () => {
  signFormRef.value?.resetFields()
  signVisible.value = false
}
// 确认签收
const confirmSign = async () => {
  const { data } = await signComponent({
    signId: copyRow.value.signId,
    signCount: signForm.signCount,
    signOrder: signForm.signOrder
  })
  if (data) {
    $baseMessage('签收成功', 'success')
    closeSignDialog()
    fetchData()
  }
}
// 修改弹窗是否可见
const modifyVisible = ref<boolean>(false)
// 待签收弹窗是否可见
const modifyPendingVisible = ref<boolean>(false)
// 关闭修改弹窗
const closeModifyDialog = () => {
  modifyVisible.value = false
}
const confirmModify = () => {
  closeModifyDialog()
  fetchData()
}
// 关闭修改弹窗
const closeModifyPendingDialog = () => {
  modifyPendingVisible.value = false
}
const confirmModifyPending = () => {
  closeModifyPendingDialog()
  fetchData()
}
// 入库单导出表单
const receiptExportForm = reactive<any>({
  date: ''
})

const receiptExportFormRef = ref<FormInstance>()
// 入库单导出是否可见
const receiptExportVisible = ref<boolean>(false)
// 打开入库单导出弹窗
const handleShowReceiptExport = () => {
  receiptExportVisible.value = true
}
const closeReceiptExport = () => {
  receiptExportFormRef.value?.resetFields()
  receiptExportVisible.value = false
}
// 批量签收
const handleAllSigned = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }
  signBatchVisible.value = true
}
const handleConfirmSignBatch = async () => {
  const signIds = selectRows.value.map((item: any) => item.signId).join(',')
  const { data } = await signBatch({
    signIds: signIds,
    signOrder: signBatchForm.signOrder
  })
  if (data) {
    handleCancelSignBatch()
    $baseMessage('批量签收成功', 'success')
    fetchData()
  }
}

// 待签收表格
const pendingSignRecord = ref<any>([])
// 已签收表格
const signedRecord = ref<any>([])
// 查询签收记录
const handleGetSignRecord = async (row: any) => {
  modifyPendingVisible.value = true
  const { data } = await getSignRecord({
    signId: row.signId
  })
  if (data) {
    pendingSignRecord.value = data
  }
}
const handleGetSignedRecord = async (row: any) => {
  modifyVisible.value = true
  const { data } = await getSignRecord({
    signId: row.signId
  })
  if (data) {
    signedRecord.value = data
  }
}
const handleDeleteSignRecord = async (row: any, index: number) => {
  $baseConfirm('确定删除并取消签收吗', '系统提示', async () => {
    const { data } = await deleteSignRecord({
      signRecordId: row.id
    })
    if (data) {
      pendingSignRecord.value.splice(index, 1)
    }
  })
}
const handleDeleteSignedRecord = async (row: any, index: number) => {
  $baseConfirm('确定删除并取消签收吗', '系统提示', async () => {
    const { data } = await deleteSignRecord({
      signRecordId: row.id
    })
    if (data) {
      signedRecord.value.splice(index, 1)
    }
  })
}
const handleIfShowRecord = async (row: any) => {
  const { data } = await signMoreRecord({
    signId: row.signId
  })
  if (data === true) {
    handleGetSignedRecord(row)
  } else {
    const { data } = await deleteSign({
      signId: row.signId
    })
    if (data) {
      $baseMessage('取消签收成功', 'success')
    }
  }
}


// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IGetPlanPoListQuery>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 0, //0待签收 1签收
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const changeProductDate = async (row: any) => {
  await updateProductDate({
    signId: row.signId,
    date: row.produceCompletionDate
  })
  // console.log(row.produceCompletionDate);
  
}


// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const classify = ref<string>('')


// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
  
const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  Object.assign(list.value, [])
  if (tab.props.name !== undefined) {
    // activeName.value = tab.props.name;
    queryForm.status = Number(tab.props.name);  
  }
  queryData()
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex !== 5 && data.columnIndex !== 9 && data.columnIndex !== 13 && data.columnIndex !== 15) {
    return {
      textAlign:'center'
    } 
  }
}
const cellStyle2 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex !== 5 && data.columnIndex !== 9 && data.columnIndex !== 14 && data.columnIndex !== 17) {
    return {
      textAlign:'center'
    } 
  }
}
const cellStyle3 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  if (data.columnIndex === 0) {
    return {
      textAlign: 'center',
      color: '#bbb',
      cursor: 'not-allowed'
    }
  }
  return {
    textAlign: 'center'
  }
}
const cellStyle4 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  if (data.columnIndex === 0 || data.columnIndex === 1) {
    return {
      textAlign: 'center',
      color: '#bbb',
      cursor: 'not-allowed'
    }
  }
  return {
    textAlign: 'center'
  }
}
/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>() // 当点击零件采购注意事项时候的行
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  // console.log(column);
  if (column.property === 'log') {
    clickRow.value = row
    const { data } = await getSignLog({ signId: row.signId })
    progressLogCopy.value = data
    row.log = data
    wangEditorTitle.value = '编辑跟单日志'
    classify.value = 'signLog'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  } 
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el, 'img') && el) {
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }
}

let _row: any
/**
 * 当点击修改时切换输入框，修改输入
 */
const changeModifyInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  const firstChild = cell?.children[0]?.children[0];
  const secondChild = cell?.children[0]?.children[1];

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return;
  }

  _row = JSON.parse(JSON.stringify(row));

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none');
    secondChild.classList.add('none');

    focusAndSelectInput(cell);
  }
}
const clickModifyCountCancel = async (event: any, value: any) =>{
  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(_row, value)) {
    return
  }
  if (event.type === 'blur') {
    await updateRecordCount({
      signRecordId: value.id,
      count: value.signCount
    })
  }
}
const clickModifyOrderCancel = async (event: any, value: any) =>{
  const rootElement = getRootElement(event.srcElement, ".cell");

  if (rootElement) {
    const t1 = rootElement.children[0];
    const t2 = rootElement.children[1];

    if (t1) t1.classList.add("none");
    if (t2) t2.classList.remove("none");
  }
  if (isEqual(_row, value)) {
    return
  }
  if (event.type === 'blur') {
    await updateRecordOrder({
      signRecordId: value.id,
      order: value.signOrder
    })
  }
}

/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  const { data } = await updateSignLog({ signId: clickRow.value.signId, log: val})
  if (data === true) {
    progressLogCopy.value = val
    clickRow.value.log = val
  }
  
}
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = ( val: any) => {
  wangEditorLogVisible.value = val
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getSignList(queryForm)
  if (data) {
    list.value = data.list!
    total.value = data.total!
    list.value.forEach((item: any) => {
      if (item.signOrder) {
        item.signOrder = item.signOrder.replace(/,/g, '<br>');
      }
    })
  }
  listLoading.value = false
}
const getCellClass = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 4 || data.columnIndex === 12) {
    return 'clear-padding'
  }
  return ''
}
const getCellClass2 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 4 || data.columnIndex === 12) {
    return 'clear-padding'
  }
  return ''
}
onActivated(() => { 
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
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

        .vab-query-form {
          .left-panel {
            margin-bottom: 5px !important;
          }
          .el-form {
            .el-form-item:first-child {
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child {
              margin: 0 !important;
            }
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
            padding-left: 0px;
            padding-right: 0px;
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
// 控制编辑框显示与隐藏
.none {
  display: none;
}
.overflow-text {
  max-height: 65.2px;
  overflow-y: auto;
  display: block;
}
// /* 取消没有条纹的行的悬停背景色 */
// :deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
//   background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
// }

// /* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
// :deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
//   background-color: #fafafa !important; /* 保持原有条纹颜色 */
// }
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>