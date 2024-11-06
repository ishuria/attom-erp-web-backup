<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="18">
        <el-button type="primary" @click="showBoxNumber">开始装箱</el-button>
        <el-button type="primary">发货(亚马逊)</el-button>
        <el-button type="primary">发货规划</el-button>
        <el-button type="primary">解锁</el-button>
        <el-button type="primary">修改发货计划</el-button>
        <el-button type="primary">上传pdf插页</el-button>
        <el-button type="primary">上传拆分</el-button>
        <el-button type="primary">发货(沃尔玛)</el-button>
        <el-select placeholder="请选择打印机" v-model="queryForm.printer" clearable style="margin: 0 10px calc(var(--el-margin) / 2) 0">
          <el-option 
            v-for="item in printerOption"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          />
        </el-select>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="6">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="listLoading" :icon="Search" type="primary" native-type="submit" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border stripe
      class="noneHoveTable"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="fakeData"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货计划" prop="" min-width="100"></el-table-column>
      <el-table-column label="装箱日期" prop="" min-width="115"></el-table-column>
      <el-table-column label="毛重(kg)" prop="" min-width="100"></el-table-column>
      <el-table-column label="长(cm)" prop="" min-width="90"></el-table-column>
      <el-table-column label="宽(cm)" prop="" min-width="90"></el-table-column>
      <el-table-column label="高(cm)" prop="" min-width="90"></el-table-column>
      <el-table-column label="总重量(kg)" prop="" min-width="110"></el-table-column>
      <el-table-column label="总体积(m3)" prop="" min-width="110"></el-table-column>
      <el-table-column label="箱规号" prop="" min-width="100"></el-table-column>
      <el-table-column label="站点" prop="" min-width="100"></el-table-column>
      <el-table-column label="SKU" prop="sku" min-width="300"></el-table-column>
      <el-table-column label="Description" prop="" min-width="300"></el-table-column>
      <!-- <el-table-column label="减少" prop="" min-width="90"></el-table-column> -->
      <el-table-column label="箱数" prop="" min-width="150">
        <template #default="{ row }">
          <el-input-number v-model="row.boxNumber" style="width: 100%"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="新增" prop="" min-width="90"></el-table-column> -->
      <el-table-column label="数量" prop="" min-width="90"></el-table-column>
      <el-table-column label="产品总数" prop="" min-width="100"></el-table-column>
      <el-table-column label="备注" prop="" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="showModify">修改</el-link>
          <el-link type="primary" :underline="false">拆分</el-link>
          <el-link type="danger" :underline="false">删除</el-link>
          <el-link type="primary" :underline="false">打印</el-link>
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
    <!-- 修改 -->
    <vab-dialog
      title="修改"
      width="35%"
      v-model="modifyVisible"
      top="7vh"
    >
      <el-form label-position="right" label-width="auto" style="margin-left: 3px; margin-right: 3px">
        <el-form-item label="数量(箱)" prop="" >
          <el-input clearable />
        </el-form-item>
        <el-form-item label="毛重(kg)" prop="" >
          <el-input clearable />
        </el-form-item>
        <el-form-item label="长(cm)" prop="" >
          <el-input clearable />
        </el-form-item>
        <el-form-item label="宽(cm)" prop="" >
          <el-input clearable />
        </el-form-item>
        <el-form-item label="高(cm)" prop="" >
          <el-input clearable />
        </el-form-item>
        <el-form-item label="站点" prop="" >
          <el-select>

          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addNewVisible = true" style="margin-top: 10px; margin-bottom: 10px">新增</el-button>
      <el-table border stripe :header-cell-style="{ textAlign: 'center' }" :data="fakeData" max-height="35vh">
        <el-table-column label="SKU" prop="sku" min-width="220"></el-table-column>
        <el-table-column label="FNSKU" prop="" min-width="100"></el-table-column>
        <el-table-column label="说明" prop="" min-width="100"></el-table-column>
        <el-table-column label="数量" prop="" min-width="70" align="center"></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-link type="danger" :underline="false">删除</el-link>
            <el-link type="primary" :underline="false" @click="showInspection">清点质检</el-link>
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
      <template #footer>
        <el-button @click="closeModify">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 清点质检 -->
    <vab-dialog
      title="清点质检"
      width="40%"
      v-model="inspectionVisible"
    >
      <el-table border stripe :header-cell-style="{ textAlign: 'center' }" >
        <el-table-column label="PO" prop="" min-width="100"></el-table-column>
        <el-table-column label="产品图片" prop="" width="70"></el-table-column>
        <el-table-column label="到货状态" prop="" min-width="100"></el-table-column>
        <el-table-column label="任务数" prop="" min-width="90"></el-table-column>
        <el-table-column label="站点" prop="" min-width="100"></el-table-column>
        <el-table-column label="已装箱数" prop="" min-width="100"></el-table-column>
        <el-table-column label="清点质检" prop="" min-width="100">
          <template #default="{ row }">
            <el-switch />
          </template>
        </el-table-column>
        <el-table-column label="实际完成数" prop="" min-width="110"></el-table-column>
      </el-table>
    </vab-dialog>
    <!-- 箱号 -->
    <vab-dialog
      title="箱号"
      width="20%"
      v-model="boxNumberVisible"
      class="dialog"
    >
      <el-form label-position="right" label-width="auto" style="margin-left: 10px; margin-right: 10px">
        <el-form-item label="箱号">
          <el-input disabled />
        </el-form-item>
        <el-form-item label="发货计划">
          <el-date-picker type="date" placeholder="选择发货计划日期">
          </el-date-picker>
          
        </el-form-item>
        <el-form-item label="站点">
          <el-select placeholder="请选择站点" ></el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: space-between">
          <div>
            <el-button type="primary">回插</el-button>
            <el-button>递增</el-button>
          </div>
          <div>
            <el-button type="primary" @click="showPacking">下一步</el-button>
          </div>
        </div>
      </template>
    </vab-dialog>
    <!-- 装箱 -->
    <VabPackingDialog 
      :packing-visible="packingVisible"
      @update:packing-visible="handlePackingClose"
    />
    <!-- 新增 -->
    <vab-dialog
      title="新增"
      width="660px"
      v-model="addNewVisible"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form label-position="top" :model="packingForm">
            <el-form-item label="FNSKU"><el-input disabled /></el-form-item>
            <el-form-item label="SKU"><el-input disabled /></el-form-item>
            <el-form-item label="产品名称"><el-input disabled /></el-form-item>
            <el-form-item label="数量"><el-input v-model="packingForm.count" clearable /></el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-image src="https://picsum.photos/200/200" style="width: 300px; height: 300px">
            <template #error>
              <el-icon></el-icon>
            </template>
          </el-image>
        </el-col>
      </el-row>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { printerOption } from '../constantOption'

