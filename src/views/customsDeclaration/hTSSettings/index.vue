<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="美国" :name="0">
        <vab-hts-table
          :list="list" 
          :query-form="queryForm"
          :total="total"
          @add="showAdd"
          @current-change="handleCurrentChange"
          @delete="handleDel"
          @query-data="handleKeyWordChange"
          @size-change="handleSizeChange"
          @update:remark="handleShowRemark"
          @view="handleShowView"
        >
          <template #rate-columns>
            <el-table-column label="关税率" min-width="90" prop="tariffRate" >
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.tariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.tariffRate != null ? row.tariffRate + '%' : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="301税率" min-width="100" prop="threeZeroOne">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.threeZeroOne" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.threeZeroOne != null ? row.threeZeroOne + '%' : '' }}</span>
              </template>
            </el-table-column>
          </template>
        </vab-hts-table>
      </el-tab-pane>
      <el-tab-pane label="英国" :name="1">
        <vab-hts-table
          :list="list" 
          :query-form="queryForm"
          :total="total"
          @add="showAdd"
          @current-change="handleCurrentChange"
          @delete="handleDel"
          @query-data="handleKeyWordChange"
          @size-change="handleSizeChange"
          @update:remark="handleShowRemark"
          @view="handleShowView"
        >
          <template #rate-columns>
            <el-table-column align="center" label="德国关税率" min-width="110" prop="deTariffRate">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.deTariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.deTariffRate != null ? row.deTariffRate + '%' : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="英国关税率" min-width="110" prop="ukTariffRate">
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.ukTariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.ukTariffRate != null ? row.ukTariffRate + '%' : '' }}</span>
              </template>
            </el-table-column>
          </template>
        </vab-hts-table>
      </el-tab-pane>
      <el-tab-pane label="德国" :name="2">
        <vab-hts-table
          :list="list" 
          :query-form="queryForm"
          :total="total"
          @add="showAdd"
          @current-change="handleCurrentChange"
          @delete="handleDel"
          @query-data="handleKeyWordChange"
          @size-change="handleSizeChange"
          @update:remark="handleShowRemark"
          @view="handleShowView"
        >
          <template #rate-columns>
            <el-table-column label="关税率" min-width="90" prop="tariffRate" >
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.tariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.tariffRate != null ? row.tariffRate + '%' : '' }}</span>
              </template>
            </el-table-column>
          </template>
        </vab-hts-table>
      </el-tab-pane>
      <el-tab-pane label="加拿大" :name="3">
        <vab-hts-table
          :list="list" 
          :query-form="queryForm"
          :total="total"
          @add="showAdd"
          @current-change="handleCurrentChange"
          @delete="handleDel"
          @query-data="handleKeyWordChange"
          @size-change="handleSizeChange"
          @update:remark="handleShowRemark"
          @view="handleShowView"
        >
          <template #rate-columns>
            <el-table-column label="关税率" min-width="90" prop="tariffRate" >
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.tariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.tariffRate != null ? row.tariffRate + '%' : '' }}</span>
              </template>
            </el-table-column>
          </template>
        </vab-hts-table>
      </el-tab-pane>
      <el-tab-pane label="日本" :name="4">
        <vab-hts-table
          :list="list" 
          :query-form="queryForm"
          :total="total"
          @add="showAdd"
          @current-change="handleCurrentChange"
          @delete="handleDel"
          @query-data="handleKeyWordChange"
          @size-change="handleSizeChange"
          @update:remark="handleShowRemark"
          @view="handleShowView"
        >
          <template #rate-columns>
            <el-table-column label="关税率" min-width="90" prop="tariffRate" >
              <template #default="{ row }">
                <div class="none">
                  <el-input v-model="row.tariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
                </div>
                <span>{{ row.tariffRate != null ? row.tariffRate + '%' : '' }}</span>
              </template>
            </el-table-column>
          </template>
        </vab-hts-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增 -->
    <vab-dialog
      v-model="addVisible"
      title="新增"
      width="25%"
      @close="handleClose"
    >
      <el-form ref="addFormRef" label-position="right" label-width="auto" :model="addForm" :rules="addFormRules" style="margin: 0;">
        <el-form-item label="HTS" prop="hts">
          <el-input v-model="addForm.hts" clearable />
        </el-form-item>
        <el-form-item v-if="addForm.type === 0" label="关税率" prop="tariffRate">
          <el-input v-model="addForm.tariffRate" type="number" >
            <template #suffix>
              <el-icon class="el-input__icon" style="font-style: normal">%</el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="addForm.type === 0" label="301关税率" prop="threeZeroOne">
          <el-input v-model="addForm.threeZeroOne" type="number" >
            <template #suffix>
              <el-icon class="el-input__icon" style="font-style: normal">%</el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="addForm.type === 1" label="德国关税率" prop="deTariffRate">
          <el-input v-model="addForm.deTariffRate" type="number" >
            <template #suffix>
              <el-icon class="el-input__icon" style="font-style: normal">%</el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="addForm.type === 1" label="英国关税率" prop="ukTariffRate">
          <el-input v-model="addForm.ukTariffRate" type="number" >
            <template #suffix>
              <el-icon class="el-input__icon" style="font-style: normal">%</el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="杂费" prop="extras">
          <el-input v-model="addForm.extras" type="number" >
            <template #suffix>
              <el-icon class="el-input__icon" style="font-style: normal">%</el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="产品大类" prop="productCategory">
          <el-input v-model="addForm.productCategory" resize="none" :rows="3" type="textarea" />
        </el-form-item>
        <el-form-item label="1级大类" prop="categoryOne">
          <el-input v-model="addForm.categoryOne" resize="none" :rows="3" type="textarea" />
        </el-form-item>
        <el-form-item label="2级大类" prop="categoryTwo">
          <el-input v-model="addForm.categoryTwo" resize="none" :rows="3" type="textarea" />
        </el-form-item>
        <el-form-item label="3级大类" prop="categoryThree">
          <el-input v-model="addForm.categoryThree" resize="none" :rows="3"  type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 更改产品大类、1级、2级、3级大类的弹窗 -->
    <vab-dialog
      v-model="updateVisible"
      :title="title"
      width="25%"
    >
      <el-input v-model="content" resize="none" :rows="15" type="textarea" />
      <template #footer>
        <el-button @click="updateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmUpdate">确认</el-button>
      </template>
    </vab-dialog>

    <!-- 查看 -->
    <vab-dialog
      v-model="viewVisible"
      title="查看"
      width="50%"
    >
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-form inline :model="viewQueryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model.trim="viewQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="viewQueryData" @keyup.enter="viewQueryData" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="viewListLoading" type="primary" @click="viewQueryData" />
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table
        v-loading="viewListLoading"
        border
        :data="viewList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
      >
        <el-table-column label="图片" prop="skuImageUrl" >
          <template #default="{ row }">
            <el-image :src="row.skuImageUrl" style="width: 100px; height: 100px;" >
              <template #error>
                <el-icon />
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="SKU" prop="sku" />
        <el-table-column label="Descriptions" prop="desc" />
      </el-table>
      <vab-pagination
        :current-page="viewQueryForm.pageNo"
        :page-size="viewQueryForm.pageSize"
        :total="viewTotal"
        @current-change="handleViewCurrentChange"
        @size-change="handleViewSizeChange"
      />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { isEqual } from 'lodash'
