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
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border :data="list"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="changeInput"
        >
          <el-table-column align="center" label="HTS" min-width="110" prop="hts" />
          <el-table-column align="center" label="关税率" min-width="90" prop="tariffRate" >
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.tariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.tariffRate ? row.tariffRate + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="301税率" min-width="100" prop="threeZeroOne">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.threeZeroOne" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.threeZeroOne ? row.threeZeroOne + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="杂费" min-width="90" prop="extras" >
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.extras" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.extras ? row.extras + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品大类" min-width="250" prop="productCategory">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.productCategory }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.productCategory }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="1级大类" min-width="250" prop="categoryOne">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryOne }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.categoryOne }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="2级大类" min-width="250" prop="categoryTwo">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryTwo }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.categoryTwo }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="3级大类" min-width="250" prop="categoryThree">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryThree }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.categoryThree }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template #default="{ row, $index }">
              <el-button text type="danger" @click="handleDel(row, $index)">删除</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="欧洲" :name="1">
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showAdd2">新增</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent>
              <el-form-item>
                <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData" />
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
        <el-table
          border
          :data="list" :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="changeInput"
        >
          <el-table-column align="center" label="HTS" min-width="110" prop="hts"/>
          <el-table-column align="center" label="德国关税率" min-width="110" prop="deTariffRate">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.deTariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.deTariffRate ? row.deTariffRate + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="英国关税率" min-width="110" prop="ukTariffRate">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.ukTariffRate" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.ukTariffRate ? row.ukTariffRate + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="杂费" min-width="90" prop="extras">
            <template #default="{ row }">
              <div class="none">
                <el-input v-model="row.extras" @blur="clickCancel($event, row)" @keydown.enter="clickCancel($event, row)" />
              </div>
              <span>{{ row.extras ? row.extras + '%' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品大类" min-width="250" prop="productCategory">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.productCategory }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.productCategory }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="1级大类" min-width="250" prop="categoryOne">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryOne }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.categoryOne }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="2级大类" min-width="250" prop="categoryTwo">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryTwo }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.categoryTwo }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="3级大类" min-width="250" prop="categoryThree">
            <template #default="{ row }">
              <el-tooltip effect="dark" placement="top">
                <template #content>
                  <div class="custom-tooltip">{{ row.categoryThree }}</div>
                </template>
                <el-text style="vertical-align: middle;" truncated>{{ row.categoryThree }}</el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="">
            <template #default="{ row, $index }">
              <el-button text type="danger" @click="handleDel(row, $index)">删除</el-button>
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
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="addForm.type === 0" label="301关税率" prop="threeZeroOne">
          <el-input v-model="addForm.threeZeroOne" type="number" >
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="addForm.type === 1" label="德国关税率" prop="deTariffRate">
          <el-input v-model="addForm.deTariffRate" type="number" >
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="addForm.type === 1" label="英国关税率" prop="ukTariffRate">
          <el-input v-model="addForm.ukTariffRate" type="number" >
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="杂费" prop="extras">
          <el-input v-model="addForm.extras" type="number" >
            <template #append>%</template>
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
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { isEqual } from 'lodash'
import { addHTSList, delHTSList, getHTSList, updateHTSList } from '/@/api/devlocal/customsDeclarationAndTaxRefund'
import type { IGetHTSList, IGetHTSListReq } from '/@/type/customsDeclarationAndTaxRefund/hsHts'
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
const changeInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  _id.value = row.id
  switch (column.label) {
    case '产品大类': {
      updateVisible.value = true
      title.value = '产品大类'
      prop.value = 'productCategory'
      content.value = row.productCategory
    
      break;
    }
    case '1级大类': {
      updateVisible.value = true
      title.value = '1级大类'
      prop.value = 'categoryOne'
      content.value = row.categoryOne
    
      break;
    }
    case '2级大类': {
      updateVisible.value = true
      title.value = '2级大类'
      prop.value = 'categoryTwo'
      content.value = row.categoryTwo
    
      break;
    }
    case '3级大类': {
      updateVisible.value = true
      title.value = '3级大类'
      prop.value = 'categoryThree'
      content.value = row.categoryThree
    
      break;
    }
    default: {
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
        extras: value.extras! / 100,
        type: 0
      })
    } else if (activeName.value === 1) {
      await updateHTSList({
        id: value.id,
        deTariffRate: value.deTariffRate! / 100,
        ukTariffRate: value.ukTariffRate! / 100,
        extras: value.extras! / 100,
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
    if (item.extras) {
      item.extras = parseFloat((item.extras * 100).toFixed(2))
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
  max-width: 400px; 
  font-size: var(--el-font-size-base);
  white-space: pre-wrap; 
}
</style>
