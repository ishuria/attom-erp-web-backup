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
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border :cell-class-name="pendingCellClassName"
          :cell-style="pendingCellStyle"
          class="noneHoveTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
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
          <el-table-column label="PO" min-width="115" prop="po"/>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image fit="fill" :src="row.skuImageUrl" style="display: block; width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}<br />{{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column label="停产" min-width="60" prop="productionHaltStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" disabled :false-value="0" :true-value="1"/>
            </template>
          </el-table-column>
          <el-table-column label="供应商" prop="suppliser" :width="calculateBrColumnWidth(list, (row: any) => row.suppliser)">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"/>
          <el-table-column label="好" prop="goodCount"/>
          <el-table-column label="多" prop="manyCount"/>
          <el-table-column label="留样" prop="keepSampleCount"/>
          <el-table-column label="缺" prop="lackCount"/>
          <el-table-column label="坏" prop="badCount"/>
          <el-table-column label="待售后￥" min-width="100" prop="salesPrice"/>
          <el-table-column label="打包反馈备注" min-width="300" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
            </template>
          </el-table-column>
          <el-table-column label="售后日志" min-width="200" prop="salesLog">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.salesLog) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.salesLog) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="260">
            <template #default="{ row }">
              <el-space>
                <el-link type="primary" :underline="false" @click="showMove(row)">移动到已联系</el-link>
                <el-link type="primary" :underline="false" @click="showAfterSalesLog(row)">打包反馈日志</el-link>
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
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border :cell-class-name="contactedCellClassName"
          :cell-style="contactedCellStyle"
          class="noneHoveTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
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
          <el-table-column label="PO" min-width="115" prop="po"/>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image fit="fill" :src="row.skuImageUrl" style="display: block; width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}<br />{{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column label="停产" min-width="60" prop="productionHaltStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" disabled :false-value="0" :true-value="1"/>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200" prop="suppliser">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"/>
          <el-table-column label="好" prop="goodCount"/>
          <el-table-column label="多" prop="manyCount"/>
          <el-table-column label="留样" prop="keepSampleCount"/>
          <el-table-column label="缺" prop="lackCount"/>
          <el-table-column label="坏" prop="badCount"/>
          <el-table-column label="待售后￥" min-width="100" prop="salesPrice"/>
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
                class="component-upload" 
                :class="{ hide: row.hide }" 
                :file-list="row.imageList"
                :http-request="(file) => uploadImage(file, row)"
                list-type="picture-card"
              >
                <el-icon ><plus /></el-icon>
                <template #file="{ file }">
                  <div>
                    <img alt="" class="el-upload-list__item-thumbnail" :src="file.url" />
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
                        <el-icon><delete /></el-icon>
                      </span>
                    </span>
                  </div>
                </template>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column label="打包反馈备注" min-width="300" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
            </template>
          </el-table-column>
          <el-table-column label="售后日志" min-width="200" prop="salesLog">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.salesLog) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.salesLog) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="{ row }">
              <el-space>
                <el-button text type="primary" >采购申请</el-button>
                <el-button text type="primary" @click="handleArchive(row)">归档</el-button>
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
      <el-tab-pane label="已完成" :name="2">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border :cell-class-name="contactedCellClassName"
          :cell-style="contactedCellStyle"
          class="noneHoveTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
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
          <el-table-column label="PO" min-width="115" prop="po"/>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image fit="fill" :src="row.skuImageUrl" style="display: block; width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}<br />{{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column label="停产" min-width="60" prop="productionHaltStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" disabled :false-value="0" :true-value="1"/>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200" prop="suppliser">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"/>
          <el-table-column label="好" prop="goodCount"/>
          <el-table-column label="多" prop="manyCount"/>
          <el-table-column label="留样" prop="keepSampleCount"/>
          <el-table-column label="缺" prop="lackCount"/>
          <el-table-column label="坏" prop="badCount"/>
          <el-table-column label="待售后￥" min-width="100" prop="salesPrice"/>
          <el-table-column label="已退款￥" min-width="100" prop="refundAmount"/>
          <el-table-column label="当前售后方式" min-width="150" prop="afterSalesMethod">
            <template #default="{ row }">
              <el-select v-model="row.afterSalesMethod" disabled style="min-width: 100%">
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
              <el-image fit="fill" :src="row.voucherUrl" style="display: block; width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="打包反馈备注" min-width="300" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
            </template>
          </el-table-column>
          <el-table-column label="售后日志" min-width="200" prop="salesLog">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.salesLog) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.salesLog) }}</span>
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
      <el-tab-pane label="多" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border :cell-class-name="pendingCellClassName"
          :cell-style="pendingCellStyle"
          class="noneHoveTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
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
          <el-table-column label="PO" min-width="115" prop="po"/>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image fit="fill" :src="row.skuImageUrl" style="display: block; width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}<br />{{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column label="停产" min-width="60" prop="productionHaltStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" disabled :false-value="0" :true-value="1"/>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200" prop="suppliser">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"/>
          <el-table-column label="好" prop="goodCount"/>
          <el-table-column label="多" prop="manyCount"/>
          <el-table-column label="留样" prop="keepSampleCount"/>
          <el-table-column label="缺" prop="lackCount"/>
          <el-table-column label="坏" prop="badCount"/>
          <el-table-column label="待售后￥" min-width="100" prop="salesPrice"/>
          <el-table-column label="打包反馈备注" min-width="300" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
            </template>
          </el-table-column>
          <el-table-column label="售后日志" min-width="200" prop="salesLog">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.salesLog) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.salesLog) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="260">
            <template #default="{ row }">
              <el-space>
                <el-link type="primary" :underline="false" @click="showMove(row)">移动到已联系</el-link>
                <el-link type="primary" :underline="false" @click="showAfterSalesLog(row)">打包反馈日志</el-link>
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
            <el-button type="primary">售后历史</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border :cell-class-name="badDebtsCellClassName"
          :cell-style="contactedCellStyle"
          class="noneHoveTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
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
          <el-table-column label="PO" min-width="115" prop="po"/>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image fit="fill" :src="row.skuImageUrl" style="display: block; width: 100%; height: 100%" @click="showPreviewImage(row.skuImageUrl)">
                <template #error>
                  <el-icon/>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{ row.sku }}<br />{{ row.productName }}
            </template>
          </el-table-column>
          <el-table-column label="停产" min-width="60" prop="productionHaltStatus">
            <template #default="{ row }">
              <el-checkbox v-model="row.productionHaltStatus" disabled :false-value="0" :true-value="1"/>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200" prop="suppliser">
            <template #default="{ row }">
              <span v-html="row.suppliser"></span>
            </template>
          </el-table-column>
          <el-table-column label="PO总数" prop="purchaseSkuNumber"/>
          <el-table-column label="好" prop="goodCount"/>
          <el-table-column label="多" prop="manyCount"/>
          <el-table-column label="留样" prop="keepSampleCount"/>
          <el-table-column label="缺" prop="lackCount"/>
          <el-table-column label="坏" prop="badCount"/>
          <el-table-column label="待售后￥(含税)" min-width="100" prop="salesPrice">
            <template #header>
              待售后￥<br>(含税)
            </template>
          </el-table-column>
          <el-table-column label="已退款￥" min-width="100" prop="refundAmount"/>
          <el-table-column label="坏账金额￥" min-width="110" prop="badDebtPrice"/>
          <el-table-column label="打包反馈备注" min-width="300" prop="remark">
            <template #default="{ row }">
              <span v-html="row.remark"></span>
            </template>
          </el-table-column>
          <el-table-column label="售后日志" min-width="200" prop="salesLog">
            <template #default="{ row }">
              <el-tooltip content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ removeHtmlTags(row.salesLog) }}</div>
                </template>
                <span>{{ removeHtmlTags(row.salesLog) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="{ row }">
              <el-button text type="primary" @click="showAfterSalesLog(row)">打包反馈日志</el-button>
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
    <!-- 移动到已联系 -->
    <vab-dialog
      v-model="moveVisible"
      title="已联系"
      width="23%"
      @close="closeMove"
    >
      <el-form ref="contactedFormRef" label-position="right" label-width="auto" :model="contactedForm" style="margin-right: 10px; margin-left: 10px;">
        <el-form-item label="选择售后方式" prop="type">
          <el-select v-model="contactedForm.type">
            <el-option
              v-for="item in afterSalesOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="closeMove">取消</el-button>
        <el-button type="success" @click="confirmContacted">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 采购申请 -->
    <vab-dialog
      v-model="purchaseRequisitionVisible"
      title="采购申请"
      width="60%"
    >
      <el-table
        border :data="fakePurchaseData"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
      >
        <el-table-column label="图片"/>
        <el-table-column label="零件ID" min-width="70" prop="id"/>
        <el-table-column label="零件名" min-width="150"/>
        <el-table-column label="订货总数"/>
        <el-table-column label="单位" min-width="70"/>
        <el-table-column label="原因" min-width="150"/>
        <el-table-column label="默认供应商" min-width="150"/>
        <el-table-column label="收货仓库" min-width="150"/>
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
    <vab-dialog
      v-model="afterSalesLogVisible"
      title="打包反馈日志"
      width="57%"
    >
      <el-table
        border :cell-style="afterSalesLogCellStyle"
        :data="afterSalesLogList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
      >
        <el-table-column label="反馈日期" min-width="115" prop="createTime">
          <template #default="{ row }">
            {{ row.createTime ? row.createTime.split(' ')[0] : ''}}
          </template>
        </el-table-column>
        <el-table-column label="任务ID" min-width="70" prop="taskId"/>
        <el-table-column label="任务数" min-width="100" prop="packageTaskCount"/>
        <el-table-column label="好" min-width="100" prop="goodCount"/>
        <el-table-column label="多" min-width="100" prop="manyCount"/>
        <el-table-column label="留样" min-width="100" prop="keepSampleCount"/>
        <el-table-column label="缺" min-width="100" prop="lackCount"/>
        <el-table-column label="坏" min-width="100" prop="badCount"/>
        <el-table-column label="待售后￥" min-width="100" prop="salesPrice"/>
        <el-table-column label="日志类型" min-width="100" prop="logType"/>
        <el-table-column label="备注" min-width="180" prop="remark"/>
      </el-table>
    </vab-dialog>
    <wang-editor
      :classify="classify"
      :content="LogCopy"
      :title="wangEditorTitle"
      :wang-editor-visible="wangEditorLogVisible"
      @click-boolean="cancelEditorLog"
      @click-child="confirmEditorLog"
    />
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, Search, ZoomIn } from '@element-plus/icons-vue'
import type { TableInstance, TabsPaneContext, UploadFile } from 'element-plus'
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
  uploadAfterSales
} from '/@/api/devlocal/packagingShipping'
import { calculateBrColumnWidth, flexColumnWidth, removeHtmlTags } from '/@/utils/tableColum'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'

