<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="showDefaultParams">默认参数</el-button>
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
    <el-table v-loading="listLoading" border :data="list" :header-cell-style="{ textAlign: 'center' }" stripe>
      <el-table-column label="上新日期" prop="newArrivalDate" />
      <el-table-column label="产品图片" prop="productManager" />
      <el-table-column label="SKU" prop="operation" />
      <el-table-column label="订货主站点" prop="site" />
      <el-table-column label="产品经理" prop="site" />
      <el-table-column label="运营" prop="site" />
      <el-table-column label="Vine数量" prop="site" />
      <el-table-column label="产品定位" prop="site" />
      <el-table-column label="1月末Rating" prop="site" />
      <el-table-column label="2月末Rating" prop="site" />
      <el-table-column label="3月末Rating" prop="site" />
      <el-table-column label="4月末Rating" prop="site" />
      <el-table-column label="5月末Rating" prop="site" />
      <el-table-column label="6月末Rating" prop="site" />
      <el-table-column label="状态" prop="site" />

      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="">开启</el-button>
          <el-button type="danger" @click="">暂停</el-button>
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

    <!-- 默认参数 -->
    <vab-dialog v-model="defaultParamsVisible" title="默认参数" width="20%">
      <el-form :model="defaultParamsForm" style="margin-right: 0; margin-left: 0">
        <el-form-item label="评分不达标OEM产品考核数加回数：">
          <el-input v-model="defaultParamsForm.oemCount" />
        </el-form-item>
        <el-form-item label="评分不达标非OEM产品考核数加回数：">
          <el-input v-model="defaultParamsForm.nonOemCount" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleDefaultParams">确定</el-button>
      </template>
    </vab-dialog>

    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'KeyProducts',
})

const defaultParamsVisible = ref<boolean>(false)
const defaultParamsForm = reactive<any>({
  oemCount: '',
  nonOemCount: '',
})
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const queryForm = reactive<any>({
  keyWord: '',
})

const listLoading = ref<boolean>(false)
const list = ref<any>([])
const total = ref<number>(0)

const showDefaultParams = () => {
  defaultParamsVisible.value = true
}
const handleDefaultParams = () => {
  //
}
const queryData = () => {
  listLoading.value = true
  //
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  fetchData()
}
const fetchData = () => {
  // listLoading.value = true
  //
}
</script>

<style scoped></style>
