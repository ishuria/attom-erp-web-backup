<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="18">
        <el-button type="primary" @click="showBoxNumber">开始装箱</el-button>
        <el-button type="primary" @click="showShippingAmazon">发货(亚马逊)</el-button>
        <el-button type="primary" @click="shippingPlanningVisible = true">发货规划</el-button>
        <el-button type="primary">解锁</el-button>
        <el-button type="primary" @click="showModifyShippingPlan">修改发货计划</el-button>
        <el-button type="primary" @click="uploadPdfVisible = true">上传pdf插页</el-button>
        <el-button type="primary" @click="uploadSplitVisible = true">上传拆分</el-button>
        <el-button type="primary" @click="showShippingWalmart">发货(沃尔玛)</el-button>
        <el-select placeholder="请选择打印机"  clearable style="margin: 0 10px calc(var(--el-margin) / 2) 0">
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
          {{ `总箱数：${totalBoxNumber}，总重：${totalWeight.toFixed(2)}(kg)，总体积：${totalVolume.toFixed(2)}(m3)` }}
        </el-text>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table
      border 
      class="noneHoveTable"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
      :data="list"
      @selection-change="setSelectRows"
      :span-method="objectSpanMethod"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="发货计划" prop="shipmentDate" min-width="100"></el-table-column>
      <el-table-column label="装箱日期" prop="createTime" min-width="115"></el-table-column>
      <el-table-column label="毛重(kg)" prop="grossWeight" min-width="100"></el-table-column>
      <el-table-column label="长(cm)" prop="length" min-width="90"></el-table-column>
      <el-table-column label="宽(cm)" prop="width" min-width="90"></el-table-column>
      <el-table-column label="高(cm)" prop="height" min-width="90"></el-table-column>
      <el-table-column label="总重量(kg)" prop="totalWeight" min-width="110"></el-table-column>
      <el-table-column label="总体积(m3)" prop="totalVolume" min-width="110"></el-table-column>
      <el-table-column label="箱规号" prop="encasementNo" min-width="110"></el-table-column>
      <el-table-column label="站点" prop="site" min-width="100"></el-table-column>
      <el-table-column label="SKU" prop="sku" min-width="300"></el-table-column>
      <el-table-column label="Description" prop="description" min-width="300"></el-table-column>
      <el-table-column label="箱数" prop="numberOfBoxes" min-width="150">
        <template #default="{ row }">
          <el-input-number v-model="row.numberOfBoxes" style="width: 100%"/>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="number" min-width="90"></el-table-column>
      <el-table-column label="产品总数" prop="productTotalNumber" min-width="100"></el-table-column>
      <el-table-column label="备注" prop="remarks" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="showModify">修改</el-link>
          <el-link type="primary" :underline="false" @click="showSplit(row)">拆分</el-link>
          <el-link type="danger" :underline="false">删除</el-link>
          <el-link type="primary" :underline="false" @click="showPrint(row)">打印</el-link>
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
      :width="dialogWidth"
      v-model="boxNumberVisible"
      class="dialog"
      @close="closeBoxNumber"
    >
      <el-form ref="boxNumberFormRef" :model="boxNumberForm" :rules="boxNumberFormRules" label-position="right" label-width="auto" style="margin-left: 10px; margin-right: 10px">
        <el-form-item label="箱号" prop="boxNumber">
          <el-input v-model="boxNumberForm.boxNumber" disabled />
        </el-form-item>
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
            <el-button type="primary" @click="reinsertBoxNumber">回插</el-button>
            <el-button @click="increaseBoxNumber">递增</el-button>
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
      :site="passSite"
      :encasement-no="encasementNo"
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
      width="25%"
      v-model="shippingAmazonVisible"
      class="dialog"
      top="6vh"
    >
      <el-form label-position="top">
        <el-form-item style="margin-bottom: 0px">
          <el-text>
            {{ `总箱数：，总重：(kg)，总体积：(m3)` }}
          </el-text>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px">
          <el-text>
            {{ `选中的所有箱子的货值为：` }}
          </el-text>
        </el-form-item>
        <el-form-item>
          <el-select>
            <el-option 
              v-for="item in unitOption"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px">
          <el-space >
            <el-button >生成模板文件</el-button>
            <el-button>下载模板文件</el-button>
          </el-space>
        </el-form-item>
     
        <el-upload
          class="upload-demo"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          width="100%"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖拽到此处或 <em>点击上传</em>
          </div>
        </el-upload>
  
        <el-form-item>
          <el-space>
            <el-button >下载装箱文件</el-button>
            <el-button>下载装箱表格</el-button>
          </el-space>
        </el-form-item>
      
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
    <!-- 上传拆分 -->
    <vab-dialog
      title="上传拆分"
      width="25%"
      v-model="uploadSplitVisible"
      top="10vh"
      @close="closeUploadSplit"
    >
      <el-form ref="uploadSplitFormRef" :model="uploadSplitForm" label-position="top" style="margin-left: 10px; margin-right: 10px">
        <el-form-item label="日期">
          <el-date-picker v-model="uploadSplitForm.date" type="date" value-format="YYYY-MM-DD" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="拆分备注">
          <el-input v-model="uploadSplitForm.remark" type="textarea" :rows="2" resize="none" />
        </el-form-item>
        <el-upload
          class="upload-demo"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          width="100%"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖拽到此处或 <em>点击上传</em>
          </div>
        </el-upload>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" >完成</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 上传 pdf 插页 -->
    <vab-dialog
      title="上传pdf插页"
      width="25%"
      v-model="uploadPdfVisible"
    >
      <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
        width="100%"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖拽到此处或 <em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" >完成</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 打印 -->
    <vab-dialog
      title="打印"
      width="20%"
      v-model="printVisible"
    >
      <el-form style="margin-left: 10px; margin-right: 10px;">
        <el-form-item label="打印数量">
          <el-input v-model="printCount" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary">打印</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 拆分 -->
    <vab-dialog
      title="拆分"
      width="20%"
      v-model="splitVisible"
    >
      <el-form style="margin-left: 10px; margin-right: 10px;">
        <el-form-item label="拆分数量">
          <el-input v-model="splitCount" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary">拆分</el-button>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search, UploadFilled } from '@element-plus/icons-vue'
