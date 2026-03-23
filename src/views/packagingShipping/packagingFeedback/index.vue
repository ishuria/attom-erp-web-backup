<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyWord"
              clearable
              placeholder="搜索PO/SKU/品名/人员"
              style="width: 16em;"
              @input="handleSearch"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" native-type="submit" type="primary" @click="handleSearch" />
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="loading" border :data="tableData" stripe @sort-change="handleSortChange">
      <el-table-column label="反馈日期" prop="feedbackDate" sortable="custom" width="170">
        <template #default="{ row }">
          {{ row.feedbackDate ? formatDateTime(row.feedbackDate) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="反馈人员" prop="feedbackUserName" width="100" />
      <el-table-column label="PO" prop="po" width="120" />
      <el-table-column label="产品图片" width="90">
        <template #default="{ row }">
          <el-image v-if="row.skuImageUrl" fit="fill" :src="row.skuImageUrl" style="width: 60px; height: 60px" @click="imagePreviewShow(row.skuImageUrl)">
            <template #error>
              <el-icon />
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="SKU/品名" prop="sku" :width="Math.max(flexColumnWidth(tableData, 'SKU/品名', 'sku', 50), flexColumnWidth(tableData, 'SKU/品名', 'productName', 50))">
        <template #default="{ row }">
          {{ row.sku }}
          <br />
          {{ row.productName }}
        </template>
      </el-table-column>

      <el-table-column label="打包反馈内容" min-width="300">
        <template #default="{ row }">
          <div class="feedback-content-cell" @click="handleEditFeedbackContent(row)" v-html="row.feedbackContent" />
        </template>
      </el-table-column>

      <el-table-column label="讨论结果" min-width="250">
        <template #default="{ row }">
          <div class="discussion-cell" @click="handleEditDiscussion(row)">
            <div v-if="row.discussionResult" v-html="row.discussionResult" />
            <el-link v-else type="primary">点击编辑讨论结果</el-link>
          </div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="状态" width="120">
        <template #default="{ row }">
          <el-dropdown trigger="click" @command="(cmd: number) => handleStatusChange(row, cmd)">
            <el-tag style="cursor: pointer" :type="statusTagType(row.status)">
              {{ statusLabel(row.status) }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-tag>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="0">
                  <el-tag size="small" type="warning">待讨论</el-tag>
                </el-dropdown-item>
                <el-dropdown-item :command="1">
                  <el-tag size="small" type="primary">待执行</el-tag>
                </el-dropdown-item>
                <el-dropdown-item :command="2">
                  <el-tag size="small" type="success">已解决</el-tag>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

    <!-- 编辑打包反馈内容弹窗 -->
    <el-dialog
      v-model="feedbackContentDialogVisible"
      :before-close="handleCloseFeedbackContent"
      :close-on-click-modal="false"
      title="打包反馈内容"
      width="60%"
      @opened="handleFeedbackContentOpened"
    >
      <div v-if="feedbackContentDialogVisible" class="wang-editor-container">
        <toolbar :default-config="toolbarConfig" :editor="feedbackEditorRef" style="border-bottom: 1px solid var(--el-border-color)" />
        <editor
          v-model="feedbackContentHtml"
          class="wang-editor-content"
          :default-config="editorConfig"
          mode="default"
          @on-created="handleFeedbackEditorCreated"
        />
      </div>
      <template #footer>
        <el-button @click="handleCloseFeedbackContent">取消</el-button>
        <el-button :loading="feedbackContentLoading" type="primary" @click="handleSaveFeedbackContent">保存</el-button>
      </template>
    </el-dialog>

    <!-- 讨论结果编辑弹窗 -->
    <el-dialog
      v-model="discussionDialogVisible"
      :before-close="handleCloseDiscussion"
      :close-on-click-modal="false"
      title="编辑讨论结果"
      width="60%"
      @opened="handleDiscussionOpened"
    >
      <div v-if="discussionDialogVisible" class="wang-editor-container">
        <toolbar :default-config="toolbarConfig" :editor="discussionEditorRef" style="border-bottom: 1px solid var(--el-border-color)" />
        <editor
          v-model="discussionHtml"
          class="wang-editor-content"
          :default-config="editorConfig"
          mode="default"
          @on-created="handleDiscussionEditorCreated"
        />
      </div>
      <template #footer>
        <el-button @click="handleCloseDiscussion">取消</el-button>
        <el-button :loading="discussionLoading" type="primary" @click="handleSaveDiscussion">保存</el-button>
      </template>
    </el-dialog>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />

  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Search } from '@element-plus/icons-vue'
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { flexColumnWidth } from '~/src/utils/tableColum'
import {
  getPackageFeedbackList,
  updatePackageFeedbackContent,
  updatePackageFeedbackDiscussion,
  updatePackageFeedbackStatus,
} from '/@/api/devlocal/packagingShipping'
import type { IPackageFeedbackItem } from '/@/type/packagingShipping/packagingType'

defineOptions({
  name: 'PackagingFeedback',
})


const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewShow = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = []
  imagePreviewList.value.push(url)
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
// -------------------- 状态映射 --------------------
const STATUS_MAP: Record<number, { label: string; type: 'warning' | 'primary' | 'success' }> = {
  0: { label: '待讨论', type: 'warning' },
  1: { label: '待执行', type: 'primary' },
  2: { label: '已解决', type: 'success' },
}
const statusLabel = (s?: number) => STATUS_MAP[s ?? 0]?.label ?? '待讨论'
const statusTagType = (s?: number) => STATUS_MAP[s ?? 0]?.type ?? 'warning'

// -------------------- 列表查询 --------------------
const queryForm = reactive({
  keyWord: '',
  pageNo: 1,
  pageSize: 20,
  orderByField: '',
  orderDirection: '',
})
const loading = ref(false)
const tableData = ref<IPackageFeedbackItem[]>([])
const total = ref(0)

const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await getPackageFeedbackList(queryForm)
    if (data) {
      tableData.value = data.list || []
      total.value = data.total || 0
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleCurrentChange = (page: number) => {
  queryForm.pageNo = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  queryForm.pageSize = size
  queryForm.pageNo = 1
  fetchData()
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  queryForm.orderByField = prop || ''
  queryForm.orderDirection = order || ''
  fetchData()
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

// -------------------- 状态修改 --------------------
const handleStatusChange = async (row: IPackageFeedbackItem, status: number) => {
  if (!row.id || row.status === status) return
  const { data } = await updatePackageFeedbackStatus({ id: row.id, status })
  if (data) {
    row.status = status
    $baseMessage('状态更新成功', 'success', 'hey')
  }
}

// -------------------- 共用 wangEditor 配置 --------------------
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'codeBlock'],
}

const editorConfig = reactive<any>({
  placeholder: '请输入内容...',
  readOnly: false,
  MENU_CONF: {
    uploadImage: {
      allowedFileTypes: ['image/*'],
      maxFileSize: 2 * 1024 * 1024,
      async customUpload(file: File, insertFn: (url: string, alt?: string, href?: string) => void) {
        try {
          const { uploadEditorImage } = await import('/@/api/devlocal/progress')
          const formData = new FormData()
          formData.append('file', file)
          const { data } = await uploadEditorImage(formData)
          const imageUrl = data?.url ?? (typeof data === 'string' ? data : '')
          if (!imageUrl) throw new Error('上传失败')
          insertFn(imageUrl, file.name, imageUrl)
        } catch (error: any) {
          $baseMessage(error?.message || '图片上传失败', 'error', 'hey')
        }
      },
    },
  },
})

// -------------------- 打包反馈内容 编辑 --------------------
const feedbackContentDialogVisible = ref(false)
const feedbackContentHtml = ref('')
const feedbackContentLoading = ref(false)
const feedbackEditorRef = shallowRef<IDomEditor | undefined>()
const currentFeedbackRow = ref<IPackageFeedbackItem | null>(null)

const handleEditFeedbackContent = (row: IPackageFeedbackItem) => {
  currentFeedbackRow.value = row
  feedbackContentHtml.value = row.feedbackContent || ''
  feedbackContentDialogVisible.value = true
}

const handleFeedbackEditorCreated = (editor: IDomEditor) => {
  feedbackEditorRef.value = Object.seal(editor)
}

const handleFeedbackContentOpened = async () => {
  await nextTick()
  if (feedbackEditorRef.value && feedbackContentHtml.value) {
    feedbackEditorRef.value.setHtml(feedbackContentHtml.value)
  }
  feedbackEditorRef.value?.focus()
}

const handleSaveFeedbackContent = async () => {
  if (!currentFeedbackRow.value?.id || !feedbackEditorRef.value) return
  feedbackContentLoading.value = true
  try {
    const content = feedbackEditorRef.value.getHtml()
    const { data } = await updatePackageFeedbackContent({
      id: currentFeedbackRow.value.id,
      feedbackContent: content,
    })
    if (data) {
      $baseMessage('反馈内容保存成功', 'success', 'hey')
      currentFeedbackRow.value.feedbackContent = content
      handleCloseFeedbackContent()
    }
  } finally {
    feedbackContentLoading.value = false
  }
}

const handleCloseFeedbackContent = () => {
  feedbackContentDialogVisible.value = false
  feedbackContentHtml.value = ''
}

// -------------------- 讨论结果 编辑 --------------------
const discussionDialogVisible = ref(false)
const discussionHtml = ref('')
const discussionLoading = ref(false)
const discussionEditorRef = shallowRef<IDomEditor | undefined>()
const currentDiscussionRow = ref<IPackageFeedbackItem | null>(null)

const handleEditDiscussion = (row: IPackageFeedbackItem) => {
  currentDiscussionRow.value = row
  discussionHtml.value = row.discussionResult || ''
  discussionDialogVisible.value = true
}

const handleDiscussionEditorCreated = (editor: IDomEditor) => {
  discussionEditorRef.value = Object.seal(editor)
}

const handleDiscussionOpened = async () => {
  await nextTick()
  if (discussionEditorRef.value && discussionHtml.value) {
    discussionEditorRef.value.setHtml(discussionHtml.value)
  }
  discussionEditorRef.value?.focus()
}

const handleSaveDiscussion = async () => {
  if (!currentDiscussionRow.value?.id || !discussionEditorRef.value) return
  discussionLoading.value = true
  try {
    const content = discussionEditorRef.value.getHtml()
    const { data } = await updatePackageFeedbackDiscussion({
      id: currentDiscussionRow.value.id,
      discussionResult: content,
    })
    if (data) {
      $baseMessage('讨论结果保存成功', 'success', 'hey')
      currentDiscussionRow.value.discussionResult = content
      handleCloseDiscussion()
    }
  } finally {
    discussionLoading.value = false
  }
}

const handleCloseDiscussion = () => {
  discussionDialogVisible.value = false
  discussionHtml.value = ''
}

onBeforeUnmount(() => {
  feedbackEditorRef.value?.destroy()
  discussionEditorRef.value?.destroy()
})

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.feedback-content-cell {
  max-height: 100px;
  overflow: hidden;
  cursor: pointer;

  :deep(img) {
    max-width: 100%;
    max-height: 80px;
  }
}

.discussion-cell {
  cursor: pointer;
  min-height: 30px;

  :deep(img) {
    max-width: 100%;
    max-height: 80px;
  }
}

.wang-editor-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;

  .wang-editor-content {
    height: 350px;
    overflow-y: auto;
  }
}
</style>
