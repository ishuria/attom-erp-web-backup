<template>
  <div class="step-form-container poDetail-container" >
    <div :class="{ none: detailsNone }">
      <el-page-header  @back="goBack" style="margin-bottom: 0px;">
        <template #title>
          退出
        </template>
        <template #content>
          <div class="flex items-center">
            <span> <strong>{{ handlePoTitle() }}</strong></span>
            <el-button v-if="route.query.from !== 'plannedPoDetail' && route.query.from !== 'plannedPoCreate'" type="primary" style="margin-left: 10px">SKU替换</el-button>
          </div>
        </template>
      </el-page-header>
      <el-card class="product-details-card" shadow="never" >
        <el-row style="display: flex; width: 100%">
          <el-col class="custom-upload" :style="{ maxWidth: imageColumnHeight + 'px', padding: '0' }"> 
            <el-form label-position="top" >
              <el-form-item label="订货套数" >
                <el-input v-model="poDetailData.purchaseSkuNumber" @change="handleUpdateSkuCount"></el-input>
              </el-form-item>
              <el-form-item >
                <el-upload 
                  list-type="picture-card" 
                  :file-list="poDetailData.imageList" 
                  :class="{ hide: poDetailData.hide }"
                  :http-request="uploadImage"
                  class="upload-align"
                  :style="{ height: imageColumnHeight + 'px' }"
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
                          @click="handleRemove(file)"
                        >
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="flex: 1.3; padding: 0">
            <el-form label-position="top" :inline="true">
              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item label="SKU">
                    <el-input v-model="poDetailData.sku" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品名称">
                    <el-input v-model="poDetailData.productName" @change="handleUpdateSku"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item label="创建日期" data-label="创建日期">
                    <el-input v-model="poDetailData.createTime" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品经理">
                    <el-input v-model="poDetailData.productManager" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                  <el-col :span="12">
                    <el-form-item label="PO站点">
                      <el-select v-model="poDetailData.site" placeholder="请选择站点" @change="handleUpdatePoSite">
                        <el-option
                          v-for="item in siteList"
                          :label="item.label"
                          :value="item.value"
                          :key="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="收货仓库">
                          <el-select v-model="poDetailData.repositoryId" placeholder="请选择收货仓库" @change="handleUpdateSku">
                              <el-option
                                  v-for="item in repositoryOption"
                                  :label="item.label"
                                  :value="item.id"
                                  :key="item.id"
                              ></el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="4">
                  <el-form-item label="SKU总含税价" data-label="SKU总含税价">
                    <el-input v-model="poDetailData.orderTotalPrice" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="起订量" >
                    <el-input v-model="poDetailData.minQuantity" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="整箱数" >
                    <el-input v-model="poDetailData.numCartons" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12"> 
                  <el-form-item label="我方打包整箱数(近10次)">
                    <el-input v-model="poDetailData.packedTenRecord" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col style="flex: 1; padding: 0">
            <el-form label-position="top" >
              <el-row>
                <el-col :span="12">
                  <el-form-item >
                    <el-space>
                        <span style="font-size: var(--el-form-label-font-size);">SKU备注</span>
                    </el-space>
                    <el-input type="textarea" :rows="11" v-model="poDetailData.skuRemarks" disabled resize="none"></el-input>
                  </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item style="margin-right: 0">
                      <el-space>
                          <span style="font-size: var(--el-form-label-font-size);">PO备注</span>
                      </el-space>
                      <el-input type="textarea" :rows="11" v-model="poDetailData.poRemarks" @change="handleRemarksChange" resize="none"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <el-page-header  @back="goBack" style="margin-bottom: 0px;">
        <template #title>
          退出
        </template>
        <template #content>
          <div class="flex items-center">
            <span> <strong> SKU零配件清单（与开票一致） </strong></span>
          </div>
        </template>
      </el-page-header>
      <div class="comprehensive-table-container">
        <vab-query-form>
          <vab-query-form-left-panel style="margin-top: 10px;" :span="24">
            <el-button type="primary" @click="handleAddComponent">添加零件</el-button>
            <el-button type="primary" @click="handleAddConsumable">添加耗材</el-button>
            <el-button type="primary" @click="handleUpdateAllComponentPrice">价格更新</el-button>
            <el-button type="primary" @click="handleShowUpdatePurchaserDialog">采购方和不报关更新</el-button>
            <el-text type="danger" class="text-center">注意：零件名修改仅限品名规范修正，严禁将一个零件的名字修改为另外一个零件</el-text>
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-table 
          ref="tableRef" 
          stripe border 
          :data="skuComponentList"
          :header-cell-style="{ 'text-align': 'center' }"
          @cell-click="changeInput"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :cell-class-name="getCellClass"
        >
          <el-table-column align="center" label="图片" width="81.2px" fixed="left">
              <template #default="{ row }">
                <el-upload 
                  list-type="picture-card" 
                  :file-list="row.imageList" 
                  :class="{ hide: row.hide }"
                  :http-request="(file) => uploadSkuComponentImage(file, row)"
                  class="component-upload"
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
                            @click="handleComponentRemove(file, row)"
                          >
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
              </template>
          </el-table-column>
          <el-table-column label="零件ID" prop="existingPartsListId" width="80" fixed="left"></el-table-column>   
          <el-table-column label="零件名" prop="componentName" width="200" fixed="left">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.componentName" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.componentName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订货总数" prop="purchaseCount" align="center" :width="flexColumnWidth(skuComponentList, '订货总数', 'purchaseCount')">
            <template #header>
              订货<br>总数
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.purchaseCount" @keyup.enter="clickOtherCancel($event, row)" @blur="clickOtherCancel($event, row)" />
              </div>
              <span>{{ row.purchaseCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="多订数量" prop="moreCount" align="center" :width="flexColumnWidth(skuComponentList, '多订', 'moreCount')">
            <template #header>
              多订<br>数量
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.moreCount" @keyup.enter="clickOtherCancel($event, row)" @blur="clickOtherCancel($event, row)" />
              </div>
              <span>{{ row.moreCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用已有库存" prop="useStockCount" align="center" :width="flexColumnWidth(skuComponentList, '使用已', 'useStockCount')">
            <template #header>
              使用已<br>有库存
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.useStockCount" @keyup.enter="clickOtherCancel($event, row)" @blur="clickOtherCancel($event, row)" />
              </div>
              <span>{{ row.useStockCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已有库存" prop="stock" align="center" :width="flexColumnWidth(skuComponentList, '已有', 'stock')">
            <template #header>
              已有<br>库存
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="unit" align="center" :width="flexColumnWidth(skuComponentList, '单位', 'unit')">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.unit" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出厂单价" prop="unitPrice" align="center" :width="flexColumnWidth(skuComponentList, '出厂单价', 'unitPrice')">
            <template #header>
              出厂<br>单价
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.unitPrice" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.unitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出厂总价" prop="totalPrice" align="center" :width="flexColumnWidth(skuComponentList, '出厂总价', 'totalPrice')">
            <template #header>
              出厂<br>总价
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.totalPrice" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="含税运费" prop="freight" align="center" :width="flexColumnWidth(skuComponentList, '含税', 'freight')">
            <template #header>
                含税<br>运费
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.freight" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.freight }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模具费含税" prop="moldCost" align="center" :width="flexColumnWidth(skuComponentList, '模具费', 'moldCost')">
            <template #header>
              模具费<br>含税
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.moldCost" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.moldCost }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总未税价" prop="preTaxPrice" align="center" :width="flexColumnWidth(skuComponentList, '总未', 'preTaxPrice')">
            <template #header>
              总未<br>税价
            </template>
          </el-table-column>
          <el-table-column label="总含税价" prop="taxIncludedPrice" align="center" :width="flexColumnWidth(skuComponentList, '总含税价', 'taxIncludedPrice')">
            <template #header>
                总含<br>税价
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.taxIncludedPrice" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.taxIncludedPrice }}</span>
            </template>
          </el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;" @change="updateSkuComponent(row)">
                <el-option v-for="dict in currencyNumList" :key="dict.value"
                    :value="dict.value" :label="dict.label"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column  label="订单号" prop="orderNo" min-width="100" align="center">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.orderNo" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.orderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="零件采购注意事项" prop="purchaseMatters" min-width="200">
            <template #default="{ row }">
              <div class="none">
                <el-input type="text" v-model="row.purchaseMatters"  />
              </div>
              <span class="overflow-text">{{ removeHtmlTags(row.purchaseMatters) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商" min-width="205" prop="suppliserId">
            <template #default="{row}">
              <el-select v-model="row.suppliserId" placeholder="" @change="handleSupplierAndInvoicingChange(row)">
                <el-option 
                  v-for="item in row.suppliserList"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="开票" prop="oem" align="center" width="130">
            <template #default = "{ row }">
              <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;" @change="handleSupplierAndInvoicingChange(row)" @focus="handleGetRow(row)">
                <el-option v-for="dict in invoicingNumList" :key="dict.value"
                    :value="dict.value" :label="dict.label"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60" align="center">
            <template #header>
                实际<br>税点
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.actualTaxRate" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.actualTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60" align="center">
            <template #header>
                开票<br>税点
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.invoicingTaxRate" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.invoicingTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购方" min-width="130" prop="purchaseId">
            <template #default="{row}">
              <el-select v-model="row.purchaseId" placeholder="请选择默认采购方" style="min-width: 100%;" @change="handleDefaultPurchase(row)" @focus="handleGetRow(row)">
                <el-option 
                  v-for="item in purchaseOption"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" align="center" min-width="75">
            <template #default = "{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox" @change="handleDeclareCustoms(row)"/>
            </template>
          </el-table-column>
          <el-table-column  label="采购链接" prop="purchaseLink" min-width="140">
            <template #default="{ row }">
              <div class="none">
                <el-input type="text" v-model="row.purchaseLink" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>
                <el-text truncated>
                  {{ row.purchaseLink }}
                </el-text>
              </span>
            </template>
          </el-table-column>

          <el-table-column label="起订量" prop="minQuantity" align="center" min-width="73">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.minQuantity" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.minQuantity }}</span>
            </template>
          </el-table-column> 
          <el-table-column label="整箱数" prop="numCartons" align="center" min-width="73">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.numCartons" @keyup.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.numCartons }}</span>
            </template>
          </el-table-column> 
          <el-table-column  label="收货仓库" prop="repositoryId" min-width="160">
            <template #default="{ row }">
              <el-select v-model="row.repositoryId" placeholder="输入和搜索收货仓库" style="min-width: 100%;" filterable @change="updateSkuComponent(row)">
                <el-option 
                  v-for="item in repositoryOption"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="合同条款" prop="contractTerms" min-width="200">
            <template #default="{ row }">
              <div class="none">
                <el-input type="text" v-model="row.contractTerms"  />
              </div>
              <span class="overflow-text">{{ removeHtmlTags(row.contractTerms) }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="200" align="center">
            <template #default="{ row, $index }">
              <el-space>
                <el-button v-if="route.query.from !== 'plannedPoCreate'" text type="primary" @click="handleUpdateComponentPrice(row)">更新单价</el-button>
                <el-button text type="danger" @click="handleDelPoSKuComponent(row, $index)">删除</el-button>
              </el-space>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
        </el-table>
        <el-footer class="button-center">
          <el-button v-if="previousVisible" type="primary" @click="handleFetchPreviousData">上一个</el-button>
          <el-button v-if="nextVisible" type="primary" @click="handleFetchNextData">下一个</el-button>
          <el-button type="warning" @click="handleAddSKU">添加SKU</el-button>
          <el-button type="danger" @click="handleDelSKU">删除SKU</el-button>
        </el-footer>
      </div>
    </div>
    <div :class="{ none : createNone }">
      <el-page-header  @back="goBack" style="margin-bottom: 0px;">
        <template #title>
          退出
        </template>
        <template #content>
          <div class="flex items-center">
            <span> <strong>采购计划创建</strong></span>
          </div>
        </template>
      </el-page-header>
      <el-card class="product-details-card" shadow="never" >
        <el-row style="display: flex; width: 100%">
          <el-col class="custom-upload" :style="{ maxWidth: imageColumnHeight + 'px', padding: '0' }"> 
            <el-form label-position="top" >
              <el-form-item label="订货套数" >
                <el-input v-model="poDetailData.purchaseSkuNumber" @change="handleUpdateCreateSkuCount" :disabled="createDisabled"></el-input>
              </el-form-item>
              <el-form-item >
                <el-upload 
                  list-type="picture-card" 
                  :file-list="poDetailData.imageList" 
                  :class="{ hide: poDetailData.hide }"
                  :http-request="uploadImage"
                  class="upload-align"
                  :style="{ height: imageColumnHeight + 'px' }"
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
                          @click="handleRemove(file)"
                        >
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="flex: 1.3; padding: 0">
            <el-form label-position="top" :inline="true">
              <el-row style="width: 100%">
                  <el-col :span="12">
                      <el-form-item label="SKU">
                        <el-select
                          v-model="poDetailData.sku"
                          filterable
                          remote
                          default-first-option
                          placeholder="点击输入和搜索"
                          :remote-method="remotePeopleMethod"
                          :loading="skuLoading"
                          @change="handleCreatePlanPo"
                        >
                          <el-option
                            v-for="item in skuOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="产品名称">
                          <el-input v-model="poDetailData.productName" disabled></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-form-item label="创建日期" data-label="创建日期2">
                    <el-input v-model="poDetailData.createTime" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品经理">
                    <el-input v-model="poDetailData.productManager" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row style="width: 100%">
                  <el-col :span="12">
                    <el-form-item label="PO站点">
                      <el-select v-model="poDetailData.site" placeholder="请选择站点" :disabled="createDisabled">
                        <el-option
                          v-for="item in siteList"
                          :label="item.label"
                          :value="item.value"
                          :key="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="收货仓库">
                          <el-select v-model="poDetailData.repositoryId" placeholder="请选择收货仓库" :disabled="createDisabled">
                              <el-option
                                  v-for="item in repositoryOption"
                                  :label="item.label"
                                  :value="item.id"
                                  :key="item.id"
                              ></el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
              </el-row>

              <el-row style="width: 100%">
                <el-col :span="4">
                  <el-form-item label="SKU总含税价" data-label="SKU总含税价2">
                    <el-input v-model="poDetailData.orderTotalPrice" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="起订量" >
                    <el-input v-model="poDetailData.minQuantity" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="整箱数" >
                    <el-input v-model="poDetailData.numCartons" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12"> 
                  <el-form-item label="我方打包整箱数(近10次)">
                    <el-input v-model="poDetailData.packedTenRecord" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col style="flex: 1; padding: 0">
            <el-form label-position="top" >
              <el-row>
                <el-col :span="12">
                  <el-form-item >
                    <el-space>
                        <span style="font-size: var(--el-form-label-font-size);">SKU备注</span>
                    </el-space>
                    <el-input type="textarea" :rows="11" v-model="poDetailData.skuRemarks" disabled resize="none"></el-input>
                  </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item style="margin-right: 0">
                      <el-space>
                          <span style="font-size: var(--el-form-label-font-size);">PO备注</span>
                      </el-space>
                      <el-input type="textarea" :rows="11" v-model="poDetailData.poRemarks" resize="none" :disabled="createDisabled"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <el-page-header  @back="goBack" style="margin-bottom: 0px;">
        <template #title>
          退出
        </template>
        <template #content>
          <div class="flex items-center">
            <span> <strong> SKU零配件清单（与开票一致） </strong></span>
          </div>
        </template>
      </el-page-header>
      <div class="comprehensive-table-container">
        <vab-query-form>
          <vab-query-form-left-panel style="margin-top: 10px;" :span="24">
            <el-button type="primary" @click="handleAddComponent">添加零件</el-button>
            <el-button type="primary" @click="handleAddConsumable">添加耗材</el-button>
            <el-text type="danger" class="text-center">注意：零件名修改仅限品名规范修正，严禁将一个零件的名字修改为另外一个零件</el-text>
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-table 
          ref="tableRef" 
          stripe border 
          :data="skuComponentList"
          :header-cell-style="{ 'text-align': 'center' }"
          @cell-click="changeCreateInput"
          class="noneHoveTable"
          :cell-style="cellStyle"
          :cell-class-name="getCellClass"
        >
          <el-table-column align="center" label="图片" width="81.2px" fixed="left">
              <template #default="{ row }">
                <el-upload 
                  list-type="picture-card" 
                  :file-list="row.imageList" 
                  :class="{ hide: row.hide }"
                  :http-request="(file) => uploadSkuComponentImage(file, row)"
                  class="component-upload"
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
                            @click="handleComponentRemove(file, row)"
                          >
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
              </template>
          </el-table-column>
          <el-table-column label="零件ID" prop="existingPartsListId" width="80" fixed="left"></el-table-column>   
          <el-table-column label="零件名" prop="componentName" width="200" fixed="left">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.componentName" @keyup.enter="clickCreateOtherCancel($event, row)" @blur="clickCreateOtherCancel($event, row)" />
              </div>
              <span>{{ row.componentName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订货总数" prop="purchaseCount" align="center" :width="flexColumnWidth(skuComponentList, '订货', 'purchaseCount')">
            <template #header>
              订货<br>总数
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.purchaseCount" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.purchaseCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="多订数量" prop="moreCount" align="center" :width="flexColumnWidth(skuComponentList, '多订', 'moreCount')">
            <template #header>
              多订<br>数量
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.moreCount" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.moreCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用已有库存" prop="useStockCount" align="center" :width="flexColumnWidth(skuComponentList, '使用已', 'useStockCount')">
            <template #header>
              使用已<br>有库存
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.useStockCount" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.useStockCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已有库存" prop="stock" align="center" :width="flexColumnWidth(skuComponentList, '已有', 'stock')">
            <template #header>
              已有<br>库存
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="unit" align="center" :width="flexColumnWidth(skuComponentList, '单位', 'unit')">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.unit" @keyup.enter="clickCreateOtherCancel($event, row)" @blur="clickCreateOtherCancel($event, row)" />
              </div>
              <span>{{ row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出厂单价" prop="unitPrice" align="center" :width="flexColumnWidth(skuComponentList, '出厂', 'unitPrice')">
            <template #header>
              出厂<br>单价
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.unitPrice" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.unitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出厂总价" prop="totalPrice" align="center" :width="flexColumnWidth(skuComponentList, '出厂', 'totalPrice')">
            <template #header>
              出厂<br>总价
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.totalPrice" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="含税运费" prop="freight" align="center" :width="flexColumnWidth(skuComponentList, '含税', 'freight')">
            <template #header>
                含税<br>运费
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.freight" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.freight }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模具费含税" prop="moldCost" align="center" :width="flexColumnWidth(skuComponentList, '模具费', 'moldCost')">
            <template #header>
              模具费<br>含税
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.moldCost" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.moldCost }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总未税价" prop="preTaxPrice" align="center" :width="flexColumnWidth(skuComponentList, '总未', 'preTaxPrice')">
            <template #header>
              总未<br>税价
            </template>
          </el-table-column>
          <el-table-column label="总含税价" prop="taxIncludedPrice" align="center" :width="flexColumnWidth(skuComponentList, '总含', 'taxIncludedPrice')">
            <template #header>
                总含<br>税价
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.taxIncludedPrice" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.taxIncludedPrice }}</span>
            </template>
          </el-table-column>    
          <el-table-column label="货币" width="105px" prop="currency">
            <template #default="{ row }">
              <el-select v-model="row.currency" placeholder="请选择货币" style="min-width: 100%;">
                <el-option v-for="dict in currencyNumList" :key="dict.value"
                    :value="dict.value" :label="dict.label"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column  label="订单号" prop="orderNo" min-width="100" align="center">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.orderNo" @keyup.enter="clickCreateOtherCancel($event, row)" @blur="clickCreateOtherCancel($event, row)" />
              </div>
              <span>{{ row.orderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="零件采购注意事项" prop="purchaseMatters" min-width="200">
            <template #default="{ row }">
              <div class="none">
                <el-input type="text" v-model="row.purchaseMatters"  />
              </div>
              <span class="overflow-text">{{ removeHtmlTags(row.purchaseMatters) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商" min-width="205" prop="suppliserId">
            <template #default="{row}">
              <el-select v-model="row.suppliserId" >
                <el-option 
                  v-for="item in row.suppliserList"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="开票" prop="oem" align="center" width="130">
            <template #default = "{ row }">
              <el-select v-model="row.invoicing" placeholder="请选择开票类型" style="min-width: 100%;">
                <el-option v-for="dict in invoicingNumList" :key="dict.value"
                    :value="dict.value" :label="dict.label"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column  label="实际税点" prop="actualTaxRate" min-width="60" align="center">
            <template #header>
                实际<br>税点
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.actualTaxRate" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.actualTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column  label="开票税点" prop="invoicingTaxRate" min-width="60" align="center">
            <template #header>
                开票<br>税点
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.invoicingTaxRate" @keyup.enter="clickCreateCancel($event, row)" @blur="clickCreateCancel($event, row)" />
              </div>
              <span>{{ row.invoicingTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购方" min-width="130" prop="purchaseId">
            <template #default="{row}">
              <el-select v-model="row.purchaseId" placeholder="请选择默认采购方" style="min-width: 100%;">
                <el-option 
                  v-for="item in purchaseOption"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="不报关" prop="customsDeclarationStatus" align="center" min-width="75">
            <template #default = "{ row }">
              <el-checkbox v-model="row.customsDeclarationStatus" :true-value="1" :false-value="0" class="custom-checkbox"/>
            </template>
          </el-table-column>
          <el-table-column  label="采购链接" prop="purchaseLink" min-width="140">
            <template #default="{ row }">
              <div class="none">
                <el-input type="text" v-model="row.purchaseLink" @keyup.enter="clickCreateOtherCancel($event, row)" @blur="clickCreateOtherCancel($event, row)" />
              </div>
              <span>
                <el-text truncated>
                  {{ row.purchaseLink }}
                </el-text>
              </span>
            </template>
          </el-table-column>

          <el-table-column label="起订量" prop="minQuantity" align="center" min-width="73">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.minQuantity" @keyup.enter="clickCreateOtherCancel($event, row)" @blur="clickCreateOtherCancel($event, row)" />
              </div>
              <span>{{ row.minQuantity }}</span>
            </template>
          </el-table-column> 
          <el-table-column label="整箱数" prop="numCartons" align="center" min-width="73">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.numCartons" @keyup.enter="clickCreateOtherCancel($event, row)" @blur="clickCreateOtherCancel($event, row)" />
              </div>
              <span>{{ row.numCartons }}</span>
            </template>
          </el-table-column> 
          <el-table-column  label="收货仓库" prop="repositoryId" min-width="160">
            <template #default="{ row }">
              <el-select v-model="row.repositoryId" placeholder="输入和搜索收货仓库" style="min-width: 100%;" filterable>
                <el-option 
                  v-for="item in repositoryOption"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="合同条款" prop="contractTerms" min-width="200">
            <template #default="{ row }">
              <div class="none">
                <el-input type="text" v-model="row.contractTerms"  />
              </div>
              <span class="overflow-text">{{ removeHtmlTags(row.contractTerms) }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="200" align="center">
            <template #default="{ row, $index }">
              <el-space>
                <el-button v-if="route.query.from !== 'plannedPoCreate'" text type="primary" @click="handleUpdateComponentPrice(row)">更新单价</el-button>
                <el-button text type="danger" @click="handleDelPoSKuComponent(row, $index)">删除</el-button>
              </el-space>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" style="min-height: 200px;"/>
          </template>
        </el-table>
        <el-footer class="button-center">
          <el-button v-if="previousVisible" type="primary" @click="handleFetchPreviousData">上一个</el-button>
          <el-button v-if="nextVisible" type="primary" @click="handleFetchNextData">下一个</el-button>
          <el-button type="warning" @click="handleAddSKU">添加SKU</el-button>
          <el-button type="danger" @click="handleDelSKU" :disabled="createDisabled">删除SKU</el-button>
          <el-button type="success" :disabled="createDisabled">创建SKU</el-button>
        </el-footer>
      </div>
    </div>

    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorAttentionVisible"
      :content="attentionCopy"
      @clickChild="clickAttentionConfirm"
      @clickBoolean="clickAttentionCancel"
      :classify="classify"
    >
    </wangEditor>
    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorContractVisible"
      :content="contractCopy"
      @clickChild="clickContractConfirm"
      @clickBoolean="clickContractCancel"
      :classify="classify"
    >
    </wangEditor>
    <!-- 添加零件 -->
    <VabCreateComponent 
      :createComponentVisible="createComponentVisible"
      @update:createComponentVisible="handleCloseCreateComponent"
      @update:tableValue="handleSubmitComponent"
    />
    <!-- 添加耗材 -->
    <VabCreateConsumable 
      :createConsumableVisible="createConsumableVisible"
      @update:createConsumableVisible="handleCloseCreateConsumable"
      @update:tableValue="handleSubmitConsumable"
    />
    <!-- 采购方更新 -->
    <el-dialog
      title="采购方更新"
      v-model="updatePurchaserVisible"
      width="15%"
      class="dialog"
      :before-close="handleCloseUpdatePurchaserDialog"
    >
      <el-divider class="divider-margin"></el-divider>
        <el-checkbox
          v-model="purchaser0"
          label="更新SKU库"
          size="large"
        />
        <el-checkbox
          v-model="purchaser1"
          label="更新零件库"
          size="large"
        />
      <template #footer>
        <span>
          <el-button @click="updatePurchaserVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmUpdatePurchaser">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加 SKU -->
    <vab-dialog
      title="添加SKU"
      v-model="addSKUVisible"
      width="20%"
    >
      <el-form ref="addSkuFormRef" :model="addSkuForm" style="margin-left: 20px; margin-right: 20px">
        <el-form-item label="选择要添加的SKU">
          <el-select
            v-model="addSkuForm.sku"
            filterable
            remote
            default-first-option
            placeholder="点击输入和搜索"
            :remote-method="remotePeopleMethod"
            :loading="skuLoading"
            clearable
          >
            <el-option
              v-for="item in skuOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseAddSku">取消</el-button>
        <el-button type="primary" @click="handleConfirmAddSKU">确认</el-button>
      </template>
    </vab-dialog>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if="imagePreviewVisible" hide-on-click-modal/>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { FormInstance, UploadFile } from 'element-plus'
import VabCreateConsumable from './vabAutoComponents/vabCreateConsumable.vue'
import { getProductComponentPurchase, getProductComponentStore } from '/@/api/devlocal/productInformation'
import {
  addPoSKU,
  deleteComponentImg,
  deletePoSku,
  deletePoSkuComponent,
  deleteSkuImg,
  getPoContractTerms,
  getPoDetail,
  getPoPurchaseMatters,
  getPoSkuComponentList,
  getPoSkuIdList,
  getPoSkuList,
  getPurchaseSKU,
  getSupplierRate,
  submitPurchaseComponent,
  submitPurchaseConsumable,
  updateAllComponentPrice,
  updateBuyerAndCustomsDeclaration,
  updateComponentPrice,
  updateCreateComponent,
  updateCreateSkuCount,
  updatePoContractTerms,
  updatePoPurchaseMatters,
  updatePoRemarks,
  updatePoSite,
  updatePoSkuComponent,
  updateSkuCount,
  updateSkuDetail,
  updateSkuImg,
  uploadComponentImg
} from '/@/api/devlocal/purchasePo'
import { useSkuStore } from '/@/store/modules/sku'
import { useTabsStore } from '/@/store/modules/tabs'
import { IPurchaseOption, IRepositoryOption, ISubmitPurchaseComponent, ISubmitPurchaseConsumable } from '/@/type/purchase/po'
import { getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import { handleActivePath } from '/@/utils/routes'
import { _addSku, _clearSKUs } from '/@/utils/sku'
import { flexColumnWidth } from '/@/utils/tableColum'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'
import { currencyNumList, invoicingNumList, siteList } from '/@/views/purchase/constantOption.ts'

defineOptions({
  name: 'poDetailTable',
})

// 详情div显示与否
const detailsNone = ref<boolean>(false)
// 创建div显示与否
const createNone = ref<boolean>(true)

const route: any = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const { delVisitedRoute } = tabsStore
// 创建进来的，需要判断sku填没填，没填就都disabled掉
const createDisabled = ref<boolean>(false)
// po详情
const poDetailData = ref<any>({})
// PoSku配件数据
const skuComponentList = ref<any>([])
// 添加SKU是否可见
const addSKUVisible = ref<boolean>(false)
// 添加SKU表单
const addSkuForm = reactive<any>({
  sku: ''
})
const addSkuFormRef = ref<FormInstance>()
const skuLoading = ref(false) //搜索SKU-loading
const skuOptions = ref<any[]>([]) //搜索选项
const skuList = ref<any[]>([]) //搜索列表
const remotePeopleMethod = async (query: string) => {
  if (query) {
    const { data } = await getPoSkuList({
        sku: query
    })

    skuList.value = data.map((item: any) => {
        return { value: `${item}`, label: `${item}` }
    })
    skuLoading.value = true
    setTimeout(() => {
      skuLoading.value = false
      skuOptions.value = skuList.value.filter((item) => {
            return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    skuOptions.value = []
  }
}
const handleCloseAddSku = () => {
  addSkuFormRef.value?.resetFields()
  addSKUVisible.value = false
}

const skuStore = useSkuStore();
const skuData = skuStore.getSkuData;
// 选择sku的请求和赋值
const afterGetSku = async (_sku: string) => {
  const { data } = await getPurchaseSKU({
    sku: _sku
  })
  if (data) {
    // 存入新的数据
    let newSku = { id: skuData.length, poDetailData: poDetailData.value, skuComponentList: skuComponentList.value }; 
    _addSku(newSku)
    console.log(1, skuData);
    
    // 选择了sku或者添加了SKU，其他输入框就不用disable
    createDisabled.value = false
    // 获取旧的订货套数
    oldPurchaseNumber.value = data.poSkuDetail.purchaseSkuNumber

    // 将数据显示在页面上
    Object.assign(poDetailData.value, data.poSkuDetail)
    poDetailData.value.createTime =  poDetailData.value.createTime ? poDetailData.value.createTime.split(' ')[0] : ''

    if (!poDetailData.value.skuImgUrl) {
      poDetailData.value.hide = false
      poDetailData.value.imageList = []
    } else {
      poDetailData.value.hide = true
      poDetailData.value.imageList = [{ url: poDetailData.value.skuImgUrl }]
    }
    Object.assign(skuComponentList.value, data.componentList)
    skuComponentList.value.forEach((item: any) => {
      item.unitPrice = formattedPrice(item.unitPrice)
      if(!item.componentUrl) {
          item.hide = false
          item.imageList = []
      } else if (item.componentUrl){
          item.hide = true
          item.imageList = [{ url: item.componentUrl }]
      }
    })
  
    fetchPurchaseAndRepository()
  }
}
// 确认添加sku
const handleConfirmAddSKU = async () => {
  try {
    
    // 如果是创建，就是和上面一样的接口
    if (route.query.from === 'plannedPoCreate') {
      // 存入新的数据
      // let newSku = { id: Date.now(), poDetailData: poDetailData.value, skuComponentList: skuComponentList.value }; 
      // _addSku(newSku)
      // console.log(1, skuData);
      afterGetSku(addSkuForm.sku)
      // let newSku = { id: Date.now(), poDetailData: poDetailData.value, skuComponentList: skuComponentList.value }; 
      // _addSku(newSku)
      // console.log(2, skuData);
      $baseMessage('添加SKU成功', 'success')
      handleCloseAddSku()
    } else {
      const { data: addPoSkuData } = await addPoSKU({
        poId: poDetailData.value.id,
        sku: addSkuForm.sku
      })
      if (addPoSkuData) {
        $baseMessage('添加SKU成功', 'success')
        handleCloseAddSku()
        router.replace({ query: { ...route.query, poSkuId: addPoSkuData.poSkuDetail.poSkuId }})
      }
    }
  } catch (error) {
    console.error(error)
  }
}
// 更新采购方是否可见
const updatePurchaserVisible = ref<boolean>(false)
const purchaser0 = ref<boolean>(false)
  const purchaser1 = ref<boolean>(false)
// 更新采购方选择的选项列表
const selectedPurchasers = ref<string[]>([])
// 控制上一个显示
const previousVisible = ref<boolean>(false)
// 控制下一个显示
const nextVisible = ref<boolean>(false)
// po的SkuId列表
const poSkuIdList = ref<number[]>([])
// 当前skuId在id列表的下标
const poSkuIdIndex = ref<number>()


// 处理订单详情的标题
const handlePoTitle = () => {
  if (route.query.from === 'plannedPoDetail') {
     return '计划详情'
  } else {
    return route.query.from
  }
}
const createComponentVisible = ref<boolean>(false) //添加零件显示与否
const createConsumableVisible = ref<boolean>(false) //添加耗材显示与否
//点击添加零件
const handleAddComponent = async () => { 
  if (route.query.from === 'plannedPoCreate') {
    if (!poDetailData.value.sku) {
      $baseMessage('请先创建SKU', 'warning')
      return
    }
  }
  createComponentVisible.value = true
}
//点击添加耗材
const handleAddConsumable = () => {
  if (route.query.from === 'plannedPoCreate') {
    if (!poDetailData.value.sku) {
      $baseMessage('请先创建SKU', 'warning')
      return
    }
  }
  createConsumableVisible.value = true
}

// 提交添加零件传递的值
const handleSubmitComponent = async (value: any) => {
  let list: ISubmitPurchaseComponent[] = []
  value.forEach((item: any): any => {
    if (item.count) {
      list.push({
        componentId: Number(item.id), 
        sku: item.sku,                   
        suppliserId: Number(item.suppliserId),   
        count: Number(item.count)                 
      }) 
    }
  })

  try {
    const { data } = await submitPurchaseComponent({
      poId: poDetailData.value.id,
      poSkuId: poDetailData.value.poSkuId,
      list
    })
    if (data === true) {
      $baseMessage('添加零件提交成功', 'success', 'hey')
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}
// 关闭添加零件对话框
const handleCloseCreateComponent = (value: boolean) => {
  createComponentVisible.value = value
}
// 提交添加耗材传递的值
const handleSubmitConsumable = async (value: any) => {
  let list: ISubmitPurchaseConsumable[] = []
  value.forEach((item: any): any => {
    if (item.count) {
      list.push({
      componentId: Number(item.id),         
      suppliserId: Number(item.suppliserId),   
      count: Number(item.count)                 
    }) 
    }
  })
  try {
    const { data } = await submitPurchaseConsumable({
      poId: poDetailData.value.id,
      poSkuId: poDetailData.value.poSkuId,
      list
    })
    if (data === true) {
      $baseMessage('添加耗材提交成功', 'success', 'hey')
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}
// 关闭添加耗材对话框
const handleCloseCreateConsumable = (value: boolean) => {
  createConsumableVisible.value = value
}
// 打开更新采购方对话框
const handleShowUpdatePurchaserDialog = () => {
  updatePurchaserVisible.value = true
}
// 关闭更新采购方对话框
const handleCloseUpdatePurchaserDialog = () => {
  updatePurchaserVisible.value = false
}   

// 点击更新采购方确认
const handleConfirmUpdatePurchaser = async () => {
  // 都不选，点击确认，判断两个都没勾选，就直接报错，必须勾选一个
  if (!purchaser0.value && !purchaser1.value) {
    $baseMessage('两个选项至少勾选一个', 'error', 'hey')
  } else if (purchaser0.value && !purchaser1.value) { //只勾选了第一个，点击确认，可以提交，传递参数0
    try {
      const { data } = await updateBuyerAndCustomsDeclaration({
        poSkuId: parseInt(route.query.poSkuId),
        type: '0'
      })
      if (data === true) {
        $baseMessage('采购方和不报关更新成功', 'success', 'hey')
        handleCloseUpdatePurchaserDialog()
      }
    } catch (error) {
      console.error(error)
    }
  } else if (!purchaser0.value && purchaser1.value) { //只勾选了第二个，点击确认，可以提交，传递参数1
    try {
      const { data } = await updateBuyerAndCustomsDeclaration({
        poSkuId: parseInt(route.query.poSkuId),
        type: '1'
      })
      if (data === true) {
        $baseMessage('采购方和不报关更新成功', 'success', 'hey')
        handleCloseUpdatePurchaserDialog()
      }
    } catch (error) {
      console.error(error)
    }
  } else if (purchaser0.value && purchaser1.value) { //勾选两个，提交0，1
    try {
      const { data } = await updateBuyerAndCustomsDeclaration({
        poSkuId: parseInt(route.query.poSkuId),
        type: '0,1'
      })
      if (data === true) {
        $baseMessage('采购方和不报关更新成功', 'success', 'hey')
        handleCloseUpdatePurchaserDialog()
      }
    } catch (error) {
      console.error(error)
    }
  }
}

// PO详情SKU订货套数更新
const handleUpdateSkuCount = async () => {
  try {
    const { data} =  await updateSkuCount({
      poSkuId: poDetailData.value.poSkuId,
      count: poDetailData.value.purchaseSkuNumber
    })
    if (data === true) {
      fetchData()
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}


// 创建修改订货套数
const handleUpdateCreateSkuCount = async () => {
  try {
    const { data } = await updateCreateSkuCount({
      newPurchaseSkuNumber: Number(poDetailData.value.purchaseSkuNumber),
      oldPurchaseSkuNumber: oldPurchaseNumber.value,
      componentList: skuComponentList.value
    })
    if (data) {
      // 旧的等于新的
      oldPurchaseNumber.value = Number(poDetailData.value.purchaseSkuNumber)
      poDetailData.value.orderTotalPrice = data.skuTotalPrice
      Object.assign(skuComponentList.value, data.componentList)
      // let newValue = { id: , poDetailData: poDetailData.value, skuComponentList: skuComponentList.value }; 
      // _updateSku(skuData.length, )
      skuComponentList.value.forEach((item: any) => {
        item.unitPrice = formattedPrice(item.unitPrice)
        if(!item.componentUrl) {
            item.hide = false
            item.imageList = []
        } else if (item.componentUrl){
            item.hide = true
            item.imageList = [{ url: item.componentUrl }]
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}
// 采购sku详情更新
const handleUpdateSku = async () => {
  try {
    const { data } = await updateSkuDetail({
      poSkuId: poDetailData.value.poSkuId,
      productName: poDetailData.value.productName,
      repositoryId: poDetailData.value.repositoryId,
    })
    if (data === true) {
      fetchData()
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}

// 采购PO的站点更新
const handleUpdatePoSite = async () => {
  try {
    const { data } = await updatePoSite({
      id: poDetailData.value.id,
      site: poDetailData.value.site
    })
    if (data === true) {
      fetchData()
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}

// 采购PO的备注更新
const handleRemarksChange = async () => {
  try {
    const { data } = await updatePoRemarks({
      id: poDetailData.value.id,
      remarks: poDetailData.value.poRemarks
    })
    if (data === true) {
      fetchData()
      fetchSkuComponent()
    }
  } catch (error) {
    console.error(error)
  }
}

// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 分类
const classify = ref<string>('')
// 点击零件采购注意事项弹出富文本框是否显示
const wangEditorAttentionVisible = ref<boolean>(false)
// 点击合同条款弹出富文本框是否显示
const wangEditorContractVisible = ref<boolean>(false)
const attentionCopy = ref<string>('')
const contractCopy = ref<string>('')
/**
* 当点击确认时，子组件传递给父组件的新的val
*/
const clickAttentionConfirm = async (val: any) => {
  const { data } = await updatePoPurchaseMatters({ id: clickRow.value.id, purchaseMatters: val})
   
  attentionCopy.value = val
  clickRow.value.purchaseMatters = val
}
const clickContractConfirm = async (val: any) => {
  const { data } = await updatePoContractTerms({ id: clickRow.value.id, contractTerms: val})
  
  contractCopy.value = val
  clickRow.value.contractTerms = val
}
/**
* 当点击取消，确认时，子组件传递给父组件 false
*/
const clickAttentionCancel = (val: any) => {
  wangEditorAttentionVisible.value = val
}
const clickContractCancel = (val: any) => {
  wangEditorContractVisible.value = val
}
// 去掉 HTML 标签并显示纯文本的方法
const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};
/**
* 当点击时切换输入框，修改输入
*/
const clickRow = ref<any>()
let copyRow: any
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  
  if (!cell.children[0].children[0]
    || !cell.children[0].children[1]
    || !cell.children[0].children[0].classList
    || !cell.children[0].children[1].classList) {
    return
  }
  copyRow = JSON.parse(JSON.stringify(row))
  if (column.property == 'purchaseMatters') {
    // 查询零件采购注意事项
    clickRow.value = row
    const { data } = await getPoPurchaseMatters({ id: row.id })
    attentionCopy.value = data
    row.purchaseMatters = data
    wangEditorTitle.value = '零件采购注意事项'
    classify.value = 'purchaseMatters'
    wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
  } else if (column.property == 'contractTerms'){
    clickRow.value = row
    const { data } = await getPoContractTerms({ id: row.id })
    contractCopy.value = data
    row.contractTerms = data
    wangEditorTitle.value = '合同条款'
    classify.value = 'contractTerms'
    wangEditorContractVisible.value = !wangEditorContractVisible.value
  } else {
    cell.children[0].children[0].classList.remove('none')
    cell.children[0].children[1].classList.add('none')
  }

  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
    inputElement.focus()
    inputElement.select()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
      textareaElement.select()
    }
  }
}
const changeCreateInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 
  
  if (!cell.children[0].children[0]
    || !cell.children[0].children[1]
    || !cell.children[0].children[0].classList
    || !cell.children[0].children[1].classList) {
    return
  }
  copyRow = JSON.parse(JSON.stringify(row))
  if (column.property == 'purchaseMatters') {
    // 查询零件采购注意事项
    clickRow.value = row
    attentionCopy.value = row.purchaseMatters
    wangEditorTitle.value = '零件采购注意事项'
    classify.value = 'purchaseMatters'
    wangEditorAttentionVisible.value = !wangEditorAttentionVisible.value
  } else if (column.property == 'contractTerms'){
    clickRow.value = row
    contractCopy.value = row.contractTerms
    wangEditorTitle.value = '合同条款'
    classify.value = 'contractTerms'
    wangEditorContractVisible.value = !wangEditorContractVisible.value
  } else {
    cell.children[0].children[0].classList.remove('none')
    cell.children[0].children[1].classList.add('none')
  }

  // 自动聚焦
  const inputElement = getSpecificChildren(cell, "input")[0];
  if (inputElement) {
    inputElement.focus()
    inputElement.select()
  } else {
    const textareaElement = getSpecificChildren(cell, "textarea")[0];
    if (textareaElement){
      textareaElement.focus()
      textareaElement.select()
    }
  }
}
// 修改po-sku零件信息
const updateSkuComponent = async (row: any) => {
  try {
    const { data } = await updatePoSkuComponent(row)
    if (data === true) {
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {
    console.error(error)
  }
}
// 零件table blur事件
const clickCancel = async (event:any,value:any) => {
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }
  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  if (JSON.stringify(value) === JSON.stringify(copyRow)) {
      return 
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    updateSkuComponent(value) 
  }
}
const clickCreateOtherCancel = async (event: any, value: any) => {
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }
  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
}
// 创建blur修改
const clickCreateCancel = async (event:any,value:any) => {
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }
  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  if (JSON.stringify(value) === JSON.stringify(copyRow)) {
      return 
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    // 修改请求
    const { data } = await updateCreateComponent(value)
    Object.assign(skuComponentList.value, data.componentList)
    poDetailData.value.orderTotalPrice = data.skuTotalPrice
    skuComponentList.value.forEach((item: any) => {
      item.unitPrice = formattedPrice(item.unitPrice)
      if(!item.componentUrl) {
          item.hide = false
          item.imageList = []
      } else if (item.componentUrl){
          item.hide = true
          item.imageList = [{ url: item.componentUrl }]
      }
    })
  }
}

// 零件table blur事件
const clickOtherCancel = async (event:any,value:any) => {
  const t1 = getRootElement(event["srcElement"],".cell").children[0]
  if (t1){
    t1.classList.add("none")
  }
  const t2 = getRootElement(event["srcElement"],".cell").children[1]
  if (t2){
    t2.classList.remove("none")
  }
  if(JSON.stringify(value) === JSON.stringify(copyRow)) {
      return 
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    updateSkuComponent(value) 
    fetchSkuComponent()
  }
}
// 更新价格
const handleUpdateAllComponentPrice = async () => {
  try {
    const { data } = await updateAllComponentPrice({
      poSkuId: parseInt(route.query.poSkuId)
    })
    if (data === true) {
      $baseMessage('该SKU下的所有零件价格全部更新成功', 'success', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}
// 更新单价
const handleUpdateComponentPrice = async (row: any) => {
  try {
    const { data } = await updateComponentPrice({
      poSkuComponentId: row.id
    })
    if (data === true) {
      $baseMessage('单价更新成功', 'success', 'hey')
    }
  } catch (error) {
    console.error(error)
  }
}
// 获取供应商税点信息 不需要disabled?
const fetchSupplierRate = async (row: any) => {
  try {
    const { data: supplierTax } = await getSupplierRate({
      suppliserId: row.suppliserId
    })
    // if (supplierTax) {
    //   const { suppliserId, actualZTaxRate, invoicingZTaxRate, actualPTaxRate, invoicingPTaxRate } = supplierTax
    //   if(row.invoicing === 0) {
    //     row.actualTaxRate = actualZTaxRate
    //     row.invoicingTaxRate = invoicingZTaxRate
    //   } else if(row.invoicing === 1) {
    //     row.actualTaxRate = actualPTaxRate
    //     row.invoicingTaxRate = invoicingPTaxRate
    //   } else {
    //     row.actualTaxRate = 0
    //     row.invoicingTaxRate = 0
    //   }
    // }
  } catch (error) {
    console.error(error)
  }
}
// 修改默认供应商
const handleSupplierAndInvoicingChange = async (row: any) => {
  try {
    const { data } = await updatePoSkuComponent(row)
    if (data === true) {
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {  
    row.invoicing = originalRow.invoicing
    console.error(error)
  }
  // fetchSupplierRate(row)
}
// // 修改开票类型
// const handleInvoicingChange = async (row: any) => {
//   updateSkuComponent(row)
//   fetchSupplierRate(row)
// }
let originalRow: any
const handleGetRow = (row: any) => {
  originalRow = { ...row }
}
// 修改默认采购方
const handleDefaultPurchase = async (row: any) => {
  // const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  // if(item!.type === 0) { //如果选择了为买单的采购方
  //   row.customsDeclarationStatus = 1 //自动勾选不报关
  // } else if(row.purchaseId === 2) { //选择了埃托姆
  //   row.customsDeclarationStatus = 0
  // } 
  try {
    const { data } = await updatePoSkuComponent(row)
    if (data === true) {
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {  
    row.purchaseId = originalRow.purchaseId
    console.error(error)
  }
}
// 处理不报关
const handleDeclareCustoms = async (row: any) => {
  // const item = purchaseOption.value.find((i: any) => row.purchaseId === i.id)
  // if(item!.type === 0) { //如果选择了为买单的采购方
  //   if(row.customsDeclarationStatus === 0) {
  //     row.customsDeclarationStatus = 1
  //     $baseMessage('采购方为买单，无法取消不报关勾选', 'error', 'hey')
  //   }
  // } else if(row.purchaseId === 2) { //选择了埃托姆
  //   if(row.customsDeclarationStatus === 1) {
  //     row.customsDeclarationStatus = 0
  //     $baseMessage('采购方为埃托姆，必须报关，无法勾选不报关', 'error', 'hey')
  //   } 
  // } else {
    // updateSkuComponent(row)
  // }
  try {
    const { data } = await updatePoSkuComponent(row)
    if (data === true) {
      fetchSkuComponent()
      fetchData()
    }
  } catch (error) {  
    row.customsDeclarationStatus = row.customsDeclarationStatus === 0 ? 1 : 0
    console.error(error)
  }
}
// 添加SKU
const handleAddSKU = async () => {
  addSKUVisible.value = true
}
// PO详情删除SKU
const handleDelSKU = async () => {
  // 只有一个sku的 删除的是po 
  if (poSkuIdList.value.length === 1) {
    $baseConfirm('确定要删除PO吗', '系统提示', async () => {
      try {
        const { data } = await deletePoSku({
          poSkuId: poDetailData.value.poSkuId
        })
        if (data === true) {
          $baseMessage('删除PO成功', 'success', 'hey')
          goBack()
        }
      } catch (error) {
        console.error(error)
      }
    })
  } else if (poSkuIdList.value.length > 1) { // 有多个sku的 删除当前sku
    try {
      $baseConfirm('确定要删除当前SKU吗', '系统提示', async () => {
        const { data } = await deletePoSku({
          poSkuId: poDetailData.value.poSkuId
        })
        if (data === true) {
          $baseMessage('删除SKU成功', 'success', 'hey')
          // 如果是最后一个 就去上一个
          if (poSkuIdIndex.value === poSkuIdList.value.length - 1 ) {
            const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! - 1] };
            router.push({ path: '/purchase/poDetail', query });
          } else {
            // 如果是第一个或者和中间 就去下一个
            const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! + 1] };
            router.push({ path: '/purchase/poDetail', query });
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}
// po-sku零配件删除
const handleDelPoSKuComponent = async (row: any, index: number) => {
  $baseConfirm('确定要删除该条零件信息吗', "系统提示", async () => {
    $baseConfirm('确定删除，是否继续？', '系统提示', async () => {
      try {
        const { data } = await deletePoSkuComponent({
          id: row.id
        });
        if (data === true) {
          skuComponentList.value.splice(index, 1)
          fetchSkuComponent()
          fetchData()
          $baseMessage('该条零件删除成功', 'success', 'hey');
        }
      } catch (error) {
        console.error('删除失败:', error);
      }
    });
  })
}

// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
 imagePreviewVisible.value = false;
}
// 图片预览事件
const handlePreview = (file: UploadFile) => {
   imagePreviewVisible.value = true
   imagePreviewList.value = []
   imagePreviewList.value.push(file.url!)
}
/**
* 上传图片
*/
async function uploadImage(params: any) {
  poDetailData.value.hide = true

  try {
    let uploadImgForm = new FormData(); // 每次上传前重置 FormData
    uploadImgForm.append('file', params.file);
    uploadImgForm.append('poSkuId', poDetailData.value.poSkuId);
    const { data } = await updateSkuImg(uploadImgForm)
    // poDetailData.value.imageList = [{ url: data }]
    Object.assign(poDetailData.value.imageList, [{ url: data }])
  } catch (error) {
    console.error(error)
    poDetailData.value.hide = false
  }
}
async function uploadSkuComponentImage(params: any, row: any) {
  
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', params.file);
    uploadImgForm.append('id', row.id);

    const { data } = await uploadComponentImg(uploadImgForm)
    row.hide = true

    Object.assign(row.imageList, [{ url: data }])
    
  } catch (error) {
    console.error(error)
    row.hide = false
  }
}
/**
* 图片删除功能
*/
const handleRemove = async (file: UploadFile) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
      const { data } = await deleteSkuImg({
        poSkuId: poDetailData.value.poSkuId
      })
      if (data === true) {
        poDetailData.value.imageList = []
        poDetailData.value.hide = false
        $baseMessage("SKU详情图片删除成功!","success","hey")
      }
    })
  } catch (error) {
    console.error(error)
  }
}
const handleComponentRemove = async (file: UploadFile, row: any) => {
  try {
    $baseConfirm('确定要删除这张图片吗',"系统提示", async ()=>{
      const { data } = await deleteComponentImg({
          id: row.id
      })
      if (data == true) {
          row.imageList = []
          row.hide = false
          $baseMessage("SKU零配件图片删除成功!","success","hey")
      }
    })
  } catch (error) {
    console.error(error)
  }
}

// 当点击上一个按钮
const handleFetchPreviousData = async () => {
  // 获取当前路由的查询参数
  const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! - 1] };
  await delVisitedRoute(handleActivePath(route, true))
  // 使用 router.push 修改路由
  router.push({ path: '/purchase/poDetail', query });
}
// 当点击下一个按钮
const handleFetchNextData = async () => {
  // 获取当前路由的查询参数
  const query = { ...router.currentRoute.value.query, poSkuId: poSkuIdList.value[poSkuIdIndex.value! + 1] };
  await delVisitedRoute(handleActivePath(route, true))
  // 使用 router.push 修改路由
  router.push({ path: '/purchase/poDetail', query });
}
// 价格保留两位小数
const formattedPrice = (price: string) => {
   return parseFloat(price).toFixed(2)
}
// 获取采购方和收货仓库
const repositoryOption = ref<IRepositoryOption[]>([])
const purchaseOption = ref<IPurchaseOption[]>([])
const fetchPurchaseAndRepository = async () => {
  const { data: purchase } = await getProductComponentPurchase()
  purchaseOption.value = purchase
  const { data: repository } = await getProductComponentStore()
  repositoryOption.value = repository
}
// 获取PoSKU配件详情表
const fetchSkuComponent = async () => {
  try {
    const { data } = await getPoSkuComponentList({
      poSkuId: parseInt(route.query.poSkuId)
    })
    if (data) {
      skuComponentList.value = data
      skuComponentList.value.forEach((item: any) => {
        item.unitPrice = formattedPrice(item.unitPrice)
        if(!item.componentUrl) {
            item.hide = false
            item.imageList = []
        } else if (item.componentUrl){
            item.hide = true
            item.imageList = [{ url: item.componentUrl }]
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

// 获取po详情数据
const fetchData = async () =>{
  try {
    const { data } = await getPoDetail({
      id: parseInt(route.query.poSkuId)
    })
    if (data) {
      poDetailData.value = data
      poDetailData.value.createTime = data.createTime ? data.createTime.split(' ')[0] : ''
    }
  } catch (error) {
    console.error(error)
  }
  if (!poDetailData.value.skuImgUrl) {
    poDetailData.value.hide = false
    poDetailData.value.imageList = []
  } else {
    poDetailData.value.hide = true
    poDetailData.value.imageList = [{ url: poDetailData.value.skuImgUrl }]
  }
}

// 获取po的skuId列表
const fetchPoSkuIdList = async () => {
  const { data } = await getPoSkuIdList({
    id: parseInt(route.query.poId)
  })
  // console.log(data); // [1, 2, 28]或者[31]或者[32]
  poSkuIdList.value = data
  handleShowPreviousOrNext()
}

// 处理上一个还是下一个显示
const handleShowPreviousOrNext = () => {
  const lastIndex = poSkuIdList.value.length - 1
  poSkuIdIndex.value = poSkuIdList.value.findIndex((item: number) => item === parseInt(route.query.poSkuId))
  if (lastIndex === -1) {
    previousVisible.value = false
    nextVisible.value = false
  }
  // 只有一个SKU，都不显示
  else if (lastIndex === 0) {
    previousVisible.value = false
    nextVisible.value = false
  } else if (poSkuIdIndex.value === lastIndex && lastIndex !== -1) { // 如果就是末尾的skuId，不显示下一个
    previousVisible.value = true
    nextVisible.value = false
  } else if (poSkuIdIndex.value === 0) { // 如果是第一个，不显示上一个
    previousVisible.value = false
    nextVisible.value = true
  } else {
    previousVisible.value = true
    nextVisible.value = true
  }
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if  (data.columnIndex === 1 || data.columnIndex === 6 || data.columnIndex === 12){        
    return {
      color: '#bbb',
      cursor: 'not-allowed',
      textAlign:'center'
    } 
  }
}
const getCellClass = (data: { row: any, column: any, rowIndex: number, columnIndex: number }):any => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
const oldPurchaseNumber = ref<number>()
// 创建planPo
const handleCreatePlanPo = async () => {
  try {
    afterGetSku(poDetailData.value.sku)
    
      // const { data: skuIdList } = await getPoSkuIdList({
      //   id: data.poSkuDetail.poSkuId!
      // })
      // console.log(data); // [1, 2, 28]或者[31]或者[32]
      // poSkuIdList.value = skuIdList
      // handleShowPreviousOrNext()
      // 当点击添加SKU的时候，根据id获取skuId列表，然后决定显示上一个还是下一个    
  } catch (error) {
    console.error(error)
  }
}
// back
const goBack = async () => {
  await delVisitedRoute(handleActivePath(route, true))
  if (route.query.from === 'plannedPoDetail' || route.query.from === 'plannedPoCreate') {
    router.push({ path: '/purchase/plannedPo' });
  } else {
    router.push({ path: '/purchase/po' });
  } 
}
const imageColumnHeight = ref<number>(0)
// 动态设置 详情 的图片列高度
const setImageColumnHeight = () => {
  const createDateInput = document.querySelector('.el-form-item[data-label="创建日期"]');
  const skuTotalPriceInput = document.querySelector('.el-form-item[data-label="SKU总含税价"]');

  if (createDateInput && skuTotalPriceInput) {
    const createDateRect = createDateInput.getBoundingClientRect();
    const skuTotalPriceRect = skuTotalPriceInput.getBoundingClientRect();
    imageColumnHeight.value = skuTotalPriceRect.bottom - createDateRect.top - 30;
  }
};
// 动态设置 创建 的图片列高度
const setImageColumnHeight2 = () => {
  const createDateInput = document.querySelector('.el-form-item[data-label="创建日期2"]');
  const skuTotalPriceInput = document.querySelector('.el-form-item[data-label="SKU总含税价2"]');

  if (createDateInput && skuTotalPriceInput) {
    const createDateRect = createDateInput.getBoundingClientRect();
    const skuTotalPriceRect = skuTotalPriceInput.getBoundingClientRect();
    imageColumnHeight.value = skuTotalPriceRect.bottom - createDateRect.top - 30;
  }
};
onBeforeMount(() => {
  // 如果不是创建，订单详情div显示
  if (route.query.from !== 'plannedPoCreate') {
    createNone.value = true
    detailsNone.value = false
    fetchPoSkuIdList()
    fetchData()
    fetchPurchaseAndRepository()
    fetchSkuComponent()
  } else if (route.query.from === 'plannedPoCreate') {
    // 一进来 disable掉
    createDisabled.value = true
    
    // 是创建的话，创建div显示
    createNone.value = false
    detailsNone.value = true
    _clearSKUs() //一进页面只清空一次
  }
})

onMounted(() => {
  if (route.query.from === 'plannedPoCreate') { //设置图片列宽度高度
    setImageColumnHeight2()
  } else {
    setImageColumnHeight();
  }
});
</script>

<style lang="scss" scoped>
.poDetail-container {
  :deep() {
    .product-details-card {
      border: 0;
      
      // 设置el-card的padding和下面表格左右两侧对齐
      .el-card__body {
        padding-bottom: 0;
        padding-right: 0;
        padding-left: 0; 
      }
      
    }
    
  }
}

:deep(.el-form-item) {
   margin-right: 10px;
}
:deep(.moldDialog .el-dialog__body) { 
 padding-top: 0;
}
.custom-checkbox {
 transform: scale(1.2); 
 transform-origin: center;
}
.none {
   display: none;
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
// 设置行高
:deep(.el-table .el-table__body .cell) {
  max-height: 81.2px;
}
.overflow-text {
 max-height: 81.2px; /* 设置文本的最大高度 */
 overflow-y: auto; /* 溢出时显示垂直滚动条 */
 display: block;
}
.transfer-container {
   display: flex;
   justify-content: center; /* 水平居中 */
   align-items: center; /* 垂直居中，如果需要 */
}
/* 上面的图片上传框对齐 */
.upload-align {
  margin-top: 30px;
  width: 100%;
  height: 100%;
}
:deep(.upload-align .el-upload-list--picture-card) {
  width: 100%;
  height: 100%;
}
// 让上面的图片过渡消失
:deep(.upload-align .el-upload-list--picture-card .el-upload-list__item) {
  transition: none;  
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
// 设置没有图片时上传图标的样式
:deep(.upload-align .el-upload--picture-card) {
  width: 100%;
  height: 100%;
}

.hide :deep(.el-upload--picture-card) {
 display: none
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
 background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
 background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
.text-center {
  line-height: 1; 
  text-align: center;
  margin: 0 10px calc(var(--el-margin) / 2) 0 !important;
}
.button-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
// 分隔线margin
.divider-margin {
  margin-top: 0; 
  margin-bottom: 20px;
}
// 弹出框的body的padding-top
:deep(.dialog .el-dialog__body) {
  padding-top: 0;
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-table :deep(.clear-padding .cell) {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.el-table :deep(.clear-padding) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

</style>