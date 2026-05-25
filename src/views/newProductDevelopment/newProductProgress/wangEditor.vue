<template>
  <el-dialog
    v-model="dflag"
    :before-close="handlerCloseDialog"
    class="wangEditorDialog"
    :close-on-click-modal="false"
    :title="props.title"
    width="60%"
    @opened="handleDialogOpened"
  >
    <div v-if="dflag" class="wang-editor-container">
      <el-alert
        v-if="draftRestored"
        class="draft-alert"
        :closable="false"
        show-icon
        title="5分钟内修改过本记录，当前显示本地草稿。继续编辑请点保存；如需查看最新内容，请刷新页面后重新打开。"
        type="warning"
      />
      <toolbar :default-config="toolbarConfig" :editor="editorRef" style="border-bottom: 1px solid var(--el-border-color)" />
      <editor
        v-model="html"
        class="wang-editor-content"
        :default-config="editorConfig"
        mode="default"
        @click="
          (e: MouseEvent) => {
            handleEditorImageClick(e)
            handleClick()
          }
        "
        @on-created="handleCreated"
      />

      <!-- 图片点击放大预览 -->
      <el-image-viewer
        v-if="showViewer"
        hide-on-click-modal
        :initial-index="viewerIndex"
        :url-list="viewerList"
        @close="showViewer = false"
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
  // 历史命名为 progressId，实际用于区分草稿缓存所属的业务记录。
  progressId?: number | string
}>()

const dflag = ref<boolean>(false)

const editorRef = shallowRef<IDomEditor | undefined>()

// 初始化时使用 props 中的内容
const html = ref<any>(props.content || '')
const draftRestored = ref<boolean>(false)

const handleDialogOpened = async () => {
  await nextTick()

  const editor = editorRef.value
  if (!editor) return

  // 确保内容已经 setHtml 完成
  editor.focus()

  // 光标放在开头
  editor.select({
    path: [0, 0],
    offset: 0,
  })
}

// 草稿过期时间：7 天
const DRAFT_EXPIRE_MS = 7 * 24 * 60 * 60 * 1000

const getDraftKey = () => {
  const recordId = Number(props.progressId)
  if (!props.classify || !Number.isFinite(recordId) || recordId <= 0) return ''

  return `${props.classify}_${recordId}`
}

const clearDraft = () => {
  const key = getDraftKey()
  if (!key) return

  localStorage.removeItem(key)
  localStorage.removeItem(`${key}_timestamp`)
}

// 过期或无时间戳的草稿视为无效，顺带清掉避免僵尸数据
const readValidDraft = (): string | null => {
  const key = getDraftKey()
  if (!key) return null

  const draft = localStorage.getItem(key)
  if (!draft) return null

  const ts = localStorage.getItem(`${key}_timestamp`)
  if (!ts || Date.now() - Number(ts) > DRAFT_EXPIRE_MS) {
    clearDraft()
    return null
  }
  return draft
}

// 对话框打开、内容或业务记录 id 变化时，同步编辑器内容。
// progressId 是历史 prop 名，可能传 progressId、detailId、零件明细 id 等。
// 草稿 key 必须带有效业务记录 id，避免不同记录共用缓存。
// 内容优先级：
// 1. 后端内容和 5 分钟内草稿同时存在时，使用草稿续写。
// 2. 草稿超过 5 分钟时，使用后端内容。
// 3. 只有一方有内容时，使用已有内容；都没有则置空。
// 点「保存」/「确认」会清草稿；点「取消」/关闭会保留草稿。
watch(
  () => [props.wangEditorVisible, props.content, props.progressId, props.classify] as const,
  ([newValue]) => {
    dflag.value = newValue

    if (newValue) {
      const key = getDraftKey()
      const tempContent = readValidDraft()
      const content = props.content || ''
      draftRestored.value = false

      if (content && !isEmptyHtml(content) && tempContent && !isEmptyHtml(tempContent)) {
        // 两者都有内容，比较时间戳
        const cacheTimestamp = localStorage.getItem(`${key}_timestamp`)
        const currentTime = Date.now()

        if (cacheTimestamp && currentTime - parseInt(cacheTimestamp) < 5 * 60 * 1000) {
          // 缓存是5分钟内的，使用缓存（用户可能正在编辑）
          html.value = tempContent
          draftRestored.value = true
        } else {
          // 缓存过期或没有时间戳，使用后端内容
          html.value = content
        }
      } else if (content && !isEmptyHtml(content)) {
        // 只有后端有内容
        html.value = content
      } else if (tempContent && !isEmptyHtml(tempContent)) {
        // 只有缓存有内容
        html.value = tempContent
        draftRestored.value = true
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

// 检查HTML内容是否为空
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

  const textContent = tempDiv.textContent || tempDiv.innerText || ''
  return textContent.trim() === ''
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
    const key = getDraftKey()
    if (!key) return

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
  draftRestored.value = false
}
/**
 * 当取消对话框时
 */
const handleCloseDialog = () => {
  clearTimer()
  emit('clickBoolean', false)
  dflag.value = false
  draftRestored.value = false
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
  clearDraft()
  draftRestored.value = false
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
  clearDraft()
  draftRestored.value = false
}

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
}

// 图片点击放大
const showViewer = ref(false)
const viewerList = ref<string[]>([])
const viewerIndex = ref(0)

const handleEditorImageClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'IMG') {
    const src = (target as HTMLImageElement).src
    if (src) {
      const container = (e.currentTarget as HTMLElement).closest('.wang-editor-content') as HTMLElement
      if (!container) return
      const allImgs = Array.from(container.querySelectorAll('img'))
      const urls = allImgs.map((img) => img.src).filter(Boolean)
      viewerList.value = urls
      viewerIndex.value = Math.max(urls.indexOf(src), 0)
      showViewer.value = true
    }
  }
}
onBeforeUnmount(() => {
  clearTimer()
  const editor = editorRef.value
  if (editor) editor.destroy()
  // 只有在对话框打开状态下才清理localStorage缓存
  // 这样可以避免路由切换时误清理缓存
  if (dflag.value) {
    const key = getDraftKey()
    if (key) localStorage.removeItem(`${key}_timestamp`)
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

      .draft-alert {
        width: 70%;
        margin: 0 auto 8px;
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
    cursor: zoom-in;
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
