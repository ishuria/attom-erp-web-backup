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
          <el-image :src="row.skuImgUrl" style="width: 100%; height: 100%; display: block;" @click="imagePreviewShow(row.skuImgUrl)">
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
      <el-table-column label="亚马逊美国" prop="amazonUsChannelName" :width="flexColumnWidth(list, '亚马逊美国', 'amazonUsChannelName')"/>
      <el-table-column label="亚马逊加拿大" prop="amazonCaChannelName" :width="flexColumnWidth(list, '亚马逊加拿大', 'amazonCaChannelName')"/>
      <el-table-column label="亚马逊德国" prop="amazonDeChannelName" :width="flexColumnWidth(list, '亚马逊德国', 'amazonDeChannelName')"/>
      <el-table-column label="亚马逊英国" prop="amazonUkChannelName" :width="flexColumnWidth(list, '亚马逊英国', 'amazonUkChannelName')"/>
      <el-table-column label="亚马逊日本" prop="amazonJapanChannelName" :width="flexColumnWidth(list, '亚马逊日本', 'amazonJapanChannelName')"/>
      <el-table-column label="沃尔玛美国" prop="walmartUsChannelName" :width="flexColumnWidth(list, '沃尔玛美国', 'walmartUsChannelName')"/>
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
      title="修改运输渠道"
      width="20%"
    >
      <el-form ref="modifyFormRef" label-position="top" :model="modifyForm">
        <el-form-item label="货物" prop="typeId">
          <el-select v-model="modifyForm.typeId" placeholder="请选择货物名" @change="handleGetChannel">
            <el-option 
              v-for="item in merchandiseTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊美国" prop="amazonUsChannelName">
          <el-input v-model="modifyForm.amazonUsChannelName" disabled />
        </el-form-item>
        <el-form-item label="亚马逊加拿大" prop="amazonCaChannelName">
          <el-input v-model="modifyForm.amazonCaChannelName" disabled />
        </el-form-item>
        <el-form-item label="亚马逊德国" prop="amazonDeChannelName">
          <el-input v-model="modifyForm.amazonDeChannelName" disabled />
        </el-form-item>
        <el-form-item label="亚马逊英国" prop="amazonUkChannelName">
          <el-input v-model="modifyForm.amazonUkChannelName" disabled />
        </el-form-item>
        <el-form-item label="亚马逊日本" prop="amazonJapanChannelName">
          <el-input v-model="modifyForm.amazonJapanChannelName" disabled />
        </el-form-item>
        <el-form-item label="沃尔玛美国" prop="walmartUsChannelName">
          <el-input v-model="modifyForm.walmartUsChannelName" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modifyVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmModify">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 货物类别 -->
    <vab-dialog
      v-model="categorySetUpVisible"
      title="货物类别设定"
      width="60%"
    >
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="handleShowAdd">新增</el-button>
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
      <el-table border :data="setUpList" stripe>
        <el-table-column label="货物" min-width="" prop="merchandiseName"/>
        <el-table-column label="亚马逊美国" min-width="" prop="amazonUsChannelName"/>
        <el-table-column label="亚马逊加拿大" min-width="" prop="amazonCaChannelName"/>
        <el-table-column label="亚马逊德国" min-width="" prop="amazonDeChannelName"/>
        <el-table-column label="亚马逊英国" min-width="" prop="amazonUkChannelName"/>
        <el-table-column label="亚马逊日本" min-width="" prop="amazonJapanChannelName"/>
        <el-table-column label="沃尔玛美国" min-width="" prop="walmartUsChannelName"/>
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
      title="新增货物"
      width="20%"
      @close="closeAddDialog"
    >
      <el-form ref="addFormRef" label-position="top" :model="addForm" :rules="addFormRules">
        <el-form-item label="货物名" prop="merchandiseName">
          <el-input v-model="addForm.merchandiseName" />
        </el-form-item>
        <el-form-item label="亚马逊美国" prop="amazonUsChannelId">
          <el-select v-model="addForm.amazonUsChannelId" filterable placeholder="请选择亚马逊美国渠道">
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊加拿大" prop="amazonCaChannelId" >
          <el-select v-model="addForm.amazonCaChannelId" filterable placeholder="请选择亚马逊加拿大渠道">
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊德国" prop="amazonDeChannelId" >
          <el-select v-model="addForm.amazonDeChannelId" filterable placeholder="请选择亚马逊德国渠道">
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊英国" prop="amazonUkChannelId" >
          <el-select v-model="addForm.amazonUkChannelId" filterable placeholder="请选择亚马逊英国渠道">
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊日本" prop="amazonJapanChannelId" >
          <el-select v-model="addForm.amazonJapanChannelId" filterable placeholder="请选择亚马逊日本渠道">
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="沃尔玛美国" prop="walmartUsChannelId" >
          <el-select v-model="addForm.walmartUsChannelId" filterable placeholder="请选择沃尔玛美国渠道">
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
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
      title="修改货物类别"
      width="20%"
    >
      <el-form label-position="top" :model="setUpModifyForm">
        <el-form-item label="亚马逊美国">
          <el-select v-model="setUpModifyForm.amazonUsChannelId" filterable>
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊加拿大">
          <el-select v-model="setUpModifyForm.amazonCaChannelId" filterable>
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊德国">
          <el-select v-model="setUpModifyForm.amazonDeChannelId" filterable>
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊英国">
          <el-select v-model="setUpModifyForm.amazonUkChannelId" filterable>
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="亚马逊日本">
          <el-select v-model="setUpModifyForm.amazonJapanChannelId" filterable>
            <el-option v-for="item in freightForwarderList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="沃尔玛美国">
          <el-select v-model="setUpModifyForm.walmartUsChannelId" filterable>
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
import { addMerchandise, getFreightForwarderQuery, getMerchandiseChannelDetail, getMerchandiseDetail, getMerchandiseList, getMerchandiseTypeList, getSkuShippingChannelList, updateBatchSkuShippingChannelMerchandise, updateMerchandise, updateSkuShippingChannelMerchandise } from '/@/api/devlocal/productInformation'
import type { IGetMerchandiseList, IGetMerchandiseListReq, IGetMerchandiseTypeList, IGetSkuShippingChannelList } from '/@/type/productInformation/channelType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'Channel'
})
const setUpModifyVisible = ref<boolean>(false)
const addVisible = ref<boolean>(false)
const categorySetUpVisible = ref<boolean>(false)
const selectedRows = ref<any[]>([])
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
  amazonUsChannelId: [{ required: true, message: '请选择亚马逊美国渠道', trigger: 'change' }],
  amazonCaChannelId: [{ required: true, message: '请选择亚马逊加拿大渠道', trigger: 'change' }],
  amazonDeChannelId: [{ required: true, message: '请选择亚马逊德国渠道', trigger: 'change' }],
  amazonUkChannelId: [{ required: true, message: '请选择亚马逊英国渠道', trigger: 'change' }],
  amazonJapanChannelId: [{ required: true, message: '请选择亚马逊日本渠道', trigger: 'change' }],
  walmartUsChannelId: [{ required: true, message: '请选择沃尔玛美国渠道', trigger: 'change' }],
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
        fetchData()
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
      fetchData()
    }
  }
}
const handleGetChannel = async () => {
  const { data } = await getMerchandiseChannelDetail({
    typeId: modifyForm.typeId
  })
  modifyForm.amazonUsChannelName = data.amazonUsChannelName
  modifyForm.amazonCaChannelName = data.amazonCaChannelName
  modifyForm.amazonDeChannelName = data.amazonDeChannelName
  modifyForm.amazonUkChannelName = data.amazonUkChannelName
  modifyForm.amazonJapanChannelName = data.amazonJapanChannelName
  modifyForm.walmartUsChannelName = data.walmartUsChannelName
}
const handleConfirmAdd = async () => {
  addFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await addMerchandise(addForm)
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
  setUpModifyVisible.value = true
  _id.value = row.id
  const { data } = await getFreightForwarderQuery()
  freightForwarderList.value = data
  const { data: idData } = await getMerchandiseDetail({
    id: row.id
  })
  setUpModifyForm.amazonUsChannelId = idData.amazonUsChannelId
  setUpModifyForm.amazonCaChannelId = idData.amazonCaChannelId
  setUpModifyForm.amazonDeChannelId = idData.amazonDeChannelId
  setUpModifyForm.amazonUkChannelId = idData.amazonUkChannelId
  setUpModifyForm.amazonJapanChannelId = idData.amazonJapanChannelId
  setUpModifyForm.walmartUsChannelId = idData.walmartUsChannelId
}
const handleUpdateModifySetUp = async () => {
  const { data } = await updateMerchandise({
    id: _id.value,
    ...setUpModifyForm
  })
  if (data) {
    $baseMessage('修改货物类别成功! ', 'success')
    setUpModifyVisible.value = false
    fetchSetUpData()
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
  modifyForm.amazonUsChannelName = row.amazonUsChannelName
  modifyForm.amazonCaChannelName = row.amazonCaChannelName
  modifyForm.amazonDeChannelName = row.amazonDeChannelName
  modifyForm.amazonUkChannelName = row.amazonUkChannelName
  modifyForm.amazonJapanChannelName = row.amazonJapanChannelName
  modifyForm.walmartUsChannelName = row.walmartUsChannelName
  isBatch.value = false
}
const handleModifyAll = async () => {
  if (selectedRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
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
  fetchData()
}
const handleSetUpCurrentChange = (value: number) => {
  setUpQueryForm.pageNo = value
  fetchSetUpData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchData()
}
const handleSetUpSizeChange = (value: number) => {
  setUpQueryForm.pageSize = value
  setUpQueryForm.pageNo = 1
  fetchSetUpData()
}
const queryData = () => {
  queryForm.pageNo = 1
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
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getSkuShippingChannelList(queryForm)
  total.value = data.total
  list.value = data.list
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
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
</style>