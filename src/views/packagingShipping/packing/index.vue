<template>
  <div class="blog-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="16">
        <el-button v-permissions="{ permission: [EncasementPermission.ENCASEMENT_CREATE] }" type="primary" @click="showBoxNumber">
          开始装箱
        </el-button>
        <el-button v-permissions="{ permission: [EncasementPermission.ENCASEMENT_AMAZON] }" type="primary" @click="showShippingAmazon">
          发货(亚马逊)
        </el-button>
        <el-button v-permissions="{ permission: [EncasementPermission.ENCASEMENT_WALMART] }" type="primary" @click="showShippingWalmart">
          发货(沃尔玛)
        </el-button>
        <!-- <el-button type="primary" @click="shippingPlanningVisible = true">发货规划</el-button> -->
        <el-button v-permissions="{ permission: [EncasementPermission.ENCASEMENT_UNLOCK] }" type="primary" @click="handleUnlockEncasement">
          解锁
        </el-button>
        <!-- <el-button
          v-permissions="{ permission: [EncasementPermission.ENCASEMENT_UPDATE_PLAN] }"
          type="primary"
          @click="showModifyShippingPlan"
        >
          修改发货计划
        </el-button> -->
        <el-button
          v-permissions="{ permission: [EncasementPermission.ENCASEMENT_UPLOAD_PDF] }"
          type="primary"
          @click="uploadPdfVisible = true"
        >
          上传pdf插页
        </el-button>
        <el-button v-permissions="{ permission: [EncasementPermission.ENCASEMENT_SPLIT] }" type="primary" @click="openUploadSplit">
          上传拆分
        </el-button>
        <el-button v-permissions="{ permission: [EncasementPermission.ENCASEMENT_SIZE_EXPORT] }" type="primary" @click="showExportSize">
          尺寸导出
        </el-button>
        <el-button v-permissions="{ permission: [EncasementPermission.ENCASEMENT_ERROR] }" type="primary" @click="showUpdateError">
          误差
        </el-button>
        <el-button type="primary" @click="showQuantityCheck">发货数检查</el-button>
        <el-button
          v-permissions="{ permission: [EncasementPermission.ENCASEMENT_GENERATE_AMAZON_TEMPLATE] }"
          type="primary"
          @click="sendShipmentCheckVisible = true"
        >
          生成发货测试文件1
        </el-button>
        <el-button
          v-permissions="{ permission: [EncasementPermission.ENCASEMENT_PLAN_CHANNEL] }"
          type="primary"
          @click="shippingPlanChannelVisible = true"
        >
          发货计划渠道
        </el-button>

        <!-- <el-button type="success">装箱检查</el-button> -->
        <el-select
          v-model="printer"
          v-permissions="{ permission: [EncasementPermission.ENCASEMENT_CREATE] }"
          clearable
          placeholder="请选择打印机"
          style="margin: 0 10px calc(var(--el-margin) / 2) 0"
          @change="handleChangePrinter"
        >
          <el-option v-for="item in printerOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <!-- 发货计划日期区域 -->
        <div v-permissions="{ permission: [EncasementPermission.ENCASEMENT_UPDATE_PLAN] }" class="shipping-plan-section">
          <span class="shipping-plan-label">发货计划日期：</span>
          <el-date-picker
            v-model="shippingPlanForm.date"
            class="shipping-plan-date-picker"
            clearable
            placeholder="请选择日期"
            type="date"
            value-format="YYYY-MM-DD"
          />
          <el-button class="shipping-plan-button" type="success" @click="confirmShippingPlan">修改</el-button>
        </div>

        <div class="summary-info">
          <el-space :size="16" style="align-items: center">
            <el-statistic class="compact-statistic" title="总箱数" :value="totalBoxNumber" />
            <el-divider direction="vertical" style="height: 34px" />
            <el-statistic class="compact-statistic" :formatter="(val: number) => val.toFixed(2)" title="总重量(kg)" :value="totalWeight" />
            <el-divider direction="vertical" style="height: 34px" />
            <el-statistic class="compact-statistic" :formatter="(val: number) => val.toFixed(2)" title="总体积(m³)" :value="totalVolume" />
          </el-space>
        </div>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="8">
        <div class="custom-table-right-tools">
          <el-popover popper-style="max-height: 550px; overflow: auto;" :width="240">
            <template #reference>
              <el-button>
                <vab-icon icon="settings-line" />
              </el-button>
            </template>
            <vab-draggable
              v-model="columns"
              :animation="600"
              filter=".non-draggable"
              handle=".handle"
              :on-end="handleEnd"
              :on-move="handleMove"
            >
              <div
                v-for="item in columns"
                :key="item.label"
                :class="{ 'non-draggable': item.disableCheck }"
                style="display: flex; align-items: center; font-size: var(--el-font-size-base)"
              >
                <vab-icon class="handle" :class="{ 'disabled-handle': item.disableCheck }" icon="draggable" style="margin-right: 5px" />
                <span style="flex: 1">{{ item.label }}</span>
                <span v-if="item.disableCheck" class="icon-dis" style="display: flex; align-items: center">
                  <vab-icon icon="eye-line" />
                </span>
                <span v-else class="icon-hover" style="display: flex; align-items: center; cursor: pointer" @click="handleChecked(item)">
                  <vab-icon v-show="!item.checked" icon="eye-off-line" />
                  <vab-icon v-show="item.checked" icon="eye-line" />
                </span>
              </div>
            </vab-draggable>
          </el-popover>
        </div>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <!--
              筛选条件说明：
              - boxCount5Plus: 筛选箱数不含5的记录
              - dimensionsComplete: 筛选毛重、长、宽、高未录入的记录
            -->
            <div class="filter-group">
              <el-checkbox-group v-model="queryForm.filters" @change="queryData">
                <el-checkbox value="boxCount5Plus">箱数5-</el-checkbox>
                <el-checkbox value="dimensionsComplete">尺寸未录</el-checkbox>
              </el-checkbox-group>
            </div>

            <el-select v-model="queryForm.site" clearable placeholder="全部发货站点" @change="queryData">
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id">
                <!-- <el-icon :style="{ color: getSiteBaseColor(item.label), fontSize: '18px', marginRight: '6px' }">
                  <location-filled />
                </el-icon> -->
                <el-text :style="{ color: getSiteBaseColor(item.label), marginRight: '6px' }">{{ item.label }}</el-text>
              </el-option>
            </el-select>
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
      v-permissions="{ permission: [EncasementPermission.ENCASEMENT_LIST] }"
      border
      :cell-style="cellStyle"
      class="noneHoveTable custom-table-hover"
      :data="list"
      :default-sort="{ prop: 'createTime', order: 'descending' }"
      :header-cell-style="{ textAlign: 'center' }"
      max-height="calc(100vh - 300px)"
      :row-class-name="stripedRowClass"
      :span-method="objectSpanMethod"
      @cell-click="handleCellClick"
      @row-click="handleRowClick"
      @selection-change="setSelectRows"
      @sort-change="handleSortChange"
    >
      <el-table-column fixed="left" type="selection" />
      <el-table-column
        v-for="(item, index) in checkList"
        :key="index"
        :fixed="item.isFixed"
        :label="item.label"
        :min-width="handleCalculateWidth(item)"
        :prop="item.prop"
        :sortable="item.sortable ? 'custom' : false"
      >
        <template v-if="item.label === '多选'" #header>
          <el-checkbox :indeterminate="isIndeterminate" :model-value="isAllSelected" @change="handleSelectAll" />
        </template>

        <template v-if="item.label === '发货计划'" #default="{ row }">
          {{ row.shipmentPlanDate ? row.shipmentPlanDate.split(' ')[0] : '' }}
        </template>
        <template v-else-if="item.label === '多选'" #default="{ row }">
          <el-checkbox :model-value="isRowSelected(row)" @change="handleBackendCheckboxChange(row, $event)" />
        </template>

        <template v-else-if="item.label === '装箱日期'" #default="{ row }">
          {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
        </template>
        <template v-else-if="item.label === '装箱人'" #default="{ row }">
          <span>{{ row.partnerNames?.join(',') || '-' }}</span>
        </template>
        <template v-else-if="item.label === '装箱图片'" #default="{ row }">
          <div v-if="row.packingImagePaths?.length" class="packing-image-list">
            <el-image
              v-for="imagePath in getVisiblePackingImagePaths(row.packingImagePaths)"
              :key="imagePath"
              fit="cover"
              :src="imagePath"
              style="width: 50px; height: 50px; cursor: pointer"
              @click.stop="imagePreviewShow(imagePath)"
            />
            <el-button
              v-if="getHiddenPackingImagePathCount(row.packingImagePaths) > 0"
              class="packing-image-more"
              @click.stop="showPackingImageInfoDialog(row.packingImagePaths)"
            >
              +{{ getHiddenPackingImagePathCount(row.packingImagePaths) }}
            </el-button>
          </div>
          <span v-else>-</span>
        </template>
        <template v-else-if="item.label === '冻结箱号'" #default="{ row }">
          <el-switch
            v-model="row.freeze"
            :active-value="1"
            class="ml-2"
            :inactive-value="0"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="updateEncasementFreeze(row)"
          />
        </template>
        <template v-else-if="item.label === '发往站点'" #default="{ row }">
          <el-tag size="default" :style="getSiteTagStyle(row.planSiteName)">{{ row.planSiteName }}</el-tag>
        </template>
        <template v-else-if="item.label === 'SKU'" #default="{ row }">
          <span class="copySku" data-sku="row.sku" @click="handleClipboard($event, row.sku)">
            {{ row.sku }}
            <vab-icon icon="file-copy-2-fill" />
            <br />
            {{ row.description }}
          </span>
        </template>
        <template v-else-if="item.label === '带磁'" #default="{ row }">
          <vab-icon v-if="row.magnetic === 1" icon="checkbox-circle-fill" style="color: var(--el-color-danger); font-size: 20px" />
          <vab-icon v-else icon="close-circle-fill" style="color: var(--el-color-success); font-size: 20px" />
        </template>
        <template v-else-if="item.label === '木制品'" #default="{ row }">
          <vab-icon v-if="row.woodenProduct === 1" icon="checkbox-circle-fill" style="color: var(--el-color-danger); font-size: 20px" />
          <vab-icon v-else icon="close-circle-fill" style="color: var(--el-color-success); font-size: 20px" />
        </template>
        <template v-else-if="item.label === '玩具'" #default="{ row }">
          <vab-icon v-if="row.toy === 1" icon="checkbox-circle-fill" style="color: var(--el-color-danger); font-size: 20px" />
          <vab-icon v-else icon="close-circle-fill" style="color: var(--el-color-success); font-size: 20px" />
        </template>
        <template v-else-if="item.label === '箱数'" #default="{ row }">
          <el-input-number
            v-model="row.numberOfBoxes"
            style="width: 100%"
            @change="(newValue, oldValue) => handleBoxNumberChange(newValue, oldValue, row)"
            @keydown.prevent="handleKeyDown"
          />
        </template>
        <template v-else-if="item.label === '总可售'" #default="{ row }">
          {{ row.esAvailableSaleDayTotal != null ? row.esAvailableSaleDayTotal + '天' : '' }}
        </template>
        <template v-else-if="item.label === '断货'" #default="{ row }">
          <template v-if="row.outOfStock != null">
            <el-text v-if="row.outOfStock >= 5" type="danger">{{ row.outOfStock }}天</el-text>
            <el-text v-else-if="row.outOfStock > 0 && row.outOfStock < 5" type="warning">{{ row.outOfStock }}天</el-text>
            <el-text v-else type="success">{{ row.outOfStock }}天</el-text>
          </template>
        </template>
        <template v-else-if="item.label === '备注'" #default="{ row }">
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.remarks }}</div>
            </template>
            <div class="multi-line-ellipsis-1">{{ row.remarks }}</div>
          </el-tooltip>
        </template>
        <template v-else-if="item.label === '箱数展示'" #default="{ row }">
          {{ row.numberOfBoxes }}
        </template>
        <template v-else-if="item.label === '产品总数'" #default="{ row }">
          <el-link type="primary" underline="always">{{ row.productTotalNumber }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-permissions="{
          permission: [
            EncasementPermission.ENCASEMENT_UPDATE,
            EncasementPermission.ENCASEMENT_COUNT_SPLIT,
            EncasementPermission.ENCASEMENT_DELETE,
            EncasementPermission.ENCASEMENT_PRINT,
          ],
        }"
        fixed="right"
        label="操作"
        width="180"
      >
        <template #default="{ row, $index }">
          <div class="operation-buttons">
            <el-link
              v-permissions="{ permission: [EncasementPermission.ENCASEMENT_UPDATE] }"
              type="primary"
              underline="never"
              @click="showModify(row)"
            >
              修改
            </el-link>
            <el-link
              v-permissions="{ permission: [EncasementPermission.ENCASEMENT_COUNT_SPLIT] }"
              type="primary"
              underline="never"
              @click="showSplit(row)"
            >
              拆分
            </el-link>
            <el-link
              v-permissions="{ permission: [EncasementPermission.ENCASEMENT_DELETE] }"
              type="danger"
              underline="never"
              @click="handleDelEncasement(row)"
            >
              删除
            </el-link>
            <el-link
              v-permissions="{ permission: [EncasementPermission.ENCASEMENT_PRINT] }"
              type="primary"
              underline="never"
              @click="showPrint(row)"
            >
              打印
            </el-link>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination
      v-permissions="{ permission: [EncasementPermission.ENCASEMENT_LIST] }"
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 30, 40, 50, 100, 200, 300]"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 修改 -->
    <vab-modify-dialog
      :encasement-id="encasementId"
      :modify-visible="modifyVisible"
      :site-list="siteList"
      @update:modify-visible="closeModify"
    />

    <!-- 箱号 -->
    <vab-box-number-dialog v-model="boxNumberVisible" v-model:is-reinsert="isReinsert" :site-list="siteList" @next="handleBoxNumberNext" />
    <!-- 装箱 -->
    <vab-packing-dialog
      :encasement-no="encasementNo"
      :is-reinsert="isReinsert"
      :packing-visible="packingVisible"
      :partner="boxPartner"
      :site="passSite"
      @update:finish="handleFinish"
      @update:packing-visible="handlePackingClose"
    />
    <!-- 发货（沃尔玛）-->
    <vab-dialog v-model="shippingWalmartVisible" class="dialog" title="发货（沃尔玛）" width="20%">
      <el-form ref="shipmentWalmartFormRef" label-position="top" :model="shipmentWalmartForm">
        <el-form-item style="margin-bottom: 10px">
          <el-text>
            {{ `总箱数：${totalBoxNumber || 0}，总重：${(totalWeight || 0).toFixed(2)}(kg)，总体积：${(totalVolume || 0).toFixed(2)}(m3)` }}
          </el-text>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px">
          <el-space>
            <el-button @click="handleEncasementWalmart">生成模板文件</el-button>
            <el-button :disabled="file3Disabled" @click="handleGenerateFile3">下载装箱表格</el-button>
          </el-space>
        </el-form-item>

        <el-form-item label="合同号" prop="contractNumber">
          <el-input v-model.trim="shipmentWalmartForm.contractNumber" clearable />
        </el-form-item>
        <el-form-item label="SHIPMENT ID" prop="shipmentId">
          <el-input v-model.trim="shipmentWalmartForm.shipmentId" clearable />
        </el-form-item>
        <el-form-item label="发往站点" prop="site">
          <!-- <el-select v-model="shipmentAmazonForm.site" placeholder="请选择站点" >
            <el-option
              v-for="item in siteList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select> -->
          <el-input v-model="shipmentWalmartForm.site" disabled />
        </el-form-item>
        <el-form-item label="货代渠道" prop="channel">
          <el-select v-model="shipmentWalmartForm.channel" clearable filterable placeholder="请选择货代渠道">
            <el-option v-for="item in channelList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" @click="submitShipmentWalmart">完成</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 发货（亚马逊）-->
    <vab-dialog
      v-model="shippingAmazonVisible"
      class="dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :draggable="false"
      title="发货（亚马逊）"
      top="6vh"
      width="25%"
    >
      <el-form ref="shipmentAmazonFormRef" label-position="top" :model="shipmentAmazonForm">
        <el-form-item style="margin-bottom: 10px">
          <el-text>
            {{ `总箱数：${totalBoxNumber}，总重：${totalWeight.toFixed(2)}(kg)，总体积：${totalVolume.toFixed(2)}(m3)` }}
          </el-text>
        </el-form-item>
        <el-form-item>
          <el-select v-model="shipmentAmazonForm.type">
            <el-option v-for="item in unitOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px">
          <el-space>
            <el-button @click="handleGenerateFile1">生成模板文件</el-button>
            <el-button :disabled="file2Disabled" @click="handleDownloadFile">下载模板文件</el-button>
          </el-space>
        </el-form-item>

        <el-upload
          v-model:file-list="fileList"
          action="#"
          :auto-upload="true"
          class="upload-demo"
          drag
          :http-request="UploadRequestHandler"
          multiple
          :show-file-list="true"
          width="100%"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖拽到此处或
            <em>点击上传</em>
          </div>
        </el-upload>

        <el-form-item>
          <el-space>
            <el-button :disabled="file3Disabled" @click="handleDownloadEncasementFile">下载装箱文件</el-button>
            <el-button :disabled="file3Disabled" @click="handleGenerateFile3">下载装箱表格</el-button>
          </el-space>
        </el-form-item>

        <el-form-item label="合同号" prop="contractNumber">
          <el-input v-model.trim="shipmentAmazonForm.contractNumber" clearable />
        </el-form-item>
        <el-form-item label="SHIPMENT ID" prop="shipmentId">
          <el-input v-model.trim="shipmentAmazonForm.shipmentId" clearable />
        </el-form-item>
        <el-form-item label="发往站点" prop="site">
          <!-- <el-select v-model="shipmentAmazonForm.site" placeholder="请选择站点" >
            <el-option
              v-for="item in siteList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select> -->
          <el-input v-model="shipmentAmazonForm.site" disabled />
        </el-form-item>
        <el-form-item label="货代渠道" prop="channel">
          <div class="supplier-select-container">
            <el-select v-model="shipmentAmazonForm.channel" clearable filterable placeholder="请选择货代渠道">
              <el-option v-for="item in channelList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
            <el-button
              v-if="shipmentAmazonForm.channel"
              circle
              class="copy-btn"
              :icon="CopyDocument"
              size="small"
              type="primary"
              @click="handleClip(getChannelName(shipmentAmazonForm.channel))"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" @click="submitShipmentAmazon">完成</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 发货规划 -->
    <vab-dialog v-model="shippingPlanningVisible" title="发货规划" width="20%" @close="closeShippingPlanning">
      <el-form
        ref="shippingPlanningFormRef"
        class="noneHoveTable"
        :model="shippingPlanningForm"
        style="margin-right: 10px; margin-left: 10px"
      >
        <el-form-item label="发货计划" prop="date">
          <el-date-picker clearable placeholder="选择发货计划日期" type="date" />
        </el-form-item>
        <el-form-item label="货代渠道">
          <el-input clearable />
        </el-form-item>
        <el-form-item label="应急补货">
          <el-checkbox />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeShippingPlanning">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 修改发货计划 -->
    <!-- <vab-dialog v-model="modifyPlanVisible" title="修改发货计划" width="20%" @close="closeShippingPlan">
      <el-form
        ref="shippingPlanFormRef"
        :model="shippingPlanForm"
        :rules="shippingPlanFormRules"
        style="margin-right: 10px; margin-left: 10px"
      >
        <el-form-item label="发货计划" prop="date">
          <el-date-picker v-model="shippingPlanForm.date" clearable placeholder="请选择日期" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeShippingPlan">取消</el-button>
        <el-button type="primary" @click="confirmShippingPlan">确认</el-button>
      </template>
    </vab-dialog> -->
    <!-- 上传拆分 -->
    <vab-dialog v-model="uploadSplitVisible" title="上传拆分" top="10vh" width="25%" @close="closeUploadSplit">
      <el-form ref="uploadSplitFormRef" label-position="top" :model="uploadSplitForm" style="margin-right: 10px; margin-left: 10px">
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="uploadSplitForm.date" clearable style="width: 100%" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="拆分备注" prop="remarks">
          <el-input v-model="uploadSplitForm.remarks" resize="none" :rows="2" type="textarea" />
        </el-form-item>
        <el-upload ref="uploadSplitUploadRef" class="upload-demo" drag :http-request="uploadSplitFile" :show-file-list="true" width="100%">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖拽到此处或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" @click="submitSplitCsv">完成</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 上传 pdf 插页 -->
    <vab-dialog v-model="uploadPdfVisible" title="上传pdf插页" width="25%">
      <el-upload class="upload-demo" drag :http-request="uploadPdf" :show-file-list="true" width="100%">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖拽到此处或
          <em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" @click="handleSubmitPdf">完成</el-button>
        </div>
      </template>
    </vab-dialog>

    <!-- 拆分 -->
    <vab-dialog v-model="splitVisible" title="拆分" width="20%">
      <el-form ref="splitFormRef" :model="splitForm" :rules="splitFormRules" style="margin-right: 10px; margin-left: 10px">
        <el-form-item label="拆分数量" prop="splitCount">
          <el-input v-model="splitForm.splitCount" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" @click="confirmSplit">拆分</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 打印 -->
    <vab-dialog v-model="printCountVisible" title="打印数量" width="20%">
      <el-form ref="printFormRef" :model="printForm" :rules="printFormRules" style="margin: 0">
        <el-form-item label="数量" prop="count">
          <el-input v-model="printForm.count" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" @click="handleConfirmPrint">打印</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 尺寸导出 -->
    <vab-dialog v-model="exportSizeVisible" title="尺寸导出" width="20%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button :loading="exportSizeLoading" type="primary" @click="handleExportSize">尺寸导出</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table border :data="newSkuList.map((sku) => ({ sku }))" height="800" style="width: 100%">
        <el-table-column label="#" type="index" width="50" />
        <el-table-column label="SKU" prop="sku" />
      </el-table>
    </vab-dialog>
    <!-- 误差 -->
    <vab-dialog v-model="updateErrorVisible" title="修改误差" width="10%">
      <el-form ref="errorFormRef" label-position="top" :model="errorForm" :rules="errorFormRules">
        <el-form-item label="误差" prop="error">
          <el-input v-model="errorForm.error" clearable>
            <template #suffix>
              <el-icon class="el-input__icon" style="font-style: normal">%</el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateErrorVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmUpdateError">确定</el-button>
      </template>
    </vab-dialog>

    <!-- 修改备注 -->
    <vab-remark-dialog v-model="remarkVisible" :remark="remark" title="修改备注" @update:remark="handleUpdateRemark" />
    <!-- 查看订货总数 -->
    <vab-view-order-count-table v-model="viewOrderVisible" :list="viewOrderList" :sku="_sku" />
    <!-- 发货数检查 -->
    <vab-shipment-quantity-inspection v-model="quantityCheckVisible" />

    <!-- 发货亚马逊测试文件生成-->
    <vab-dialog
      v-model="sendShipmentCheckVisible"
      class="dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :draggable="false"
      title="发货（亚马逊）文件生成"
      width="15%"
    >
      <el-form ref="shipmentAmazonFormRef" label-position="left" :model="sendShipmentAmazonForm">
        <el-form-item label="发往站点" prop="site">
          <el-select v-model="sendShipmentAmazonForm.site" clearable placeholder="请选择站点">
            <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right">
          <el-button :loading="sendShipmentLoading" type="primary" @click="generateTestSendShipmentFile">确定</el-button>
        </div>
      </template>
    </vab-dialog>

    <!-- 发货计划渠道配置弹窗 -->
    <vab-shipping-plan-channel-dialog v-model="shippingPlanChannelVisible" />
    <packing-image-info-dialog v-model="packingImageInfoVisible" :image-list="packingImageInfoList" />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { CopyDocument, Search, UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CSSProperties } from 'vue'
