<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button
          v-permissions="{ permission: [FreightForwarderPermission.FREIGHT_FORWARDER_CHANNEL_ADD] }"
          type="primary"
          @click="handleShowAddChannel"
        >
          新增渠道
        </el-button>
        <el-button
          v-permissions="{ permission: [FreightForwarderPermission.FREIGHT_FORWARDER_ADD] }"
          type="primary"
          @click="addForwarderVisible = true"
        >
          新增货代
        </el-button>
        <el-button
          v-permissions="{ permission: [FreightForwarderPermission.FREIGHT_FORWARDER_LIST] }"
          type="primary"
          @click="showForwarderList"
        >
          货代清单
        </el-button>
        <el-button
          v-permissions="{ permission: [FreightForwarderPermission.FREIGHT_FORWARDER_COST_NAME_SETTING] }"
          type="primary"
          @click="showFeeNameSetting"
        >
          货代费用名设定
        </el-button>
        <el-button
          v-permissions="{ permission: [FreightForwarderPermission.FREIGHT_FORWARDER_CHANNEL_SITE_SETTING] }"
          type="primary"
          @click="showChannelSite"
        >
          站点渠道设定
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
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
      border
      class="noneHoveTable custom-table-hover"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="tableRowClassName"
      stripe
      @row-click="handleRowClick"
    >
      <el-table-column align="left" label="渠道全名" prop="fullName" :width="flexColumnWidth(list, '渠道全名', 'fullName', 30)" />
      <el-table-column align="center" label="当前价格(kg)" prop="kgPrice" />
      <el-table-column align="center" label="当前价格(m3)" prop="m3Price" />
      <el-table-column align="center" label="近10次时效" prop="tenCountTime" />
      <el-table-column align="center" label="名义时效" prop="nominalLimitation" />
      <el-table-column align="center" label="累计发货次数" prop="cumulativeCount" />
      <el-table-column align="center" label="成本核算展示" prop="dropdownListDisplay">
        <template #default="{ row }">
          <el-checkbox v-model="row.dropdownListDisplay" :false-value="0" :true-value="1" @change="updateDropdownListDisplay(row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="安全天数" prop="safeDays">
        <template #default="{ row }">
          <el-input v-model="row.safeDays" class="input-center" @change="modifySafeDays(row)" />
        </template>
      </el-table-column>
      <el-table-column
        v-permissions="{ permission: FreightForwarderPermission.operationColume() }"
        align="center"
        fixed="right"
        label="操作"
        width="360"
      >
        <template #default="{ row }">
          <el-link
            v-permissions="{ permission: [FreightForwarderPermission.FREIGHT_FORWARDER_CHANNEL_UPDATE] }"
            type="primary"
            underline="never"
            @click="showModify(row)"
          >
            修改
          </el-link>
          <span style="margin: 0 5px"></span>
          <el-link
            v-permissions="{ permission: [FreightForwarderPermission.FREIGHT_FORWARDER_CHANNEL_COPY] }"
            type="primary"
            underline="never"
            @click="showCopy(row)"
          >
            复制
          </el-link>
          <span style="margin: 0 5px"></span>
          <el-link type="primary" underline="never">价格趋势</el-link>
          <span style="margin: 0 5px"></span>
          <el-link type="primary" underline="never">时效趋势</el-link>
          <span style="margin: 0 5px"></span>
          <el-link
            v-permissions="{ permission: [FreightForwarderPermission.FREIGHT_FORWARDER_CHANNEL_SAFE_DAYS_CALCULATE] }"
            type="primary"
            underline="never"
            @click="calculateSafeDays(row)"
          >
            安全天数计算
          </el-link>
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
    <!-- 货代费用名设定 -->
    <vab-dialog v-model="feeNameSettingVisible" class="dialog" title="货代费用名设定" top="3%" width="40%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <span style="margin-right: 8px; font-size: var(--el-font-size-base)">货代简称</span>
          <el-select v-model="selectId" @change="fetchFeeNameSetting">
            <el-option v-for="item in selectList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <el-button type="primary" @click="handleAddNewFee">新增费用</el-button>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        border
        :cell-style="feeNameSettingCellStyle"
        class="feeNameSettingTable"
        :data="feeNameSettingData"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
        style="max-height: 70vh; overflow: auto"
        @cell-click="changeInputFeeSetting"
      >
        <el-table-column label="我们的费用名" min-width="180" prop="costName">
          <template #default="{ row }">
            <div v-if="row.status === 1" class="none">
              <el-input v-model="row.costName" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.costName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算对象" min-width="130">
          <template #default="{ row }">
            <el-select v-model="row.settlementObject" @change="modifyFeeNameSetting(row)">
              <el-option v-for="item in settlementObjectList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="货代账单费用名" min-width="180" prop="billCostName">
          <template #default="{ row }">
            <div class="none">
              <el-input v-model="row.billCostName" @blur="clickCancel($event, row)" @keypress.enter="clickCancel($event, row)" />
            </div>
            <span>{{ row.billCostName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="币种" min-width="180" prop="crurency">
          <template #default="{ row }">
            <el-select v-model="row.currency" @change="modifyFeeNameSetting(row)">
              <el-option v-for="item in currencyList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="合并报关后可合并" min-width="100" prop="bgStatus">
          <template #header>
            合并报关
            <br />
            后可合并
          </template>
          <template #default="{ row }">
            <el-checkbox v-model="row.bgStatus" :false-value="0" :true-value="1" @change="modifyFeeNameSettingBg(row)" />
          </template>
        </el-table-column>
        <el-table-column label="合并清关后可合并" min-width="100" prop="qgStatus">
          <template #header>
            合并清关
            <br />
            后可合并
          </template>
          <template #default="{ row }">
            <el-checkbox v-model="row.qgStatus" :false-value="0" :true-value="1" @change="modifyFeeNameSetting(row)" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="运费核对默认展示" min-width="100" prop="costShowStatus">
          <template #header>
            运费核对
            <br />
            默认展示
          </template>
          <template #default="{ row }">
            <el-checkbox v-model="row.costShowStatus" :false-value="0" :true-value="1" @change="modifyFeeNameSetting(row)" />
          </template>
        </el-table-column> -->
        <el-table-column label="计入退税资料运费" min-width="100" prop="costShowStatus">
          <template #header>
            计入退税
            <br />
            资料运费
          </template>
          <template #default="{ row }">
            <el-checkbox v-model="row.inTaxRefundBillStatus" :false-value="0" :true-value="1" @change="modifyFeeNameSetting(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row, $index }">
            <el-link v-if="row.status === 1" type="danger" underline="never" @click="delFeeSetting(row, $index)">删除</el-link>
            <span v-if="row.status === 0">{{ '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </vab-dialog>
    <!-- 新增货代 -->
    <vab-dialog v-model="addForwarderVisible" title="新增货代" width="20%" @close="closeAddForwarder">
      <el-form
        ref="addForwarderFormRef"
        label-position="right"
        label-width="auto"
        :model="addForwarderForm"
        :rules="addForwarderRule"
        style="margin-right: 20px; margin-left: 20px"
      >
        <el-form-item label="货代公司全名" prop="fullName">
          <el-input v-model="addForwarderForm.fullName" clearable />
        </el-form-item>
        <el-form-item label="货代简称" prop="abbreviation">
          <el-input v-model="addForwarderForm.abbreviation" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeAddForwarder">取消</el-button>
        <el-button type="primary" @click="confirmAddForwarder">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 货代清单 -->
    <vab-dialog v-model="forwarderListVisible" class="listTable" title="货代清单" width="30%">
      <el-table border :data="forwarderList" :header-cell-style="{ textAlign: 'center' }" stripe @cell-click="changeInputForwarderList">
        <el-table-column label="货代公司全名" prop="fullName">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.fullName"
                @blur="clickCancelForwarderList($event, row)"
                @keypress.enter="clickCancelForwarderList($event, row)"
              />
            </div>
            <span>{{ row.fullName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货代简称" prop="abbreviation">
          <template #default="{ row }">
            <div class="none">
              <el-input
                v-model="row.abbreviation"
                @blur="clickCancelForwarderList($event, row)"
                @keypress.enter="clickCancelForwarderList($event, row)"
              />
            </div>
            <span>{{ row.abbreviation }}</span>
          </template>
        </el-table-column>
      </el-table>
    </vab-dialog>
    <!-- 新增渠道 -->
    <vab-dialog v-model="addNewChannelVisible" class="dialog" title="新增渠道" top="5%" width="38%" @close="closeAddNewChannel">
      <div style="max-height: 60vh; overflow: auto">
        <el-form
          ref="addNewChannelFormRef"
          label-position="right"
          label-width="auto"
          :model="addNewChannelForm"
          style="margin-right: 10px; margin-left: 10px"
        >
          <el-form-item label="渠道名">
            <div style="display: flex; gap: 1%; align-items: center">
              <el-select v-model="addNewChannelForm.freightForwarderId" placeholder="货代简称" style="flex: 1">
                <el-option v-for="item in selectList" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
              <span>-</span>
              <el-input v-model="addNewChannelForm.types" placeholder="货物类型" style="flex: 1" />
              <span>-</span>
              <el-input v-model="addNewChannelForm.channelName" placeholder="渠道名" style="flex: 1" />
              <span>-</span>
              <el-input v-model="addNewChannelForm.destination" placeholder="目的地" style="flex: 1" />
            </div>
          </el-form-item>
          <el-form-item label="名义时效" prop="nominalLimitation">
            <el-input v-model="addNewChannelForm.nominalLimitation" clearable />
          </el-form-item>
          <el-form-item label="当前价格(kg)" prop="currentPriceWeight">
            <el-input v-model="addNewChannelForm.currentPriceWeight" clearable />
          </el-form-item>
          <el-form-item label="当前价格(m3)" prop="currentPriceVolume">
            <el-input v-model="addNewChannelForm.currentPriceVolume" clearable />
          </el-form-item>
          <el-form-item label="入仓费价格(m3)" prop="warehouseFeePrice">
            <el-input v-model="addNewChannelForm.warehouseFeePrice" clearable />
          </el-form-item>
          <el-form-item label="体积系数" prop="volumeFactor">
            <el-input v-model="addNewChannelForm.volumeFactor" clearable />
          </el-form-item>
          <el-form-item label="重量系数" prop="weightFactor">
            <el-input v-model="addNewChannelForm.weightFactor" clearable />
          </el-form-item>
          <el-form-item label="起运量(kg)" prop="takeOffQuantityWeight">
            <el-input v-model="addNewChannelForm.takeOffQuantityWeight" clearable />
          </el-form-item>
          <el-form-item label="起运量(m3)" prop="takeOffQuantityVolume">
            <el-input v-model="addNewChannelForm.takeOffQuantityVolume" clearable />
          </el-form-item>
          <el-form-item label="最低单箱计费重量(kg)" prop="singleBoxBillingWeightMin">
            <el-input v-model="addNewChannelForm.singleBoxBillingWeightMin" clearable />
          </el-form-item>
          <el-form-item label="最大单箱重量(kg)" prop="singleBoxBillingWeightMax">
            <el-input v-model="addNewChannelForm.singleBoxBillingWeightMax" clearable />
          </el-form-item>
          <el-form-item label="单票最大运量(kg)" prop="takeOffQuantityMaxWeight">
            <el-input v-model="addNewChannelForm.takeOffQuantityMaxWeight" clearable />
          </el-form-item>
          <el-form-item label="单票最大运量(m3)" prop="takeOffQuantityMaxVolume">
            <el-input v-model="addNewChannelForm.takeOffQuantityMaxVolume" clearable />
          </el-form-item>
          <el-form-item label="买单报关费(RMB)" prop="customsDeclarationFeeBill">
            <el-input v-model="addNewChannelForm.customsDeclarationFeeBill" clearable />
          </el-form-item>
          <el-form-item label="买单免费品名个数" prop="freeCountBill">
            <el-input v-model="addNewChannelForm.freeCountBill" clearable />
          </el-form-item>
          <el-form-item label="买单每续页个数" prop="countBill">
            <el-input v-model="addNewChannelForm.countBill" clearable />
          </el-form-item>
          <el-form-item label="买单每续页费用(RMB)" prop="purchaseOrderCostPerRenewal">
            <el-input v-model="addNewChannelForm.purchaseOrderCostPerRenewal" clearable />
          </el-form-item>
          <el-form-item label="退税报关费(RMB)" prop="taxRefundCustomsFee">
            <el-input v-model="addNewChannelForm.taxRefundCustomsFee" clearable />
          </el-form-item>
          <el-form-item label="退税免费品名个数" prop="taxRefundCustomsFreeCount">
            <el-input v-model="addNewChannelForm.taxRefundCustomsFreeCount" clearable />
          </el-form-item>
          <el-form-item label="退税每续页个数" prop="taxRefundCustomsCount">
            <el-input v-model="addNewChannelForm.taxRefundCustomsCount" clearable />
          </el-form-item>
          <el-form-item label="退税每续页费用(RMB)" prop="taxRefundPerRenewalPageFee">
            <el-input v-model="addNewChannelForm.taxRefundPerRenewalPageFee" clearable />
          </el-form-item>
          <el-form-item label="清关费(USD)" prop="customsClearanceFee">
            <el-input v-model="addNewChannelForm.customsClearanceFee" clearable />
          </el-form-item>
          <el-form-item label="清关免费个数" prop="customsClearanceFreeCount">
            <el-input v-model="addNewChannelForm.customsClearanceFreeCount" clearable />
          </el-form-item>
          <el-form-item label="清关每续页个数" prop="customsClearancePageCount">
            <el-input v-model="addNewChannelForm.customsClearancePageCount" clearable />
          </el-form-item>
          <el-form-item label="清关每续页费用(RMB)" prop="customsClearancePageCost">
            <el-input v-model="addNewChannelForm.customsClearancePageCost" clearable />
          </el-form-item>
          <el-form-item label="FDA申报(USD)" prop="fad">
            <el-input v-model="addNewChannelForm.fad" clearable />
          </el-form-item>
          <el-form-item label="EPA申报(USD)" prop="epa">
            <el-input v-model="addNewChannelForm.epa" clearable />
          </el-form-item>
          <el-form-item label="DOT申报(USD)" prop="dot">
            <el-input v-model="addNewChannelForm.dot" clearable />
          </el-form-item>
          <el-form-item label="是否包关税" prop="includeTariffs">
            <el-select v-model="addNewChannelForm.includeTariffs">
              <el-option v-for="item in includeTariffOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="closeAddNewChannel">取消</el-button>
        <el-button type="primary" @click="confirmAddNewChannel">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 修改or复制 -->
    <vab-dialog
      v-model="modifyOrCopyVisible"
      class="addNewChannel"
      :title="modifyOrCopy === 'modify' ? '修改' : '复制'"
      top="5%"
      width="38%"
    >
      <div style="max-height: 60vh; overflow: auto">
        <el-form label-position="right" label-width="auto" :model="updateForm" style="margin-right: 10px; margin-left: 10px">
          <el-form-item label="渠道名">
            <div style="display: flex; gap: 1%; align-items: center">
              <el-select v-model="updateForm.freightForwarderId" placeholder="货代简称" style="flex: 1">
                <el-option v-for="item in selectList" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
              <span>-</span>
              <el-input v-model="updateForm.types" placeholder="货物类型" style="flex: 1" />
              <span>-</span>
              <el-input v-model="updateForm.channelName" placeholder="渠道名" style="flex: 1" />
              <span>-</span>
              <el-input v-model="updateForm.destination" placeholder="目的地" style="flex: 1" />
            </div>
          </el-form-item>
          <el-form-item label="名义时效" prop="nominalLimitation">
            <el-input v-model="updateForm.nominalLimitation" clearable />
          </el-form-item>
          <el-form-item label="当前价格(kg)" prop="currentPriceWeight">
            <el-input v-model="updateForm.currentPriceWeight" clearable />
          </el-form-item>
          <el-form-item label="当前价格(m3)" prop="currentPriceVolume">
            <el-input v-model="updateForm.currentPriceVolume" clearable />
          </el-form-item>
          <el-form-item label="入仓费价格(m3)" prop="warehouseFeePrice">
            <el-input v-model="updateForm.warehouseFeePrice" clearable />
          </el-form-item>
          <el-form-item label="体积系数" prop="volumeFactor">
            <el-input v-model="updateForm.volumeFactor" clearable />
          </el-form-item>
          <el-form-item label="重量系数" prop="weightFactor">
            <el-input v-model="updateForm.weightFactor" clearable />
          </el-form-item>
          <el-form-item label="起运量(kg)" prop="takeOffQuantityWeight">
            <el-input v-model="updateForm.takeOffQuantityWeight" clearable />
          </el-form-item>
          <el-form-item label="起运量(m3)" prop="takeOffQuantityVolume">
            <el-input v-model="updateForm.takeOffQuantityVolume" clearable />
          </el-form-item>
          <el-form-item label="最低单箱计费重量(kg)" prop="singleBoxBillingWeightMin">
            <el-input v-model="updateForm.singleBoxBillingWeightMin" clearable />
          </el-form-item>
          <el-form-item label="最大单箱重量(kg)" prop="singleBoxBillingWeightMax">
            <el-input v-model="updateForm.singleBoxBillingWeightMax" clearable />
          </el-form-item>
          <el-form-item label="单票最大运量(kg)" prop="takeOffQuantityMaxWeight">
            <el-input v-model="updateForm.takeOffQuantityMaxWeight" clearable />
          </el-form-item>
          <el-form-item label="单票最大运量(m3)" prop="takeOffQuantityMaxVolume">
            <el-input v-model="updateForm.takeOffQuantityMaxVolume" clearable />
          </el-form-item>
          <el-form-item label="买单报关费(RMB)" prop="customsDeclarationFeeBill">
            <el-input v-model="updateForm.customsDeclarationFeeBill" clearable />
          </el-form-item>
          <el-form-item label="买单免费品名个数" prop="freeCountBill">
            <el-input v-model="updateForm.freeCountBill" clearable />
          </el-form-item>
          <el-form-item label="买单每续页个数" prop="countBill">
            <el-input v-model="updateForm.countBill" :min="1" style="width: 100%" type="number" />
          </el-form-item>
          <el-form-item label="买单每续页费用(RMB)" prop="purchaseOrderCostPerRenewal">
            <el-input v-model="updateForm.purchaseOrderCostPerRenewal" clearable />
          </el-form-item>
          <el-form-item label="退税报关费(RMB)" prop="taxRefundCustomsFee">
            <el-input v-model="updateForm.taxRefundCustomsFee" clearable />
          </el-form-item>
          <el-form-item label="退税免费品名个数" prop="taxRefundCustomsFreeCount">
            <el-input v-model="updateForm.taxRefundCustomsFreeCount" clearable />
          </el-form-item>
          <el-form-item label="退税每续页个数" prop="taxRefundCustomsCount">
            <el-input v-model="updateForm.taxRefundCustomsCount" :min="1" style="width: 100%" type="number" />
          </el-form-item>
          <el-form-item label="退税每续页费用(RMB)" prop="taxRefundPerRenewalPageFee">
            <el-input v-model="updateForm.taxRefundPerRenewalPageFee" clearable />
          </el-form-item>
          <el-form-item :label="modifyOrCopy === 'modify' ? '清关费' : '清关费(USD)'" prop="customsClearanceFee">
            <el-input v-model="updateForm.customsClearanceFee" clearable />
          </el-form-item>
          <!-- 新加货币选项 -->
          <el-form-item v-if="modifyOrCopy === 'modify'" label="货币" prop="customsClearanceCurrency">
            <el-select v-model="updateForm.customsClearanceCurrency" placeholder="请选择货币">
              <el-option v-for="item in currencyNumList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="清关免费个数" prop="customsClearanceFreeCount">
            <el-input v-model="updateForm.customsClearanceFreeCount" clearable />
          </el-form-item>
          <el-form-item label="清关每续页个数" prop="customsClearancePageCount">
            <el-input v-model="updateForm.customsClearancePageCount" :min="1" style="width: 100%" type="number" />
          </el-form-item>
          <el-form-item label="清关每续页费用(RMB)" prop="customsClearancePageCost">
            <el-input v-model="updateForm.customsClearancePageCost" clearable />
          </el-form-item>
          <el-form-item label="FDA申报(USD)" prop="fad">
            <el-input v-model="updateForm.fad" clearable />
          </el-form-item>
          <el-form-item label="EPA申报(USD)" prop="epa">
            <el-input v-model="updateForm.epa" clearable />
          </el-form-item>
          <el-form-item label="DOT申报(USD)" prop="dot">
            <el-input v-model="updateForm.dot" clearable />
          </el-form-item>
          <el-form-item label="是否包关税" prop="includeTariffs">
            <el-select v-model="updateForm.includeTariffs">
              <el-option v-for="item in includeTariffOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="modifyOrCopyVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmModifyOrCopy">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 站点渠道设定 -->
    <vab-dialog v-model="channelSiteVisible" title="站点渠道设定" top="10vh" width="30%">
      <el-table border :data="channelSiteList" :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column align="center" label="id" prop="id" width="80" />
        \
        <el-table-column align="center" label="站点" prop="siteName" />
        <el-table-column align="center" label="头程渠道" prop="channelId">
          <template #default="{ row }">
            <el-select v-model="row.channelId" placeholder="请选择头程渠道" @change="handleChangeChannel(row)">
              <el-option v-for="item in channelList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CSSProperties } from 'vue'
import { includeTariffOption } from '../../packagingShipping/constantOption'
import { getShipmentLegCurrencyList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import {
  addChannelFreightForwarder,
  addCostFreightForwarder,
  addFreightForwarderType,
  copyChannelFreightForwarder,
  delCostFreightForwarder,
  getChannelList,
  getChannelSiteList,
  getForwarderCostList,
  getForwarderList,
  getFreightForwarderSelect,
  getFreightForwarderTypeList,
  getSettlementObjectList,
  getUpdateForwarderList,
  safeDaysChannelFreightForwarder,
  updateChannelFreightForwarder,
  updateChannelSiteList,
  updateCostFreightForwarder,
  updateDropdownListDisplayFreightForwarder,
  updateFreightForwarderType,
  updateSafeDaysFreightForwarder,
} from '/@/api/devlocal/encasement'
import FreightForwarderPermission from '/@/permissions/freightforwarder'
import type {
  IAddForwarder,
  IGetChannelSiteList,
  IGetForwarderCostList,
  IGetForwarderList,
  IGetForwarderListReq,
  OptionType,
} from '/@/type/packagingShipping/shippedType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'FreightForwarder',
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
const currencyList = ref<any>()
const router = useRouter()
const route = useRoute()
const currencyNumList = [
  {
    value: 0,
    label: 'RMB',
  },
  {
    value: 1,
    label: 'USD',
  },
  {
    value: 2,
    label: 'EUR',
  },
]
const queryForm = reactive<IGetForwarderListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 50,
})
const total = ref<number>(0)
const list = ref<IGetForwarderList[]>([])
const listLoading = ref<boolean>(true)
// 货代费用名设定可见
const feeNameSettingVisible = ref<boolean>(false)
// 新增货代可见
const addForwarderVisible = ref<boolean>(false)
// 新增货代表单
const addForwarderForm = reactive<IAddForwarder>({
  fullName: '',
  abbreviation: '',
})
const addForwarderFormRef = ref<FormInstance>()
const addForwarderRule = reactive<FormRules<IAddForwarder>>({
  fullName: [{ required: true, message: '请输入货代公司全名', trigger: 'blur' }],
  abbreviation: [{ required: true, message: '请输入货代简称', trigger: 'blur' }],
})
// 货代清单可见
const forwarderListVisible = ref<boolean>(false)
// 货代清单列表
const forwarderList = ref<any>([])
// 货代下拉列表
const selectList = ref<OptionType[]>([])
// 费用名设定列表
const feeNameSettingList = ref<any>([])
// 新增渠道可见
const addNewChannelVisible = ref<boolean>(false)
// 新增渠道表单
const addNewChannelForm = reactive<any>({
  includeTariffs: 0,
})
// 修改或复制表单
const updateForm = reactive<any>({})
const addNewChannelFormRef = ref<FormInstance>()
// 修改or复制可见
const modifyOrCopyVisible = ref<boolean>(false)
// 标记修改还是复制
const modifyOrCopy = ref<string>('')
const selectId = ref<number>(0)
const channelSiteList = ref<IGetChannelSiteList[]>([])
// 发货站点渠道设定可见
const channelSiteVisible = ref<boolean>(false)
const handleChangeChannel = async (row: IGetChannelSiteList) => {
  await updateChannelSiteList({
    id: row.id,
    channelId: row.channelId,
  })
}
const updateDropdownListDisplay = async (row: IGetForwarderList) => {
  await updateDropdownListDisplayFreightForwarder({
    id: row.id!,
    status: row.dropdownListDisplay!,
  })
}
// 展示发货站点渠道设定
const showChannelSite = async () => {
  await fetchChannelData()
  const { data } = await getChannelSiteList()
  channelSiteList.value = data
  channelSiteVisible.value = true
}
// 展示货代展示货代费用名
const showFeeNameSetting = async () => {
  feeNameSettingVisible.value = true
  // 初始化为第一个选项的id
  selectId.value = selectList.value[0].id
  fetchFeeNameSetting()
  fetchSelectList()
  fetchSettlementObjectData()
}
const settlementObjectList = ref<{ id: number; label: string }[]>([])
const fetchSettlementObjectData = async () => {
  const { data } = await getSettlementObjectList()
  settlementObjectList.value = data
}
const fetchFeeNameSetting = async () => {
  const { data: res } = await getForwarderCostList({
    id: selectId.value,
  })
  feeNameSettingData.value = res
}
// 新增费用设定
const handleAddNewFee = async () => {
  const { data } = await addCostFreightForwarder({
    typeId: selectId.value,
  })
  if (data) {
    $baseMessage('新增费用成功', 'success')
    fetchFeeNameSetting()
  }
}
// 关闭新增货代弹窗
const closeAddForwarder = () => {
  addForwarderVisible.value = false
  addForwarderFormRef.value?.resetFields()
}
// 确认新增货代
const confirmAddForwarder = async () => {
  addForwarderFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addFreightForwarderType({
        fullName: addForwarderForm.fullName,
        abbreviation: addForwarderForm.abbreviation,
      })
      if (data) {
        $baseMessage('新增货代成功', 'success')
        closeAddForwarder()
      }
    }
  })
}
// 删除费用设定
const delFeeSetting = (row: any, index: number) => {
  $baseConfirm('确定要删除本条费用设定吗？', null, async () => {
    const { data } = await delCostFreightForwarder({
      id: row.id,
    })
    if (data) {
      $baseMessage('删除成功', 'success')
      feeNameSettingList.value.splice(index, 1)
      fetchFeeNameSetting()
    }
  })
}
// 展示货代清单
const showForwarderList = async () => {
  const { data } = await getFreightForwarderTypeList()
  forwarderList.value = data
  forwarderListVisible.value = true
}
// 关闭新增渠道
const closeAddNewChannel = () => {
  addNewChannelFormRef.value?.resetFields()
  addNewChannelForm.freightForwarderId = undefined
  addNewChannelForm.types = ''
  addNewChannelForm.channelName = ''
  addNewChannelForm.destination = ''
  addNewChannelVisible.value = false
}
// 确认新增渠道
const confirmAddNewChannel = async () => {
  addNewChannelFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      //执行新增渠道逻辑
      const { data } = await addChannelFreightForwarder(addNewChannelForm)
      if (data) {
        $baseMessage('新增渠道成功', 'success')
        closeAddNewChannel()
        queryData()
      }
    }
  })
}
// 获取修改的列表
const fetchUpdateList = async (id: number) => {
  const { data } = await getUpdateForwarderList({
    id,
  })
  Object.assign(updateForm, data)
}
// 展示修改
const showModify = (row: any) => {
  modifyOrCopyVisible.value = true
  modifyOrCopy.value = 'modify'
  fetchUpdateList(row.id)
}
// 展示复制
const showCopy = (row: any) => {
  modifyOrCopyVisible.value = true
  modifyOrCopy.value = 'copy'
  fetchUpdateList(row.id)
}

