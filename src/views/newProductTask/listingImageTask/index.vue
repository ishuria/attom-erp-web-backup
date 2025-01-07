<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="已分配" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showPostTask">发布任务</el-button>
            <el-button type="primary" @click="showMarginSetting">余量设定</el-button>
            <el-button type="primary" @click="showTaskStatistics">任务量统计</el-button>
            <el-button type="primary" @click="showBatchSellingPoint">卖点填写(批量)</el-button>
            <el-button type="primary" @click="showMissionClaim">任务认领</el-button>
            <!-- <el-button type="primary" @click="showAssignTask">任务分配修改</el-button> -->
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" :loading="listLoading" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border :header-cell-style="{ textAlign: 'center' }"
          :cell-class-name="clearPadding" :cell-style="cellStyle"
          :data="list"
          @selection-change="setSelectedRows"
          @cell-click="cellClick"
        >
          <el-table-column type="selection" fixed="left"></el-table-column>
          <el-table-column label="图片" prop="skuImgUrl" width="75">
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" style="width: 75px; height: 75px; display: block;" @click="imagePreviewShow(row.skuImgUrl)">
                <template #error><el-icon></el-icon></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
          <el-table-column label="ASIN" prop="" min-width="160">
            <template #default="{ row }">
              <el-link type="primary"></el-link>
            </template>
          </el-table-column>
          <el-table-column label="站点" prop="sites" min-width="150">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_sites" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._sitesFull }}</div>
                </template>
                <span v-html="row._sites"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="任务类型" prop="taskType" min-width="100"></el-table-column>
          <el-table-column label="产品定位" prop="positioning" min-width="100"></el-table-column>
          <el-table-column label="要求完成日期" prop="finishDate" min-width="125">
            <template #default="{ row }">
              {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="实际完成日期" prop="actualFinishDate" min-width="125">
            <template #default="{ row }">
              {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="剩余自然日" prop="naturalDay" min-width="110"></el-table-column>
          <el-table-column label="需求文件地址" prop="requiredAddress" min-width="160"></el-table-column>
          <el-table-column label="卖点完成" prop="sellingPointStatus" min-width="100">
            <template #default="{ row }">
              <vab-icon v-if="row.sellingPointStatus === 1" icon="check-fill" class="custom-check" />
              {{ '' }}
            </template>
          </el-table-column>
          <el-table-column label="基础图片" prop="basePicture" min-width="100">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_basePicture" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._basePictureFull }}</div>
                </template>
                <span v-html="row._basePicture"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="建模/渲染" prop="modeling" min-width="105">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_modeling" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._modelingFull }}</div>
                </template>
                <span v-html="row._modeling"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="A+" prop="aAdd" min-width="90">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_aAdd" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._aAddFull }}</div>
                </template>
                <span v-html="row._aAdd"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="视频" prop="video" min-width="90">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_video" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._videoFull }}</div>
                </template>
                <span v-html="row._video"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="说明书/包装" prop="instructionManual" min-width="115">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_instructionManual" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._instructionManualFull }}</div>
                </template>
                <span v-html="row._instructionManual"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="publisherPersonName" min-width="160"></el-table-column>
          <el-table-column label="产品经理" prop="productManager" min-width="100">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_productManager" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._productManagerFull }}</div>
                </template>
                <span v-html="row._productManager"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="产品设计" prop="productDesign" min-width="160"></el-table-column>
          <el-table-column label="运营" prop="operation" min-width="90"></el-table-column>
          <el-table-column label="陈峥校对" prop="proofreadingStatus" min-width="100">
            <template #default="{ row }">
              <vab-icon v-if="row.proofreadingStatus === 1" icon="check-fill" class="custom-check" />
              {{ '' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="130"></el-table-column>
          <el-table-column label="操作" width="110" fixed="right">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary" @click="handleShowSellingPoint(row)">
                  卖点
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleShowSellingPoint(row)">
                      <el-link type="primary" :underline="false">卖点</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleShowCopywriting(row)">
                      <el-link type="primary" :underline="false">文案</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleLongTerm(row)">
                      <el-link type="primary" :underline="false">长期提成</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleFinish(row)">
                      <el-link type="success" :underline="false">完成</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDelArtDesignTask(row)">
                      <el-link type="danger" :underline="false">删除</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
      <el-tab-pane label="未分配" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showPostTask">发布任务</el-button>
            <el-button type="primary" @click="showMarginSetting">余量设定</el-button>
            <el-button type="primary" @click="showTaskStatistics">任务量统计</el-button>
            <el-button type="primary" @click="showBatchSellingPoint">卖点填写(批量)</el-button>
            <el-button type="primary" @click="showMissionClaim">任务认领</el-button>
            <el-button type="primary" @click="showAssignTask">任务分配修改</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" :loading="listLoading" @click="queryData"></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border :header-cell-style="{ textAlign: 'center' }"
          :cell-class-name="clearPadding" :cell-style="cellStyle"
          :data="list"
          @selection-change="setSelectedRows"
          @cell-click="cellClick"
        >
          <el-table-column type="selection" fixed="left"></el-table-column>
          <el-table-column label="图片" prop="skuImgUrl" width="75">
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" style="width: 75px; height: 75px; display: block;" @click="imagePreviewShow(row.skuImgUrl)">
                <template #error><el-icon></el-icon></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
          <el-table-column label="ASIN" prop="" min-width="160">
            <template #default="{ row }">
              <el-link type="primary"></el-link>
            </template>
          </el-table-column>
          <el-table-column label="站点" prop="sites" min-width="150">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_sites" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._sitesFull }}</div>
                </template>
                <span v-html="row._sites"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="任务类型" prop="taskType" min-width="100"></el-table-column>
          <el-table-column label="产品定位" prop="positioning" min-width="100"></el-table-column>
          <el-table-column label="要求完成日期" prop="finishDate" min-width="125">
            <template #default="{ row }">
              {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="实际完成日期" prop="actualFinishDate" min-width="125">
            <template #default="{ row }">
              {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="剩余自然日" prop="naturalDay" min-width="110"></el-table-column>
          <el-table-column label="需求文件地址" prop="requiredAddress" min-width="160"></el-table-column>
          <el-table-column label="卖点完成" prop="sellingPointStatus" min-width="100">
            <template #default="{ row }">
              <vab-icon v-if="row.sellingPointStatus === 1" icon="check-fill" class="custom-check" />
              {{ '' }}
            </template>
          </el-table-column>
          <el-table-column label="基础图片" prop="basePicture" min-width="100">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_basePicture" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._basePictureFull }}</div>
                </template>
                <span v-html="row._basePicture"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="建模/渲染" prop="modeling" min-width="105">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_modeling" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._modelingFull }}</div>
                </template>
                <span v-html="row._modeling"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="A+" prop="aAdd" min-width="90">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_aAdd" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._aAddFull }}</div>
                </template>
                <span v-html="row._aAdd"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="视频" prop="video" min-width="90">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_video" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._videoFull }}</div>
                </template>
                <span v-html="row._video"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="说明书/包装" prop="instructionManual" min-width="115">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_instructionManual" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._instructionManualFull }}</div>
                </template>
                <span v-html="row._instructionManual"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="publisherPersonName" min-width="160"></el-table-column>
          <el-table-column label="产品经理" prop="productManager" min-width="100">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_productManager" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._productManagerFull }}</div>
                </template>
                <span v-html="row._productManager"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="产品设计" prop="productDesign" min-width="160"></el-table-column>
          <el-table-column label="运营" prop="operation" min-width="90"></el-table-column>
          <el-table-column label="陈峥校对" prop="proofreadingStatus" min-width="100">
            <template #default="{ row }">
              <vab-icon v-if="row.proofreadingStatus === 1" icon="check-fill" class="custom-check" />
              {{ '' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="130"></el-table-column>
          <el-table-column label="操作" width="110" fixed="right">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary" @click="handleShowSellingPoint(row)">
                  卖点
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleShowSellingPoint(row)">
                      <el-link type="primary" :underline="false">卖点</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleShowCopywriting(row)">
                      <el-link type="primary" :underline="false">文案</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleLongTerm(row)">
                      <el-link type="primary" :underline="false">长期提成</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleFinish(row)">
                      <el-link type="success" :underline="false">完成</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDelArtDesignTask(row)">
                      <el-link type="danger" :underline="false">删除</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
        <el-table
          border :header-cell-style="{ textAlign: 'center' }"
          :cell-class-name="clearPadding" :cell-style="cellStyle"
          :data="list"
          @selection-change="setSelectedRows"
          @cell-click="cellClick"
        >
          <el-table-column type="selection" fixed="left"></el-table-column>
          <el-table-column label="图片" prop="skuImgUrl" width="75">
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" style="width: 75px; height: 75px; display: block;" @click="imagePreviewShow(row.skuImgUrl)">
                <template #error><el-icon></el-icon></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
          <el-table-column label="ASIN" prop="" min-width="160">
            <template #default="{ row }">
              <el-link type="primary"></el-link>
            </template>
          </el-table-column>
          <el-table-column label="站点" prop="sites" min-width="150">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_sites" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._sitesFull }}</div>
                </template>
                <span v-html="row._sites"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="任务类型" prop="taskType" min-width="100"></el-table-column>
          <el-table-column label="产品定位" prop="positioning" min-width="100"></el-table-column>
          <el-table-column label="要求完成日期" prop="finishDate" min-width="125">
            <template #default="{ row }">
              {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="实际完成日期" prop="actualFinishDate" min-width="125">
            <template #default="{ row }">
              {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="剩余自然日" prop="naturalDay" min-width="110"></el-table-column>
          <el-table-column label="需求文件地址" prop="requiredAddress" min-width="160"></el-table-column>
          <el-table-column label="卖点完成" prop="sellingPointStatus" min-width="100">
            <template #default="{ row }">
              <vab-icon v-if="row.sellingPointStatus === 1" icon="check-fill" class="custom-check" />
              {{ '' }}
            </template>
          </el-table-column>
          <el-table-column label="基础图片" prop="basePicture" min-width="160">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_basePicture" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._basePictureFull }}</div>
                </template>
                <span v-html="row._basePicture"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="建模/渲染" prop="modeling" min-width="160">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_modeling" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._modelingFull }}</div>
                </template>
                <span v-html="row._modeling"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="A+" prop="aAdd" min-width="160">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_aAdd" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._aAddFull }}</div>
                </template>
                <span v-html="row._aAdd"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="视频" prop="video" min-width="160">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_video" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._videoFull }}</div>
                </template>
                <span v-html="row._video"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="说明书/包装" prop="instructionManual" min-width="160">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_instructionManual" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._instructionManualFull }}</div>
                </template>
                <span v-html="row._instructionManual"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="publisherPersonName" min-width="90"></el-table-column>
          <el-table-column label="产品经理" prop="productManager" min-width="160">
            <template #default="{ row }">
              <el-tooltip :disabled="!row.overflow_productManager" content=" " effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._productManagerFull }}</div>
                </template>
                <span v-html="row._productManager"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="产品设计" prop="productDesign" min-width="160"></el-table-column>
          <el-table-column label="运营" prop="operation" min-width="90"></el-table-column>
          <el-table-column label="陈峥校对" prop="proofreadingStatus" min-width="100">
            <template #default="{ row }">
              <vab-icon v-if="row.proofreadingStatus === 1" icon="check-fill" class="custom-check" />
              {{ '' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="130"></el-table-column>
          <el-table-column label="操作" width="110" fixed="right">
            <template #default="{ row }">
              <el-dropdown>
                <el-button text type="primary" @click="handleShowSellingPoint(row)">
                  卖点
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleShowSellingPoint(row)">
                      <el-link type="primary" :underline="false">卖点</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleShowCopywriting(row)">
                      <el-link type="primary" :underline="false">文案</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleLongTerm(row)">
                      <el-link type="primary" :underline="false">长期提成</el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
    <!-- 发布任务 -->
    <vab-dialog
      title="发布任务"
      v-model="postTaskVisible"
      width="25%"
      @close="handleClosePostTask"
    >
      <el-form ref="postTaskFormRef" :model="postTaskForm" :rules="postTaskRules" label-position="right" label-width="auto" style="margin: 0 60px">
        <el-form-item label="sku" prop="sku">
          <el-select
            v-model="postTaskForm.sku"
            filterable
            remote
            default-first-option
            placeholder="点击输入和搜索"
            :remote-method="remoteSKUMethod"
            :loading="skuLoading"
          >
            <el-option
              v-for="item in skuOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="postTaskForm.taskType" placeholder="请选择任务类型">
            <el-option v-for="item in taskTypeOption" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="sites">
          <el-select v-model="postTaskForm.sites" placeholder="请选择站点" multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item in siteList" :label="item.label" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类" prop="position">
          <el-select v-model="postTaskForm.position" placeholder="请选择产品分类">
            <el-option v-for="item in productClassificationOption" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="要求完成日期" prop="finishDate">
          <el-date-picker v-model="postTaskForm.finishDate" type="date"  value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item label="设计类型" prop="artDesignType">
          <el-select v-model="postTaskForm.artDesignType" placeholder="请选择设计类型">
            <el-option v-for="item in designTypeOption" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="美工" prop="artDesign">
          <el-select v-model="postTaskForm.artDesign" placeholder="请选择人员" multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item in userList" :label="item.label" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="要求" prop="remark">
          <el-input v-model="postTaskForm.remark" type="textarea" :rows="3" resize="none" />
        </el-form-item>
        <el-form-item label="需求文件共享文档地址" prop="linkAddress">
          <el-input v-model="postTaskForm.linkAddress" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 60px;">
          <el-button type="danger" @click="handleClosePostTask">取消</el-button>
          <el-button type="success" @click="handleSubmitPostTask">确定</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 任务认领 -->
    <vab-dialog
      title="任务认领"
      v-model="missionClaimVisible"
      width="20%"
    >
      <el-form :model="missionClaimForm" style="margin: 0 10px;">
        <el-form-item label="设计类型" prop="type">
          <el-select v-model="missionClaimForm.type" placeholder="请选择设计类型">
            <el-option v-for="item in designTypeOption" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 10px;">
          <el-button type="danger" @click="missionClaimVisible = false">取消</el-button>
          <el-button type="success" @click="handleConfirmClaimMission">确定</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 任务分配 -->
    <vab-dialog
      title="任务分配"
      v-model="assignTaskVisible"
      width="20%"
    >
      <el-form :model="assignTaskForm" label-position="right" label-width="auto" style="margin: 0 10px">
        <el-form-item label="基础图片">
          <el-select v-model="assignTaskForm.baseImageUrlPerson" placeholder="请选择人员" multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item in userList" :label="item.label" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="建模渲染">
          <el-select v-model="assignTaskForm.moldingPerson" placeholder="请选择人员" multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item in userList" :label="item.label" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="A+">
          <el-select v-model="assignTaskForm.aPlus" placeholder="请选择人员" multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item in userList" :label="item.label" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频">
          <el-select v-model="assignTaskForm.videoPerson" placeholder="请选择人员" multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item in userList" :label="item.label" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明书">
          <el-select v-model="assignTaskForm.instructionPerson" placeholder="请选择人员" multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item in userList" :label="item.label" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 10px;">
          <el-button type="danger" @click="assignTaskVisible = false">取消</el-button>
          <el-button type="success" @click="handleConfirmAssignTask">确定</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 余量设定 -->
    <vab-dialog
      title="余量设定"
      v-model="marginSettingVisible"
      width="20%"
    >
      <el-form ref="marginSettingFormRef" :model="marginSettingForm" :rules="marginSettingFormRules" style="margin: 0 10px">
        <el-form-item label="天数余量" prop="dayMargin">
          <el-input v-model="marginSettingForm.dayMargin" type="number" />
        </el-form-item>
        <el-form-item label="比例余量" prop="proportionMargin">
          <el-input v-model="marginSettingForm.proportionMargin" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 10px;">
          <el-button type="danger" @click="marginSettingVisible = false">取消</el-button>
          <el-button type="success" @click="handleConfirmMarginSetting">确定</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 任务量统计 -->
    <vab-dialog
      title="任务量统计"
      v-model="taskStatisticsVisible"
      width="60%"
      @open="handleStatisticsOpened"
    >
      <div ref="chartContainer1" style="width: 100%; height: 300px; margin-bottom: 20px;"></div>
      <div ref="chartContainer2" style="width: 100%; height: 300px; margin-bottom: 20px;"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 备注 -->
    <vab-dialog
      title="备注"
      v-model="remarkVisible"
      width="20%"
    >
      <el-input v-model="remark" type="textarea" :rows="15" placeholder="请输入备注" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { CSSProperties } from 'vue'
import { designTypeOption, productClassificationOption, taskTypeOption } from '../constantOption'
import { addArtDesignTask, claimArtDesignTask, delArtDesignTask, finishArtDesignTask, getArtDesignTaskList, getArtDesignTaskMargin, getArtDesignTaskUserList, updateArtDesignTaskDistribute, updateArtDesignTaskMargin, updateArtDesignTaskRemark, updateLongTermArtDesignTask } from '/@/api/devlocal/imageTask'
import { getPoSkuList } from '/@/api/devlocal/purchasePo'
import { getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { IAddArtDesignTaskReq, IArtDesignTaskMargin, IGetArtDesignTaskList, IGetArtDesignTaskListReq } from '/@/type/listingTask/imageTaskType'
import { formatDate } from '/@/utils/dateUtils'
import { flexColumnWidth } from '/@/utils/tableColum'
import { fontSize } from '~/src/config'

defineOptions({
  name: 'ImageTask'
})

const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({})
const router = useRouter()
const remark = ref<string>('')
const remarkVisible = ref<boolean>(false)
const taskStatisticsVisible = ref<boolean>(false)
const marginSettingVisible = ref<boolean>(false)
const marginSettingForm = reactive<any>({

})
const marginSettingFormRef = ref<FormInstance>()
const marginSettingFormRules = reactive<FormRules<IArtDesignTaskMargin>>({
  dayMargin: [{ required: true, message: '请输入天数余量', trigger: 'blur' }],
  proportionMargin: [{ required: true, message: '比例', trigger: 'blur' }],
})
const assignTaskVisible = ref<boolean>(false)
const assignTaskForm = reactive<any>({})
const selectedRows = ref<IGetArtDesignTaskList[]>([])
const setSelectedRows = (value: IGetArtDesignTaskList[]) => {
  selectedRows.value = value
}
const missionClaimVisible = ref<boolean>(false)
const missionClaimForm = reactive<{ type: number }>({
  type: 0
})

const skuLoading = ref(false) //搜索SKU-loading
const skuOptions = ref<{ value: string, label: string }[]>([]) //搜索选项
const skuList = ref<{ value: string, label: string }[]>([]) //搜索列表
const showBatchSellingPoint = () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选择任何行！', 'warning')
    return
  }
  const skus = selectedRows.value.map((item) => item.sku).join(',')
  const ids = selectedRows.value.map((item) => item.id).join(',')
  router.push({
    path: '/newProductTask/sellingPoint',
    query: {
      skus: skus,
      ids: ids
    },
  })
}
const remoteSKUMethod = async (query: string) => {
  if (query) {
    const { data } = await getPoSkuList({ sku: query })

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
const postTaskVisible = ref<boolean>(false)
const postTaskFormRef = ref<FormInstance>()
const postTaskForm = reactive<any>({
  sku: '',
  taskType: '老品优化',
  sites: [],
  position: 0,
  finishDate: '',
  artDesignType: 0,
  artDesign: '',
  remark: '',
  linkAddress: ''
})
const postTaskRules = reactive<FormRules<IAddArtDesignTaskReq>>({
  sku: [{ required: true, message: '请输入和搜索SKU', trigger: 'change' }],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  sites: [{ required: true, message: '请选择站点', trigger: 'change' }],
  position: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
  finishDate: [{ required: true, message: '请选择要求完成日期', trigger: 'change' }],
  artDesignType: [{ required: true, message: '请选择设计类型', trigger: 'change' }],
})
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const list = ref<IGetArtDesignTaskList[]>([])
const activeName = ref<number>(0)
const queryForm = reactive<IGetArtDesignTaskListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  status: 0
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const siteList = ref<{ id: number, label: string }[]>([])
const userList = ref<{ id: number, label: string }[]>([])
const _id = ref<number>(0)
const finishDate = ['']
const taskCount: number[] = []
const avgTaskCountDate = ['本周', '下一周', '下二周', '下三周', '下四周', '下五周']
const handleStatisticsOpened = () => {
  nextTick(() => {
    if (chartContainer1.value) {
      chartInstance1 = echarts.init(chartContainer1.value)
      chartObserver1 = new ResizeObserver(() => {
        if (chartInstance1) {
          chartInstance1.resize()
        }
      })
      chartObserver1.observe(chartContainer1.value)
      initChart1()
    }
    if (chartContainer2.value) {
      chartInstance2 = echarts.init(chartContainer2.value)
      chartObserver2 = new ResizeObserver(() => {
        if (chartInstance2) {
          chartInstance2.resize()
        }
      })
      chartObserver2.observe(chartContainer2.value)
      initChart2()
    }
  })
}
const initChart1 = () => {
  option1.value = {
    title: {
      text: '任务总数',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    grid: {
      top: 50,
      bottom: 5,
      left: 60,
      right: 60,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['2024-10-21', '2024-11-15', '2024-12-01', '2024-12-12'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        fontSize: 14
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLabel: {
        fontSize: 14
      },
      name: '任务个数'
    },
    series: [
      {
        name: '任务个数',
        type: 'line',
        data: [1, 1, 3, 3],
        itemStyle: {
          color: '#ff8fa5'
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
      },
    ]
  }
  chartInstance1?.setOption(option1.value)
}
const initChart2 = () => {
  option2.value = {
    title: {
      text: '人均任务数',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    grid: {
      top: 50,
      bottom: 5,
      left: 60,
      right: 60,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['本周', '下一周', '下二周', '下三周', '下四周', '下五周'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        fontSize: 14
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.1],
      axisLabel: {
        fontSize: 14
      },
      name: '人均周任务个数'
    },
    series: [
      {
        name: '人均周任务个数',
        type: 'line',
        data: [2.5, 1.5, 1, 0, 0, 0],
        itemStyle: {
          color: '#52bfff'
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
      },
    ]
  }
  chartInstance2?.setOption(option2.value)
}
const handleShowSellingPoint = (row: IGetArtDesignTaskList) => {
  router.push({
    path: '/newProductTask/sellingPoint',
    query: {
      sku: row.sku,
      id: row.id
    },
  })
}
const handleShowCopywriting = (row: IGetArtDesignTaskList) => {
  router.push({
    path: '/newProductTask/copywriting',
    query: {
      sku: row.sku,
      id: row.id
    },
  })
}
const handleConfirmAssignTask = async () => {
  const ids = selectedRows.value.map((item) => item.id).join(',')
  const { data } = await updateArtDesignTaskDistribute({
    ids,
    baseImageUrlPerson: assignTaskForm.baseImageUrlPerson.join(','),
    moldingPerson: assignTaskForm.moldingPerson.join(','),
    aPlus: assignTaskForm.aPlus.join(','),
    videoPerson: assignTaskForm.videoPerson.join(','),
    instructionPerson: assignTaskForm.instructionPerson.join(','),
  })
  if (data) {
    $baseMessage('任务分配修改成功！', 'success')
    assignTaskVisible.value = false
    fetchData()
  }
}
const handleUpdateRemark = async () => {
  const { data } = await updateArtDesignTaskRemark({
    id: _id.value,
    remark: remark.value
  })
  if (data) {
    $baseMessage('备注更新成功！', 'success')
    remarkVisible.value = false
    fetchData()
  }
}
const cellClick = (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  const label = column.label
  if (label === '备注') {
    _id.value = row.id
    remark.value = row.remark
    remarkVisible.value = true
  }
}
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name != undefined) {
    queryForm.status = Number(tab.props.name)
    queryData()
  }
}
const handleLongTerm = async (row: IGetArtDesignTaskList) => {
  $baseConfirm('确定要长期提成美工任务吗？', null, async () => {
    const { data } = await updateLongTermArtDesignTask({ id: row.id! })
    if (data) {
      $baseMessage('长期提成成功！', 'success')
      fetchData()
    }
  })
}
const handleFinish = async (row: IGetArtDesignTaskList) => {
  $baseConfirm('确定要完成美工任务吗？', null, async () => {
    const { data } = await finishArtDesignTask({ id: row.id! })
    if (data) {
      $baseMessage('完成成功！', 'success')
      fetchData()
    }
  })
}
const showTaskStatistics = async () => {
  taskStatisticsVisible.value = true
  // const { data } = await getArtDesignTaskStatistics()
  
}
const handleConfirmMarginSetting = async () => {
  marginSettingFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await updateArtDesignTaskMargin(marginSettingForm)
      if (data) {
        $baseMessage('余量设定修改成功！', 'success')
        marginSettingVisible.value = false
      }
    }
  })
}
const showMarginSetting = async () => {
  const { data } = await getArtDesignTaskMargin()
  Object.assign(marginSettingForm, data)
  marginSettingVisible.value = true
}
const showAssignTask = () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选择任何行！', 'warning')
    return
  }
  assignTaskVisible.value = true
}
const handleConfirmClaimMission = async () => {
  const ids = selectedRows.value.map((item) => item.id).join(',')
  const { data } = await claimArtDesignTask({
    ids,
    type: missionClaimForm.type
  })
  if (data) {
    $baseMessage('任务认领成功！', 'success')
    fetchData()
    missionClaimVisible.value = false
  }
}
const showMissionClaim = () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选择任何行！', 'warning')
    return
  }
  missionClaimVisible.value = true
}
const handleDelArtDesignTask = async (row: IGetArtDesignTaskList) => {
  $baseConfirm('确定要删除美工任务吗？', null, async () => {
    const { data } = await delArtDesignTask({ id: row.id! })
    if (data) {
      $baseMessage('删除美工任务成功！', 'success')
      fetchData()
    }
  })
}
const handleSubmitPostTask = async () => {
  postTaskFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addArtDesignTask({
        ...postTaskForm,
        sites: postTaskForm.sites.join(','),
        artDesign: postTaskForm.artDesign.join(',')
      })
      if (data) {
        $baseMessage('发布任务成功！', 'success')
        handleClosePostTask()
        fetchData()
      }
    }
  })
}
const handleClosePostTask = () => {
  postTaskFormRef.value?.resetFields()
  postTaskVisible.value = false
}
const showPostTask = async () => {
  postTaskVisible.value = true
  
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 2 || index === 3 || index === 4 || index === 12 || index === 13 || index === 14 || index === 15 || index === 16 || index === 18) {
    return {
      textAlign: 'left'
    }
  }
  return {
    textAlign: 'center'
  }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
// 处理","号分隔的人员换行以及tooltip展示
function processField(item: any, fieldName: string, max: number) {
  const fieldArray = item[fieldName]?.split(',')
  if (fieldArray && fieldArray.length > max) {
    item[`_${fieldName}`] = [fieldArray[0], fieldArray[1]].join('<br />') // 显示在表格上的处理过的
    item[`_${fieldName}`] += '...'
    item[`overflow_${fieldName}`] = true // 判断tooltip是否显示
    item[`_${fieldName}Full`] = fieldArray.join('\n')  // tooltip显示全部内容
  } else {
    item[`overflow_${fieldName}`] = false
    item[`_${fieldName}`] = fieldArray?.join('<br />')!
    item[`_${fieldName}Full`] = item[`_${fieldName}`]  
  }
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getArtDesignTaskList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    processField(item, 'sites', 3)
    processField(item, 'productManager', 3)
    processField(item, 'basePicture', 2)
    processField(item, 'modeling', 2)
    processField(item, 'aAdd', 2)
    processField(item, 'video', 2)
    processField(item, 'instructionManual', 2)
  })
  listLoading.value = false
}
const fetchSiteList = async () => {
  const { data } = await getSeasonalCoefficientSiteList()
  siteList.value = data
}
const fetchUserList = async () => {
  const { data } = await getArtDesignTaskUserList()
  userList.value = data
}
onBeforeMount(() => {
  fetchSiteList()
  fetchUserList()
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
          // .left-panel { //自加
          //   margin-bottom: 15px !important;
          // }
          .el-form {
            .el-form-item:first-child {
              margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
            .el-form-item:last-child { //自加
              margin: 0 !important;
            }
          }
        }

        .el-table {
          flex: 1;

          .custom-check {
            transform: scale(1.4);
            color: var(--el-color-success)
          }
          .el-checkbox {
            transform: scale(1.3);
            transform-origin: center;
          }
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
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>