import { VueDraggable as VabDraggable } from 'vue-draggable-plus'
import { getOperationOrderTable } from '~/src/api/devlocal/productOrdering'
import { IGetOperationOrderTable } from '~/src/type/storeOperation/productOrdering'
import { usePackingImageInfo } from '../composables/usePackingImageInfo'
import { printerOption, unitOption } from '../constantOption'
import { downloadFile, downloadFileN } from '/@/api/devlocal/download'
import {
  checkEncasementShipment,
  confirmEncasementShipments,
  delEncasement,
  doLockEncasement,
  encasementFreezeUpdate,
  finishWalmartShipment,
  generateAmazonSendShipmentFile,
  generateTemplateFile1,
  generateTemplateFile3,
  generateWalmartShipment,
  getChannelList,
  getEncasementError,
  getEncasementList,
  getEncasementUserPrinter,
  getProductNewSkuList,
  plusEncasementCount,
  printEncasement,
  reduceEncasementCount,
  splitEncasement,
  splitEncasementCsv,
  unlockEncasement,
  updateEncasementError,
  updateEncasementRemark,
  updateEncasementShipmentDate,
  updateEncasementUserPrinter,
  uploadEncasementFile,
  uploadGenerateTemplateFile2,
} from '/@/api/devlocal/encasement'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { getOperationColumnList, hideOrShowOperationColumn, updateSortOperationColumn } from '/@/api/devlocal/productPerformance'
import { useImagePreview } from '/@/hooks/useImagePreview'
import EncasementPermission from '/@/permissions/encasement'
import type { IEncasementList, IGetEncasementListReq, ISiteOption, OptionType } from '/@/type/packagingShipping/shippedType'
import handleClipboard, { handleClip } from '/@/utils/clipboard'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'Packing',
})

