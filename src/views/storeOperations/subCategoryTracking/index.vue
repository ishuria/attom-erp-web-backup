<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="showAddDialog">添加</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
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
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      border
      :cell-class-name="clearPadding"
      :cell-style="cellStyle"
      class="noneHoverTable"
      :data="list"
      :header-cell-style="{ textAlign: 'center' }"
      stripe
    >
      <el-table-column label="添加日期" min-width="120" prop="createTime" >
        <template #default="{ row }">
          {{ row.createTime.split(' ')[0] }}
        </template>
      </el-table-column>
      <el-table-column label="站点" min-width="130" prop="siteName" />
      <el-table-column label="ASIN" min-width="110" prop="asin" />
      <el-table-column label="SKU" :min-width="flexColumnWidth(list, 'SKU', 'sku')" prop="sku" />
      <el-table-column label="运营" min-width="100" prop="operationUserName" />
      <el-table-column label="小类排名(添加时)" :min-width="flexColumnWidth(list, '小类排名(添加时)', 'initialSubcategoryCategory', 50)" prop="initialSubcategoryRank" >
        <template #default="{ row }">
          #{{ row.initialSubcategoryRank }} {{ row.initialSubcategoryCategory }}
        </template>
      </el-table-column>
      <el-table-column label="同类竞品小类最高排名" min-width="160" prop="competitorHighestRank" />
      <el-table-column label="目标小类排名" min-width="120" prop="targetSubcategoryRank" />
      <el-table-column label="30天父体销量(添加时)" min-width="160" prop="initialParentSales" />
      <el-table-column label="目标竞品" min-width="120" prop="targetCompetitor" />
      <el-table-column label="目标竞品父体月销量" min-width="160" prop="targetCompetitorParentSales" />
      <el-table-column label="目标父体月销量" min-width="120" prop="targetParentSales" />
      <el-table-column label="当前30天销量" min-width="120">
        <template #default="{ row }">
          <span :style="{ color: row.current30DaysSales != null && row.targetParentSales != null ? (row.current30DaysSales >= row.targetParentSales ? '#67C23A' : '#F56C6C') : '' }">
            {{ row.current30DaysSales }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="当前小类排名" min-width="120">
        <template #default="{ row }">
          <span :style="{ color: row.currentSubcategoryRank != null && row.targetSubcategoryRank != null ? (row.currentSubcategoryRank <= row.targetSubcategoryRank ? '#67C23A' : '#F56C6C') : '' }">
            {{ row.currentSubcategoryRank }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="已运营天数" min-width="100" prop="operationDays" />
    
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

    <!-- 添加/编辑对话框 -->
    <vab-dialog v-model="dialogVisible" :title="isEdit ? '编辑' : '添加'" width="600px">
      <el-form ref="formRef" label-width="180px" :model="formData" :rules="formRules">
        <el-form-item label="运营" prop="operationUserId">
          <el-select v-model="formData.operationUserId" clearable :disabled="isEdit || isOperationRole" filterable placeholder="请选择运营">
            <el-option
              v-for="item in operationUserList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="site">
          <el-select v-model="formData.site" clearable :disabled="isEdit" placeholder="请选择站点">
            <el-option
              v-for="item in siteList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="SKU" prop="sku">
          <el-select
            v-model="formData.sku"
            clearable
            :disabled="isEdit"
            filterable
            :loading="skuLoading"
            placeholder="请输入SKU搜索"
            remote
            :remote-method="remoteMethod"
            reserve-keyword
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="ASIN" prop="asin">
          <el-input v-model.trim="formData.asin" placeholder="根据SKU和站点自动获取" readonly />
        </el-form-item>
        <el-form-item label="当前后小类排名" prop="initialSubcategoryRank">
          <el-input v-model.number="formData.initialSubcategoryRank" placeholder="根据SKU和站点自动获取" readonly />
        </el-form-item>
        <el-form-item label="30天父体销量(添加时)" prop="initialParentSales">
          <el-input v-model.number="formData.initialParentSales" placeholder="根据SKU和站点自动获取" readonly />
        </el-form-item>
        <el-form-item label="同类竞品小类最高排名" prop="competitorHighestRank">
          <el-input v-model.number="formData.competitorHighestRank" placeholder="请输入同类竞品小类最高排名" type="number" />
        </el-form-item>
        <el-form-item label="目标小类排名" prop="targetSubcategoryRank">
          <el-input v-model.number="formData.targetSubcategoryRank" placeholder="请输入目标小类排名" type="number" />
        </el-form-item>
        <el-form-item label="目标竞品" prop="targetCompetitor">
          <el-input v-model.trim="formData.targetCompetitor" clearable placeholder="请输入目标竞品" />
        </el-form-item>
        <el-form-item label="目标竞品父体月销量" prop="targetCompetitorParentSales">
          <el-input v-model.number="formData.targetCompetitorParentSales" placeholder="请输入目标竞品父体月销量" type="number" />
        </el-form-item>
        <el-form-item label="目标父体月销量" prop="targetParentSales">
          <el-input v-model.number="formData.targetParentSales" placeholder="请输入目标父体月销量" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CSSProperties } from 'vue'
import { flexColumnWidth } from '~/src/utils/tableColum'
import { getFrontPageProductManagerSelectOption } from '/@/api/devlocal/frontPage'
import { getDistributionSiteList } from '/@/api/devlocal/productDistribution'
import { getPoSkuList } from '/@/api/devlocal/purchasePo'
import {
  addSubCategoryTracking,
  deleteSubCategoryTracking,
  getProductInfoBySkuAndSite,
  getSubCategoryTrackingList,
  updateSubCategoryTracking
} from '/@/api/devlocal/subCategoryTracking'
import { ROLE_ECOMMERCEOPERATIONLEAD_CODE, ROLE_ECOMMERCEOPERATOR_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user'


defineOptions({
  name: 'SubCategoryTracking',
})

const userName = useUserStore().getUsername
const currentRoleCode = useAclStore().getRole[0]
const isOperationRole = currentRoleCode === ROLE_ECOMMERCEOPERATOR_CODE || currentRoleCode === ROLE_ECOMMERCEOPERATIONLEAD_CODE

const dialogVisible = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const editId = ref<number | null>(null)
const formRef = ref()
const queryForm = reactive<any>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
})

