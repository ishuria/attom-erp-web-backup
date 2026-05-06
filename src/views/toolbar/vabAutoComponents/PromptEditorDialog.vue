<template>
  <el-dialog
    v-model="visible"
    align-center
    append-to-body
    class="prompt-editor-dialog"
    :close-on-click-modal="false"
    modal-class="prompt-editor-modal"
    :title="readonly ? '查看提示词' : '编辑提示词'"
    width="80%"
    @close="handleClose"
  >
    <div v-if="currentRow" class="editor-dialog-content">
      <!-- 信息展示区 -->
      <div class="info-section">
        <div class="info-card">
          <span class="info-label">提示词功能</span>
          <span class="info-value">{{ currentRow.functionName }}</span>
        </div>
        <div class="info-card">
          <span class="info-label">角色</span>
          <span class="info-value">{{ getRoleName(currentRow.roleId) }}</span>
        </div>
        <div class="info-card">
          <span class="info-label">人员</span>
          <span class="info-value">{{ currentRow.userName || '-' }}</span>
        </div>
      </div>

      <el-alert v-if="readonly" class="readonly-tip" :closable="false" show-icon :title="readonlyTip" type="info" />

      <!-- 编辑器区：readonly 时切到 v-md-editor 的 preview 模式（隐藏工具栏，只显示渲染结果） -->
      <div class="md-editor-container">
        <v-md-editor v-model="editorContent" height="100%" :mode="readonly ? 'preview' : 'editable'" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button :icon="Close" @click="handleClose">{{ readonly ? '关闭' : '取消' }}</el-button>
        <template v-if="!readonly">
          <el-button :icon="Check" :loading="saving" type="primary" @click="handleSave">保存</el-button>
          <el-button :icon="DocumentAdd" type="success" @click="handleSaveToNewVersion">保存为新版本</el-button>
        </template>
      </div>
    </template>
  </el-dialog>

  <!-- 备注输入弹窗 -->
  <el-dialog v-model="remarkDialogVisible" append-to-body title="保存为新版本" width="400px">
    <el-form>
      <el-form-item label="版本备注">
        <el-input v-model="remark" clearable maxlength="200" placeholder="选填，如：测试版A" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="remarkDialogVisible = false">取消</el-button>
      <el-button :loading="saving" type="success" @click="handleRemarkConfirm">确认保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Check, Close, DocumentAdd } from '@element-plus/icons-vue'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import { ElMessage } from 'element-plus'

// 初始化 v-md-editor
VMdEditor.use(githubTheme)

interface Props {
  modelValue: boolean
  currentRow: any
  roleList: any[]
  readonly?: boolean
  readonlyTip?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: { prompt: string }): void
  (e: 'saveToNewVersion', data: { prompt: string; remark: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  readonlyTip: '该提示词由专人负责，您只能查看，无法编辑',
})
const emit = defineEmits<Emits>()

const editorContent = ref<string>('')
const saving = ref<boolean>(false)
const remarkDialogVisible = ref<boolean>(false)
const remark = ref<string>('')

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 获取角色名称
const getRoleName = (roleId: number) => {
  const role = props.roleList.find((r) => r.roleId === roleId)
  return role?.roleName || ''
}

// 保存
const handleSave = () => {
  if (!editorContent.value.trim()) {
    ElMessage.warning('请输入提示词内容')
    return
  }

  emit('save', {
    prompt: editorContent.value,
  })
}

// 保存为新版本 - 打开备注弹窗
const handleSaveToNewVersion = () => {
  if (!editorContent.value.trim()) {
    ElMessage.warning('请输入提示词内容')
    return
  }
  remark.value = ''
  remarkDialogVisible.value = true
}

// 备注弹窗确认
const handleRemarkConfirm = () => {
  emit('saveToNewVersion', {
    prompt: editorContent.value,
    remark: remark.value,
  })
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  editorContent.value = ''
  remarkDialogVisible.value = false
  remark.value = ''
}

// 监听弹窗打开，初始化编辑器内容
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.currentRow) {
      editorContent.value = props.currentRow.prompt || ''
    }
  }
)

