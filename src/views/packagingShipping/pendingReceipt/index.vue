<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" :lazy="true" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待签收" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
              <el-button v-permissions="{ permission: [SignPermission.SIGN_BATCH] }" type="primary" @click="handleAllSigned">批量签收</el-button>
              <el-select  v-model="printer" v-permissions="{ permission: [SignPermission.SIGN_BATCH] }" clearable placeholder="请选择打印机" style="margin: 0 10px calc(var(--el-margin) / 2) 0" @change="handleChangePrinter">
                <el-option
                  v-for="item in printerOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="debouncedQueryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableRef"
          v-loading="listLoading" border
          :cell-class-name="getCellClass"
          :cell-style="cellStyle"
          class="noneHoveTable"
          :data="list"
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
          @cell-click="changeInput"
          @selection-change="setSelectRows"
        >
          <el-table-column v-permissions="SignPermission.signOperationColume()"fixed="left" label="仓库操作" width="150"  >
            <template #default="{ row }">
              <el-space>
                <el-link v-permissions="{ permission: [SignPermission.SIGN_COMPONENT] }" type="primary" underline="never" @click="showSignDialog(row)">签收</el-link>
                <el-link v-permissions="{ permission: [SignPermission.SIGN_RECORD_LIST] }" type="primary" underline="never" @click="handleGetSignRecord(row)">明细</el-link>
                <el-link v-permissions="{ permission: [SignPermission.SIGN_PRINT] }" type="primary" underline="never" @click="showPrint(row)">打印</el-link>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column fixed="left" type="selection"/>
          <el-table-column label="外发" min-width="60" prop="outsourced">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.outsourced" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
              </template>
          </el-table-column>
          <el-table-column label="PO" min-width="120" prop="po">
            <template #default="{ row }">
              <span class="copySku" @click="handleClipboard($event, row.po)" >
                {{ row.po }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column class="image-wall" label="零件图片" width="82">
            <template #header>
              零件<br>图片
            </template>
            <template #default="{ row }">
              <el-image fit="fill" :src="row.componentUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.componentUrl)">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(list, '零件名', 'componentName')"/>
          <el-table-column label="签收数量" min-width="100" prop="signCount" />
          <el-table-column label="零件数量" min-width="100" prop="purchaseCount" />
          <el-table-column label="单位" min-width="60" prop="unit" />
          <el-table-column label="收货仓库" min-width="120" prop="repositoryName" />
          <el-table-column label="PO日期" min-width="115" prop="poDate">
            <template #default="{ row }">
              {{ row.poDate ? row.poDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="付款日期" min-width="115" prop="payDate">
            <template #default="{ row }">
              {{ row.payDate ? row.payDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column class="image-wall" label="SKU图片" width="82">
            <template #header>
              SKU<br>图片
            </template>
            <template #default="{ row }">
              <el-image fit="fill" :src="row.skuImageUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku', 50)">
            <template #default="{ row }">
              <span class="copySku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="剩余可售" min-width="100" prop="sellableDay"/>
          <el-table-column  label="供应商" prop="suppliserName" :width="flexColumnWidth(list, '供应商', 'suppliserName')"/>
          <el-table-column label="站点" min-width="130" prop="site">
            <template #default="{ row }">
              {{ siteMap[row.site as siteValue] }}
            </template>
          </el-table-column>
          <el-table-column label="生产完成日期" min-width="170" prop="produceCompletionDate">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.produceCompletionDate"
                placeholder="请选择日期"
                size="large"
                style="width: 100%"
                type="date"
                value-format="YYYY-MM-DD"
                @change="changeProductDate(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="跟单日志" min-width="250" prop="log">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.log) }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.log) }}</el-text>
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
              <el-select v-model="printer" clearable placeholder="请选择打印机" style="margin: 0 10px calc(var(--el-margin) / 2) 0" @change="handleChangePrinter">
                <el-option
                  v-for="item in printerOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="debouncedQueryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          ref="tableRef"
          v-loading="listLoading" border
          :cell-class-name="getCellClass2"
          :cell-style="cellStyle2"
          class="noneHoveTable"
          :data="list"
          :header-cell-style="{ 'text-align': 'center' }"
          stripe
          @cell-click="changeInput"
        >
          <el-table-column v-permissions="SignPermission.signArchiveOperationColume()" fixed="left" label="操作" width="150" >
            <template #default="{ row }">
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
                      <el-link type="primary" underline="never" >打印面单</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item v-permissions="{ permission: [SignPermission.SIGN_RECORD_LIST] }" @click="handleGetSignedRecord(row)">
                      <el-link type="primary" underline="never" >修改</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item v-permissions="{ permission: [SignPermission.SIGN_DELETE]}" @click="handleIfShowRecord(row)">
                      <el-link type="danger" underline="never" >取消签收</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column label="签收人" min-width="90" prop="signName"/>
          <el-table-column label="签收日期" min-width="115" prop="signDate">
            <template #default="{ row }">
              {{ row.signDate ? row.signDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="外发" min-width="60" prop="outsourced">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.outsourced" class="custom-checkbox" disabled :false-value="0" :true-value="1" />
              </template>
          </el-table-column>
          <el-table-column label="PO" min-width="120" prop="po">
            <template #default="{ row }">
              <span class="copySku" @click="handleClipboard($event, row.po)" >
                {{ row.po }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="零件图片" min-width="82">
            <template #header>
              零件<br>图片
            </template>
            <template #default="{ row }">
                <el-image fit="fill" :src="row.componentUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.componentUrl)">
                  <template #error>
                    <el-icon/>
                  </template>
                </el-image>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(list, '零件名', 'componentName')"/>
          <el-table-column label="零件数量" min-width="100" prop="purchaseCount" />
          <el-table-column label="单位" min-width="60" prop="unit" />
          <el-table-column label="收货仓库" min-width="120" prop="repositoryName" />
          <el-table-column label="签收物流单号" prop="signOrder" :width="flexColumnWidth(list, '签收物流单号', 'signOrder')" >
            <template #default="{ row }">
              <span class="overflow-text" v-html="row.signOrder"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO日期" min-width="115" prop="poDate">
            <template #default="{ row }">
              {{ row.poDate ? row.poDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column label="付款日期" min-width="115" prop="payDate">
            <template #default="{ row }">
              {{ row.payDate ? row.payDate.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column class="image-wall" label="SKU图片" width="82">
            <template #header>
              SKU<br>图片
            </template>
            <template #default="{ row }">
              <el-image fit="fill" :src="row.skuImageUrl" style="width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku', 50)">
            <template #default="{ row }">
              <span class="copySku" @click="handleClipboard($event, row.sku)" >
                {{ row.sku }}
                <vab-icon icon="file-copy-2-fill" />
              </span>
            </template>
          </el-table-column>
          <el-table-column  label="供应商" prop="suppliserName" :width="flexColumnWidth(list, '供应商', 'suppliserName')"/>
          <el-table-column label="站点" min-width="130" prop="site">
            <template #default="{ row }">
              {{ siteMap[row.site as siteValue] }}
            </template>
          </el-table-column>
          <el-table-column label="生产完成日期" min-width="170" prop="produceCompletionDate">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.produceCompletionDate"
                placeholder="请选择日期"
                size="large"
                style="width: 100%"
                type="date"
                value-format="YYYY-MM-DD"
                @change="changeProductDate(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="跟单日志" min-width="250" prop="log">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.log) }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ removeHtmlTags(row.log) }}</el-text>
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
    <el-image-viewer v-if ="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <wang-editor
      :classify="classify"
      :content="progressLogCopy"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorLogVisible"
      @click-boolean="clickLogBool"
      @click-child="clickLog"
    />
    <!-- 待签收修改 -->
    <vab-dialog
      v-model="modifyPendingVisible"
      :draggable="false"
      title="修改"
      width="40%"
      @close="closeModifyPendingDialog"
    >
      <el-table
        border
        :cell-style="cellStyle3"
        :data="pendingSignRecord"
        :header-cell-style="{ textAlign: 'center' }"
        @cell-click="changeModifyInput"
      >
        <el-table-column label="签收日期" prop="createTime"/>
        <el-table-column label="签收数量" prop="signCount"/>
        <el-table-column label="单号" prop="signOrder">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.signOrder" clearable @blur="clickModifyOrderCancel($event, row)" @keyup.enter="clickModifyOrderCancel($event, row)" />
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
      v-model="modifyVisible"
      title="修改"
      width="40%"
      @close="closeModifyDialog"
    >
      <el-table
        border
        :cell-style="cellStyle4"
        :data="signedRecord"
        :header-cell-style="{ textAlign: 'center' }"
        @cell-click="changeModifyInput"
      >
        <el-table-column label="签收日期" prop="createTime">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="签收数量" prop="signCount"/>
        <el-table-column label="单号" prop="signOrder">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.signOrder" clearable @blur="clickModifyOrderCancel($event, row)"  @keyup.enter="clickModifyOrderCancel($event, row)" />
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
      v-model="receiptExportVisible"
      title="入库单导出"
      width="25%"
      @close="closeReceiptExport"
    >
      <el-form ref="receiptExportFormRef" :model="receiptExportForm">
        <el-form-item label="日期" label-width="70px" prop="date">
          <el-date-picker
            v-model="receiptExportForm.date"
            :editable="false"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
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
      v-model="signVisible"
      title="签收"
      width="20%"
      @close="closeSignDialog"
    >
      <el-form ref="signFormRef" label-position="right" label-width="auto" :model="signForm" :rules="signRules">
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
      v-model="signBatchVisible"
      title="批量签收"
      width="20%"
    >
      <el-form ref="signBatchFormRef" label-position="top" :model="signBatchForm" :rules="signBatchFormRules">
        <el-form-item label="签收物流单号" prop="signOrder">
          <el-input v-model="signBatchForm.signOrder" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCancelSignBatch">取消</el-button>
        <el-button type="primary" @click="handleConfirmSignBatch">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 打印 -->
    <vab-dialog
      v-model="printCountVisible"
      title="打印数量"
      width="20%"
    >
      <el-form ref="printFormRef" :model="printForm" :rules="printFormRules" style="margin: 0;" >
        <el-form-item label="数量" prop="count">
          <el-input v-model="printForm.count" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary" @click="handleConfirmPrint">打印</el-button>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, TableInstance, TabsPaneContext } from 'element-plus'
import { debounce, isEqual } from 'lodash-es'
import { CSSProperties, ref } from 'vue'
import handleClipboard from '~/src/utils/clipboard'
import type { siteValue } from '../constantOption'
import { printerOption, siteMap } from '../constantOption'
import { getEncasementUserPrinter, updateEncasementUserPrinter } from '/@/api/devlocal/encasement'
import {
  deleteSign,
  deleteSignRecord,
  getSignList,
  getSignLog,
  getSignRecord,
  printSign,
  signBatch,
  signComponent,
  signMoreRecord,
  updateProductDate,
  updateRecordOrder,
  updateSignLog
} from '/@/api/devlocal/packagingShipping'
import SignPermission from '/@/permissions/sign'
import type { IGetSignList } from '/@/type/packagingShipping/packagingType'
import type { IGetPlanPoListQuery } from '/@/type/purchase/po'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'

defineOptions({
  name: 'PendingReceipt',
})

const printer = ref<string>('')
const activeName = ref<number>(0)
const printCountVisible = ref<boolean>(false)
const printForm = reactive<{ count: number | undefined }>({
  count: undefined
})
const printFormRef = ref<FormInstance>()
const printFormRules = reactive<FormRules>({
  count: [{ required: true, message: '请输入打印数量', trigger: 'blur' }]
})
const _id = ref<number>(0)

const selectRows = ref<any>([])
const setSelectRows = (value: string) => {
  selectRows.value = value
}
const list = ref<IGetSignList[]>([])
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
// 获取默认打印机
const fetchDefaultPrinter = async () => {
  const { data } = await getEncasementUserPrinter()
  printer.value = data
}
const handleChangePrinter = async () => {
  try {
    await updateEncasementUserPrinter({ printer: printer.value })
  } catch (error) {
    $baseMessage(error, 'error')
  }
}
const handleConfirmPrint = async () => {
  printFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await printSign({
        signId: _id.value,
        quantity: printForm.count!
      })
      if (data) {

        // const { data: res } = await printSignSuccess(
        //   JSON.stringify(data)
        // )
        // if (res.errorId === "0") {
          $baseMessage('打印成功!', 'success')
          printCountVisible.value = false
        // } else {
        //   $baseMessage('打印失败!', 'error')
        // }
      } else {
        $baseMessage('打印失败!', 'error')
      }
    }
  })
}
const showPrint = (row: any) => {
  _id.value = row.signId
  printFormRef.value?.resetFields()
  printCountVisible.value = true
}
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
  // 默认初始化签收数量为零件采购数量
  signForm.signCount = Number(row.purchaseCount - row.signCount)
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
    signIds,
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
      $baseMessage('删除取消零件签收成功！','success')
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
      $baseMessage('删除取消零件签收成功！','success')
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
      fetchData()
    }
  }
}

const router = useRouter()
const route = useRoute()
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
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize
    }
  })
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize
    }
  })
  fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize
    }
  })
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

