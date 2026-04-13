<template>
  <vab-dialog
    v-model="visible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :title="title"
    :width="width"
    @opened="handleOpened"
  >
    <slot />
    <div v-if="visible" class="wang-editor-container" :style="{ marginTop: hasSlot ? '16px' : undefined }">
      <toolbar :default-config="toolbarConfig" :editor="editorRef" style="border-bottom: 1px solid var(--el-border-color)" />
      <editor v-model="editorHtml" class="wang-editor-content" :default-config="editorConfig" mode="default" @on-created="handleCreated" />
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSave">保存</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { uploadEditorImage } from '/@/api/devlocal/progress'

defineOptions({
  name: 'PackageEditorDialog',
})

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    width?: string
    initialHtml?: string
    loading?: boolean
    placeholder?: string
  }>(),
  {
    title: '编辑内容',
    width: '60%',
    initialHtml: '',
    loading: false,
    placeholder: '请输入内容...',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [html: string, text: string]
}>()

const slots = useSlots()
const hasSlot = computed(() => !!slots.default)

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const editorRef = shallowRef<IDomEditor | undefined>()
const editorHtml = ref('')

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'codeBlock'],
}

const editorConfig = reactive<any>({
  placeholder: computed(() => props.placeholder),
  readOnly: false,
  MENU_CONF: {
    uploadImage: {
      allowedFileTypes: ['image/*'],
      maxFileSize: 2 * 1024 * 1024,
      async customUpload(file: File, insertFn: (url: string, alt?: string, href?: string) => void) {
        try {
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

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = Object.seal(editor)
}

const handleOpened = async () => {
  await nextTick()
  if (editorRef.value && props.initialHtml) {
    editorRef.value.setHtml(props.initialHtml)
  }
  editorRef.value?.focus()
}

// 支持 initialHtml 异步更新（如弹窗打开后再拉取内容）
watch(
  () => props.initialHtml,
  (newHtml) => {
    if (editorRef.value && newHtml !== undefined) {
      editorRef.value.setHtml(newHtml)
    }
  }
)

const handleSave = () => {
  if (!editorRef.value) return
  emit('save', editorRef.value.getHtml(), editorRef.value.getText())
}

const handleClose = () => {
  editorHtml.value = ''
  visible.value = false
}

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})
</script>

<style lang="scss" scoped>
.wang-editor-container {
  display: flex;
  flex-direction: column;
  height: 800px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;

  .wang-editor-content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
}
</style>
