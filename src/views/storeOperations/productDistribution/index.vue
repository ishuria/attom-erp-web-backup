<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm">
          <el-form-item label="站点">
            <el-select
              v-model="queryForm.site"
              clearable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              multiple
              placeholder="请选择站点"
              style="width: 220px"
              @change="queryData"
            >
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                  所有
                </el-checkbox>
              </template>
              <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryForm.status" @change="queryData">
              <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAutoClaimSettings">自动分站点认领设定</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      border 
      :cell-class-name="clearPadding" :cell-style="cellStyle"
      class="noneHoverTable" :data="list" :header-cell-style="{ textAlign: 'center' }"
      stripe
    >
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image :src="row.skuImgUrl" style=" display: block;width: 75px; height: 75px;" @click="imagePreviewShow(row.skuImgUrl)">
            <template #error><el-icon/></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" :width="flexColumnWidth(list, 'SKU', 'sku')">
        <template #default="{ row }">
          {{ row.sku }}<br />{{ row.description }}
        </template>
      </el-table-column>
      <el-table-column label="ASIN" prop="asin" :width="flexColumnWidth(list, 'ASIN', 'asin')" />
      <el-table-column label="站点" min-width="130" prop="siteName"/>
      <el-table-column label="预计上架日期" min-width="115" prop="estimateInboundDate"/>
      <el-table-column label="最近入库" min-width="110" prop="recentlyInboundStorage"/>
      <el-table-column label="入库总数" min-width="100" prop="inboundStorageTotal"/>
      <el-table-column label="头部产品#" min-width="100" prop="headerCount"/>
      <el-table-column label="同赛道ASIN" min-width="200" prop="benchmarkAsin"/>
      <el-table-column label="产品经理" min-width="130" prop="productManagerName"/>
      <el-table-column label="运营" min-width="110" prop="userId">
        <template #default="{ row }">
          <el-select v-model="row.userId" placeholder="请选择运营人员" @change="handleChangeUser(row)">
            <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="运营分类" min-width="150" prop="typeId">
        <template #default="{ row }">
          <el-select v-model="row.typeId" placeholder="请选择运营分类" @change="handleChangeType(row)">
            <el-option v-for="item in row.userTypeList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
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
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 自动认领设定 -->
    <vab-dialog
      v-model="autoClaimSettingsVisible"
      title="自动认领设定"
      width="30%"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="showAdd">新增</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table border :data="distributionList" :header-cell-style="{ textAlign: 'center' }" stripe >
        <el-table-column align="center" label="姓名" min-width="100" prop="userName"/>
        <el-table-column align="center" label="自动认领站点" min-width="200" prop="siteName"/>
        <el-table-column align="center" label="操作" min-width="80">
          <template #default="{ row, $index }">
            <el-link type="danger" :underline="false" @click="handleDelDistributionList(row, $index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </vab-dialog>
    <!-- 新增 -->
    <vab-dialog
      v-model="addVisible"
      title="新增"
      width="20%"
      @close="handleCloseAdd"
    >
      <el-form ref="addFormRef" label-position="right" label-width="auto" :model="addForm" :rules="addFormRules" style="margin: 0;">
        <el-form-item label="姓名" prop="userId">
          <el-select v-model="addForm.userId" placeholder="请选择姓名">
            <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="自动认领站点" prop="site">
          <el-select v-model="addForm.site" placeholder="请选择自动认领站点">
            <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseAdd">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { CheckboxValueType, FormInstance, FormRules } from 'element-plus'
