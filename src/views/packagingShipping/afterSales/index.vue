<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
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
          :data="fakeTableData"
          @cell-click="pendingInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="time"></el-table-column>
          <el-table-column label="订货日期" min-width="115"></el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.url" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="status" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.status" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200"></el-table-column>
          <el-table-column label="PO总数" prop="poTotal"></el-table-column>
          <el-table-column label="好" prop="good"></el-table-column>
          <el-table-column label="多"></el-table-column>
          <el-table-column label="留样"></el-table-column>
          <el-table-column label="缺"></el-table-column>
          <el-table-column label="坏"></el-table-column>
          <el-table-column label="待售后￥" min-width="100"></el-table-column>
          <el-table-column label="打包反馈备注" min-width="200"></el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <el-space>
                <el-button type="primary" text @click="showMove">移动到已联系</el-button>
                <el-button type="primary" text @click="showAfterSalesLog">售后日志</el-button>
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
          :cell-class-name="pendingCellClassName"
          :data="fakeTableData"
          @cell-click="pendingInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="time"></el-table-column>
          <el-table-column label="订货日期" min-width="115"></el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.url" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="status" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.status" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200"></el-table-column>
          <el-table-column label="PO总数" prop="poTotal"></el-table-column>
          <el-table-column label="好" prop="good"></el-table-column>
          <el-table-column label="多"></el-table-column>
          <el-table-column label="留样"></el-table-column>
          <el-table-column label="缺"></el-table-column>
          <el-table-column label="坏"></el-table-column>
          <el-table-column label="待售后￥" min-width="100"></el-table-column>
          <el-table-column label="已退款￥" min-width="100">
            <template #default="{ row }">
              <el-input />
            </template>
          </el-table-column>
          <el-table-column label="当前售后方式" min-width="150" prop="type">
            <template #default="{ row }">
              <el-select v-model="row.type" style="min-width: 100%">
                <el-option 
                  v-for="item in currentAfterSalesOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="凭证上传" min-width="100"></el-table-column>
          <el-table-column label="打包反馈备注" min-width="200"></el-table-column>
          <el-table-column label="售后日志" min-width="200"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-space>
                <el-button type="primary" text >采购申请</el-button>
                <el-button type="primary" text>归档</el-button>
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
          :cell-class-name="pendingCellClassName"
          :data="fakeTableData"
          @cell-click="pendingInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="time"></el-table-column>
          <el-table-column label="订货日期" min-width="115"></el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.url" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="status" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.status" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200"></el-table-column>
          <el-table-column label="PO总数" prop="poTotal"></el-table-column>
          <el-table-column label="好" prop="good"></el-table-column>
          <el-table-column label="多"></el-table-column>
          <el-table-column label="留样"></el-table-column>
          <el-table-column label="缺"></el-table-column>
          <el-table-column label="坏"></el-table-column>
          <el-table-column label="待售后￥" min-width="100"></el-table-column>
          <el-table-column label="已退款￥" min-width="100"></el-table-column>
          <el-table-column label="当前售后方式" min-width="150" prop="type">
            <template #default="{ row }">
              <el-select v-model="row.type" style="min-width: 100%" disabled>
                <el-option 
                  v-for="item in currentAfterSalesOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="凭证上传" min-width="100"></el-table-column>
          <el-table-column label="打包反馈备注" min-width="200"></el-table-column>
          <el-table-column label="售后日志" min-width="200"></el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" text>采购申请</el-button>
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
          :data="fakeTableData"
          @cell-click="pendingInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="time"></el-table-column>
          <el-table-column label="订货日期" min-width="115"></el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.url" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="status" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.status" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200"></el-table-column>
          <el-table-column label="PO总数" prop="poTotal"></el-table-column>
          <el-table-column label="好" prop="good"></el-table-column>
          <el-table-column label="多"></el-table-column>
          <el-table-column label="留样"></el-table-column>
          <el-table-column label="缺"></el-table-column>
          <el-table-column label="坏"></el-table-column>
          <el-table-column label="待售后￥" min-width="100"></el-table-column>
          <el-table-column label="打包反馈备注" min-width="200"></el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <el-space>
                <el-button type="primary" text @click="showMove">移动到已联系</el-button>
                <el-button type="primary" text @click="showAfterSalesLog">售后日志</el-button>
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
          :data="fakeTableData"
          @cell-click="pendingInputChange"
        >
          <el-table-column label="反馈日期" min-width="115" prop="time"></el-table-column>
          <el-table-column label="订货日期" min-width="115"></el-table-column>
          <el-table-column label="PO" min-width="115" prop="po"></el-table-column>
          <el-table-column label="产品图片" width="82">
            <template #header>
              产品<br>图片
            </template>
            <template #default="{ row }">
              <el-image :src="row.url" fit="contain" data-img="img" style="display: block; width: 100%; height: 100%">
                <template #error>
                  <el-icon></el-icon>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="SKU" min-width="200" prop="sku"></el-table-column>
          <el-table-column label="停产" prop="status" min-width="60">
            <template #default="{ row }">
              <el-checkbox v-model="row.status" :true-value="1" :false-value="0" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="200"></el-table-column>
          <el-table-column label="PO总数" prop="poTotal"></el-table-column>
          <el-table-column label="任务数"></el-table-column>
          <el-table-column label="好" prop="good"></el-table-column>
          <el-table-column label="多"></el-table-column>
          <el-table-column label="留样"></el-table-column>
          <el-table-column label="缺"></el-table-column>
          <el-table-column label="坏"></el-table-column>
          <el-table-column label="待售后￥(含税)" min-width="100">
            <template #header>
              待售后￥<br>(含税)
            </template>
          </el-table-column>
          <el-table-column label="已退款￥" min-width="100"></el-table-column>
          <el-table-column label="坏账金额￥" min-width="110"></el-table-column>
          <el-table-column label="打包反馈备注" min-width="200"></el-table-column>
          <el-table-column label="售后日志" min-width="260"></el-table-column>
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
      width="20%"
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
          <el-input v-model="contactedForm.remark" type="textarea" />
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
      width="60%"
      v-model="afterSalesLogVisible"
    >
      <el-table
        border stripe
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="afterSalesLogCellStyle"
        :data="fakePurchaseData"
      >
        <el-table-column label="反馈日期"></el-table-column>
        <el-table-column label="任务ID" prop="id" min-width="70"></el-table-column>
        <el-table-column label="任务数" ></el-table-column>
        <el-table-column label="好"></el-table-column>
        <el-table-column label="多" ></el-table-column>
        <el-table-column label="留样" ></el-table-column>
        <el-table-column label="缺" ></el-table-column>
        <el-table-column label="坏" ></el-table-column>
        <el-table-column label="待售后￥"></el-table-column>
        <el-table-column label="备注" min-width="150"></el-table-column>
      </el-table>
    </vab-dialog>
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
  </div>
