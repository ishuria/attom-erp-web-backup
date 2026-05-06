<template>
  <el-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增常用提示词' : '编辑常用提示词'"
    width="80%"
    top="6vh"
    :close-on-click-modal="false"
    append-to-body
    @closed="handleClosed"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="72px">
      <el-form-item label="正文" prop="prompt">
        <div class="md-editor-container">
          <v-md-editor
            v-model="form.prompt"
            height="500px"
            placeholder="请输入提示词正文（支持 Markdown）"
            left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | save"
            :disabled-menus="[]"
          />
        </div>
      </el-form-item>
      <el-form-item label="分类">
        <el-input
          v-model="form.category"
          maxlength="32"
          placeholder="可选，用于过滤分组"
          clearable
        />
      </el-form-item>
      <el-form-item label="排序值">
        <el-input-number v-model="form.sortNo" :min="0" :max="9999" />
        <span class="hint">越大越靠前；置顶可填 9999</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import type { FormInstance, FormRules } from 'element-plus'
import { addFavoritePrompt, updateFavoritePrompt } from '/@/api/devlocal/favoritePrompt'
import { $baseMessage } from '/@/hooks'
import type { FavoritePromptItem } from '/@/type/ai/favoritePrompt'

VMdEditor.use(githubTheme)

defineOptions({
  name: 'FavoritePromptEditDialog',
})

const props = defineProps<{
  mode: 'add' | 'edit'
  item?: FavoritePromptItem | null
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { required: true })

interface FormState {
  prompt: string
  category: string
  sortNo: number
}

const formRef = ref<FormInstance>()
const submitting = ref(false)
const form = reactive<FormState>({
  prompt: '',
  category: '',
  sortNo: 0,
})

const rules: FormRules<FormState> = {
  prompt: [{ required: true, message: '提示词正文不能为空', trigger: 'blur' }],
}

watch(
  () => visible.value,
  (val) => {
    if (!val) return
    if (props.mode === 'edit' && props.item) {
      form.prompt = props.item.prompt ?? ''
      form.category = props.item.category ?? ''
      form.sortNo = props.item.sortNo ?? 0
    } else {
      form.prompt = ''
      form.category = ''
      form.sortNo = 0
    }
    nextTick(() => {
      formRef.value?.clearValidate()
    })
  },
)

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const payload = {
      prompt: form.prompt.trim(),
      category: form.category?.trim() || null,
      sortNo: form.sortNo ?? 0,
    }
    if (props.mode === 'add') {
      await addFavoritePrompt(payload)
    } else if (props.item) {
      await updateFavoritePrompt({ id: props.item.id, ...payload })
    }
    $baseMessage('保存成功', 'success', 'hey')
    emit('saved')
    visible.value = false
  } catch {
    $baseMessage('保存失败，请稍后重试', 'error', 'hey')
  } finally {
    submitting.value = false
  }
}

const handleClosed = () => {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.hint {
  margin-left: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.md-editor-container {
  width: 100%;

  :deep(.v-md-editor) {
    width: 100%;
    background: var(--el-color-white);
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    box-shadow: none;
  }

  :deep(.v-md-editor--fullscreen) {
    z-index: 9999;
    border-radius: 0;
  }

  :deep(.v-md-editor__toolbar) {
    border-bottom: 1px solid var(--el-border-color);
  }

  :deep(.v-md-editor__editor-wrapper) {
    border-right: 1px solid var(--el-border-color);
  }
}

:deep(.el-form-item.is-error) .md-editor-container :deep(.v-md-editor) {
  border-color: var(--el-color-danger);
}
</style>
