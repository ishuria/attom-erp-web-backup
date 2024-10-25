<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick" :lazy="true">
      <el-tab-pane label="待打包" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button type="primary" class="button-margin" @click="handleShowGetOffWork">下班人员</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowStartTask">开始任务</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowFinishTask">结束任务</el-button>
                <el-button type="primary" class="button-margin">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" >
                <el-select placeholder="请选择站点" clearable class="button-margin"></el-select>
              </el-form-item>
            </el-form>
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
          ref="tableRef" 
          stripe border 
          :data="fakeData"
          class="noneHoveTable"
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          :cell-class-name="cellClassName"
          @cell-click="changeInput"
          @selection-change="setSelectRows"
        >
          <el-table-column type="selection" fixed="left"></el-table-column>
          <el-table-column label="发货日期" prop="createTime" min-width="115">
            <template #default="{ row }">
              {{ row.createTime.split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="PO" min-width="100" prop="po"></el-table-column>
          <el-table-column label="订单总数" prop="createTime" min-width="115"></el-table-column>
          <el-table-column label="站点" prop="siteName" min-width="140"></el-table-column>
          <el-table-column label="产品图片" class="image-wall" width="77">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row, $index }">
              <el-image :src="row.url" data-img="img" style="display: block; width: 100%; height: 100%" fit="contain">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" prop="taxIncludedPrice" min-width="200"></el-table-column>   
          <el-table-column prop="isPriorityPacking" label="优先打包" min-width="100">
            <template #default="{ row }">
              <el-checkbox :true-value="1" :false-value="0" ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="任务数" width="100" prop="taskCount" ></el-table-column>
          <el-table-column label="推荐数量" width="100" prop="count" ></el-table-column>
          <el-table-column label="已装箱数" width="100" prop="purchaseCount" ></el-table-column>
          <el-table-column label="清点质检" prop="qualityInspection" min-width="100"> 
            <template #default="{ row }">
              <el-switch v-model="row.qualityInspection" :active-value="1" :inactive-value="0" @change="handleShowPackingCount" style="--el-switch-on-color: #13ce66;"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="实际完成数量" width="130" prop="unit" ></el-table-column>
          <el-table-column label="打包注意事项" prop="purchaseMatters" min-width="250">
              <template #default="{ row }">
                  <div class="none">
                      <el-input type="text" v-model="row.purchaseMatters"  />
                  </div>
                  <span class="overflow-text">{{ removeHtmlTags(row.purchaseMatters) }}</span>
              </template>
          </el-table-column>    
          <el-table-column  label="产品经理" min-width="100" prop="suppliser"></el-table-column>
          <el-table-column fixed="right" label="操作" width="450" >
            <template #default="{ row, $index }">
              <el-space>
                <el-button link type="primary">条码文件夹</el-button>
                <el-button link type="primary" @click="handleShowPartsList">零件清单</el-button>
                <el-button link type="primary" @click="handleShowQualityInspectionReport">质检</el-button>
                <el-button link type="primary">生成条形码</el-button>
                <el-button link type="primary">拆分</el-button>
                <el-button link type="primary" @click="handleShowModify">修改</el-button>
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
      <el-tab-pane label="进行中" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button type="primary" class="button-margin" @click="handleShowCurrentTask">当前任务加人</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowGetOffWork">下班人员</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowFinishTask">结束任务</el-button>
                <el-button type="primary" class="button-margin">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" >
                <el-select placeholder="请选择站点" clearable class="button-margin"></el-select>
              </el-form-item>
            </el-form>
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
            <el-form inline>
              <el-form-item>
                <el-button type="primary" class="button-margin" @click="handleShowGetOffWork">下班人员</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowStartTask">开始任务</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowFinishTask">结束任务</el-button>
                <el-button type="primary" class="button-margin">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" >
                <el-select placeholder="请选择站点" clearable class="button-margin"></el-select>
              </el-form-item>
            </el-form>
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
        <vab-pagination 
          :current-page="queryForm.pageNo" 
          :page-size="queryForm.pageSize" 
          :total="total"
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
        />
      </el-tab-pane>
      <el-tab-pane label="零头" :name="3">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button type="primary" class="button-margin" @click="handleShowGetOffWork">下班人员</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowStartTask">开始任务</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowFinishTask">结束任务</el-button>
                <el-button type="primary" class="button-margin">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" >
                <el-select placeholder="请选择站点" clearable class="button-margin"></el-select>
              </el-form-item>
            </el-form>
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
        <vab-pagination 
          :current-page="queryForm.pageNo" 
          :page-size="queryForm.pageSize" 
          :total="total"
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
        />
      </el-tab-pane>
      <el-tab-pane label="售后" :name="4">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button type="primary" class="button-margin" @click="handleShowGetOffWork">下班人员</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowStartTask">开始任务</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowFinishTask">结束任务</el-button>
                <el-button type="primary" class="button-margin">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" >
                <el-select placeholder="请选择站点" clearable class="button-margin"></el-select>
              </el-form-item>
            </el-form>
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
        <vab-pagination 
          :current-page="queryForm.pageNo" 
          :page-size="queryForm.pageSize" 
          :total="total"
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
        />
      </el-tab-pane>
      <el-tab-pane label="未到货" :name="5">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-form inline>
              <el-form-item>
                <el-button type="primary" class="button-margin" @click="handleShowGetOffWork">下班人员</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowStartTask">开始任务</el-button>
                <el-button type="primary" class="button-margin" @click="handleShowFinishTask">结束任务</el-button>
                <el-button type="primary" class="button-margin">工作量预估</el-button>
              </el-form-item>
              <el-form-item label="站点" >
                <el-select placeholder="请选择站点" clearable class="button-margin"></el-select>
              </el-form-item>
            </el-form>
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
        <vab-pagination 
          :current-page="queryForm.pageNo" 
          :page-size="queryForm.pageSize" 
          :total="total"
          @current-change="handleCurrentChange" 
          @size-change="handleSizeChange" 
        />
      </el-tab-pane>
    </el-tabs>

    <wangEditor
      :title="wangEditorTitle"
      :wangEditorVisible="wangEditorLogVisible"
      :content="progressLogCopy"
      @clickChild="clickLog"
      @clickBoolean="clickLogBool"
      :classify="classify"
    >
    </wangEditor>
    <!-- 零件清单 -->
    <vab-dialog
      title="零配件清单"
      v-model="dialogPartsListTableVisible"
      width="45%"
    >
      <el-table
        border stripe
        :data="fakePartsList"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="partsListCellStyle"
        :cell-class-name="partsListCellClassName"
        max-height="500px"
        @cell-click="changePartsListInput"
      >
        <el-table-column label="零件ID" prop="id"></el-table-column>
        <el-table-column label="图片" prop="img" width="60">
          <template #default="{ row }">
            <el-image :src="row.url" data-img="img" fit="contain" style="display: block; width: 100%; height: 100%">
              <template #error>
                <el-icon></el-icon>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="零件名" prop="componentName" min-width="200"></el-table-column>
        <el-table-column label="总数" prop="quantity"></el-table-column>
        <el-table-column label="每套SKU数量" prop="quantity" min-width="130"></el-table-column>
        <el-table-column label="单位" prop="unit"></el-table-column>
        <el-table-column label="收货仓库" prop="repository" min-width="100"></el-table-column>
        <el-table-column label="签收日期" prop="signTime" min-width="120"></el-table-column>
      </el-table>
      <template #footer></template>
    </vab-dialog>
    <!-- 质检报告 -->
    <vab-dialog
      title="质检报告"
      v-model="qualityInspectionReportVisible"
      width="40%"
      @close="closeQualityInspection"
    >
      <el-form ref="qualityInspectionFormRef" :model="qualityInspectionForm" label-position="left" label-width="auto" style="margin-right: 30px; margin-left: 30px;">
        <el-form-item label="SKU" prop="sku" >
          <el-input v-model="qualityInspectionForm.sku" disabled style="margin-right: 0" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName" >
          <el-input v-model="qualityInspectionForm.productName" disabled style="margin-right: 0" />
        </el-form-item>
        <el-form-item label="包装尺寸(cm)" prop="packingSize" inline>
          <el-row style="display: flex;">
            <el-col style="flex: 1">
              <el-input v-model.trim="qualityInspectionForm.length" placeholder="长" clearable/>
            </el-col>
            <el-col style="flex: 0.1">
              &nbsp;×&nbsp;
            </el-col>
            <el-col style="flex: 1">
              <el-input v-model.trim="qualityInspectionForm.width" placeholder="宽" clearable/>
            </el-col>
            <el-col style="flex: 0.1">
              &nbsp;×&nbsp;
            </el-col>
            <el-col style="flex: 1">
              <el-input v-model.trim="qualityInspectionForm.height" placeholder="高" clearable/>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="包装重量(g)" prop="packingWeight">
          <el-input v-model.trim="qualityInspectionForm.packingWeight" clearable style="margin-right: 0"/>
        </el-form-item>
        <el-form-item>
          <el-table
            border stripe
            :data="fakeQualityData"
            :cell-style="qualityInspectionCellStyle"
            :header-cell-style="{ textAlign: 'center' }"
            max-height="300px"
            @cell-click="changeQualityInspectionInput"
            class="quality-inspection"
          >
            <el-table-column label="质检项目" prop="project" min-width="330"></el-table-column>
            <el-table-column label="检查类型" prop="type" min-width="100"></el-table-column>
            <el-table-column label="通过" prop="pass" min-width="50" >
              <template #default="{ row }">
                <el-checkbox v-model="row.pass" @change="" :true-value="1" :false-value="0"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" min-width="150">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.remark" @blur="clickQualityInspectionCancel($event, row)" />
                </div>
                <span>{{ row.remark }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="产品经理打包数量" prop="packingCount">
          <el-input v-model.trim="qualityInspectionForm.packingCount" clearable style="margin-right: 0" />
        </el-form-item>
        <el-form-item label="其他反馈" prop="other">
          <el-input type="textarea" placeholder="请输入其他反馈" v-model="qualityInspectionForm.other" :rows="2" resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="left-buttons">
          <el-button type="success">下载</el-button>
          <el-button type="warning">保存</el-button>
        </div>
        <div>
          <el-button type="danger" @click="closeQualityInspection">取消</el-button>
          <el-button type="success">提交</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 当前任务加人 - 人员选择 -->
    <vab-dialog
      title="人员选择"
      width="20%"
      v-model="currentTaskVisible"
      @close="handleCloseCurrentTask"
    >
      <el-table 
        ref="currentTaskTableRef"
        border stripe
        :data="fakePerson"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-class-name="personSelectCellClassName"
        class="person-select"
        @cell-click="changePartsListInput"
        @selection-change="setSelectTaskAddRows"
      >
        <el-table-column label="姓名" prop="name" align="center" min-width="100"></el-table-column>
        <el-table-column label="头像" prop="avatar" align="center" width="65">
          <template #default="{ row }">
            <el-image :src="row.avatar" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
              <template #error>
                <el-icon></el-icon>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column type="selection" align="center" width="80"></el-table-column>
      </el-table>
      <template #footer>
        <el-button type="danger" @click="handleCloseCurrentTask">取消</el-button>
        <el-button type="success" @click="handleConfirmCurrentTask">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 下班人员 - 人员选择 -->
    <vab-dialog
      title="人员选择"
      width="20%"
      v-model="getOffWorkVisible"
      @close="handleCloseGetOffWork"
    >
      <el-table 
      ref="getOffWorkTableRef"
        border stripe
        :data="fakePerson"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-class-name="personSelectCellClassName"
        class="person-select"
        @cell-click="changePartsListInput"
        @selection-change="setSelectGetOffRows"
      >
        <el-table-column label="姓名" prop="name" align="center" min-width="100"></el-table-column>
        <el-table-column label="头像" prop="avatar" align="center" width="65">
          <template #default="{ row }">
            <el-image :src="row.avatar" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
              <template #error>
                <el-icon></el-icon>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column type="selection" align="center" width="80"></el-table-column>
      </el-table>
      <template #footer>
        <el-button type="danger" @click="handleCloseGetOffWork">取消</el-button>
        <el-button type="success" @click="handleConfirmGetOffWork">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 开始任务 - 人员选择 -->
    <vab-dialog
      title="人员选择"
      width="20%"
      v-model="personSelectVisible"
      @close="handleCloseStartTask"
    >
      <el-table 
        ref="startTaskTableRef"
        border stripe
        :data="fakePerson"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-class-name="personSelectCellClassName"
        class="person-select"
        @cell-click="changePartsListInput"
        @selection-change="setSelectPersonRows"
      >
        <el-table-column label="姓名" prop="name" align="center" min-width="100"></el-table-column>
        <el-table-column label="头像" prop="avatar" align="center" width="65">
          <template #default="{ row }">
            <el-image :src="row.avatar" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
              <template #error>
                <el-icon></el-icon>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column type="selection" align="center" width="80"></el-table-column>
      </el-table>
      <template #footer>
        <el-button type="danger" @click="handleCloseStartTask">取消</el-button>
        <el-button type="success" @click="handleShowQualityProject">确定</el-button>
      </template>
    </vab-dialog>
     <!-- 结束任务 - 人员选择 -->
     <vab-dialog
      title="人员选择"
      width="20%"
      v-model="finishTaskVisible"
      @close="handleCloseFinishTask"
    >
      <el-table 
        ref="finishTaskTableRef"
        border stripe
        :data="fakePerson"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-class-name="personSelectCellClassName"
        class="person-select"
        @cell-click="changePartsListInput"
        @selection-change="setSelectFinishTaskRows"
      >
        <el-table-column label="姓名" prop="name" align="center" min-width="100"></el-table-column>
        <el-table-column label="头像" prop="avatar" align="center" width="65">
          <template #default="{ row }">
            <el-image :src="row.avatar" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
              <template #error>
                <el-icon></el-icon>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column type="selection" align="center" width="80"></el-table-column>
      </el-table>
      <template #footer>
        <el-button type="danger" @click="handleCloseFinishTask">取消</el-button>
        <el-button type="success" @click="handleConfirmFinishTask">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 开始任务 - 质检项目 -->
    <vab-dialog
      title="质检项目"
      width="40%"
      v-model="qualityProjectVisible"
    >
      <el-table
        border stripe
        :header-cell-style="{ textAlign: 'center' }"
        :data="fakeQualityProject"
        class="qualityProject"
      >
        <el-table-column label="检查类型" prop="type" min-width="100"></el-table-column>
        <el-table-column label="打包注意事项" prop="matters" min-width="300"></el-table-column>
        <el-table-column label="提醒" prop="remind" min-width="50" align="center">
          <template #default="{ row }">
            <el-checkbox v-model="row.remind" :true-value="1" :false-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="修改日期" prop="date" min-width="110" align="center"></el-table-column>
      </el-table>
    </vab-dialog>
    <!-- 修改 -->
    <vab-dialog
      title="修改"
      width="20%"
      v-model="modifyVisible"
      @close="closeModifyDialog"
    >
      <el-form ref="modifyFormRef" :model="modifyForm" :rules="modifyRules" label-position="right" label-width="auto" style="margin-left: 20px; margin-right: 20px;">
        <el-form-item label="站点" prop="site">
          <el-select v-model="modifyForm.site" placeholder="请选择站点" />
        </el-form-item>
        <el-form-item label="任务数" prop="taskCount">
          <el-input v-model="modifyForm.taskCount" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="closeModifyDialog">取消</el-button>
        <el-button type="success">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 点击清点质检 - 打包总数 -->
    <vab-dialog
      title="打包总数"
      width="25%"
      v-model="packingCountVisible"
      class="packingTotal"
    >
      <el-form ref="packingCountFormRef" :model="packingCountForm" label-position="left" label-width="auto" style="margin-left: 20px; margin-right: 0px">
        <el-form-item label="任务数量">
          <el-col :span="18">
            <el-input v-model="packingCountForm.taskCount" disabled  ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="好" prop="good">
          <div style="width: 75%; margin-right: 10px;">
            <el-input v-model.trim="packingCountForm.good" clearable/>
          </div>
          <div style="width: 10%; display: flex; align-items: center">
            <el-icon :size="23" class="add-icon" style="margin: 0 auto; cursor: pointer;" @click="handleShowAdd"><CirclePlus /></el-icon>
          </div>
        </el-form-item>
        <el-form-item label="留样" prop="sample">
          <el-col :span="18">
            <el-input v-model.trim="packingCountForm.sample" clearable/>
          </el-col>
        </el-form-item>
        <el-form-item label="坏" prop="bad">
          <el-col :span="18" style="margin-right: 10px;">
            <el-input v-model.trim="packingCountForm.bad" clearable/>
          </el-col>
          <el-button type="primary" @click="handleShowDetails">明细</el-button>
        </el-form-item>
        <el-form-item label="缺">
          <el-col :span="18">
            <el-input v-model="lackCount" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="多">
          <el-col :span="18">
            <el-input v-model="manyCount" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="打包总数">
          <el-col :span="18">
            <el-input v-model="packingTotal" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="18">
            <el-input type="textarea" v-model="packingCountForm.remark" :rows="2" style="margin-bottom: 18px" resize="none"/>
          </el-col>
          <el-col :span="18">
            <el-input type="textarea" :rows="4" disabled resize="none" />
          </el-col>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="packingCountVisible = false">取消</el-button>
        <el-button type="success">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 增加 -->
    <vab-dialog
      title="增加"
      v-model="addVisible"
      @close="handleCloseAdd"
      width="17%"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="auto" label-position="left" style="margin-left: 20px; margin-right: 20px">
        <el-form-item label="好" prop="good">
          <el-input v-model.trim="addForm.good" clearable />
        </el-form-item>
        <el-form-item label="留样" prop="sample">
          <el-input v-model.trim="addForm.sample" clearable />
        </el-form-item>
        <el-form-item label="坏" prop="bad">
          <el-input v-model.trim="addForm.bad" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseAdd">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
      </template>
    </vab-dialog>
    <vab-dialog
      title="明细"
      width="40%"
      v-model="detailsVisible"
    >
      <el-table
        stripe border
        :header-cell-style="{ textAlign: 'center' }"
        :data="fakeDetails"
        :cell-style="detailsCellStyle"
      >
        <el-table-column label="零件ID" min-width="100" prop="id"></el-table-column>
        <el-table-column label="零件名" min-width="200" prop="componentName"></el-table-column>
        <el-table-column label="订货总数" min-width="100" prop="total"></el-table-column>
        <el-table-column label="单位" min-width="70" prop="unit"></el-table-column>
        <el-table-column label="缺" min-width="100" prop="lack"></el-table-column>
        <el-table-column label="坏" min-width="100" prop="bad"></el-table-column>
      </el-table>
    </vab-dialog>
    <el-image-viewer @close="imagePreviewClose" :url-list="imagePreviewList" v-if ="imagePreviewVisible" hide-on-click-modal />
  </div>
</template>
  
<script lang="ts" setup>
import { ArrowDown, Search, CirclePlus } from '@element-plus/icons-vue'
import { type FormInstance, type TableInstance, type TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import { updatePoPurchaseMatters } from '/@/api/devlocal/purchasePo'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { IGetPlanPoList, IGetPlanPoListQuery } from '/@/type/purchase/po'
import { getDataAttribute, getRootElement, getSpecificChildren } from '/@/utils/nodeUtils'
import wangEditor from '/@/views/newProductDevelopment/newProductProgress/wangEditor.vue'

defineOptions({
  name: 'packingTaskTable',
})

const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)
// 打包选中的行
const selectRows = ref<any>([])
const setSelectRows = (value: string) => {
  selectRows.value = value
}
// 开始任务人员选择选中的行
const selectPersonRows = ref<any>([])
const setSelectPersonRows = (value: string) => {
  selectPersonRows.value = value
}
// 下班人员选中的行
const selectGetOffRows = ref<any>([])
const setSelectGetOffRows = (value: string) => {
  selectGetOffRows.value = value
}
// 任务加人选中的行
const selectTaskAddRows = ref<any>([])
const setSelectTaskAddRows = (value: string) => {
  selectTaskAddRows.value = value
}
// 结束任务选中的行
const selectFinishTaskRows = ref<any>([])
const setSelectFinishTaskRows = (value: string) => {
  selectFinishTaskRows.value = value
}
const activeName = ref<number>(0)
const tableRef = ref<TableInstance>()
const listLoading = ref<boolean>(true)
// 预览图片列表
const imagePreviewList = ref<string[]>([])
// 控制预览图片的隐藏显示
const imagePreviewVisible = ref<boolean>(false)
// 图片预览关闭事件
const imagePreviewClose = () =>{
  imagePreviewVisible.value = false;
}
const fakeData = [
  {
    po: 'PO19627',
    createTime: '2024-10-14',
    sku: 'HOM-0020-WHT碗架-木把手白色',
    siteName: '亚马逊美国US',
    taskCount: 100,
    count: 200,
    url: 'https://picsum.photos/200'
  },
  {
    po: 'PO19627',
    createTime: '2024-10-14',
    sku: 'HOM-0020-WHT碗架-木把手白色',
    siteName: '亚马逊美国US',
    taskCount: 100,
    count: 200,
    url: 'https://picsum.photos/200'
  },
  {
    po: 'PO19627',
    createTime: '2024-10-14',
    sku: 'HOM-0020-WHT碗架-木把手白色',
    siteName: '亚马逊美国US',
    taskCount: 100,
    count: 200,
    url: 'https://picsum.photos/200'
  }
]
const fakePartsList = [
  {
    componentName: '1',
    url: 'https://picsum.photos/200'
  },
  {
    componentName: '1',
    url: 'https://picsum.photos/200'
  },
  {
    componentName: '1',
    url: 'https://picsum.photos/200'
  },
  {
    componentName: '1',
    url: 'https://picsum.photos/200'
  },
  {
    componentName: '1',
    url: 'https://picsum.photos/200'
  },
  {
    componentName: '1',
    url: 'https://picsum.photos/200'
  },
]
const fakePerson = [
  {
    name: 'Lily',
    avatar: 'https://picsum.photos/200'
  },
  {
    name: 'John',
    avatar: 'https://picsum.photos/200'
  },
  {
    name: 'Mike',
    avatar: 'https://picsum.photos/200'
  },
  {
    name: 'Monica',
    avatar: 'https://picsum.photos/200'
  },
]
const fakeDetails = [
  {
    id: 1,
    componentName: '零件330',
    total: 99,
    unit: '个',
    lack: 3,
    bad: 6
  }
]
// 零件清单表格是否可见
const dialogPartsListTableVisible = ref<boolean>(false)
// 展示零件清单
const handleShowPartsList = () => {
  dialogPartsListTableVisible.value = true
}
// 零件清单cellStyle
const partsListCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  if (data.columnIndex !== 2) {
    return {
      textAlign: 'center'
    }
  }
}
// 零件清单去掉padding
const partsListCellClassName = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
// 零件清单放大预览
const changePartsListInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0]
  if (getDataAttribute(el, 'img') && el) {
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }
}
// 质检报告是否可见
const qualityInspectionReportVisible = ref<boolean>(false)
// 质检报告表单
const qualityInspectionForm = reactive<any>({

})
const fakeQualityData = [
  {
    project: '检查产品配件是否齐全，外观是否有破损和划痕。',
    type: '抽检10%',
    pass: 1,
    remark: '未通过'    
  },
  {
    project: '检查产品配件是否齐全，外观是否有破损和划痕。',
    type: '抽检10%',
    pass: 1,
    remark: '未通过'    
  },
  {
    project: '检查产品配件是否齐全，外观是否有破损和划痕。',
    type: '抽检10%',
    pass: 1,
    remark: '未通过'    
  },
  {
    project: '检查产品配件是否齐全，外观是否有破损和划痕。',
    type: '抽检10%',
    pass: 1,
    remark: '未通过'    
  },
  {
    project: '检查产品配件是否齐全，外观是否有破损和划痕。',
    type: '抽检10%',
    pass: 1,
    remark: '未通过'    
  },
  {
    project: '检查产品配件是否齐全，外观是否有破损和划痕。',
    type: '抽检10%',
    pass: 1,
    remark: '未通过'    
  },
]
const qualityInspectionFormRef = ref<FormInstance>()
// 展示质检报告
const handleShowQualityInspectionReport = () => {
  qualityInspectionReportVisible.value = true
}
// 关闭质检报告
const closeQualityInspection = () => {
  qualityInspectionFormRef.value?.resetFields()
  qualityInspectionReportVisible.value = false
}
// 质检报告cellStyle
const qualityInspectionCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number}) => {
  if (data.columnIndex === 2) {
    return {
      textAlign: 'center' as 'center'
    }
  }
}
// 质检报告修改
const changeQualityInspectionInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 

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
    inputElement.select()
  }
}
// 质检报告修改输入失焦事件
const clickQualityInspectionCancel = async (event: any, value: any) => {

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
// 开始任务人员选择展示与否
const personSelectVisible = ref<boolean>(false)
const startTaskTableRef = ref<TableInstance>()
// 下班人员标识
const getOffWorkVisible = ref<boolean>(false)
const getOffWorkTableRef = ref<TableInstance>()
// 结束任务标识
const finishTaskVisible = ref<boolean>(false)
const finishTaskTableRef = ref<TableInstance>()
// 当前任务标识
const currentTaskVisible = ref<boolean>(false)
const currentTaskTableRef = ref<TableInstance>()
// 当前任务加人显示
const handleShowCurrentTask = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }
  selectPersonRows.value = []
  currentTaskVisible.value = true
}
// 下班人员显示
const handleShowGetOffWork = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }
  getOffWorkVisible.value = true
}
// 点击开始任务
const handleShowStartTask = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }
  personSelectVisible.value = true
}
// 结束任务显示
const handleShowFinishTask = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }
  finishTaskVisible.value = true
}
// 质检项目展示与否
const qualityProjectVisible = ref<boolean>(false)
// 质检项目数据
const fakeQualityProject = [
  {
    type: '全检',
    matters: '检查产品配件是否齐全，外观是否有破损和划痕。',
    remind: 1,
    date: '2024-10-22'
  }
]
// 人员选择的padding
const personSelectCellClassName = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
// 当前任务加人的取消
const handleCloseCurrentTask = () => {
  currentTaskTableRef.value?.clearSelection()
  currentTaskVisible.value = false
}
// 当前任务加人的确定
const handleConfirmCurrentTask = () => {
  if (selectTaskAddRows.value.length === 0) {
    $baseMessage('您未选中任何人员', 'warning')
    return
  }
  handleCloseCurrentTask()
}
// 下班人员的取消
const handleCloseGetOffWork = async () => {
  getOffWorkTableRef.value?.clearSelection()
  getOffWorkVisible.value = false
}
// 下班人员的确定
const handleConfirmGetOffWork = () => {  
  if (selectGetOffRows.value.length === 0) {
    $baseMessage('您未选中任何人员', 'warning')
    return
  }
  handleCloseGetOffWork()
}
// 结束任务的取消
const handleCloseFinishTask = () => {
  finishTaskTableRef.value?.clearSelection()
  finishTaskVisible.value = false
}
// 结束任务的确定
const handleConfirmFinishTask = () => {
  if (selectFinishTaskRows.value.length === 0) {
    $baseMessage('您未选中任何人员', 'warning')
    return
  }
  handleCloseFinishTask()
}
// 开始任务的取消
const handleCloseStartTask = () => {
  startTaskTableRef.value?.clearSelection()
  personSelectVisible.value = false
}
// 点击开始任务-人员选择后的质检项目
const handleShowQualityProject = () => {
  if (selectPersonRows.value.length === 0) {
    $baseMessage('您未选中任何人员', 'warning')
    return
  }
  personSelectVisible.value = false
  qualityProjectVisible.value = true
}
// 修改显示与否
const modifyVisible = ref<boolean>(false)
// 展示修改
const handleShowModify = () => {
  modifyVisible.value = true
}
// 修改的表单
const modifyForm = reactive<any>({
  site: '',
  taskCount: ''
})
// 修改的rule
const modifyRules = reactive<any>({
  site: [{ required: true, message: '请选择站点', trigger: 'change' }],
  taskCount: [{ required: true, message: '请输入任务数', trigger: 'blur' }]
})
const modifyFormRef = ref<FormInstance>()
// 关闭修改弹窗
const closeModifyDialog = () => {
  modifyFormRef.value?.resetFields()
  modifyVisible.value = false
}
// 打包总数是否可见
const packingCountVisible = ref<boolean>(false)
// 增加是否可见
const addVisible = ref<boolean>(false)
interface IAddForm {
  good: number | null
  sample: number | null
  bad: number | null
}
// 增加form
const addForm = reactive<IAddForm>({
  good: null,
  sample: null,
  bad: null
})
// 增加form-ref
const addFormRef = ref<FormInstance>()
// 明细是否可见
const detailsVisible = ref<boolean>(false)
// 点击增加按钮
const handleShowAdd = () => {
  addVisible.value = true
}
// 点击明细
const handleShowDetails = () => {
  detailsVisible.value = true
}
// 关闭增加
const handleCloseAdd = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
// 增加确认
const handleConfirmAdd = () => {
  let good = Number(addForm.good)
  let sample = Number(addForm.sample)
  let bad = Number(addForm.bad)
  let pGood = Number(packingCountForm.good)
  packingCountForm.good = pGood + good
  let pSample = Number(packingCountForm.sample)
  packingCountForm.sample = pSample + sample
  let pBad = Number(packingCountForm.bad)
  packingCountForm.bad = pBad + bad
  handleCloseAdd()
}
interface IPackingCountForm {
  taskCount: number
  good: number | null
  sample: number | null
  bad: number | null
  remark: string
}
// 打包总数form
const packingCountForm = reactive<IPackingCountForm>({
  taskCount: 10,
  good: null,
  sample: null,
  bad: null,
  remark: ''
})
// 打包总数formRef
const packingCountFormRef = ref<FormInstance>()
// 展示打包总数
const handleShowPackingCount = (value: any) => {
  // 点击了清单质检
  if (value === 1) {
    packingCountVisible.value = true
  }
}
// 缺的数量
const lackCount: ComputedRef<number> = computed(() => {
  let good = Number(packingCountForm.good)
  let bad = Number(packingCountForm.bad)
  let taskCount = Number(packingCountForm.taskCount)
  return taskCount - good - bad
})
// 多的数量
const manyCount = computed(() => {
  let good = Number(packingCountForm.good)
  let taskCount = Number(packingCountForm.taskCount)
  if (good > taskCount) {
    return good - taskCount
  }
})
// 打包总数数量
const packingTotal: ComputedRef<number> = computed(() => {  
  let good = Number(packingCountForm.good)
  let bad = Number(packingCountForm.bad)
  return good + bad
})
// 采购计划列表
let plannedPoList = ref<IGetPlanPoList[]>([])
// 总记录数
const total = ref<number>(0)
const queryForm = reactive<IGetPlanPoListQuery>({
  pageNo: 1,
  pageSize: 20,
  keyWord: '',
  status: 0, //po状态 0待发布 1未达起订量
})
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}





  
// 弹出框的标题
const wangEditorTitle = ref<string>('')
// 点击日志弹出富文本框是否显示
const wangEditorLogVisible = ref<boolean>(false)
const progressLogCopy = ref<string | undefined>('')
const classify = ref<string>('')



  
const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  plannedPoList.value = []
  if (tab.props.name !== undefined) {
    // activeName.value = tab.props.name;
    queryForm.status = Number(tab.props.name);  
  }
  // fetchData()
}
// 表头样式
const headerCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 8) {
    return { color: '#4E88F3', textAlign: 'center' as 'center' };
  }
  if (data.columnIndex === 9) {
    return { color: '#13CE66', textAlign: 'center' as 'center' };
  }
  return { textAlign: 'center' as 'center' };
};
// 打包表格样式 
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): any => {
  if (data.columnIndex === 8) {
    return {
      color: '#4E88F3',
      textAlign: 'center'
    }
  }
  if (data.columnIndex === 9) {
    return {
      color: '#13CE66',
      textAlign: 'center'
    }
  }
  if (data.columnIndex !== 6 && data.columnIndex !== 13) {
    return {
      textAlign:'center'
    } 
  }
}
// 明细表格样式
const detailsCellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex !== 1) {
    return {
      textAlign: 'center' as 'center'
    }
  }
}
// 图片取消padding
const cellClassName = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (data.columnIndex === 5) {
    return 'clear-padding'
  }
  return ''
}