import { addHTSList, delHTSList, getHTSList, getHtsSkuList, updateHTSList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import type { IGetHTSList, IGetHTSListReq, IGetHtsSkuListReq } from '/@/type/customsDeclarationAndTaxRefund/hsHts'
import { getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'HTSSettings'
})

const router = useRouter()
const route = useRoute()
const viewListLoading = ref<boolean>(false)
const viewList = ref<any>([])
const viewTotal = ref<number>(0)
const viewQueryForm = reactive<IGetHtsSkuListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  type: 0,
  htsId: 0
})
const viewVisible = ref<boolean>(false)
const activeName = ref<number>(0)
const queryForm = reactive<IGetHTSListReq>({
  keyWord: '',
  type: 0,
  pageNo: 1,
  pageSize: 20
})
const total = ref<number>(0)
const listLoading = ref<boolean>(false)
const list = ref<IGetHTSList[]>([])
let copyRow: IGetHTSList | null = null
const addVisible = ref<boolean>(false)
const addForm = reactive<any>({})
const addFormRef = ref<FormInstance>()
const addFormRules = reactive<FormRules>({
  hts: [{ required: true, message: '请输入HTS', trigger: 'blur' }],
  productCategory: [{ required: true, message: '请输入产品大类', trigger: 'blur' }],
})
const updateVisible = ref<boolean>(false)
const title = ref<string>('')
const content = ref<string>('')
const _id = ref<number>(0)
const prop = ref<string>('')

