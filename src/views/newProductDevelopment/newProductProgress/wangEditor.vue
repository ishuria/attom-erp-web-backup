<template>
  <el-dialog
    v-model="dflag"
    :before-close="handlerCloseDialog"
    class="wangEditorDialog"
    :close-on-click-modal="false"
    :title="props.title"
    width="60%"
  >
    <div v-if="dflag" class="wang-editor-container">
      <toolbar :default-config="toolbarConfig" :editor="editorRef" style="border-bottom: 1px solid var(--el-border-color)" />
      <editor
        v-model="html"
        class="wang-editor-content"
        :default-config="editorConfig"
        mode="default"
        @click="handleClick"
        @on-created="handleCreated"
      />
    </div>
    <template #footer>
      <span>
        <el-button @click="insertDate">插入日期</el-button>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="success" @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleConfirmDialog">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { uploadEditorImage } from '/@/api/devlocal/progress'

defineOptions({
  name: 'WangEditor',
})

let props = defineProps<{
  title: string
  wangEditorVisible: boolean
  content: string | undefined
  classify: string
  progressId?: number
}>()

let { content } = toRefs(props)

const dflag = ref<boolean>(false)

const editorRef = shallowRef<IDomEditor | undefined>()

// 初始化时使用 props 中的内容
const html = ref<any>(content.value || '')

// 监听对话框显示状态变化，处理内容逻辑
watch(
  () => props.wangEditorVisible,
  (newValue) => {
    dflag.value = newValue

    // 当对话框打开时，智能选择内容来源
    if (newValue) {
      const key = props.progressId ? `${props.classify}_${props.progressId}` : props.classify
      const tempContent = localStorage.getItem(key)

      // 智能选择逻辑：
      // 1. 如果后端有内容且缓存也有内容，比较时间戳决定使用哪个
      // 2. 如果只有后端有内容，使用后端内容
      // 3. 如果只有缓存有内容，使用缓存内容
      // 4. 都没有则使用空内容

      if (content.value && !isEmptyHtml(content.value) && tempContent && !isEmptyHtml(tempContent)) {
        // 两者都有内容，比较时间戳
        const cacheTimestamp = localStorage.getItem(`${key}_timestamp`)
        const currentTime = Date.now()

        if (cacheTimestamp && currentTime - parseInt(cacheTimestamp) < 5 * 60 * 1000) {
          // 缓存是5分钟内的，使用缓存（用户可能正在编辑）
          html.value = tempContent
        } else {
          // 缓存过期或没有时间戳，使用后端内容
          html.value = content.value
        }
      } else if (content.value && !isEmptyHtml(content.value)) {
        // 只有后端有内容
        html.value = content.value
      } else if (tempContent && !isEmptyHtml(tempContent)) {
        // 只有缓存有内容
        html.value = tempContent
      } else {
        // 都没有
        html.value = ''
      }

      // 确保编辑器内容同步
      nextTick(() => {
        if (editorRef.value) {
          editorRef.value.setHtml(html.value)
        }
      })
    }
  },
  { immediate: true }
)

// 图片上传插入函数类型定义
type InsertImageFnType = (url: string, alt?: string, href?: string) => void

const editorConfig = reactive<any>({
  placeholder: '请输入内容...',
  // 确保图片能正常显示，不忽略图片
  readOnly: false,
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

      // 自定义上传功能 - 使用项目现有的 uploadFile API
      async customUpload(file: File, insertFn: InsertImageFnType) {
        try {
          // 创建 FormData
          const formData = new FormData()
          formData.append('file', file)

          // 调用项目现有的上传接口
          const { data } = await uploadEditorImage(formData)

          // 根据实际返回格式处理
          // 根据代码中的实际返回格式：{ data: { fileId, url } }
          // 从 index.vue 中可以看到：const { fileId, url } = data
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

      // 单个文件上传成功之后
      onSuccess(file: File, res: any) {
        // console.log(`${file.name} 上传成功`, res)
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
      fontSizeList: ['16px', '18px', '20px', '22px', '24px', '28px', '32px', '36px', '48px', '72px'],
    },
  },
})
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'codeBlock'],
}