import { FormInstance, FormRules } from 'element-plus'
import { CSSProperties } from 'vue'
import { printerOption, unitOption } from '../constantOption'
import { getEncasementList, getIncrementBoxNo, getReinsertionBoxNo } from '/@/api/devlocal/encasement'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { IBoxNumberForm, IEncasementList, IGetEncasementListReq, ISiteOption } from '/@/type/packagingShipping/shippedType'

const listLoading = ref<boolean>(false)
const list = ref<IEncasementList[]>([])
const total = ref<number>(0)
const queryForm = reactive<IGetEncasementListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
// 修改可见
const modifyVisible = ref<boolean>(false)
// 传递给装箱的site
const passSite = ref<number>()
// 传递给装箱的装箱号
const encasementNo = ref<number>(0)
// 箱号可见
const boxNumberVisible = ref<boolean>(false)
// 装箱可见
const packingVisible = ref<boolean>(false)
// 上传拆分可见
const uploadSplitVisible = ref<boolean>(false)
// 上传pdf可见
const uploadPdfVisible = ref<boolean>(false)
// 打印可见
const printVisible = ref<boolean>(false)
const printCount = ref<number | undefined>(undefined)
// 拆分可见
const splitVisible = ref<boolean>(false)
const splitCount = ref<number | undefined>(undefined)
// 箱号表单
const boxNumberForm = reactive<IBoxNumberForm>({
  boxNumber: undefined,
  site: undefined
})
const boxNumberFormRef = ref<FormInstance>()
const boxNumberFormRules = reactive<FormRules<IBoxNumberForm>>({
  site: [{ required: true, message: '请选择站点', trigger: 'change' }]
})

// 站点列表
const siteList = ref<ISiteOption[]>([])
// 传递给装箱的判断是UPC还是FNSKU
const upcOrFnSku = ref<string>('FNSKU')
// 多选的行
const selectRows = ref<any>([])
// 总箱数
const totalBoxNumber = computed<number>(() => {
  return selectRows.value.reduce((total: number, item: IEncasementList) => {
    return total + item.numberOfBoxes!;  // 累加每个 item.numberOfBoxes
  }, 0); // 初始值为 0
});
// 总重
const totalWeight = computed<number>(() => {
  return selectRows.value.reduce((total: number, item: IEncasementList) => {
    return total + item.totalWeight!;  
  }, 0); // 初始值为 0
})
// 总体积
const totalVolume = computed<number>(() => {
  return selectRows.value.reduce((total: number, item: IEncasementList) => {
    return total + item.totalVolume!;  
  }, 0); // 初始值为 0
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
// 上传拆分表单
const uploadSplitForm = reactive<any>({})
const uploadSplitFormRef = ref<FormInstance>()
// 关闭拆分
const closeUploadSplit = () => {
  uploadSplitFormRef.value?.resetFields()
  uploadSplitVisible.value = false
}
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
const showBoxNumber = async () => {
  const { data } = await getIncrementBoxNo()
  if (data) {
    boxNumberForm.boxNumber = data
    boxNumberVisible.value = true
  }
}
// 点击递增
const increaseBoxNumber = async () => {
  const { data } = await getIncrementBoxNo()
  if (data) {
    boxNumberForm.boxNumber = data
    $baseMessage('递增获取箱号成功', 'success')
  }
}
// 点击回插
const reinsertBoxNumber = async () => {
  const { data } = await getReinsertionBoxNo()
  if (data) {
    boxNumberForm.boxNumber = data
    $baseMessage('回插获取箱号成功', 'success')
  }
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
      boxNumberVisible.value = false
      packingVisible.value = true
      passSite.value = boxNumberForm.site
      encasementNo.value = boxNumberForm.boxNumber!
    }
  })
}
// 装箱的关闭
const handlePackingClose = (value: boolean) => {
  packingVisible.value = value
}
const setSelectRows = (value: IEncasementList[]) => {
  selectRows.value = value  
}
// 展示发货亚马逊
const showShippingAmazon = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  // 判断箱数是否大于500
  if (totalBoxNumber.value > 500) {
    $baseMessage('总箱数不能大于500，请重新勾选', 'error')
    return
  }
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
// 展示打印
const showPrint = (row: any) => {
  printCount.value = undefined
  printVisible.value = true
}
// 展示拆分
const showSplit= (row: any) => {
  splitCount.value = undefined
  splitVisible.value = true
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
  queryForm.pageSize = value
  fetchData()
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
// 装箱合并方法
const objectSpanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex !== 11 && columnIndex !== 12) {
    // 获取当前row的零件id
    const id = row.id;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
}
// 获取站点信息
const fetchSiteData = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
}
const dialogWidth = computed<string>(() => {
  // 获取屏幕宽度并根据不同设备返回宽度
  const screenWidth = window.innerWidth;
  if (screenWidth <= 768) {
        return '80%';  // 手机设备
  } else if (screenWidth <= 1024) {
    return '60%';  // 小型平板设备
  } else if (screenWidth <= 1200) {
    return '50%';  // 中型平板设备
  } else {
    return '20%';  // 大屏设备
  }
})
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getEncasementList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
onBeforeMount(() => {
  fetchSiteData()
  fetchData()
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