// 确认修改或复制
const confirmModifyOrCopy = async () => {
  // 验证三个字段不能为0，避免除0错误
  if (Number(updateForm.countBill) === 0 || updateForm.countBill === null || updateForm.countBill === undefined) {
    $baseMessage('买单每续页个数不能为0', 'error')
    return
  }
  if (
    Number(updateForm.taxRefundCustomsCount) === 0 ||
    updateForm.taxRefundCustomsCount === null ||
    updateForm.taxRefundCustomsCount === undefined
  ) {
    $baseMessage('退税每续页个数不能为0', 'error')
    return
  }
  if (
    Number(updateForm.customsClearancePageCount) === 0 ||
    updateForm.customsClearancePageCount === null ||
    updateForm.customsClearancePageCount === undefined
  ) {
    $baseMessage('清关每续页个数不能为0', 'error')
    return
  }

  if (modifyOrCopy.value === 'modify') {
    // 执行修改逻辑
    const { data } = await updateChannelFreightForwarder(updateForm)
    if (data) {
      $baseMessage('货代费用渠道修改成功', 'success')
      modifyOrCopyVisible.value = false
      fetchData()
    }
  } else if (modifyOrCopy.value === 'copy') {
    // 执行复制逻辑
    const data = await copyChannelFreightForwarder(updateForm)
    if (data) {
      $baseMessage('货代费用渠道复制成功', 'success')
      modifyOrCopyVisible.value = false
      // 刷新数据
      fetchData()
    }
  }
}
// 渠道安全天数修改
const modifySafeDays = async (row: any) => {
  await updateSafeDaysFreightForwarder({
    id: row.id,
    safeDays: row.safeDays,
  })
}
// 渠道安全天数计算
const calculateSafeDays = async (row: any) => {
  const { data } = await safeDaysChannelFreightForwarder({
    id: row.id,
  })
  if (data) {
    $baseMessage('计算成功', 'success')
  }
}
// 展示新增渠道
const handleShowAddChannel = async () => {
  addNewChannelVisible.value = true
  fetchSelectList()
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

const feeNameSettingData = ref<IGetForwarderCostList[]>([])

let copyRow: any
/**
 * @description 货代费用名设定表格的点击编辑
 */
const changeInputFeeSetting = async (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }
  copyRow = { ...row } //浅拷贝
  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
/**
 * @description 货代费用名设定点击取消编辑框
 */
const clickCancel = async (event: any, row: any) => {
  const t1 = getRootElement(event['srcElement'], '.cell').children[0]
  if (t1) {
    t1.classList.add('none')
  }
  const t2 = getRootElement(event['srcElement'], '.cell').children[1]
  if (t2) {
    t2.classList.remove('none')
  }
  if (JSON.stringify(row) === JSON.stringify(copyRow)) return

  if (event.type === 'blur') {
    const costNames = feeNameSettingData.value.map((item) => {
      if (item.id != row.id) {
        return item.costName
      }
    })
    if (costNames.includes(row.costName)) {
      $baseMessage('费用名重复，请重新输入！', 'error')
      row.costName = ''
      return
    }
    // 执行失去焦点处理逻辑, 发送更新请求
    await updateCostFreightForwarder({
      id: row.id,
      costName: row.costName,
      billCostName: row.billCostName,
      bgStatus: row.bgStatus,
      qgStatus: row.qgStatus,
      costShowStatus: row.costShowStatus,
    })
  }
}
const modifyFeeNameSettingBg = async (row: IGetForwarderCostList) => {
  // 限制合并报关或合并清关只能选择一个或者都不选，需要把多余的值设置为0
  if (row.bgStatus && row.qgStatus) {
    $baseMessage('合并报关和合并清关只能选择一个', 'error')
    row.bgStatus = 0
    return
  }
  try {
    await updateCostFreightForwarder({
      id: row.id,
      costName: row.costName,
      billCostName: row.billCostName,
      bgStatus: row.bgStatus,
      qgStatus: row.qgStatus,
      costShowStatus: row.costShowStatus,
      settlementObject: row.settlementObject,
    })
  } catch (error) {
    console.error(error)
  }
}
const modifyFeeNameSetting = async (row: IGetForwarderCostList) => {
  // 限制合并报关或合并清关只能选择一个或者都不选，需要把多余的值设置为0
  if (row.bgStatus && row.qgStatus) {
    $baseMessage('合并报关和合并清关只能选择一个', 'error')
    row.qgStatus = 0
    return
  }
  try {
    await updateCostFreightForwarder({
      id: row.id,
      costName: row.costName,
      billCostName: row.billCostName,
      bgStatus: row.bgStatus,
      qgStatus: row.qgStatus,
      costShowStatus: row.costShowStatus,
      settlementObject: row.settlementObject,
      inTaxRefundBillStatus: row.inTaxRefundBillStatus,
      currency: row.currency,
    })
  } catch (error) {
    console.error(error)
  }
}
/**
 * @description 货代清单表格的点击编辑
 */
const changeInputForwarderList = async (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]
  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }
  copyRow = { ...row } //浅拷贝
  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')
    focusAndSelectInput(cell)
  }
}
/**
 * @description 货代清单点击取消编辑框
 */
