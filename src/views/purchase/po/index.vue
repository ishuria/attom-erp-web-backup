<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="待付款" name="0">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" >已付全款/尾款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" >生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
            <el-button type="primary" @click="handleDelPo">删除</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                @click="queryData"></el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
        </vab-query-form>

        <el-table 
          ref="tableRef" 
          border 
          :data="poList"
          :header-cell-style="{ 'text-align': 'center' }"
          class="noneHoveTable"
          :cell-style="cellStyle"
          @cell-click="changeInput"
          @selection-change="setSelectRow"
        >
          <el-table-column label="PO操作" prop="selectedRow1">
            <el-checkbox class="custom-checkbox"></el-checkbox>
          </el-table-column>
          <el-table-column label="PO" prop="po" min-width="100">
            <template #default="{ row }">
              <el-link type="primary" @click="handlePoDetail(row)">{{ row.po }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="userName"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="125"></el-table-column>
          <el-table-column label="SKU图片" class="image-wall" width="100">
            <template #default="{ row, $index }">
               <el-image :src="row.skuImageUrl" fit="fill" :lazy="true" data-img="img">
                <template #error>
                  <el-icon></el-icon>
                </template>
               </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" width="180"></el-table-column>   
          <el-table-column label="数量" width="60" prop="purchaseSkuNumber" >
          </el-table-column>
          <el-table-column label="零件操作" prop="selectedRow2" width="90">
            <el-checkbox class="custom-checkbox"></el-checkbox>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" width="250">
          </el-table-column>
          <el-table-column label="签收日期" prop="createTime" min-width="115"></el-table-column>
          <el-table-column label="零件数量" width="100" prop="purchaseCount" >
          </el-table-column>
          <el-table-column label="单位" width="60" prop="unit" >
          </el-table-column>
          <el-table-column label="含税运费" prop="taxIncludedPrice" min-width="90">
          </el-table-column>    
          <el-table-column label="模具含税" prop="taxIncludedPrice" min-width="90">
          </el-table-column>    
          <el-table-column label="含税总价" prop="taxIncludedPrice" min-width="90">
          </el-table-column>    
          <el-table-column label="已付金额" prop="payPrice" min-width="90">
          </el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
           
          </el-table-column>
          <el-table-column  label="付款记录" min-width="230" prop="records">
            <template #default="{ row }">
              <el-link type="primary" @click="handleShowPaymentHistory(row)" v-html="row.records"></el-link>
            </template>
          </el-table-column>
          <el-table-column  label="采购方" min-width="100" prop="purchaseId">
          </el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" min-width="75">
              <template #default = "{ row }">
                  <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" disabled/>
              </template>
          </el-table-column>
          <el-table-column label="签收物流单号" min-width="130" prop="purchaseId">
          </el-table-column>
          <el-table-column label="供应商" min-width="250" prop="suppliser">
          </el-table-column>
             
          <template #empty>
              <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
        </el-table>
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        /> 
        <default-table-edit ref="editRef" @fetch-data="fetchData" />
      </el-tab-pane>
      <el-tab-pane label="部分付款" name="1">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" >已付全款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" >生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
            <el-button type="primary" @click="handleDelPo">删除</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                @click="queryData"></el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
        </vab-query-form>

      </el-tab-pane>
      <el-tab-pane label="已付全款" name="2">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" >已付全款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" >生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
            <el-button type="primary" @click="handleDelPo">删除</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                @click="queryData"></el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
        </vab-query-form>
      </el-tab-pane>
      <el-tab-pane label="超额付款" name="3">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" >已付全款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" >生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
            <el-button type="primary" @click="handleDelPo">删除</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                @click="queryData"></el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
        </vab-query-form>
      </el-tab-pane>
      <el-tab-pane label="已完结" name="4">
        <vab-query-form>
          <vab-query-form-left-panel :span="16">
            <el-button type="success" >已付全款</el-button>
            <el-button type="warning" @click="handleShowInstallment">分批付款</el-button>
            <el-button type="danger" @click="handleShowRefund">退款</el-button>
            <el-button type="primary" @click="handleShowTotalPriceSharing">总价分摊</el-button>
            <el-button type="primary" >生成合同</el-button>
            <el-button type="primary" @click="handleShowMergeContract">聚合合同</el-button>
            <el-button type="primary" @click="handleShowGenerateMoneyTransfer">生成汇款模板</el-button>
            <el-button type="primary" @click="handleReduceCost">降本提成申请</el-button>
            <el-button type="primary" @click="handleShowAutomaticSignature">自动签收设定</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="8">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                @click="queryData"></el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
        </vab-query-form>
      </el-tab-pane>
      <el-tab-pane label="已删除" name="5">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
          <el-form inline :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="queryForm.keyWord" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary"
                @click="queryData"></el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
        </vab-query-form>
      </el-tab-pane>
    </el-tabs>
    <el-image-viewer @close="" :url-list="imagePriviewList" v-if ="dialogVisible"/>
    <!-- 付款记录表 -->
    <el-dialog 
      v-model="paymentHistoryVisible" 
      :close-on-click-modal="false" 
      title="付款记录" 
      width="35%"
      class="moldDialog"
      :before-close="handleClosePaymentHistoryDialog"
    >
      <el-divider style="margin-top: 0; margin-bottom: 20px"/>
      <div >
        <el-table 
          ref="tableRef" 
          stripe border 
          :data="fakePay"
          :header-cell-style="{ 'text-align': 'center' }"
          @cell-click="changePaymentHistoryInput"
          :cell-style="paymentHistoryCellStyle"
        >
          <el-table-column label="付款日期" min-width="120" prop="payTime">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.payTime" @keydown.enter="clickCancle($event, row)" @blur="clickCancle($event, row)"></el-input>
              </div>
              <span>{{ row.payTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="付款金额" min-width="130" prop="payPrice">
            <template #default="{ row }">
              <el-input v-model="row.payPrice" @blur="" class="input-center"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="付款百分比" min-width="130" prop="percentage" >
            <template #default="{ row }">
              {{ row.percentage }}%
            </template>
          </el-table-column>
          <el-table-column label="操作人" min-width="130" prop="payUserName">
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template #default="{ row }">
              <el-button text type="danger">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
      </div>
      <template #footer></template>
    </el-dialog>
    <!-- 分批付款 -->
    <el-dialog
      v-model="installmentVisible"
      :close-on-click-modal="false" 
      title="分批付款" 
      width="20%"
      class="moldDialog"
      :before-close="handleCloseInstallmentDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form label-position="top" label-width="auto" class="form-center">
        <el-form-item label="百分比">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseInstallmentDialog">关闭</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <!-- 退款 -->
    <el-dialog
      v-model="refundVisible"
      :close-on-click-modal="false" 
      title="退款" 
      width="30%"
      class="moldDialog"
      :before-close="handleCloseRefundDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form label-position="top" label-width="auto" class="form-center">
        <el-form-item label="百分比">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="凭证上传">
          <el-upload action="#" drag multiple class="upload-width">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖拽至此处或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseRefundDialog">关闭</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <!-- 总价分摊 -->
    <el-dialog
      v-model="totalPriceSharingVisible"
      :close-on-click-modal="false" 
      title="总价分摊" 
      width="20%"
      class="moldDialog"
      :before-close="handleCloseTotalPriceSharingDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form label-position="top" label-width="auto" class="form-center">
        <el-form-item label="总含税价">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="总含税运费">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseTotalPriceSharingDialog">关闭</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <!-- 聚合合同 -->
    <el-dialog
      v-model="mergeContractVisible"
      :close-on-click-modal="false" 
      title="聚合合同-请上传需要聚合的合同" 
      width="30%"
      class="moldDialog"
      :before-close="handleCloseMergeContractDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form class="form-center">
        <el-form-item >
          <el-upload action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" v-model:file-list="contractList" 
          drag multiple class="upload-width" :show-file-list="true" :auto-upload="false">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖拽至此处或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseMergeContractDialog">关闭</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <!-- 生成汇款模板 -->
    <el-dialog
      v-model="generateMoneyTransferVisible"
      :close-on-click-modal="false" 
      title="生成汇款模板" 
      width="35%"
      class="moldDialog"
      :before-close="handleCloseGenerateMoneyTransferDialog"
    >
      <el-divider class="divider-margin"/>
      <el-form label-position="top" label-width="auto" class="form-center">
        <el-form-item label="日期">
          <el-date-picker 
            v-model="generateMoneyTransferTime" 
            end-placeholder="结束日期" 
            range-separator="至" 
            start-placeholder="开始日期" 
            type="datetimerange" 
            time-format="HH:mm" 
            format="YYYY-MM-DD HH:mm" 
            :editable="false"	
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseGenerateMoneyTransferDialog">关闭</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <!-- 自动签收设定 -->
    <vab-automatic-signature
      :automaticSignatureVisible="automaticSignatureVisible"
      @update:automatic-signature-visible="handleCloseAutomaticSignature"
    />
  </div>
</template>

<script lang="ts" setup>
import { Search, UploadFilled } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IProgress } from '/@/type/progress/progressType'
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { getPoList } from '~/src/api/devlocal/purchasePo'
//   import wangEditor from './wangEditor.vue'



defineOptions({
  name: 'poTable',
})

const router = useRouter()

const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const contractList = ref<any>([])

const activeName = ref("0")

const tableRef = ref<TableInstance>()
const poList = ref<any>([])
// 第一个选中的行
const selectedRow1 = ref<any>([])
// 第二个选中的行
const selectedRow2 = ref<any>([])
// 表格加载loading状态
const listLoading = ref<boolean>(true)
// 新品进度列表
let progressList = ref<IProgress[]>([])
// 勾选行的数组
const selectRow = ref<any>([])
// 付款进度显示与否
const paymentHistoryVisible = ref<boolean>(false)
// 分批付款显示与否
const installmentVisible = ref<boolean>(false)
// 退款显示与否
const refundVisible = ref<boolean>(false)
// 总价分摊显示与否
const totalPriceSharingVisible = ref<boolean>(false)
// 聚合合同显示与否
const mergeContractVisible = ref<boolean>(false)
// 生成汇款模板显示与否
const generateMoneyTransferVisible = ref<boolean>(false)
// 生成汇款日期时间
const generateMoneyTransferTime = ref<string>('')
// 自动签收显示与否
const automaticSignatureVisible = ref<boolean>(false)
// 付款进度传的row
const payHistoryRow = ref<any>()
// 关闭付款进度弹窗
const handleClosePaymentHistoryDialog = () => {
  paymentHistoryVisible.value = false
  payHistoryRow.value.records = fakePay
    .map((item: any) => {
      const payAmount = item.payPrice - item.payPrice * (parseInt(item.percentage) / 100); // 计算乘法
      return `${item.payTime.split(' ')[0]}: ${item.percentage}%(${payAmount})`;
    })
    .join('<br>');
}
// 展示付款进度弹窗
const handleShowPaymentHistory = (row: any) => {
  paymentHistoryVisible.value = true
  payHistoryRow.value = row
}
// 展示分批付款弹窗
const handleShowInstallment = () => {
  installmentVisible.value = true
}
// 关闭分批付款弹窗
const handleCloseInstallmentDialog = () => {
  installmentVisible.value = false
}
// 展示退款弹窗
const handleShowRefund = () => {
  refundVisible.value = true
}
// 关闭退款弹窗
const handleCloseRefundDialog = () => {
  refundVisible.value = false
}
// 展示总价分摊弹窗
const handleShowTotalPriceSharing = () => {
  totalPriceSharingVisible.value = true
}
// 关闭总价分摊弹窗
const handleCloseTotalPriceSharingDialog = () => {
  totalPriceSharingVisible.value = false
}
// 展示聚合合同弹窗
const handleShowMergeContract = () => {
  mergeContractVisible.value = true
}
// 关闭聚合合同弹窗
const handleCloseMergeContractDialog = () => {
  mergeContractVisible.value = false
}
// 展示生成汇款模板弹窗
const handleShowGenerateMoneyTransfer = () => {
  generateMoneyTransferVisible.value = true
  generateMoneyTransferTime.value = ''
}
// 关闭生成汇款模板弹窗
const handleCloseGenerateMoneyTransferDialog = () => {
  generateMoneyTransferVisible.value = false
}
// 选中行变化
const setSelectRow = (value: any) => {
  selectRow.value = value
}
// 降本提成申请PO
const handleReduceCost = () => {
  if (selectRow.value.length === 0) {
    $baseMessage('请选择需要提交降本提成申请的PO', 'warning', 'hey')
  }
}
// 打开自动签收设定弹窗
const handleShowAutomaticSignature = () => {
  automaticSignatureVisible.value = true
}
// 关闭自动签收设定弹窗
const handleCloseAutomaticSignature = (value: boolean) => {
  automaticSignatureVisible.value = value
}
// 删除
const handleDelPo = () => {
  $baseConfirm('确定要删除该条PO吗? ', "系统提示", async () => {
     
       
    $baseMessage("删除操作失败，请重试。", "error", "hey");
          
  });
}
// 跳转po详情
const handlePoDetail = (row: any) => {
  router.push({
    path: '/purchase/poDetail',
    query: {
      title: "采购订单详情",
      from: row.po,
      timestamp: Date.now(),
    },
  })
}
/**
 * 分页
 */
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 2, //2待付款 3部分付款 4已付全款 5超额付款 6已完结 7已删除
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
// 采购计划col合并方法
// const objectSpanMethod = ({
//   row,
//   column,
//   rowIndex,
//   columnIndex,
// }: any) => {
//   // 设置需要合并的列
//   if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3
//     || columnIndex === 4 || columnIndex === 5 || columnIndex === 6
//   ) {
//     // 获取当前row的id
//     const reviewMainId = row.reviewMainId;
//     // 默认不跨行
//     let rowspan = 1;
//     // 遍历后端返回的数据
//     for (let i = rowIndex + 1; i < dataList.value.length!; i++) {
//       // 如果id一样需要合并
//       if (dataList.value[i].reviewMainId === reviewMainId) {
//         rowspan++;
//       } else {
//         break;
//       }
//     }

//     // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
//     if (rowIndex === 0 || dataList.value[rowIndex - 1].reviewMainId !== reviewMainId) {
//       return { rowspan, colspan: 1 };
//     } else {
//       return { rowspan: 0, colspan: 0 };
//     }
//   }
// }

const fakePay = [
  {
    payTime: '2024-08-01',
    money: '200',
    payPercent: '30',
    person: '胡东丽',
  },
  {
    payTime: '2024-08-05',
    money: '200',
    payPercent: '20',
    person: '胡东丽',
  },
]


// 图片
const dialogImageUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)

const imagePriviewList = ref<string[]>([])

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
// 点击备注弹出富文本框是否显示
const wangEditorRemarkVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const remarkCopy = ref<string | undefined>('')
const classify = ref<string>('')
const tableClickIdx = ref<any>(0)


const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  progressList.value=[]
  if (tab.props.name === '0')  queryForm.status = 0
  else queryForm.status = 1

  // fetchData()
}
//   // 处理已归档
//   const handleArchived = async (progressId: number) => {
//     const { data } = await updateProgressArchive({ progressId })
//     if (data === true) {
//       const index = progressList.value.findIndex((item: any) => item.progressId === progressId)
//       progressList.value.splice(index, 1)
//       $baseMessage("此条新品进度信息已归档成功!","success","hey")
//     }
  
