<template>
  <el-dialog
    :title="props.title"
    v-model="dflag"
    width="60%"
    :close-on-click-modal="false"
    :before-close = "handlerCloseDialog"
    class="wangEditorDialog"
  >
    <div class="wang-editor-container" >
      <toolbar :editor="editorRef" style="border-bottom: 1px solid var(--el-border-color)" :defaultConfig="toolbarConfig"/>
      <editor v-model="html" class="wang-editor-content" :default-config="editorConfig" @on-created="handleCreated" @click="handleClick"/>
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
import type { IDomEditor } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { removeLocalStorage, setLocalStorage } from '/@/utils/localStorage'
import { IToolbarConfig } from '@wangeditor/editor'

defineOptions({
  name: 'WangEditor',
})

let props = defineProps<{
  title: string
  wangEditorVisible: boolean
  content: string | undefined
  classify: string
}>();

let { content } = toRefs(props)

const dflag = ref<boolean>(false)
watchEffect(()=>{
    dflag.value = props.wangEditorVisible
  }
)

// 如果 content 改变，更新 html
watch(() => content.value, (newValue) => {
  html.value = newValue
})

const editorRef = shallowRef<IDomEditor | undefined>()
const html = ref<any>(
  content.value
  // '<h1>一级标题</h1><h2>二级标题</h2><h3>三级标题</h3><p>hello world ~~~ </p><blockquote>blockquote</blockquote><pre><code class="language-javascript">const a = 100;</code></pre><p><img src="https://gcore.jsdelivr.net/gh/zxwk1998/image/table/vab-image-1.jpg"/></p>'
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
}
)
const toolbarConfig: Partial<IToolbarConfig> = {  // TS 语法
  excludeKeys: ['group-video','codeBlock',]
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

  editor.insertText(formattedDate) // 插入文本
}
// 初始化定时器
let intervalTimerLog: NodeJS.Timeout | null = null
/**
 * 清除定时器
 */
const clearTimer = () => {
  if (intervalTimerLog !== null ) {
    clearInterval(intervalTimerLog);
    intervalTimerLog = null;
  }
}
/**
 * 当 onChange的时候，触发定时器
 */
const handleClick = () => {
  clearTimer() // 确保在设置新定时器之前清除旧定时器
  
  intervalTimerLog = setInterval(() => {
    setLocalStorage(props.classify, html.value)
    // console.log(props.classify, html.value);
  }, 2000);

}

const emit = defineEmits(['clickChild', 'clickBoolean'])
// 通过事件,修改父元素的值
const handlerCloseDialog = () =>{
  clearTimer()
  removeLocalStorage(props.classify)
  emit('clickBoolean', false)
  dflag.value = false
}
/**
 * 当取消对话框时
 */
const handleCloseDialog = () => {
  clearTimer()
  removeLocalStorage('progressLog')
  emit('clickBoolean', false)
  dflag.value = false
}
/**
 * 当确认对话框的时候
 */
 const handleConfirmDialog = () => {
  if(!editorRef.value) return
  emit('clickChild', editorRef.value.getHtml())
  emit('clickBoolean', false)
  if (props.classify === 'progressLog') {
    $baseMessage('日志保存成功', 'success', 'hey')
  }
  else {
    $baseMessage('备注保存成功', 'success', 'hey')
  }
  dflag.value = false
  clearTimer()
  removeLocalStorage(props.classify)
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
  width: 55%;
  margin: 8vh auto 5vh;
  height: 87vh;
  display: flex;
  flex-direction: column;

  .el-dialog__body {
    flex: 1 1 auto; // 中间自适应
    display: flex; // 控制 container 垂直居中
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
        background-color: var(--el-color-white);
        border: 0;
        overflow: auto;
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