const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
// 修改可见
const modifyVisible = ref<boolean>(false)
// 清点质检可见
const inspectionVisible = ref<boolean>(false)
// 箱号可见
const boxNumberVisible = ref<boolean>(false)
// 装箱可见
const packingVisible = ref<boolean>(false)
// 新增可见
const addNewVisible = ref<boolean>(false)
// 装箱表单
const packingForm = reactive<any>({})

// 展示修改
const showModify = () => {
  modifyVisible.value = true
}
// 关闭修改
const closeModify = () => {
  modifyVisible.value = false
}
// 展示清点质检
const showInspection = () => {
  inspectionVisible.value = true
}
// 展示箱号
const showBoxNumber = () => {
  boxNumberVisible.value = true
}
// 箱号的下一步，展示装箱
const showPacking = () => {
  boxNumberVisible.value = false
  packingVisible.value = true
}
const handlePackingClose = (value: boolean) => {
  packingVisible.value = false
}

const queryData = () => {
  queryForm.pageNo = 1
  // fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  // fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  // fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex !== 11 && data.columnIndex !== 12) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
const fakeData = [
  {
    sku: 'NiHealth-0045-6ColAdultKF',
    boxNumber: 10
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
  {
    sku: 'NiHealth-0045-6ColAdultKF'
  },
]

</script>

<style lang="scss" scoped>
.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.2);
  transform-origin: center;
}
:deep(.dialog .el-dialog__body) {
  padding-top: 5px;
}
</style>