const formData = reactive<{
  operationUserId: number | null
  site: string
  sku: string
  asin: string
  initialSubcategoryRank: number | null
  initialParentSales: number | null
  competitorHighestRank: number | null
  targetSubcategoryRank: number | null
  targetCompetitor: string
  targetCompetitorParentSales: number | null
  targetParentSales: number | null
}>({
  operationUserId: null,
  site: '',
  sku: '',
  asin: '',
  initialSubcategoryRank: null,
  initialParentSales: null,
  competitorHighestRank: null,
  targetSubcategoryRank: null,
  targetCompetitor: '',
  targetCompetitorParentSales: null,
  targetParentSales: null,
})

const formRules = {
  operationUserId: [{ required: true, message: '请选择运营', trigger: 'change' }],
  site: [{ required: true, message: '请选择站点', trigger: 'change' }],
  sku: [{ required: true, message: '请选择SKU', trigger: 'change' }],
}

const listLoading = ref<boolean>(false)
const list = ref<any>([])
const total = ref<number>(0)
const operationUserList = ref<{ id: number,label:string }[]>([])
const siteList = ref<{ id: number,label:string }[]>([])
const options = ref<{ value: string; label: string }[]>([])
const skuLoading = ref<boolean>(false)
const loadOperationUserList = async () => {
  try {
    const { data } = await getFrontPageProductManagerSelectOption({ type: 3})
    const allList = data || []
    if (isOperationRole) {
      // 运营或运营主管只能选择自己
      const self = allList.find((item: any) => item.label === userName)
      operationUserList.value = self ? [self] : []
      if (self) {
        formData.operationUserId = self.id
      }
    } else {
      operationUserList.value = allList
    }
  } catch (error) {
    console.error('加载运营列表失败:', error)
  }
}
const loadSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}
const remoteMethod = async (query: string) => {
  query = query.trim()
  if (query) {
    skuLoading.value = true
    try {
      const { data } = await getPoSkuList({
        sku: query,
      })
      options.value = data.map((item: any) => {
        return { value: `${item}`, label: `${item}` }
      })
    } catch (error) {
      console.error('搜索SKU失败:', error)
      options.value = []
    } finally {
      skuLoading.value = false
    }
  } else {
    options.value = []
  }
}
const loadProductInfo = async () => {
  if (!formData.sku || formData.site == null) {
    return
  }
  try {
    const { data } = await getProductInfoBySkuAndSite({
      sku: formData.sku,
      siteCode: formData.site as any as number,
    })
    formData.asin = data?.asin || ''
    formData.initialSubcategoryRank = data?.currentSubcategoryRank || null
    formData.initialParentSales = data?.monthOrderVolume || null
  } catch (error) {
    console.error('获取产品信息失败:', error)
  }
}
const showAddDialog = () => {
  isEdit.value = false
  editId.value = null
  resetForm()
  if (isOperationRole && operationUserList.value.length > 0) {
    formData.operationUserId = operationUserList.value[0].id
  }
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, {
    operationUserId: null,
    site: '',
    sku: '',
    asin: '',
    initialSubcategoryRank: null,
    initialParentSales: null,
    competitorHighestRank: null,
    targetSubcategoryRank: null,
    targetCompetitor: '',
    targetCompetitorParentSales: null,
    targetParentSales: null,
  })
}