// 检查HTML内容是否为空 - 使用 WangEditor 官方 API
// 注意：只有图片没有文字的内容不应该被判断为空
const isEmptyHtml = (html: string): boolean => {
  if (!html) return true

  // 创建临时 DOM 元素检查内容
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // 检查是否有图片标签
  const hasImage = tempDiv.querySelector('img') !== null
  if (hasImage) {
    // 如果有图片，即使没有文字也不算空
    return false
  }

  // 判断是否为空
  if (editorRef.value) {
    // 如果编辑器已存在，使用 getText() 方法
    const tempEditor = editorRef.value
    tempEditor.setHtml(html)
    const text = tempEditor.getText()
    return text.trim() === ''
  } else {
    // 如果编辑器不存在，使用简单的文本检查
    const textContent = tempDiv.textContent || tempDiv.innerText || ''
    return textContent.trim() === ''
  }
}
// 插入日期
const insertDate = () => {
  if (!editorRef.value) return

  const editor = editorRef.value
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}：`
  const currentHtml = editor.getHtml()

  // 移动光标到最前面并插入回车和日期

  editor.setHtml(`${formattedDate}${currentHtml}`) // 插入日期
}

// 初始化定时器
let intervalTimerLog: NodeJS.Timeout | null = null
/**
 * 清除定时器
 */
const clearTimer = () => {
  if (intervalTimerLog !== null) {
    clearInterval(intervalTimerLog)
    intervalTimerLog = null
  }
}
/**
 * 当 onChange的时候，触发定时器
 */
const handleClick = () => {
  clearTimer() // 确保在设置新定时器之前清除旧定时器

  intervalTimerLog = setInterval(() => {
    const key = props.progressId ? `${props.classify}_${props.progressId}` : props.classify
    // 直接使用 localStorage.setItem 保存 HTML 内容，避免 JSON.stringify 添加引号
    localStorage.setItem(key, html.value)
    // 同时保存时间戳，用于判断缓存是否过期
    localStorage.setItem(`${key}_timestamp`, Date.now().toString())
    // console.log(key, html.value);
  }, 1000)
}

const emit = defineEmits(['clickChild', 'clickBoolean'])
// 通过事件,修改父元素的值
const handlerCloseDialog = () => {
  clearTimer()
  emit('clickBoolean', false)
  dflag.value = false
}
/**
 * 当取消对话框时
 */
const handleCloseDialog = () => {
  clearTimer()
  emit('clickBoolean', false)
  dflag.value = false
}
// 点击保存
const handleSave = () => {
  if (!editorRef.value) {
    console.warn('编辑器实例不存在，无法保存')
    return
  }
  const htmlContent = editorRef.value.getHtml()
  emit('clickChild', htmlContent)
  $baseMessage(`${props.title}保存成功`, 'success', 'hey')
  clearTimer()
  const key = props.progressId ? `${props.classify}_${props.progressId}` : props.classify
  localStorage.removeItem(`${key}_timestamp`)
}
/**
 * 当确认对话框的时候
 */
const handleConfirmDialog = () => {
  if (!editorRef.value) {
    console.warn('编辑器实例不存在，无法确认')
    return
  }
  const htmlContent = editorRef.value.getHtml()
  emit('clickChild', htmlContent)
  emit('clickBoolean', false)
  $baseMessage(`${props.title}保存成功`, 'success', 'hey')
  dflag.value = false
  clearTimer()
  const key = props.progressId ? `${props.classify}_${props.progressId}` : props.classify
  localStorage.removeItem(`${key}_timestamp`)
}

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
}
onBeforeUnmount(() => {
  clearTimer()
  const editor = editorRef.value
  if (editor) editor.destroy()
  // 只有在对话框打开状态下才清理localStorage缓存
  // 这样可以避免路由切换时误清理缓存
  if (dflag.value) {
    const key = props.progressId ? `${props.classify}_${props.progressId}` : props.classify
    localStorage.removeItem(`${key}_timestamp`)
  }
})
onUnmounted(() => {
  clearTimer()
})
</script>

<style lang="scss">
.wangEditorDialog {
  display: flex;
  flex-direction: column;
  width: 55%;
  height: 87vh;
  margin: 8vh auto 5vh;

  .el-dialog__body {
    display: flex; // 控制 container 垂直居中
    flex: 1 1 auto; // 中间自适应
    align-items: center;
    justify-content: center;
    overflow: auto; // 防止滚动条问题

    .wang-editor-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: 0 !important;
      margin: -19px -19px 19px -19px;
      background: var(--el-background-color) !important;
      border: 0 !important;
      &.w-e-full-screen-container {
        z-index: 9999 !important;
      }

      .w-e-bar-divider {
        display: none;
      }

      .w-e-toolbar-init {
        border-bottom: 1px solid var(--el-border-color) !important;
      }

      .wang-editor-content {
        flex: 1; /* 使内容区域填满剩余空间 */
        width: 70%;
        margin: 20px auto;
        overflow: auto;
        background-color: var(--el-color-white);
        border: 0;
        font-size: 22px !important; /* 直接设置字号 */
      }

      // 针对 WangEditor 内部元素设置字号
      :deep(.w-e-text-container) {
        font-size: 22px !important;
      }

      :deep(.w-e-text) {
        font-size: 22px !important;
      }

      :deep(.w-e-text-placeholder) {
        font-size: 22px !important;
      }

      // 针对编辑器内容区域
      :deep(.w-e-text-container .w-e-text) {
        font-size: 22px !important;
      }

      #w-e-textarea-1 {
        margin: var(--el-margin) !important;
      }

      @media (max-width: 768px) {
        .wang-editor-title,
        .wang-editor-content,
        .wang-editor-footer {
          width: 90%;
        }
      }
    }
  }

  .el-dialog__footer {
    padding: 1px var(--el-padding) var(--el-padding);
  }
}
.wang-editor-dialog {
  img {
    max-width: 100%;
  }
}

// 全局强制设置 WangEditor 字号
:global(.w-e-text-container) {
  font-size: 22px !important;
}

:global(.w-e-text) {
  font-size: 22px !important;
}

:global(.w-e-text-placeholder) {
  font-size: 22px !important;
}
</style>