const handleShowView = (row: IGetHTSList) => {
  viewQueryForm.htsId = row.id
  viewQueryForm.type = activeName.value
  viewVisible.value = true
  viewFetchData()
}
const viewQueryData = async () => {
  viewQueryForm.pageNo = 1
  viewFetchData()
}
const viewFetchData = async () => {
  viewListLoading.value = true
  const { data } = await getHtsSkuList(viewQueryForm)
  viewTotal.value = data.total
  viewList.value = data.list
  viewListLoading.value = false
}
const handleViewCurrentChange = (val: number) => {
  viewQueryForm.pageNo = val
  viewFetchData()
}
const handleViewSizeChange = (val: number) => {
  viewQueryForm.pageNo = 1
  viewQueryForm.pageSize = val
  viewFetchData()
}
const handleConfirmUpdate = async () => {

  const { data } = await updateHTSList({
    [`${prop.value}`]: content.value,
    id: _id.value,
    type: activeName.value
  })
  if (data) {
    $baseMessage(`${title.value}更新成功！`, 'success')
    updateVisible.value = false
    queryData()
  }
}
const handleConfirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addHTSList({
        ...addForm,
        tariffRate: addForm.tariffRate / 100,
        threeZeroOne: addForm.threeZeroOne / 100,
        deTariffRate: addForm.deTariffRate / 100,
        ukTariffRate: addForm.ukTariffRate / 100,
        extras: addForm.extras / 100
      })
      if (data) {
        $baseMessage('新增成功！', 'success')
        handleClose()
        queryData()
      }
    }
  })
}
const handleClose = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
const labelFieldMap = {
  productCategory: '产品大类',
  categoryOne: '1级大类',
  categoryTwo: '2级大类',
  categoryThree: '3级大类'
}
const handleShowRemark = (row: IGetHTSList, field: string) => {
  _id.value = row.id!
  updateVisible.value = true
  title.value = labelFieldMap[field as keyof typeof labelFieldMap]
  prop.value = field
  content.value = row[field]
}

// table blur事件
const clickCancel = async (event: any, value: IGetHTSList) => {
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
    if (activeName.value === 0) {
      try {
        await updateHTSList({
          id: value.id,
          tariffRate: value.tariffRate! / 100,
          threeZeroOne: value.threeZeroOne! / 100,
          extras: value.extras! / 100,
          type: 0
        })
      } catch {
        Object.assign(value, copyRow)
      }
    } else if (activeName.value === 1) {
      try {
        await updateHTSList({
          id: value.id,
          deTariffRate: value.deTariffRate! / 100,
          ukTariffRate: value.ukTariffRate! / 100,
          extras: value.extras! / 100,
          type: 1
        })
      } catch {
        Object.assign(value, copyRow)
      }
    }
  }
}
const showAdd = () => {
  addVisible.value = true
  addForm.type = activeName.value
}
const handleDel = async (row: IGetHTSList, index: number) => {
  $baseConfirm('确定要删除HTS吗？', null, async () => {
    const { data } = await delHTSList({ id: row.id! })
    if (data) {
      $baseMessage('HTS删除成功！', 'success')
      list.value.splice(index, 1)
      total.value--
    }
  })
}
const handleTabClick = (tab: TabsPaneContext) => {
  queryForm.type = Number(tab.props.name)
  activeName.value = Number(tab.props.name)
  router.push({
    query: {
      ...route.query,
      pageNo: '1',
      pageSize: queryForm.pageSize,
      tab: queryForm.type
    }
  })
  fetchData()
}
const handleKeyWordChange = async (val?: string) => {
  queryForm.keyWord = val
  await router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    }
  })
  await fetchData()
}
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
    ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    }
  })
  fetchData()
}
const handleCurrentChange = async (value: number) => {
  queryForm.pageNo = value
  await router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    }
  })
  await fetchData()
}
const handleSizeChange = async (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  await router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    }
  })
  await fetchData()
}
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getHTSList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((item) => {
    if (item.tariffRate) {
      item.tariffRate = parseFloat((item.tariffRate * 100).toFixed(2))
    }
    if (item.threeZeroOne) {
      item.threeZeroOne = parseFloat((item.threeZeroOne * 100).toFixed(2))
    }
    if (item.deTariffRate) {
      item.deTariffRate = parseFloat((item.deTariffRate * 100).toFixed(2))
    }
    if (item.ukTariffRate) {
      item.ukTariffRate = parseFloat((item.ukTariffRate * 100).toFixed(2))
    }
    if (item.extras) {
      item.extras = parseFloat((item.extras * 100).toFixed(4))
    }
  })
  listLoading.value = false
}
onBeforeMount(() => {
  const { pageNo, pageSize, tab } = route.query
  queryForm.pageNo = Number(pageNo) || 1
  queryForm.pageSize = Number(pageSize) || 20
  activeName.value = Number(tab) || 0
  queryForm.type = activeName.value
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
          .el-form {
            .el-form-item:first-child {
              // margin: 0 !important;

              .el-check-tag,
              .el-form-item__label {
                margin: 0 10px 5px 0;
                border-radius: 99px;
              }
            }
          }
        }
        .hts-table {
          display: flex;
          flex-direction: column;
          height: 100%;

          .el-table {
            flex: 1;
          }
        }
      }
    }
  }
  .none {
    display: none;
  }
}
.custom-tooltip {
  max-width: 400px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
}
</style>