const handleEdit = (row: any) => {
  isEdit.value = true
  editId.value = row.id
  Object.assign(formData, {
    operationUserId: row.operationUserId,
    site: row.site,
    sku: row.sku,
    asin: row.asin,
    initialSubcategoryRank: row.initialSubcategoryRank,
    initialParentSales: row.initialParentSales,
    competitorHighestRank: row.competitorHighestRank,
    targetSubcategoryRank: row.targetSubcategoryRank,
    targetCompetitor: row.targetCompetitor,
    targetCompetitorParentSales: row.targetCompetitorParentSales,
    targetParentSales: row.targetParentSales,
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  try {
    if (isEdit.value) {
      const { data } = await updateSubCategoryTracking({
        id: editId.value,
        competitorHighestRank: formData.competitorHighestRank,
        targetSubcategoryRank: formData.targetSubcategoryRank,
        targetCompetitor: formData.targetCompetitor,
        targetCompetitorParentSales: formData.targetCompetitorParentSales,
        targetParentSales: formData.targetParentSales,
      })
      if (data) {
        $baseMessage('修改成功！', 'success')
        dialogVisible.value = false
        fetchData()
      } else {
        $baseMessage('修改失败！', 'error')
      }
    } else {
      const { data } = await addSubCategoryTracking({
        operationUserId: formData.operationUserId,
        site: formData.site as any as number,
        sku: formData.sku,
        competitorHighestRank: formData.competitorHighestRank,
        targetSubcategoryRank: formData.targetSubcategoryRank,
        targetCompetitor: formData.targetCompetitor,
        targetCompetitorParentSales: formData.targetCompetitorParentSales,
        targetParentSales: formData.targetParentSales,
      })
      if (data) {
        $baseMessage('添加成功！', 'success')
        dialogVisible.value = false
        fetchData()
      } else {
        $baseMessage('添加失败！', 'error')
      }
    }
  } catch (error) {
    $baseMessage(isEdit.value ? '修改失败！' : '添加失败！', 'error')
  }
}

const handleDelete = async (id: number) => {
  const confirmed = await $baseConfirm('确定要删除这条记录吗？', '提示')
  if (!confirmed) return

  try {
    const { data } = await deleteSubCategoryTracking({ id })
    if (data) {
      $baseMessage('删除成功！', 'success')
      fetchData()
    } else {
      $baseMessage('删除失败！', 'error')
    }
  } catch (error) {
    $baseMessage('删除失败！', 'error')
  }
}

const clearPadding = (): string => {
  return ''
}

const cellStyle = (): CSSProperties => {
  return {
    textAlign: 'center',
  }
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

const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await getSubCategoryTrackingList(queryForm)
    list.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('加载数据失败:', error)
  }
  listLoading.value = false
}

watch(
  [() => formData.sku, () => formData.site],
  () => {
    loadProductInfo()
  }
)

onBeforeMount(() => {
  fetchData()
  loadOperationUserList()
  loadSiteList()
})
</script>

<style lang="scss" scoped>
.noneHoverTable {
  :deep(.clear-padding) {
    padding-top: 0;
    padding-bottom: 0;
  }
  :deep(.clear-padding .cell) {
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
