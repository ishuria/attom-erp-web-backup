<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="18">
        <el-button type="primary" @click="showBoxNumber">开始装箱</el-button>
        <el-button type="primary" @click="showShippingAmazon">发货(亚马逊)</el-button>
        <el-button type="primary" @click="shippingPlanningVisible = true">发货规划</el-button>
        <el-button type="primary">解锁</el-button>
        <el-button type="primary" @click="showModifyShippingPlan">修改发货计划</el-button>
        <el-button type="primary">上传pdf插页</el-button>
        <el-button type="primary">上传拆分</el-button>
        <el-button type="primary" @click="showShippingWalmart">发货(沃尔玛)</el-button>
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
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-text class="text-center">
          {{ `总箱数：${totalBoxNumber}，总重：${totalWeight}(kg)，总体积：${totalVolume}(m3)` }}
        </el-text>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table
      border stripe
      class="noneHoveTable"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="fakeData"
      @selection-change="setSelectRows"
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

    <VabModifyDialog 
      :modify-visible="modifyVisible"
      @update:modify-visible="closeModify"
    />

    <!-- 箱号 -->
    <vab-dialog
      title="箱号"
      width="20%"
      v-model="boxNumberVisible"
      class="dialog"
      @close="closeBoxNumber"
    >
      <el-form ref="boxNumberFormRef" :model="boxNumberForm" :rules="boxNumberFormRules" label-position="right" label-width="auto" style="margin-left: 10px; margin-right: 10px">
        <el-form-item label="箱号" prop="boxNumber">
          <el-input disabled />
        </el-form-item>
        <!-- <el-form-item label="发货计划">
          <el-date-picker type="date" placeholder="选择发货计划日期"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="站点" prop="site">
          <el-select v-model="boxNumberForm.site" placeholder="请选择站点" >
            <el-option 
              v-for="item in siteList"
              :label="item.label"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
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
      :upcOrFnSku="upcOrFnSku"
      @update:packing-visible="handlePackingClose"
    />
    <!-- 发货（沃尔玛）-->
    <vab-dialog
      title="发货（沃尔玛）"
      width="20%"
      v-model="shippingWalmartVisible"
      class="dialog"
    >
      <el-text >
        总箱数：，总重：(kg)，总体积：(m3)
      </el-text>
      <el-button type="primary" style="margin-top: 20px">生成模板文件</el-button>
    </vab-dialog>
    <!-- 发货（亚马逊）-->
    <vab-dialog
      title="发货（亚马逊）"
      width="20%"
      v-model="shippingAmazonVisible"
      class="dialog"
    >
      <el-space direction="vertical">
        <el-text>
          总箱数：，总重：(kg)，总体积：(m3)
        </el-text>
        <el-text>
          选中的所有箱子的货值为：
        </el-text>
      </el-space>
      <el-select></el-select>
      <el-space>
        <el-button >生成模板文件</el-button>
        <el-button>下载模板文件</el-button>
      </el-space>
      <el-upload></el-upload>
      <el-space>
        <el-button >下载装箱文件</el-button>
        <el-button>下载装箱表格</el-button>
      </el-space>
      <el-form label-position="top">
        <el-form-item label="合同号">
          <el-input />
        </el-form-item>
        <el-form-item label="SHIPMENT ID">
          <el-input />
        </el-form-item>
        <el-form-item label="站点">
          <el-select v-model="boxNumberForm.site" placeholder="请选择站点" >
            <el-option 
              v-for="item in siteList"
              :label="item.label"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货代渠道">
          <el-input />
        </el-form-item>
      </el-form>
    </vab-dialog>
    <!-- 发货规划 -->
    <vab-dialog
      title="发货规划"
      v-model="shippingPlanningVisible"
      width="20%"
      @close="closeShippingPlanning"
    >
      <el-form ref="shippingPlanningFormRef" :model="shippingPlanningForm" style="margin-left: 10px; margin-right: 10px" class="noneHoveTable">
        <el-form-item label="发货计划" prop="date">
          <el-date-picker  type="date" placeholder="选择发货计划日期" clearable>
          </el-date-picker>
          
        </el-form-item>
        <el-form-item label="货代渠道">
          <el-input  clearable />
        </el-form-item>
        <el-form-item label="应急补货">
          <el-checkbox></el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeShippingPlanning">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 修改发货计划 -->
    <vab-dialog
      title="修改发货计划"
      v-model="modifyPlanVisible"
      width="20%"
      @close="closeShippingPlan"
    >
      <el-form ref="shippingPlanFormRef" :model="shippingPlanForm" :rules="shippingPlanFormRules" style="margin-left: 10px; margin-right: 10px">
        <el-form-item label="发货计划" prop="date">
          <el-date-picker 
            type="date" 
            placeholder="请选择日期" 
            v-model="shippingPlanForm.date"
            value-format="YYYY-MM-DD"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeShippingPlan">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { FormInstance } from 'element-plus'