// 暴露方法给父组件
defineExpose({
  setSaving: (value: boolean) => {
    saving.value = value
  },
  closeRemarkDialog: () => {
    remarkDialogVisible.value = false
  },
})
</script>

<style lang="scss">
.prompt-editor-modal {
  &.el-overlay-dialog,
  .el-overlay-dialog {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
    overflow: auto;
  }

  .prompt-editor-dialog.el-dialog {
    display: flex !important;
    flex-direction: column;
    width: min(76vw, 1560px) !important;
    min-width: 980px;
    height: min(80vh, 1040px) !important;
    max-height: 80vh !important;
    margin: 0 !important;
    overflow: hidden;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 10px;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.16);
  }

  .prompt-editor-dialog {
    .el-dialog__header {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      min-height: 52px;
      padding: 0 18px;
      margin: 0;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .el-dialog__headerbtn {
      top: 10px;
      right: 12px;
      width: 32px;
      height: 32px;
      border-radius: 8px;

      &:hover {
        background: var(--el-fill-color-light);
      }
    }

    // body 不滚，把滚动留给编辑器内部
    .el-dialog__body {
      flex: 1 1 auto;
      min-height: 0;
      padding: 14px 16px;
      overflow: hidden;
      background: var(--el-fill-color-extra-light);
    }

    .el-dialog__footer {
      flex-shrink: 0;
      padding: 12px 16px;
      border-top: 1px solid var(--el-border-color-lighter);
    }

    .editor-dialog-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    // 信息展示区：自定义 grid 布局（EP 没有现成的）
    .info-section {
      display: grid;
      flex-shrink: 0;
      grid-template-columns: minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr);
      gap: 10px;
      margin-bottom: 12px;

      .info-card {
        display: flex;
        align-items: center;
        min-width: 0;
        min-height: 40px;
        padding: 8px 12px;
        background: var(--el-bg-color);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);

        .info-label {
          flex-shrink: 0;
          padding-right: 10px;
          margin-right: 10px;
          font-size: 12px;
          line-height: 1.2;
          color: var(--el-text-color-secondary);
          border-right: 1px solid var(--el-border-color-lighter);
        }

        .info-value {
          flex: 1;
          min-width: 0;
          overflow: hidden;

          font-weight: 600;
          text-overflow: ellipsis;
          line-height: 1.2;
          color: var(--el-text-color-primary);
          white-space: nowrap;
        }
      }
    }

    // 编辑器容器：撑满剩余空间，内部用 v-md-editor 自带布局
    .readonly-tip {
      flex-shrink: 0;
      margin-bottom: 10px;
    }

    .md-editor-container {
      flex: 1 1 auto;
      min-width: 0;
      min-height: 0;
      overflow: auto;
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);

      .v-md-editor {
        width: 100%;
        height: 100% !important;
        background: var(--el-bg-color);
        border-radius: 8px;
        box-shadow: none;

        // 关键：让 v-md-editor 内部所有 flex 容器允许 shrink，避免被内容撑开
        &__main,
        &__left-area,
        &__right-area,
        &__editor-wrapper,
        &__preview-wrapper {
          min-width: 0;
          min-height: 0;
        }

        &__toolbar {
          flex-shrink: 0;
          background: var(--el-bg-color);
          border-bottom-color: var(--el-border-color-lighter);
        }

        &__editor-wrapper {
          border-right-color: var(--el-border-color-lighter);
        }

        // textarea 内容超长时，编辑/预览区内部滚（不向外撑）
        &__editor-wrapper,
        &__preview-wrapper {
          overflow: auto;
        }

        &--fullscreen {
          z-index: 9999;
        }
      }
    }

    .dialog-footer {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    @media (max-width: 900px) {
      &.el-dialog {
        width: 94vw !important;
        min-width: 0;
        height: 90vh !important;
        max-height: 90vh !important;
      }

      .info-section {
        grid-template-columns: 1fr;
      }

      .v-md-editor__main {
        flex-direction: column !important;
      }
    }
  }
}
</style>
