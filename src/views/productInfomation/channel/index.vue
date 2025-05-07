<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleShowCategorySetUp">货物类别设定</el-button>
        <el-button type="primary" @click="handleModifyAll">批量修改</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="queryData" @keyup.enter="queryData" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData"/>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table 
      border 
      :cell-class-name="clearPadding" 
      class="noneHoverTable" :data="list" 
      :header-cell-style="{ textAlign: 'center' }" stripe
      @selection-change="setSelectedRows"
    >
      <el-table-column align="center" fixed="left" type="selection" width="50"/>
      <el-table-column fixed="left" label="图片" prop="" width="75">
        <template #default="{ row }">
          <el-image :src="row.skuImgUrl" style="display: block; width: 75px; height: 75px;" @click="imagePreviewShow(row.skuImgUrl)">
            <template #error><el-icon/></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU" prop="sku" :width="flexColumnWidth(list, 'SKU', 'sku')">
        <template #default="{ row }">
          <span>{{ row.sku }}</span><br /><span>{{ row.productDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="重量" min-width="90" prop="weight"/>
      <el-table-column label="货物类别" prop="merchandiseName" :width="flexColumnWidth(list, '货物类别', 'merchandiseName')"/>
      <el-table-column 
        v-for="(item, index) in option"
        :key="index"
        :label="item.siteName"
        :min-width="flexColumnWidth(list, '亚马逊MX墨西哥', item.siteName)"
        :prop="item.siteName"
      />
      <el-table-column align="center" fixed="right" label="操作" width="90">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="handleModify(row)">修改</el-link>
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
    <!-- 修改 -->
    <vab-dialog
      v-model="modifyVisible"
      :title="`${isBatch ? '批量' : ''}修改货物类别`"
      width="25%"
    >
      <el-form ref="modifyFormRef" label-position="top" :model="modifyForm">
        <el-form-item label="类别" prop="typeId">
          <el-select v-model="modifyForm.typeId" placeholder="请选择类别" @change="handleGetTypeChannel">
            <el-option 
              v-for="item in merchandiseTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table border :data="modifyForm.list">
        <el-table-column label="站点" prop="siteName" width="150" />
        <el-table-column label="渠道" min-width="100" prop="channel" />
      </el-table>
      <template #footer>
        <el-button @click="modifyVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmModify">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 货物类别 -->
    <vab-dialog
      v-model="categorySetUpVisible"
      title="货物类别设定"
      top="5%"
      width="40%"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="handleShowAdd">新增分类</el-button>
          <el-button type="primary" @click="handleModifyBatchSetUp">批量修改</el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <el-form inline :model="setUpQueryForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="setUpQueryForm.keyWord" clearable placeholder="请输入搜索关键词" @input="setUpQueryData" @keyup.enter="setUpQueryData" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" :loading="setUpListLoading" type="primary" @click="setUpQueryData"/>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-table border class="noneHoverTable" :data="setUpList" max-height="800" stripe @selection-change="setSelectedSetUpRows">
        <el-table-column align="center" type="selection" />
        <el-table-column label="分类" min-width="150" prop="merchandiseName"/>
        <el-table-column label="站点" min-width="130" prop="siteName"/>
        <el-table-column label="渠道" min-width="280" prop="channel"/>
        <el-table-column align="center" label="操作" width="80">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleModifySetUp(row)">修改</el-link>
          </template>
        </el-table-column>
      </el-table>
      <vab-pagination 
        :current-page="setUpQueryForm.pageNo"
        :page-size="setUpQueryForm.pageSize"
        :total="setUpTotal"
        @current-change="handleSetUpCurrentChange"
        @size-change="handleSetUpSizeChange"
      />
      <template #footer></template>
    </vab-dialog>
    <!-- 新增 -->
    <vab-dialog
      v-model="addVisible"
      title="新增分类"
      width="20%"
      @close="closeAddDialog"
    >
      <el-form ref="addFormRef" label-position="top" :model="addForm" :rules="addFormRules">
        <el-form-item label="分类" prop="merchandiseName">
          <el-input v-model="addForm.merchandiseName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeAddDialog">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确定</el-button>
      </template>
    </vab-dialog>
    <!-- 货物类别设定里的修改 -->
    <vab-dialog
      v-model="setUpModifyVisible"
      :title="`${setUpBatch ? '批量' : ''}修改渠道`"
      width="20%"
    >
      <el-form label-position="top" :model="setUpModifyForm">
        <el-form-item label="渠道">
          <el-select v-model="setUpModifyForm.channelId" filterable placeholder="请选择渠道">
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="setUpModifyVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateModifySetUp">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { addMerchandise, getFreightForwarderQuery, getMerchandiseList, getMerchandiseTypeChannel, getMerchandiseTypeList, getSkuShippingChannelList, updateBatchSkuShippingChannelMerchandise, updateMerchandise, updateMerchandiseTypeBatch, updateSkuShippingChannelMerchandise } from '/@/api/devlocal/productInformation'
import type { IGetMerchandiseList, IGetMerchandiseListReq, IGetMerchandiseTypeList, IGetSkuShippingChannelList } from '/@/type/productInformation/channelType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'Channel'
})
const router = useRouter()
const route = useRoute()
const setUpModifyVisible = ref<boolean>(false)
const addVisible = ref<boolean>(false)
const categorySetUpVisible = ref<boolean>(false)
const selectedRows = ref<any[]>([])
const selectedSetUpRows = ref<any[]>([])
const modifyVisible = ref<boolean>(false)
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const queryForm = reactive<IGetMerchandiseListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
const setUpQueryForm = reactive<IGetMerchandiseListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
// 判断是批量修改还是单个修改
const isBatch = ref<boolean>(false)
const modifyForm = reactive<any>({})
const modifyFormRef = ref<FormInstance>()
const setUpModifyForm = reactive<any>({})
const addForm = reactive<any>({})
const addFormRules = reactive<any>({
  merchandiseName: [{ required: true, message: '请输入货物类别名', trigger: 'blur' }],
})
const addFormRef = ref<FormInstance>()
const setUpTotal = ref<number>(0)
const total = ref<number>(0)
const list = ref<IGetSkuShippingChannelList[]>([])
const listLoading = ref<boolean>(false)
const setUpListLoading = ref<boolean>(false)
const merchandiseTypeList = ref<IGetMerchandiseTypeList[]>([])
const setUpList = ref<IGetMerchandiseList[]>([])
// 货代名称列表
const freightForwarderList = ref<IGetMerchandiseTypeList[]>([])
const _id = ref<number>(0)
const setUpBatch = ref<boolean>(false)
const setSelectedSetUpRows = (value: any) => {
  selectedSetUpRows.value = value
}
// 根据货物类别id 获取table
const handleGetTypeChannel = async () => {
  const { data } = await getMerchandiseTypeChannel({ typeId: modifyForm.typeId })
  modifyForm.list = data
}
// 货物类别的批量修改
const handleModifyBatchSetUp = async () => {
  if (selectedSetUpRows.value.length === 0) {
    $baseMessage('您未选中任何行!', 'warning')
    return
  }
  setUpModifyVisible.value = true
  setUpBatch.value = true
  const { data } = await getFreightForwarderQuery()
  freightForwarderList.value = data
  setUpModifyForm.channelId = ''
}
// 外面的批量修改
const handleConfirmModify = async () => {
  if (isBatch.value) {
    if (modifyForm.typeId) {
      const ids = selectedRows.value.map((item) => item.id).join(',')
      const { data } = await updateBatchSkuShippingChannelMerchandise({
        ids,
        merchandiseId: modifyForm.typeId
      })
      if (data) {
        $baseMessage('批量修改货物类别成功！', 'success')
        modifyVisible.value = false
        await fetchData()
      }
    } else {
      $baseMessage('请先选择货物名', 'error')
      return
    }
  } else {
    const { data } = await updateSkuShippingChannelMerchandise({
      id: _id.value,
      merchandiseId: modifyForm.typeId
    })
    if (data) {
      $baseMessage('修改货物类别成功！', 'success')
      modifyVisible.value = false
      await fetchData()
    }
  }
}

const handleConfirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addMerchandise({
        merchandiseName: addForm.merchandiseName
      })
      if (data) {
        $baseMessage('新增成功！', 'success')
        closeAddDialog()
        fetchSetUpData()
      }
    }
  })
}
const closeAddDialog = () => {
  addFormRef.value?.resetFields()
  addVisible.value = false
}
const handleModifySetUp = async (row: IGetMerchandiseList) => {
  setUpBatch.value = false
  setUpModifyVisible.value = true
  _id.value = row.id
  const { data } = await getFreightForwarderQuery()
  freightForwarderList.value = data
  const item = freightForwarderList.value.find((item) => item.label === row.channel)
  setUpModifyForm.channelId = item?.id || ''
}
const handleUpdateModifySetUp = async () => {
  if (setUpBatch.value) {
    const ids = selectedSetUpRows.value.map((item) => item.id).join(',')
    const { data } = await updateMerchandiseTypeBatch({ ids, channelId: setUpModifyForm.channelId })
    if (data) {
      $baseMessage('批量修改渠道成功！', 'success')
      setUpModifyVisible.value = false
      fetchSetUpData()
      await fetchData()
    }
  } else {
    const { data } = await updateMerchandise({
      id: _id.value,
      channelId: setUpModifyForm.channelId
    })
    if (data) {
      $baseMessage('修改渠道成功! ', 'success')
      setUpModifyVisible.value = false
      fetchSetUpData()
      await fetchData()
    }
  }
  
}
const handleShowAdd = async () => {
  addVisible.value = true
  const { data } = await getFreightForwarderQuery()
  freightForwarderList.value = data
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const handleShowCategorySetUp = () => {
  categorySetUpVisible.value = true
  fetchSetUpData()
}

const setSelectedRows = (value: any) => {
  selectedRows.value = value
}
const handleModify = async (row: IGetSkuShippingChannelList) => {
  modifyVisible.value = true
  const { data } = await getMerchandiseTypeList()
  merchandiseTypeList.value = data
  _id.value = row.id
  modifyForm.typeId = row.typeId
  modifyForm.list = row.siteMerchandiseList
  isBatch.value = false
}
const handleModifyAll = async () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'warning')
    return
  }
  modifyFormRef.value?.resetFields()
  modifyVisible.value = true
  const { data } = await getMerchandiseTypeList()
  merchandiseTypeList.value = data
  isBatch.value = true
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  router.push({
    query: {
      ...route.query,
      pageNo: value,
      pageSize: queryForm.pageSize
    }
  })
  fetchData()
}
const handleSetUpCurrentChange = (value: number) => {
  setUpQueryForm.pageNo = value
  fetchSetUpData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  router.push({
    query: {
      ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: value
    }
  })
  fetchData()
}
const handleSetUpSizeChange = (value: number) => {
  setUpQueryForm.pageSize = value
  setUpQueryForm.pageNo = 1
  fetchSetUpData()
}
const queryData = () => {
  queryForm.pageNo = 1
  router.push({
    query: {
     ...route.query,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize
    }
  })
  fetchData()
}
const setUpQueryData = () => {
  setUpQueryForm.pageNo = 1
  fetchSetUpData()
}
const clearPadding = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): string => {
  if (data.columnIndex === 1) {
    return 'clear-padding'
  }
  return ''
}
const option = ref<any[]>([])
let tem = 0
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getSkuShippingChannelList(queryForm)
  total.value = data.total
  list.value = data.list
  list.value.forEach((row: any) => {
    if (row.siteMerchandiseList.length > tem) {
      tem = row.siteMerchandiseList.length
      option.value = row.siteMerchandiseList
    }
    row.siteMerchandiseList.forEach((item: any) => {
      const key = item.siteName
      const value = item.channel
      row[`${key}`] = value
    })
  })
  listLoading.value = false
}
const fetchSetUpData = async () => {
  setUpListLoading.value = true
  const { data } = await getMerchandiseList(setUpQueryForm)
  setUpTotal.value = data.total
  setUpList.value = data.list
  setUpListLoading.value = false
}
onBeforeMount(() => {
  const { pageNo, pageSize } = route.query
  if (pageNo) {
    queryForm.pageNo = Number(pageNo)
  }
  if (pageSize) {
    queryForm.pageSize = Number(pageSize)
  }
  fetchData()
})
</script>

<style lang="scss" scoped>
.noneHoverTable {
  :deep() {
    .el-checkbox {
      transform: scale(1.3);
      transform-origin: center;
    }
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