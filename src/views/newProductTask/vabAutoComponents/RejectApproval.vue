<template>
  <vab-dialog v-model="visible" title="审批不通过-整改要求" width="50%" @close="handleClose">
    <el-form label-position="right" label-width="100px">
      <el-form-item label="整改要求" required>
        <div v-if="visible" class="wang-editor-container">
          <toolbar :default-config="toolbarConfig" :editor="editorRef" style="border-bottom: 1px solid var(--el-border-color)" />
          <editor v-model="html" class="wang-editor-content" :default-config="editorConfig" mode="default" @on-created="handleCreated" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { uploadEditorImage } from '/@/api/devlocal/progress'

type InsertImageFnType = (url: string, alt?: string, href?: string) => void

defineOptions({
  name: 'RejectApproval',
})

const props = defineProps<{
  row: any
}>()

const emit = defineEmits<{
  confirm: [correctionRequirement: string]
}>()

const visible = defineModel<boolean>('visible', {
  required: true,
})

const loading = ref<boolean>(false)
const editorRef = shallowRef<IDomEditor | undefined>()
const html = ref<string>('')

// 编辑器配置
const editorConfig = reactive<any>({
  placeholder: '请输入整改要求...',
  MENU_CONF: {
    uploadImage: {
      allowedFileTypes: ['image/*'],
      maxFileSize: 2 * 1024 * 1024,
      maxNumberOfFiles: 1,

      onBeforeUpload(file: File) {
        if (!file.type.startsWith('image/')) {
          $baseMessage('只能上传图片文件!', 'error', 'hey')
          return false
        }
        if (file.size > 2 * 1024 * 1024) {
          $baseMessage('图片大小不能超过 2MB!', 'error', 'hey')
          return false
        }
        return file
      },

      onProgress(_progress: number) {
        // progress 是 0-100 的数字
      },

      async customUpload(file: File, insertFn: InsertImageFnType) {
        try {
          const formData = new FormData()
          formData.append('file', file)

          const { data } = await uploadEditorImage(formData)

          let imageUrl = ''
          if (data?.url) {
            imageUrl = data.url
          } else if (typeof data === 'string') {
            imageUrl = data
          } else {
            throw new Error('上传失败：无法获取图片地址')
          }

          insertFn(imageUrl, file.name, imageUrl)
          $baseMessage('图片上传成功!', 'success', 'hey')
        } catch (error: any) {
          console.error('图片上传失败:', error)
          $baseMessage(error?.message || '图片上传失败，请重试', 'error', 'hey')
        }
      },

      onFailed(file: File, res: any) {
        console.error(`${file.name} 上传失败`, res)
        $baseMessage('图片上传失败', 'error', 'hey')
      },

      onError(file: File, err: any, res: any) {
        console.error(`${file.name} 上传出错`, err, res)
        $baseMessage('图片上传出错，请重试', 'error', 'hey')
      },
    },
    fontSize: {
      fontSizeList: ['12px', '13px', '14px', '16px', '18px', '20px', '24px'],
    },
  },
})

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'codeBlock'],
}

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = Object.seal(editor)
}

const handleClose = () => {
  html.value = ''
  if (editorRef.value) {
    editorRef.value.setHtml('')
  }
  visible.value = false
}

const handleConfirm = async () => {
  if (!html.value || !html.value.trim()) {
    $baseMessage('请输入整改要求', 'warning')
    return
  }

  loading.value = true
  try {
    emit('confirm', html.value)
    handleClose()
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) editor.destroy()
})
</script>

<style scoped lang="scss">
.wang-editor-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;

  .wang-editor-content {
    min-height: 500px;
  }

  :deep(.w-e-text-container) {
    min-height: 500px;
    font-size: 18px;
    .w-e-text-placeholder {
      font-size: 18px;
    }
    p,
    span,
    li,
    div,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    td,
    th,
    strong,
    em,
    b,
    i {
      font-size: 18px;
    }
  }
}
</style>