//     // activeName.value = "1"
//   }



// 修改图片预览列表
const setPreviewList = (imageUrl:string) =>{
    dialogVisible.value = true
    imagePriviewList.value = []
    imagePriviewList.value.push(imageUrl)
    // console.log(imagePriviewList.value)
}

const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if(data.columnIndex !== 6 && data.columnIndex !== 9 && data.columnIndex !== 22)
    return {
      textAlign:'center'
    } 
}
const paymentHistoryCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  if (data.columnIndex === 2 || data.columnIndex === 3) {
    return {
      color: '#bbb',
      cursor: 'not-allowed',
      textAlign: 'center'
    }
  } else {
    return {
      textAlign: 'center'
    }
  }
}





/**
 * 当点击时切换输入框，修改输入
 */
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 

  // 获取行的下标
  tableClickIdx.value = progressList.value.indexOf(row)
  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
    return
  }
  // console.log(cell.children[0].children[0])
  // console.log(cell.children[0].children[1])
  // console.log(cell.children[0].children[2])

  // if (column.property == 'progressLog') {
  // //   const { data } = await getProgressLog({ progressId: row.progressId })
  //   // progressLogCopy.value = progressList.value[tableClickIdx.value].progressLog
  //   progressLogCopy.value = data
  //   wangEditorTitle.value = '编辑开发日志'
  //   classify.value = 'progressLog'
  //   wangEditorLogVisible.value = !wangEditorLogVisible.value
  // } else if (column.property == 'remark'){
  //   remarkCopy.value = progressList.value[tableClickIdx.value].remark
  //   wangEditorTitle.value = '编辑备注'
  //   classify.value = 'remark'
  //   wangEditorRemarkVisible.value = !wangEditorRemarkVisible.value
  // } else {
  //   cell.children[0].children[0].classList.remove('none')
  //   cell.children[0].children[1].classList.add('none')
  // }

  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
      inputElement.focus()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
    }
  }
}
const changePaymentHistoryInput = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
    return
  }
  cell.children[0].children[0].classList.remove('none')
  cell.children[0].children[1].classList.add('none')
  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
      inputElement.focus()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
    }
  }
}
/**
 * 输入失焦事件
 */