</template>

<script lang="ts" setup>
import { Search, ArrowDown } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { useRoutesStore } from '/@/store/modules/routes'
import { useTabsStore } from '/@/store/modules/tabs'
import { getDataAttribute, getSpecificChildren } from '/@/utils/nodeUtils'
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
})
const fakeTableData = [
  {
    time: '2024-10-24',
    po: 'PO12345',
    sku: 'HOME-0020-WHT 碗架-木把手白色',
    url: 'https://picsum.photos/200',
    poTotal: 2,
    good: 3
  },
  {
    time: '2024-10-24',
    po: 'PO12345',
    sku: 'HOME-0020-WHT 碗架-木把手白色',
    url: 'https://picsum.photos/200',
    poTotal: 2,
    good: 1
  }
]
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
  { label: '无法售后', value: 3 },
  { label: '需要采购', value: 4 },
  { label: '待定', value: 5 },
]
// 当前售后方式选项
const currentAfterSalesOption = [
  { label: '退款', value: 0 },
  { label: '随大货补寄', value: 1 },
  { label: '单独补寄', value: 2 },
  { label: '采购', value: 3 },
]
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
// 售后日志展示
const showAfterSalesLog = () => {
  afterSalesLogVisible.value = true
}
// 采购申请可见
const purchaseRequisitionVisible = ref<boolean>(false)
// 展示采购申请
const showPurchaseRequisition = () => {
  purchaseRequisitionVisible.value = true
}
const handleClick = () => {
  queryData()
}

// const fetchData = async () => {
//   listLoading.value = true
//   const { data } = await getList(queryForm)
//   list.value = data.list
//   total.value = data.total
//   listLoading.value = false
// }

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

const statusFilter = (status: string | number) => {
  const statusMap: any = {
    published: 'success',
    draft: 'primary',
    deleted: 'danger',
  }
  return statusMap[status]
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
    if (data.row.good >= data.row.poTotal) {
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
    if (data.row.good >= data.row.poTotal) {
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
</style>