const quantityCheckVisible = ref<boolean>(false)
// 打开发货数检查
const showQuantityCheck = () => {
  quantityCheckVisible.value = true
}

// 发货计划渠道管理
const shippingPlanChannelVisible = ref<boolean>(false)

// 订货总数查看展示
const viewOrderVisible = ref<boolean>(false)
const columns = ref<any>([])
const checkList = computed(() => {
  return columns.value.filter((item: any) => item.checked)
})
const {
  imagePreviewVisible,
  imagePreviewList,
  openImagePreview: imagePreviewShow,
  closeImagePreview: imagePreviewClose,
} = useImagePreview()
const {
  getVisiblePackingImages: getVisiblePackingImagePaths,
  getHiddenPackingImageCount: getHiddenPackingImagePathCount,
  packingImageInfoVisible,
  packingImageInfoList,
  showPackingImageInfoDialog,
} = usePackingImageInfo<string>()

const sendShipmentCheckVisible = ref<boolean>(false)
const sendShipmentLoading = ref<boolean>(false)
const sendShipmentAmazonForm = ref<any>({})
const generateTestSendShipmentFile = async () => {
  sendShipmentLoading.value = true
  const { data } = await generateAmazonSendShipmentFile({
    site: sendShipmentAmazonForm.value.site,
  })
  if (data) {
    await downloadFile('/encasement/download', {
      fileName: data,
    })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  sendShipmentCheckVisible.value = false
  sendShipmentLoading.value = false
}
// 计算某些列的自适应宽度
const handleCalculateWidth = (item: any) => {
  switch (item.label) {
    case '毛重(kg)': {
      return flexColumnWidth(list.value, '毛重(kg)------', 'grossWeight')
    }
    case '长(cm)': {
      return flexColumnWidth(list.value, '长(cm)-', 'length')
    }
    case '宽(cm)': {
      return flexColumnWidth(list.value, '宽(cm)-', 'width')
    }
    case '高(cm)': {
      return flexColumnWidth(list.value, '高(cm)-', 'height')
    }
    case '总重量(kg)': {
      return flexColumnWidth(list.value, '总重量(kg)', 'totalWeight')
    }
    case '总体积(m3)': {
      return flexColumnWidth(list.value, '总体积(m3)', 'totalVolume')
    }
    case '箱规号': {
      return flexColumnWidth(list.value, '箱规号', 'encasementNo')
    }
    case 'SKU': {
      return Math.max(flexColumnWidth(list.value, 'SKU', 'sku', 50), flexColumnWidth(list.value, 'Description', 'description'))
    }
    case 'Description': {
      return flexColumnWidth(list.value, 'Description-', 'description')
    }
    case '箱数': {
      return flexColumnWidth(list.value, '箱数', 'numberOfBoxes', 150)
    }
    case '数量': {
      return flexColumnWidth(list.value, '数量', 'number')
    }
    case '产品总数': {
      return flexColumnWidth(list.value, '产品总数', 'productTotalNumber')
    }
    case '装箱人': {
      return Math.max(flexColumnWidth(list.value, '装箱人', 'partnerNames'), 160)
    }
    case '装箱图片': {
      return 210
    }
    default: {
      return item.minWidth
    }
  }
}
const handleMove = (event: any) => {
  const { related } = event
  const targetIndex = Array.from(related.parentNode.children).indexOf(related)

  if (columns.value[targetIndex]?.disableCheck) {
    return false // 禁止移动到目标
  }

  return true // 允许其他操作
}
const handleEnd = async () => {
  const req = columns.value
    .filter((item: any) => item.columnId)
    .map((item: any, index: number) => {
      return {
        userId: item.userId,
        columnId: item.columnId,
        sort: index,
        // label: item.label
      }
    })
  await updateSortOperationColumn(req)
}
// 是否显示或隐藏列
const handleChecked = async (item: any) => {
  item.checked = !item.checked
  if (!item.columnId) return
  const status = item.checked === true ? 1 : 0
  await hideOrShowOperationColumn({
    userId: item.userId,
    columnId: item.columnId,
    status,
  })
}
const selectedRowIndex = ref<number>(-1)
const handleRowClick = (row: any) => {
  selectedRowIndex.value = row.id
}
let _row: any
const remarkVisible = ref<boolean>(false)
const remark = ref<string>('')
const viewOrderList = ref<IGetOperationOrderTable[]>([])
const _sku = ref<string>('')
const handleCellClick = async (row: any, column: any, cell: HTMLTableCellElement) => {
  if (column.label === '备注') {
    remarkVisible.value = true
    remark.value = row.remarks
    _row = row
  } else if (column.label === '产品总数') {
    _sku.value = row.sku
    const { data } = await getOperationOrderTable({
      sku: row.sku,
      site: row.planSiteId,
    })
    viewOrderList.value = data
    viewOrderVisible.value = true
  }
}
const handleUpdateRemark = async (val: string) => {
  try {
    const { data } = await updateEncasementRemark({ id: _row.id, remarks: val })
    if (data) {
      $baseMessage('修改备注成功！', 'success')
      remarkVisible.value = false
      _row.remarks = val
    }
  } catch (error) {}
}
// 站点 -> 自定义颜色映射
const getSiteBaseColor = (siteName: string) => {
  if (!siteName) return '#909399'
  const colorMap: Record<string, string> = {
    亚马逊US美国: '#67C23A', // 绿色
    亚马逊UK英国: '#409EFF', // 蓝色
    亚马逊DE德国: '#8E44AD', // 紫色（由红色改为紫色）
    亚马逊CA加拿大: '#2AC3A2', // 青绿
    沃尔玛US美国: '#E6A23C', // 橙色
    亚马逊JP日本: '#5C6BC0', // 靛蓝
    Tiktok美国: '#34495E', // 深石板色
    '美国-海外仓': '#909399', // 灰色
  }
  return colorMap[siteName] ?? '#909399'
}

// 返回协调的tag样式：浅色背景 + 同色文字
const getSiteTagStyle = (siteName: string) => {
  const base = getSiteBaseColor(siteName)
  // 将16进制转换为rgba，背景使用较低透明度
  const hexToRgba = (hex: string, alpha = 0.15) => {
    const h = hex.replace('#', '')
    const bigint = parseInt(h, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return {
    backgroundColor: hexToRgba(base, 0.15),
    color: base,
    border: '1px solid ' + hexToRgba(base, 0.35),
    fontSize: '14px',
  }
}

// 获取供应商名称的辅助函数
const getChannelName = (channelId: number) => {
  if (!channelId || !channelList.value) return ''
  const channel = channelList.value.find((item: any) => item.id === channelId)
  return channel ? channel.label : ''
}
const updateErrorVisible = ref<boolean>(false)
const showUpdateError = async () => {
  updateErrorVisible.value = true
  const { data } = await getEncasementError()
  errorForm.error = data
}
const handleConfirmUpdateError = async () => {
  const { data } = await updateEncasementError({ error: Number(errorForm.error) / 100 })
  if (data) {
    $baseMessage('修改误差成功！', 'success')
    updateErrorVisible.value = false
  }
}
const errorFormRef = ref<FormInstance>()
const errorForm = reactive({ error: '' })
const errorFormRules: FormRules = {
  error: [{ required: true, message: '请输入误差', trigger: 'blur' }],
}
const router = useRouter()
const route = useRoute()
const printer = ref<string>('')
const listLoading = ref<boolean>(false)
const list = ref<IEncasementList[]>([])
const total = ref<number>(0)
const queryForm = reactive<IGetEncasementListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: undefined,
  filters: [], // 筛选条件数组
})
const exportSizeVisible = ref<boolean>(false)
const exportSizeLoading = ref<boolean>(false)
const newSkuList = ref<string[]>([])
const showExportSize = async () => {
  const { data } = await getProductNewSkuList()
  newSkuList.value = data
  exportSizeVisible.value = true
}
const handleExportSize = async () => {
  exportSizeLoading.value = true
  const res = await downloadFileN('/encasement/exportSize')
  if (res) {
    exportSizeLoading.value = false
  }
}
const handleSortChange = (data: { column: any; prop: string; order: any }) => {
  const { column, prop, order } = data
  // console.log(order)
  if (prop === 'shipmentPlanDate') {
    if (!order) {
      if (queryForm.shipmentDataSort === 0) {
        column.order = 'descending'
      } else if (queryForm.shipmentDataSort === 1) {
        column.order = 'ascending'
      }
    }
    queryForm.shipmentDataSort = column.order === 'ascending' ? 0 : 1
    queryForm.grossWeightSort = undefined
    queryForm.createTimeSort = undefined
    queryForm.totalVolumeSort = undefined
  } else if (prop === 'grossWeight') {
    if (!order) {
      if (queryForm.grossWeightSort === 0) {
        column.order = 'descending'
      } else if (queryForm.grossWeightSort === 1) {
        column.order = 'ascending'
      }
    }
    queryForm.grossWeightSort = column.order === 'ascending' ? 0 : 1
    queryForm.shipmentDataSort = undefined
    queryForm.createTimeSort = undefined
    queryForm.totalVolumeSort = undefined
  } else if (prop === 'createTime') {
    if (!order) {
      if (queryForm.createTimeSort === 0) {
        column.order = 'descending'
      } else if (queryForm.createTimeSort === 1) {
        column.order = 'ascending'
      }
    }
    queryForm.createTimeSort = column.order === 'ascending' ? 0 : 1
    queryForm.grossWeightSort = undefined
    queryForm.shipmentDataSort = undefined
    queryForm.totalVolumeSort = undefined
  } else if (prop === 'totalVolume') {
    if (!order) {
      if (queryForm.totalVolumeSort === 0) {
        column.order = 'descending'
      } else if (queryForm.totalVolumeSort === 1) {
        column.order = 'ascending'
      }
    }
    queryForm.totalVolumeSort = column.order === 'ascending' ? 0 : 1
    queryForm.grossWeightSort = undefined
    queryForm.shipmentDataSort = undefined
    queryForm.createTimeSort = undefined
  }
  queryData()
}
const printCountVisible = ref<boolean>(false)
const printForm = reactive<{ count: number | undefined }>({
  count: undefined,
})
const printFormRef = ref<FormInstance>()
const printFormRules = reactive<FormRules>({
  count: [{ required: true, message: '请输入打印数量', trigger: 'blur' }],
})
// 修改可见
const modifyVisible = ref<boolean>(false)
// 传递给装箱的site
const passSite = ref<number>()
// 传递给装箱的装箱号
const encasementNo = ref<number>(0)
// 传递给装箱的合作人
const boxPartner = ref<number[]>([])
// 箱号可见
const boxNumberVisible = ref<boolean>(false)
// 装箱可见
const packingVisible = ref<boolean>(false)
// 上传拆分可见
const uploadSplitVisible = ref<boolean>(false)
const uploadSplitUploadRef = ref<any>(null)
const openUploadSplit = () => {
  // 清空上传组件内的文件列表
  try {
    uploadSplitUploadRef.value?.clearFiles?.()
  } catch {}
  uploadSplitVisible.value = true
}
// 上传pdf可见
const uploadPdfVisible = ref<boolean>(false)

// 拆分可见
const splitVisible = ref<boolean>(false)
const splitForm = reactive<{ splitCount: number | undefined }>({
  splitCount: undefined,
})
const splitFormRef = ref<FormInstance>()
const splitFormRules = reactive<FormRules<{ splitCount: number | undefined }>>({
  splitCount: [{ required: true, message: '请输入拆分数量', trigger: 'blur' }],
})

// 站点列表
const siteList = ref<ISiteOption[]>([])

// 多选的行
const selectRows = ref<any>([])
// 总箱数
const totalBoxNumber = computed<number>(() => {
  return selectRows.value.reduce((total: number, item: IEncasementList) => {
    const boxes = Number(item.numberOfBoxes) || 0
    return total + boxes // 累加每个 item.numberOfBoxes
  }, 0) // 初始值为 0
})
// 总重
const totalWeight = computed<number>(() => {
  const total = selectRows.value.reduce((sum: number, item: IEncasementList) => {
    const weight = Number(item.totalWeight) || 0
    return sum + weight
  }, 0)
  return Number(total)
})
// 总体积
const totalVolume = computed<number>(() => {
  const total = selectRows.value.reduce((sum: number, item: IEncasementList) => {
    const volume = Number(item.totalVolume) || 0
    return sum + volume
  }, 0)
  return Number(total)
})
// 发货（沃尔玛）可见
const shippingWalmartVisible = ref<boolean>(false)
// 发货（亚马逊）可见
const shippingAmazonVisible = ref<boolean>(false)
// 发货亚马逊表单
const shipmentAmazonForm = reactive<any>({
  type: 1,
})
const shipmentWalmartForm = reactive<any>({})
const shipmentWalmartFormRef = ref<FormInstance>()
const shipmentAmazonFormRef = ref<FormInstance>()
// 发货亚马逊文件上传
const fileList = ref<any>([])
// 修改发货计划可见
const modifyPlanVisible = ref<boolean>(false)
// 发货计划表单
const shippingPlanForm = reactive<any>({})
const shippingPlanFormRules = reactive<any>({
  date: [{ required: true, message: '请选择发货计划日期', trigger: 'change' }],
})
const shippingPlanFormRef = ref<FormInstance>()
// 发货规划可见
const shippingPlanningVisible = ref<boolean>(false)
// 发货规划表单
const shippingPlanningForm = reactive<any>({})
const shippingPlanningFormRef = ref<FormInstance>()
// 上传拆分表单
const uploadSplitForm = reactive<any>({})
const uploadSplitFormRef = ref<FormInstance>()
// 禁止下载模板文件
const file2Disabled = ref<boolean>(true)
// 禁止下载装箱文件和装箱表格
const file3Disabled = ref<boolean>(true)
// 确认打印
const handleConfirmPrint = async () => {
  if (Number(printForm.count!) > 50) {
    $baseMessage('打印数量不能超过50', 'error')
    return
  }
  printFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await printEncasement({
        encasementId: _id.value,
        quantity: printForm.count!,
      })
      if (data) {
        // const { data: res } = await printEncasementSuccess(JSON.stringify(data))
        // if (res) {
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
// 修改箱数
const handleBoxNumberChange = async (currentValue: number | undefined, oldValue: number | undefined, row: IEncasementList) => {
  if (currentValue! > oldValue!) {
    try {
      const { data } = await plusEncasementCount({
        encasementId: row.id!,
      })
      if (data) {
        fetchData()
      }
    } catch {
      // 还原回原来的值
      row.numberOfBoxes = oldValue
    }
  } else if (currentValue! < oldValue!) {
    try {
      const { data } = await reduceEncasementCount({
        encasementId: row.id!,
      })
      if (data) {
        fetchData()
      }
    } catch {
      row.numberOfBoxes = oldValue
    }
  }
}
// 不许编辑箱数
const handleKeyDown = () => {}
// 解锁
const handleUnlockEncasement = async () => {
  const { data } = await unlockEncasement()
  if (data) {
    $baseMessage('解锁成功', 'success')
  }
}
// 文件名
const fileName = ref<string>('')
// 发货亚马逊生成模板文件
const handleGenerateFile1 = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  const { data } = await generateTemplateFile1({
    encasementIds,
    type: shipmentAmazonForm.type,
  })
  fileName.value = data
  file2Disabled.value = false
}
// 下载模板文件
const handleDownloadFile = async () => {
  await downloadFile('/encasement/download', {
    fileName: fileName.value,
  })
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      console.log(error)
    })
}
const walmartFileName = ref<string>('')
// 发货沃尔玛 生成模板文件
const handleEncasementWalmart = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  const { data } = await generateWalmartShipment({
    encasementIds,
  })
  walmartFileName.value = data
  await downloadFile('/encasement/download', {
    fileName: data,
  })
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      console.log(error)
    })
  file3Disabled.value = false
}
// 发货亚马逊 文件上传的fileName
const fileName2 = ref<string>('')
// 发货亚马逊 文件上传
const UploadRequestHandler = async () => {
  let formData = new FormData()
  fileList.value.forEach((item: any) => {
    formData.append('file', item.raw)
  })
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  formData.append('encasementIds', encasementIds)
  formData.append('type', shipmentAmazonForm.type)
  const { data } = await uploadGenerateTemplateFile2(formData)
  fileName2.value = data
  file3Disabled.value = false
}
// 下载装箱文件
const handleDownloadEncasementFile = async () => {
  await downloadFile('/encasement/download', {
    fileName: fileName2.value,
  })
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      console.log(error)
    })
}
// 上传拆分的文件名
const splitFileName = ref<string>('')
// 上传拆分文件
const uploadSplitFile = async (file: any) => {
  // console.log(file);

  let formData = new FormData()
  formData.append('file', file.file)

  // for (const [key, value] of formData.entries()) {
  //   console.log(`${key}: ${value}`);
  // }

  const { data } = await uploadEncasementFile(formData)
  splitFileName.value = data
}
// 完成上传拆分
const submitSplitCsv = async () => {
  const { data } = await splitEncasementCsv({
    fileName: splitFileName.value,
    date: uploadSplitForm.date,
    remarks: uploadSplitForm.remarks,
  })
  if (data) {
    $baseMessage('上传拆分成功', 'success')
    closeUploadSplit()
    fetchData()
  }
}
// 生成装箱表格文件的fileName
const fileName3 = ref<string>('')
// 生成装箱表格文件和下载
const handleGenerateFile3 = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  const { data } = await generateTemplateFile3({
    encasementIds,
  })
  fileName3.value = data
  await downloadFile('/encasement/download', {
    fileName: fileName3.value,
  })
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      console.log(error)
    })
}
// 关闭 发货（亚马逊）
const closeShipmentAmazon = () => {
  shipmentAmazonFormRef.value?.resetFields()
  shippingAmazonVisible.value = false
}
// 完成 发货（沃尔玛）
const submitShipmentWalmart = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  const { data } = await finishWalmartShipment({
    encasementIds,
    contractNumber: shipmentWalmartForm.contractNumber,
    shipmentId: shipmentWalmartForm.shipmentId,
    site: shipmentWalmartForm.siteId,
    channel: shipmentWalmartForm.channel,
    templateFile1Name: walmartFileName.value,
    templateFile3Name: fileName3.value,
  })
  if (data) {
    $baseMessage('发货（沃尔玛）提交成功！', 'success')
    shippingWalmartVisible.value = false
    shipmentWalmartFormRef.value?.resetFields()
    fetchData()
  }
}
// 完成 发货（亚马逊）
const submitShipmentAmazon = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  // 发货亚马逊前置上锁请求
  const { data } = await doLockEncasement({
    encasementIds,
  })
  if (data) {
    const { data: res } = await confirmEncasementShipments({
      encasementIds,
      type: shipmentAmazonForm.type,
      templateFile1Name: fileName.value,
      templateFile2Name: fileName2.value,
      templateFile3Name: fileName3.value,
      contractNumber: shipmentAmazonForm.contractNumber,
      shipmentId: shipmentAmazonForm.shipmentId,
      site: shipmentAmazonForm.siteId,
      channel: shipmentAmazonForm.channel,
    })
    if (res) {
      $baseMessage('发货（亚马逊）提交成功！', 'success')
      closeShipmentAmazon()
      fetchData()
    }
  }
}
const pdfFileName = ref<string>('')
// 上传pdf
const uploadPdf = async (file: any) => {
  let formData = new FormData()
  formData.append('file', file.file)
  const { data } = await uploadEncasementFile(formData)
  pdfFileName.value = data
}
// 完成pdf
const handleSubmitPdf = async () => {
  downloadFile(`/encasement/pdf/insertPage`, {
    fileName: pdfFileName.value,
  })
}
// 关闭拆分
const closeUploadSplit = () => {
  uploadSplitFormRef.value?.resetFields()
  uploadSplitVisible.value = false
}
// 确认拆分
const confirmSplit = async () => {
  splitFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await splitEncasement({
        encasementId: copyRow.value.id,
        splitCount: splitForm.splitCount!,
      })
      if (data) {
        $baseMessage('拆分成功', 'success')
        closeUploadSplit()
        fetchData()
      }
    }
  })
}
// 关闭发货计划
const closeShippingPlan = () => {
  shippingPlanFormRef.value?.resetFields()
  modifyPlanVisible.value = false
}
// 确认修改发货计划
const confirmShippingPlan = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  const { data } = await updateEncasementShipmentDate({
    encasementIds,
    shipmentPlanDate: shippingPlanForm.date,
  })
  if (data) {
    $baseMessage('修改发货计划成功', 'success')
    closeShippingPlan()
    fetchData()
  }
}
// 关闭发货规划
const closeShippingPlanning = () => {
  shippingPlanningFormRef.value?.resetFields()
  shippingPlanningVisible.value = false
}
// 传递给修改的encasementId
const encasementId = ref<number>(0)
// 展示修改
const showModify = (row: IEncasementList) => {
  encasementId.value = row.id!
  modifyVisible.value = true
}
// 关闭修改
const closeModify = (value: boolean) => {
  modifyVisible.value = value
  fetchData()
}
// 是回插还是递增
const isReinsert = ref<boolean>(false)
// 展示箱号
const showBoxNumber = () => {
  boxPartner.value = []
  boxNumberVisible.value = true
}
const handleBoxNumberNext = (data: { boxNumber: number; site: number; partner: number[]; isReinsert: boolean }) => {
  boxNumberVisible.value = false
  packingVisible.value = true
  passSite.value = data.site
  encasementNo.value = data.boxNumber
  boxPartner.value = [...data.partner]
  isReinsert.value = data.isReinsert
}
// 装箱的关闭
const handlePackingClose = (value: boolean) => {
  packingVisible.value = value
}
const handleFinish = () => {
  queryData()
}
const setSelectRows = (value: IEncasementList[]) => {
  // 使用 Map 来去重，因为 Map 会根据键值唯一性自动去重
  const uniqueRows = Array.from(new Map(value.map((item) => [item.id, item])).values())

  // 更新 selectRows 为去重后的数组
  selectRows.value = uniqueRows
}