import type { CSSProperties } from 'vue'
import { addDistributionList, delDistributionList, getDistributionList, getDistributionOptionUserList, getDistributionProductList, getDistributionSiteList, getDistributionUserTypeList, updateDistributionAsinUser, updateDistributionUserType } from '/@/api/devlocal/productDistribution'
import type { IGetDistributionList, IGetDistributionProductList } from '/@/type/storeOperation/productDistributionType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'ProductDistribution'
})
type IQueryForm = {
  keyWord: string
  pageNo: number
  pageSize: number
  site: CheckboxValueType[]
  status: number
}
const queryForm = reactive<IQueryForm>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  site: [0],
  status: -1
})
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const list = ref<IGetDistributionProductList[]>([])
const distributionList = ref<IGetDistributionList[]>([])
const siteList = ref<{ id: number, label: string }[]>([])
const userList = ref<{ id: number, label: string }[]>([])
// 新增
const addVisible = ref<boolean>(false)
// 自动认领设定
const autoClaimSettingsVisible = ref<boolean>(false)
const addForm = reactive<any>({})
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<FormRules>({
  userId: [{ required: true, message: '请选择姓名', trigger: 'change' }],
  site: [{ required: true, message: '请选择自动认领站点', trigger: 'change' }]
})
const handleChangeUser = async (row: IGetDistributionProductList) => {
  if (!row.asin) {
    $baseMessage('ASIN为空, 无法修改运营人员!', 'error')
    row.userId = undefined
    return
  }
  try {
    const { data } = await updateDistributionAsinUser({
      id: row.id,
      userId: row.userId!
    })
    if (data) {
      const { data: typeList } = await getDistributionUserTypeList({ userId: row.userId! })
      row.userTypeList = typeList
    }
  } catch {}
}
const handleChangeType = async (row: IGetDistributionProductList) => {
  try {
    await updateDistributionUserType({
      id: row.id,
      typeId: row.typeId!
    })
  } catch {}
}
const handleConfirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addDistributionList(addForm)
      if (data) {
        $baseMessage('新增自动认领设定成功！', 'success')
        fetchDistributionList()
        handleCloseAdd()
      }
    }
  })
}
const handleCloseAdd = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
const showAdd = () => {
  addVisible.value = true
}
const handleDelDistributionList = async (row: IGetDistributionList, index: number) => {
  $baseConfirm('确定要删除自动认领设定吗？', null, async () => {
    const { data } = await delDistributionList({ id: row.id })
    if (data) {
      $baseMessage('删除成功！', 'success')
      distributionList.value.splice(index, 1)
    }
  })
}
const showAutoClaimSettings = async () => {
  autoClaimSettingsVisible.value = true
  fetchDistributionList()
}
const fetchDistributionList = async () => {
  const { data } = await getDistributionList()
  distributionList.value = data
}
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<any>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const statusOption = [
  {
    label: '所有',
    value: -1
  },
  {
    label: '未认领',
    value: 0
  },
  {
    label: '已认领',
    value: 1
  },
]

const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const { site } = toRefs(queryForm)
watch(site, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === siteList.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    queryForm.site = siteList.value.map((_) => _.id)
    // 全选的时候获取数据
    queryData()
  } else {
    queryForm.site = []
    // 取消全选获取数据
    queryData()
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
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index !== 1 && index !== 2 && index !== 8) {
    return {
      textAlign: 'center'
    }
  } else {
    return {
      textAlign: 'left'
    }
  }
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
const fetchSiteList = async () => {
  const { data } = await getDistributionSiteList()
  siteList.value = data
}
const fetchUserList = async () => {
  const { data } = await getDistributionOptionUserList()
  userList.value = data
}
const fetchData = async () => {
  listLoading.value = true
  const { site, ...filterQueryForm } = queryForm
  const { data } = await getDistributionProductList({
    ...filterQueryForm,
    siteCodes: site.join(',')
  })
  total.value = data.total
  list.value = data.list
  list.value.forEach(async (item) => {
    if (item.userId != null && item.userId != undefined) {
      const { data } = await getDistributionUserTypeList({ userId: item.userId })
      item.userTypeList = data
    }
  })
  listLoading.value = false
}
onBeforeMount(() => {
  fetchSiteList()
  fetchUserList()
  fetchData()
})
</script>

<style lang="scss" scoped>
.noneHoverTable {
  :deep() {
    .clear-padding {
      padding-top: 0;
      padding-bottom: 0;
      .cell {
        padding-right: 0;
        padding-left: 0;
      }
    }
  }
}
</style>