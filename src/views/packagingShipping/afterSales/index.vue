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
                <el-input v-model="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          stripe border
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="pendingCellStyle"
          class="noneHoveTable"
          :cell-class-name="pendingCellClassName"
          :data="list"
          @cell-click="pendingInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="createTime">
            <template #default="{ row }">
              {{ row.createTime ? row.createTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="订货日期" min-width="115" prop="orderTime">
            <template #default="{ row }">
              {{ row.orderTime ? row.orderTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImageUrl" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="productionHaltStatus" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200" prop="suppliser">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"></el-table-column>
          <el-table-column label="好" prop="goodCount"></el-table-column>
          <el-table-column label="多" prop="manyCount"></el-table-column>
          <el-table-column label="留样" prop="keepSampleCount"></el-table-column>
          <el-table-column label="缺" prop="lackCount"></el-table-column>
          <el-table-column label="坏" prop="badCount"></el-table-column>
          <el-table-column label="待售后￥" min-width="100" prop="salesPrice"></el-table-column>
          <el-table-column label="打包反馈备注" min-width="200" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <el-space>
                <el-button type="primary" text @click="showMove">移动到已联系</el-button>
                <el-button type="primary" text @click="showAfterSalesLog(row)">售后日志</el-button>
              </el-space>
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
      </el-tab-pane>
      <el-tab-pane label="已联系" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          stripe border
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="contactedCellStyle"
          class="noneHoveTable"
          :cell-class-name="contactedCellClassName"
          :data="list"
          @cell-click="contactedInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="createTime">
            <template #default="{ row }">
              {{ row.createTime ? row.createTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="订货日期" min-width="115" prop="orderTime">
            <template #default="{ row }">
              {{ row.orderTime ? row.orderTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImageUrl" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="productionHaltStatus" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200" prop="suppliser">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"></el-table-column>
          <el-table-column label="好" prop="goodCount"></el-table-column>
          <el-table-column label="多" prop="manyCount"></el-table-column>
          <el-table-column label="留样" prop="keepSampleCount"></el-table-column>
          <el-table-column label="缺" prop="lackCount"></el-table-column>
          <el-table-column label="坏" prop="badCount"></el-table-column>
          <el-table-column label="待售后￥" min-width="100" prop="salesPrice"></el-table-column>
          <el-table-column label="已退款￥" min-width="100" prop="refundAmount">
            <template #default="{ row }">
              <el-input v-model="row.refundAmount" clearable @change="handleUpdateAfterSales(row)"/>
            </template>
          </el-table-column>
          <el-table-column label="当前售后方式" min-width="150" prop="afterSalesMethod">
            <template #default="{ row }">
              <el-select v-model="row.afterSalesMethod" style="min-width: 100%" @change="handleUpdateAfterSales(row)">
                <el-option 
                  v-for="item in afterSalesOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="凭证上传" width="82">
            <template #header>
              凭证<br>上传
            </template>
            <template #default="{ row }">
              <el-upload 
                list-type="picture-card" 
                :file-list="row.imageList" 
                :class="{ hide: row.hide }"
                class="component-upload"
                :http-request="(file) => uploadImage(file, row)"
              >
                <el-icon ><Plus /></el-icon>
                <template #file="{ file }">
                  <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePreview(file)"
                      >
                        <el-icon><zoom-in /></el-icon>
                      </span>
                        <span
                          class="el-upload-list__item-delete"
                          @click="handleRemove(row)"
                        >
                        <el-icon><Delete /></el-icon>
                      </span>
                    </span>
                  </div>
                </template>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column label="打包反馈备注" min-width="180" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-space>
                <el-button type="primary" text >采购申请</el-button>
                <el-button type="primary" text @click="handleArchive(row)">归档</el-button>
              </el-space>
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
      </el-tab-pane>
      <el-tab-pane label="已完成" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          stripe border
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="contactedCellStyle"
          class="noneHoveTable"
          :cell-class-name="contactedCellClassName"
          :data="list"
          @cell-click="contactedInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="createTime">
            <template #default="{ row }">
              {{ row.createTime ? row.createTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="订货日期" min-width="115" prop="orderTime">
            <template #default="{ row }">
              {{ row.orderTime ? row.orderTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImageUrl" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="productionHaltStatus" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200" prop="suppliser">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"></el-table-column>
          <el-table-column label="好" prop="goodCount"></el-table-column>
          <el-table-column label="多" prop="manyCount"></el-table-column>
          <el-table-column label="留样" prop="keepSampleCount"></el-table-column>
          <el-table-column label="缺" prop="lackCount"></el-table-column>
          <el-table-column label="坏" prop="badCount"></el-table-column>
          <el-table-column label="待售后￥" min-width="100" prop="salesPrice"></el-table-column>
          <el-table-column label="已退款￥" min-width="100" prop="refundAmount"></el-table-column>
          <el-table-column label="当前售后方式" min-width="150" prop="afterSalesMethod">
            <template #default="{ row }">
              <el-select v-model="row.afterSalesMethod" style="min-width: 100%" disabled>
                <el-option 
                  v-for="item in afterSalesOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="凭证上传" width="82">
            <template #header>
              凭证<br>上传
            </template>
            <template #default="{ row }">
              <el-image :src="row.url" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="打包反馈备注" min-width="180" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
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
      </el-tab-pane>
      <el-tab-pane label="多" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          stripe border
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="pendingCellStyle"
          class="noneHoveTable"
          :cell-class-name="pendingCellClassName"
          :data="list"
          @cell-click="pendingInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="createTime">
            <template #default="{ row }">
              {{ row.createTime ? row.createTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="订货日期" min-width="115" prop="orderTime">
            <template #default="{ row }">
              {{ row.orderTime ? row.orderTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImageUrl" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="productionHaltStatus" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200" prop="suppliser">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"></el-table-column>
          <el-table-column label="好" prop="goodCount"></el-table-column>
          <el-table-column label="多" prop="manyCount"></el-table-column>
          <el-table-column label="留样" prop="keepSampleCount"></el-table-column>
          <el-table-column label="缺" prop="lackCount"></el-table-column>
          <el-table-column label="坏" prop="badCount"></el-table-column>
          <el-table-column label="待售后￥" min-width="100" prop="salesPrice"></el-table-column>
          <el-table-column label="打包反馈备注" min-width="180" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <el-space>
                <el-button type="primary" text @click="showMove">移动到已联系</el-button>
                <el-button type="primary" text @click="showAfterSalesLog(row)">售后日志</el-button>
              </el-space>
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
      </el-tab-pane>
      <el-tab-pane label="坏账" :name="4">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          stripe border
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="contactedCellStyle"
          class="noneHoveTable"
          :cell-class-name="badDebtsCellClassName"
          :data="list"
          @cell-click="contactedInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="createTime">
            <template #default="{ row }">
              {{ row.createTime ? row.createTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="订货日期" min-width="115" prop="orderTime">
            <template #default="{ row }">
              {{ row.orderTime ? row.orderTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.skuImageUrl" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="productionHaltStatus" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200" prop="suppliser">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"></el-table-column>
          <el-table-column label="任务数"></el-table-column>
          <el-table-column label="好" prop="goodCount"></el-table-column>
          <el-table-column label="多" prop="manyCount"></el-table-column>
          <el-table-column label="留样" prop="keepSampleCount"></el-table-column>
          <el-table-column label="缺" prop="lackCount"></el-table-column>
          <el-table-column label="坏" prop="badCount"></el-table-column>
          <el-table-column label="待售后￥(含税)" min-width="100" prop="salesPrice">
            <template #header>
              待售后￥<br>(含税)
            </template>
          </el-table-column>
          <el-table-column label="已退款￥" min-width="100" prop="refundAmount"></el-table-column>
          <el-table-column label="坏账金额￥" min-width="110" prop="badDebtPrice"></el-table-column>
          <el-table-column label="打包反馈备注" min-width="180" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" text @click="showAfterSalesLog(row)">售后日志</el-button>
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
      </el-tab-pane>
    </el-tabs>
    <!-- 移动到已联系 -->
    <vab-dialog
      title="已联系"
      width="23%"
      v-model="moveVisible"
      @close="closeMove"
    >
      <el-form ref="contactedFormRef" :model="contactedForm" label-position="right" label-width="auto" style="margin-left: 10px; margin-right: 10px">
        <el-form-item label="选择售后方式" prop="type">
          <el-select v-model="contactedForm.type">
            <el-option
              v-for="item in afterSalesOption"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="contactedForm.remark" type="textarea" resize="none"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="closeMove">取消</el-button>
        <el-button type="success">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 采购申请 -->
    <vab-dialog
      title="采购申请"
      width="60%"
      v-model="purchaseRequisitionVisible"
    >
      <el-table
        border stripe
        :header-cell-style="{ textAlign: 'center' }"
        :data="fakePurchaseData"
      >
        <el-table-column label="图片"></el-table-column>
        <el-table-column label="零件ID" prop="id" min-width="70"></el-table-column>
        <el-table-column label="零件名" min-width="150"></el-table-column>
        <el-table-column label="订货总数"></el-table-column>
        <el-table-column label="单位" min-width="70"></el-table-column>
        <el-table-column label="原因" min-width="150"></el-table-column>
        <el-table-column label="默认供应商" min-width="150"></el-table-column>
        <el-table-column label="收货仓库" min-width="150"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="danger" text>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button type="danger" @click="purchaseRequisitionVisible = false">取消</el-button>
        <el-button type="success">提交审批</el-button>
      </template>
    </vab-dialog>
    <!-- 售后日志 -->
    <vab-dialog
      title="售后日志"
      width="57%"
      v-model="afterSalesLogVisible"
    >
      <el-table
        border stripe
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="afterSalesLogCellStyle"
        :data="afterSalesLogList"
      >
        <el-table-column label="反馈日期" min-width="115" prop="createTime">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.split(' ')[0] : ''}}
          </template>
        </el-table-column>
        <el-table-column label="任务ID" min-width="70" prop="taskId"></el-table-column>
        <el-table-column label="任务数" min-width="100"></el-table-column>
        <el-table-column label="好" min-width="100" prop="goodCount"></el-table-column>
        <el-table-column label="多" min-width="100" prop="manyCount"></el-table-column>
        <el-table-column label="留样" min-width="100" prop="keepSampleCount"></el-table-column>
        <el-table-column label="缺" min-width="100" prop="lackCount"></el-table-column>
        <el-table-column label="坏" min-width="100" prop="badCount"></el-table-column>
        <el-table-column label="待售后￥" min-width="100" prop="salesPrice"></el-table-column>
        <el-table-column label="备注" min-width="180" prop="remark"></el-table-column>
      </el-table>
    </vab-dialog>
    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorLogVisible"
      :content="LogCopy"
      @clickChild="confirmEditorLog"
      @clickBoolean="cancelEditorLog"
      :classify="classify"
    />
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, Search, ZoomIn } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext, UploadFile } from 'element-plus'
import { archiveAfterSales, badDebtAfterSales, checkAfterSalesArchive, deleteAfterSales, getAfterSalesList, getAfterSalesLog, updateAfterSales, uploadAfterSales } from '~/src/api/devlocal/packagingShipping'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'


defineOptions({
  name: 'afterSalesTable',
})

const activeName = ref<number>(0)
const router = useRouter()

const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)

const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 0
})

const fakePurchaseData = [
  {
    id: 123
  }
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

// 已联系修改
const handleUpdateAfterSales = async (row: any) => {
  await updateAfterSales({
    id: row.id,
    salesPrice: row.refundAmount,
    salesMethod: row.afterSalesMethod
  })
}
const contactedForm = reactive<any>({
  type: 0,
  remark: ''
})
const contactedFormRef = ref<any>()
// 移动到已联系展示
const showMove = () => {
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
    poId: row.poId
  })
  afterSalesLogList.value = data
  afterSalesLogVisible.value = true
}
// 采购申请可见
const purchaseRequisitionVisible = ref<boolean>(false)
// 展示采购申请
const showPurchaseRequisition = () => {
  purchaseRequisitionVisible.value = true
}
async function uploadImage(params: any, row: any) {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', params.file);
    uploadImgForm.append('id', row.id);

    const { data } = await uploadAfterSales(uploadImgForm)
    row.hide = true

    Object.assign(row.imageList, [{ url: data }])
    
  } catch (error) {
    console.error(error)
  }
}
async function handleRemove(row: any) {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
      const { data } = await deleteAfterSales({
          id: row.id
      })
      if (data) {
          row.imageList = []
          row.hide = false
          $baseMessage("图片删除成功!","success","hey")
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  // Object.assign(list.value, [])
  if (tab.props.name !== undefined) {
    queryForm.status = Number(tab.props.name);  
  }
  fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getAfterSalesList(queryForm)
  if (data) {
    list.value = data.list
    total.value = data.total
    listLoading.value = false
    list.value.forEach((item: any) => {
      item.suppliser = item.suppliser.replace(/,/g, '<br>');
      item.remark = item.remark.replace(/,/g, '<br>');
      item.hide = false
      item.imageList = []
    })
  }
}

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
    id: row.id
  })
  if (data) {
    const { data: archive } = await archiveAfterSales({
      id: row.id
    })
    if (archive) {
      $baseMessage('已成功归档到已完成', 'success')
      fetchData()
    }
  } else {
    $baseConfirm(`有${row.badCount+row.lackCount}套产品，${row.salesPrice}金额会被记为坏账，是否继续？`, '系统提示', async () => {
      // 归类为坏账
      const { data: badDebt } = await badDebtAfterSales({
        id: row.id
      })
      if (badDebt) {
        $baseMessage('已成功归档到坏账', 'success')
        fetchData()
      }
    })
  }
}

const wangEditorTitle = ref<string>('')
const classify = ref<string>('')
const wangEditorLogVisible = ref<boolean>(false)
const LogCopy = ref<string>('')
const cancelEditorLog = () => {
  wangEditorLogVisible.value = false
}
const confirmEditorLog = (val: any) => {
  // const { data } = await updatePoContractTerms({ id: clickRow.value.existingPartsListId, contractTerms: val})
  //  if (data === true) {
  //      contractCopy.value = val
  //      clickRow.value.contractTerms = val
  //  }
  LogCopy.value = val
  clickRow.value.afterSalesLog = val
}
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
// 待联系点击输入框
const pendingInputChange = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0]
  if (getDataAttribute(el, 'img') && el) {
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }
}
const clickRow = ref<any>()
const contactedInputChange = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0]
  if (getDataAttribute(el, 'img') && el) {
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }
  if (column.property === 'afterSalesLog') {
    clickRow.value = row
    // const { data } = await reviewStepNo3PurchaseMatters({ reviewComponentId: row.id })
    LogCopy.value = row.afterSalesLog
    // row.afterSalesLog = data
    wangEditorTitle.value = '编辑售后日志'
    classify.value = 'afterSalesLog'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
  }
}
const handlePreview = (file: UploadFile) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(file.url!)
}
// 待联系cellStyle
const pendingCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex !== 4 && data.columnIndex !== 6 && data.columnIndex !== 14) {
    return {
      textAlign: 'center' as 'center'
    }
  }
}
// 前四个tab去掉padding和颜色显示
const pendingCellClassName = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => { 
  if (data.columnIndex === 3) {
    return 'clear-padding'
  }
  if (data.columnIndex === 8) {
    if (data.row.goodCount >= data.row.purchaseSkuNumber) {
      return 'green'
    }
    return 'red'
  }
  return ''
}
// 已联系和已完成去掉padding和颜色显示
const contactedCellClassName = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => { 
  if (data.columnIndex === 3 || data.columnIndex === 16) {
    return 'clear-padding'
  }
  if (data.columnIndex === 8) {
    if (data.row.goodCount >= data.row.purchaseSkuNumber) {
      return 'green'
    }
    return 'red'
  }
  return ''
}
// 坏账去掉padding和颜色显示
const badDebtsCellClassName = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => { 
  if (data.columnIndex === 3) {
    return 'clear-padding'
  }
  if (data.columnIndex === 9) {
    if (data.row.goodCount >= data.row.purchaseSkuNumber) {
      return 'green'
    }
    return 'red'
  }
  return ''
}
// 已联系cellStyle
const contactedCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex !== 4 && data.columnIndex !== 6 && data.columnIndex !== 17 && data.columnIndex !== 18) {
    return {
      textAlign: 'center' as 'center'
    }
  }
}
// 采购申请cellStyle
const afterSalesLogCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex !== 9) {
    return {
      textAlign: 'center' as 'center'
    }
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
          .clear-padding {
            padding-top: 0;
            padding-bottom: 0;
            .cell {
              padding-left: 0;
              padding-right: 0;
            }
          }
        }
      }
    }
  }
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}
/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
.noneHoveTable {
  :deep(.el-checkbox) {
    transform: scale(1.2);
    transform-origin: center;
  }
}
:deep(.red) {
  color: #F56C6C;
}
:deep(.green) {
  color: #67C23A;
}
// 设置下面表格的图片
.component-upload {
  width: 81px;
  height: 81.2px;
}
.component-upload :deep( .el-upload-list--picture-card) {
 width: 100%;
 height: 100%;
}
.component-upload :deep( .el-upload-list--picture-card .el-upload-list__item) {
 width: 100%;
 height: 100%;
 transition: none;
 margin: 0;
 border-radius: 0;
 border: 0;
}
.component-upload :deep( .el-upload--picture-card) {
  width: 100%;
  height: 100%;
}
.overflow-text {
  max-height: 65.2px;
  overflow-y: auto;
  display: block;
}
</style>