/**
 * 当点击时切换输入框，修改输入
 */
const clickRow = ref<any>() // 当点击零件采购注意事项时候的行
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => { 

  // 处理图片放大预览
  let el = getSpecificChildren(cell, "img")[0];
  if (getDataAttribute(el, 'img') && getSpecificChildren(cell, "img")[0]) {
    imagePreviewVisible.value = true
    imagePreviewList.value = []
    imagePreviewList.value.push(el.src!)
  }

  if (!cell.children[0].children[0]
      || !cell.children[0].children[1]
      || !cell.children[0].children[0].classList
      || !cell.children[0].children[1].classList) {
    return
  }

  if (column.property == 'purchaseMatters') {
    clickRow.value = row
    // const { data } = await getPoPurchaseMatters({ id: row.componentId })
    // progressLogCopy.value = data
    // row.purchaseMatters = data
    wangEditorTitle.value = '编辑打包注意事项'
    classify.value = 'purchaseMatters'
    wangEditorLogVisible.value = !wangEditorLogVisible.value
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

/**
 * 输入失焦事件
 */
const clickCancel = async (event: any, value: any) =>{

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
  const { data } = await updatePoPurchaseMatters({ id: clickRow.value.componentId, purchaseMatters: val})
  if (data === true) {
    progressLogCopy.value = val
    clickRow.value.purchaseMatters = val
  }
  
}
/**
 * 当点击取消，确认时，子组件传递给父组件 false
 */
const clickLogBool = ( val: any) => {
  wangEditorLogVisible.value = val
}
// 去掉 HTML 标签并显示纯文本的方法
const removeHtmlTags = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};
// const fetchData = async () => {
//   try {
//     listLoading.value = true
//     const { data } = await getPlanPoList(queryForm)
//     if (data) {
//       listLoading.value = false
//       total.value = data.total
//       plannedPoList.value = data.list
//     }
//   } catch (error) {
//     console.error(error)
//   }
// }  
onActivated(() => { 
  tableRef.value?.doLayout()
})
onBeforeMount(() => {
  // fetchData()
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
        .el-checkbox {
          transform: scale(1.2); // 放大 20%
          transform-origin: center; // 确保放大从中心开始
        }
        .none {
          display: none;
        }
        .button-margin {
          margin-bottom: 10px;
        }
      }
    }
  }
}
.quality-inspection :deep(.el-checkbox) {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
.person-select :deep(.el-checkbox) {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
.qualityProject :deep(.el-checkbox) {
  transform: scale(1.2); // 放大 20%
  transform-origin: center; // 确保放大从中心开始
}
// // 设置行高
// :deep(.el-table .el-table__body .cell) {
//   min-height: 60px;
// }
.el-table :deep(.clear-padding .cell) {
  padding-left: 0px;
  padding-right: 0px;
}
.el-table :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.none {
  display: none;
}
.left-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}

.el-input {
  flex: 1; /* 输入框占满可用空间 */
  margin-right: 10px; /* 输入框和按钮之间的间距 */
}
.packingTotal {
  .el-dialog :deep(.el-dialog__body) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.add-icon:hover {
  color: var(--el-color-primary); 
}
</style>