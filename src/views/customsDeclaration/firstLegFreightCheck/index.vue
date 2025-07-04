<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="待核对" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="startCheckVisible = true">开始核对</el-button>
            <el-button type="primary">核对记录导出</el-button>
            <el-button type="success">核对完成</el-button>
            <el-button type="danger">取消核对</el-button>
            <el-button type="success">审批通过</el-button>
            <el-button type="primary" @click="showErrorAllowRange">误差允许范围</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="listLoading" :icon="Search" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <check-freight-table :tab="0" />
        <vab-pagination 
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="待付款" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary">已付款</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="listLoading" :icon="Search" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <check-freight-table :tab="1" />
        <vab-pagination 
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="已付款" :name="2">
        <vab-query-form>
          <vab-query-form-right-panel :span="24">
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="listLoading" :icon="Search" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <check-freight-table :tab="2" />
        <vab-pagination 
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 开始核对 -->
    <vab-dialog v-model="startCheckVisible" title="开始核对" width="25%">
      <el-upload
        class="upload-demo"
        drag
    
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖拽至此处或 <em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="success">上传</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 误差允许范围 -->
    <error-allow-range-dialog v-model="allowRangeVisible" />
  </div>
</template>

<script lang="ts" setup>
import { Search, UploadFilled } from '@element-plus/icons-vue'
import { TabsPaneContext } from 'element-plus'
defineOptions({
  name: 'FirstLegFreightCheck'
})

// 开始核对
const startCheckVisible = ref<boolean>(false)
// 误差允许范围
const allowRangeVisible = ref<boolean>(false)

const activeName = ref<number>(0)
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})

const showErrorAllowRange = () => {
  allowRangeVisible.value = true

}
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  // fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  // fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}

const handleTabClick = (tab: TabsPaneContext) => {
 
}
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
            margin-bottom: 5px;
          }

          .el-form {
            .el-form-item:first-child {
              margin-bottom: 5px !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }

            .el-form-item:last-child {
              margin-bottom: 5px !important;
            }
          }
        }
      }
    }
  }
}

</style>

