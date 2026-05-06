<template>
  <div class="ai-prompt-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button v-if="currentRoleCode === ROLE_BOSS_CODE" :icon="Plus" type="primary" @click="handleEdit(null)">新增</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item label="人员">
            <el-select v-model="queryForm.userId" clearable filterable placeholder="请选择人员" @change="queryData">
              <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="currentRoleCode === ROLE_BOSS_CODE" label="角色">
            <el-select v-model="queryForm.roleId" clearable filterable placeholder="请选择角色" @change="queryData">
              <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId" />
            </el-select>
          </el-form-item>
          <el-form-item label="提示词功能">
            <el-input
              v-model.trim="queryForm.functionName"
              clearable
              placeholder="请输入提示词功能"
              @input="debouncedQueryData"
              @keyup.enter="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData">查询</el-button>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableRef"
      v-loading="listLoading"
      border
      :data="list"
      :row-class-name="rowClassName"
      :span-method="objectSpanMethod"
      stripe
      @cell-click="cellClick"
    >
      <el-table-column align="center" class-name="col-role" label="角色" prop="roleName" show-overflow-tooltip width="120" />
      <el-table-column align="center" class-name="col-user" label="人员" prop="userName" show-overflow-tooltip width="120" />
      <el-table-column align="left" label="提示词功能" prop="functionName" width="250">
        <template #default="{ row }">
          <div class="multi-line-ellipsis-1">{{ row.functionName }}</div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="提示词" min-width="300" prop="prompt">
        <template #default="{ row }">
          <div class="prompt-cell">
            <el-tag v-if="row.currentVersionNo != null" class="draft-tag" size="small" type="success">v{{ row.currentVersionNo }}</el-tag>
            <div class="multi-line-ellipsis-1 prompt-text">{{ row.prompt }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-button text type="primary" @click="handleShowHistoryList(row)">历史</el-button>

          <el-button text type="primary" @click="handleEdit(row)">修改</el-button>
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

    <!-- 新增对话框 -->
    <el-dialog v-model="addDialogVisible" title="新增提示词" width="80%" @close="handleAddDialogClose">
      <el-form ref="addFormRef" label-width="120px" :model="addFormData" :rules="addFormRules">
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="addFormData.roleId" clearable filterable placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId" />
          </el-select>
        </el-form-item>

        <el-form-item label="提示词功能" prop="functionName">
          <el-input v-model.trim="addFormData.functionName" clearable placeholder="请输入提示词功能" />
        </el-form-item>

        <el-form-item label="提示词" prop="prompt">
          <div class="md-editor-container no-background-container">
            <v-md-editor v-model="addFormData.prompt" height="400px" />
          </div>
        </el-form-item>

        <el-form-item label="FlowID" prop="flowId">
          <el-input v-model.trim="addFormData.flowId" clearable placeholder="请输入FlowID" />
        </el-form-item>

        <el-form-item label="ComponentID" prop="componentId">
          <el-input v-model.trim="addFormData.componentId" clearable placeholder="请输入ComponentID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleAddSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑提示词弹窗组件 -->
    <prompt-editor-dialog
      ref="editorDialogRef"
      v-model="editorDialogVisible"
      :current-row="currentEditRow"
      :role-list="roleList"
      @save="handleSavePrompt"
      @save-to-new-version="handleSaveToNewVersion"
    />

    <!-- 历史版本抽屉 -->
    <el-drawer v-model="historyDrawerVisible" size="800px" title="历史版本" @close="historyList = []">
      <el-alert
        v-if="historyCurrentVersionNo == null"
        :closable="false"
        show-icon
        title="当前提示词未保存版本，可保存为新版本以便回滚到任意历史版本"
        type="warning"
      />
      <el-table v-loading="historyLoading" border :data="historyList" :header-cell-style="{ textAlign: 'center' }">
        <el-table-column align="center" label="版本" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.versionNo === historyCurrentVersionNo ? 'success' : 'info'">
              v{{ row.versionNo }}
              <span v-if="row.versionNo === historyCurrentVersionNo">（当前）</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="保存时间" min-width="170" prop="createTime" />
        <el-table-column label="备注" min-width="180" prop="remark" show-overflow-tooltip>
          <template #default="{ row }">{{ row.remark || '—' }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="200">
          <template #default="{ row }">
            <el-button text type="primary" @click="handlePreviewHistory(row)">预览</el-button>
            <el-popconfirm :title="`确认回滚到 v${row.versionNo} 吗？`" @confirm="handleRollback(row)">
              <template #reference>
                <el-button text type="success">回滚</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm title="确认删除该版本吗？" @confirm="handleDeleteHistory(row)">
              <template #reference>
                <el-button text type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty class="vab-data-empty" description="暂无数据" />
        </template>
      </el-table>
    </el-drawer>

    <!-- 历史版本预览弹窗 -->
    <el-dialog v-model="previewDialogVisible" title="提示词预览" width="60%">
      <pre class="history-preview-content">{{ previewPrompt }}</pre>
      <template #footer></template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import type { FormInstance, FormRules } from 'element-plus'
import { debounce } from 'lodash-es'
import {
  addAiPrompt,
  deletePromptConfigHistory,
  getAiPromptList,
  getPromptConfigHistory,
  rollbackPromptConfig,
  savePromptConfigVersion,
  updateUserPrompt,
} from '/@/api/devlocal/aiPrompt'
import { getAllList } from '/@/api/devlocal/role'
import { getPersonLevelDropdownList } from '/@/api/devlocal/user'
import { ROLE_BOSS_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import { IRoleRes } from '/@/type/role/roleType'

// 初始化 v-md-editor
VMdEditor.use(githubTheme)

defineOptions({
  name: 'AI',
})

const tableRef = ref<any>()
const addFormRef = ref<FormInstance>()
const editorDialogRef = ref<any>()
const list = ref<any[]>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const addDialogVisible = ref<boolean>(false)
const editorDialogVisible = ref<boolean>(false)
const submitLoading = ref<boolean>(false)
const userList = ref<any[]>([])
const currentRoleCode = useAclStore().getRole[0]

// 当前编辑的行数据
const currentEditRow = ref<any>(null)

// 当前点击的"人员组" key（roleId + userId），用于行高亮
const currentRowKey = ref<string>('')
const getRowKey = (row: any) => `${row.roleId}_${row.userId}_${row.id}`

// 历史版本
const historyDrawerVisible = ref<boolean>(false)
const historyLoading = ref<boolean>(false)
const historyList = ref<any[]>([])
const historyCurrentRow = ref<any>(null)
// 抽屉里"当前生效版本号"指针，回滚/保存版本后本地同步，避免依赖外层列表刷新
const historyCurrentVersionNo = ref<number | null>(null)

// 预览
const previewDialogVisible = ref<boolean>(false)
const previewPrompt = ref<string>('')

const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  userId: null,
  roleId: null,
  functionName: '',
})