// 检查行是否被选中（用于多选列的显示状态）
const isRowSelected = (row: IEncasementList) => {
  return selectRows.value.some((item: IEncasementList) => item.id === row.id)
}

// 处理多选列复选框变化
const handleBackendCheckboxChange = (row: IEncasementList, checked: boolean | string | number) => {
  const isChecked = Boolean(checked)
  if (isChecked) {
    // 如果选中，添加到selectRows中（如果不存在）
    if (!isRowSelected(row)) {
      selectRows.value.push(row)
    }
  } else {
    // 如果取消选中，从selectRows中移除
    selectRows.value = selectRows.value.filter((item: IEncasementList) => item.id !== row.id)
  }
}

// 冻结箱号修改
const updateEncasementFreeze = async (val: any) => {
  const { data } = await encasementFreezeUpdate({
    encasementId: val.id,
    freeze: val.freeze,
  })

  if (data) {
    $baseMessage('冻结箱号修改成功！', 'success')
  }
}

// 全选状态计算属性
const isAllSelected = computed(() => {
  if (list.value.length === 0) return false

  // 获取去重后的list长度
  const uniqueListLength = new Set(list.value.map((item) => item.id)).size
  return selectRows.value.length === uniqueListLength
})

// 半选状态计算属性
const isIndeterminate = computed(() => {
  if (list.value.length === 0) return false

  // 获取去重后的list长度
  const uniqueListLength = new Set(list.value.map((item) => item.id)).size
  return selectRows.value.length > 0 && selectRows.value.length < uniqueListLength
})