const handleTabClick = async (tab: TabsPaneContext) => {
  list.value = []
  if (tab.props.name !== undefined) {
    const tabName = Number(tab.props.name)
    activeName.value = tabName
    queryForm.status = tabName
  }

  await router.push({
    query: {
      ...route.query,
      tab: queryForm.status,
      pageNo: 1,
      pageSize: 20
    }
  })
  await fetchData()
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex !== 5 && data.columnIndex !== 9 && data.columnIndex !== 13 && data.columnIndex !== 15) {
    return {
      textAlign:'center'
    }
  }
}
const cellStyle2 = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (['零件名', '收货仓库', '签收物流单号', 'SKU', '供应商', '跟单日志'].includes(label)) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
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
const changeInput = async (row: any, column: any) => {
  if (column.property === 'log') {
    clickRow.value = row
    const { data } = await getSignLog({ signId: row.signId })
    progressLogCopy.value = data
    row.log = data
    wangEditorTitle.value = '编辑跟单日志'
    classify.value = 'signLog'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  }
}
const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
let _row: any
/**
 * 当点击修改时切换输入框，修改输入
 */
const changeModifyInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
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
    try {
      await updateRecordOrder({
        signRecordId: value.id,
        order: value.signOrder
      })
    } catch {
      Object.assign(value, _row)
    }
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
// 防抖处理
const debouncedQueryData = debounce(() => {
  queryData()
}, 700)
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getSignList(queryForm)
  if (data) {
    list.value = data.list!
    total.value = data.total!
    list.value.forEach((item: any) => {
      if (item.signOrder) {
        item.signOrder = item.signOrder.replaceAll(',', '<br>');
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
  if (data.column.label === '零件图片' || data.column.label === 'SKU图片') {
    return 'clear-padding'
  }
  return ''
}
onActivated(() => {
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
  fetchDefaultPrinter()
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
// 控制编辑框显示与隐藏
.none {
  display: none;
}
.overflow-text {
  display: block;
  max-height: 65.2px;
  overflow-y: auto;
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
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
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

.copySku {
  cursor: pointer;
  -webkit-user-select: text;
  user-select: text;
  transition: all 0.3s;
  &:hover {
    color: #000;
  }
}
</style>
