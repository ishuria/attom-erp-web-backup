<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="">
      <el-tab-pane label="未匹配" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="atmExportVisible = true">催票文件导出</el-button>
            <el-button type="primary" @click="importVisible = true">发票导入</el-button>
            <el-button type="success" @click="matchVisible = true">发票匹配</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel >
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
          v-loading="listLoading"
          border
          class="noneHoverTable"
          :data="list"
          :header-cell-style="{ textAlign: 'center' }"
       
        >
          <el-table-column fixed="left" type="selection" />
          <el-table-column label="PO" prop="po" min-width="100" />
          <el-table-column label="采购日期" prop="po" min-width="115" />
          <el-table-column label="SKU图片" prop="po" width="75" >
            <template #header>
              SKU<br />图片
            </template>
          </el-table-column>
          <el-table-column label="SKU/品名" prop="po" min-width="120" />
          <el-table-column label="零件图片" prop="po" width="75" >
            <template #header>
              零件<br />图片
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="po" min-width="120" />
          <el-table-column label="PO零件总数" prop="po" min-width="100" >
            <template #header>
              PO零件<br />总数
            </template>
          </el-table-column>
          <el-table-column label="PO零件单位" prop="po" min-width="100" >
            <template #header>
              PO零件<br />单位
            </template>
          </el-table-column>
          <el-table-column label="PO总含税价" prop="po" min-width="110" />
          <el-table-column label="订单号" prop="po" min-width="" />
          <el-table-column label="供应商" prop="po" min-width="" />
          <el-table-column label="发货日期" prop="po" min-width="115" />
          <el-table-column label="合同编号" prop="po" min-width="" />
          <el-table-column label="报关品名" prop="po" min-width="" />
          <el-table-column label="报关数量" prop="po" min-width="100" />
          <el-table-column label="报关单位" prop="po" min-width="100" />
          <el-table-column label="该批次零件数量" prop="po" min-width="100" >
            <template #header>
              该批次<br />零件数量
            </template>
          </el-table-column>
          <el-table-column label="发票代码" prop="invoiceCode" min-width="" />
          <el-table-column label="发票号码" prop="invoiceNumber" min-width="" />
          <el-table-column label="开票数量" prop="invoiceDate" min-width="100" />
          <el-table-column label="发票单位" prop="invoiceAmount" min-width="100" />
          <el-table-column label="发票金额" prop="invoiceAmount" min-width="100" />
          <template #empty>
            <el-empty class="vab-data-empty" />
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
      <el-tab-pane label="已匹配" :name="1">

      </el-tab-pane>
    </el-tabs>
    <!-- 发票导入 -->
    <AiTuoMuInvoiceImport from="import" :invoice-matching-visible="importVisible" @update-invoice-matching-visible="updateImportVisible" />
    <!-- 发票匹配 -->
    <AiTuoMuInvoiceImport from="match" :invoice-matching-visible="matchVisible" @update-invoice-matching-visible="updateMatchVisible" />
    <!-- 催票文件导出 -->
    <vab-dialog title="催票文件导出" v-model="atmExportVisible" width="20%">
      <el-form label-position="top">
        <el-form-item label="发货日期">
          <el-date-picker 
            v-model="date"
            type="daterange" 
            :disabled-date="(time: Date) => time.getTime() > Date.now()"
            :clearable="false"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="atmExportVisible = false">取消</el-button>
        <el-button type="primary" :loading="exportLoading" @click="handleExportATM">导出</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getDefaultStringTime } from '/@/utils/dateUtils'
import { downloadFilePD } from '/@/api/devlocal/download'

defineOptions({
  name: 'AituomuFapiaoManagement'
})

const date = ref<[string, string]>(getDefaultStringTime())
const activeName = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const list = ref<any[]>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const importVisible = ref<boolean>(false)
const matchVisible = ref<boolean>(false)
const atmExportVisible = ref<boolean>(false)
const exportLoading = ref<boolean>(false)
// 埃托姆发票导出
const handleExportATM = async () => {
  exportLoading.value = true
  await downloadFilePD('/taxRefund/invoice/export', {
    fromDate: date.value[0],
    toDate: date.value[1],
  }).then(() => {
    exportLoading.value = false
  })
}
const updateMatchVisible = () => {
  matchVisible.value = false
}
const updateImportVisible = () => {
  importVisible.value = false
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleCurrentChange = (val: number) => {
  queryForm.pageNo = val
  fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchData()
}
const fetchData = async () => {
  //
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
            //自加
            margin-bottom: 5px;
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
              //自加
              margin: 0 !important;
            }
          }
        }
        .noneHoveTable .el-checkbox {
          transform: scale(1.3);
          transform-origin: center;
        }
        .el-table {
          flex: 1;

          // .el-table__body .cell {
          //   min-height: 32px;
          //   line-height: 34px;
          // }
          .invoice-number-row {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px 0;
            
            .button-group {
              display: flex;
              margin-left: 6px;

              .button-download {
                margin-left: 6px;
              }
              .button-delete {
                margin-left: 6px;
              }
            }
          }

          // .none {
          //   display: none;
          // }
        }
        // .create-time {
        //   color: #4e88f3;
        // }
        // .percentage {
        //   color: #24ada1;
        // }
        // .pay-price {
        //   color: #8d5fcc;
        // }
        // .percentage-red {
        //   color: var(--el-color-danger);
        // }
      }
    }
  }
  // .el-dialog .el-checkbox {
  //   transform: scale(1.3);
  //   transform-origin: center;
  // }
}
</style>