// 处理全选/全不选
const handleSelectAll = (checked: boolean | string | number) => {
  const isChecked = Boolean(checked)
  if (isChecked) {
    // 全选：将去重后的所有行添加到selectRows中
    const uniqueList = Array.from(new Map(list.value.map((item) => [item.id, item])).values())
    selectRows.value = uniqueList
  } else {
    // 全不选：清空selectRows
    selectRows.value = []
  }
}
// 货代渠道列表
const channelList = ref<OptionType[]>([])
// 展示发货亚马逊
const showShippingAmazon = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  // 检查是否所有选中行都是亚马逊站点
  const hasNonWalmart = selectRows.value.some((item: any) => item.planSiteName.includes('沃尔玛'))
  if (hasNonWalmart) {
    $baseMessage('选中的装箱记录中包含非亚马逊站点，请仅选择发往亚马逊的记录', 'error')
    return
  }
  // 判断选中行中是否有已停产的记录
  const discontinuedRows = selectRows.value.filter((item: any) => item.discontinued === 1)
  if (discontinuedRows.length > 0) {
    const discontinuedSkus = discontinuedRows.map((item: any) => item.sku).join(',')
    $baseMessage(`${discontinuedSkus} 被运营标记停产无法发货。如要发货请联系运营取消停产标记后再发。`, 'error')
    return
  }
  // 清空上传列表
  fileList.value = []
  const encasementIds = selectRows.value.map((item: any) => item.id).join(',')
  const { data } = await checkEncasementShipment({ encasementIds })
  if (data) {
    const { data: res } = await getChannelList()
    channelList.value = res
    file2Disabled.value = true
    file3Disabled.value = true
    shippingAmazonVisible.value = true
    shipmentAmazonForm.site = data.siteName
    shipmentAmazonForm.siteId = data.siteId
    shipmentAmazonForm.channel = data.channelId
  }
}
// 展示发货沃尔玛
const showShippingWalmart = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  // 检查是否所有选中行都是沃尔玛站点
  const hasNonWalmart = selectRows.value.some((item: any) => !item.planSiteName.includes('沃尔玛'))
  if (hasNonWalmart) {
    $baseMessage('选中的装箱记录中包含非沃尔玛站点，请仅选择发往沃尔玛的记录', 'error')
    return
  }
  // 判断选中行中是否有已停产的记录
  const discontinuedRows = selectRows.value.filter((item: any) => item.discontinued === 1)
  if (discontinuedRows.length > 0) {
    const discontinuedSkus = discontinuedRows.map((item: any) => item.sku).join(',')
    $baseMessage(`${discontinuedSkus} 被运营标记停产无法发货。如要发货请联系运营取消停产标记后再发。`, 'error')
    return
  }
  // 清空上传列表
  fileList.value = []
  const encasementIds = selectRows.value.map((item: any) => item.id).join(',')
  const { data } = await checkEncasementShipment({ encasementIds })
  if (data) {
    const { data: res } = await getChannelList()
    channelList.value = res
    file3Disabled.value = true
    shippingWalmartVisible.value = true
    shipmentWalmartForm.site = data.siteName
    shipmentWalmartForm.siteId = data.siteId
    shipmentWalmartForm.channel = data.channelId
  }
}
// 展示修改发货计划
const showModifyShippingPlan = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  modifyPlanVisible.value = true
}
const _id = ref<number>(0)
// 展示打印
const showPrint = (row: any) => {
  printForm.count = row.numberOfBoxes
  _id.value = row.id
  printCountVisible.value = true
}
const copyRow = ref<any>()
// 展示拆分
const showSplit = (row: any) => {
  copyRow.value = row
  splitVisible.value = true
}
// 删除装箱
const handleDelEncasement = async (row: any) => {
  $baseConfirm('确定删除本条装箱信息吗？', null, async () => {
    const { data } = await delEncasement({
      encasementId: row.id,
    })
    if (data) {
      $baseMessage('删除本条装箱信息成功', 'success')
      fetchData()
    }
  })
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
const cellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '备注') {
    return {
      textAlign: 'left',
      cursor: 'pointer',
    }
  } else if (label === '产品总数') {
    return {
      textAlign: 'center',
      cursor: 'pointer',
    }
  } else if (label === 'SKU' || label === 'Description') {
    return {
      textAlign: 'left',
    }
  } else {
    return {
      textAlign: 'center',
    }
  }
}
let previous: any = null
let currentGroupIndex = 0 // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row

  const stripedClass = row.id % 2 === 0 ? 'el-table__row--striped' : ''

  // 选中状态
  const selectedClass = row.id === selectedRowIndex.value ? 'select-row' : ''

  // 组合类名
  return [stripedClass, selectedClass].filter(Boolean).join(' ')
}
// 装箱合并方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  // 设置需要合并的列
  const label = column.label
  if (
    label !== 'SKU' &&
    label !== 'Description' &&
    label !== '带磁' &&
    label !== '数量' &&
    label !== '产品总数' &&
    label !== '推荐数量' &&
    label !== '最晚补货' &&
    label !== '总可售' &&
    label !== '断货' &&
    label !== '木制品' &&
    label !== '玩具' &&
    label !== '装箱图片'
  ) {
    // 获取当前row的零件id
    const id = row.id
    // 默认不跨行
    let rowspan = 1
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++
      } else {
        break
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
// 获取站点信息
const fetchSiteData = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
}

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getEncasementList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
const handleChangePrinter = async () => {
  try {
    await updateEncasementUserPrinter({ printer: printer.value })
  } catch (error) {
    $baseMessage(error, 'error')
  }
}
// 获取默认打印机
const fetchDefaultPrinter = async () => {
  const { data } = await getEncasementUserPrinter()
  printer.value = data
}
const fetchColumn = async () => {
  const { data } = await getOperationColumnList({ type: 15 })
  columns.value = data
  const fallbackColumns = [
    { label: '装箱人', prop: 'partnerNames', width: 160, checked: true },
    { label: '装箱图片', prop: 'packingImagePaths', width: 210, checked: true },
  ]
  fallbackColumns.forEach((column) => {
    if (!columns.value.some((item: any) => item.label === column.label || item.prop === column.prop)) {
      columns.value.push({
        ...column,
        localOnly: true,
      })
    }
  })
  columns.value.forEach((item: any) => {
    item.minWidth = item.width
    if (['shipmentPlanDate', 'createTime', 'grossWeight', 'totalVolume'].includes(item.prop)) {
      item.sortable = true
    }
  })
}
onBeforeMount(() => {
  fetchColumn()
  const { pageNo, pageSize } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  fetchSiteData()
  fetchDefaultPrinter()
  fetchData()
})
</script>

