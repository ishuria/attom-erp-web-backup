<template>
  <vab-dialog v-model="visible" title="超时日期修改申请" width="50%" @close="handleClose">
    <el-form label-position="right" label-width="160px" :model="form">
      <el-form-item label="新的要求完成日期" required>
        <el-date-picker
          v-model="form.newDeadline"
          format="YYYY-MM-DD"
          placeholder="请选择新的要求完成日期"
          type="date"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="申请理由" required>
        <div v-if="visible" class="wang-editor-container">
          <toolbar :default-config="toolbarConfig" :editor="editorRef" style="border-bottom: 1px solid var(--el-border-color)" />
          <editor v-model="html" class="wang-editor-content" :default-config="editorConfig" mode="default" @on-created="handleCreated" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">提交申请</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { applyArtDesignOverdue } from '~/src/api/devlocal/imageTask'
import { uploadEditorImage } from '/@/api/devlocal/progress'

type InsertImageFnType = (url: string, alt?: string, href?: string) => void

defineOptions({
  name: 'DeadlineExtensionApplication',
})

const props = defineProps<{
  listingTaskId: number
}>()

const visible = defineModel<boolean>('visible', {
  required: true,
})

const loading = ref<boolean>(false)
const editorRef = shallowRef<IDomEditor | undefined>()
const html = ref<string>('')

const form = reactive({
  newDeadline: '',
  reason: '',
})

// 编辑器配置
const editorConfig = reactive<any>({
  placeholder: '请输入申请理由...',
  MENU_CONF: {
    uploadImage: {
      // 基本配置
      allowedFileTypes: ['image/*'],
      maxFileSize: 2 * 1024 * 1024, // 2MB
      maxNumberOfFiles: 1, // 单次最多上传1张图片

      // 上传之前的回调
      onBeforeUpload(file: File) {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          $baseMessage('只能上传图片文件!', 'error', 'hey')
          return false
        }
        // 验证文件大小
        if (file.size > 2 * 1024 * 1024) {
          $baseMessage('图片大小不能超过 2MB!', 'error', 'hey')
          return false
        }
        return file
      },

      // 上传进度回调
      onProgress(progress: number) {
        // progress 是 0-100 的数字
        // console.log('上传进度:', progress)
      },

      async customUpload(file: File, insertFn: InsertImageFnType) {
        try {
          // 创建 FormData
          const formData = new FormData()
          formData.append('file', file)

          // 调用项目现有的上传接口
          const { data } = await uploadEditorImage(formData)

          let imageUrl = ''
          if (data?.url) {
            // 如果返回 { data: { url: "xxx" } } 格式（这是正确的格式）
            imageUrl = data.url
          } else if (typeof data === 'string') {
            // 如果直接返回 URL 字符串
            imageUrl = data
          } else {
            throw new Error('上传失败：无法获取图片地址')
          }

          // 插入图片到编辑器
          insertFn(imageUrl, file.name, imageUrl)
          $baseMessage('图片上传成功!', 'success', 'hey')
        } catch (error: any) {
          console.error('图片上传失败:', error)
          $baseMessage(error?.message || '图片上传失败，请重试', 'error', 'hey')
        }
      },

      // 单个文件上传失败
      onFailed(file: File, res: any) {
        console.error(`${file.name} 上传失败`, res)
        $baseMessage('图片上传失败', 'error', 'hey')
      },

      // 上传错误，或者触发 timeout 超时
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

// 编辑器创建回调
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = Object.seal(editor)
}

// 关闭对话框
const handleClose = () => {
  form.newDeadline = ''
  html.value = ''
  form.reason = ''
  if (editorRef.value) {
    editorRef.value.setHtml('')
  }
  visible.value = false
}

// 提交申请
const handleSubmit = async () => {
  if (!form.newDeadline) {
    $baseMessage('请选择新的要求完成日期', 'warning')
    return
  }

  if (!html.value || !html.value.trim()) {
    $baseMessage('请输入申请理由', 'warning')
    return
  }

  form.reason = html.value

  loading.value = true
  try {
    const { data } = await applyArtDesignOverdue({
      listingTaskId: props.listingTaskId,
      latestDate: form.newDeadline,
      reason: form.reason,
    })
    if (data) {
      $baseMessage('申请提交成功', 'success')
      handleClose()
      visible.value = false
    }
  } catch (error) {
    console.error('提交申请失败:', error)
    $baseMessage('提交申请失败，请稍后重试', 'error')
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
  }
}
</style>
