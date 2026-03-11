<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" title="编辑提示词" width="80%" @close="handleClose">
    <div v-if="currentRow" class="editor-dialog-content">
      <!-- 信息展示区 -->
      <div class="info-section">
        <el-descriptions border :column="3">
          <el-descriptions-item label="提示词功能">
            <el-tag type="primary">{{ currentRow.functionName }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="角色">
            <el-tag type="info">{{ getRoleName(currentRow.roleId) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="人员">
            <el-tag type="success">{{ currentRow.userName || '-' }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 编辑器区 -->
      <div class="md-editor-container no-background-container">
        <v-md-editor v-model="editorContent" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button :loading="saving" type="primary" @click="handleSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
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
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: { userId: number; componentId: string | null; prompt: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editorContent = ref<string>('')
const saving = ref<boolean>(false)

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
    userId: props.currentRow.userId,
    componentId: props.currentRow.componentId || null,
    prompt: editorContent.value,
  })
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  editorContent.value = ''
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
})
</script>

<style lang="scss" scoped>
.editor-dialog-content {
  .info-section {
    margin-bottom: 20px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// Markdown 编辑器样式
.md-editor-container {
  :deep() {
    .v-md-editor {
      min-height: 500px;
      background: var(--el-color-white);
      border: 1px solid var(--el-border-color);
      border-radius: var(--el-border-radius-base);
      box-shadow: none;
      transition: var(--el-transition);

      &__left-area {
        min-height: 500px;
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
</style>