<style lang="scss" scoped>
// 筛选条件组样式
.filter-group {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 1px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f3f4;
  }

  :deep(.el-checkbox) {
    margin-right: 12px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.2);
  transform-origin: center;
}
:deep(.dialog .el-dialog__body) {
  padding-top: 5px;
}
.text-center {
  margin: 0 10px calc(var(--el-margin) / 2) 0;
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

.packing-image-list {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.packing-image-more {
  width: 50px;
  height: 50px;
  padding: 0;
}

/* 发货计划区域样式 */
.shipping-plan-section {
  display: inline-flex;
  align-items: center;
  gap: 0;
  margin: 0 10px calc(var(--el-margin) / 2) 0;
  padding: 5px 10px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.3s ease;
  height: 40px; /* 增加高度以容纳padding */

  &:hover {
    background: #f1f3f4;
    border-color: #d0d7de;
  }
}

.shipping-plan-label {
  font-size: var(--el-font-size-base);
  font-weight: 500;
  color: #495057;
  white-space: nowrap;
  padding: 0 8px 0 0px;
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 1px solid #e9ecef;
}

.shipping-plan-button {
  margin-left: 0;
  padding: 6px 12px;
  height: 32px;
  border-radius: 0 4px 4px 0;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    background: #67c23a;
    transform: none;
    box-shadow: none;
  }
}

/* 统计样式 */
.summary-info {
  margin: 0px 10px calc(var(--el-margin) / 2) 15px;
}
.compact-statistic {
  :deep() {
    .el-statistic__head {
      margin-bottom: 0;
      font-size: 14px;
    }
    .el-statistic__content {
      margin-top: 2px;
      font-size: 18px;
    }
  }
}

/* 操作按钮样式 */
.operation-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

/* 供应商选择容器样式 */
.supplier-select-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.copy-btn {
  flex-shrink: 0;
}
.custom-table-right-tools {
  display: flex;
  justify-content: flex-end;
  margin-top: -6px; /* 往上提一点 */
  margin-bottom: 6px;
}
.handle {
  cursor: grab;
}
.icon-dis {
  padding: 6px;
}
.icon-hover {
  padding: 6px;
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 动画过渡效果 */
}
.icon-hover:hover {
  color: var(--el-color-primary);
  background-color: #f2f2f2; /* 浅灰色背景 */
}
.disabled-handle {
  cursor: not-allowed;
}
</style>
