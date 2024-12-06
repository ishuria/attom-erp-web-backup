<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form inline :model="queryForm">
          <el-form-item label="站点">
            <el-select
              v-model="queryForm.site"
              multiple
              clearable
              collapse-tags
              placeholder="请选择站点"
              :max-collapse-tags="1"
              style="width: 220px"
            >
              <template #header>
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="indeterminate"
                  @change="handleCheckAll"
                >
                  所有
                </el-checkbox>
              </template>
              <el-option
                v-for="item in siteOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryForm.status">
              <el-option 
                v-for="item in statusOption"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
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
            <el-input v-model.trim="queryForm.keyWord" placeholder="请输入搜索关键词" clearable @keyup.enter.native="queryData" @input="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" :loading="listLoading" native-type="submit" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table 
      border
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="cellStyle"
    >
      <el-table-column label="预计上架日期" prop="" min-width="115"></el-table-column>
      <el-table-column label="图片" prop="" width="80">
        <template #default="{ row }">
          <el-image :src="row.url" @click="imagePreviewShow(row.url)">
            <template #error>
              <el-icon></el-icon>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="" min-width="200"></el-table-column>
      <el-table-column label="ASIN" prop="" min-width="130"></el-table-column>
      <el-table-column label="站点" prop="" min-width="140"></el-table-column>
      <el-table-column label="最近入库" prop="" min-width="110"></el-table-column>
      <el-table-column label="入库总数" prop="" min-width="100"></el-table-column>
      <el-table-column label="同赛道ASIN" prop="" min-width="200"></el-table-column>
      <el-table-column label="产品经理" prop="" min-width="100"></el-table-column>
      <el-table-column label="运营" prop="" min-width="100">
        <template #default="{ row }">
          <el-select></el-select>
        </template>
      </el-table-column>
      <el-table-column label="运营分类" prop="" min-width="150">
        <el-select>

        </el-select>
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
    <el-image-viewer v-if="imagePreviewVisible" :url-list="imagePreviewList" @close="imagePreviewClose" hide-on-click-modal />
    <!-- 自动认领设定 -->
    <vab-dialog
      title="自动认领设定"
      v-model="autoClaimSettingsVisible"
      width="30%"
    >
      <vab-query-form>
        <vab-query-form-right-panel :span="24">
          <el-button type="primary">新增</el-button>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table border stripe :header-cell-style="{ textAlign: 'center' }" >
        <el-table-column label="姓名" prop="" min-width="100" align="center"></el-table-column>
        <el-table-column label="自动认领站点" prop="" min-width="200" align="center">
          <template #default="{ row }">
            <el-select />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" align="center">
          <template #default="{ row }">
            <el-link :underline="false" type="danger">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { CheckboxValueType } from 'element-plus'
import { CSSProperties } from 'vue'

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
  site: [],
  status: 0
})
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
// 自动认领设定
const autoClaimSettingsVisible = ref<boolean>(false)
const showAutoClaimSettings = () => {
  autoClaimSettingsVisible.value = true
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
const siteOption = ref<any>([
  {
    label: '亚马逊美国US',
    value: 0
  },
  {
    label: '亚马逊德国DE',
    value: 1
  },
])
const checkAll = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const { site } = toRefs(queryForm)
watch(site, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === siteOption.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    queryForm.site = siteOption.value.map((_: any) => _.value)
  } else {
    queryForm.site = []
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
  queryForm.pageNo = 1
  // fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  const label = data.column.label
  if (label === '预计上架日期' || label === '图片' || label === '入库总数' || label === '产品经理' || label === '运营' || label === '运营分类') {
    return {
      textAlign: 'center'
    }
  } else {
    return {
      textAlign: 'left'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>