import { CSSProperties } from 'vue'
import { printerOption } from '../constantOption'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { ISiteOption } from '/@/type/packagingShipping/shippedType'

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

// 箱号表单
const boxNumberForm = reactive<any>({
  site: undefined
})
const boxNumberFormRef = ref<FormInstance>()
const boxNumberFormRules = reactive<any>({
  site: [{ required: true, message: '请选择站点', trigger: 'change' }]
})
// 装箱表单
const packingForm = reactive<any>({})
// 站点列表
const siteList = ref<ISiteOption[]>([])
// 传递给装箱的判断是UPC还是FNSKU
const upcOrFnSku = ref<string>('FNSKU')
// 多选的行
const selectRows = ref<any>([])
// 总箱数
const totalBoxNumber = computed(() => {
  return 0
})
// 总重
const totalWeight = computed(() => {
  return 0
})
// 总体积
const totalVolume = computed(() => {
  return 0
})
// 发货（沃尔玛）可见
const shippingWalmartVisible = ref<boolean>(false)
// 发货（亚马逊）可见
const shippingAmazonVisible = ref<boolean>(false)
// 修改发货计划可见
const modifyPlanVisible = ref<boolean>(false)
// 发货计划表单
const shippingPlanForm = reactive<any>({})
const shippingPlanFormRules = reactive<any>({
  date: [{ required: true, message: '请选择发货计划日期', trigger: 'change' }]
})
const shippingPlanFormRef = ref<FormInstance>()
// 发货规划可见
const shippingPlanningVisible = ref<boolean>(false)
// 发货规划表单
const shippingPlanningForm = reactive<any>({})
const shippingPlanningFormRef = ref<FormInstance>()
const shippingPlanningFormRules = reactive<any>({

})

// 关闭发货计划
const closeShippingPlan = () => {
  shippingPlanFormRef.value?.resetFields()
  modifyPlanVisible.value = false
}
// 关闭发货规划
const closeShippingPlanning = () => {
  shippingPlanningFormRef.value?.resetFields()
  shippingPlanningVisible.value = false
}
// 展示修改
const showModify = () => {
  modifyVisible.value = true
}
// 关闭修改
const closeModify = (value: boolean) => {
  modifyVisible.value = value
}

// 展示箱号
const showBoxNumber = () => {
  boxNumberVisible.value = true
}
// 关闭箱号
const closeBoxNumber = () => {
  boxNumberFormRef.value?.resetFields()
  boxNumberVisible.value = false
}
// 箱号的下一步，展示装箱
const showPacking = () => {
  boxNumberFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      if (boxNumberForm.site === 4) {
        upcOrFnSku.value = 'UPC'
      } else {
        upcOrFnSku.value = 'FNSKU'
      }      
      boxNumberVisible.value = false
      packingVisible.value = true
    }
  })
}
// 装箱的关闭
const handlePackingClose = (value: boolean) => {
  packingVisible.value = value
}
const setSelectRows = (value: any) => {
  selectRows.value = value
  // 计算总箱数

}
// 展示发货亚马逊
const showShippingAmazon = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  // 判断箱数是否大于500
  shippingAmazonVisible.value = true
}
// 展示发货沃尔玛
const showShippingWalmart = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  // 判断箱数是否大于500
  shippingWalmartVisible.value = true
}
// 展示修改发货计划
const showModifyShippingPlan = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  modifyPlanVisible.value = true
}
// 展示清点质检
const handleShowPackingCount = (row: any) => {
  if (row.qualityCheckStatus === 1) {
    
  }
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
    boxNumber: 10,
    po: 'PO123'
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
// 获取站点信息
const fetchSiteData = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
}
onBeforeMount(() => {
  fetchSiteData()
})
</script>

<style lang="scss" scoped>
.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.2);
  transform-origin: center;
}
:deep(.dialog .el-dialog__body) {
  padding-top: 5px;
}
.text-center {
  margin: 0 10px calc(var(--el-margin) / 2) 0;
}
</style>