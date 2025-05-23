<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="未分配" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showPostTask">发布任务</el-button>
            <el-button type="primary" @click="showMarginSetting">余量设定</el-button>
            <el-button type="primary" @click="showReasons">选品理由设定</el-button>
            <el-button type="primary" @click="showTaskStatistics">任务量统计</el-button>
            <el-button type="primary" @click="showBatchSellingPoint">卖点填写(批量)</el-button>
            <!-- <el-button type="primary" @click="showMissionClaim">任务认领</el-button> -->
            <el-button type="primary" @click="showAssignTask">任务分配</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyword" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData"/>
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
        v-loading="listLoading"
          border :cell-class-name="clearPadding"
          :cell-style="cellStyle" class="noneHoveTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          @cell-click="cellClick"
          @selection-change="setSelectedRows"
        >
          <el-table-column fixed="left" type="selection"/>
          <el-table-column label="图片" prop="skuImgUrl" width="75">
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px;" @click="imagePreviewShow(row.skuImgUrl)">
                <template #error><el-icon/></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{  row.sku  }}<br />
              {{ row.desc }}
            </template>
          </el-table-column>
          <el-table-column label="ASIN" min-width="160" prop="asin">
            <template #default="{ row }">
              <el-link :href="row.amazonUrl" target="_blank" type="primary">{{ row.asin }}</el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column label="站点" min-width="150" prop="sites">
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_sites" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._sitesFull }}</div>
                </template>
                <span v-html="row._sites"></span>
              </el-tooltip>
            </template>
          </el-table-column> -->
          <el-table-column label="任务类型" min-width="100" prop="taskType"/>
          <el-table-column label="产品定位" min-width="100" prop="positioning"/>
          <el-table-column label="要求完成日期" min-width="125" prop="finishDate">
            <template #default="{ row }">
              {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="实际完成日期" min-width="125" prop="actualFinishDate">
            <template #default="{ row }">
              {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="剩余自然日" min-width="110" prop="naturalDay" >
            <template #default="{ row }">
              <el-text v-if="row.naturalDay < 0" type="danger">{{ row.naturalDay }}</el-text>
              <el-text v-if="row.naturalDay >= 0 && row.naturalDay <= 7" type="warning">{{ row.naturalDay }}</el-text>
              <el-text v-if="row.naturalDay > 7" type="success">{{ row.naturalDay }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="需求文件地址" min-width="160" prop="requiredAddress">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.requiredAddress" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.requiredAddress }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.requiredAddress }}</el-text>
              </el-tooltip>
              <!-- <el-text truncated>{{ row.requiredAddress }}</el-text> -->
            </template>
          </el-table-column>
          <el-table-column label="卖点完成" min-width="100" prop="sellingPointStatus">
            <template #default="{ row }">
              <vab-icon v-if="row.sellingPointStatus === 1" class="custom-check" icon="check-fill" />
              {{ '' }}
            </template>
          </el-table-column>
          <template v-for="col in columnConfigs" :key="col.prop">
            <el-table-column 
              v-if="!col.isSpecial"
              :label="col.label"
              :prop="col.prop"
              :width="calculateBrColumnWidth(list, (row: any) => row[col.dataKey as string], col.baseWidth, 30)"
            >
              <template #default="{ row }">
                <span
                  v-for="(username, index) in splitUsernames(row[col.prop])"
                  :key="index"
                  class="username-item"
                  :class="getHighlightClass(username)"
                >{{ username }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :label="col.label"
              :prop="col.prop"
              :width="flexColumnWidth(list, '发布人', 'publisherPersonName')"
            />
          </template>
          <el-table-column label="陈峥校对" min-width="100" prop="proofreadingStatus">
            <template #default="{ row }">
              <vab-icon v-if="row.proofreadingStatus === 1" class="custom-check" icon="check-fill" />
              {{ '' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="130" prop="remark">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.remark }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.remark }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="110">
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
            <el-empty class="vab-data-empty"/>
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
      <el-tab-pane label="已分配" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showPostTask">发布任务</el-button>
            <el-button type="primary" @click="showMarginSetting">余量设定</el-button>
            <el-button type="primary" @click="showReasons">选品理由设定</el-button>
            <el-button type="primary" @click="showTaskStatistics">任务量统计</el-button>
            <el-button type="primary" @click="showBatchSellingPoint">卖点填写(批量)</el-button>
            <!-- <el-button type="primary" @click="showMissionClaim">任务认领</el-button> -->
            <el-button type="primary" @click="showAssignTask">任务分配修改</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyword" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData"/>
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
        v-loading="listLoading"
          border :cell-class-name="clearPadding"
          :cell-style="cellStyle" class="noneHoveTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          @cell-click="cellClick"
          @selection-change="setSelectedRows"
        >
          <el-table-column fixed="left" type="selection"/>
          <el-table-column label="图片" prop="skuImgUrl" width="75">
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px;" @click="imagePreviewShow(row.skuImgUrl)">
                <template #error><el-icon/></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{  row.sku  }}<br />
              {{ row.desc }}
            </template>
          </el-table-column>
          <el-table-column label="ASIN" min-width="160" prop="">
            <template #default="{ row }">
              <el-link :href="row.amazonUrl" target="_blank" type="primary">{{ row.asin }}</el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column label="站点" min-width="150" prop="sites">
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_sites" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._sitesFull }}</div>
                </template>
                <span v-html="row._sites"></span>
              </el-tooltip>
            </template>
          </el-table-column> -->
          <el-table-column label="任务类型" min-width="100" prop="taskType"/>
          <el-table-column label="产品定位" min-width="100" prop="positioning"/>
          <el-table-column label="要求完成日期" min-width="125" prop="finishDate">
            <template #default="{ row }">
              {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="实际完成日期" min-width="125" prop="actualFinishDate">
            <template #default="{ row }">
              {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="剩余自然日" min-width="110" prop="naturalDay">
            <template #default="{ row }">
              <el-text v-if="row.naturalDay < 0" type="danger">{{ row.naturalDay }}</el-text>
              <el-text v-if="row.naturalDay >= 0 && row.naturalDay <= 7" type="warning">{{ row.naturalDay }}</el-text>
              <el-text v-if="row.naturalDay > 7" type="success">{{ row.naturalDay }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="需求文件地址" min-width="160" prop="requiredAddress">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.requiredAddress" @blur="clickCancel($event, row)" @keyup.enter="clickCancel($event, row)" />
              </div>
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.requiredAddress }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.requiredAddress }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="卖点完成" min-width="100" prop="sellingPointStatus">
            <template #default="{ row }">
              <vab-icon v-if="row.sellingPointStatus === 1" class="custom-check" icon="check-fill" />
              {{ '' }}
            </template>
          </el-table-column>
          <template v-for="col in columnConfigs" :key="col.prop">
            <el-table-column 
              v-if="!col.isSpecial"
              :label="col.label"
              :prop="col.prop"
              :width="calculateBrColumnWidth(list, (row: any) => row[col.dataKey as string], col.baseWidth, 30)"
            >
              <template #default="{ row }">
                <span
                  v-for="(username, index) in splitUsernames(row[col.prop])"
                  :key="index"
                  class="username-item"
                  :class="getHighlightClass(username)"
                >{{ username }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :label="col.label"
              :prop="col.prop"
              :width="flexColumnWidth(list, '发布人', 'publisherPersonName')"
            />
          </template>
          <el-table-column label="陈峥校对" min-width="100" prop="proofreadingStatus">
            <template #default="{ row }">
              <vab-icon v-if="row.proofreadingStatus === 1" class="custom-check" icon="check-fill" />
              {{ '' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="130" prop="remark">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.remark }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.remark }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="110">
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
            <el-empty class="vab-data-empty"/>
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
          <vab-query-form-right-panel :span="24">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyword" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData"/>
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData"/>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
        v-loading="listLoading"
          border :cell-class-name="clearPadding"
          :cell-style="cellStyle" class="noneHoveTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          @cell-click="cellClick"
          @selection-change="setSelectedRows"
        >
          <el-table-column fixed="left" type="selection"/>
          <el-table-column label="图片" prop="skuImgUrl" width="75">
            <template #default="{ row }">
              <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px;" @click="imagePreviewShow(row.skuImgUrl)">
                <template #error><el-icon/></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
            <template #default="{ row }">
              {{  row.sku  }}<br />
              {{ row.desc }}
            </template>
          </el-table-column>
          <el-table-column label="ASIN" min-width="160" prop="">
            <template #default="{ row }">
              <el-link :href="row.amazonUrl" target="_blank" type="primary">{{ row.asin }}</el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column label="站点" min-width="150" prop="sites">
            <template #default="{ row }">
              <el-tooltip content=" " :disabled="!row.overflow_sites" effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip" >{{ row._sitesFull }}</div>
                </template>
                <span v-html="row._sites"></span>
              </el-tooltip>
            </template>
          </el-table-column> -->
          <el-table-column label="任务类型" min-width="100" prop="taskType"/>
          <el-table-column label="产品定位" min-width="100" prop="positioning"/>
          <el-table-column label="要求完成日期" min-width="125" prop="finishDate">
            <template #default="{ row }">
              {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="实际完成日期" min-width="125" prop="actualFinishDate">
            <template #default="{ row }">
              {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="提前完成天数" min-width="130" prop="advanceDays">
            <template #default="{ row }">
              <el-text v-if="row.advanceDays >= 0" type="success">{{ row.advanceDays }}</el-text>
              <el-text v-if="row.advanceDays < 0" type="danger">{{ row.advanceDays }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="需求文件地址" min-width="160" prop="requiredAddress"/>
          <el-table-column label="卖点完成" min-width="100" prop="sellingPointStatus">
            <template #default="{ row }">
              <vab-icon v-if="row.sellingPointStatus === 1" class="custom-check" icon="check-fill" />
              {{ '' }}
            </template>
          </el-table-column>
          <template v-for="col in columnConfigs" :key="col.prop">
            <el-table-column 
              v-if="!col.isSpecial"
              :label="col.label"
              :prop="col.prop"
              :width="calculateBrColumnWidth(list, (row: any) => row[col.dataKey as string], col.baseWidth, 30)"
            >
              <template #default="{ row }">
                <span
                  v-for="(username, index) in splitUsernames(row[col.prop])"
                  :key="index"
                  class="username-item"
                  :class="getHighlightClass(username)"
                >{{ username }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :label="col.label"
              :prop="col.prop"
              :width="flexColumnWidth(list, '发布人', 'publisherPersonName')"
            />
          </template>
          <el-table-column label="陈峥校对" min-width="100" prop="proofreadingStatus">
            <template #default="{ row }">
              <vab-icon v-if="row.proofreadingStatus === 1" class="custom-check" icon="check-fill" />
              {{ '' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="130" prop="remark">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.remark }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.remark }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="110">
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
            <el-empty class="vab-data-empty"/>
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
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 发布任务 -->
    <vab-dialog
      v-model="postTaskVisible"
      title="发布任务"
      width="25%"
      @close="handleClosePostTask"
    >
      <el-form ref="postTaskFormRef" label-position="right" label-width="auto" :model="postTaskForm" :rules="postTaskRules" style="margin: 0 60px">
        <el-form-item label="sku" prop="sku">
          <el-select
            v-model="postTaskForm.sku"
            default-first-option
            filterable
            :loading="skuLoading"
            placeholder="点击输入和搜索"
            remote
            :remote-method="remoteSKUMethod"
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
            <el-option v-for="item in taskTypeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="sites">
          <el-select v-model="postTaskForm.sites" collapse-tags collapse-tags-tooltip multiple placeholder="请选择站点">
            <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类" prop="position">
          <el-select v-model="postTaskForm.position" placeholder="请选择产品分类">
            <el-option v-for="item in productPositionOption" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="要求完成日期" prop="finishDate">
          <el-date-picker v-model="postTaskForm.finishDate" :disabled-date="(time: Date) => time.getTime() < Date.now() - 8.64e7" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="设计类型" prop="artDesignType">
          <el-select v-model="postTaskForm.artDesignType" placeholder="请选择设计类型">
            <el-option v-for="item in designTypeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="美工" prop="artDesign">
          <el-select v-model="postTaskForm.artDesign" collapse-tags collapse-tags-tooltip multiple placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="要求" prop="remark">
          <el-input v-model="postTaskForm.remark" resize="none" :rows="3" type="textarea" />
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
    <!-- <vab-dialog
      v-model="missionClaimVisible"
      title="任务认领"
      width="20%"
    >
      <el-form :model="missionClaimForm" style="margin: 0 10px;">
        <el-form-item label="设计类型" prop="type">
          <el-select v-model="missionClaimForm.type" placeholder="请选择设计类型">
            <el-option v-for="item in designTypeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin-right: 10px;">
          <el-button type="danger" @click="missionClaimVisible = false">取消</el-button>
          <el-button type="success" @click="handleConfirmClaimMission">确定</el-button>
        </div>
      </template>
    </vab-dialog> -->
    <!-- 任务分配 -->
    <vab-dialog
      v-model="assignTaskVisible"
      title="任务分配"
      width="26%"
    >
      <el-form label-position="right" label-width="auto" :model="assignTaskForm" style="margin: 0 10px">
        <el-form-item label="基础图片">
          <el-select v-model="assignTaskForm.baseImageUrlPerson" collapse-tags collapse-tags-tooltip :max-collapse-tags="6" multiple placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="建模渲染">
          <el-select v-model="assignTaskForm.moldingPerson" collapse-tags collapse-tags-tooltip :max-collapse-tags="6" multiple placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="A+">
          <el-select v-model="assignTaskForm.aPlus" collapse-tags collapse-tags-tooltip :max-collapse-tags="6" multiple placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频">
          <el-select v-model="assignTaskForm.videoPerson" collapse-tags collapse-tags-tooltip :max-collapse-tags="6" multiple placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明书">
          <el-select v-model="assignTaskForm.instructionPerson" collapse-tags collapse-tags-tooltip :max-collapse-tags="6" multiple placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
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
      v-model="marginSettingVisible"
      title="余量设定"
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
      v-model="taskStatisticsVisible"
      title="任务量统计"
      width="60%"
      @open="handleStatisticsOpened"
    >
      <div ref="chartContainer1" style="width: 100%; height: 300px; margin-bottom: 20px;"></div>
      <div ref="chartContainer2" style="width: 100%; height: 300px; margin-bottom: 20px;"></div>
      <template #footer></template>
    </vab-dialog>
    <!-- 备注 -->
    <vab-dialog
      v-model="remarkVisible"
      title="备注"
      width="20%"
    >
      <el-input v-model="remark" placeholder="请输入备注" :rows="15" type="textarea" />
      <template #footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateRemark">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 选品理由设定 -->
    <vab-dialog
      v-model="reasonsVisible"
      title="选品理由设定"
      width="20%"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="addReasonVisible = true">新增</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table border :data="reasonsList" stripe>
        <el-table-column label="选品理由" prop="reason"/>
        <el-table-column align="center" label="操作" width="80">
          <template #default="{ row, $index }">
            <el-link type="danger" :underline="false" @click="handleDelReason(row, $index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <template #footer></template>
    </vab-dialog>
    <!-- 新增选品理由 -->
    <vab-dialog
      v-model="addReasonVisible"
      title="新增选品理由"
      width="20%"
      @close="closeAddReason"
    >
      <el-form ref="addFormRef" :model="addReasonForm" :rules="addFormRules" style="margin: 0;">
        <el-form-item label="选品理由" prop="reason">
          <el-input v-model="addReasonForm.reason" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeAddReason">取消</el-button>
        <el-button type="primary" @click="confirmAddReason">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { type FormInstance, type FormRules, type TabsPaneContext } from 'element-plus'
import { isEqual } from 'lodash'
import type { CSSProperties } from 'vue'
import { getProductPositionList } from '~/src/api/devlocal/orderProcess'
import { designTypeOption, taskTypeOption } from '../constantOption'
import { addArtDesignSelectionReasons, addArtDesignTask, delArtDesignSelectionReasons, delArtDesignTask, finishArtDesignTask, getArtDesignSelectionReasonsList, getArtDesignTaskList, getArtDesignTaskMargin, getArtDesignTaskUserList, queryArtDesignTaskDistribution, updateArtDesignDemandAddress, updateArtDesignTaskDistribute, updateArtDesignTaskMargin, updateArtDesignTaskRemark, updateLongTermArtDesignTask } from '/@/api/devlocal/imageTask'
import { getPoSkuList } from '/@/api/devlocal/purchasePo'
import { getSeasonalCoefficientSiteList } from '/@/api/devlocal/seasonalCoefficient'
import { useUserStore } from '/@/store/modules/user'
import type { IAddArtDesignTaskReq, IArtDesignTaskMargin, IGetArtDesignSelectionReasonsList, IGetArtDesignTaskList, IGetArtDesignTaskListReq } from '/@/type/listingTask/imageTaskType'
import { formatDate } from '/@/utils/dateUtils'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ListingImageTask'
})

const router = useRouter()
const route = useRoute()
interface ColumnConfig {
  label: string
  prop: string
  dataKey?: string 
  baseWidth?: number
  isSpecial?: boolean 
}
const columnConfigs: ColumnConfig[] = [
  { label: '基础图片', prop: 'basePicture', dataKey: '_basePicture', baseWidth: 100 },
  { label: '建模/渲染', prop: 'modeling', dataKey: '_modeling', baseWidth: 110 },
  { label: 'A+', prop: 'aAdd', dataKey: '_aAdd', baseWidth: 90 },
  { label: '视频', prop: 'video', dataKey: '_video', baseWidth: 90 },
  { label: '说明书/包装', prop: 'instructionManual', dataKey: '_instructionManual', baseWidth: 120 },
  { 
    label: '发布人', 
    prop: 'publisherPersonName', 
    isSpecial: true 
  },
  { label: '产品经理', prop: 'productManager', dataKey: '_productManager', baseWidth: 100 },
  { label: '产品设计', prop: 'productDesign', dataKey: '_productDesign', baseWidth: 100 },
  { label: '运营', prop: 'operation', dataKey: '_operation', baseWidth: 100 }
]
const chartContainer1 = ref<HTMLElement | null>(null)
const chartContainer2 = ref<HTMLElement | null>(null)
let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartObserver1: ResizeObserver
let chartObserver2: ResizeObserver
const option1 = ref<any>({})
const option2 = ref<any>({})
const remark = ref<string>('')
const remarkVisible = ref<boolean>(false)
const taskStatisticsVisible = ref<boolean>(false)
const marginSettingVisible = ref<boolean>(false)
const marginSettingForm = reactive<any>({})
const marginSettingFormRef = ref<FormInstance>()
const marginSettingFormRules = reactive<FormRules<IArtDesignTaskMargin>>({
  dayMargin: [{ required: true, message: '请输入天数余量', trigger: 'blur' }],
  proportionMargin: [{ required: true, message: '比例', trigger: 'blur' }],
})
const assignTaskVisible = ref<boolean>(false)
const assignTaskForm = reactive<any>({
  baseImageUrlPerson: [],
  moldingPerson: [],
  aPlus: [],
  videoPerson: [],
  instructionPerson: []
})
const selectedRows = ref<IGetArtDesignTaskList[]>([])
const setSelectedRows = (value: IGetArtDesignTaskList[]) => {
  selectedRows.value = value
}
// const missionClaimVisible = ref<boolean>(false)
// const missionClaimForm = reactive<{ type: number }>({
//   type: 0
// })
const skuLoading = ref(false) //搜索SKU-loading
const skuOptions = ref<{ value: string, label: string }[]>([]) //搜索选项
const skuList = ref<{ value: string, label: string }[]>([]) //搜索列表
const reasonsVisible = ref<boolean>(false)
const reasonsList = ref<IGetArtDesignSelectionReasonsList[]>([])
const addReasonVisible = ref<boolean>(false)
const addReasonForm = reactive<{ reason: string }>({
  reason: ''
})
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<FormRules<{ reason: string }>>({
  reason: [{ required: true, message: '请输入选品理由', trigger: 'blur' }]
})
let copyRow: any
const splitUsernames = (usernames: string) => {
  return usernames.split(',').map(username => username.trim())
}
const getHighlightClass = (username: string) => {
  return username === currentUser ? 'highlight' : ''
}
// table blur事件
const clickCancel = async (event:any, value:any) => {
  const rootElement = getRootElement(event.srcElement, ".cell")

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1) t1.classList.add("none")
    if (t2) t2.classList.remove("none")
  }
  if (isEqual(copyRow, value)) {
    return
  }
  if (event.type === 'blur') {
    // 执行失去焦点处理逻辑
    try {
      await updateArtDesignDemandAddress({
        id: value.id,
        demandAddress: value.requiredAddress
      })
    } catch {
      Object.assign(value, copyRow)
    }
  }
}
const closeAddReason = () => {
  addFormRef.value?.resetFields()
  addReasonVisible.value = false
}
const confirmAddReason = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addArtDesignSelectionReasons({
        reason: addReasonForm.reason
      })
      if (data) {
        $baseMessage('新增选品理由成功！', 'success')
        closeAddReason()
        fetchReasonsData()
      }
    }
  })
}
const handleDelReason = async (row: IGetArtDesignSelectionReasonsList, index: number) => {
  $baseConfirm('确定要删除选品理由吗？', null, async () => {
    const { data } = await delArtDesignSelectionReasons({
      id: row.id
    })
    if (data) {
      $baseMessage('删除成功！', 'success')
      reasonsList.value.splice(index, 1)
    }
  })
}
const fetchReasonsData = async () => {
  const { data } = await getArtDesignSelectionReasonsList()
  reasonsList.value = data
}
const showReasons = async () => {
  fetchReasonsData()
  reasonsVisible.value = true
}
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
      skus,
      ids
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
  artDesign: [],
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
  keyword: '',
  pageNo: 1,
  pageSize: 20,
  status: 0
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const siteList = ref<{ id: number, label: string }[]>([])
const userList = ref<{ id: number, label: string }[]>([])
const _id = ref<number>(0)
// const finishDate = ['']
// const taskCount: number[] = []
// const avgTaskCountDate = ['本周', '下一周', '下二周', '下三周', '下四周', '下五周']
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
    type: activeName.value
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
const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
  const label = column.label
  if (label === '备注') {
    _id.value = row.id
    remark.value = row.remark
    remarkVisible.value = true
  } else if (label === '需求文件地址') {
    const firstChild = cell?.children[0]?.children[0]
    const secondChild = cell?.children[0]?.children[1]

    if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
      return
    }

    copyRow = JSON.parse(JSON.stringify(row))

    if (firstChild.classList.contains('none')) {
      firstChild.classList.remove('none')
      secondChild.classList.add('none')

      focusAndSelectInput(cell)
    }
  }
}
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name != undefined) {
    queryForm.status = Number(tab.props.name)
    router.push({
      query: {
        ...route.query,
        tab: tab.props.name,
        pageNo: '1',
        pageSize: queryForm.pageSize,
      }
    })
    fetchData()
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
const showAssignTask = async () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选择任何行！', 'warning')
    return
  }
  if (selectedRows.value.length > 1 && activeName.value === 1) {
    $baseMessage('您只能选择一行！', 'warning')
    return
  }
  if (activeName.value === 1) {
    // console.log(selectedRows.value)
    const { data } = await queryArtDesignTaskDistribution({ taskId: selectedRows.value[0].id! })
    if (data) {
      assignTaskForm.baseImageUrlPerson = data.baseImageUrlPersons
      assignTaskForm.moldingPerson = data.moldingPersons
      assignTaskForm.aPlus = data.aPlus
      assignTaskForm.videoPerson = data.videoPersons
      assignTaskForm.instructionPerson = data.instructionPersons
    }
  }
  assignTaskVisible.value = true
}
// const handleConfirmClaimMission = async () => {
//   const ids = selectedRows.value.map((item) => item.id).join(',')
//   const { data } = await claimArtDesignTask({
//     ids,
//     type: missionClaimForm.type
//   })
//   if (data) {
//     $baseMessage('任务认领成功！', 'success')
//     fetchData()
//     missionClaimVisible.value = false
//   }
// }
// const showMissionClaim = () => {
//   if (selectedRows.value.length === 0) {
//     $baseMessage('您未选择任何行！', 'warning')
//     return
//   }
//   missionClaimVisible.value = true
// }
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
    console.log(postTaskForm.sites)
    if (isValid) {
      const { data } = await addArtDesignTask({
        ...postTaskForm,
        // sites: postTaskForm.sites.join(','),
        // artDesign: postTaskForm.artDesign.join(',')
        sites: Array.isArray(postTaskForm.sites) ? postTaskForm.sites.join(',') : '',
        artDesign: Array.isArray(postTaskForm.artDesign) ? postTaskForm.artDesign.join(',') : ''
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
  await fetchProductPositionOption()
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
  const label = data.column.label
  if (['SKU', '站点', '需求文件地址', '备注'].includes(label)) {
    return {
      textAlign: 'left'
    }
  }
  // else if (['基础图片', '建模/渲染', 'A+', '视频', '说明书/包装', '产品设计',].includes(label)) {
  //   return {
  //     textAlign: 'left',
  //   }
  // }
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

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getArtDesignTaskList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    // processField(item, 'sites', 3)
    item._basePicture = item.basePicture?.replaceAll(',', '<br />')
    item._productManager = item.productManager?.replaceAll(',', '<br />')
    item._modeling = item.modeling?.replaceAll(',', '<br />')
    item._aAdd = item.aAdd?.replaceAll(',', '<br />')
    item._video = item.video?.replaceAll(',', '<br />')
    item._instructionManual = item.instructionManual?.replaceAll(',', '<br />')
    item._operation = item.operation?.replaceAll(',', '<br />')
    item._productDesign = item.productDesign?.replaceAll(',', '<br />')
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
const useUser = useUserStore()
const currentUser = useUser.getUsername
const productPositionOption = ref<{ id: number, label: string }[]>([])
const fetchProductPositionOption = async () => {
  const { data } = await getProductPositionList()
  productPositionOption.value = data
}
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
    queryForm.status = activeName.value
  }
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
          .left-panel { //自加
            margin-bottom: 5px !important;
          }
          .right-panel {
            margin-bottom: 5px !important;
          }
        }

        .el-table {
          flex: 1;

          .custom-check {
            color: var(--el-color-success);
            transform: scale(1.4);
          }
          .el-checkbox {
            transform: scale(1.3);
            transform-origin: center;
          }
          .clear-padding {
            padding-top: 0;
            padding-bottom: 0;
            .cell {
              padding-right: 0;
              padding-left: 0;
            }
          }
          .highlight {
            color: var(--el-color-danger);
          }
          .username-item {
            display: block;
          }
        }
      }
    }
  }
}
.custom-tooltip {
  max-width: 400px; 
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
}
.none {
  display: none;
}
// :deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
//   background-color: #fff !important;
// }
// :deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
//   background-color: #fafafa !important; 
// }
</style>
