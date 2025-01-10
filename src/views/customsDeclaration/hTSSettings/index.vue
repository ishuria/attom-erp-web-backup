<template>
  <div class="tabs-table-container no-background-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane label="美国" :name="0">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showAdd1">新增</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" :loading="listLoading" @click="queryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }"
          :data="list"
          @cell-click="changeInput"
        >
          <el-table-column label="HTS" prop="hts" min-width="" align="center"></el-table-column>
          <el-table-column label="关税率" prop="tariffRate" min-width="" align="center">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.tariffRate" @keydown.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.tariffRate ? row.tariffRate + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="301税率" prop="threeZeroOne" min-width="" align="center">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.threeZeroOne" @keydown.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.threeZeroOne ? row.threeZeroOne + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="杂费" prop="extras" min-width="" align="center">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.extras" @keydown.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.extras }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品大类" prop="productCategory" min-width="">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.productCategory }}</div>
                </template>
                <el-text truncated>{{ row.productCategory }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="1级大类" prop="categoryOne" min-width="">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryOne }}</div>
                </template>
                <el-text truncated>{{ row.categoryOne }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="2级大类" prop="categoryTwo" min-width="">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryTwo }}</div>
                </template>
                <el-text truncated>{{ row.categoryTwo }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="3级大类" prop="categoryThree" min-width="">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryThree }}</div>
                </template>
                <el-text truncated>{{ row.categoryThree }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="" align="center">
            <template #default="{ row, $index }">
              <el-button text type="danger" @click="handleDel(row, $index)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
      <el-tab-pane label="欧洲" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showAdd2">新增</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @keyup.enter="queryData" @input="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" :loading="listLoading" @click="queryData" ></el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border stripe
          :header-cell-style="{ textAlign: 'center' }"
          :data="list"
          @cell-click="changeInput"
        >
          <el-table-column label="HTS" prop="hts" min-width="" align="center"></el-table-column>
          <el-table-column label="德国关税率" prop="deTariffRate" min-width="" align="center">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.deTariffRate" @keydown.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.deTariffRate ? row.deTariffRate + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="英国关税率" prop="ukTariffRate" min-width="" align="center">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.ukTariffRate" @keydown.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.ukTariffRate ? row.ukTariffRate + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="杂费" prop="extras" min-width="" align="center">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.extras" @keydown.enter="clickCancel($event, row)" @blur="clickCancel($event, row)" />
              </div>
              <span>{{ row.extras }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品大类" prop="productCategory" min-width="">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.productCategory }}</div>
                </template>
                <el-text truncated>{{ row.productCategory }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="1级大类" prop="categoryOne" min-width="">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryOne }}</div>
                </template>
                <el-text truncated>{{ row.categoryOne }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="2级大类" prop="categoryTwo" min-width="">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryTwo }}</div>
                </template>
                <el-text truncated>{{ row.categoryTwo }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="3级大类" prop="categoryThree" min-width="">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryThree }}</div>
                </template>
                <el-text truncated>{{ row.categoryThree }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="" align="center">
            <template #default="{ row, $index }">
              <el-button text type="danger" @click="handleDel(row, $index)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty"></el-empty>
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
    </el-tabs>
    <!-- 新增 -->
    <vab-dialog
      title="新增"
      width="25%"
      v-model="addVisible"
      @close="handleClose"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="right" label-width="auto" style="margin: 0;">
        <el-form-item label="HTS" prop="hts">
          <el-input v-model="addForm.hts" clearable />
        </el-form-item>
        <el-form-item v-if="addForm.type === 0" label="关税率" prop="tariffRate">
          <el-input type="number" v-model="addForm.tariffRate" />
        </el-form-item>
        <el-form-item v-if="addForm.type === 0" label="301关税率" prop="threeZeroOne">
          <el-input type="number" v-model="addForm.threeZeroOne" />
        </el-form-item>
        <el-form-item v-if="addForm.type === 1" label="德国关税率" prop="deTariffRate">
          <el-input type="number" v-model="addForm.deTariffRate" />
        </el-form-item>
        <el-form-item v-if="addForm.type === 1" label="英国关税率" prop="ukTariffRate">
          <el-input type="number" v-model="addForm.ukTariffRate" />
        </el-form-item>
        <el-form-item label="杂费" prop="extras">
          <el-input type="number" v-model="addForm.extras" />
        </el-form-item>
        <el-form-item label="产品大类" prop="productCategory">
          <el-input type="textarea" v-model="addForm.productCategory" :rows="3" resize="none" />
        </el-form-item>
        <el-form-item label="1级大类" prop="categoryOne">
          <el-input type="textarea" v-model="addForm.categoryOne" :rows="3" resize="none" />
        </el-form-item>
        <el-form-item label="2级大类" prop="categoryTwo">
          <el-input type="textarea" v-model="addForm.categoryTwo" :rows="3" resize="none" />
        </el-form-item>
        <el-form-item label="3级大类" prop="categoryThree">
          <el-input type="textarea" v-model="addForm.categoryThree" :rows="3" resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 更改产品大类、1级、2级、3级大类的弹窗 -->
    <vab-dialog
      :title="title"
      v-model="updateVisible"
      width="25%"
    >
      <el-input v-model="content" type="textarea" :rows="15" resize="none" />
      <template #footer>
        <el-button @click="updateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmUpdate">确认</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { isEqual } from 'lodash'
import { addHTSList, delHTSList, getHTSList, updateHTSList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import { IGetHTSList, IGetHTSListReq } from '/@/type/customsDeclarationAndTaxRefund/hsHts'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'

defineOptions({
  name: 'HTSSettings'
})

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
  categoryOne: [{ required: true, message: '请输入1级大类', trigger: 'blur' }],
  categoryTwo: [{ required: true, message: '请输入2级大类', trigger: 'blur' }],
  categoryThree: [{ required: true, message: '请输入3级大类', trigger: 'blur' }],
})
const updateVisible = ref<boolean>(false)
const title = ref<string>('')
const content = ref<string>('')
const _id = ref<number>(0)
const prop = ref<string>('')

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
        ukTariffRate: addForm.ukTariffRate / 100
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
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement, event: Event) => {
  _id.value = row.id
  if (column.label === '产品大类') {
    updateVisible.value = true
    title.value = '产品大类'
    prop.value = 'productCategory'
    content.value = row.productCategory
  } else if (column.label === '1级大类') {
    updateVisible.value = true
    title.value = '1级大类'
    prop.value = 'categoryOne'
    content.value = row.categoryOne
  } else if (column.label === '2级大类') {
    updateVisible.value = true
    title.value = '2级大类'
    prop.value = 'categoryTwo'
    content.value = row.categoryTwo
  } else if (column.label === '3级大类') {
    updateVisible.value = true
    title.value = '3级大类'
    prop.value = 'categoryThree'
    content.value = row.categoryThree
  } else {
    const firstChild = cell?.children[0]?.children[0]
    const secondChild = cell?.children[0]?.children[1]

    if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
      return
    }

    copyRow = JSON.parse(JSON.stringify(row))

    if (firstChild.classList.contains('none')) {
      firstChild.classList.remove('none')
      secondChild.classList.add('none')
      focusAndSelectInput(cell)
    }
  }
  
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
      await updateHTSList({
        id: value.id,
        tariffRate: value.tariffRate! / 100,
        threeZeroOne: value.threeZeroOne! / 100,
        extras: value.extras,
        type: 0
      })
    } else if (activeName.value === 1) {
      await updateHTSList({
        id: value.id,
        deTariffRate: value.deTariffRate! / 100,
        ukTariffRate: value.ukTariffRate! / 100,
        extras: value.extras,
        type: 1
      })
    }
  }
}
const showAdd1 = () => {
  addVisible.value = true
  addForm.type = 0
}
const showAdd2 = () => {
  addVisible.value = true
  addForm.type = 1
}
const handleDel = async (row: IGetHTSList, index: number) => {
  $baseConfirm('确定要删除HTS吗？', null, async () => {
    const { data } = await delHTSList({ id: row.id! })
    if (data) {
      $baseMessage('HTS删除成功！', 'success')
      list.value.splice(index, 1)
    }
  })
}
const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name === 0) {
    queryForm.type = 0
    activeName.value = 0
    queryData()
  } else {
    queryForm.type = 1
    activeName.value = 1
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
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
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
  })
  listLoading.value = false
}
onBeforeMount(() => {
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

        .el-table {
          flex: 1;
        }
      }
    }
  }
  .none {
    display: none;
  }
}
.custom-tooltip {
  white-space: pre-wrap; 
  max-width: 400px; 
  font-size: var(--el-font-size-base);
}
</style>