// 新增表单数据
const addFormData = reactive<any>({
  roleId: null,
  functionName: '',
  prompt: '',
  flowId: '',
  componentId: '',
})

const addFormRules = reactive<FormRules>({
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
  functionName: [{ required: true, message: '请输入提示词功能', trigger: 'blur' }],
  prompt: [{ required: true, message: '请输入提示词内容', trigger: 'blur' }],
  flowId: [{ required: true, message: '请输入FlowID', trigger: 'blur' }],
  componentId: [{ required: true, message: '请输入ComponentID', trigger: 'blur' }],
})

// 防抖查询
const debouncedQueryData = debounce(() => {
  queryData()
}, 500)

// 获取用户列表
const fetchUserList = async () => {
  try {
    const { data } = await getPersonLevelDropdownList()
    // 将接口返回的 { id, label } 格式映射到 { userId, userName } 格式
    userList.value =
      data?.map((item: any) => ({
        userId: item.id,
        userName: item.label,
      })) || []
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 获取列表数据
const fetchData = async () => {
  try {
    listLoading.value = true
    const { data } = await getAiPromptList({
      userId: queryForm.userId,
      roleId: queryForm.roleId,
      functionName: queryForm.functionName,
      pageNo: queryForm.pageNo,
      pageSize: queryForm.pageSize,
    })
    if (data) {
      list.value = data.list || []
      total.value = data.total || 0
    }
  } catch (error) {
    console.error('获取列表失败:', error)
  } finally {
    listLoading.value = false
  }
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  let rowspan = 1 // 默认不跨行
  const label = column.label
  if (label === '角色') {
    const id = row.roleId

    // 遍历后面的行，检查相同的 PO ID
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].roleId === id) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || list.value[rowIndex - 1].roleId !== id ? { rowspan, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }

  // 合并 SKU 行
  if (label === '人员') {
    const userId = row.userId

    // 遍历后面的行，检查相同的 SKU ID
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      if (list.value[i].userId === userId && list.value[i].roleId === row.roleId) {
        rowspan++
      } else {
        break
      }
    }

    // 如果是第一次出现的行，则返回 rowspan，否则隐藏行
    return rowIndex === 0 || list.value[rowIndex - 1].userId !== userId || list.value[rowIndex - 1].roleId !== row.roleId
      ? { rowspan, colspan: 1 }
      : { rowspan: 0, colspan: 0 }
  }

  // 对于其他列，默认返回不合并
  return { rowspan: 1, colspan: 1 }
}
// 查询
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