const clickCancle = async (event: any, value: any) =>{

  const t1 = getRootElement(event["srcElement"],".cell").children[0]

  if (t1){
    if (t1.classList[0] !== "el-select") {
      t1.classList.add("none")
    }
  }

  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  // await updateProgressManage({...value})
}

/**
 * 当点击确认时，子组件传递给父组件的新的val
 */
const clickLog = async (val: any) => {
  // console.log('新的val', val);
  
  progressList.value[tableClickIdx.value].progressLog = val
  progressLogCopy.value = val
  // console.log('点击log执行了');
  // await updateProgressManage(progressList.value[tableClickIdx.value]) //发送更新数据请求
}
const clickRemark = async (val: any) => {
  progressList.value[tableClickIdx.value].remark = val
  remarkCopy.value = val
  // console.log('点击remark执行了');
  // await updateProgressManage(progressList.value[tableClickIdx.value]) //发送更新数据请求
}
// 去掉 HTML 标签并显示纯文本的方法
const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = ( val: any) => {
  wangEditorLogVisible.value = val
  // console.log('点击logbool执行了');
}
const clickRemarkBool = ( val: any) => {
  wangEditorRemarkVisible.value = val
  // console.log('点击remarkbool执行了');
}



const fetchData = async () => {
  try {
    const { data } = await getPoList(queryForm)
    if (data) {
      total.value = data.total
      poList.value = data.list
    }
  } catch (error) {
    console.error(error)
  }
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
        }
      }
    }
  }
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 75px;
  height: 75px;
  transition: none;
}
:deep(.el-upload--picture-card) {
  width: 75px;
  height: 75px;
}
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}


// 控制添加图片图标显示与隐藏
.hide :deep(.el-upload--picture-card) {
  display: none
}
// 控制编辑框显示与隐藏
.none {
  display: none;
}
.custom-checkbox {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}

// 开模申请
:deep(.moldDialog .el-dialog__body) { 
  padding-top: 0;
}
   

// input框内容居中
.input-center {
  text-align: center;
  text-align-last: center;
}
// 分批付款表单左右margin
.form-center {
  margin: 0 20px;
}

// 分隔线margin
.divider-margin {
  margin-top: 0; 
  margin-bottom: 20px;
}
.upload-width {
  width: 100%;
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
</style>

