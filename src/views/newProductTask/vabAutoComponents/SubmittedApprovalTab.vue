<template>
  <div class="tabs-content">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyword"
              class="search-input"
              clearable
              placeholder="请输入搜索关键词"
              @input="handleSearch"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" type="primary" @click="handleSearch" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table v-loading="loading" border :cell-class-name="clearPadding" :data="list" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column label="图片" prop="skuImgUrl" width="75">
        <template #default="{ row }">
          <el-image
            v-if="row.skuImgUrl"
            :lazy="true"
            :src="row.skuImgUrl"
            style="display: block; width: 75px; height: 75px"
            @click="handlePreviewImage(row.skuImgUrl)"
          >
            <template #error><el-icon /></template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="SKU"
        prop="sku"
        :width="Math.max(flexColumnWidth(list, 'SKU', 'sku'), flexColumnWidth(list, 'SKU', 'productDesc'))"
      >
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.productDesc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务类型" min-width="110" prop="taskType">
        <template #default="{ row }">
          <el-tag :type="getTaskTypeColor(row.taskType)">{{ row.taskType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品定位" min-width="100" prop="positioning" />
      <el-table-column align="center" label="要求完成日期" min-width="125" prop="finishDate">
        <template #default="{ row }">
          {{ row.finishDate ? formatDate(new Date(row.finishDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际完成日期" min-width="125" prop="actualFinishDate">
        <template #default="{ row }">
          {{ row.actualFinishDate ? formatDate(new Date(row.actualFinishDate)) : '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="运营"
        min-width="100"
        prop="operation"
        :width="calculateBrColumnWidth(list, (row: any) => row.operation, 100, 30)"
      >
        <template #default="{ row }">
          <span
            v-for="(username, index) in splitUsernames(row.operation)"
            :key="index"
            class="username-item"
            :class="getHighlightClass(username)"
          >
            {{ username }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="运营校对" min-width="100" prop="proofreadingStatus">
        <template #default="{ row }">
          <el-checkbox
            v-if="ableCheck && row.operation.includes(userName)"
            v-model="row.proofreadingStatus"
            :false-value="0"
            :true-value="1"
            @change="handleUpdateProofreadingStatus(row)"
          />
          <vab-icon
            v-else-if="row.proofreadingStatus === 1"
            icon="checkbox-circle-fill"
            style="color: var(--el-color-success); font-size: 23px"
          />
          {{ '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提交人员" min-width="100" prop="artDesignName" />
      <el-table-column align="center" label="审批人" min-width="100" prop="approvalUserName" />
      <el-table-column label="提交的文件路径" min-width="160" prop="filePath">
        <template #default="{ row }">
          <el-tooltip v-if="row.filePath" effect="dark" placement="top">
            <template #content>
              <div class="custom-tooltip">{{ row.filePath }}</div>
            </template>
            <div class="multi-line-ellipsis-1">{{ row.filePath }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="整改要求" min-width="160" prop="correctionRequirement">
        <template #default="{ row }">
          <div v-if="row.correctionRequirement" class="correction-preview" @click="handleViewCorrection(row)">
            {{ stripHtml(row.correctionRequirement) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="计入返工数" min-width="120" prop="countAsRework">
        <template #default="{ row }">
          <el-checkbox
            v-if="canEditRework"
            v-model="row.countAsRework"
            :false-value="0"
            :true-value="1"
            @change="handleUpdateRework(row)"
          />
          <el-tag v-else size="small" :type="row.countAsRework === 1 ? 'danger' : 'success'">
            {{ row.countAsRework === 1 ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提交时间" min-width="160" prop="createTime">
        <template #default="{ row }">
          {{ row.createTime ? formatDate(new Date(row.createTime)) : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="100" prop="approvalStatus">
        <template #default="{ row }">
          <el-tag v-if="row.approvalStatus === 2" type="danger">审批不通过</el-tag>
          <el-tag v-else-if="row.approvalStatus === 0" type="warning">待审批</el-tag>
          <el-tag v-else-if="row.status === 2" type="success">已完成</el-tag>
          <el-tag v-else-if="row.approvalStatus === 1" type="primary">审批通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <div style="display: flex; justify-content: center; gap: 16px">
            <template v-if="row.approvalStatus === 0 && row.approvalUserName === userName">
              <el-link type="success" underline="never" @click="handlePass(row)">通过</el-link>
              <el-link type="danger" underline="never" @click="handleReject(row)">不通过</el-link>
            </template>
            <el-link
              v-if="hasPermission({ permission: [ListingPermission.LISTING_TASK_FINISH] }) && row.approvalStatus === 1 && row.status !== 2"
              type="success"
              underline="never"
              @click="handleFinish(row)"
            >
              完成
            </el-link>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- 查看整改要求弹窗 -->
    <!-- <vab-dialog v-model="correctionVisible" title="整改要求" width="50%">
      <div class="correction-detail" v-html="correctionContent"></div>
    </vab-dialog> -->

    <vab-dialog v-model="correctionVisible" title="整改要求" width="50%">
      <wang-editor-viewer class="correction-detail" :content="correctionContent" />
    </vab-dialog>

    <!-- 审批不通过弹窗 -->
    <reject-approval v-model:visible="rejectVisible" :row="rejectRow" @confirm="handleRejectConfirm" />

    <!-- 图片预览 -->
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { getTaskTypeColor, splitUsernames } from '../constantOption'
import {
  approveArtDesignTask,
  finishArtDesignTask,
  getArtDesignTaskApprovalPage,
  updateArtDesignTaskApprovalRework,
  updateProofreadingStatus,
} from '/@/api/devlocal/imageTask'
import { ROLE_BOSS_CODE, ROLE_ECOMMERCEOPERATIONLEAD_CODE, ROLE_ECOMMERCEOPERATOR_CODE, ROLE_GRAPHICDESIGNLEAD_CODE } from '/@/const/role'
import ListingPermission from '/@/permissions/listing'
import { useAclStore } from '/@/store/modules/acl'
import { useUserStore } from '/@/store/modules/user'
import type { IArtDesignTaskApprovalPageItem } from '/@/type/listingTask/imageTaskType'
import { formatDate } from '/@/utils/dateUtils'
import { hasPermission } from '/@/utils/permission'
import { calculateBrColumnWidth, flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'SubmittedApprovalTab',
})

// 角色判断：BOSS 和平面设计主管可修改返工数
const currentRoleCode = useAclStore().getRole[0]
const canEditRework = currentRoleCode === ROLE_BOSS_CODE || currentRoleCode === ROLE_GRAPHICDESIGNLEAD_CODE
const ableCheck = currentRoleCode === ROLE_ECOMMERCEOPERATIONLEAD_CODE || currentRoleCode === ROLE_ECOMMERCEOPERATOR_CODE

const useUser = useUserStore()
const userName = useUser.getUsername
const currentUser = useUser.getUsername
const getHighlightClass = (username: string) => {
  return username === currentUser ? 'highlight' : ''
}
// 查询表单
const queryForm = reactive({
  keyword: '',
  pageNo: 1,
  pageSize: 50,
})
const loading = ref<boolean>(false)
const list = ref<IArtDesignTaskApprovalPageItem[]>([])
const total = ref<number>(0)

// 数据加载
const fetchData = async () => {
  try {
    loading.value = true
    const { data } = await getArtDesignTaskApprovalPage(queryForm)
    total.value = data.total
    list.value = data.list
  } catch (error) {
    console.error('获取审批数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
let debounceTimer: ReturnType<typeof setTimeout> | undefined
const handleSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    queryForm.pageNo = 1
    fetchData()
  }, 300)
}

// 分页
const handlePageChange = (page: number) => {
  queryForm.pageNo = page
  fetchData()
}
const handleSizeChange = (size: number) => {
  queryForm.pageSize = size
  queryForm.pageNo = 1
  fetchData()
}

// 通过
const handlePass = async (row: IArtDesignTaskApprovalPageItem) => {
  $baseConfirm('确定要审批通过该任务吗？', null, async () => {
    try {
      const { data } = await approveArtDesignTask({
        id: row.id,
        approvalStatus: 1,
      })
      if (data) {
        $baseMessage('审批通过成功！', 'success')
        fetchData()
      }
    } catch (error) {
      console.error('审批通过失败:', error)
    }
  })
}

// 不通过
const rejectVisible = ref<boolean>(false)
const rejectRow = ref<IArtDesignTaskApprovalPageItem | null>(null)
const handleReject = (row: IArtDesignTaskApprovalPageItem) => {
  rejectRow.value = row
  rejectVisible.value = true
}
const handleRejectConfirm = async (correctionRequirement: string) => {
  if (!rejectRow.value) return
  try {
    const { data } = await approveArtDesignTask({
      id: rejectRow.value.id,
      approvalStatus: 2,
      correctionRequirement,
    })
    if (data) {
      $baseMessage('审批不通过已提交！', 'success')
      rejectVisible.value = false
      fetchData()
    }
  } catch (error) {
    console.error('审批不通过提交失败:', error)
  }
}
const handleUpdateProofreadingStatus = async (row: IArtDesignTaskApprovalPageItem) => {
  const { data } = await updateProofreadingStatus({
    id: row.artDesignTaskId,
    value: row.proofreadingStatus,
  })
  if (data && row.proofreadingStatus === 1) {
    fetchData()
  }
}
// 查看整改要求
const stripHtml = (html: string) => {
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
  return text.length > 50 ? text.slice(0, 50) + '...' : text
}
const correctionVisible = ref(false)
const correctionContent = ref('')
const handleViewCorrection = (row: IArtDesignTaskApprovalPageItem) => {
  correctionContent.value = row.correctionRequirement || ''
  correctionVisible.value = true
}
// 完成
const handleFinish = async (row: IArtDesignTaskApprovalPageItem) => {
  $baseConfirm('确定要完成美工任务吗？', null, async () => {
    try {
      const { data } = await finishArtDesignTask({ id: row.artDesignTaskId })
      if (data) {
        $baseMessage('完成成功！', 'success')
        fetchData()
      }
    } catch (error) {
      console.error('完成任务失败:', error)
    }
  })
}

// 修改返工数
const handleUpdateRework = async (row: IArtDesignTaskApprovalPageItem) => {
  try {
    const { data } = await updateArtDesignTaskApprovalRework({
      id: row.id,
      countAsRework: row.countAsRework,
    })
    if (data) {
      $baseMessage('更新成功！', 'success')
    }
  } catch (error) {
    // 回滚
    row.countAsRework = row.countAsRework === 1 ? 0 : 1
    console.error('更新返工数失败:', error)
  }
}

// 图片预览
const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const handlePreviewImage = (url: string) => {
  const processedUrl = url.replace('_SL75_', '')
  imagePreviewList.value = [processedUrl]
  imagePreviewVisible.value = true
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): string => {
  if (data.column.label === '图片') {
    return 'clear-padding'
  }
  return ''
}
// 暴露给父组件
defineExpose({
  fetchData,
})

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.tabs-content {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep() {
    .vab-query-form {
      .left-panel {
        margin-bottom: 5px;
      }
      .el-form {
        .el-form-item:first-child {
          margin-bottom: 5px !important;

          .el-check-tag,
          .el-form-item__label {
            margin: 0 10px 5px 0;
            border-radius: 99px;
          }
        }

        .el-form-item:last-child {
          margin-bottom: 5px !important;
        }
      }
    }

    .el-table {
      flex: 1;
      .el-checkbox {
        transform: scale(1.3);
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
}

.correction-preview {
  cursor: pointer;
  color: var(--el-color-primary);
  &:hover {
    text-decoration: underline;
  }
}
.correction-detail {
  max-height: 1000px;
  overflow-y: auto;
  padding: 10px;
  :deep(img) {
    max-width: 100%;
  }
}
</style>
