<template>
  <el-dialog v-model="dflag" :before-close="handlerCloseDialog" class="wangEditorDialog" :title="props.title" width="60%">
    <div class="wang-editor-container">
      <toolbar :default-config="toolbarConfig" :editor="editorRef" style="border-bottom: 1px solid var(--el-border-color)" />
      <editor v-model="html" class="wang-editor-content" :default-config="editorConfig" @click="handleClick" @on-created="handleCreated" />
    </div>
    <template #footer>
      <span>
        <el-button @click="insertDate">插入日期</el-button>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="handleConfirmDialog">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { removeHtmlTags } from '~/src/utils/tableColum'
import { removeLocalStorage, setLocalStorage } from '/@/utils/localStorage'

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

    // 当对话框打开时，检查缓存内容
    if (newValue) {
      const key = props.progressId ? `${props.classify}_${props.progressId}` : props.classify
      const tempContent = localStorage.getItem(key)

      // 判断逻辑：
      // 1. 有缓存内容
      // 2. 去掉HTML标签后不为空
      // 满足以上条件则使用缓存，否则使用后端返回的内容
      const cleanContent = removeHtmlTags(tempContent || '')
      const finalContent = cleanContent.replace(/\s/g, '')

      // console.log('原始缓存内容:', tempContent)
      // console.log('removeHtmlTags后:', cleanContent)
      // console.log('去掉空白后:', finalContent)
      // console.log('去掉空白后长度:', finalContent.length)

      if (tempContent && finalContent !== '') {
        // console.log('使用缓存内容:', tempContent)
        html.value = tempContent
      } else {
        // console.log('使用后端内容:', content.value)
        html.value = content.value || ''
      }
    }
  },
  { immediate: true }
)

const editorConfig = reactive<any>({
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: '', // 您的服务器地址，注意：当前接口格式特殊与其他vab接口不同，请查看vip文档
      fieldName: 'vab-file-name',
      allowedFileTypes: ['image/*'],
      headers: {}, // 如需传递token请写到在这里
    },
  },
})
const toolbarConfig: Partial<IToolbarConfig> = {
  // TS 语法
  excludeKeys: ['group-video', 'codeBlock'],
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
    setLocalStorage(key, html.value)
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
/**
 * 当确认对话框的时候
 */
const handleConfirmDialog = () => {
  if (!editorRef.value) return
  emit('clickChild', editorRef.value.getHtml())
  emit('clickBoolean', false)
  $baseMessage(`${props.title}保存成功`, 'success', 'hey')
  dflag.value = false
  clearTimer()
  const key = props.progressId ? `${props.classify}_${props.progressId}` : props.classify
  removeLocalStorage(key)
}

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}
onBeforeUnmount(() => {
  clearTimer()
  const editor = editorRef.value
  if (editor) editor.destroy()
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
</style>