// 重置查询表单
const resetQueryForm = () => {
  queryForm.pageNo = 1
  queryForm.userId = null
  queryForm.roleId = null
  queryForm.functionName = ''
  fetchData()
}

// 分页切换
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  queryForm.pageNo = 1
  fetchData()
}

// 打开编辑对话框
const handleEdit = (row: any) => {
  if (row) {
    // 编辑模式：打开编辑弹窗
    currentEditRow.value = row
    editorDialogVisible.value = true
  } else {
    // 新增模式：打开新增对话框
    addDialogVisible.value = true
  }
}
const cellClick = (row: any, column: any, cell: HTMLTableCellElement) => {
  // 点击任意单元格都更新高亮 key（合并的角色 cell 点击时，row 是该角色组首行 → 高亮该组首位人员）
  currentRowKey.value = getRowKey(row)
  if (column.label === '提示词') {
    currentEditRow.value = row
    editorDialogVisible.value = true
  }
}

// 合并表格的行高亮（key = roleId_userId_id，每行唯一）：
// 1. 点击的那一行 → 整行高亮
// 2. 同 roleId+userId 的人员合并 cell 拥有者（该人员组首行）→ 仅人员列高亮
// 3. 同 roleId 的角色合并 cell 拥有者（该角色组首行）→ 仅角色列高亮
// 后两条用来补齐合并 cell 的视觉，避免点击非首行时出现"竖列断层"
const rowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  if (!currentRowKey.value) return ''

  const classes: string[] = []
  const [clickedRoleId, clickedUserId] = currentRowKey.value.split('_')

  // 1. 点击的那一行
  if (getRowKey(row) === currentRowKey.value) {
    classes.push('is-row-active')
  }

  // 2. 人员合并 cell 拥有者（同 roleId+userId 的首行）
  if (String(row.roleId) === clickedRoleId && String(row.userId) === clickedUserId) {
    const isUserOwner = rowIndex === 0 || list.value[rowIndex - 1].roleId !== row.roleId || list.value[rowIndex - 1].userId !== row.userId
    if (isUserOwner) classes.push('is-row-user-owner')
  }

  // 3. 角色合并 cell 拥有者（同 roleId 的首行）
  if (String(row.roleId) === clickedRoleId) {
    const isRoleOwner = rowIndex === 0 || list.value[rowIndex - 1].roleId !== row.roleId
    if (isRoleOwner) classes.push('is-row-role-owner')
  }

  return classes.join(' ')
}
// 保存提示词（从编辑弹窗组件触发）
const handleSavePrompt = async (data: { prompt: string }) => {
  try {
    submitLoading.value = true
    await updateUserPrompt({
      id: currentEditRow.value.id,
      prompt: data.prompt,
    })
    $baseMessage('修改成功', 'success')
    editorDialogVisible.value = false
    currentEditRow.value = null
    fetchData()
  } catch (error) {
    console.error('修改失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 保存为新版本（从编辑弹窗组件触发）
const handleSaveToNewVersion = async (data: { prompt: string; remark: string }) => {
  try {
    submitLoading.value = true
    editorDialogRef.value?.setSaving(true)
    await savePromptConfigVersion({
      configId: currentEditRow.value.id,
      prompt: data.prompt,
      remark: data.remark,
    })
    $baseMessage('保存为新版本成功', 'success')
    editorDialogRef.value?.closeRemarkDialog()
    editorDialogVisible.value = false
    currentEditRow.value = null
    fetchData()
  } catch (error) {
    console.error('保存版本失败:', error)
  } finally {
    submitLoading.value = false
    editorDialogRef.value?.setSaving(false)
  }
}

const handleShowHistoryList = async (row: any) => {
  historyCurrentRow.value = row
  historyCurrentVersionNo.value = row.currentVersionNo ?? null
  historyDrawerVisible.value = true
  try {
    historyLoading.value = true
    const { data } = await getPromptConfigHistory(row.id)
    historyList.value = data || []
  } catch (error) {
    console.error('获取历史版本失败:', error)
  } finally {
    historyLoading.value = false
  }
}

const handlePreviewHistory = (row: any) => {
  previewPrompt.value = row.prompt
  previewDialogVisible.value = true
}

const handleRollback = async (row: any) => {
  try {
    await rollbackPromptConfig({
      configId: historyCurrentRow.value.id,
      historyId: row.id,
    })
    $baseMessage(`已回滚到 v${row.versionNo}`, 'success')
    // 本地立刻把指针指向回滚目标，避免抽屉短暂显示旧"当前"
    historyCurrentVersionNo.value = row.versionNo
    historyCurrentRow.value.currentVersionNo = row.versionNo
    // 重新加载历史列表（回滚会把"被替换的旧 current"作为新版本写入）
    const { data } = await getPromptConfigHistory(historyCurrentRow.value.id)
    historyList.value = data || []
    fetchData()
  } catch (error) {
    console.error('回滚失败:', error)
  }
}

const handleDeleteHistory = async (row: any) => {
  try {
    await deletePromptConfigHistory(row.id)
    $baseMessage('删除成功', 'success')
    historyList.value = historyList.value.filter((item) => item.id !== row.id)
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 新增对话框相关方法
const handleAddDialogClose = () => {
  addFormRef.value?.resetFields()
  addFormData.roleId = null
  addFormData.functionName = ''
  addFormData.prompt = ''
  addFormData.flowId = ''
  addFormData.componentId = ''
}

const handleAddSubmit = async () => {
  try {
    await addFormRef.value?.validate()
    submitLoading.value = true

    await addAiPrompt({
      roleId: addFormData.roleId,
      componentId: addFormData.componentId,
      functionName: addFormData.functionName,
      prompt: addFormData.prompt,
      flowId: addFormData.flowId,
    })

    $baseMessage('新增成功', 'success')
    addDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('新增失败:', error)
  } finally {
    submitLoading.value = false
  }
}
// 角色列表
const roleList = ref<IRoleRes[]>([])
const fetchRoleList = async () => {
  const { data } = await getAllList({ pageNo: 1, pageSize: 100, role: '' })
  // 过滤掉状态为1的角色
  roleList.value = data.list.filter((r) => r.status === '0' && r.roleCode !== ROLE_BOSS_CODE)
}
onMounted(() => {
  fetchRoleList()
  fetchUserList()
  fetchData()
})
</script>

<style lang="scss" scoped>
.ai-prompt-container {
  padding: 20px;

  .prompt-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .draft-tag {
      flex: none;
    }
  }

  .prompt-text {
    flex: 1;
    min-width: 0;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  // 提示词预览样式 - 支持markdown格式
  .prompt-tooltip {
    max-width: 500px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  // 合并表格行高亮：
  // - is-row-active：点击的那一行整行染色
  // - is-row-user-owner：仅人员列染色（补齐合并的"人员"单元格视觉）
  // - is-row-role-owner：仅角色列染色（补齐合并的"角色"单元格视觉）
  :deep(.el-table__row.is-row-active > td.el-table__cell) {
    background-color: var(--el-color-primary-light-9) !important;
  }

  :deep(.el-table__row.is-row-active:hover > td.el-table__cell) {
    background-color: var(--el-color-primary-light-8) !important;
  }

  :deep(.el-table__row.is-row-user-owner > td.el-table__cell.col-user) {
    background-color: var(--el-color-primary-light-9) !important;
  }

  :deep(.el-table__row.is-row-role-owner > td.el-table__cell.col-role) {
    background-color: var(--el-color-primary-light-9) !important;
  }
}

// Markdown 编辑器样式（新增对话框用）
.md-editor-container {
  width: 100%;
  :deep() {
    .v-md-editor {
      width: 100%;
      height: 400px;
      background: var(--el-color-white);
      border: 1px solid var(--el-border-color);
      border-radius: var(--el-border-radius-base);
      box-shadow: none;
      transition: var(--el-transition);

      &__left-area {
        width: 100%;
        height: 400px;
      }

      &__left-area-toolbar {
        height: auto;
      }

      &--fullscreen {
        z-index: 9999;
        border-radius: 0;
      }

      &__toolbar {
        border-bottom: 1px solid var(--el-border-color);

        &-divider:before {
          border-left: 1px solid var(--el-border-color);
        }

        &-item {
          color: var(--el-color-grey);

          &--active,
          &:hover {
            color: var(--el-color-primary);
            background: var(--el-color-primary-light-9);
          }
        }
      }

      &__editor-wrapper {
        border-right: 1px solid var(--el-border-color);
        height: calc(100% - 40px);
      }

      .v-md-textarea-editor pre,
      .v-md-textarea-editor textarea {
        color: var(--el-color-grey);
        background-color: var(--el-color-white);
      }

      .github-markdown-body h1,
      .github-markdown-body h2 {
        border-bottom: 1px solid var(--el-border-color);
      }
    }

    @media (max-width: 768px) {
      .v-md-editor {
        &__toolbar-right,
        &__toolbar-divider {
          display: none;
        }

        &__main {
          flex-direction: column !important;
          overflow-y: auto;
        }

        &__preview-wrapper {
          border-top: 1px solid var(--el-border-color);
        }

        &__editor-wrapper,
        &__preview-wrapper {
          display: flex;
          flex-direction: column;
          height: auto;
          min-height: calc(var(--vh, 1vh) * 100);
          overflow: hidden;
        }
      }
    }
  }
}

// 确保编辑器的表单项正常显示
:deep(.el-form-item) {
  &.is-error {
    .md-editor-container {
      .v-md-editor {
        border-color: var(--el-color-danger);
      }
    }
  }
}
.custom-tooltip {
  max-width: 100%;
  white-space: pre-wrap;
  word-break: break-all;
}

.history-preview-content {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  max-height: 60vh;
  overflow-y: auto;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
}
</style>