const clickCancelForwarderList = async (event: any, row: any) => {
  const t1 = getRootElement(event['srcElement'], '.cell').children[0]
  if (t1) {
    t1.classList.add('none')
  }
  const t2 = getRootElement(event['srcElement'], '.cell').children[1]
  if (t2) {
    t2.classList.remove('none')
  }
  if (JSON.stringify(row) === JSON.stringify(copyRow)) return

  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑, 发送更新请求
    await updateFreightForwarderType({
      id: row.id,
      fullName: row.fullName,
      abbreviation: row.abbreviation,
    })
    queryData()
  }
}
/**
 * @description 货代费用名设定的表格样式
 * @param data
 * @return CSSProperties 返回特定样式
 */
const feeNameSettingCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.columnIndex === 0 && data.row.status === 0) {
    return {
      color: '#999',
      cursor: 'not-allowed',
      textAlign: 'center',
    }
  }
  return {
    textAlign: 'center',
  }
}
const channelList = ref<{ id: number; label: string }[]>([])
const fetchChannelData = async () => {
  const { data } = await getChannelList()
  channelList.value = data
}
// 获取货代简称列表
const fetchSelectList = async () => {
  const { data } = await getFreightForwarderSelect()
  selectList.value = data
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getForwarderList(queryForm)
  total.value = data?.total!
  list.value = data?.list!
  list.value.forEach((item) => {
    item.fullName = `${item.name}-${item.types}-${item.channelName}-${item.destination}`
  })
  listLoading.value = false
}

const fetchCurrencyList = async () => {
  const { data } = await getShipmentLegCurrencyList()
  currencyList.value = data
}

onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  fetchData()
  fetchSelectList()
  fetchCurrencyList()
})
</script>

<style lang="scss" scoped>
:deep(.input-center) {
  text-align: center;
  text-align-last: center;
}
.feeNameSettingTable :deep(.el-checkbox) {
  transform: scale(1.3);
  transform-origin: center;
}
.none {
  display: none;
}
:deep(.dialog .el-dialog__body) {
  padding-top: 10px;
}
:deep(.listTable .el-table__body .cell) {
  min-height: 35px;
  line-height: 35px;
}
.el-checkbox {
  transform: scale(1.3);
}
</style>