defineOptions({
  name: 'AfterSales',
})

const activeName = ref<number>(0)
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)

const total = ref<number>(0)

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
    salesMethod: row.afterSalesMethod
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
    poId: row.poId
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
const handleTabClick = (tab: TabsPaneContext) => {
  // Object.assign(list.value, [])
  if (tab.props.name !== undefined) {
    queryForm.status = Number(tab.props.name);  
  }
  router.push({
    query: {
      ...route.query,
      tab: tab.props.name
    }
  })
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
      item.suppliser = item.suppliser.replaceAll(',', '<br>');
      // item.remark = item.remark.replace(/,/g, '<br>');
      item.remark = item.remark.split(', ').map((item: string) => {
          return item.split(' ')[0] + item.slice(item.indexOf('：'));
      }).join('<br>');
      item.hide = false
      if(!item.voucherUrl) {
          item.hide = false
          item.imageList = []
      } else if (item.voucherUrl){
          item.hide = true
          item.imageList = [{ url: item.voucherUrl }]
      }
    })
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
const confirmEditorLog = async (val: any) => {
  const { data } = await updateAfterSalesLog({ id: clickRow.value.id, log: val})
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
//     classify.value = 'afterSalesLog'
//     wangEditorLogVisible.value = !wangEditorLogVisible.value
//   }
// }
const clickRow = ref<any>()
const contactedInputChange = async (row: any, column: any) => {
  if (column.property === 'salesLog') {
    clickRow.value = row
    const { data } = await getAfterSalesLogs({ id: row.id })
    LogCopy.value = row.salesLog
    row.salesLog = data
    wangEditorTitle.value = '编辑售后日志'
    classify.value = 'salesLog'
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
// 待联系cellStyle
const pendingCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex !== 4 && data.columnIndex !== 6 && data.columnIndex !== 14 && data.columnIndex !== 15) {
    return {
      textAlign: 'center' as const
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
      textAlign: 'center' as const
    }
  }
}
// 采购申请cellStyle
const afterSalesLogCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex !== 9) {
    return {
      textAlign: 'center' as const
    }
  }
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
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
 margin: 0;
 border: 0;
 border-radius: 0;
 transition: none;
}
.component-upload :deep( .el-upload--picture-card) {
  width: 100%;
  height: 100%;
}
.overflow-text {
  display: block;
  max-height: 65.2px;
  overflow-y: auto;
}
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
</style>